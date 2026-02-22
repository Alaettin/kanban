// ---------------------------------------------------------------------------
// AAS Repository MCP Server
// Standalone MCP server providing tools for the IDTA AAS Repository API V3.1.1
// Transport: stdio (JSON-RPC 2.0)
// ---------------------------------------------------------------------------
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const AAS_BASE = process.env.AAS_BASE_URL || "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function toBase64Url(str) {
  // Plaintext URL/URN → encode to standard base64, then URL-encode for path usage
  if (str.includes("://") || str.startsWith("urn:")) {
    return encodeURIComponent(Buffer.from(str, "utf-8").toString("base64"));
  }
  // Might be already encoded (base64 or URL-encoded base64) — try to decode
  try {
    const unescaped = decodeURIComponent(str);
    const decoded = Buffer.from(unescaped, "base64").toString("utf-8");
    if (decoded.includes("://") || decoded.startsWith("urn:")) {
      return str; // already encoded, pass through
    }
  } catch { /* not valid base64, fall through */ }
  // Fallback: treat as plaintext, encode
  return encodeURIComponent(Buffer.from(str, "utf-8").toString("base64"));
}

async function aasGet(path) {
  if (!AAS_BASE) throw new Error("AAS_BASE_URL not configured");
  const url = `${AAS_BASE.replace(/\/+$/, "")}${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`AAS API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function textResult(obj) {
  const text = typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
  return { content: [{ type: "text", text }] };
}

function errorResult(msg) {
  return { content: [{ type: "text", text: `Fehler: ${msg}` }], isError: true };
}

// Summarise a shell for compact output
function summariseShell(shell) {
  return {
    id: shell.id,
    idShort: shell.idShort || "(kein idShort)",
    assetKind: shell.assetInformation?.assetKind,
    globalAssetId: shell.assetInformation?.globalAssetId,
    assetType: shell.assetInformation?.assetType,
    submodelCount: shell.submodels?.length || 0,
  };
}

// Summarise a submodel element tree (flatten for readability)
// parentIsList: if true, use index notation [i] for children without idShort
function summariseElements(elements, prefix = "", parentIsList = false) {
  const lines = [];
  for (let i = 0; i < (elements || []).length; i++) {
    const el = elements[i];
    let path;
    if (el.idShort) {
      path = prefix ? `${prefix}.${el.idShort}` : el.idShort;
    } else if (parentIsList) {
      path = `${prefix}[${i}]`;
    } else {
      path = prefix ? `${prefix}.[${i}]` : `[${i}]`;
    }
    const mt = el.modelType;
    if (mt === "Property") {
      lines.push(`${path} = ${el.value ?? "(leer)"} [${el.valueType}]`);
    } else if (mt === "MultiLanguageProperty") {
      const vals = (el.value || []).map((v) => `${v.language}: ${v.text}`).join(", ");
      lines.push(`${path} = ${vals || "(leer)"}`);
    } else if (mt === "Range") {
      lines.push(`${path} = ${el.min ?? "?"} .. ${el.max ?? "?"} [${el.valueType}]`);
    } else if (mt === "File") {
      lines.push(`${path} [File] → ${el.value || "(kein Pfad)"} (${el.contentType || "?"}) — idShortPath für getAttachment: "${path}"`);
    } else if (mt === "Blob") {
      lines.push(`${path} [Blob, ${el.contentType || "?"}]`);
    } else if (mt === "ReferenceElement") {
      const ref = el.value?.keys?.map((k) => k.value).join("/") || "?";
      lines.push(`${path} → Ref(${ref})`);
    } else if (mt === "SubmodelElementCollection") {
      lines.push(`${path} (Collection):`);
      lines.push(...summariseElements(el.value, path, false));
    } else if (mt === "SubmodelElementList") {
      lines.push(`${path} (Liste, ${(el.value || []).length} Einträge):`);
      lines.push(...summariseElements(el.value, path, true));
    } else if (mt === "Entity") {
      lines.push(`${path} (Entity, ${el.entityType})`);
      lines.push(...summariseElements(el.statements, path, false));
    } else {
      lines.push(`${path} [${mt}]`);
    }
  }
  return lines;
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer(
  { name: "aas-repository", version: "1.0.0" },
  {
    instructions:
      "Du hast Zugriff auf einen AAS Repository Server und kannst live Daten abfragen.\n\n" +
      "WICHTIGE REGELN:\n" +
      "- Rufe nur die Tools auf, die zur Beantwortung der Frage NÖTIG sind. Nicht alle verfügbaren Tools durchprobieren!\n" +
      "- Sobald du genug Informationen hast, antworte SOFORT mit Text. Keine weiteren Tool-Aufrufe.\n" +
      "- Bei einer einfachen Frage zu einer Shell reicht meist EIN Tool-Aufruf (z.B. getShell oder listShells).\n" +
      "- Rufe getSubmodel nur auf, wenn der Nutzer explizit nach Submodel-Daten fragt.\n" +
      "- Rufe getThumbnail oder getAssetInformation nur auf, wenn explizit danach gefragt wird.\n" +
      "- DOKUMENTE LESEN: Wenn der Nutzer nach dem Inhalt eines Dokuments, PDFs, Datenblatts oder Handbuchs fragt, " +
      "nutze getAttachment mit der submodelId und dem idShortPath des File-Elements. PDFs werden automatisch als Text extrahiert. " +
      "Finde zuerst das File-Element über getSubmodel, dann rufe getAttachment mit dem korrekten idShortPath auf.",
  }
);

// --- Tool 1: listShells ---------------------------------------------------
server.tool(
  "listShells",
  "Listet alle Asset Administration Shells (AAS) im Repository auf. Gibt die vollständige ID (URL/URN), IdShort, Asset-Typ und Submodel-Anzahl zurück. WICHTIG: Die zurückgegebene ID ist immer eine vollständige URL oder URN — diese muss exakt so an andere Tools übergeben werden.",
  {
    idShort: z.string().optional().describe("Optional: Filter nach IdShort (Kurzname der Shell)"),
    limit: z.number().optional().describe("Optional: Max. Anzahl Ergebnisse (Standard: 100)"),
    cursor: z.string().optional().describe("Optional: Paginierungs-Cursor für die nächste Seite"),
  },
  async ({ idShort, limit, cursor }) => {
    try {
      const params = new URLSearchParams();
      if (idShort) params.set("IdShort", idShort);
      if (limit) params.set("Limit", String(limit));
      if (cursor) params.set("Cursor", cursor);
      const qs = params.toString();
      const data = await aasGet(`/shells${qs ? "?" + qs : ""}`);
      const shells = (data.result || []).map(summariseShell);
      const cursorNext = data.paging_metadata?.cursor;
      let text = `${shells.length} Shell(s) gefunden:\n\n`;
      for (const s of shells) {
        text += `- Name: ${s.idShort}\n`;
        text += `  AAS-ID: ${s.id}\n`;
        text += `  Asset-Typ: ${s.assetType || "?"}, Kind: ${s.assetKind || "?"}, Submodels: ${s.submodelCount}\n\n`;
      }
      if (cursorNext) text += `(Weitere Ergebnisse verfügbar, Cursor: ${cursorNext})`;
      if (shells.length > 0) {
        text += `\nHINWEIS: Verwende die vollständige AAS-ID (z.B. "${shells[0].id}") für weitere Abfragen.`;
      }
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 2: getShell -----------------------------------------------------
server.tool(
  "getShell",
  "Ruft eine einzelne Asset Administration Shell anhand ihrer ID ab. Gibt alle Details inkl. Submodel-Referenzen zurück.",
  {
    aasId: z.string().describe("Die VOLLSTÄNDIGE ID der Shell als URL/URN, z.B. 'https://example.com/aas/Pump#1' — nicht nur der Kurzname!"),
  },
  async ({ aasId }) => {
    try {
      const data = await aasGet(`/shells/${toBase64Url(aasId)}`);
      const summary = summariseShell(data);
      const refs = (data.submodels || []).map((ref) => {
        const key = ref.keys?.[0];
        return key ? `  - ${key.value} (${key.type})` : "  - (unbekannt)";
      });
      let text = `Shell: ${summary.idShort}\n`;
      text += `ID: ${summary.id}\n`;
      text += `Asset-Typ: ${summary.assetType || "?"}\n`;
      text += `Asset-Kind: ${summary.assetKind || "?"}\n`;
      text += `Global Asset ID: ${summary.globalAssetId || "?"}\n`;
      if (data.description?.length) {
        text += `Beschreibung: ${data.description.map((d) => `[${d.language}] ${d.text}`).join(", ")}\n`;
      }
      text += `\nSubmodel-Referenzen (${refs.length}):\n${refs.join("\n") || "  (keine)"}`;
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 3: getAssetInformation ------------------------------------------
server.tool(
  "getAssetInformation",
  "Ruft die Asset-Informationen einer Shell ab: Asset-Typ, globale Asset-ID, spezifische IDs, Thumbnail-Info.",
  {
    aasId: z.string().describe("Die VOLLSTÄNDIGE ID der Shell als URL/URN (z.B. 'https://example.com/aas/Pump#1')"),
  },
  async ({ aasId }) => {
    try {
      const data = await aasGet(`/shells/${toBase64Url(aasId)}/asset-information`);
      let text = `Asset-Informationen:\n`;
      text += `  Asset-Kind: ${data.assetKind || "?"}\n`;
      text += `  Global Asset ID: ${data.globalAssetId || "?"}\n`;
      text += `  Asset-Typ: ${data.assetType || "?"}\n`;
      if (data.specificAssetIds?.length) {
        text += `  Spezifische IDs:\n`;
        for (const sa of data.specificAssetIds) {
          text += `    - ${sa.name}: ${sa.value}\n`;
        }
      }
      if (data.defaultThumbnail) {
        text += `  Thumbnail: ${data.defaultThumbnail.path} (${data.defaultThumbnail.contentType || "?"})\n`;
      }
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 4: getSubmodelRefs ----------------------------------------------
server.tool(
  "getSubmodelRefs",
  "Listet alle Submodel-Referenzen einer Shell auf. Zeigt welche Teilmodelle (z.B. Nameplate, Technische Daten) verfügbar sind und gibt deren IDs zurück.",
  {
    aasId: z.string().describe("Die VOLLSTÄNDIGE ID der Shell als URL/URN (z.B. 'https://example.com/aas/Pump#1')"),
  },
  async ({ aasId }) => {
    try {
      const data = await aasGet(`/shells/${toBase64Url(aasId)}/submodel-refs`);
      const refs = data.result || [];
      let text = `${refs.length} Submodel-Referenz(en) für Shell "${aasId}":\n\n`;
      for (const ref of refs) {
        const key = ref.keys?.[0];
        text += `- Submodel-ID: ${key?.value || "?"}\n  Typ: ${key?.type || "?"}\n\n`;
      }
      if (refs.length > 0) {
        const firstKey = refs[0].keys?.[0]?.value;
        if (firstKey) text += `HINWEIS: Verwende die vollständige Submodel-ID (z.B. "${firstKey}") zusammen mit der AAS-ID für getSubmodel.`;
      }
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 5: getSubmodel --------------------------------------------------
server.tool(
  "getSubmodel",
  "Ruft ein vollständiges Submodel mit allen SubmodelElements ab. Enthält Properties (Werte), Collections, Dateien etc.",
  {
    aasId: z.string().describe("Die VOLLSTÄNDIGE ID der Shell als URL/URN (z.B. 'https://example.com/aas/Pump#1')"),
    submodelId: z.string().describe("Die VOLLSTÄNDIGE ID des Submodels als URL/URN (aus getSubmodelRefs oder getShell)"),
    level: z.enum(["deep", "core"]).optional().describe("Optional: 'deep' (Standard) = alle Ebenen, 'core' = nur oberste Ebene"),
  },
  async ({ aasId, submodelId, level }) => {
    try {
      const params = new URLSearchParams();
      if (level) params.set("Level", level);
      const qs = params.toString();
      const data = await aasGet(
        `/shells/${toBase64Url(aasId)}/submodels/${toBase64Url(submodelId)}${qs ? "?" + qs : ""}`
      );
      let text = `Submodel: ${data.idShort || "?"}\n`;
      text += `ID: ${data.id}\n`;
      if (data.semanticId) {
        const semKey = data.semanticId.keys?.[0];
        text += `Semantik: ${semKey?.value || "?"}\n`;
      }
      if (data.description?.length) {
        text += `Beschreibung: ${data.description.map((d) => `[${d.language}] ${d.text}`).join(", ")}\n`;
      }
      text += `Kind: ${data.kind || "?"}\n\n`;
      const elements = summariseElements(data.submodelElements);
      text += `SubmodelElements (${elements.length}):\n`;
      text += elements.join("\n") || "(keine Elemente)";
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 6: getThumbnail -------------------------------------------------
server.tool(
  "getThumbnail",
  "Prüft ob ein Thumbnail-Bild für ein Asset vorhanden ist und gibt Metadaten zurück (Content-Type, Größe).",
  {
    aasId: z.string().describe("Die VOLLSTÄNDIGE ID der Shell als URL/URN (z.B. 'https://example.com/aas/Pump#1')"),
  },
  async ({ aasId }) => {
    try {
      if (!AAS_BASE) throw new Error("AAS_BASE_URL not configured");
      const url = `${AAS_BASE.replace(/\/+$/, "")}/shells/${toBase64Url(aasId)}/asset-information/thumbnail`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return textResult("Kein Thumbnail für diese Shell vorhanden.");
        throw new Error(`AAS API ${res.status}`);
      }
      const contentType = res.headers.get("content-type") || "unknown";
      const contentLength = res.headers.get("content-length") || "unknown";
      // Consume body but don't return binary
      await res.arrayBuffer();
      return textResult(
        `Thumbnail vorhanden:\n  Content-Type: ${contentType}\n  Größe: ${contentLength} Bytes\n  URL: ${url}`
      );
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 7: getSubmodelElement -------------------------------------------
server.tool(
  "getSubmodelElement",
  "Ruft ein einzelnes SubmodelElement anhand seines idShort-Pfads ab. Nutzt die Submodel Repository API (/submodels/...). Gibt den Wert, Typ und ggf. verschachtelte Elemente zurück.",
  {
    submodelId: z.string().describe("Die VOLLSTÄNDIGE ID des Submodels als URL/URN (aus getSubmodelRefs oder getShell)"),
    idShortPath: z.string().describe("Der idShort-Pfad zum Element, mit Punkt getrennt (z.B. 'MaxRotationSpeed' oder 'OperatingConditions.Temperature')"),
    level: z.enum(["deep", "core"]).optional().describe("Optional: 'deep' (Standard) = alle Ebenen, 'core' = nur oberste Ebene"),
  },
  async ({ submodelId, idShortPath, level }) => {
    try {
      const params = new URLSearchParams();
      if (level) params.set("Level", level);
      const qs = params.toString();
      const data = await aasGet(
        `/submodels/${toBase64Url(submodelId)}/submodel-elements/${idShortPath}${qs ? "?" + qs : ""}`
      );
      const mt = data.modelType || "?";
      let text = `Element: ${data.idShort || idShortPath}\n`;
      text += `Typ: ${mt}\n`;
      if (data.semanticId) {
        const semKey = data.semanticId.keys?.[0];
        text += `Semantik: ${semKey?.value || "?"}\n`;
      }
      if (data.description?.length) {
        text += `Beschreibung: ${data.description.map((d) => `[${d.language}] ${d.text}`).join(", ")}\n`;
      }
      if (mt === "Property") {
        text += `Wert: ${data.value ?? "(leer)"} [${data.valueType}]\n`;
      } else if (mt === "MultiLanguageProperty") {
        const vals = (data.value || []).map((v) => `${v.language}: ${v.text}`).join(", ");
        text += `Wert: ${vals || "(leer)"}\n`;
      } else if (mt === "Range") {
        text += `Bereich: ${data.min ?? "?"} .. ${data.max ?? "?"} [${data.valueType}]\n`;
      } else if (mt === "File") {
        text += `Datei: ${data.value || "(kein Pfad)"} (${data.contentType || "?"})\n`;
      } else if (mt === "Blob") {
        text += `Blob: ${data.contentType || "?"}\n`;
      } else if (mt === "ReferenceElement") {
        const ref = data.value?.keys?.map((k) => k.value).join("/") || "?";
        text += `Referenz: ${ref}\n`;
      } else if (mt === "SubmodelElementCollection" || mt === "SubmodelElementList" || mt === "Entity") {
        const children = data.value || data.statements || [];
        text += `\nKindelemente (${children.length}):\n`;
        text += summariseElements(children).join("\n") || "(keine)";
      }
      return textResult(text);
    } catch (e) {
      return errorResult(e.message);
    }
  }
);

// --- Tool 8: getAttachment ------------------------------------------------
const TEXT_TYPES = ["text/", "application/json", "application/xml", "application/csv", "application/yaml", "application/x-yaml"];
function isTextType(ct) {
  return TEXT_TYPES.some((t) => ct.startsWith(t));
}

server.tool(
  "getAttachment",
  "Lädt den Dateianhang (Attachment) eines File-SubmodelElements herunter und gibt den Inhalt zurück. Unterstützt Textdateien (TXT, CSV, JSON, XML) UND PDF-Dokumente — bei PDFs wird der vollständige Text automatisch extrahiert. Nutze dieses Tool um Dokumente, Datenblätter oder Handbücher zu lesen und zusammenzufassen. Bei Bildern werden Metadaten und Download-URL zurückgegeben.",
  {
    submodelId: z.string().describe("Die VOLLSTÄNDIGE ID des Submodels als URL/URN"),
    idShortPath: z.string().describe("Der idShort-Pfad zum File-Element (z.B. 'Documentation.Manual' oder 'ProductImage')"),
  },
  async ({ submodelId, idShortPath }) => {
    try {
      if (!AAS_BASE) throw new Error("AAS_BASE_URL not configured");
      const url = `${AAS_BASE.replace(/\/+$/, "")}/submodels/${toBase64Url(submodelId)}/submodel-elements/${idShortPath}/attachment`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return textResult("Kein Attachment für dieses Element vorhanden.");
        throw new Error(`AAS API ${res.status}`);
      }
      const contentType = (res.headers.get("content-type") || "application/octet-stream").split(";")[0].trim();
      const contentLength = res.headers.get("content-length") || "unbekannt";

      if (isTextType(contentType)) {
        const text = await res.text();
        const truncated = text.length > 15000 ? text.slice(0, 15000) + "\n\n… (gekürzt, insgesamt " + text.length + " Zeichen)" : text;
        return textResult(
          `Attachment (${contentType}, ${contentLength} Bytes):\n\n${truncated}`
        );
      }

      // PDF — extract text with pdf-parse
      if (contentType === "application/pdf") {
        const buf = Buffer.from(await res.arrayBuffer());
        const pdf = await pdfParse(buf);
        const pages = pdf.numpages || "?";
        let text = pdf.text || "";
        const truncated = text.length > 15000 ? text.slice(0, 15000) + "\n\n… (gekürzt, insgesamt " + text.length + " Zeichen)" : text;
        return textResult(
          `PDF-Dokument (${pages} Seiten, ${contentLength} Bytes):\n\n${truncated}`
        );
      }

      // Other binary files — consume body, return metadata + URL
      await res.arrayBuffer();
      return textResult(
        `Attachment vorhanden (binär):\n  Content-Type: ${contentType}\n  Größe: ${contentLength} Bytes\n  Download-URL: ${url}\n\nHinweis: Binärdatei kann nicht als Text angezeigt werden.`
      );
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
