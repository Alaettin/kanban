// === DOM refs ===
const chatMessages = document.getElementById("chat-messages");
const emptyState = document.getElementById("empty-state");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const micBtn = document.getElementById("mic-btn");
const clearChatInline = document.getElementById("clear-chat-inline");
const consoleToggleBtn = document.getElementById("console-toggle");
const devConsole = document.getElementById("dev-console");
const consoleLogEl = document.getElementById("console-log");
const consoleClear = document.getElementById("console-clear");
const consoleClose = document.getElementById("console-close");
const consoleResize = document.getElementById("console-resize");
const confirmDialog = document.getElementById("confirm-dialog");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");
const sidebarToggle = document.getElementById("sidebar-toggle");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const newChatBtn = document.getElementById("new-chat-btn");
const chatListEl = document.getElementById("chat-list");

// Settings DOM
const settingsProvider = document.getElementById("settings-provider");
const settingsModel = document.getElementById("settings-model");
const settingsApiKey = document.getElementById("settings-api-key");
const settingsAasUrl = document.getElementById("settings-aas-url");
const settingsSaveBtn = document.getElementById("settings-save-btn");
const settingsHint = document.getElementById("settings-hint");
const toggleKeyVis = document.getElementById("toggle-key-vis");
const mcpAasCheckbox = document.getElementById("mcp-aas");
const mcpDtiCheckbox = document.getElementById("mcp-dti");
const settingsBasePrompt = document.getElementById("settings-base-prompt");
const resetBasePromptBtn = document.getElementById("reset-base-prompt-btn");
const modeToggle = document.getElementById("mode-toggle");
const modeLabel = document.getElementById("mode-label");

// Connector panel DOM
const connectorPanel = document.getElementById("connector-panel");
const connectorPanelName = document.getElementById("connector-panel-name");
const connectorPanelRole = document.getElementById("connector-panel-role");
const connectorPanelStats = document.getElementById("connector-panel-stats");
const connectorPanelLog = document.getElementById("connector-panel-log");
const connectorPanelClose = document.getElementById("connector-panel-close");
const connectorToggle = document.getElementById("connector-toggle");
const connectorToggleLabel = document.getElementById("connector-toggle-label");

// Slash-command menu DOM
const slashMenu = document.getElementById("slash-menu");
const slashMenuList = document.getElementById("slash-menu-list");

// === i18n ===
const I18N = {
  de: {
    brandText: "AAS Chat",
    navChat: "Chat",
    navDocs: "Docs",
    navSettings: "Einstellungen",
    docsTitle: "Docs",
    docsDesc: "Übersicht aller verfügbaren Tools, die dem KI-Modell zur Verfügung stehen.",
    emptyText: "Stelle eine Frage zur Verwaltungsschale.",
    placeholder: "Nachricht eingeben...",
    settingsTitle: "Einstellungen",
    settingsDesc: "Konfiguriere die KI-Anbindung und die Verwaltungsschale.",
    providerTitle: "KI-Modell",
    providerDesc: "Wähle den Anbieter und das Modell für den Chat.",
    lblProvider: "Anbieter",
    lblModel: "Modell",
    apikeyTitle: "API-Schlüssel",
    apikeyDesc_groq: "Dein Groq API-Key. Kostenlos unter console.groq.com.",
    apikeyDesc_gemini: "Dein Google Gemini API-Key. Kostenlos unter aistudio.google.com.",
    apikeyDesc: "API-Schlüssel für den gewählten Anbieter.",
    endpointTitle: "AAS Server URL",
    endpointDesc: "Die Basis-URL des Verwaltungsschalen-Servers (optional, für später).",
    promptTitle: "System-Prompt",
    promptDesc: "Instruktionen für die KI bei Tool-Aufrufen. Steuert, wie das Modell die AAS-Tools nutzt.",
    promptReset: "Zurücksetzen",
    saveBtn: "Speichern",
    saved: "Gespeichert!",
    saveFailed: "Fehler beim Speichern.",
    confirmText: "Chat-Verlauf wirklich löschen?",
    confirmCancel: "Abbrechen",
    confirmOk: "Löschen",
    logout: "Logout",
    toggleCollapse: "Navigation einklappen",
    toggleExpand: "Navigation ausklappen",
    errNoKey: "Bitte zuerst einen API-Schlüssel in den Einstellungen hinterlegen.",
    errInvalidKey: "Ungültiger API-Schlüssel. Bitte in den Einstellungen prüfen.",
    errRateLimit: "Zu viele Anfragen. Bitte kurz warten.",
    errGeneric: "Fehler bei der KI-Anfrage. Bitte später erneut versuchen.",
    micTitle: "Spracheingabe",
    micNotSupported: "Spracheingabe wird von diesem Browser nicht unterstützt.",
  },
  en: {
    brandText: "AAS Chat",
    navChat: "Chat",
    navDocs: "Docs",
    navSettings: "Settings",
    docsTitle: "Docs",
    docsDesc: "Overview of all tools available to the AI model.",
    emptyText: "Ask a question about the Asset Administration Shell.",
    placeholder: "Type a message...",
    settingsTitle: "Settings",
    settingsDesc: "Configure the AI connection and the Asset Administration Shell.",
    providerTitle: "AI Model",
    providerDesc: "Choose the provider and model for the chat.",
    lblProvider: "Provider",
    lblModel: "Model",
    apikeyTitle: "API Key",
    apikeyDesc_groq: "Your Groq API key. Free at console.groq.com.",
    apikeyDesc_gemini: "Your Google Gemini API key. Free at aistudio.google.com.",
    apikeyDesc: "API key for the selected provider.",
    endpointTitle: "AAS Server URL",
    endpointDesc: "The base URL of the AAS server (optional, for later).",
    promptTitle: "System Prompt",
    promptDesc: "Instructions for the AI when using tool calls. Controls how the model uses AAS tools.",
    promptReset: "Reset to default",
    saveBtn: "Save",
    saved: "Saved!",
    saveFailed: "Failed to save.",
    confirmText: "Really delete chat history?",
    confirmCancel: "Cancel",
    confirmOk: "Delete",
    logout: "Logout",
    toggleCollapse: "Collapse navigation",
    toggleExpand: "Expand navigation",
    errNoKey: "Please set an API key in the settings first.",
    errInvalidKey: "Invalid API key. Please check in settings.",
    errRateLimit: "Too many requests. Please wait a moment.",
    errGeneric: "AI request failed. Please try again later.",
    micTitle: "Voice input",
    micNotSupported: "Voice input is not supported by this browser.",
  },
};

