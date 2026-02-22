# AAS MCP Server — Dokumentation

## Übersicht

Dieses Dokument beschreibt den **MCP Server** (Model Context Protocol) für die Anbindung
an die standardisierte **AAS Repository API** (IDTA-01002-3-1, V3.1.1 SSP-002).

Der MCP Server stellt dem LLM Tools zur Verfügung, mit denen es **live Daten**
aus einem AAS Repository Server abfragen kann — z.B. Shells auflisten, Asset-Informationen
lesen, Submodelle mit allen Properties abrufen.

---

## Was ist MCP?

**MCP (Model Context Protocol)** ist ein offener Standard (JSON-RPC 2.0), der definiert,
wie LLMs auf externe Datenquellen und Tools zugreifen. Ursprünglich von Anthropic entwickelt,
wird MCP inzwischen von OpenAI, Google und vielen Tools (VS Code, Cursor, etc.) unterstützt.

### Die drei Rollen

| Rolle | Was es tut | Bei uns |
|-------|-----------|---------|
| **MCP Server** | Stellt Tools bereit, führt sie aus | Neuer Prozess: `mcp-server.js` |
| **MCP Client** | Verbindet sich zum Server, ruft Tools auf | Express-Backend (`routes.js`) |
| **LLM** | Entscheidet welches Tool gebraucht wird | Gemini / Groq API |

### MCP-Protokoll (JSON-RPC 2.0)

Die Kommunikation zwischen Client und Server nutzt standardisierte Nachrichten:

```
Client → Server:  "initialize"        → Handshake, Capabilities austauschen
Client → Server:  "tools/list"        → Server antwortet mit allen verfügbaren Tools
Client → Server:  "tools/call"        → Server führt das Tool aus, gibt Ergebnis zurück
```

---

## Architektur

```
┌──────────┐     ┌──────────────┐     ┌────────────┐     ┌────────────┐
│ Frontend │ ──→ │ Dein Backend │ ──→ │ MCP Server │ ──→ │ AAS Server │
│ (Browser)│     │ (MCP Client) │     │ (AAS Tools)│     │ (REST API) │
└──────────┘     └──────────────┘     └────────────┘     └────────────┘
                       ↕
                 ┌──────────┐
                 │ LLM API  │
                 │ (Gemini) │
                 └──────────┘
```

**Kurzfassung:**
1. User stellt Frage im Chat (z.B. "Welche Assets gibt es?")
2. Backend sendet Frage + Tool-Definitionen an LLM
3. LLM entscheidet, welches Tool es braucht (z.B. `listShells`)
4. Backend ruft das Tool über den MCP Server auf
5. MCP Server führt den REST-Call gegen den AAS Server aus
6. Ergebnis geht zurück ans LLM
7. LLM formuliert eine verständliche Antwort

> **Wiederverwendbar:** Der MCP Server ist ein eigenständiger Prozess — er kann auch
> direkt in Claude Desktop, VS Code oder jeden anderen MCP-kompatiblen Client eingebunden werden.

---

## AAS Repository API — Relevante Endpunkte

