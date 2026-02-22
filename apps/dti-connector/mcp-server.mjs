// ---------------------------------------------------------------------------
// DTI Connector MCP Server
// Standalone MCP server providing tools for DTI Connector management
// Transport: stdio (JSON-RPC 2.0)
// Context passed via env: DTI_USER_ID, DTI_CONNECTOR_ID (optional), DTI_ROLE (optional)
// ---------------------------------------------------------------------------
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const db = require(path.join(__dirname, "../../shared/db"));

// Open the database — MCP server runs as child process, so db.open() hasn't been called yet
db.open(path.join(__dirname, "../../data/platform.db"));

const USER_ID = process.env.DTI_USER_ID || "";
const CONNECTOR_ID = process.env.DTI_CONNECTOR_ID || "";
const ROLE = process.env.DTI_ROLE || "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function textResult(msg) {
  return { content: [{ type: "text", text: msg }] };
}

function errorResult(msg) {
  return { content: [{ type: "text", text: `Fehler: ${msg}` }], isError: true };
}

function requireConnector() {
  if (!CONNECTOR_ID) return "Kein Connector verbunden. Nutze connectConnector zuerst.";
  return null;
}

function requireEditor() {
  const err = requireConnector();
  if (err) return err;
  if (ROLE === "viewer") return "Du benötigst Editor- oder Owner-Rechte.";
  return null;
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer(
  { name: "dti-connector", version: "1.0.0" },
  {
    instructions:
      "Du hast Zugriff auf DTI Connector Tools zur Verwaltung von Produkt-Datenmodellen.\n\n" +
      "REGELN:\n" +
      "- Verbindungs-Tools (listConnectors, connectConnector, disconnectConnector, createConnector) sind immer verfügbar.\n" +
      "- Alle anderen Tools benötigen einen aktiv verbundenen Connector.\n" +
      "- Hierarchy-Levels definieren die Produktstruktur. Model-Datenpunkte definieren die Felder.\n" +
      "- Assets sind die eigentlichen Produkt-Instanzen mit Werten (de/en).\n" +
      "- Schreibende Operationen (set/add/edit/remove/create/delete/rename) erfordern Editor- oder Owner-Rolle.\n" +
      "- Verwende updateAssetValues wenn einzelne Werte geändert oder hinzugefügt werden sollen (bestehende Werte bleiben erhalten).\n" +
      "- Verwende setAssetValues nur wenn ALLE Werte eines Assets komplett ersetzt werden sollen.",
  }
);

// ===== VERBINDUNGS-TOOLS (always available) =====

server.tool(
  "listConnectors",
  "Listet alle DTI Connectoren auf, zu denen der aktuelle Nutzer Zugang hat. Gibt Name, Rolle, Asset-Anzahl und Hierarchy-Level-Anzahl zurück.",
  {},
  async () => {
    try {
      const rows = await db.all(
        `SELECT c.connector_id, c.name, m.role,
           (SELECT COUNT(*) FROM dti_assets a WHERE a.connector_id = c.connector_id) AS asset_count,
           (SELECT COUNT(*) FROM dti_hierarchy_levels h WHERE h.connector_id = c.connector_id) AS hierarchy_count
         FROM dti_connectors c
         JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
         WHERE COALESCE(c.type, 'dti') != 'card-scanner'
         ORDER BY c.name`,
        [USER_ID]
      );
      if (rows.length === 0) return textResult("Keine Connectoren gefunden. Der Nutzer hat keine DTI Connectoren.");
      const lines = rows.map((r) =>
        `- ${r.name} (ID: ${r.connector_id}, Rolle: ${r.role}, Assets: ${r.asset_count}, Hierarchy-Levels: ${r.hierarchy_count})`
      );
      return textResult(`${rows.length} Connector(en) gefunden:\n${lines.join("\n")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "connectConnector",
  "Verbindet mit einem bestimmten DTI Connector anhand Name oder ID. Nach dem Verbinden stehen Hierarchy- und Daten-Tools zur Verfügung.",
  {
    nameOrId: z.string().describe("Connector-Name (case-insensitive, auch Teilmatch) oder connector_id (UUID)."),
  },
  async ({ nameOrId }) => {
    try {
      const input = (nameOrId || "").trim();
      if (!input) return errorResult("nameOrId Parameter ist erforderlich.");

      const typeFilter = "AND COALESCE(c.type, 'dti') != 'card-scanner'";
      let row = await db.get(
        `SELECT c.connector_id, c.name, m.role FROM dti_connectors c
         JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
         WHERE c.connector_id = ? ${typeFilter}`,
        [USER_ID, input]
      );
      if (!row) {
        row = await db.get(
          `SELECT c.connector_id, c.name, m.role FROM dti_connectors c
           JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
           WHERE LOWER(c.name) = LOWER(?) ${typeFilter}`,
          [USER_ID, input]
        );
      }
      if (!row) {
        row = await db.get(
          `SELECT c.connector_id, c.name, m.role FROM dti_connectors c
           JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
           WHERE LOWER(c.name) LIKE LOWER(?) ${typeFilter}`,
          [USER_ID, `%${input}%`]
        );
      }
      if (!row) {
        const words = input.split(/\s+/).filter(w => w.length >= 2);
        for (const word of words) {
          row = await db.get(
            `SELECT c.connector_id, c.name, m.role FROM dti_connectors c
             JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
             WHERE LOWER(c.name) LIKE LOWER(?) ${typeFilter}`,
            [USER_ID, `%${word}%`]
          );
          if (row) break;
        }
      }
      if (!row) {
        const all = await db.all(
          `SELECT c.name FROM dti_connectors c
           JOIN connector_members m ON m.connector_id = c.connector_id AND m.user_id = ?
           WHERE COALESCE(c.type, 'dti') != 'card-scanner'`,
          [USER_ID]
        );
        if (all.length === 0) return textResult("Du hast noch keine Connectors. Erstelle einen mit createConnector.");
        const names = all.map(r => r.name).join(", ");
        return textResult(`Kein Connector gefunden für "${input}". Verfügbare Connectors: ${names}`);
      }

      // Store active connector
      await db.run(
        "UPDATE aas_chat_settings SET active_connector_id = ? WHERE user_id = ?",
        [row.connector_id, USER_ID]
      );

      const assetCount = (await db.get(
        "SELECT COUNT(*) AS cnt FROM dti_assets WHERE connector_id = ?", [row.connector_id]
      ))?.cnt || 0;
      const hierCount = (await db.get(
        "SELECT COUNT(*) AS cnt FROM dti_hierarchy_levels WHERE connector_id = ?", [row.connector_id]
      ))?.cnt || 0;

      // Encode connector event as JSON in the text so the backend can parse it
      const event = JSON.stringify({
        __connectorEvent: {
          action: "connect",
          connectorId: row.connector_id,
          name: row.name,
          role: row.role,
          assetCount,
          hierarchyCount: hierCount,
        },
      });

      return textResult(`Verbunden mit "${row.name}" (Rolle: ${row.role}). Assets: ${assetCount}, Hierarchy-Levels: ${hierCount}.\n${event}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "disconnectConnector",
  "Trennt die Verbindung zum aktuell aktiven DTI Connector.",
  {},
  async () => {
    try {
      await db.run(
        "UPDATE aas_chat_settings SET active_connector_id = NULL WHERE user_id = ?",
        [USER_ID]
      );
      const event = JSON.stringify({ __connectorEvent: { action: "disconnect" } });
      return textResult(`Verbindung zum DTI Connector getrennt.\n${event}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "createConnector",
  "Erstellt einen neuen DTI Connector. Der Nutzer wird automatisch Owner.",
  {
    name: z.string().describe("Name des neuen Connectors (max. 100 Zeichen)."),
  },
  async ({ name }) => {
    try {
      const cName = (name || "").trim();
      if (!cName || cName.length > 100) return errorResult("Name ist erforderlich (max. 100 Zeichen).");
      const connectorId = crypto.randomUUID();
      const apiKey = crypto.randomUUID();
      await db.run(
        "INSERT INTO dti_connectors (connector_id, user_id, name, api_key) VALUES (?, ?, ?, ?)",
        [connectorId, USER_ID, cName, apiKey]
      );
      await db.run(
        "INSERT INTO connector_members (connector_id, user_id, role) VALUES (?, ?, 'owner')",
        [connectorId, USER_ID]
      );
      return textResult(`Connector "${cName}" erstellt (ID: ${connectorId}). Du bist Owner.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// ===== HIERARCHY-TOOLS (require connected connector) =====

server.tool(
  "getHierarchyLevels",
  "Gibt die HIERARCHY-EBENEN (z.B. Brand > ProductLine > Model) des Connectors zurück. NICHT für Datenpunkte/Felder — dafür getModelDatapoints nutzen.",
  {},
  async () => {
    try {
      const err = requireConnector();
      if (err) return errorResult(err);
      const rows = await db.all(
        "SELECT level, name FROM dti_hierarchy_levels WHERE connector_id = ? ORDER BY level",
        [CONNECTOR_ID]
      );
      if (rows.length === 0) return textResult("Keine Hierarchy-Levels für diesen Connector definiert.");
      const lines = rows.map((r) => `${r.level}. ${r.name}`);
      return textResult(`Hierarchy-Levels:\n${lines.join("\n")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "setHierarchyLevels",
  "Aktualisiert die Hierarchy-Levels des verbundenen Connectors. Erfordert Editor- oder Owner-Rolle. Eingabe: Array von Level-Namen in Reihenfolge.",
  {
    levels: z.array(z.string()).describe("Geordnete Liste der Hierarchy-Level-Namen, z.B. ['Brand', 'ProductLine', 'Model']."),
  },
  async ({ levels }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      if (!Array.isArray(levels) || levels.length === 0) return errorResult("levels muss ein nicht-leeres Array von Strings sein.");

      const namePattern = /^[A-Za-z0-9_-]+$/;
      for (const n of levels) {
        if (!namePattern.test(n) || n.length > 60) {
          return errorResult(`Ungültiger Level-Name "${n}". Nur Buchstaben, Zahlen, _ und - erlaubt (max. 60 Zeichen).`);
        }
      }

      await db.run("DELETE FROM dti_hierarchy_levels WHERE connector_id = ?", [CONNECTOR_ID]);
      for (let i = 0; i < levels.length; i++) {
        await db.run(
          "INSERT INTO dti_hierarchy_levels (connector_id, level, name) VALUES (?, ?, ?)",
          [CONNECTOR_ID, i + 1, String(levels[i]).trim()]
        );
      }
      return textResult(`Hierarchy-Levels aktualisiert: ${levels.join(" > ")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// ===== MODELL-TOOLS (require connected connector) =====

server.tool(
  "getModelDatapoints",
  "Gibt das DATENPUNKT-SCHEMA (Felder/Attribute wie 'product.name', 'image' etc.) des Connectors zurück. NICHT für Hierarchy-Ebenen — dafür getHierarchyLevels nutzen.",
  {},
  async () => {
    try {
      const err = requireConnector();
      if (err) return errorResult(err);
      const rows = await db.all(
        "SELECT dp_id AS id, name, type FROM dti_model_datapoints WHERE connector_id = ? ORDER BY sort_order",
        [CONNECTOR_ID]
      );
      if (rows.length === 0) return textResult("Keine Datenpunkte im Modell definiert.");
      const lines = rows.map((r) =>
        `- ${r.id} | ${r.name || "(kein Name)"} | Typ: ${r.type === 1 ? "Datei" : "Text"}`
      );
      return textResult(`${rows.length} Datenpunkt(e):\n${lines.join("\n")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "setModelDatapoints",
  "Ersetzt ALLE Modell-Datenpunkte des Connectors auf einmal. Verwenden wenn der Nutzer das Modell ersetzen, setzen oder überschreiben will. Erfordert Editor- oder Owner-Rolle. Typ 0 = Text, Typ 1 = Datei.",
  {
    datapoints: z.array(z.object({
      id: z.string().describe("Eindeutige ID (alphanumerisch, Punkt, Unterstrich). z.B. 'product.name'"),
      name: z.string().describe("Anzeigename, z.B. 'Produktname'"),
      type: z.number().describe("0 = Text, 1 = Datei"),
    })).describe("Geordnete Liste der Datenpunkte."),
  },
  async ({ datapoints }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      if (!Array.isArray(datapoints) || datapoints.length === 0) return errorResult("datapoints muss ein nicht-leeres Array sein.");

      const idPattern = /^[A-Za-z0-9._]+$/;
      const deduped = new Map();
      for (const dp of datapoints) {
        if (!dp.id || typeof dp.id !== "string") continue;
        if (!idPattern.test(dp.id) || dp.id.length > 120) continue;
        dp.type = Number(dp.type);
        if (dp.type !== 0 && dp.type !== 1) dp.type = 0;
        deduped.set(dp.id.toLowerCase(), dp);
      }
      const uniqueItems = [...deduped.values()];
      if (uniqueItems.length === 0) return errorResult("Keine gültigen Datenpunkte gefunden.");

      await db.run("DELETE FROM dti_model_datapoints WHERE connector_id = ?", [CONNECTOR_ID]);
      for (let i = 0; i < uniqueItems.length; i++) {
        await db.run(
          "INSERT INTO dti_model_datapoints (connector_id, dp_id, name, type, sort_order) VALUES (?, ?, ?, ?, ?)",
          [CONNECTOR_ID, uniqueItems[i].id, (uniqueItems[i].name || "").trim(), uniqueItems[i].type, i]
        );
      }

      const validIds = uniqueItems.map((dp) => dp.id);
      const placeholders = validIds.map(() => "?").join(",");
      await db.run(
        `DELETE FROM dti_asset_values WHERE connector_id = ? AND key NOT IN (${placeholders})`,
        [CONNECTOR_ID, ...validIds]
      );

      const skipped = datapoints.length - uniqueItems.length;
      const skippedInfo = skipped > 0 ? ` (${skipped} Duplikat${skipped !== 1 ? "e" : ""} entfernt)` : "";
      return textResult(`Modell aktualisiert: ${uniqueItems.length} Datenpunkt(e) gesetzt.${skippedInfo}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "addModelDatapoint",
  "Fügt Datenpunkte am Ende des bestehenden Modells hinzu ohne bestehende zu löschen. Verwenden wenn der Nutzer Datenpunkte hinzufügen oder ergänzen will. Erfordert Editor- oder Owner-Rolle.",
  {
    id: z.string().describe("Eindeutige ID (alphanumerisch, Punkt, Unterstrich)."),
    name: z.string().describe("Anzeigename."),
    type: z.number().describe("0 = Text, 1 = Datei."),
  },
  async ({ id, name, type }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      if (!id || typeof id !== "string") return errorResult("id ist erforderlich.");
      const idPattern = /^[A-Za-z0-9._]+$/;
      if (!idPattern.test(id) || id.length > 120) return errorResult(`Ungültige id "${id}".`);
      const typeNum = Number(type);
      if (typeNum !== 0 && typeNum !== 1) return errorResult("type muss 0 oder 1 sein.");

      const existing = await db.get(
        "SELECT dp_id FROM dti_model_datapoints WHERE connector_id = ? AND LOWER(dp_id) = LOWER(?)",
        [CONNECTOR_ID, id]
      );
      if (existing) return errorResult(`Datenpunkt "${id}" existiert bereits.`);

      const maxOrder = (await db.get(
        "SELECT MAX(sort_order) AS m FROM dti_model_datapoints WHERE connector_id = ?", [CONNECTOR_ID]
      ))?.m ?? -1;

      await db.run(
        "INSERT INTO dti_model_datapoints (connector_id, dp_id, name, type, sort_order) VALUES (?, ?, ?, ?, ?)",
        [CONNECTOR_ID, id, (name || "").trim(), typeNum, maxOrder + 1]
      );
      return textResult(`Datenpunkt "${id}" (${name || id}) hinzugefügt.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "editModelDatapoint",
  "Ändert Name und/oder Typ eines bestehenden Datenpunkts. Erfordert Editor- oder Owner-Rolle.",
  {
    dpId: z.string().describe("Die ID des zu ändernden Datenpunkts."),
    name: z.string().optional().describe("Neuer Anzeigename (optional)."),
    type: z.number().optional().describe("Neuer Typ: 0 = Text, 1 = Datei (optional)."),
  },
  async ({ dpId, name: newName, type: newType }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const id = (dpId || "").trim();
      if (!id) return errorResult("dpId ist erforderlich.");

      const existing = await db.get(
        "SELECT dp_id, name, type FROM dti_model_datapoints WHERE connector_id = ? AND dp_id = ?",
        [CONNECTOR_ID, id]
      );
      if (!existing) return errorResult(`Datenpunkt "${id}" nicht gefunden.`);

      const finalName = newName != null ? String(newName).trim() : null;
      const finalType = newType != null ? Number(newType) : null;

      if (finalName === null && finalType === null) return errorResult("Mindestens name oder type muss angegeben werden.");
      if (finalType !== null && finalType !== 0 && finalType !== 1) return errorResult("type muss 0 (Text) oder 1 (Datei) sein.");

      const updates = [];
      const params = [];
      if (finalName !== null) { updates.push("name = ?"); params.push(finalName); }
      if (finalType !== null) { updates.push("type = ?"); params.push(finalType); }
      params.push(CONNECTOR_ID, id);

      await db.run(
        `UPDATE dti_model_datapoints SET ${updates.join(", ")} WHERE connector_id = ? AND dp_id = ?`,
        params
      );

      const changes = [];
      if (finalName !== null) changes.push(`Name → "${finalName}"`);
      if (finalType !== null) changes.push(`Typ → ${finalType === 0 ? "Text" : "Datei"}`);
      return textResult(`Datenpunkt "${id}" aktualisiert: ${changes.join(", ")}.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "removeModelDatapoint",
  "Entfernt einen Datenpunkt aus dem Modell anhand seiner ID. Erfordert Editor- oder Owner-Rolle. Zugehörige Asset-Werte werden ebenfalls gelöscht.",
  {
    dpId: z.string().describe("Die ID des zu entfernenden Datenpunkts."),
  },
  async ({ dpId }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const id = (dpId || "").trim();
      if (!id) return errorResult("dpId ist erforderlich.");

      const existing = await db.get(
        "SELECT dp_id FROM dti_model_datapoints WHERE connector_id = ? AND dp_id = ?",
        [CONNECTOR_ID, id]
      );
      if (!existing) return errorResult(`Datenpunkt "${id}" nicht gefunden.`);

      await db.run("DELETE FROM dti_model_datapoints WHERE connector_id = ? AND dp_id = ?", [CONNECTOR_ID, id]);
      await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND key = ?", [CONNECTOR_ID, id]);
      return textResult(`Datenpunkt "${id}" und zugehörige Asset-Werte entfernt.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// ===== ASSET-TOOLS (require connected connector) =====

server.tool(
  "listAssets",
  "Listet alle Assets des verbundenen Connectors auf.",
  {},
  async () => {
    try {
      const err = requireConnector();
      if (err) return errorResult(err);
      const rows = await db.all(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? ORDER BY asset_id",
        [CONNECTOR_ID]
      );
      if (rows.length === 0) return textResult("Keine Assets vorhanden.");
      return textResult(`${rows.length} Asset(s):\n${rows.map(r => r.asset_id).join("\n")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "createAsset",
  "Erstellt ein neues Asset. Die Asset-ID muss alphanumerisch sein (a-z, A-Z, 0-9).",
  {
    asset_id: z.string().describe("Eindeutige Asset-ID (alphanumerisch, max. 120 Zeichen)."),
  },
  async ({ asset_id }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      if (!assetId) return errorResult("asset_id ist erforderlich.");
      if (!/^[a-zA-Z0-9]+$/.test(assetId) || assetId.length > 120) {
        return errorResult(`Ungültige Asset-ID "${assetId}". Nur alphanumerische Zeichen erlaubt (max. 120 Zeichen).`);
      }

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND LOWER(asset_id) = LOWER(?)",
        [CONNECTOR_ID, assetId]
      );
      if (existing) return errorResult(`Asset "${assetId}" existiert bereits.`);

      await db.run("INSERT INTO dti_assets (connector_id, asset_id) VALUES (?, ?)", [CONNECTOR_ID, assetId]);
      return textResult(`Asset "${assetId}" erstellt.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "deleteAsset",
  "Löscht ein Asset und alle zugehörigen Werte. Erfordert Editor- oder Owner-Rolle.",
  {
    asset_id: z.string().describe("Die ID des zu löschenden Assets."),
  },
  async ({ asset_id }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      if (!assetId) return errorResult("asset_id ist erforderlich.");

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
        [CONNECTOR_ID, assetId]
      );
      if (!existing) return errorResult(`Asset "${assetId}" nicht gefunden.`);

      await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [CONNECTOR_ID, assetId]);
      await db.run("DELETE FROM dti_assets WHERE connector_id = ? AND asset_id = ?", [CONNECTOR_ID, assetId]);
      return textResult(`Asset "${assetId}" gelöscht.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "renameAsset",
  "Benennt ein Asset um. Die neue ID muss alphanumerisch sein. Erfordert Editor- oder Owner-Rolle.",
  {
    asset_id: z.string().describe("Aktuelle Asset-ID."),
    new_asset_id: z.string().describe("Neue Asset-ID (alphanumerisch, max. 120 Zeichen)."),
  },
  async ({ asset_id, new_asset_id }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      const newAssetId = (new_asset_id || "").trim();
      if (!assetId || !newAssetId) return errorResult("asset_id und new_asset_id sind erforderlich.");
      if (!/^[a-zA-Z0-9]+$/.test(newAssetId) || newAssetId.length > 120) {
        return errorResult(`Ungültige neue Asset-ID "${newAssetId}". Nur alphanumerische Zeichen erlaubt (max. 120 Zeichen).`);
      }

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
        [CONNECTOR_ID, assetId]
      );
      if (!existing) return errorResult(`Asset "${assetId}" nicht gefunden.`);

      const duplicate = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND LOWER(asset_id) = LOWER(?)",
        [CONNECTOR_ID, newAssetId]
      );
      if (duplicate) return errorResult(`Asset "${newAssetId}" existiert bereits.`);

      await db.run("UPDATE dti_assets SET asset_id = ? WHERE connector_id = ? AND asset_id = ?", [newAssetId, CONNECTOR_ID, assetId]);
      await db.run("UPDATE dti_asset_values SET asset_id = ? WHERE connector_id = ? AND asset_id = ?", [newAssetId, CONNECTOR_ID, assetId]);
      return textResult(`Asset "${assetId}" umbenannt zu "${newAssetId}".`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "getAssetValues",
  "Gibt alle Werte eines Assets zurück (alle Sprachen).",
  {
    asset_id: z.string().describe("Die Asset-ID."),
  },
  async ({ asset_id }) => {
    try {
      const err = requireConnector();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      if (!assetId) return errorResult("asset_id ist erforderlich.");

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
        [CONNECTOR_ID, assetId]
      );
      if (!existing) return errorResult(`Asset "${assetId}" nicht gefunden.`);

      const rows = await db.all(
        "SELECT key, lang, value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ? ORDER BY key, lang",
        [CONNECTOR_ID, assetId]
      );
      if (rows.length === 0) return textResult(`Asset "${assetId}" hat keine Werte.`);

      const lines = rows.map(r => `- ${r.key} (${r.lang}): ${r.value}`);
      return textResult(`${rows.length} Wert(e) für Asset "${assetId}":\n${lines.join("\n")}`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "setAssetValues",
  "Setzt Werte für ein Asset. Ersetzt ALLE bestehenden Werte. Jeder Eintrag hat key, lang (de/en) und value. Erfordert Editor- oder Owner-Rolle.",
  {
    asset_id: z.string().describe("Die Asset-ID."),
    values: z.array(z.object({
      key: z.string().describe("Datenpunkt-ID oder Hierarchy-Level-Name."),
      lang: z.string().describe("Sprache: 'de' oder 'en'."),
      value: z.string().describe("Der Wert."),
    })).describe("Liste der Werte."),
  },
  async ({ asset_id, values }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      if (!assetId) return errorResult("asset_id ist erforderlich.");
      if (!Array.isArray(values) || values.length === 0) return errorResult("values muss ein nicht-leeres Array sein.");

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
        [CONNECTOR_ID, assetId]
      );
      if (!existing) return errorResult(`Asset "${assetId}" nicht gefunden.`);

      const validEntries = [];
      for (const v of values) {
        if (!v.key || typeof v.key !== "string") continue;
        if (!v.value && v.value !== "") continue;
        const lang = (v.lang || "").toLowerCase();
        if (lang !== "de" && lang !== "en") continue;
        validEntries.push({ key: v.key.trim(), lang, value: String(v.value) });
      }
      if (validEntries.length === 0) return errorResult("Keine gültigen Werte gefunden. Jeder Eintrag braucht key, lang (de/en) und value.");

      await db.run("DELETE FROM dti_asset_values WHERE connector_id = ? AND asset_id = ?", [CONNECTOR_ID, assetId]);
      for (const v of validEntries) {
        await db.run(
          "INSERT INTO dti_asset_values (connector_id, asset_id, key, lang, value) VALUES (?, ?, ?, ?, ?)",
          [CONNECTOR_ID, assetId, v.key, v.lang, v.value]
        );
      }
      return textResult(`${validEntries.length} Wert(e) für Asset "${assetId}" gesetzt.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

server.tool(
  "updateAssetValues",
  "Aktualisiert einzelne Werte eines Assets, ohne bestehende Werte zu löschen. Nur die übergebenen key+lang Kombinationen werden überschrieben/hinzugefügt. Erfordert Editor- oder Owner-Rolle.",
  {
    asset_id: z.string().describe("Die Asset-ID."),
    values: z.array(z.object({
      key: z.string().describe("Datenpunkt-ID oder Hierarchy-Level-Name."),
      lang: z.string().describe("Sprache: 'de' oder 'en'."),
      value: z.string().describe("Der Wert."),
    })).describe("Liste der zu aktualisierenden Werte. Nicht übergebene Werte bleiben unverändert."),
  },
  async ({ asset_id, values }) => {
    try {
      const err = requireEditor();
      if (err) return errorResult(err);
      const assetId = (asset_id || "").trim();
      if (!assetId) return errorResult("asset_id ist erforderlich.");
      if (!Array.isArray(values) || values.length === 0) return errorResult("values muss ein nicht-leeres Array sein.");

      const existing = await db.get(
        "SELECT asset_id FROM dti_assets WHERE connector_id = ? AND asset_id = ?",
        [CONNECTOR_ID, assetId]
      );
      if (!existing) return errorResult(`Asset "${assetId}" nicht gefunden.`);

      const validEntries = [];
      for (const v of values) {
        if (!v.key || typeof v.key !== "string") continue;
        if (!v.value && v.value !== "") continue;
        const lang = (v.lang || "").toLowerCase();
        if (lang !== "de" && lang !== "en") continue;
        validEntries.push({ key: v.key.trim(), lang, value: String(v.value) });
      }
      if (validEntries.length === 0) return errorResult("Keine gültigen Werte gefunden. Jeder Eintrag braucht key, lang (de/en) und value.");

      let updated = 0;
      let inserted = 0;
      for (const v of validEntries) {
        const ex = await db.get(
          "SELECT value FROM dti_asset_values WHERE connector_id = ? AND asset_id = ? AND key = ? AND lang = ?",
          [CONNECTOR_ID, assetId, v.key, v.lang]
        );
        if (ex) {
          await db.run(
            "UPDATE dti_asset_values SET value = ? WHERE connector_id = ? AND asset_id = ? AND key = ? AND lang = ?",
            [v.value, CONNECTOR_ID, assetId, v.key, v.lang]
          );
          updated++;
        } else {
          await db.run(
            "INSERT INTO dti_asset_values (connector_id, asset_id, key, lang, value) VALUES (?, ?, ?, ?, ?)",
            [CONNECTOR_ID, assetId, v.key, v.lang, v.value]
          );
          inserted++;
        }
      }
      return textResult(`Asset "${assetId}": ${updated} Wert(e) aktualisiert, ${inserted} Wert(e) hinzugefügt. Bestehende Werte blieben erhalten.`);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
