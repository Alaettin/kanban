// ---------------------------------------------------------------------------
// Knowledge Base MCP Server
// Exposes user's documents and contact persons as MCP tools.
// Transport: stdio (JSON-RPC 2.0)
// Context passed via env:
//   KB_USER_ID, KB_BASE_PROMPT,
//   KB_RESILIENCE_MODE ("1" enables resilience preamble),
//   KB_RESILIENCE_ROLE (canonical role id, optional),
//   KB_RESILIENCE_SUBROLE (optional, e.g. "betriebsrat")
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

db.open(path.join(__dirname, "../../data/platform.db"));

const USER_ID     = process.env.KB_USER_ID || "";
const BASE_PROMPT = process.env.KB_BASE_PROMPT || "";
const RES_MODE    = process.env.KB_RESILIENCE_MODE === "1";
const RES_ROLE    = process.env.KB_RESILIENCE_ROLE || "";
const RES_SUBROLE = process.env.KB_RESILIENCE_SUBROLE || "";

const DEFAULT_INSTRUCTIONS =
  "Du hast Zugriff auf eine Wissensdatenbank mit Dokumenten.\n" +
  "Durchsuche die verfügbaren Ressourcen anhand ihrer Beschreibungen und " +
  "lies relevante Dokumente mit dem readDocument-Tool, um Fragen zu beantworten.\n\n" +
  "REGELN:\n" +
  "- Nutze listDocuments um alle verfügbaren Dokumente zu sehen.\n" +
  "- Nutze readDocument mit der doc_id um den Inhalt eines Dokuments zu lesen.\n" +
  "- Beantworte Fragen basierend auf dem Dokumentinhalt.";

const RESILIENCE_PREAMBLE =
  "RESILIENZ-MODUS aktiv.\n" +
  "Du bist ein einfühlsamer Beratungs-Assistent zum Thema Resilienz im Arbeitskontext " +
  "(Stress, Konflikte, Belastung, Führung, Krisen).\n\n" +
  "===== ABLAUF =====\n" +
  "1. INTAKE (NUR wenn Rolle noch nicht bekannt):\n" +
  "   Stelle nacheinander – kurz, in EINER Nachricht zusammen – diese drei Fragen:\n" +
  "   a) \"Was arbeitest du? Was ist dein Arbeitskontext?\"\n" +
  "   b) \"Fragst du für dich persönlich oder im Rahmen deiner beruflichen Position?\"\n" +
  "   c) \"Möchtest du allgemeine Informationen oder gibt es einen konkreten Anlass / ein konkretes Problem?\"\n" +
  "   Beantworte NICHT inhaltlich, bevor die Rolle geklärt ist.\n\n" +
  "2. KLASSIFIZIERUNG der Rolle anhand der Antworten:\n" +
  "   - beschaeftigte-buero      : Beschäftigte:r aus dem Büro (Wissensarbeit, eigener PC, Gestaltungsspielraum)\n" +
  "   - beschaeftigte-produktion : Beschäftigte:r aus der Produktion (stark reglementiert, wenig Freiraum, Schichtarbeit, kein eigener PC)\n" +
  "   - fk-klein                 : Führungskraft mit kleinem Team (≤ 10 Personen) – Maßnahmen wie Belastungs-EKG oder Schnittstellen-Workshop sind sinnvoll\n" +
  "   - fk-gross                 : Führungskraft mit großem Verantwortungsbereich (> 10 Personen, mehrere Teams) – eher strategische Angebote, Strukturen, Audit, Sensibilisierung\n" +
  "   - kontaktperson            : interne Funktion (Betriebsrat, BEM-Beauftragte, Sicherheitsbeauftragte, Betriebsarzt, Schwerbehindertenvertretung). Setze subrole entsprechend.\n\n" +
  "3. PERSISTENZ: Sobald die Rolle eindeutig ist, RUFE ZUERST das Tool `setResilienceRole({role, subrole?})` AUF. Erst danach inhaltlich antworten.\n\n" +
  "4. PROBLEM-KLÄRUNG: Wenn die Person ein vages Problem nennt (\"Stress\", \"Konflikte\", \"Überlastung\"), frage gezielt nach, bevor du Antworten gibst:\n" +
  "   - \"Was ist dein konkretes Problem?\" / \"Was bedeutet das genau – beschreibe eine Situation.\"\n\n" +
  "5. ROLLENSPEZIFISCH ANTWORTEN (nutze `listDocuments({role})` und `getContactPersons({role})`):\n" +
  "   - beschaeftigte-buero      : persönliche Resilienz, Stressbewältigung, interne Programme, mögliche Ansprechpersonen, konkrete Vorschläge zur Arbeitsalltags-Gestaltung. Auch Prozess-/Struktur-Ideen, die die Person an die Führung adressieren könnte.\n" +
  "   - beschaeftigte-produktion : KURZ halten. Schnell auf Ansprechpersonen (Führungskraft, Betriebsrat, Gesundheitsmanagement) lenken, die Workshops oder Maßnahmen initiieren können. Wenig persönliche Strategien (begrenzter Gestaltungsspielraum).\n" +
  "   - fk-klein                 : konkrete Team-Maßnahmen: Belastungs-EKG, Schnittstellen-Workshop, Sensibilisierungs-Workshops, Konfliktmoderation. Liefere praktische Hinweise zur Durchführung.\n" +
  "   - fk-gross                 : strategisch: Strukturen, Prozesse, Audit-Ansatz, Sensibilisierungs-Programme auf Organisationsebene, Implementierung eines Resilienz-Programms.\n" +
  "   - kontaktperson            : Spezialinfos für die Funktion, Verweise auf weiterführende Materialien, Schnittstellen zu anderen Funktionen.\n\n" +
  "6. TON: warm, sachlich, kurz, keine Pathologisierung. KEINE medizinischen oder therapeutischen Empfehlungen – im Zweifel auf Betriebsarzt / Hausarzt verweisen.\n\n" +
  "===== TOOLS =====\n" +
  "- listDocuments({role?, tags?, topic?}) – role: Rollen-ID. Tags + topic optional zum Verfeinern.\n" +
  "- readDocument(query)                   – doc_id ODER Titel-Substring.\n" +
  "- getContactPersons({role?, function?}) – liefert hinterlegte Ansprechpersonen.\n" +
  "- setResilienceRole({role, subrole?})   – persistiert die Rolle für den Chat (NUR EINMAL pro Chat).\n";

