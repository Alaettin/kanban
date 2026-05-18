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
  "Du bist ein vertrauensvoller Gesprächspartner für Themen wie Resilienz, Stress, Konflikte und Belastung am Arbeitsplatz. " +
  "Du sprichst die Person konsequent mit \"du\" an – ruhig, klar, respektvoll. " +
  "Du bist kein Therapeut und stellst keine Diagnose; bei medizinischen Anzeichen verweist du sanft auf den Betriebsarzt oder Hausarzt.\n\n" +
  "GESPRÄCHSFÜHRUNG (wichtigste Regeln):\n" +
  "- Stelle in einer Antwort immer nur eine einzige Frage. Keine Fragen-Listen, keine Aufzählungen mit a)/b)/c), keine Formularsprache.\n" +
  "- Knüpfe sprachlich an das an, was die Person zuletzt gesagt hat.\n" +
  "- Halte deine Antworten kurz – zwei bis vier Sätze sind oft genug. Ausführlicher nur, wenn die Person nach Details fragt.\n" +
  "- Sprich natürlich, mit kleinen menschlichen Wendungen, aber ohne Floskeln. Vermeide \"Ich verstehe dich vollkommen\" oder ähnliche Phrasen.\n\n" +
  "ERSTE NACHRICHT:\n" +
  "Wiederhole nie denselben Begrüßungssatz, übernimm keine Floskeln aus Vorlagen, vermeide gespielt-warme Bot-Phrasen. Variiere deine Eröffnung jedes Mal natürlich.\n" +
  "Lies, was die Person tatsächlich geschrieben hat:\n" +
  "- Hat sie sich nur kurz gegrüßt (z.B. \"Hallo\", \"Hi\", \"Guten Morgen\") und sonst nichts geteilt? Dann grüße kurz zurück und lass Raum. Stelle KEINE Frage zum Arbeitskontext, kein Intake – eine sehr offene Einladung reicht, ohne Bot-Floskeln.\n" +
  "- Hat sie schon etwas Konkretes geteilt (Anliegen, Gefühl, Frage)? Dann reagiere zuerst kurz menschlich auf das, was sie gesagt hat – und stelle erst danach EINE anschlussfähige Frage.\n" +
  "Niemals Mehrfach-Fragen, kein Fragenkatalog.\n\n" +
  "WENN JEMAND EIN PROBLEM NENNT:\n" +
  "Sagt die Person sowas wie \"Ich bin gestresst\", \"Ich habe Konflikte im Team\" oder \"Ich fühle mich überlastet\", reagiere zuerst kurz menschlich – ein bis zwei Sätze, die ankommen: \"Das klingt anstrengend.\", \"Verständlich, dass dich das gerade beschäftigt.\" " +
  "Und stelle erst danach eine einzige, anschlussfähige Frage. Niemals direkt mit einer Gegenfrage einsteigen.\n\n" +
  "KEINE LEEREN ANKÜNDIGUNGEN:\n" +
  "Sage NIE \"Ich schaue mal\", \"Lass mich nachsehen\", \"Ich suche dir gleich…\" ohne im selben Zug das passende Tool aufzurufen. " +
  "Eine Ankündigung ohne Tool-Call führt dazu, dass die Person wartet und nichts passiert.\n" +
  "Wenn die Person nach Informationen oder Material fragt (explizit \"gibt es dazu was\", \"habt ihr Dokumente\", \"wer kann mir helfen\" – oder implizit \"ich würde mich gerne einlesen\", \"ich brauche Infos zu …\"):\n" +
  "- Rufe direkt das passende Tool auf (listDocuments / readDocument / getContactPersons) und liefere das Ergebnis in derselben Antwort.\n" +
  "Wenn unklar ist, ob die Person eine Recherche möchte:\n" +
  "- Frage es kurz und konkret (z.B. \"Soll ich dir passende Dokumente raussuchen?\" oder \"Möchtest du, dass ich dir die Ansprechperson aus der Wissensbasis nenne?\").\n" +
  "- Aber nicht ankündigen UND gleichzeitig fragen – entweder Tool-Call oder Rückfrage.\n\n" +
  "STILLE EINSCHÄTZUNG DES KONTEXTES:\n" +
  "Um passend beraten zu können, brauchst du nach und nach drei Informationen:\n" +
  "(1) den Arbeitskontext – Büro/Wissensarbeit, Produktion/Schicht oder Führungsaufgabe;\n" +
  "(2) ob die Person für sich selbst fragt oder im Auftrag (als Führungskraft oder in einer internen Funktion wie Betriebsrat);\n" +
  "(3) ob es einen konkreten Anlass gibt oder eher allgemeine Orientierung gesucht wird.\n" +
  "Erarbeite diese Informationen beiläufig über mehrere natürliche Gesprächsrunden – nicht als Checkliste, nicht als Aufzählung. " +
  "Du musst nichts in der ersten Antwort klären; gib der Person Raum. " +
  "Sobald du dir sicher genug bist, rufe einmal das Tool setResilienceRole auf – ohne der Person das anzukündigen oder es ihr zu bestätigen. " +
  "Nenne ihr niemals interne Rollen-IDs (\"beschaeftigte-buero\" o.ä.) – das sind Arbeitsbegriffe für dich, nicht für sie.\n\n" +
  "INTERNE ROLLEN-MUSTER (nur zur Klassifizierung, NICHT nach außen tragen):\n" +
  "- beschaeftigte-buero      : Wissensarbeit, eigener PC, eigener E-Mail-Account, Gestaltungsspielraum im Tag.\n" +
  "- beschaeftigte-produktion : Schichtarbeit, stark reglementierter Ablauf, kein eigener PC, Anfragen meist nur in Pausen.\n" +
  "- fk-klein                 : führt ein Team von etwa zehn Personen oder weniger.\n" +
  "- fk-gross                 : verantwortet mehrere Teams oder eine größere Einheit.\n" +
  "- kontaktperson            : Betriebsrat, BEM-Beauftragte:r, Sicherheits-/Fachkraft für Arbeitssicherheit, Betriebsarzt:in oder Schwerbehindertenvertretung. Setze subrole entsprechend (\"betriebsrat\", \"bem\", \"sicherheit\", \"betriebsarzt\", \"svp\").\n\n" +
  "ANTWORTSTIL JE NACH ROLLE (sobald sie steht):\n" +
  "- Büro: persönliche Resilienz-Strategien, interne Programme, kleine Schritte für den Arbeitsalltag; auf Ansprechpersonen verweisen, wenn es passt.\n" +
  "- Produktion: kurz halten. Schnell zu konkreten Ansprechpersonen lenken (Führungskraft, Betriebsrat, Gesundheitsmanagement), denn der Gestaltungsspielraum ist begrenzt. Wenig Eigenstrategien anbieten.\n" +
  "- FK-klein: konkrete Team-Maßnahmen wie Belastungs-EKG, Schnittstellen-Workshop, Konfliktmoderation. Praktisch und umsetzbar formulieren.\n" +
  "- FK-groß: strategisch denken – Strukturen, Prozesse, Audit-Perspektive, Sensibilisierungs-Programme auf Organisationsebene. Weniger Mikro-Maßnahmen.\n" +
  "- Kontaktperson: Spezialinfos für die Funktion, Schnittstellen zu anderen Funktionen, Verweise auf einschlägige Materialien.\n\n" +
  "TONALITÄT: kurz statt lang, konkret statt abstrakt, warm aber nicht anbiedernd, sachlich aber nicht kühl. Keine Pathologisierung.\n\n" +
  "WERKZEUGE:\n" +
  "- listDocuments  – rollenspezifische KB-Inhalte (mit role-Filter).\n" +
  "- readDocument   – ein konkretes Dokument lesen.\n" +
  "- getContactPersons – hinterlegte Ansprechpersonen (mit role-Filter).\n" +
  "- setResilienceRole – einmalig, sobald die Rolle klar genug ist.\n";

function buildInstructions() {
  if (!RES_MODE) return BASE_PROMPT || DEFAULT_INSTRUCTIONS;
  let prompt = RESILIENCE_PREAMBLE;
  if (RES_ROLE) {
    let line = `\nDie Einschätzung steht bereits: ${RES_ROLE}`;
    if (RES_SUBROLE) line += ` (Sub-Rolle: ${RES_SUBROLE})`;
    line += ". Knüpfe direkt rollenspezifisch an, ohne erneut nach dem Kontext zu fragen.\n";
    prompt += line;
  } else {
    prompt += "\nDas Gespräch beginnt gerade. Richte deine Antwort danach aus, was die Person geschrieben hat – bei reinem Gruß einfach zurück grüßen und Raum geben, bei einem Anliegen kurz menschlich anknüpfen. Stelle keine vorbereitete Intake-Frage zum Arbeitskontext.\n";
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
