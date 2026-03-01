const { exec } = require("child_process");
const path = require("path");

const COMPOSE_DIR = path.join(__dirname, "docker");
const COMPOSE_FILE = path.join(COMPOSE_DIR, "docker-compose.yml");
const PROJECT_NAME = "edc";

// Fixed EDC configuration (shared by all users)
// managementUrl = Kanban-Container → EDC-Container (same Docker network)
// protocolUrl   = EDC-Container → EDC-Container (DSP Kommunikation)
const EDC_CONFIG = {
  provider: {
    participantId: "provider",
    managementUrl: "http://edc-provider:19193/management",
    protocolUrl:   "http://provider:19194/protocol",
    publicUrl:     "http://edc-provider:19291/public",
    apiKey:        "",
  },
  consumer: {
    participantId: "consumer",
    managementUrl: "http://edc-consumer:29193/management",
    protocolUrl:   "http://consumer:29194/protocol",
    publicUrl:     "http://edc-consumer:29291/public",
    apiKey:        "",
  },
};

// 2 All-in-One Container (CP + DP jeweils)
const CONTAINERS = [
  "edc-provider",
  "edc-consumer",
];

function execAsync(cmd, opts = {}) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 120000, ...opts }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve({ stdout: (stdout || "").trim(), stderr: (stderr || "").trim() });
    });
  });
}

function composeCmd(action) {
  return `docker compose -p ${PROJECT_NAME} -f "${COMPOSE_FILE}" ${action}`;
}

async function getStatus() {
  const result = {};
  for (const name of CONTAINERS) {
    try {
      const { stdout } = await execAsync(
        `docker inspect --format="{{.State.Status}}" ${name}`
      );
      result[name] = stdout.replace(/"/g, ""); // "running" → running
    } catch {
      result[name] = "not_found";
    }
  }
  return result;
}

async function startContainers() {
  await execAsync(composeCmd("up -d"));
  return getStatus();
}

async function stopContainers() {
  await execAsync(composeCmd("down"));
  return getStatus();
}

async function restartContainers() {
  await execAsync(composeCmd("restart"));
  return getStatus();
}

function getEdcConfig() {
  return EDC_CONFIG;
}

module.exports = {
  getStatus,
  startContainers,
  stopContainers,
  restartContainers,
  getEdcConfig,
  EDC_CONFIG,
  CONTAINERS,
};
