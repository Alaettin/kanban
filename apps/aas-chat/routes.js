const path = require("path");
const crypto = require("crypto");
const db = require("../../shared/db");
const auth = require("../../shared/auth");

// ---------------------------------------------------------------------------
// DB init
// ---------------------------------------------------------------------------
async function initAasChatTables() {
  await db.run(`CREATE TABLE IF NOT EXISTS aas_chat_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT NOT NULL,
    role       TEXT NOT NULL DEFAULT 'user',
    content    TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  await db.run(`CREATE TABLE IF NOT EXISTS aas_chat_settings (
    user_id       TEXT PRIMARY KEY,
    provider      TEXT NOT NULL DEFAULT 'groq',
    model         TEXT NOT NULL DEFAULT 'llama-3.1-8b-instant',
    api_key       TEXT NOT NULL DEFAULT '',
    aas_url       TEXT NOT NULL DEFAULT '',
    system_prompt TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add system_prompt column if missing (existing DBs)
  try {
    await db.run(`ALTER TABLE aas_chat_settings ADD COLUMN system_prompt TEXT NOT NULL DEFAULT ''`);
  } catch { /* column already exists */ }

  // Migration: add tool_log column for MCP timeline persistence
  try {
    await db.run(`ALTER TABLE aas_chat_messages ADD COLUMN tool_log TEXT DEFAULT NULL`);
  } catch { /* column already exists */ }

  // Migration: add active_connector_id for DTI connector integration
  try {
    await db.run(`ALTER TABLE aas_chat_settings ADD COLUMN active_connector_id TEXT DEFAULT NULL`);
  } catch { /* column already exists */ }

  // Migration: add enabled_mcps (JSON array of enabled MCP server keys, default: all)
  try {
    await db.run(`ALTER TABLE aas_chat_settings ADD COLUMN enabled_mcps TEXT NOT NULL DEFAULT '["aas","dti"]'`);
  } catch { /* column already exists */ }

  // Migration: add base_prompt (user-editable base prompt, empty = use default)
  try {
    await db.run(`ALTER TABLE aas_chat_settings ADD COLUMN base_prompt TEXT NOT NULL DEFAULT ''`);
  } catch { /* column already exists */ }

  // --- Multi-Chat support ---
  await db.run(`CREATE TABLE IF NOT EXISTS aas_chat_conversations (
    chat_id              TEXT PRIMARY KEY,
    user_id              TEXT NOT NULL,
    title                TEXT NOT NULL DEFAULT 'Neuer Chat',
    active_connector_id  TEXT DEFAULT NULL,
    created_at           TEXT DEFAULT (datetime('now')),
    updated_at           TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Migration: add chat_id column to messages
  try {
    await db.run(`ALTER TABLE aas_chat_messages ADD COLUMN chat_id TEXT DEFAULT NULL`);
  } catch { /* column already exists */ }

  // Migration: assign orphaned messages (no chat_id) to a default chat per user
  const orphanUsers = await db.all(
    `SELECT DISTINCT user_id FROM aas_chat_messages WHERE chat_id IS NULL`
  );
  for (const { user_id } of orphanUsers) {
    const chatId = crypto.randomUUID();
    const settings = await db.get(
      `SELECT active_connector_id FROM aas_chat_settings WHERE user_id = ?`, [user_id]
    );
    await db.run(
      `INSERT INTO aas_chat_conversations (chat_id, user_id, title, active_connector_id)
       VALUES (?, ?, 'Chat', ?)`,
      [chatId, user_id, settings?.active_connector_id || null]
    );
    await db.run(
      `UPDATE aas_chat_messages SET chat_id = ? WHERE user_id = ? AND chat_id IS NULL`,
      [chatId, user_id]
    );
  }
}

// ---------------------------------------------------------------------------
// System prompts
// ---------------------------------------------------------------------------
const SYSTEM_PROMPT =
  "Du bist ein hilfreicher Assistent für Fragen rund um die Verwaltungsschale (Asset Administration Shell / AAS). " +
  "Antworte klar und präzise. Wenn du etwas nicht weißt, sage es ehrlich.";

const BASE_SYSTEM_PROMPT =
  "Du bist ein hilfreicher Assistent für Fragen rund um die Verwaltungsschale (Asset Administration Shell / AAS). " +
  "Antworte klar und präzise. Wenn du etwas nicht weißt, sage es ehrlich.";

function buildSystemPrompt(baseOverride, aasInstructions, dtiInstructions, mcpResources, mcpPrompts, kbInstructions) {
  let prompt = baseOverride || BASE_SYSTEM_PROMPT;
  if (aasInstructions) prompt += "\n\n" + aasInstructions;
  if (dtiInstructions) prompt += "\n\n" + dtiInstructions;
  if (kbInstructions) prompt += "\n\n" + kbInstructions;
  if (mcpResources.length > 0) {
    prompt += "\n\nVERFÜGBARE MCP-RESSOURCEN:\n";
    for (const r of mcpResources) {
      prompt += `- ${r.name || r.uri}${r.description ? ": " + r.description : ""}\n`;
    }
  }
  if (mcpPrompts.length > 0) {
    prompt += "\n\nVERFÜGBARE MCP-PROMPTS:\n";
    for (const p of mcpPrompts) {
      prompt += `- ${p.name}${p.description ? ": " + p.description : ""}\n`;
    }
  }
  return prompt;
}

// DTI tool names — used to identify DTI tools in tool results (for connector panel log)
const DTI_TOOL_NAMES = new Set([
  "listConnectors", "connectConnector", "disconnectConnector", "createConnector",
  "getHierarchyLevels", "setHierarchyLevels",
  "getModelDatapoints", "setModelDatapoints", "addModelDatapoint", "editModelDatapoint", "removeModelDatapoint",
  "listAssets", "createAsset", "deleteAsset", "renameAsset", "getAssetValues", "setAssetValues", "updateAssetValues",
]);

const KB_TOOL_NAMES = new Set(["listDocuments", "readDocument"]);

// ---------------------------------------------------------------------------
// Continuation store — allows extending beyond MAX_ROUNDS per user request
// ---------------------------------------------------------------------------
const continuationStore = new Map();
const CONTINUATION_TTL = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of continuationStore) {
    if (now - v.timestamp > CONTINUATION_TTL) continuationStore.delete(k);
  }
}, 60 * 1000);

// ---------------------------------------------------------------------------
// LoggingTransport — intercepts real JSON-RPC messages on the wire
// Wraps StdioClientTransport so the Developer Console can show raw messages
// ---------------------------------------------------------------------------
class LoggingTransport {
  constructor(innerTransport, serverLabel) {
    this._inner = innerTransport;
    this._log = null;
    this._serverLabel = serverLabel || "MCP";
    this._pending = new Map();
  }

  setLog(log) { this._log = log; }

  set onmessage(cb) {
    this._cb = cb;
    this._inner.onmessage = (message, extra) => {
      this._logReceived(message);
      cb?.(message, extra);
    };
  }
  get onmessage() { return this._cb; }
  set onerror(cb) { this._inner.onerror = cb; }
  get onerror() { return this._inner.onerror; }
  set onclose(cb) { this._inner.onclose = cb; }
  get onclose() { return this._inner.onclose; }
  get sessionId() { return this._inner.sessionId; }
  async start() { return this._inner.start(); }
  async close() { return this._inner.close(); }

  async send(message, options) {
    if (message.id !== undefined && message.method) {
      this._pending.set(message.id, message);
    }
    if (this._log) {
      let label = `Client → MCP (${this._serverLabel}): ${message.method || "?"}`;
      if (message.method === "tools/call") label += ` (${message.params?.name || "?"})`;
      this._log.push({ type: "raw_jsonrpc", direction: "sent", label, json: message });
    }
    return this._inner.send(message, options);
  }

  _logReceived(message) {
    if (message.result?.serverInfo?.name) {
      this._serverLabel = message.result.serverInfo.name;
    }
    if (!this._log) return;
    let label;
    if (message.id !== undefined && this._pending.has(message.id)) {
      const req = this._pending.get(message.id);
      this._pending.delete(message.id);
      label = `MCP (${this._serverLabel}) → Client: ${req.method} result`;
      if (req.method === "tools/call") label += ` (${req.params?.name || "?"})`;
    } else if (message.method) {
      label = `MCP (${this._serverLabel}) → Client: ${message.method}`;
    } else {
      label = `MCP (${this._serverLabel}) → Client: response`;
    }
    this._log.push({ type: "raw_jsonrpc", direction: "received", label, json: message });
  }
}

// ---------------------------------------------------------------------------
// DTI Connector MCP Client — pooled per user+connectorId+role
// Spawns apps/dti-connector/mcp-server.mjs as child process
// ---------------------------------------------------------------------------
const dtiMcpClientPool = new Map();
const DTI_POOL_TTL = 10 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of dtiMcpClientPool) {
    if (now - entry.lastUsed > DTI_POOL_TTL) {
      console.log("[DTI MCP Pool] Closing idle client:", key);
      try { entry.client.close(); } catch {}
      dtiMcpClientPool.delete(key);
    }
  }
}, 60 * 1000);

async function getPooledDtiMcpClient(userId, connectorId, role, log) {
  const poolKey = `dti:${userId}:${connectorId || "none"}:${role || "none"}`;
  const existing = dtiMcpClientPool.get(poolKey);
  if (existing) {
    existing.lastUsed = Date.now();
    if (existing.loggingTransport) existing.loggingTransport.setLog(log);
    if (log) log.push({ type: "console", direction: "received", label: "MCP (dti-connector): pooled connection reused", json: { poolKey, tools: existing.tools.map(t => t.name) } });
    return existing;
  }

  const { Client, StdioClientTransport } = await getMcpSdk();
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "../dti-connector/mcp-server.mjs")],
    env: {
      ...process.env,
      DTI_USER_ID: userId,
      DTI_CONNECTOR_ID: connectorId || "",
      DTI_ROLE: role || "",
    },
  });
  const loggingTransport = new LoggingTransport(transport, "dti-connector");
  if (log) loggingTransport.setLog(log);

  const clientInfo = { name: "aas-chat-dti-client", version: "1.0.0" };
  const client = new Client(clientInfo);

  if (log) log.push({ type: "console", direction: "sent", label: "Client → MCP: initialize", json: { jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", clientInfo, capabilities: { tools: {} } } } });
  await client.connect(loggingTransport);
  const serverCaps = client.getServerCapabilities?.() || {};
  const serverInfo = client.getServerVersion?.() || {};
  const instructions = client.getInstructions?.() || "";
  const srvName = serverInfo.name || "dti-connector";
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: initialize result`, json: { protocolVersion: "2024-11-05", serverInfo, capabilities: serverCaps, instructions: instructions || undefined } });
  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): initialized`, json: { jsonrpc: "2.0", method: "notifications/initialized", params: {} } });

  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): tools/list`, json: { jsonrpc: "2.0", method: "tools/list", params: {} } });
  const { tools } = await client.listTools();
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: tools/list result`, json: { tools } });

  const entry = { client, loggingTransport, lastUsed: Date.now(), tools, connectorId, role, instructions };
  dtiMcpClientPool.set(poolKey, entry);
  console.log("[DTI MCP Pool] Created client:", poolKey, `(${tools.length} tools)`);
  return entry;
}

function closeDtiMcpPool(userId) {
  for (const [key, entry] of dtiMcpClientPool) {
    if (key.startsWith(`dti:${userId}:`)) {
      try { entry.client.close(); } catch {}
      dtiMcpClientPool.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// KB MCP Client Pool — pooled per user
// ---------------------------------------------------------------------------
const kbMcpClientPool = new Map();
const KB_POOL_TTL = 10 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of kbMcpClientPool) {
    if (now - entry.lastUsed > KB_POOL_TTL) {
      console.log("[KB MCP Pool] Closing idle client:", key);
      try { entry.client.close(); } catch {}
      kbMcpClientPool.delete(key);
    }
  }
}, 60 * 1000);

async function getPooledKbMcpClient(userId, basePrompt, log) {
  const poolKey = `kb:${userId}`;
  const existing = kbMcpClientPool.get(poolKey);
  if (existing) {
    existing.lastUsed = Date.now();
    if (existing.loggingTransport) existing.loggingTransport.setLog(log);
    if (log) log.push({ type: "console", direction: "received", label: "MCP (knowledge-base): pooled connection reused", json: { poolKey, tools: existing.tools.map(t => t.name) } });
    return existing;
  }

  const { Client, StdioClientTransport } = await getMcpSdk();
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "../knowledge-base/mcp-server.mjs")],
    env: {
      ...process.env,
      KB_USER_ID: userId,
      KB_BASE_PROMPT: basePrompt || "",
    },
  });
  const loggingTransport = new LoggingTransport(transport, "knowledge-base");
  if (log) loggingTransport.setLog(log);

  const clientInfo = { name: "aas-chat-kb-client", version: "1.0.0" };
  const client = new Client(clientInfo);

  if (log) log.push({ type: "console", direction: "sent", label: "Client → MCP: initialize", json: { jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", clientInfo, capabilities: { tools: {} } } } });
  await client.connect(loggingTransport);
  const serverCaps = client.getServerCapabilities?.() || {};
  const serverInfo = client.getServerVersion?.() || {};
  const instructions = client.getInstructions?.() || "";
  const srvName = serverInfo.name || "knowledge-base";
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: initialize result`, json: { protocolVersion: "2024-11-05", serverInfo, capabilities: serverCaps, instructions: instructions || undefined } });
  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): initialized`, json: { jsonrpc: "2.0", method: "notifications/initialized", params: {} } });

  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): tools/list`, json: { jsonrpc: "2.0", method: "tools/list", params: {} } });
  const { tools } = await client.listTools();
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: tools/list result`, json: { tools } });

  const entry = { client, loggingTransport, lastUsed: Date.now(), tools, instructions };
  kbMcpClientPool.set(poolKey, entry);
  console.log("[KB MCP Pool] Created client:", poolKey, `(${tools.length} tools)`);
  return entry;
}

function closeKbMcpPool(userId) {
  const key = `kb:${userId}`;
  const entry = kbMcpClientPool.get(key);
  if (entry) {
    try { entry.client.close(); } catch {}
    kbMcpClientPool.delete(key);
  }
}

// Extract __connectorEvent from MCP tool result text
function extractConnectorEvent(text) {
  const match = text.match(/\n(\{"__connectorEvent":\{.+\}\})$/);
  if (!match) return { cleanText: text, event: null };
  try {
    const parsed = JSON.parse(match[1]);
    return { cleanText: text.slice(0, match.index), event: parsed.__connectorEvent };
  } catch {
    return { cleanText: text, event: null };
  }
}

let _mcpSdk = null;
async function getMcpSdk() {
  if (!_mcpSdk) {
    const [clientMod, transportMod] = await Promise.all([
      import("@modelcontextprotocol/sdk/client/index.js"),
      import("@modelcontextprotocol/sdk/client/stdio.js"),
    ]);
    _mcpSdk = {
      Client: clientMod.Client,
      StdioClientTransport: transportMod.StdioClientTransport,
    };
  }
  return _mcpSdk;
}

// Pool: Map<"userId:aasUrl", { client, aasUrl, lastUsed, tools, resources, prompts }>
const mcpClientPool = new Map();
const MCP_POOL_TTL = 10 * 60 * 1000; // 10 minutes idle → close
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of mcpClientPool) {
    if (now - entry.lastUsed > MCP_POOL_TTL) {
      console.log("[MCP Pool] Closing idle client:", key);
      try { entry.client.close(); } catch {}
      mcpClientPool.delete(key);
    }
  }
}, 60 * 1000);

async function getPooledMcpClient(userId, aasUrl, log) {
  const poolKey = `${userId}:${aasUrl}`;
  const existing = mcpClientPool.get(poolKey);
  if (existing) {
    existing.lastUsed = Date.now();
    if (existing.loggingTransport) existing.loggingTransport.setLog(log);
    if (log) log.push({ type: "console", direction: "received", label: "MCP (aas-repository): pooled connection reused", json: { poolKey, tools: existing.tools.map(t => t.name), resources: existing.resources.map(r => r.name || r.uri), prompts: existing.prompts.map(p => p.name) } });
    return existing;
  }
  // Create new client
  const { Client, StdioClientTransport } = await getMcpSdk();
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "mcp-server.mjs")],
    env: { ...process.env, AAS_BASE_URL: aasUrl },
  });
  const loggingTransport = new LoggingTransport(transport, "aas-repository");
  if (log) loggingTransport.setLog(log);

  const clientInfo = { name: "aas-chat-backend", version: "1.0.0" };
  const client = new Client(clientInfo);

  // Step 1: initialize request
  if (log) log.push({ type: "console", direction: "sent", label: "Client → MCP: initialize", json: { jsonrpc: "2.0", method: "initialize", params: { protocolVersion: "2024-11-05", clientInfo, capabilities: { tools: {} } } } });
  await client.connect(loggingTransport);
  // Step 2: initialize response (server capabilities + instructions)
  const serverCaps = client.getServerCapabilities?.() || {};
  const serverInfo = client.getServerVersion?.() || {};
  const instructions = client.getInstructions?.() || "";
  const srvName = serverInfo.name || "MCP";
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: initialize result`, json: { protocolVersion: "2024-11-05", serverInfo, capabilities: serverCaps, instructions: instructions || undefined } });

  // Step 3: initialized notification
  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): initialized`, json: { jsonrpc: "2.0", method: "notifications/initialized", params: {} } });

  // Step 4: fetch tools, resources, prompts
  if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): tools/list`, json: { jsonrpc: "2.0", method: "tools/list", params: {} } });
  const { tools } = await client.listTools();
  if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: tools/list result`, json: { tools } });

  let resources = [];
  let prompts = [];
  if (serverCaps.resources) {
    try {
      if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): resources/list`, json: { jsonrpc: "2.0", method: "resources/list", params: {} } });
      resources = (await client.listResources()).resources || [];
      if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: resources/list result`, json: { resources } });
    } catch {}
  }
  if (serverCaps.prompts) {
    try {
      if (log) log.push({ type: "console", direction: "sent", label: `Client → MCP (${srvName}): prompts/list`, json: { jsonrpc: "2.0", method: "prompts/list", params: {} } });
      prompts = (await client.listPrompts()).prompts || [];
      if (log) log.push({ type: "console", direction: "received", label: `MCP (${srvName}) → Client: prompts/list result`, json: { prompts } });
    } catch {}
  }

  const entry = { client, loggingTransport, aasUrl, lastUsed: Date.now(), tools, resources, prompts, instructions };
  mcpClientPool.set(poolKey, entry);
  console.log("[MCP Pool] Created client:", poolKey, `(${tools.length} tools, ${resources.length} resources, ${prompts.length} prompts)`);
  return entry;
}

// Close a specific user's pooled client (e.g. when settings change)
function closeMcpPoolEntry(userId, aasUrl) {
  const poolKey = `${userId}:${aasUrl}`;
  const entry = mcpClientPool.get(poolKey);
  if (entry) {
    try { entry.client.close(); } catch {}
    mcpClientPool.delete(poolKey);
  }
}

// Legacy: one-off client for the /api/mcp-tools endpoint (no pool)
async function createMcpClient(aasUrl) {
  const { Client, StdioClientTransport } = await getMcpSdk();
  const transport = new StdioClientTransport({
    command: "node",
    args: [path.join(__dirname, "mcp-server.mjs")],
    env: { ...process.env, AAS_BASE_URL: aasUrl },
  });
  const client = new Client({ name: "aas-chat-backend", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

// ---------------------------------------------------------------------------
// MCP Tools → LLM format converters
// ---------------------------------------------------------------------------
function cleanSchemaForGemini(schema) {
  if (!schema || typeof schema !== "object") return schema;
  const { $schema, additionalProperties, ...rest } = schema;
  if (rest.properties) {
    const cleaned = {};
    for (const [k, v] of Object.entries(rest.properties)) {
      cleaned[k] = cleanSchemaForGemini(v);
    }
    rest.properties = cleaned;
  }
  if (rest.items) {
    rest.items = cleanSchemaForGemini(rest.items);
  }
  return rest;
}

function mcpToolsToGemini(tools) {
  return [{
    functionDeclarations: tools.map((t) => ({
      name: t.name,
      description: t.description,
      parameters: cleanSchemaForGemini(t.inputSchema),
    })),
  }];
}

function mcpToolsToGroq(tools) {
  return tools.map((t) => ({
    type: "function",
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));
}

// ---------------------------------------------------------------------------
// MCP content extraction — handles text, image, resource types
// ---------------------------------------------------------------------------
function extractMcpContent(mcpResult) {
  if (!mcpResult?.content?.length) return "";
  const parts = [];
  for (const c of mcpResult.content) {
    if (c.type === "text") {
      parts.push(c.text || "");
    } else if (c.type === "image") {
      parts.push(`[Bild: ${c.mimeType || "image"}, ${c.data ? Math.round(c.data.length * 0.75) + " Bytes" : ""}]`);
    } else if (c.type === "resource") {
      if (c.resource?.text) {
        parts.push(c.resource.text);
      } else if (c.resource?.blob) {
        parts.push(`[Resource: ${c.resource.uri || "?"}, ${c.resource.mimeType || "binary"}]`);
      } else {
        parts.push(`[Resource: ${c.resource?.uri || "?"}]`);
      }
    } else {
      parts.push(`[${c.type || "unknown"}]`);
    }
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Groq API — simple call (no tools)
// ---------------------------------------------------------------------------
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(apiKey, model, chatHistory) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "llama-3.1-8b-instant",
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    const status = response.status;
    if (status === 401) throw new Error("API_KEY_INVALID");
    if (status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`GROQ_ERROR_${status}: ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// ---------------------------------------------------------------------------