// === Provider / Model definitions ===
const PROVIDER_MODELS = {
  gemini: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite (schneller)" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  ],
  groq: [
    { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (schnell)" },
    { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B (besser)" },
    { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
  ],
};

let locale = localStorage.getItem("kanban-locale") || "de";
let currentUser = null;
let messages = [];
let chatList = [];
let currentChatId = null;
let isWaiting = false;
let chatMode = "tools"; // "tools" = AAS MCP tools, "search" = Google Search
let activeProvider = "gemini";
let enabledMcps = ["aas", "dti"];
let connectorPanelOpen = false;
let connectorLogEntries = [];
let connectedConnectorName = "";
let devConsoleOpen = false;
let consoleEntries = [];
let consoleActiveTab = "app";
let rawJsonRpcEntries = [];
const CONNECTOR_TOOL_NAMES = new Set([
  "listConnectors", "connectConnector", "disconnectConnector", "createConnector",
  "getHierarchyLevels", "setHierarchyLevels",
  "getModelDatapoints", "setModelDatapoints", "addModelDatapoint", "editModelDatapoint", "removeModelDatapoint",
  "listAssets", "createAsset", "deleteAsset", "renameAsset",
  "getAssetValues", "setAssetValues", "updateAssetValues",
]);

// Slash-command autocomplete state
let allAasTools = [];
let allDtiTools = [];
let cachedToolList = [];

function rebuildCachedToolList() {
  cachedToolList = [
    ...(enabledMcps.includes("aas") ? allAasTools : []),
    ...(enabledMcps.includes("dti") ? allDtiTools : []),
  ];
}
let slashMenuVisible = false;
let slashMenuItems = [];
let slashMenuIndex = 0;
let slashSelectedTool = null;

function t(key) {
  return (I18N[locale] && I18N[locale][key]) || key;
}

// === API helper ===
async function apiRequest(path, options = {}) {
  const { method = "GET", body } = options;
  try {
    const response = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let payload = null;
    const ct = response.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      payload = await response.json();
    }
    if (response.status === 401) {
      window.location.href = "/";
      return { ok: false, status: 401, payload };
    }
    return { ok: response.ok, status: response.status, payload };
  } catch (error) {
    return { ok: false, status: 0, payload: null, error };
  }
}

// === Helpers ===
function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// === Sidebar navigation ===
function switchPage(pageId) {
  document.querySelectorAll(".page-section").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".sidebar-item[data-page]").forEach((b) => b.classList.remove("active"));
  const section = document.getElementById("page-" + pageId);
  const btn = document.querySelector(`.sidebar-item[data-page="${pageId}"]`);
  if (section) section.classList.add("active");
  if (btn) btn.classList.add("active");
  if (pageId === "docs") {
    loadDocsTools();
  }
}

document.querySelectorAll(".sidebar-item[data-page]").forEach((btn) => {
  btn.addEventListener("click", () => switchPage(btn.dataset.page));
});

// Sidebar toggle
sidebarToggle.addEventListener("click", () => {
  document.body.classList.toggle("sidebar-collapsed");
  const collapsed = document.body.classList.contains("sidebar-collapsed");
  sidebarToggle.title = collapsed ? t("toggleExpand") : t("toggleCollapse");
});

// Mobile sidebar toggle
mobileMenuBtn.addEventListener("click", () => {
  document.body.classList.toggle("mobile-sidebar-open");
});
document.getElementById("sidebar").addEventListener("click", (e) => {
  if (e.target.closest(".sidebar-item, .chat-item, .new-chat-btn")) {
    document.body.classList.remove("mobile-sidebar-open");
  }
});

// === Multi-Chat management ===

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

async function loadChatList() {
  const result = await apiRequest("/apps/aas-chat/api/chats");
  if (result.ok) {
    chatList = result.payload?.chats || [];
    renderChatList();
  }
}

function renderChatList() {
  chatListEl.innerHTML = chatList.map(c => `
    <div class="chat-item${c.chat_id === currentChatId ? " active" : ""}" data-chat-id="${c.chat_id}">
      <span class="chat-item-title">${escapeHtml(c.title)}</span>
      <button class="chat-item-close" type="button" title="Chat löschen">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `).join("");

  // Click on chat item
  chatListEl.querySelectorAll(".chat-item").forEach(item => {
    item.addEventListener("click", (e) => {
      if (e.target.closest(".chat-item-close")) return;
      if (e.target.closest("[contenteditable]")) return;
      const id = item.dataset.chatId;
      if (id !== currentChatId) {
        switchChat(id);
      }
      switchPage("chat");
    });

    // Double-click to rename
    const titleEl = item.querySelector(".chat-item-title");
    titleEl.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      titleEl.contentEditable = "true";
      titleEl.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(titleEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
    titleEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); titleEl.blur(); }
      if (e.key === "Escape") { titleEl.textContent = chatList.find(c => c.chat_id === item.dataset.chatId)?.title || ""; titleEl.blur(); }
    });
    titleEl.addEventListener("blur", async () => {
      titleEl.contentEditable = "false";
      const newTitle = titleEl.textContent.trim();
      if (!newTitle) { titleEl.textContent = chatList.find(c => c.chat_id === item.dataset.chatId)?.title || "Chat"; return; }
      const chatId = item.dataset.chatId;
      const chat = chatList.find(c => c.chat_id === chatId);
      if (chat && chat.title !== newTitle) {
        chat.title = newTitle;
        await apiRequest(`/apps/aas-chat/api/chats/${chatId}`, { method: "PATCH", body: { title: newTitle } });
      }
    });
  });

  // Close button
  chatListEl.querySelectorAll(".chat-item-close").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const chatId = btn.closest(".chat-item").dataset.chatId;
      deleteChat(chatId);
    });
  });
}

async function switchChat(chatId) {
  if (chatId === currentChatId) return;
  currentChatId = chatId;

  // Reset frontend state
  messages = [];
  consoleEntries = [];
  rawJsonRpcEntries = [];
  connectorLogEntries = [];

  renderMessages();
  if (devConsoleOpen) renderConsole();
  renderChatList();

  // Load messages
  await loadMessages(chatId);

  // Load connector status for this chat
  const cResult = await apiRequest(`/apps/aas-chat/api/connector-status?chatId=${chatId}`);
  if (cResult.ok && cResult.payload?.connected) {
    const s = cResult.payload;
    connectorToggle.hidden = false;
    connectorToggleLabel.textContent = s.name;
    connectedConnectorName = s.name;
    connectorPanelName.textContent = s.name;
    connectorPanelRole.textContent = s.role;
    connectorPanelStats.innerHTML = `<div>Assets: ${s.assetCount}</div><div>Hierarchy: ${s.hierarchyCount}</div>`;
    if (connectorLogEntries.length > 0) renderConnectorLog();
  } else {
    disconnectConnectorUI();
  }
}

async function createNewChat() {
  // Determine next Chat number
  const nums = chatList.map(c => { const m = c.title.match(/^Chat\s+(\d+)$/i); return m ? parseInt(m[1]) : 0; });
  const nextNum = (nums.length > 0 ? Math.max(...nums) : 0) + 1;
  const title = `Chat ${nextNum}`;

  const result = await apiRequest("/apps/aas-chat/api/chats", { method: "POST", body: { title } });
  if (result.ok && result.payload?.chat_id) {
    chatList.unshift({ chat_id: result.payload.chat_id, title: result.payload.title || title, updated_at: new Date().toISOString() });
    await switchChat(result.payload.chat_id);
    switchPage("chat");
  }
}

async function deleteChat(chatId) {
  const result = await apiRequest(`/apps/aas-chat/api/chats/${chatId}`, { method: "DELETE" });
  if (result.ok) {
    chatList = chatList.filter(c => c.chat_id !== chatId);
    if (chatList.length === 0) {
      await createNewChat();
    } else if (chatId === currentChatId) {
      await switchChat(chatList[0].chat_id);
    } else {
      renderChatList();
    }
  }
}

// New chat button
newChatBtn.addEventListener("click", () => createNewChat());