Quelle: [IDTA SwaggerHub](https://app.swaggerhub.com/apis/Plattform_i40/AssetAdministrationShellRepositoryServiceSpecification/V3.1.1_SSP-002)
| [GitHub](https://github.com/admin-shell-io/aas-specs-api)

Basis-URL: `{aas-server}/api/v3/`

> **Wichtig:** Alle Identifier (`aasIdentifier`, `submodelIdentifier`) sind **base64url-encoded**.

### Endpunkte

| # | Method | Pfad | Beschreibung |
|---|--------|------|--------------|
| 1 | GET | `/shells` | Alle Shells auflisten (paginiert) |
| 2 | GET | `/shells/{aasIdentifier}` | Einzelne Shell abrufen |
| 3 | GET | `/shells/{aasIdentifier}/asset-information` | Asset-Informationen einer Shell |
| 4 | GET | `/shells/{aasIdentifier}/asset-information/thumbnail` | Thumbnail-Bild (binär) |
| 5 | GET | `/shells/{aasIdentifier}/submodel-refs` | Alle Submodel-Referenzen einer Shell |
| 6 | GET | `/shells/{aasIdentifier}/submodels/{submodelIdentifier}` | Submodel abrufen (mit allen Elementen) |

### Query-Parameter

| Parameter | Typ | Endpunkt | Beschreibung |
|-----------|-----|----------|--------------|
| `AssetIds` | string[] | /shells | Filter nach Asset-IDs (base64url-encoded JSON) |
| `IdShort` | string | /shells | Filter nach IdShort |
| `Limit` | integer | /shells, /submodel-refs | Max. Ergebnisse pro Seite |
| `Cursor` | string | /shells, /submodel-refs | Paginierungs-Cursor |
| `Level` | string | /submodels/... | `deep` (Standard) oder `core` |
| `Extent` | string | /submodels/... | `withBlobValue` oder `withoutBlobValue` |

### Antwort-Formate

**Paginated Results** (für Listen):
```json
{
  "result": [ ... ],
  "paging_metadata": {
    "cursor": "next-page-cursor-string"
  }
}
```

**Fehler:**
```json
{
  "messages": [{
    "code": "string",
    "messageType": "Error",
    "text": "Beschreibung",
    "timestamp": "2025-01-01T00:00:00Z"
  }]
}
```

---

## Datenmodell (Metamodel V3.1.1)

### AssetAdministrationShell

Die oberste Einheit — repräsentiert ein verwaltetes Asset.

```
AssetAdministrationShell
├── id: string                      (eindeutige ID, z.B. URN oder IRI)
├── idShort: string                 (Kurzname, 1-128 Zeichen)
├── description: LangString[]       (mehrsprachige Beschreibung)
├── administration:
│   ├── version: string
│   └── revision: string
├── assetInformation:               *** (required) ***
│   ├── assetKind: "Instance" | "Type" | "Role" | "NotApplicable"
│   ├── globalAssetId: string       (globale Asset-ID)
│   ├── assetType: string
│   ├── specificAssetIds: [{name, value}]
│   └── defaultThumbnail: {path, contentType}
├── submodels: Reference[]          (Verweise auf zugehörige Submodels)
└── derivedFrom: Reference          (Verweis auf Vorlage)
```

### Submodel

Ein Aspekt oder Teilmodell eines Assets (z.B. Nameplate, Technische Daten).

```
Submodel
├── id: string                      (eindeutige ID)
├── idShort: string                 (Kurzname)
├── semanticId: Reference           (semantische Bedeutung, z.B. ECLASS)
├── description: LangString[]
├── kind: "Instance" | "Template"
└── submodelElements: SubmodelElement[]
```

### SubmodelElement (Typen)

| Typ | Beschreibung | Wichtige Felder |
|-----|-------------|-----------------|
| **Property** | Einzelwert | `valueType` (xs:string, xs:int, ...), `value` |
| **MultiLanguageProperty** | Mehrsprachiger Text | `value: [{language, text}]` |
| **File** | Datei-Verweis | `value` (URI), `contentType` |
| **Blob** | Binärdaten | `value` (base64), `contentType` |
| **Range** | Wertebereich | `valueType`, `min`, `max` |
| **ReferenceElement** | Verweis auf anderes Element | `value: Reference` |
| **SubmodelElementCollection** | Verschachtelte Gruppe | `value: SubmodelElement[]` |
| **SubmodelElementList** | Geordnete Liste | `value: SubmodelElement[]`, `typeValueListElement` |
| **Entity** | Entität mit Statements | `entityType`, `statements`, `globalAssetId` |
| **Operation** | Aufrufbare Funktion | `inputVariables`, `outputVariables` |
| **Capability** | Fähigkeit (Marker) | (keine zusätzlichen Felder) |
| **RelationshipElement** | Beziehung | `first: Reference`, `second: Reference` |

### Reference

Verweis auf ein anderes Element im AAS-Ökosystem.

```json
{
  "type": "ModelReference" | "ExternalReference",
  "keys": [
    { "type": "Submodel", "value": "urn:example:submodel:1234" }
  ]
}
```

### LangString

```json
[
  { "language": "de", "text": "Beschreibung auf Deutsch" },
  { "language": "en", "text": "Description in English" }
]
```

---

## MCP Server — Tool-Definitionen

### Tool 1: `listShells`

Listet alle Asset Administration Shells im Repository auf.

```json
{
  "name": "listShells",
  "description": "Listet alle Asset Administration Shells (AAS) im Repository auf. Gibt ID, IdShort und Asset-Informationen zurück.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "idShort": {
        "type": "string",
        "description": "Optional: Filter nach IdShort (Kurzname)"
      },
      "limit": {
        "type": "number",
        "description": "Optional: Max. Anzahl Ergebnisse (Standard: 100)"
      },
      "cursor": {
        "type": "string",
        "description": "Optional: Paginierungs-Cursor für nächste Seite"
      }
    }
  }
}
```

**Implementierung:** `GET /shells?IdShort=...&Limit=...&Cursor=...`

---

### Tool 2: `getShell`

Ruft eine einzelne Shell mit allen Details ab.

```json
{
  "name": "getShell",
  "description": "Ruft eine Asset Administration Shell anhand ihrer ID ab. Gibt alle Details inkl. Submodel-Referenzen zurück.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "aasId": {
        "type": "string",
        "description": "Die ID der Shell (wird automatisch base64url-encoded)"
      }
    },
    "required": ["aasId"]
  }
}
```

**Implementierung:** `GET /shells/{base64url(aasId)}`

---

### Tool 3: `getAssetInformation`

Ruft die Asset-Informationen einer Shell ab.

```json
{
  "name": "getAssetInformation",
  "description": "Ruft die Asset-Informationen einer Shell ab: Asset-Typ, globale Asset-ID, spezifische IDs.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "aasId": {
        "type": "string",
        "description": "Die ID der Shell"
      }
    },
    "required": ["aasId"]
  }
}
```

**Implementierung:** `GET /shells/{base64url(aasId)}/asset-information`

---

### Tool 4: `getSubmodelRefs`

Listet alle Submodel-Referenzen einer Shell auf.

```json
{
  "name": "getSubmodelRefs",
  "description": "Listet alle Submodel-Referenzen einer Shell auf. Zeigt welche Teilmodelle (z.B. Nameplate, Technische Daten) verfügbar sind.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "aasId": {
        "type": "string",
        "description": "Die ID der Shell"
      }
    },
    "required": ["aasId"]
  }
}
```

**Implementierung:** `GET /shells/{base64url(aasId)}/submodel-refs`

---

### Tool 5: `getSubmodel`

Ruft ein vollständiges Submodel mit allen Elementen ab.

```json
{
  "name": "getSubmodel",
  "description": "Ruft ein Submodel mit allen SubmodelElements ab. Enthält Properties, Collections, Dateien etc.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "aasId": {
        "type": "string",
        "description": "Die ID der Shell"
      },
      "submodelId": {
        "type": "string",
        "description": "Die ID des Submodels (wird automatisch base64url-encoded)"
      },
      "level": {
        "type": "string",
        "enum": ["deep", "core"],
        "description": "Optional: 'deep' (Standard) = alle verschachtelten Elemente, 'core' = nur oberste Ebene"
      }
    },
    "required": ["aasId", "submodelId"]
  }
}
```

**Implementierung:** `GET /shells/{base64url(aasId)}/submodels/{base64url(submodelId)}?Level=...`

---

### Tool 6: `getThumbnail`

Ruft das Thumbnail-Bild eines Assets ab.

```json
{
  "name": "getThumbnail",
  "description": "Lädt das Thumbnail-Bild eines Assets herunter. Gibt eine URL oder Base64-Daten zurück.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "aasId": {
        "type": "string",
        "description": "Die ID der Shell"
      }
    },
    "required": ["aasId"]
  }
}
```

**Implementierung:** `GET /shells/{base64url(aasId)}/asset-information/thumbnail`

---

## Datenflow im Detail — Schritt für Schritt

Ein konkretes Beispiel: User fragt "Welche Assets gibt es im Repository?"

### Schritt 1: Backend empfängt Nachricht

```
POST /api/messages  { content: "Welche Assets gibt es?" }
```

### Schritt 2: Backend fragt MCP Server nach verfügbaren Tools

```
Backend (MCP Client)  →  MCP Server
   JSON-RPC: "tools/list"

MCP Server antwortet:
   [
     { name: "listShells", description: "...", inputSchema: {...} },
     { name: "getShell", ... },
     { name: "getSubmodel", ... },
     ...
   ]
```

### Schritt 3: Backend konvertiert MCP-Tools → LLM Function Calling Format

Jedes LLM hat sein eigenes Format für Function Calling. Das Backend übersetzt:

```
MCP Format (Standard):                    Gemini Format:
{                                         {
  name: "listShells",                       functionDeclarations: [{
  inputSchema: {                              name: "listShells",
    type: "object",                           parameters: {
    properties: {                               type: "OBJECT",
      idShort: {...}                            properties: {
    }                                             idShort: {...}
  }                                             }
}                                             }
                                            }]
                                          }
```

### Schritt 4: LLM entscheidet — Tool Call

```
Backend  →  Gemini API
   messages: "Welche Assets gibt es?"
   tools: [listShells, getShell, getSubmodel, ...]

Gemini antwortet:
   functionCall: { name: "listShells", args: {} }
```

Das LLM hat analysiert: "Um diese Frage zu beantworten, brauche ich `listShells`."

### Schritt 5: Backend leitet an MCP Server weiter

```
Backend (MCP Client)  →  MCP Server
   JSON-RPC: "tools/call"  { name: "listShells", arguments: {} }

MCP Server intern:
   1. Baut URL: GET https://aas-server.example.com/api/v3/shells
   2. Führt HTTP-Request aus
   3. Parst JSON-Antwort
   4. Gibt strukturiertes Ergebnis zurück an Client
```

### Schritt 6: Ergebnis zurück ans LLM

```
Backend  →  Gemini API
   toolResult: {
     name: "listShells",
     content: "3 Shells gefunden:\n1. Pumpe_A (id: urn:aas:pumpe-a)\n2. Motor_B (id: urn:aas:motor-b)\n..."
   }

Gemini antwortet (finale Antwort):
   "Im Repository befinden sich 3 Assets:
    - Pumpe A
    - Motor B
    - Ventil C
    Soll ich Details zu einem bestimmten Asset abrufen?"
```

### Schritt 7: Antwort wird im Chat angezeigt

```
→ Chat-Bubble (assistant): "Im Repository befinden sich 3 Assets: ..."
```

### Mehrfach-Tool-Calls

Das LLM kann auch **mehrere Tools nacheinander** aufrufen. Beispiel:

```
User: "Zeig mir die technischen Daten der Pumpe A"

LLM → Tool 1: listShells()                      → findet Pumpe_A ID
LLM → Tool 2: getSubmodelRefs(aasId: "urn:...")  → findet Submodel "TechnicalData"
LLM → Tool 3: getSubmodel(aasId: "...", submodelId: "...") → holt alle Properties
LLM → Finale Antwort: "Die Pumpe A hat folgende technische Daten: ..."
```

---

## Standardkonformität

### Was ist 100% Standard, was ist custom?

| Komponente | Standard | Protokoll/Spec |
|------------|----------|---------------|
| MCP Server ↔ MCP Client | **MCP Standard** | JSON-RPC 2.0, `tools/list`, `tools/call` |
| Tool-Definitionen | **MCP Standard** | `name`, `description`, `inputSchema` (JSON Schema) |
| MCP Server → AAS API | **IDTA Standard** | IDTA-01002-3-1, V3.1.1 SSP-002 REST API |
| MCP Client → LLM | **Custom Mapping** | Konvertierung MCP-Tools → Gemini/Groq Function Calling |

Der **einzige nicht-standardisierte Teil** ist die Konvertierung von MCP-Tool-Definitionen
ins jeweilige LLM Function Calling Format. Das ist unvermeidlich, weil jedes LLM (Gemini, Groq,
OpenAI, Claude) ein eigenes Format dafür hat. Der MCP Server selbst bleibt 100% standardkonform
und ist wiederverwendbar mit jedem MCP-kompatiblen Client.

---

## Projektstruktur — Implementierung

```
Kanban/                              ← Projekt-Root
├── server.js                        ← Express-Server (startet alles)
├── shared/                          ← Auth, DB, etc.
├── package.json                     ← Abhängigkeit: @modelcontextprotocol/sdk
├── apps/
│   └── aas-chat/
│       ├── index.html               ← ① FRONTEND (Browser)
│       ├── app.js                   ← ① FRONTEND (Browser)
│       ├── styles.css               ← ① FRONTEND (Browser)
│       ├── routes.js                ← ② MCP CLIENT (Express-Backend)
│       ├── mcp-server.mjs           ← ③ MCP SERVER (eigenständiger Prozess)
│       └── AAS-MCP.md              ← Diese Dokumentation
```

| # | Komponente | Datei(en) | Wo läuft es? |
|---|-----------|-----------|-------------|
| ① | **Frontend** | `index.html`, `app.js`, `styles.css` | Im Browser des Users |
| ② | **MCP Client** | `routes.js` | Im Express-Backend (Node.js) |
| ③ | **MCP Server** | `mcp-server.mjs` | Eigener Node.js Child-Prozess (stdio) |
| ④ | **AAS Server** | Extern — nicht Teil des Projekts | Im Netzwerk des Users |
| ⑤ | **LLM API** | Extern — Gemini / Groq | Cloud (Google / Groq Server) |

---

## MCP Server — Implementierung

### Technologie

- **Runtime:** Node.js (ESM, `.mjs`)
- **MCP SDK:** `@modelcontextprotocol/sdk` (offizielles SDK)
- **Transport:** stdio (Backend startet den MCP Server als Child-Prozess)
- **Schema:** Zod (für Tool-Parameter-Validierung, als SDK-Dependency mitinstalliert)

### `mcp-server.mjs` — MCP Server (eigenständig)

```
Aufbau:
├── MCP-Protokoll via McpServer + StdioServerTransport
├── 6 Tools registriert (mit Zod-Schemas):
│   ├── listShells     → GET /shells
│   ├── getShell       → GET /shells/{id}
│   ├── getAssetInfo   → GET /shells/{id}/asset-information
│   ├── getSubmodelRefs → GET /shells/{id}/submodel-refs
│   ├── getSubmodel    → GET /shells/{id}/submodels/{id}
│   └── getThumbnail   → GET /shells/{id}/asset-information/thumbnail
├── AAS_BASE_URL aus Umgebungsvariable
├── IDs werden automatisch base64url-encoded
├── Ergebnisse als lesbarer Text (nicht raw JSON) — optimiert für LLM-Verständnis
└── Fehlerbehandlung mit isError-Flag
```

Standalone nutzbar — auch mit Claude Desktop, VS Code, etc.

### `routes.js` — MCP Client (im Backend)

```
Neue Funktionen:
├── getMcpSdk()           → Dynamic import der ESM SDK-Module
├── createMcpClient(url)  → Spawnt MCP Server, verbindet Client
├── mcpToolsToGemini()    → Konvertiert MCP-Tools → Gemini functionDeclarations
├── mcpToolsToGroq()      → Konvertiert MCP-Tools → OpenAI/Groq tools Format
├── chatGeminiWithTools() → Gemini Function Calling Loop (max 5 Runden)
└── chatGroqWithTools()   → Groq Function Calling Loop (max 5 Runden)

Logik im Chat-Handler (POST /api/messages):
├── Wenn aas_url gesetzt:
│   ├── MCP Client erstellen (spawnt mcp-server.mjs)
│   ├── Tools holen (tools/list)
│   ├── Function Calling Loop starten
│   └── MCP Client schließen
└── Wenn aas_url NICHT gesetzt:
    └── Regulärer Chat ohne Tools (bisheriges Verhalten)
```

### Base64url-Encoding

Die AAS API verlangt base64url-encoded Identifier in URLs:

```javascript
function toBase64Url(str) {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// Beispiel:
// "https://example.com/aas/1234" → "aHR0cHM6Ly9leGFtcGxlLmNvbS9hYXMvMTIzNA"
```

### Fehlerbehandlung

| AAS API Status | MCP Ergebnis |
|----------------|-------------|
| 200 | Erfolg → JSON-Daten zurückgeben |
| 400 | Fehler: "Ungültige Anfrage" + Details |
| 401/403 | Fehler: "Nicht autorisiert — AAS Server erfordert Authentifizierung" |
| 404 | Fehler: "Shell/Submodel nicht gefunden" |
| 500 | Fehler: "AAS Server Fehler" + Details |
| Timeout/Netzwerk | Fehler: "AAS Server nicht erreichbar" |

---

## Status

- [x] MCP SDK installiert (`@modelcontextprotocol/sdk`)
- [x] MCP Server implementiert (`mcp-server.mjs`) — 6 Tools, AAS API Anbindung
- [x] MCP Client im Backend (`routes.js`) — dynamischer Import, Client-Lifecycle
- [x] Gemini Function Calling Loop — inkl. google_search Fallback
- [x] Groq Function Calling Loop — OpenAI-kompatibles Format
- [x] MCP Server getestet — `initialize` + `tools/list` funktioniert
- [ ] Frontend: Tool-Calls in Chat-UI anzeigen (z.B. "Suche Shells...")
- [ ] Testen mit echtem AAS Server

---

## Referenzen

- [IDTA AAS API Spec (SwaggerHub)](https://app.swaggerhub.com/apis/Plattform_i40/AssetAdministrationShellRepositoryServiceSpecification/V3.1.1_SSP-002)
- [AAS API GitHub (admin-shell-io)](https://github.com/admin-shell-io/aas-specs-api)
- [AAS Metamodel GitHub](https://github.com/admin-shell-io/aas-specs-metamodel)
- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP SDK (npm)](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