// Groq API — with MCP tools (function calling loop)
// ---------------------------------------------------------------------------
async function chatGroqWithTools(apiKey, model, chatHistory, allTools, mcpClients, log, systemPrompt, userId, continueState) {
  const MAX_ROUNDS = 10;
  let latestConnectorEvent = null;

  const messages = continueState || [
    { role: "system", content: systemPrompt },
    ...chatHistory.map((m) => ({ role: m.role, content: m.content })),
  ];

  const tools = mcpToolsToGroq(allTools);

  for (let round = 0; round < MAX_ROUNDS; round++) {
    log.push({ type: "llm_request", provider: "groq", model, round });

    const reqPayload = {
      model: model || "llama-3.1-8b-instant",
      messages,
      max_tokens: 2048,
      temperature: 0.7,
      tools,
    };
    log.push({ type: "console", direction: "sent", label: "Client → LLM (Groq)", json: reqPayload });
    log.push({ type: "raw_jsonrpc", direction: "sent", label: "Client → LLM (Groq): chat/completions", json: reqPayload });

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(reqPayload),
    });

    if (!response.ok) {
      const err = await response.text();
      const status = response.status;
      if (status === 401) throw new Error("API_KEY_INVALID");
      if (status === 429) throw new Error("RATE_LIMIT");
      throw new Error(`GROQ_ERROR_${status}: ${err}`);
    }

    const data = await response.json();
    log.push({ type: "console", direction: "received", label: "LLM (Groq) → Client", json: data });
    log.push({ type: "raw_jsonrpc", direction: "received", label: "LLM (Groq) → Client: chat/completions result", json: data });
    const usage = data.usage;
    if (usage) {
      log.push({ type: "llm_usage", provider: "groq", promptTokens: usage.prompt_tokens, completionTokens: usage.completion_tokens, totalTokens: usage.total_tokens });
    }
    const choice = data.choices?.[0];
    const msg = choice?.message;

    if (msg?.tool_calls?.length) {
      messages.push({
        role: "assistant",
        content: msg.content || null,
        tool_calls: msg.tool_calls,
      });

      for (const tc of msg.tool_calls) {
        const fnName = tc.function?.name;
        let fnArgs = {};
        try { fnArgs = JSON.parse(tc.function?.arguments || "{}"); } catch {}

        const toolSource = DTI_TOOL_NAMES.has(fnName) ? "dti" : KB_TOOL_NAMES.has(fnName) ? "kb" : "aas";
        const mcpLabel = toolSource === "dti" ? "MCP (dti-connector)" : toolSource === "kb" ? "MCP (knowledge-base)" : "MCP (aas-repository)";
        log.push({ type: "tool_call", tool: fnName, args: fnArgs, source: toolSource });

        let resultText;
        try {
          const targetClient = toolSource === "dti" ? mcpClients.dti : toolSource === "kb" ? mcpClients.kb : mcpClients.aas;
          if (targetClient) {
            const mcpCallPayload = { name: fnName, arguments: fnArgs };
            log.push({ type: "console", direction: "sent", label: `Client → ${mcpLabel}: tools/call (${fnName})`, json: { jsonrpc: "2.0", method: "tools/call", params: mcpCallPayload } });
            const mcpResult = await targetClient.callTool(mcpCallPayload);
            log.push({ type: "console", direction: "received", label: `${mcpLabel} → Client: tools/call result (${fnName})`, json: mcpResult });
            resultText = extractMcpContent(mcpResult);
            const { cleanText, event } = extractConnectorEvent(resultText);
            resultText = cleanText;
            if (event) latestConnectorEvent = event;
          } else {
            resultText = `Fehler: Tool "${fnName}" ist nicht verfügbar.`;
          }
        } catch (e) {
          resultText = `Fehler beim Tool-Aufruf: ${e.message}`;
        }

        const toolResultEntry = { type: "tool_result", tool: fnName, result: resultText.slice(0, 500), source: toolSource };
        if (fnName === "getThumbnail") {
          const urlMatch = resultText.match(/URL:\s*(\S+)/);
          if (urlMatch) toolResultEntry.imageUrl = urlMatch[1];
        }
        log.push(toolResultEntry);

        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: resultText,
        });
      }

      continue;
    }

    const reply = msg?.content || "";
    log.push({ type: "llm_response", text: reply.slice(0, 200) });
    return { reply, connectorEvent: latestConnectorEvent };
  }

  return {
    reply: "Ich habe 10 Tool-Aufrufe durchgeführt. Möchtest du weitermachen?",
    connectorEvent: latestConnectorEvent,
    continuationState: { provider: "groq", messages },
  };
}