// === Render messages ===
function renderMessages() {
  chatMessages.querySelectorAll(".chat-bubble, .chat-typing, .mcp-tool-log").forEach((el) => el.remove());

  if (messages.length === 0 && !isWaiting) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  for (const msg of messages) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${msg.role}`;
    if (msg.role === "assistant" && typeof marked !== "undefined") {
      bubble.innerHTML = marked.parse(msg.content || "");
    } else {
      bubble.textContent = msg.content;
    }
    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.className = "chat-bubble-copy";
    copyBtn.type = "button";
    copyBtn.title = "Kopieren";
    copyBtn.innerHTML = `<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(msg.content || "").then(() => {
        copyBtn.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;
        setTimeout(() => {
          copyBtn.innerHTML = `<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
        }, 1500);
      });
    });
    bubble.appendChild(copyBtn);
    chatMessages.appendChild(bubble);

    // Render inline tool log after assistant messages
    if (msg.toolLog && msg.toolLog.length > 0) {
      chatMessages.appendChild(buildToolLogBlock(msg.toolLog));

      // Show thumbnail images from getThumbnail results
      const thumbUrls = msg.toolLog
        .filter((e) => e.type === "tool_result" && e.imageUrl)
        .map((e) => e.imageUrl);
      for (const url of thumbUrls) {
        const wrap = document.createElement("div");
        wrap.className = "chat-thumbnail-wrap";
        const img = document.createElement("img");
        img.className = "chat-thumbnail";
        img.src = url;
        img.alt = "Thumbnail";
        img.addEventListener("click", () => openLightbox(url));
        wrap.appendChild(img);
        chatMessages.appendChild(wrap);
      }
    }
  }

  // Show typing indicator while waiting
  if (isWaiting) {
    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    chatMessages.appendChild(typing);
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === Build inline MCP timeline block ===
function buildToolLogBlock(toolLog) {
  const block = document.createElement("details");
  block.className = "mcp-tool-log";

  const isConnector = (e) => e.source === "dti" || CONNECTOR_TOOL_NAMES.has(e.tool);

  // Count tool calls for summary (split by source)
  const aasCalls = toolLog.filter((e) => e.type === "tool_call" && !isConnector(e)).length;
  const connCalls = toolLog.filter((e) => e.type === "tool_call" && isConnector(e)).length;
  const totalCalls = aasCalls + connCalls;
  let summaryParts = [];
  if (aasCalls) summaryParts.push(`${aasCalls} MCP (AAS)`);
  if (connCalls) summaryParts.push(`${connCalls} Connector`);
  const summaryInfo = summaryParts.length > 0
    ? `${summaryParts.join(" + ")} Tool-Aufruf${totalCalls !== 1 ? "e" : ""}`
    : "Tools";
  // Sum up tokens across all rounds
  const totalTokens = toolLog
    .filter((e) => e.type === "llm_usage")
    .reduce((sum, e) => sum + (e.totalTokens || 0), 0);
  const tokenInfo = totalTokens > 0 ? ` · ${totalTokens.toLocaleString()} Tokens` : "";
  const summary = document.createElement("summary");
  summary.className = "mcp-tool-log-summary";
  summary.innerHTML =
    `<svg class="mcp-toggle-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>` +
    `<span class="mcp-toggle-label label-communication">Communication</span>` +
    `<span class="mcp-toggle-info">${summaryInfo}${tokenInfo}</span>`;
  block.appendChild(summary);

  const timeline = document.createElement("div");
  timeline.className = "mcp-timeline";

  for (const entry of toolLog) {
    // Console/raw entries belong in Developer Console, not in chat timeline
    if (entry.type === "console" || entry.type === "raw_jsonrpc") continue;

    const item = document.createElement("article");
    item.className = "mcp-log-item";
    item.dataset.type = entry.type;
    if (isConnector(entry)) item.dataset.source = "connector";

    let labelClass = "label-mcp";
    let labelText = "MCP";
    let mainText = "";
    let detailText = "";

    if (entry.type === "mcp_connect") {
      labelClass = "label-aas";
      labelText = "MCP (AAS)";
      mainText = entry.aasUrl;
    } else if (entry.type === "mcp_tools") {
      labelClass = "label-aas";
      labelText = "MCP (AAS)";
      mainText = `${entry.count} Tools`;
      detailText = entry.names.join(", ");
    } else if (entry.type === "mcp_resources") {
      labelClass = "label-aas";
      labelText = "MCP (AAS)";
      mainText = `${entry.count} Resources`;
      detailText = entry.names.join(", ");
    } else if (entry.type === "mcp_prompts") {
      labelClass = "label-aas";
      labelText = "MCP (AAS)";
      mainText = `${entry.count} Prompts`;
      detailText = entry.names.join(", ");
    } else if (entry.type === "dti_tools") {
      labelClass = "label-dti";
      labelText = "Connector";
      mainText = `${entry.count} Tools`;
      detailText = entry.names.join(", ");
    } else if (entry.type === "llm_request") {
      labelClass = "label-llm";
      labelText = "LLM";
      mainText = `${entry.provider}/${entry.model || "?"} (Runde ${entry.round + 1})`;
    } else if (entry.type === "tool_call") {
      const conn = isConnector(entry);
      labelClass = conn ? "label-dti" : "label-aas";
      labelText = conn ? "Connector" : "MCP (AAS)";
      mainText = entry.tool;
      const args = entry.args || {};
      if (Object.keys(args).length > 0) {
        detailText = JSON.stringify(args, null, 1);
      }
    } else if (entry.type === "tool_result") {
      const conn = isConnector(entry);
      labelClass = conn ? "label-dti" : "label-aas";
      labelText = conn ? "Connector ✓" : "MCP (AAS) ✓";
      mainText = entry.tool;
      detailText = entry.result || "";
    } else if (entry.type === "llm_usage") {
      labelClass = "label-tokens";
      labelText = "Tokens";
      mainText = `${entry.totalTokens?.toLocaleString() || "?"} total`;
      detailText = `Prompt: ${entry.promptTokens?.toLocaleString() || "?"} · Completion: ${entry.completionTokens?.toLocaleString() || "?"}${entry.retry ? " (retry)" : ""}`;
    } else if (entry.type === "llm_response") {
      labelClass = "label-llm";
      labelText = "LLM";
      mainText = "Antwort";
      detailText = entry.text || "";
    } else if (entry.type === "system_prompt") {
      labelClass = "label-system";
      labelText = "System";
      mainText = "System-Prompt";
      detailText = entry.text || "";
    } else if (entry.type === "force_tool") {
      labelClass = "label-llm";
      labelText = "Slash";
      mainText = `/${entry.tool}`;
    } else if (entry.type === "llm_blocked") {
      labelClass = "label-llm";
      labelText = "Blocked";
      mainText = entry.finishReason || "?";
      detailText = entry.blockReason || "";
    } else if (entry.type === "llm_retry") {
      labelClass = "label-llm";
      labelText = "Retry";
      mainText = entry.reason || "?";
    } else if (entry.type === "info") {
      labelClass = "label-info";
      labelText = "INFO";
      mainText = entry.text || "";
    } else {
      continue; // skip unknown types
    }

    let html = `<span class="mcp-log-item-label ${labelClass}">${labelText}</span>`;
    html += `<span class="mcp-log-item-text">${escHtml(mainText)}</span>`;
    if (detailText) {
      html += `<span class="mcp-log-item-detail">${escHtml(detailText)}</span>`;
    }
    item.innerHTML = html;
    timeline.appendChild(item);
  }

  block.appendChild(timeline);
  return block;
}

function escHtml(str) {
  const d = document.createElement("div");
  d.textContent = str || "";
  return d.innerHTML;
}

// === Lightbox ===
function openLightbox(url) {
  const dialog = document.getElementById("lightbox-dialog");
  const img = document.getElementById("lightbox-img");
  img.src = url;
  dialog.showModal();
}

function showErrorBubble(errorKey) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble error";
  bubble.textContent = t(errorKey);
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === Mode toggle visibility ===
function updateModeToggle() {
  // Only show toggle for Gemini when AAS URL is set (search vs tools choice)
  const show = activeProvider === "gemini" && !!settingsAasUrl.value.trim();
  modeToggle.hidden = !show;
  if (!show && chatMode === "search") {
    chatMode = "tools";
    modeLabel.textContent = "MCP";
    modeToggle.querySelector(".mode-icon-tools").hidden = false;
    modeToggle.querySelector(".mode-icon-search").hidden = true;
    modeToggle.classList.remove("mode-search");
  }
}

// === Connector Panel ===
function updateConnectorPanelData(data) {
  connectorPanelName.textContent = data.name || "DTI Connector";
  connectorPanelRole.textContent = `Rolle: ${data.role || "?"}`;
  connectorPanelStats.innerHTML =
    `<div class="connector-stat"><span class="connector-stat-value">${data.assetCount ?? 0}</span><span class="connector-stat-label">Assets</span></div>` +
    `<div class="connector-stat"><span class="connector-stat-value">${data.hierarchyCount ?? 0}</span><span class="connector-stat-label">Ebenen</span></div>`;
  connectedConnectorName = data.name || "Connector";
  connectorToggleLabel.textContent = connectedConnectorName;
  connectorToggle.hidden = false;
}

function openConnectorPanel(data) {
  if (data) updateConnectorPanelData(data);
  connectorPanelOpen = true;
  connectorPanel.classList.add("open");
  connectorPanel.setAttribute("aria-hidden", "false");
  connectorToggle.hidden = true;
  renderConnectorLog();
}

function closeConnectorPanel() {
  connectorPanelOpen = false;
  connectorPanel.classList.remove("open");
  connectorPanel.setAttribute("aria-hidden", "true");
  if (connectedConnectorName) connectorToggle.hidden = false;
}

function disconnectConnectorUI() {
  closeConnectorPanel();
  connectorToggle.hidden = true;
  connectorToggleLabel.textContent = "";
  connectedConnectorName = "";
  connectorLogEntries = [];
  // Clear panel content
  connectorPanelName.textContent = "DTI Connector";
  connectorPanelRole.textContent = "";
  connectorPanelStats.innerHTML = "";
  connectorPanelLog.innerHTML = "";
}

function toggleConnectorPanel() {
  if (connectorPanelOpen) {
    closeConnectorPanel();
  } else {
    openConnectorPanel();
  }
}

function addConnectorLogEntry(toolName, resultSnippet) {
  console.log("[Connector Panel] Log entry:", toolName, resultSnippet?.slice(0, 80));
  connectorLogEntries.push({
    tool: toolName,
    result: resultSnippet,
    time: new Date().toLocaleTimeString(),
  });
  renderConnectorLog();
}

function renderConnectorLog() {
  if (connectorLogEntries.length === 0) {
    connectorPanelLog.innerHTML = `<div class="connector-log-empty">Noch keine Aktionen.</div>`;
    return;
  }
  connectorPanelLog.innerHTML = connectorLogEntries
    .slice()
    .reverse()
    .map(
      (e) =>
        `<div class="connector-log-entry"><div class="log-tool">${escHtml(e.tool)}<span class="log-time">${e.time}</span></div><div class="log-result">${escHtml(e.result)}</div></div>`
    )
    .join("");
}

// === Developer Console ===
function toggleDevConsole() {
  devConsoleOpen = !devConsoleOpen;
  devConsole.hidden = !devConsoleOpen;
  consoleToggleBtn.classList.toggle("active", devConsoleOpen);
  if (devConsoleOpen) renderConsole();
}

function closeDevConsole() {
  devConsoleOpen = false;
  devConsole.hidden = true;
  consoleToggleBtn.classList.remove("active");
}

// Console resize via drag
(function initConsoleResize() {
  let dragging = false;
  let startY = 0;
  let startH = 0;
  const MIN_H = 120;
  const MAX_H_RATIO = 0.75;

  consoleResize.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragging = true;
    startY = e.clientY;
    startH = devConsole.offsetHeight;
    consoleResize.classList.add("dragging");
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const delta = startY - e.clientY;
    const maxH = window.innerHeight * MAX_H_RATIO;
    const newH = Math.min(Math.max(startH + delta, MIN_H), maxH);
    devConsole.style.height = newH + "px";
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    consoleResize.classList.remove("dragging");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  });
})();

function clearConsole() {
  consoleEntries = [];
  rawJsonRpcEntries = [];
  renderConsole();
}

function addConsoleEntries(toolLog) {
  if (!toolLog) return;
  for (const entry of toolLog) {
    if (entry.type === "console" || entry.type === "system_prompt") {
      consoleEntries.push(entry);
    }
    if (entry.type === "raw_jsonrpc") {
      rawJsonRpcEntries.push(entry);
    }
  }
  if (devConsoleOpen) renderConsole();
}

function renderJsonTree(val, key) {
  const keyHtml = key !== undefined ? `<span class="jt-key">${escHtml(String(key))}</span><span class="jt-colon">: </span>` : "";
  if (val === null) return `<span class="jt-leaf">${keyHtml}<span class="jt-null">null</span></span>`;
  if (val === undefined) return `<span class="jt-leaf">${keyHtml}<span class="jt-null">undefined</span></span>`;
  if (typeof val === "boolean") return `<span class="jt-leaf">${keyHtml}<span class="jt-bool">${val}</span></span>`;
  if (typeof val === "number") return `<span class="jt-leaf">${keyHtml}<span class="jt-num">${val}</span></span>`;
  if (typeof val === "string") {
    if (val.length > 300) {
      return `<details class="jt-node"><summary>${keyHtml}<span class="jt-str">"${escHtml(val.slice(0, 80))}..."</span> <span class="jt-hint">(${val.length} chars)</span></summary><div class="jt-children"><span class="jt-long-str">${escHtml(val)}</span></div></details>`;
    }
    return `<span class="jt-leaf">${keyHtml}<span class="jt-str">"${escHtml(val)}"</span></span>`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return `<span class="jt-leaf">${keyHtml}<span class="jt-bracket">[]</span></span>`;
    const children = val.map((item, idx) => renderJsonTree(item, idx)).join("");
    const preview = val.length <= 3 && val.every(v => typeof v !== "object" || v === null)
      ? val.map(v => typeof v === "string" ? `"${v}"` : String(v)).join(", ")
      : `${val.length} items`;
    return `<details class="jt-node"><summary>${keyHtml}<span class="jt-bracket">[</span><span class="jt-hint">${escHtml(preview)}</span><span class="jt-bracket">]</span></summary><div class="jt-children">${children}</div></details>`;
  }
  if (typeof val === "object") {
    const keys = Object.keys(val);
    if (keys.length === 0) return `<span class="jt-leaf">${keyHtml}<span class="jt-bracket">{}</span></span>`;
    const children = keys.map(k => renderJsonTree(val[k], k)).join("");
    const preview = keys.length <= 4 ? keys.join(", ") : `${keys.length} keys`;
    return `<details class="jt-node"><summary>${keyHtml}<span class="jt-bracket">{</span><span class="jt-hint">${escHtml(preview)}</span><span class="jt-bracket">}</span></summary><div class="jt-children">${children}</div></details>`;
  }
  return `<span class="jt-leaf">${keyHtml}${escHtml(String(val))}</span>`;
}

function renderConsole() {
  const entries = consoleActiveTab === "raw" ? rawJsonRpcEntries : consoleEntries;
  if (entries.length === 0) {
    consoleLogEl.innerHTML = `<div class="console-empty">${
      consoleActiveTab === "raw" ? "Keine JSON-RPC Nachrichten." : "Keine Nachrichten."
    }</div>`;
    return;
  }
  consoleLogEl.innerHTML = entries.map((e, i) => {
    if (e.type === "system_prompt") {
      const sources = e.sources || [];
      const treeHtml = sources.map((s, si) =>
        `<details class="jt-node"><summary><span class="jt-key">${escHtml(s.source)}</span><span class="jt-colon">: </span><span class="jt-hint">${escHtml(s.label)}</span></summary><div class="jt-children"><span class="jt-long-str">${escHtml(typeof s.text === "string" ? s.text : JSON.stringify(s.text))}</span></div></details>`
      ).join("");
      return `<div class="console-entry" data-idx="${i}">
        <div class="console-entry-header">
          <span class="console-entry-arrow">&#9654;</span>
          <span class="console-entry-dir dir-system">SYSTEM</span>
          <span class="console-entry-label">System-Prompt zusammengesetzt (${sources.length} Quellen)</span>
        </div>
        <div class="console-entry-tree">${treeHtml}</div>
      </div>`;
    }
    const dirClass = e.direction === "sent" ? "dir-sent" : "dir-received";
    const dirLabel = e.direction === "sent" ? "SENT" : "RECV";
    const isRaw = consoleActiveTab === "raw";
    let detailHtml;
    if (isRaw) {
      let jsonStr;
      try { jsonStr = JSON.stringify(e.json, null, 2); } catch { jsonStr = String(e.json); }
      detailHtml = `<div class="console-entry-json">${escHtml(jsonStr)}</div>`;
    } else {
      detailHtml = e.json ? `<div class="console-entry-tree">${renderJsonTree(e.json)}</div>` : "";
    }
    return `<div class="console-entry" data-idx="${i}">
      <div class="console-entry-header">
        <span class="console-entry-arrow">&#9654;</span>
        <span class="console-entry-dir ${dirClass}">${dirLabel}</span>
        <span class="console-entry-label">${escHtml(e.label || "")}</span>
      </div>
      ${detailHtml}
    </div>`;
  }).join("");
  // Click to toggle JSON
  consoleLogEl.querySelectorAll(".console-entry-header").forEach((hdr) => {
    hdr.addEventListener("click", () => {
      hdr.closest(".console-entry").classList.toggle("open");
    });
  });
  consoleLogEl.scrollTop = consoleLogEl.scrollHeight;
}

// === Load messages ===
async function loadMessages(chatId) {
  if (!chatId) chatId = currentChatId;
  if (!chatId) return;
  const result = await apiRequest(`/apps/aas-chat/api/messages?chatId=${chatId}`);
  if (result.ok && result.payload?.messages) {
    messages = result.payload.messages;
    renderMessages();
    // Restore connector panel log from saved tool logs
    connectorLogEntries = [];
    for (const msg of messages) {
      if (!msg.toolLog) continue;
      for (let i = 0; i < msg.toolLog.length; i++) {
        const entry = msg.toolLog[i];
        if (entry.type === "tool_call" && (entry.source === "dti" || CONNECTOR_TOOL_NAMES.has(entry.tool))) {
          const resultEntry = msg.toolLog.slice(i + 1).find(e => e.type === "tool_result" && e.tool === entry.tool);
          connectorLogEntries.push({
            tool: entry.tool,
            result: resultEntry?.result || "",
            time: msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : "",
          });
        }
      }
    }
    if (connectorLogEntries.length > 0) renderConnectorLog();
    // Restore console entries from saved tool logs
    consoleEntries = [];
    rawJsonRpcEntries = [];
    for (const msg of messages) {
      if (!msg.toolLog) continue;
      for (const entry of msg.toolLog) {
        if (entry.type === "console" || entry.type === "system_prompt") consoleEntries.push(entry);
        if (entry.type === "raw_jsonrpc") rawJsonRpcEntries.push(entry);
      }
    }
    if (devConsoleOpen && (consoleEntries.length > 0 || rawJsonRpcEntries.length > 0)) renderConsole();
  }
}

// === Slash-command autocomplete ===
function handleSlashMenu() {
  const val = chatInput.value;
  if (slashSelectedTool) { hideSlashMenu(); return; }
  if (!val.startsWith("/")) { hideSlashMenu(); return; }
  // After a space the user is typing data — hide menu
  if (val.indexOf(" ") > 0) { hideSlashMenu(); return; }
  const query = val.slice(1).toLowerCase();
  slashMenuItems = cachedToolList.filter(t => t.name.toLowerCase().includes(query));
  if (slashMenuItems.length === 0) { hideSlashMenu(); return; }
  slashMenuIndex = 0;
  renderSlashMenu();
  showSlashMenu();
}

function renderSlashMenu() {
  slashMenuList.innerHTML = slashMenuItems.map((t, i) =>
    `<div class="slash-menu-item${i === slashMenuIndex ? " active" : ""}" data-idx="${i}">
       <span class="slash-menu-item-name">/${t.name}</span>
       <div class="slash-menu-item-desc"><span>${t.description}</span></div>
     </div>`
  ).join("");
  // Calculate scroll distance for overflowing descriptions
  slashMenuList.querySelectorAll(".slash-menu-item-desc").forEach(desc => {
    const span = desc.querySelector("span");
    if (!span) return;
    const overflow = span.scrollWidth - desc.clientWidth;
    span.style.setProperty("--scroll-dist", overflow > 0 ? `-${overflow}px` : "0px");
  });
  const active = slashMenuList.querySelector(".slash-menu-item.active");
  if (active) active.scrollIntoView({ block: "nearest" });
}

function showSlashMenu() { slashMenu.hidden = false; slashMenuVisible = true; }
function hideSlashMenu() { slashMenu.hidden = true; slashMenuVisible = false; }

function selectSlashItem(idx) {
  const tool = slashMenuItems[idx];
  if (!tool) return;
  slashSelectedTool = tool.name;
  chatInput.value = `/${tool.name} `;
  chatInput.focus();
  hideSlashMenu();
  autoResize();
  sendBtn.disabled = false;
}

slashMenuList.addEventListener("click", (e) => {
  const item = e.target.closest(".slash-menu-item");
  if (item) selectSlashItem(+item.dataset.idx);
});

// === Handle LLM response (shared by sendMessage + sendContinuation) ===
function handleLlmResponseExtras(payload) {
  // Handle connector events (open/close panel)
  if (payload.connectorEvent) {
    const evt = payload.connectorEvent;
    if (evt.action === "connect") openConnectorPanel(evt);
    else if (evt.action === "disconnect") disconnectConnectorUI();
  }
  // Log DTI tool calls to connector panel
  if (payload.toolLog) {
    const log = payload.toolLog;
    for (let i = 0; i < log.length; i++) {
      const entry = log[i];
      if (entry.type === "tool_call" && (entry.source === "dti" || CONNECTOR_TOOL_NAMES.has(entry.tool))) {
        const resultEntry = log.slice(i + 1).find((e) => e.type === "tool_result" && e.tool === entry.tool);
        addConnectorLogEntry(entry.tool, resultEntry?.result || "");
      }
    }
  }
  // Feed console log entries
  addConsoleEntries(payload.toolLog);
  // Show "Weitermachen" button if continuation available
  if (payload.continuationAvailable) {
    showContinuationButton();
  }
}

function showContinuationButton() {
  // Remove any existing continuation button
  chatMessages.querySelectorAll(".continuation-wrap").forEach(el => el.remove());
  const wrap = document.createElement("div");
  wrap.className = "continuation-wrap";
  const btnContinue = document.createElement("button");
  btnContinue.className = "continuation-btn";
  btnContinue.textContent = "Weitermachen";
  btnContinue.addEventListener("click", () => sendContinuation(wrap));
  const btnAll = document.createElement("button");
  btnAll.className = "continuation-btn continuation-btn-all";
  btnAll.textContent = "Alle ausführen";
  btnAll.addEventListener("click", () => sendContinuationAll(wrap));
  wrap.appendChild(btnContinue);
  wrap.appendChild(btnAll);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendContinuation(wrapElement) {
  if (isWaiting) return;
  if (wrapElement) wrapElement.remove();

  messages.push({ role: "user", content: "Weitermachen" });
  isWaiting = true;
  renderMessages();

  const result = await apiRequest("/apps/aas-chat/api/messages", {
    method: "POST",
    body: { continuation: true, chatId: currentChatId },
  });

  isWaiting = false;

  if (result.ok && result.payload?.reply) {
    const assistantMsg = { role: "assistant", content: result.payload.reply };
    if (result.payload.toolLog) assistantMsg.toolLog = result.payload.toolLog;
    messages.push(assistantMsg);
    renderMessages();
    handleLlmResponseExtras(result.payload);
  } else {
    renderMessages();
    showErrorBubble("errGeneric");
  }

  sendBtn.disabled = !chatInput.value.trim();
}

async function sendContinuationAll(wrapElement) {
  if (isWaiting) return;
  if (wrapElement) wrapElement.remove();

  messages.push({ role: "user", content: "Alle ausführen" });
  isWaiting = true;
  renderMessages();

  let keepGoing = true;
  while (keepGoing) {
    const result = await apiRequest("/apps/aas-chat/api/messages", {
      method: "POST",
      body: { continuation: true, chatId: currentChatId },
    });

    if (result.ok && result.payload?.reply) {
      // Replace last assistant "Weitermachen?" bubble with updated reply
      const lastIdx = messages.length - 1;
      if (lastIdx >= 0 && messages[lastIdx].role === "assistant") {
        messages[lastIdx] = { role: "assistant", content: result.payload.reply };
        if (result.payload.toolLog) messages[lastIdx].toolLog = result.payload.toolLog;
      } else {
        const assistantMsg = { role: "assistant", content: result.payload.reply };
        if (result.payload.toolLog) assistantMsg.toolLog = result.payload.toolLog;
        messages.push(assistantMsg);
      }
      renderMessages();

      // Process connector events and tool logs
      if (result.payload.connectorEvent) {
        const evt = result.payload.connectorEvent;
        if (evt.action === "connect") openConnectorPanel(evt);
        else if (evt.action === "disconnect") disconnectConnectorUI();
      }
      if (result.payload.toolLog) {
        const log = result.payload.toolLog;
        for (let i = 0; i < log.length; i++) {
          const entry = log[i];
          if (entry.type === "tool_call" && (entry.source === "dti" || CONNECTOR_TOOL_NAMES.has(entry.tool))) {
            const resultEntry = log.slice(i + 1).find((e) => e.type === "tool_result" && e.tool === entry.tool);
            addConnectorLogEntry(entry.tool, resultEntry?.result || "");
          }
        }
        addConsoleEntries(log);
      }

      if (result.payload.continuationAvailable) {
        // Another batch needed — loop continues automatically
        continue;
      } else {
        keepGoing = false;
      }
    } else {
      keepGoing = false;
      renderMessages();
      showErrorBubble("errGeneric");
    }
  }

  isWaiting = false;
  renderMessages();
  sendBtn.disabled = !chatInput.value.trim();
}

// === Send message ===
async function sendMessage(content) {
  if (isWaiting) return;

  // Detect slash-command: /toolName or /toolName data...
  let forceTool = null;
  let sendContent = content;
  const slashMatch = content.match(/^\/(\S+)(?:\s+([\s\S]+))?$/);
  if (slashMatch && cachedToolList.some(t => t.name === slashMatch[1])) {
    forceTool = slashMatch[1];
    sendContent = slashMatch[2] || "";
  }
  slashSelectedTool = null;

  // Show user message immediately
  messages.push({ role: "user", content });
  isWaiting = true;
  renderMessages();

  chatInput.value = "";
  chatInput.style.height = "auto";
  sendBtn.disabled = true;

  const body = { content: sendContent, mode: chatMode, chatId: currentChatId };
  if (forceTool) body.forceTool = forceTool;

  const result = await apiRequest("/apps/aas-chat/api/messages", {
    method: "POST",
    body,
  });

  isWaiting = false;

  if (result.ok && result.payload?.reply) {
    const assistantMsg = { role: "assistant", content: result.payload.reply };
    if (result.payload.toolLog) {
      assistantMsg.toolLog = result.payload.toolLog;
    }
    messages.push(assistantMsg);
    renderMessages();
    handleLlmResponseExtras(result.payload);

    // Move this chat to top of list
    const idx = chatList.findIndex(c => c.chat_id === currentChatId);
    if (idx > 0) {
      const [chat] = chatList.splice(idx, 1);
      chat.updated_at = new Date().toISOString();
      chatList.unshift(chat);
      renderChatList();
    }
  } else {
    // Remove optimistic user message on error (server didn't save it for NO_API_KEY)
    const errCode = result.payload?.error || "";
    if (errCode === "NO_API_KEY") {
      messages.pop();
    }

    // Render first (clears typing indicator), then show error bubble
    renderMessages();

    if (errCode === "NO_API_KEY") {
      showErrorBubble("errNoKey");
    } else if (errCode === "API_KEY_INVALID") {
      showErrorBubble("errInvalidKey");
    } else if (errCode === "RATE_LIMIT") {
      showErrorBubble("errRateLimit");
    } else {
      showErrorBubble("errGeneric");
    }
  }

  sendBtn.disabled = !chatInput.value.trim();
}

// === Clear chat ===
async function clearChat() {
  if (!currentChatId) return;
  const result = await apiRequest(`/apps/aas-chat/api/messages?chatId=${currentChatId}`, { method: "DELETE" });
  if (result.ok) {
    messages = [];
    consoleEntries = [];
    rawJsonRpcEntries = [];
    renderMessages();
    if (devConsoleOpen) renderConsole();
    // Disconnect connector if connected
    if (connectedConnectorName) {
      await apiRequest("/apps/aas-chat/api/connector-disconnect", { method: "POST", body: { chatId: currentChatId } });
      disconnectConnectorUI();
    }
  }
}

// === Auto-resize textarea ===
function autoResize() {
  chatInput.style.height = "auto";
  const maxH = window.innerHeight * 0.4;
  chatInput.style.height = Math.min(chatInput.scrollHeight, maxH) + "px";
  sendBtn.disabled = isWaiting || !chatInput.value.trim();
}

// === Speech-to-text ===
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = locale === "de" ? "de-DE" : "en-US";

  let preRecordText = "";
  let finalTranscript = "";

  recognition.onresult = (e) => {
    let interim = "";
    finalTranscript = "";
    for (let i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        finalTranscript += e.results[i][0].transcript;
      } else {
        interim += e.results[i][0].transcript;
      }
    }
    const sep = preRecordText && !preRecordText.endsWith(" ") ? " " : "";
    chatInput.value = preRecordText + sep + finalTranscript + interim;
    autoResize();
  };

  recognition.onend = () => {
    if (isRecording) {
      // Browser stopped unexpectedly — restart
      recognition.start();
    }
  };

  recognition.onerror = (e) => {
    if (e.error !== "aborted" && e.error !== "no-speech") {
      stopRecording();
    }
  };
}

function startRecording() {
  if (!recognition) return;
  recognition.lang = locale === "de" ? "de-DE" : "en-US";
  preRecordText = chatInput.value;
  finalTranscript = "";
  isRecording = true;
  recognition.start();
  micBtn.classList.add("recording");
}

function stopRecording() {
  if (!recognition) return;
  isRecording = false;
  recognition.stop();
  micBtn.classList.remove("recording");
  autoResize();
}

micBtn.addEventListener("click", () => {
  if (!recognition) {
    alert(t("micNotSupported"));
    return;
  }
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

// === Settings ===
function updateModelDropdown(provider, selectedModel) {
  const models = PROVIDER_MODELS[provider] || PROVIDER_MODELS.gemini;
  settingsModel.innerHTML = "";
  for (const m of models) {
    const opt = document.createElement("option");
    opt.value = m.value;
    opt.textContent = m.label;
    settingsModel.appendChild(opt);
  }
  if (selectedModel) settingsModel.value = selectedModel;
  // If the selected model isn't in the list, pick the first one
  if (!settingsModel.value) settingsModel.value = models[0].value;
}

settingsProvider.addEventListener("change", () => {
  updateModelDropdown(settingsProvider.value);
  const providerKey = `apikeyDesc_${settingsProvider.value}`;
  document.getElementById("settings-apikey-desc").textContent = t(providerKey) !== providerKey ? t(providerKey) : t("apikeyDesc");
  activeProvider = settingsProvider.value;
  updateModeToggle();
});
settingsAasUrl.addEventListener("input", () => updateModeToggle());

async function loadSettings() {
  const result = await apiRequest("/apps/aas-chat/api/settings");
  if (result.ok && result.payload) {
    const s = result.payload;
    activeProvider = s.provider || "gemini";
    settingsProvider.value = activeProvider;
    updateModelDropdown(activeProvider, s.model);
    settingsApiKey.value = s.has_api_key ? s.api_key_masked : "";
    settingsAasUrl.value = s.aas_url || "";
    enabledMcps = s.enabled_mcps || ["aas", "dti"];
    mcpAasCheckbox.checked = enabledMcps.includes("aas");
    mcpDtiCheckbox.checked = enabledMcps.includes("dti");
    settingsBasePrompt.value = s.base_prompt || s.default_base_prompt || "";
    updateModeToggle();
  } else {
    updateModelDropdown(settingsProvider.value);
  }
}

async function saveSettings() {
  settingsSaveBtn.disabled = true;
  const result = await apiRequest("/apps/aas-chat/api/settings", {
    method: "PUT",
    body: {
      provider: settingsProvider.value,
      model: settingsModel.value,
      api_key: settingsApiKey.value,
      aas_url: settingsAasUrl.value,
      enabled_mcps: [
        ...(mcpAasCheckbox.checked ? ["aas"] : []),
        ...(mcpDtiCheckbox.checked ? ["dti"] : []),
      ],
      base_prompt: settingsBasePrompt.value,
    },
  });

  settingsHint.hidden = false;
  if (result.ok) {
    settingsHint.className = "settings-hint hint-success";
    settingsHint.textContent = t("saved");
    // Reload to show masked key + update tool list
    await loadSettings();
    rebuildCachedToolList();
  } else {
    settingsHint.className = "settings-hint hint-error";
    settingsHint.textContent = t("saveFailed");
  }
  settingsSaveBtn.disabled = false;

  setTimeout(() => { settingsHint.hidden = true; }, 3000);
}

settingsSaveBtn.addEventListener("click", saveSettings);

// === Docs page ===

function renderToolList(container, tools) {
  if (tools && tools.length) {
    container.innerHTML = tools
      .map((t) => `<div class="mcp-tool-item"><div class="mcp-tool-name">${escHtml(t.name)}</div><div class="mcp-tool-desc">${escHtml(t.description)}</div></div>`)
      .join("");
  } else {
    container.innerHTML = `<div class="mcp-tool-item" style="color:var(--text-2);font-size:0.78rem">Keine Tools verfügbar.</div>`;
  }
}

async function loadDocsTools() {
  const aasList = document.getElementById("docs-aas-list");
  const connList = document.getElementById("docs-connector-list");
  aasList.innerHTML = connList.innerHTML = `<div class="mcp-tool-item" style="color:var(--text-2);font-size:0.78rem">Lade Tools…</div>`;
  const [aasRes, connRes] = await Promise.allSettled([
    apiRequest("/apps/aas-chat/api/mcp-tools"),
    apiRequest("/apps/aas-chat/api/dti-tools"),
  ]);
  renderToolList(aasList, aasRes.status === "fulfilled" && aasRes.value.ok ? aasRes.value.payload.tools : null);
  renderToolList(connList, connRes.status === "fulfilled" && connRes.value.ok ? connRes.value.payload.tools : null);
}

// Docs pill switcher
document.querySelectorAll("#docs-pills .settings-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#docs-pills .settings-pill").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".docs-tab").forEach((t) => t.classList.remove("active"));
    pill.classList.add("active");
    const tab = document.getElementById("docs-tab-" + pill.dataset.docsTab);
    if (tab) tab.classList.add("active");
  });
});

