const appGrid = document.getElementById("app-grid");
const tileTemplate = document.getElementById("app-tile-template");
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const greeting = document.getElementById("dash-greeting");
const subtitle = document.querySelector(".dash-subtitle");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");

const APP_ICONS = {
  kanban: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>',
};

const I18N = {
  de: {
    subtitle: "Waehle eine App, um loszulegen.",
    logout: "Logout",
    morgen: "Guten Morgen",
    tag: "Guten Tag",
    abend: "Guten Abend",
  },
  en: {
    subtitle: "Choose an app to get started.",
    logout: "Logout",
    morgen: "Good morning",
    tag: "Good afternoon",
    abend: "Good evening",
  },
};

let currentUser = null;
let locale = localStorage.getItem("kanban-locale") || "de";

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

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getGreeting() {
  const t = I18N[locale];
  const hour = new Date().getHours();
  if (hour < 12) return t.morgen;
  if (hour < 18) return t.tag;
  return t.abend;
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

function applyLocaleToUI() {
  const t = I18N[locale];
  subtitle.textContent = t.subtitle;
  logoutBtn.textContent = t.logout;
  if (currentUser) {
    greeting.textContent = `${getGreeting()}, ${(currentUser.name || "").split(" ")[0] || "User"}`;
  }
}

function renderApps(apps) {
  appGrid.innerHTML = "";
  for (const app of apps) {
    const clone = tileTemplate.content.cloneNode(true);
    const tile = clone.querySelector(".app-tile");
    const icon = clone.querySelector(".app-tile-icon");
    const name = clone.querySelector(".app-tile-name");
    const desc = clone.querySelector(".app-tile-desc");

    tile.href = app.path;
    name.textContent = app.name;
    desc.textContent = app.description || "";

    icon.style.background = `linear-gradient(135deg, ${app.color || "#2563eb"}, ${shiftColor(app.color || "#2563eb")})`;
    icon.innerHTML = APP_ICONS[app.icon] || APP_ICONS.kanban;

    appGrid.appendChild(clone);
  }
}

function shiftColor(hex) {
  // Simple hue shift for gradient second color
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.min(255, r + 30)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 40)})`;
}

// User menu toggle
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

logoutBtn.addEventListener("click", async () => {
  await apiRequest("/auth/logout", { method: "POST" });
  window.location.href = "/";
});

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

async function init() {
  // Load user
  const userResult = await apiRequest("/api/me");
  if (userResult.ok && userResult.payload) {
    currentUser = userResult.payload;
    userInitials.textContent = getInitials(currentUser.name);
    userInfo.textContent = currentUser.name || currentUser.email || "";
    greeting.textContent = `${getGreeting()}, ${(currentUser.name || "").split(" ")[0] || "User"}`;
  }

  // Init locale
  setLocale(locale);

  // Load apps
  const appsResult = await apiRequest("/api/apps");
  if (appsResult.ok && appsResult.payload?.apps) {
    renderApps(appsResult.payload.apps);
  }
}

init();