// ---------------------------------------------------------------------------
// Google Gemini API — simple call (no tools)
// ---------------------------------------------------------------------------
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(apiKey, model, chatHistory, useSearch = true) {
  const contents = chatHistory.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `${GEMINI_BASE}/${model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents,
    generationConfig: {
      maxOutputTokens: 65536,
      temperature: 0.7,
    },
  };
  if (useSearch) {
    body.tools = [{ google_search: {} }];
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    const status = response.status;
    console.error("[AAS Chat] Gemini error %d:", status, err.slice(0, 300));

    if (useSearch && (status === 429 || status === 400)) {
      // google_search failed, retry without search
      return callGemini(apiKey, model, chatHistory, false);
    }

    if (status === 400 && err.includes("API_KEY_INVALID")) throw new Error("API_KEY_INVALID");
    if (status === 403) throw new Error("API_KEY_INVALID");
    if (status === 429) throw new Error("RATE_LIMIT");
    throw new Error(`GEMINI_ERROR_${status}: ${err.slice(0, 200)}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  if (!reply) {
    console.warn("[AAS Chat] Gemini empty reply");
  }
  return reply;
}

// ---------------------------------------------------------------------------
// Google Gemini API — with MCP tools (function calling loop)
// ---------------------------------------------------------------------------
function handleGeminiError(status, errText) {
  if (status === 400 && errText.includes("API_KEY_INVALID")) throw new Error("API_KEY_INVALID");
  if (status === 403) throw new Error("API_KEY_INVALID");
  if (status === 429) throw new Error("RATE_LIMIT");
  throw new Error(`GEMINI_ERROR_${status}: ${errText.slice(0, 200)}`);
}