// === Settings tab switching (Pill-Switcher) ===
document.querySelectorAll("#page-settings .settings-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#page-settings .settings-pill").forEach((p) => p.classList.remove("active"));
    document.querySelectorAll(".settings-tab").forEach((t) => t.classList.remove("active"));
    pill.classList.add("active");
    const tab = document.getElementById("settings-tab-" + pill.dataset.tab);
    if (tab) tab.classList.add("active");
  });
});

// Toggle API key visibility (CSS-based, no type="password" to avoid browser password manager)
toggleKeyVis.addEventListener("click", () => {
  settingsApiKey.classList.toggle("apikey-masked");
  settingsApiKey.classList.toggle("apikey-visible");
});

// Clear placeholder on focus so user can type new key
settingsApiKey.addEventListener("focus", () => {
  if (settingsApiKey.value.startsWith("•")) {
    settingsApiKey.value = "";
    settingsApiKey.classList.remove("apikey-masked");
    settingsApiKey.classList.add("apikey-visible");
  }
});

// === i18n apply ===
function applyLocaleToUI() {
  document.getElementById("brand-text").textContent = t("brandText");
  document.getElementById("nav-chat-label").textContent = t("navChat");
  document.getElementById("nav-docs-label").textContent = t("navDocs");
  document.getElementById("nav-settings-label").textContent = t("navSettings");
  document.getElementById("empty-text").textContent = t("emptyText");
  chatInput.placeholder = t("placeholder");
  document.getElementById("settings-title").textContent = t("settingsTitle");
  document.getElementById("settings-desc").textContent = t("settingsDesc");
  document.getElementById("settings-provider-title").textContent = t("providerTitle");
  document.getElementById("settings-provider-desc").textContent = t("providerDesc");
  document.getElementById("lbl-provider").textContent = t("lblProvider");
  document.getElementById("lbl-model").textContent = t("lblModel");
  document.getElementById("settings-apikey-title").textContent = t("apikeyTitle");
  const providerKey = `apikeyDesc_${settingsProvider.value}`;
  document.getElementById("settings-apikey-desc").textContent = t(providerKey) !== providerKey ? t(providerKey) : t("apikeyDesc");
  document.getElementById("settings-endpoint-title").textContent = t("endpointTitle");
  document.getElementById("settings-endpoint-desc").textContent = t("endpointDesc");
  document.getElementById("settings-prompt-title").textContent = t("promptTitle");
  document.getElementById("settings-prompt-desc").textContent = t("promptDesc");
  document.getElementById("reset-prompt-label").textContent = t("promptReset");
  document.getElementById("docs-title").textContent = t("docsTitle");
  document.getElementById("docs-desc").textContent = t("docsDesc");
  document.getElementById("settings-save-label").textContent = t("saveBtn");
  document.getElementById("confirm-text").textContent = t("confirmText");
  confirmCancel.textContent = t("confirmCancel");
  confirmOk.textContent = t("confirmOk");
  logoutBtn.textContent = t("logout");
}

