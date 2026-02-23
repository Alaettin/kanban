// ---------------------------------------------------------------------------
// Knowledge Base MCP Server
// Exposes user's documents as MCP resources + readDocument tool
// Transport: stdio (JSON-RPC 2.0)
// Context passed via env: KB_USER_ID, KB_BASE_PROMPT
// ---------------------------------------------------------------------------
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const db = require(path.join(__dirname, "../../shared/db"));

// Open the database — MCP server runs as child process
db.open(path.join(__dirname, "../../data/platform.db"));

const USER_ID = process.env.KB_USER_ID || "";
const BASE_PROMPT = process.env.KB_BASE_PROMPT || "";

const DEFAULT_INSTRUCTIONS =
  "Du hast Zugriff auf eine Wissensdatenbank mit Dokumenten.\n" +
  "Durchsuche die verfügbaren Ressourcen anhand ihrer Beschreibungen und " +
  "lies relevante Dokumente mit dem readDocument-Tool, um Fragen zu beantworten.\n\n" +
  "REGELN:\n" +
  "- Nutze listDocuments um alle verfügbaren Dokumente zu sehen.\n" +
  "- Nutze readDocument mit der doc_id um den Inhalt eines Dokuments zu lesen.\n" +
  "- Beantworte Fragen basierend auf dem Dokumentinhalt.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function textResult(msg) {
  return { content: [{ type: "text", text: msg }] };
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer(
  { name: "knowledge-base", version: "1.0.0" },
  { instructions: BASE_PROMPT || DEFAULT_INSTRUCTIONS }
);

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

server.tool(
  "listDocuments",
  "Listet alle Dokumente in der Wissensdatenbank auf mit Titel und Beschreibung. Nutze dies um herauszufinden welche Dokumente verfügbar sind.",
  {},
  async () => {
    const docs = await db.all(
      "SELECT doc_id, title, description, mime_type, file_size FROM kb_documents WHERE user_id = ? ORDER BY updated_at DESC",
      [USER_ID]
    );
    if (!docs.length) return textResult("Keine Dokumente in der Wissensdatenbank.");
    const lines = docs.map((d, i) =>
      `${i + 1}. [${d.doc_id}] ${d.title || "Unbenannt"}` +
      (d.description ? `\n   ${d.description}` : "") +
      `\n   (${d.mime_type}, ${Math.round(d.file_size / 1024)} KB)`
    );
    return textResult(`${docs.length} Dokument(e) gefunden:\n\n` + lines.join("\n\n"));
  }
);

server.tool(
  "readDocument",
  "Liest den vollständigen extrahierten Text eines Dokuments. Du kannst entweder die doc_id ODER den Titel/Namen des Dokuments übergeben. Bei Titelsuche wird eine unscharfe Suche (enthält) durchgeführt.",
  { query: z.string().describe("doc_id (UUID) oder Titel/Name des Dokuments (Teiltext reicht)") },
  async ({ query }) => {
    // Try exact doc_id match first
    let doc = await db.get(
      "SELECT title, content_text FROM kb_documents WHERE doc_id = ? AND user_id = ?",
      [query, USER_ID]
    );
    // Fallback: fuzzy title search
    if (!doc) {
      doc = await db.get(
        "SELECT title, content_text FROM kb_documents WHERE user_id = ? AND LOWER(title) LIKE ? ORDER BY updated_at DESC LIMIT 1",
        [USER_ID, `%${query.toLowerCase()}%`]
      );
    }
    if (!doc) return textResult(`Dokument "${query}" nicht gefunden. Nutze listDocuments um alle verfügbaren Dokumente zu sehen.`);
    if (!doc.content_text) return textResult(`Dokument "${doc.title}" hat keinen extrahierten Text.`);
    const text = doc.content_text.length > 15000
      ? doc.content_text.slice(0, 15000) + "\n\n[... Text gekürzt, " + doc.content_text.length + " Zeichen insgesamt]"
      : doc.content_text;
    return textResult(`# ${doc.title}\n\n${text}`);
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