async function chatGeminiWithTools(apiKey, model, chatHistory, allTools, mcpClients, log, systemPrompt, userId, continueState) {
  const MAX_ROUNDS = 10;
  let latestConnectorEvent = null;

  const contents = continueState || chatHistory.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // NOTE: google_search + functionDeclarations cannot be combined in generateContent
  // (multi-tool with native tools is Live API-only). Google Search works in callGemini (no-tools path).
  const geminiTools = mcpToolsToGemini(allTools);

  const url = `${GEMINI_BASE}/${model || "gemini-2.5-flash"}:generateContent?key=${apiKey}`;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    log.push({ type: "llm_request", provider: "gemini", model, round });

    const reqBody = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 65536, temperature: 0.7 },
      tools: geminiTools,
    };
    log.push({ type: "console", direction: "sent", label: "Client → LLM (Gemini)", json: reqBody });
    log.push({ type: "raw_jsonrpc", direction: "sent", label: "Client → LLM (Gemini): generateContent", json: reqBody });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
    });

    if (!response.ok) {
      const err = await response.text();
      const status = response.status;
      console.error("[AAS Chat] Gemini error %d:", status, err.slice(0, 300));
      handleGeminiError(status, err);
    }

    const data = await response.json();
    log.push({ type: "console", direction: "received", label: "LLM (Gemini) → Client", json: data });
    log.push({ type: "raw_jsonrpc", direction: "received", label: "LLM (Gemini) → Client: generateContent result", json: data });
    const gUsage = data.usageMetadata;
    if (gUsage) {
      log.push({ type: "llm_usage", provider: "gemini", promptTokens: gUsage.promptTokenCount, completionTokens: gUsage.candidatesTokenCount || 0, totalTokens: gUsage.totalTokenCount });
    }
    const candidate = data.candidates?.[0];
    const finishReason = candidate?.finishReason || "";
    let parts = candidate?.content?.parts || [];

    // Log blocked or unusual finish reasons
    if (finishReason && finishReason !== "STOP" && finishReason !== "MAX_TOKENS") {
      console.warn("[AAS Chat] Gemini finishReason:", finishReason, "blockReason:", data.promptFeedback?.blockReason);
      console.warn("[AAS Chat] Gemini raw candidate:", JSON.stringify(candidate).slice(0, 1000));
      log.push({ type: "llm_blocked", finishReason, blockReason: data.promptFeedback?.blockReason || null });
    }

    // MALFORMED_FUNCTION_CALL: Gemini tried to call a tool but generated broken JSON.
    // Increase maxOutputTokens and retry once to give it more space.
    if (finishReason === "MALFORMED_FUNCTION_CALL" && round === 0) {
      log.push({ type: "llm_retry", reason: "MALFORMED_FUNCTION_CALL" });
      const retryBody = { ...reqBody, generationConfig: { ...reqBody.generationConfig, maxOutputTokens: 65536 } };
      const retry = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(retryBody),
      });
      if (retry.ok) {
        const retryData = await retry.json();
        const retryUsage = retryData.usageMetadata;
        if (retryUsage) {
          log.push({ type: "llm_usage", provider: "gemini", promptTokens: retryUsage.promptTokenCount, completionTokens: retryUsage.candidatesTokenCount || 0, totalTokens: retryUsage.totalTokenCount, retry: true });
        }
        const retryCandidate = retryData.candidates?.[0];
        if (retryCandidate?.content?.parts?.length > 0) {
          parts = retryCandidate.content.parts;
        }
      }
    }

    // Gemini 2.5 Flash can return empty responses — retry once
    if (parts.length === 0 && round === 0 && finishReason !== "MALFORMED_FUNCTION_CALL") {
      // Gemini empty parts — retry once
      const retry = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      if (retry.ok) {
        const retryData = await retry.json();
        const retryUsage = retryData.usageMetadata;
        if (retryUsage) {
          log.push({ type: "llm_usage", provider: "gemini", promptTokens: retryUsage.promptTokenCount, completionTokens: retryUsage.candidatesTokenCount || 0, totalTokens: retryUsage.totalTokenCount, retry: true });
        }
        parts = retryData.candidates?.[0]?.content?.parts || [];
      }
    }

    const funcCalls = parts.filter((p) => p.functionCall);
    if (funcCalls.length > 0) {
      // Push all function calls from model in one message
      contents.push({
        role: "model",
        parts: funcCalls.map((fc) => ({ functionCall: { name: fc.functionCall.name, args: fc.functionCall.args || {} } })),
      });

      // Execute each tool call and collect responses
      const responseParts = [];
      for (const fc of funcCalls) {
        const { name, args } = fc.functionCall;
        const toolSource = DTI_TOOL_NAMES.has(name) ? "dti" : KB_TOOL_NAMES.has(name) ? "kb" : "aas";
        const mcpLabel = toolSource === "dti" ? "MCP (dti-connector)" : toolSource === "kb" ? "MCP (knowledge-base)" : "MCP (aas-repository)";
        log.push({ type: "tool_call", tool: name, args: args || {}, source: toolSource });

        let resultText;
        try {
          const targetClient = toolSource === "dti" ? mcpClients.dti : toolSource === "kb" ? mcpClients.kb : mcpClients.aas;
          if (targetClient) {
            const mcpCallPayload = { name, arguments: args || {} };
            log.push({ type: "console", direction: "sent", label: `Client → ${mcpLabel}: tools/call (${name})`, json: { jsonrpc: "2.0", method: "tools/call", params: mcpCallPayload } });
            const mcpResult = await targetClient.callTool(mcpCallPayload);
            log.push({ type: "console", direction: "received", label: `${mcpLabel} → Client: tools/call result (${name})`, json: mcpResult });
            resultText = extractMcpContent(mcpResult);
            const { cleanText, event } = extractConnectorEvent(resultText);
            resultText = cleanText;
            if (event) latestConnectorEvent = event;
          } else {
            resultText = `Fehler: Tool "${name}" ist nicht verfügbar.`;
          }
        } catch (e) {
          resultText = `Fehler beim Tool-Aufruf: ${e.message}`;
        }

        const toolResultEntry = { type: "tool_result", tool: name, result: resultText.slice(0, 500), source: toolSource };
        if (name === "getThumbnail") {
          const urlMatch = resultText.match(/URL:\s*(\S+)/);
          if (urlMatch) toolResultEntry.imageUrl = urlMatch[1];
        }
        log.push(toolResultEntry);

        responseParts.push({ functionResponse: { name, response: { result: resultText } } });
      }

      contents.push({ role: "user", parts: responseParts });
      continue;
    }

    const reply = parts.map((p) => p.text).filter(Boolean).join("");
    if (!reply) {
      console.warn("[AAS Chat] Gemini empty reply. finishReason:", finishReason, "parts:", JSON.stringify(parts).slice(0, 200));
      log.push({ type: "llm_response", text: "(empty)", finishReason });
      // If a tool was successfully called, use its result as fallback reply
      const lastToolResult = [...log].reverse().find(e => e.type === "tool_result" && e.result && !e.result.startsWith("Fehler"));
      if (lastToolResult) {
        return { reply: lastToolResult.result, connectorEvent: latestConnectorEvent };
      }
      const hint = finishReason === "MAX_TOKENS" ? " (Eingabe zu lang — versuche weniger Daten.)"
        : finishReason === "SAFETY" ? " (Sicherheitsfilter blockiert.)"
        : finishReason === "RECITATION" ? " (Rezitationsfilter blockiert.)"
        : "";
      return { reply: `Das Modell hat leider keine Antwort generiert${hint} Bitte versuche es erneut.`, connectorEvent: latestConnectorEvent };
    }
    log.push({ type: "llm_response", text: reply.slice(0, 200) });
    return { reply, connectorEvent: latestConnectorEvent };
  }

  return {
    reply: "Ich habe 10 Tool-Aufrufe durchgeführt. Möchtest du weitermachen?",
    connectorEvent: latestConnectorEvent,
    continuationState: { provider: "gemini", contents },
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
function mountRoutes(router) {

  // --- Chat conversations ---

  router.get("/api/chats", auth.requireAuth, async (req, res) => {
    try {
      const chats = await db.all(
        `SELECT chat_id, title, active_connector_id, updated_at
         FROM aas_chat_conversations WHERE user_id = ? ORDER BY updated_at DESC`,
        [req.user.id]
      );
      res.json({ chats });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.post("/api/chats", auth.requireAuth, async (req, res) => {
    try {
      const chatId = crypto.randomUUID();
      const title = (req.body?.title || "Neuer Chat").trim().slice(0, 200);
      await db.run(
        `INSERT INTO aas_chat_conversations (chat_id, user_id, title) VALUES (?, ?, ?)`,
        [chatId, req.user.id, title]
      );
      res.json({ chat_id: chatId, title });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.patch("/api/chats/:chatId", auth.requireAuth, async (req, res) => {
    try {
      const { title } = req.body;
      if (!title || typeof title !== "string") return res.status(400).json({ error: "title required" });
      const result = await db.run(
        `UPDATE aas_chat_conversations SET title = ? WHERE chat_id = ? AND user_id = ?`,
        [title.trim().slice(0, 200), req.params.chatId, req.user.id]
      );
      if (result.changes === 0) return res.status(404).json({ error: "chat not found" });
      res.json({ ok: true, title: title.trim().slice(0, 200) });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  router.delete("/api/chats/:chatId", auth.requireAuth, async (req, res) => {
    try {
      const chatId = req.params.chatId;
      // Verify ownership
      const chat = await db.get(
        `SELECT chat_id FROM aas_chat_conversations WHERE chat_id = ? AND user_id = ?`,
        [chatId, req.user.id]
      );
      if (!chat) return res.status(404).json({ error: "chat not found" });
      // Delete messages + chat
      await db.run(`DELETE FROM aas_chat_messages WHERE chat_id = ? AND user_id = ?`, [chatId, req.user.id]);
      await db.run(`DELETE FROM aas_chat_conversations WHERE chat_id = ?`, [chatId]);
      res.json({ ok: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
  });

  // --- List messages ---
  router.get("/api/messages", auth.requireAuth, async (req, res) => {
    try {
      const chatId = req.query.chatId;
      if (!chatId) return res.status(400).json({ error: "chatId required" });
      const rows = await db.all(
        `SELECT message_id, role, content, tool_log, created_at
         FROM aas_chat_messages WHERE user_id = ? AND chat_id = ? ORDER BY created_at ASC`,
        [req.user.id, chatId]
      );
      // Parse tool_log JSON for assistant messages
      const messages = rows.map((r) => {
        const msg = { message_id: r.message_id, role: r.role, content: r.content, created_at: r.created_at };
        if (r.tool_log) {
          try { msg.toolLog = JSON.parse(r.tool_log); } catch { /* ignore parse errors */ }
        }
        return msg;
      });
      res.json({ messages });
    } catch {
      res.status(500).json({ error: "LOAD_MESSAGES_FAILED" });
    }
  });

  // --- Send message → LLM (with optional MCP tools) ---
  router.post("/api/messages", auth.requireAuth, async (req, res) => {
    try {
      const { content, mode, forceTool, continuation, chatId } = req.body || {};
      if (!chatId) return res.status(400).json({ error: "chatId required" });

      // --- Handle continuation request (extend beyond MAX_ROUNDS) ---
      if (continuation) {
        const stored = continuationStore.get(req.user.id);
        if (!stored) {
          return res.status(400).json({ error: "NO_CONTINUATION" });
        }
        continuationStore.delete(req.user.id);

        await db.run(
          `INSERT INTO aas_chat_messages (user_id, role, content, chat_id) VALUES (?, 'user', ?, ?)`,
          [req.user.id, "Weitermachen", chatId]
        );

        const settings = await db.get(
          "SELECT provider, model, api_key, aas_url, enabled_mcps, base_prompt FROM aas_chat_settings WHERE user_id = ?",
          [req.user.id]
        );
        if (!settings || !settings.api_key) return res.status(400).json({ error: "NO_API_KEY" });
        let enabledMcpsCont;
        try { enabledMcpsCont = JSON.parse(settings?.enabled_mcps || '["aas","dti"]'); } catch { enabledMcpsCont = ["aas", "dti"]; }
        const conv = await db.get("SELECT active_connector_id FROM aas_chat_conversations WHERE chat_id = ? AND user_id = ?", [chatId, req.user.id]);

        const toolLog = stored.toolLog || [];
        let connectorEvent = null;
        try {
          // --- AAS MCP tools (only if enabled) ---
          let aasMcpClient = null;
          let mcpTools = [];
          let aasPoolEntry = null;
          if (enabledMcpsCont.includes("aas") && settings.aas_url) {
            aasPoolEntry = await getPooledMcpClient(req.user.id, settings.aas_url, toolLog);
            aasMcpClient = aasPoolEntry.client;
            mcpTools = aasPoolEntry.tools;
          }

          // --- DTI MCP tools (only if enabled) ---
          let dtiMcpClient = null;
          let dtiTools = [];
          let dtiPoolEntry = { instructions: "" };
          if (enabledMcpsCont.includes("dti")) {
            const connectorId = conv?.active_connector_id || "";
            const role = connectorId ? ((await db.get("SELECT role FROM connector_members WHERE connector_id = ? AND user_id = ?", [connectorId, req.user.id]))?.role || "") : "";
            dtiPoolEntry = await getPooledDtiMcpClient(req.user.id, connectorId, role, toolLog);
            dtiMcpClient = dtiPoolEntry.client;
            dtiTools = dtiPoolEntry.tools;
          }

          // --- KB MCP tools (only if enabled) ---
          let kbMcpClient = null;
          let kbTools = [];
          let kbPoolEntry = { instructions: "" };
          if (enabledMcpsCont.includes("kb")) {
            const kbSettings = await db.get("SELECT base_prompt FROM kb_settings WHERE user_id = ?", [req.user.id]);
            kbPoolEntry = await getPooledKbMcpClient(req.user.id, kbSettings?.base_prompt || "", toolLog);
            kbMcpClient = kbPoolEntry.client;
            kbTools = kbPoolEntry.tools;
          }

          const allTools = [...mcpTools, ...dtiTools, ...kbTools];
          const sysPrompt = buildSystemPrompt(
            settings.base_prompt || "",
            aasPoolEntry?.instructions || "",
            dtiPoolEntry.instructions,
            aasPoolEntry?.resources || [],
            aasPoolEntry?.prompts || [],
            kbPoolEntry.instructions
          );

          toolLog.push({ type: "info", text: "Fortsetzung — weitere Tool-Aufrufe" });

          let result;
          const mcpClients = { aas: aasMcpClient, dti: dtiMcpClient, kb: kbMcpClient };
          if (stored.provider === "gemini") {
            result = await chatGeminiWithTools(settings.api_key, settings.model, [], allTools, mcpClients, toolLog, sysPrompt, req.user.id, stored.state);
          } else {
            result = await chatGroqWithTools(settings.api_key, settings.model, [], allTools, mcpClients, toolLog, sysPrompt, req.user.id, stored.state);
          }

          const reply = result.reply;
          connectorEvent = result.connectorEvent;

          // Invalidate DTI pool when connector changes so next request gets fresh context
          if (connectorEvent) {
            closeDtiMcpPool(req.user.id);
            const newCid = connectorEvent.action === "connect" ? connectorEvent.connectorId : null;
            await db.run("UPDATE aas_chat_conversations SET active_connector_id = ? WHERE chat_id = ? AND user_id = ?", [newCid, chatId, req.user.id]);
          }

          if (result.continuationState) {
            continuationStore.set(req.user.id, {
              provider: stored.provider,
              state: result.continuationState.contents || result.continuationState.messages,
              toolLog: [...toolLog],
              timestamp: Date.now(),
            });
          }

          const toolLogJson = toolLog.length > 0 ? JSON.stringify(toolLog) : null;
          await db.run(
            `INSERT INTO aas_chat_messages (user_id, role, content, tool_log, chat_id) VALUES (?, 'assistant', ?, ?, ?)`,
            [req.user.id, reply, toolLogJson, chatId]
          );
          await db.run(`UPDATE aas_chat_conversations SET updated_at = datetime('now') WHERE chat_id = ?`, [chatId]);

          return res.json({
            ok: true,
            reply,
            toolLog: toolLog.length > 0 ? toolLog : undefined,
            connectorEvent: connectorEvent || undefined,
            continuationAvailable: !!result.continuationState || undefined,
          });
        } catch (llmErr) {
          return res.status(502).json({ error: llmErr.message || "LLM_ERROR" });
        }
        // Note: no finally close — pooled clients are reused
      }

      // --- Normal message flow ---
      if ((!content || !content.trim()) && !forceTool) {
        return res.status(400).json({ error: "EMPTY_MESSAGE" });
      }
      // Clear any pending continuation on new message
      continuationStore.delete(req.user.id);

      const msgContent = (content || "").trim();
      const useTools = mode !== "search"; // "tools" (default) or "search"

      // Get user settings
      const settings = await db.get(
        "SELECT provider, model, api_key, aas_url, enabled_mcps, base_prompt FROM aas_chat_settings WHERE user_id = ?",
        [req.user.id]
      );
      let enabledMcps;
      try { enabledMcps = JSON.parse(settings?.enabled_mcps || '["aas","dti"]'); } catch { enabledMcps = ["aas", "dti"]; }
      const conv = await db.get("SELECT active_connector_id FROM aas_chat_conversations WHERE chat_id = ? AND user_id = ?", [chatId, req.user.id]);

      if (!settings || !settings.api_key) {
        return res.status(400).json({ error: "NO_API_KEY" });
      }

      // Store user message (show tool name for slash commands)
      const storeContent = forceTool ? `/${forceTool}${msgContent ? " " + msgContent : ""}` : msgContent;
      if (storeContent) {
        await db.run(
          `INSERT INTO aas_chat_messages (user_id, role, content, chat_id) VALUES (?, 'user', ?, ?)`,
          [req.user.id, storeContent, chatId]
        );
      }

      // Load recent chat history for context (last 20 messages)
      const history = await db.all(
        `SELECT role, content FROM aas_chat_messages
         WHERE user_id = ? AND chat_id = ? ORDER BY created_at DESC LIMIT 20`,
        [req.user.id, chatId]
      );
      history.reverse();

      // Call LLM (with or without tools)
      let reply;
      let connectorEvent = null;
      const toolLog = [];
      try {
        if (useTools) {
          // --- AAS MCP tools (only if enabled + aas_url set) — pooled client ---
          let aasMcpClient = null;
          let mcpTools = [];
          let mcpResources = [];
          let mcpPrompts = [];
          let aasPoolEntry = null;
          if (enabledMcps.includes("aas") && settings.aas_url) {
            toolLog.push({ type: "mcp_connect", aasUrl: settings.aas_url });
            aasPoolEntry = await getPooledMcpClient(req.user.id, settings.aas_url, toolLog);
            aasMcpClient = aasPoolEntry.client;
            mcpTools = aasPoolEntry.tools;
            mcpResources = aasPoolEntry.resources;
            mcpPrompts = aasPoolEntry.prompts;
            toolLog.push({ type: "mcp_tools", count: mcpTools.length, names: mcpTools.map((t) => t.name) });
            if (mcpResources.length) toolLog.push({ type: "mcp_resources", count: mcpResources.length, names: mcpResources.map((r) => r.name || r.uri) });
            if (mcpPrompts.length) toolLog.push({ type: "mcp_prompts", count: mcpPrompts.length, names: mcpPrompts.map((p) => p.name) });
          }

          // --- DTI MCP tools (only if enabled) — pooled client ---
          let dtiMcpClient = null;
          let dtiTools = [];
          let dtiPoolEntry = { instructions: "" };
          if (enabledMcps.includes("dti")) {
            const connectorId = conv?.active_connector_id || "";
            const role = connectorId ? ((await db.get("SELECT role FROM connector_members WHERE connector_id = ? AND user_id = ?", [connectorId, req.user.id]))?.role || "") : "";
            dtiPoolEntry = await getPooledDtiMcpClient(req.user.id, connectorId, role, toolLog);
            dtiMcpClient = dtiPoolEntry.client;
            dtiTools = dtiPoolEntry.tools;
            toolLog.push({ type: "dti_tools", count: dtiTools.length, names: dtiTools.map((t) => t.name) });
          }

          // --- KB MCP tools (only if enabled) ---
          let kbMcpClient = null;
          let kbTools = [];
          let kbPoolEntry = { instructions: "" };
          if (enabledMcps.includes("kb")) {
            const kbSettings = await db.get("SELECT base_prompt FROM kb_settings WHERE user_id = ?", [req.user.id]);
            kbPoolEntry = await getPooledKbMcpClient(req.user.id, kbSettings?.base_prompt || "", toolLog);
            kbMcpClient = kbPoolEntry.client;
            kbTools = kbPoolEntry.tools;
            toolLog.push({ type: "kb_tools", count: kbTools.length, names: kbTools.map((t) => t.name) });
          }

          const allTools = [...mcpTools, ...dtiTools, ...kbTools];
          const userBase = settings.base_prompt || "";
          const sysPrompt = buildSystemPrompt(
            userBase,
            aasPoolEntry?.instructions || "",
            dtiPoolEntry.instructions,
            mcpResources,
            mcpPrompts,
            kbPoolEntry.instructions
          );
          const promptSources = [{ source: "client", label: "Base-Prompt", text: userBase || BASE_SYSTEM_PROMPT }];
          if (aasPoolEntry?.instructions) promptSources.push({ source: "aas-repository", label: "MCP Server instructions", text: aasPoolEntry.instructions });
          if (dtiPoolEntry.instructions) promptSources.push({ source: "dti-connector", label: "MCP Server instructions", text: dtiPoolEntry.instructions });
          if (kbPoolEntry.instructions) promptSources.push({ source: "knowledge-base", label: "MCP Server instructions", text: kbPoolEntry.instructions });
          if (mcpResources.length > 0) promptSources.push({ source: "aas-repository", label: "Resources", text: mcpResources.map(r => r.name || r.uri) });
          if (mcpPrompts.length > 0) promptSources.push({ source: "aas-repository", label: "Prompts", text: mcpPrompts.map(p => p.name) });
          toolLog.push({ type: "system_prompt", text: sysPrompt, sources: promptSources });

          // Forced tool: dedicated slim LLM call with only that one tool
          const allToolNames = allTools.map(t => t.name);
          const validForceTool = forceTool && allToolNames.includes(forceTool) ? forceTool : null;

          const mcpClients = { aas: aasMcpClient, dti: dtiMcpClient, kb: kbMcpClient };
          let result;
          if (validForceTool) {
            toolLog.push({ type: "force_tool", tool: validForceTool });
            const forcedToolDef = allTools.find(t => t.name === validForceTool);

            // --- Try direct execution via MCP for simple slash commands ---
            let directArgs = null;
            const schema = forcedToolDef.inputSchema;
            const requiredProps = schema?.required || [];
            const propDefs = schema?.properties || {};

            if (!msgContent && requiredProps.length === 0) {
              directArgs = {};
            }

            if (!directArgs && msgContent) {
              try {
                let jsonStr = msgContent;
                const jsonStart = jsonStr.search(/[\[{]/);
                if (jsonStart > 0) jsonStr = jsonStr.slice(jsonStart);
                const parsed = JSON.parse(jsonStr);
                if (typeof parsed === "object" && !Array.isArray(parsed)) {
                  const schemaKeys = Object.keys(propDefs);
                  if (Object.keys(parsed).some(k => schemaKeys.includes(k))) directArgs = parsed;
                }
                if (!directArgs && Array.isArray(parsed)) {
                  const arrayProp = requiredProps.find(k => propDefs[k]?.type === "array");
                  if (arrayProp) directArgs = { [arrayProp]: parsed };
                }
              } catch (parseErr) {
                console.warn("[AAS Chat] forceTool direct parse failed:", parseErr.message, "input starts with:", msgContent.slice(0, 60));
              }
            }

            if (directArgs) {
              // Direct MCP call — no LLM needed
              const targetClient = DTI_TOOL_NAMES.has(validForceTool) ? dtiMcpClient : KB_TOOL_NAMES.has(validForceTool) ? kbMcpClient : aasMcpClient;
              const toolSource = DTI_TOOL_NAMES.has(validForceTool) ? "dti" : KB_TOOL_NAMES.has(validForceTool) ? "kb" : "aas";
              const mcpLabel = toolSource === "dti" ? "MCP (dti-connector)" : toolSource === "kb" ? "MCP (knowledge-base)" : "MCP (aas-repository)";
              toolLog.push({ type: "tool_call", tool: validForceTool, args: { itemCount: Array.isArray(Object.values(directArgs)[0]) ? Object.values(directArgs)[0].length : "obj" }, source: toolSource });
              const mcpCallPayload = { name: validForceTool, arguments: directArgs };
              toolLog.push({ type: "console", direction: "sent", label: `Client → ${mcpLabel}: tools/call (${validForceTool})`, json: { jsonrpc: "2.0", method: "tools/call", params: mcpCallPayload } });
              const mcpResult = await targetClient.callTool(mcpCallPayload);
              toolLog.push({ type: "console", direction: "received", label: `${mcpLabel} → Client: tools/call result (${validForceTool})`, json: mcpResult });
              let resultText = extractMcpContent(mcpResult);
              const { cleanText, event } = extractConnectorEvent(resultText);
              resultText = cleanText;
              if (event) connectorEvent = event;
              toolLog.push({ type: "tool_result", tool: validForceTool, result: resultText.slice(0, 500), source: toolSource });
              result = { reply: resultText, connectorEvent };
            } else {
              const forcePrompt = `Du bist ein Daten-Transformator. Der Nutzer gibt dir Rohdaten. Deine EINZIGE Aufgabe: Rufe das Tool "${validForceTool}" auf. Transformiere die Nutzerdaten exakt in das inputSchema-Format. Keine Erklärungen, keine Rückfragen. Sofort den Tool-Call ausführen.`;
              const forceHistory = [{ role: "user", content: msgContent || `Rufe ${validForceTool} auf.` }];
              if (settings.provider === "gemini") {
                result = await chatGeminiWithTools(settings.api_key, settings.model, forceHistory, [forcedToolDef], mcpClients, toolLog, forcePrompt, req.user.id);
              } else {
                result = await chatGroqWithTools(settings.api_key, settings.model, forceHistory, [forcedToolDef], mcpClients, toolLog, forcePrompt, req.user.id);
              }
            }
          } else {
            if (settings.provider === "gemini") {
              result = await chatGeminiWithTools(settings.api_key, settings.model, history, allTools, mcpClients, toolLog, sysPrompt, req.user.id);
            } else {
              result = await chatGroqWithTools(settings.api_key, settings.model, history, allTools, mcpClients, toolLog, sysPrompt, req.user.id);
            }
          }
          reply = result.reply;
          connectorEvent = result.connectorEvent || connectorEvent;

          // Invalidate DTI pool when connector changes so next request gets fresh context
          if (connectorEvent) {
            closeDtiMcpPool(req.user.id);
            const newCid = connectorEvent.action === "connect" ? connectorEvent.connectorId : null;
            await db.run("UPDATE aas_chat_conversations SET active_connector_id = ? WHERE chat_id = ? AND user_id = ?", [newCid, chatId, req.user.id]);
          }

          // Store continuation state if MAX_ROUNDS was reached
          if (result.continuationState) {
            continuationStore.set(req.user.id, {
              provider: settings.provider,
              state: result.continuationState.contents || result.continuationState.messages,
              toolLog: [...toolLog],
              timestamp: Date.now(),
            });
          }
        } else {
          // --- Without tools (search mode / original behavior) ---
          if (settings.provider === "gemini") {
            reply = await callGemini(settings.api_key, settings.model, history);
          } else {
            reply = await callGroq(settings.api_key, settings.model, history);
          }
        }
      } catch (llmErr) {
        const errMsg = llmErr.message || "LLM_ERROR";
        console.error("[AAS Chat] LLM error:", errMsg.slice(0, 200));
        return res.status(502).json({ error: errMsg });
      }
      // Note: no finally close — pooled clients are reused

      // Store assistant reply (with tool_log if available)
      const toolLogJson = toolLog.length > 0 ? JSON.stringify(toolLog) : null;
      await db.run(
        `INSERT INTO aas_chat_messages (user_id, role, content, tool_log, chat_id) VALUES (?, 'assistant', ?, ?, ?)`,
        [req.user.id, reply, toolLogJson, chatId]
      );
      await db.run(`UPDATE aas_chat_conversations SET updated_at = datetime('now') WHERE chat_id = ?`, [chatId]);

      res.json({
        ok: true,
        reply,
        toolLog: toolLog.length > 0 ? toolLog : undefined,
        connectorEvent: connectorEvent || undefined,
        continuationAvailable: continuationStore.has(req.user.id) || undefined,
      });
    } catch {
      res.status(500).json({ error: "SEND_MESSAGE_FAILED" });
    }
  });

  // --- Clear chat messages ---
  router.delete("/api/messages", auth.requireAuth, async (req, res) => {
    try {
      const chatId = req.query.chatId;
      if (!chatId) return res.status(400).json({ error: "chatId required" });
      await db.run("DELETE FROM aas_chat_messages WHERE user_id = ? AND chat_id = ?", [req.user.id, chatId]);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "CLEAR_MESSAGES_FAILED" });
    }
  });

  // --- MCP tools list (cached) ---
  let cachedMcpTools = null;
  router.get("/api/mcp-tools", auth.requireAuth, async (req, res) => {
    if (cachedMcpTools) return res.json({ tools: cachedMcpTools });
    let client = null;
    try {
      client = await createMcpClient("https://placeholder.local");
      const { tools } = await client.listTools();
      cachedMcpTools = tools.map((t) => ({ name: t.name, description: t.description }));
      res.json({ tools: cachedMcpTools });
    } catch {
      res.status(500).json({ error: "MCP_TOOLS_UNAVAILABLE" });
    } finally {
      if (client) { try { await client.close(); } catch {} }
    }
  });

  // --- DTI tool definitions (for docs page + slash autocomplete) ---
  // Uses a one-off client (not the pool) so the pool stays cold until the first
  // real chat request, where the handshake steps are logged to the dev console.
  let cachedDtiTools = null;
  router.get("/api/dti-tools", auth.requireAuth, async (req, res) => {
    if (cachedDtiTools) return res.json({ tools: cachedDtiTools });
    let client = null;
    try {
      const { Client, StdioClientTransport } = await getMcpSdk();
      const transport = new StdioClientTransport({
        command: "node",
        args: [path.join(__dirname, "../dti-connector/mcp-server.mjs")],
        env: { ...process.env, DTI_USER_ID: req.user.id, DTI_CONNECTOR_ID: "", DTI_ROLE: "" },
      });
      client = new Client({ name: "aas-chat-dti-tools", version: "1.0.0" });
      await client.connect(transport);
      const { tools } = await client.listTools();
      cachedDtiTools = tools.map((t) => ({ name: t.name, description: t.description }));
      res.json({ tools: cachedDtiTools });
    } catch {
      res.status(500).json({ error: "DTI_TOOLS_UNAVAILABLE" });
    } finally {
      if (client) { try { await client.close(); } catch {} }
    }
  });

  // --- KB tool definitions (for slash autocomplete) ---
  let cachedKbTools = null;
  router.get("/api/kb-tools", auth.requireAuth, async (req, res) => {
    if (cachedKbTools) return res.json({ tools: cachedKbTools });
    let client = null;
    try {
      const { Client, StdioClientTransport } = await getMcpSdk();
      const transport = new StdioClientTransport({
        command: "node",
        args: [path.join(__dirname, "../knowledge-base/mcp-server.mjs")],
        env: { ...process.env, KB_USER_ID: req.user.id, KB_BASE_PROMPT: "" },
      });
      client = new Client({ name: "aas-chat-kb-tools", version: "1.0.0" });
      await client.connect(transport);
      const { tools } = await client.listTools();
      cachedKbTools = tools.map((t) => ({ name: t.name, description: t.description }));
      res.json({ tools: cachedKbTools });
    } catch {
      res.status(500).json({ error: "KB_TOOLS_UNAVAILABLE" });
    } finally {
      if (client) { try { await client.close(); } catch {} }
    }
  });

  // --- DTI connector status (for panel restore on page load) ---
  router.get("/api/connector-status", auth.requireAuth, async (req, res) => {
    try {
      const chatId = req.query.chatId;
      if (!chatId) return res.json({ connected: false });
      const conv = await db.get(
        "SELECT active_connector_id FROM aas_chat_conversations WHERE chat_id = ? AND user_id = ?",
        [chatId, req.user.id]
      );
      if (!conv?.active_connector_id) {
        return res.json({ connected: false });
      }
      const cid = conv.active_connector_id;
      const row = await db.get(
        `SELECT c.name, m.role FROM dti_connectors c
         JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
         WHERE c.connector_id = ?`,
        [req.user.id, cid]
      );
      if (!row) {
        // Connector was deleted or user lost access — clear it
        await db.run("UPDATE aas_chat_conversations SET active_connector_id = NULL WHERE chat_id = ?", [chatId]);
        return res.json({ connected: false });
      }
      const assetCount = (await db.get("SELECT COUNT(*) AS cnt FROM dti_assets WHERE connector_id = ?", [cid]))?.cnt || 0;
      const hierCount = (await db.get("SELECT COUNT(*) AS cnt FROM dti_hierarchy_levels WHERE connector_id = ?", [cid]))?.cnt || 0;
      res.json({
        connected: true,
        connectorId: cid,
        name: row.name,
        role: row.role,
        assetCount,
        hierarchyCount: hierCount,
      });
    } catch {
      res.status(500).json({ error: "CONNECTOR_STATUS_FAILED" });
    }
  });

  // --- Disconnect connector (for clear-chat) ---
  router.post("/api/connector-disconnect", auth.requireAuth, async (req, res) => {
    try {
      const { chatId } = req.body || {};
      if (chatId) {
        await db.run("UPDATE aas_chat_conversations SET active_connector_id = NULL WHERE chat_id = ? AND user_id = ?", [chatId, req.user.id]);
      }
      closeDtiMcpPool(req.user.id);
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "DISCONNECT_FAILED" });
    }
  });

  // --- Get settings ---
  router.get("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const row = await db.get(
        "SELECT provider, model, api_key, aas_url, enabled_mcps, base_prompt FROM aas_chat_settings WHERE user_id = ?",
        [req.user.id]
      );
      const settings = row || { provider: "groq", model: "llama-3.1-8b-instant", api_key: "", aas_url: "", enabled_mcps: '["aas","dti"]', base_prompt: "" };
      const masked = settings.api_key
        ? "••••••••" + settings.api_key.slice(-4)
        : "";
      let enabledMcps;
      try { enabledMcps = JSON.parse(settings.enabled_mcps); } catch { enabledMcps = ["aas", "dti"]; }
      res.json({
        provider: settings.provider,
        model: settings.model,
        api_key_masked: masked,
        has_api_key: !!settings.api_key,
        aas_url: settings.aas_url,
        enabled_mcps: enabledMcps,
        base_prompt: settings.base_prompt || "",
        default_base_prompt: BASE_SYSTEM_PROMPT,
      });
    } catch {
      res.status(500).json({ error: "LOAD_SETTINGS_FAILED" });
    }
  });

  // --- Save settings ---
  router.put("/api/settings", auth.requireAuth, async (req, res) => {
    try {
      const { provider, model, api_key, aas_url, enabled_mcps, base_prompt } = req.body || {};

      const existing = await db.get(
        "SELECT api_key FROM aas_chat_settings WHERE user_id = ?",
        [req.user.id]
      );

      let finalKey = "";
      if (api_key && !api_key.startsWith("•")) {
        finalKey = api_key.trim();
      } else if (existing) {
        finalKey = existing.api_key;
      }

      const mcpsJson = Array.isArray(enabled_mcps) ? JSON.stringify(enabled_mcps) : '["aas","dti"]';

      await db.run(
        `INSERT INTO aas_chat_settings (user_id, provider, model, api_key, aas_url, enabled_mcps, base_prompt)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET
           provider = excluded.provider,
           model = excluded.model,
           api_key = excluded.api_key,
           aas_url = excluded.aas_url,
           enabled_mcps = excluded.enabled_mcps,
           base_prompt = excluded.base_prompt`,
        [req.user.id, provider || "groq", model || "llama-3.1-8b-instant", finalKey, aas_url || "", mcpsJson, base_prompt || ""]
      );

      // Invalidate pooled MCP clients when settings change
      closeMcpPoolEntry(req.user.id, aas_url || "");
      closeDtiMcpPool(req.user.id);
      closeKbMcpPool(req.user.id);

      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: "SAVE_SETTINGS_FAILED" });
    }
  });
}

module.exports = { initAasChatTables, mountRoutes };