function setLocale(lang) {
  locale = lang;
  localStorage.setItem("kanban-locale", lang);
  document.documentElement.lang = lang;
  localeDeBtn.classList.toggle("active", lang === "de");
  localeEnBtn.classList.toggle("active", lang === "en");
  localeDeBtn.setAttribute("aria-checked", String(lang === "de"));
  localeEnBtn.setAttribute("aria-checked", String(lang === "en"));
  applyLocaleToUI();
}

// === Event Listeners ===

// Send
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = chatInput.value.trim();
  if (!content || isWaiting) return;
  sendMessage(content);
});

// Keyboard: slash-menu navigation + Enter-to-send
chatInput.addEventListener("keydown", (e) => {
  if (slashMenuVisible) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      slashMenuIndex = Math.min(slashMenuIndex + 1, slashMenuItems.length - 1);
      renderSlashMenu();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      slashMenuIndex = Math.max(slashMenuIndex - 1, 0);
      renderSlashMenu();
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      selectSlashItem(slashMenuIndex);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      hideSlashMenu();
      return;
    }
  }
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const content = chatInput.value.trim();
    if (content && !isWaiting) {
      sendMessage(content);
    }
  }
});

// Auto-resize + slash-menu
chatInput.addEventListener("input", () => {
  autoResize();
  handleSlashMenu();
  // Reset selected tool when input is cleared or "/" removed
  if (!chatInput.value.startsWith("/")) slashSelectedTool = null;
});