function buildInstructions() {
  if (!RES_MODE) return BASE_PROMPT || DEFAULT_INSTRUCTIONS;
  let prompt = RESILIENCE_PREAMBLE;
  if (RES_ROLE) {
    prompt += `\nROLLE BEREITS BEKANNT: ${RES_ROLE}`;
    if (RES_SUBROLE) prompt += ` (subrole: ${RES_SUBROLE})`;
    prompt += ". FRAGE NICHT erneut nach der Rolle, springe direkt zum rollenspezifischen Vorgehen (Schritt 4–6).\n";
  } else {
    prompt += "\nROLLE NOCH NICHT BEKANNT. Führe JETZT die Intake-Schritte aus.\n";
  }
  if (BASE_PROMPT) prompt += "\n" + BASE_PROMPT;
  return prompt;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function textResult(msg) {
  return { content: [{ type: "text", text: msg }] };
}

function parseTags(raw) {
  try { const arr = JSON.parse(raw || "[]"); return Array.isArray(arr) ? arr : []; } catch { return []; }
}

// ---------------------------------------------------------------------------
// MCP Server
// ---------------------------------------------------------------------------
const server = new McpServer(
  { name: "knowledge-base", version: "1.0.0" },
  { instructions: buildInstructions() }
);

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

server.tool(
  "listDocuments",
  "Listet Dokumente. Optional: role (Rollen-ID wie 'beschaeftigte-buero', 'fk-klein', ...), tags (Array von Tags – alle müssen matchen), topic (Substring in Titel oder Beschreibung).",
  {
    role: z.string().optional(),
    tags: z.array(z.string()).optional(),
    topic: z.string().optional(),
  },
  async ({ role, tags, topic } = {}) => {
    const docs = await db.all(
      "SELECT doc_id, title, description, mime_type, file_size, tags FROM kb_documents WHERE user_id = ? ORDER BY updated_at DESC",
      [USER_ID]
    );
    const filtered = docs.filter(d => {
      const docTags = parseTags(d.tags);
      if (role && !docTags.includes(role) && !docTags.includes("all-roles")) return false;
      if (tags && tags.length && !tags.every(t => docTags.includes(t))) return false;
      if (topic) {
        const q = topic.toLowerCase();
        if (!((d.title || "").toLowerCase().includes(q) || (d.description || "").toLowerCase().includes(q))) return false;
      }
      return true;
    });
    if (!filtered.length) return textResult("Keine passenden Dokumente gefunden.");
    const lines = filtered.map((d, i) => {
      const tagsArr = parseTags(d.tags);
      return `${i + 1}. [${d.doc_id}] ${d.title || "Unbenannt"}` +
             (d.description ? `\n   ${d.description}` : "") +
             (tagsArr.length ? `\n   Tags: ${tagsArr.join(", ")}` : "") +
             `\n   (${d.mime_type}, ${Math.round((d.file_size || 0) / 1024)} KB)`;
    });
    return textResult(`${filtered.length} Dokument(e):\n\n` + lines.join("\n\n"));
  }
);

server.tool(
  "readDocument",
  "Liest den vollständigen extrahierten Text eines Dokuments. Übergib doc_id (UUID) ODER einen Titel-Substring.",
  { query: z.string().describe("doc_id (UUID) oder Titel/Name des Dokuments (Teiltext reicht)") },
  async ({ query }) => {
    let doc = await db.get(
      "SELECT title, content_text FROM kb_documents WHERE doc_id = ? AND user_id = ?",
      [query, USER_ID]
    );
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

server.tool(
  "getContactPersons",
  "Liefert hinterlegte Ansprechpersonen (Betriebsrat, BEM, Betriebsarzt, SBV, ...). Optional: role (Rollen-ID, filtert nach role_tags) oder function (Substring im Funktions-Feld).",
  { role: z.string().optional(), function: z.string().optional() },
  async ({ role, function: fn } = {}) => {
    const rows = await db.all(
      "SELECT function, name, email, phone, note, role_tags FROM kb_contacts WHERE user_id = ? ORDER BY function, name",
      [USER_ID]
    );
    const filtered = rows.filter(r => {
      const tagsArr = parseTags(r.role_tags);
      if (role && tagsArr.length && !tagsArr.includes(role) && !tagsArr.includes("all-roles")) return false;
      if (fn && !(r.function || "").toLowerCase().includes(fn.toLowerCase())) return false;
      return true;
    });
    if (!filtered.length) return textResult("Keine Kontaktpersonen hinterlegt.");
    const lines = filtered.map(c =>
      `• ${c.function || "—"}${c.name ? ` — ${c.name}` : ""}` +
      (c.email ? `\n  E-Mail: ${c.email}` : "") +
      (c.phone ? `\n  Telefon: ${c.phone}` : "") +
      (c.note ? `\n  ${c.note}` : "")
    );
    return textResult(`${filtered.length} Kontakt(e):\n\n` + lines.join("\n\n"));
  }
);

server.tool(
  "setResilienceRole",
  "Persistiere die erkannte Nutzerrolle EINMAL nach dem Intake. role: einer der kanonischen IDs. subrole: optionale Sub-Rolle (z.B. 'betriebsrat', 'bem', 'sicherheit', 'betriebsarzt', 'svp' für Kontaktpersonen).",
  {
    role: z.enum(["beschaeftigte-buero", "beschaeftigte-produktion", "fk-klein", "fk-gross", "kontaktperson"]),
    subrole: z.string().optional(),
  },
  async ({ role, subrole }) => {
    const payload = JSON.stringify({ __resilienceEvent: { role, subrole: subrole || null } });
    return textResult(`Rolle erfasst: ${role}${subrole ? " / " + subrole : ""}\n${payload}`);
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const transport = new StdioServerTransport();
await server.connect(transport);