// Reset base prompt to default
resetBasePromptBtn.addEventListener("click", async () => {
  const res = await apiRequest("/apps/aas-chat/api/settings");
  if (res.ok && res.payload?.default_base_prompt) {
    settingsBasePrompt.value = res.payload.default_base_prompt;
  }
});

// Mode toggle (AAS Tools ↔ Web Search)
modeToggle.addEventListener("click", () => {
  chatMode = chatMode === "tools" ? "search" : "tools";
  const isTools = chatMode === "tools";
  modeLabel.textContent = isTools ? "MCP" : "WEB";
  modeToggle.classList.toggle("mode-search", !isTools);
});

// Clear chat (inline button)
clearChatInline.addEventListener("click", () => {
  if (messages.length === 0) return;
  confirmDialog.showModal();
});
confirmCancel.addEventListener("click", () => confirmDialog.close());
confirmOk.addEventListener("click", () => {
  confirmDialog.close();
  clearChat();
});

// Developer Console
consoleToggleBtn.addEventListener("click", toggleDevConsole);
consoleClear.addEventListener("click", clearConsole);
consoleClose.addEventListener("click", closeDevConsole);
document.querySelectorAll(".console-tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".console-tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    consoleActiveTab = btn.dataset.tab;
    renderConsole();
  });
});

// Connector panel close + toggle
connectorPanelClose?.addEventListener("click", closeConnectorPanel);
connectorToggle?.addEventListener("click", toggleConnectorPanel);

// Lightbox
const lightboxDialog = document.getElementById("lightbox-dialog");
lightboxDialog.addEventListener("click", (e) => {
  if (e.target === lightboxDialog || e.target.id === "lightbox-close") {
    lightboxDialog.close();
  }
});

// User menu
userMenuToggle.addEventListener("click", () => {
  const isHidden = userMenu.hidden;
  userMenu.hidden = !isHidden;
  userMenuToggle.setAttribute("aria-expanded", String(!isHidden));
});
document.addEventListener("click", (e) => {
  if (!userMenuToggle.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.hidden = true;
    userMenuToggle.setAttribute("aria-expanded", "false");
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await apiRequest("/auth/logout", { method: "POST" });
  window.location.href = "/";
});

// Locale
localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// === Init ===
async function init() {
  const userResult = await apiRequest("/api/me");
  if (userResult.ok && userResult.payload) {
    currentUser = userResult.payload;
    userInitials.textContent = getInitials(currentUser.name);
    userInfo.textContent = currentUser.name || currentUser.email || "";
  }

  try { setLocale(locale); } catch { /* ignore render errors */ }
  await loadSettings();

  // Load chat list and open most recent (or create first chat)
  await loadChatList();
  if (chatList.length === 0) {
    await createNewChat();
  } else {
    await switchChat(chatList[0].chat_id);
  }

  // Load tool list for slash-command autocomplete (AAS + DTI)
  const [aasToolsRes, dtiToolsRes] = await Promise.allSettled([
    apiRequest("/apps/aas-chat/api/mcp-tools"),
    apiRequest("/apps/aas-chat/api/dti-tools"),
  ]);
  allAasTools = aasToolsRes.status === "fulfilled" && aasToolsRes.value.ok ? aasToolsRes.value.payload.tools : [];
  allDtiTools = dtiToolsRes.status === "fulfilled" && dtiToolsRes.value.ok ? dtiToolsRes.value.payload.tools : [];
  rebuildCachedToolList();
}

init();
