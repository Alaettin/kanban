/* ===== BMEcat Reader — Frontend ===== */

const I18N = {
  de: {
    brandText: "BMEcat Reader",
    dropText: "BMEcat-XML-Datei hierher ziehen oder klicken",
    openBtn: "Datei \u00f6ffnen",
    searchPlaceholder: "Suche nach Artikelnr. oder Beschreibung\u2026",
    productCount: "{n} Artikel",
    catalog: "Katalog",
    supplier: "Lieferant",
    language: "Sprache",
    date: "Datum",
    currency: "W\u00e4hrung",
    version: "Version",
    territory: "Gebiet",
    articles: "Artikel",
    featureGroup: "{name} ({n})",
    features: "Merkmale ({n})",
    priceNet: "netto",
    priceGross: "brutto",
    noArticles: "Keine Artikel gefunden.",
    langMap: { deu: "Deutsch", eng: "Englisch" },
  },
  en: {
    brandText: "BMEcat Reader",
    dropText: "Drag a BMEcat XML file here or click",
    openBtn: "Open file",
    searchPlaceholder: "Search by article no. or description\u2026",
    productCount: "{n} articles",
    catalog: "Catalog",
    supplier: "Supplier",
    language: "Language",
    date: "Date",
    currency: "Currency",
    version: "Version",
    territory: "Territory",
    articles: "Articles",
    featureGroup: "{name} ({n})",
    features: "Features ({n})",
    priceNet: "net",
    priceGross: "gross",
    noArticles: "No articles found.",
    langMap: { deu: "German", eng: "English" },
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
let currentUser = null;
let allProducts = [];
let filteredProducts = [];
let unitMap = {};   // UNIT_ID → short name
let langPref = "deu"; // preferred language from catalog

function t(key) { return I18N[locale][key] || key; }

/* ===== DOM refs ===== */
const $ = (s) => document.getElementById(s);
const dropZone = $("drop-zone");
const catalogView = $("catalog-view");
const fileInput = $("file-input");
const searchInput = $("search-input");
const searchClear = $("search-clear");

/* ===== i18n ===== */
function applyLocale() {
  document.documentElement.lang = locale;
  $("brand-text").textContent = t("brandText");
  $("drop-text").textContent = t("dropText");
  $("open-btn-label").textContent = t("openBtn");
  searchInput.placeholder = t("searchPlaceholder");
  $("locale-de-btn").classList.toggle("active", locale === "de");
  $("locale-en-btn").classList.toggle("active", locale === "en");
  updateCount();
}

function setLocale(lang) {
  locale = lang;
  localStorage.setItem("kanban-locale", lang);
  applyLocale();
}

/* ===== User menu ===== */
function initUserMenu() {
  const toggle = $("user-menu-toggle");
  const menu = $("user-menu");
  toggle.addEventListener("click", () => {
    const open = !menu.hidden;
    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", String(!open));
  });
  document.addEventListener("click", (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }
  });
  $("locale-de-btn").addEventListener("click", () => setLocale("de"));
  $("locale-en-btn").addEventListener("click", () => setLocale("en"));
  $("logout-btn").addEventListener("click", () => { window.location.href = "/logout"; });
}

/* ===== File handling ===== */
function initFileHandling() {
  dropZone.addEventListener("click", () => fileInput.click());
  $("open-btn").addEventListener("click", (e) => { e.stopPropagation(); fileInput.click(); });
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  $("close-btn").addEventListener("click", closeCatalog);
}

function handleFile(file) {
  $("file-name").textContent = file.name;
  const reader = new FileReader();
  reader.onload = (e) => {
    // Strip XML namespace so getElementsByTagName works universally
    const xmlText = e.target.result.replace(/\sxmlns="[^"]*"/g, "");
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) {
      alert("XML-Parse-Fehler");
      return;
    }
    parseBMEcat(doc);
    dropZone.hidden = true;
    catalogView.hidden = false;
  };
  reader.readAsText(file);
}

function closeCatalog() {
  catalogView.hidden = true;
  dropZone.hidden = false;
  allProducts = [];
  filteredProducts = [];
  unitMap = {};
  $("catalog-header").innerHTML = "";
  $("product-grid").innerHTML = "";
  searchInput.value = "";
  searchClear.hidden = true;
  fileInput.value = "";
}

/* ===== XML Helpers ===== */
// Get text of first direct/descendant tag, optionally filtered by lang attribute
function txt(el, tag) {
  if (!el) return "";
  const n = el.getElementsByTagName(tag)[0];
  return n ? n.textContent.trim() : "";
}

// Get text with language preference — picks lang-matching element, falls back to first
function txtLang(el, tag, lang) {
  if (!el) return "";
  const nodes = el.getElementsByTagName(tag);
  if (!nodes.length) return "";
  for (const n of nodes) {
    if (n.getAttribute("lang") === lang) return n.textContent.trim();
  }
  // Fallback: default=true, then first
  for (const n of nodes) {
    if (n.getAttribute("default") === "true") return n.textContent.trim();
  }
  return nodes[0].textContent.trim();
}

// Direct children only (not deep descendants)
function directChild(el, tag) {
  if (!el) return null;
  for (const c of el.children) {
    if (c.tagName === tag) return c;
  }
  return null;
}

function directChildren(el, tag) {
  if (!el) return [];
  const result = [];
  for (const c of el.children) {
    if (c.tagName === tag) result.push(c);
  }
  return result;
}

/* ===== BMEcat XML Parser ===== */
function parseBMEcat(doc) {
  const root = doc.documentElement;
  const header = root.getElementsByTagName("HEADER")[0];

  // Detect language preference from catalog
  if (header) {
    const langs = header.getElementsByTagName("LANGUAGE");
    for (const l of langs) {
      if (l.getAttribute("default") === "true") {
        langPref = l.textContent.trim();
        break;
      }
    }
    if (!langPref && langs.length) langPref = langs[0].textContent.trim();
  }

  // Build unit map from CLASSIFICATION_SYSTEM > UNITS
  unitMap = {};
  const units = root.getElementsByTagName("UNIT");
  for (const u of units) {
    const uid = txt(u, "UNIT_ID");
    const shortName = txtLang(u, "UNIT_SHORTNAME", "eng") || txt(u, "UNIT_CODE");
    if (uid && shortName) unitMap[uid] = shortName;
  }

  // Header info
  const info = {};
  if (header) {
    const catalogEl = directChild(header, "CATALOG");
    info.catalogName = txtLang(catalogEl, "CATALOG_NAME", langPref) || txt(catalogEl, "CATALOG_ID") || "";
    info.version = txt(catalogEl, "CATALOG_VERSION") || root.getAttribute("version") || "";
    info.currency = txt(catalogEl, "CURRENCY") || "";
    info.territory = txt(catalogEl, "TERRITORY") || "";

    // Language display
    const defaultLang = langPref || "";
    const langLabel = (I18N[locale].langMap || {})[defaultLang] || defaultLang;
    info.language = langLabel;

    // Date
    const dtEl = catalogEl ? catalogEl.getElementsByTagName("DATETIME")[0] : null;
    info.date = txt(dtEl, "DATE") || "";

    // Supplier
    const supplierEl = header.getElementsByTagName("SUPPLIER")[0];
    if (supplierEl) {
      info.supplier = txt(supplierEl, "SUPPLIER_NAME") || "";
    }
  }

  // Products / Articles
  const products = root.getElementsByTagName("PRODUCT");
  const articles = root.getElementsByTagName("ARTICLE");
  const items = products.length > 0 ? Array.from(products) : Array.from(articles);

  allProducts = items.map((el) => parseProduct(el));
  filteredProducts = allProducts;
  renderHeader(info);
  renderProducts();
  updateCount();
}

function parseProduct(el) {
  const product = {};

  // Article number
  product.aid = txt(el, "SUPPLIER_PID") || txt(el, "SUPPLIER_AID") || "";

  // Descriptions with language preference
  const descEl = directChild(el, "PRODUCT_DETAILS") || directChild(el, "ARTICLE_DETAILS") || el;
  product.descShort = txtLang(descEl, "DESCRIPTION_SHORT", langPref) || "";
  product.descLong = txtLang(descEl, "DESCRIPTION_LONG", langPref) || "";
  product.ean = txt(descEl, "EAN") || txt(descEl, "INTERNATIONAL_PID") || txt(descEl, "INTERNATIONAL_AID") || "";
  product.manufacturerName = txt(descEl, "MANUFACTURER_NAME") || "";
  product.manufacturerAid = txt(descEl, "MANUFACTURER_PID") || txt(descEl, "MANUFACTURER_AID") || "";

  // Prices
  product.prices = [];
  const priceDetails = el.getElementsByTagName("PRODUCT_PRICE_DETAILS")[0] ||
    el.getElementsByTagName("ARTICLE_PRICE_DETAILS")[0];
  if (priceDetails) {
    const priceEls = priceDetails.getElementsByTagName("PRODUCT_PRICE").length > 0
      ? priceDetails.getElementsByTagName("PRODUCT_PRICE")
      : priceDetails.getElementsByTagName("ARTICLE_PRICE");
    for (const p of priceEls) {
      const type = p.getAttribute("price_type") || "";
      const amount = txt(p, "PRICE_AMOUNT");
      const currency = txt(p, "PRICE_CURRENCY");
      const lowerBound = txt(p, "LOWER_BOUND");
      if (amount && amount !== "0") {
        product.prices.push({ type, amount, currency, lowerBound });
      }
    }
  }

  // Features — grouped
  product.featureGroups = [];
  const featuresEl = directChild(el, "PRODUCT_FEATURES") || directChild(el, "ARTICLE_FEATURES");
  if (featuresEl) {
    // Feature groups
    const groups = directChildren(featuresEl, "FEATURE_GROUP");
    for (const g of groups) {
      const groupName = txtLang(g, "FEATURE_GROUP_NAME", langPref) || "";
      const features = parseFeatures(directChildren(g, "FEATURE"));
      if (features.length) {
        product.featureGroups.push({ name: groupName, features });
      }
    }

    // Ungrouped features (direct children of PRODUCT_FEATURES)
    const ungrouped = parseFeatures(directChildren(featuresEl, "FEATURE"));
    if (ungrouped.length) {
      product.featureGroups.push({ name: "", features: ungrouped });
    }
  }

  // Order details
  const orderEl = directChild(el, "PRODUCT_ORDER_DETAILS") || directChild(el, "ARTICLE_ORDER_DETAILS");
  product.orderUnit = txt(orderEl, "ORDER_UNIT") || "";

  return product;
}

function parseFeatures(featureEls) {
  const result = [];
  for (const f of featureEls) {
    // Name: FTEMPLATE > FT_NAME (BMEcat 2005) or FNAME (1.2)
    const tpl = directChild(f, "FTEMPLATE");
    const name = tpl
      ? (txtLang(tpl, "FT_NAME", langPref) || txt(tpl, "FT_NAME"))
      : (txt(f, "FNAME") || txt(f, "FEATURE_NAME"));
    if (!name) continue;

    // Value: FVALUE, or FVALUE_DETAILS (when VALUE_IDREF is used)
    let value = txt(f, "FVALUE") || txtLang(f, "FVALUE_DETAILS", langPref) || "";

    // Unit: resolve from unitMap or use raw
    const rawUnit = txt(f, "FUNIT") || txt(f, "FEATURE_UNIT") || "";
    const unit = unitMap[rawUnit] || rawUnit;

    result.push({ name, value, unit });
  }
  return result;
}

/* ===== Rendering ===== */
function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function renderHeader(info) {
  const cards = [];
  if (info.catalogName) cards.push({ label: t("catalog"), value: info.catalogName });
  if (info.supplier) cards.push({ label: t("supplier"), value: info.supplier });
  if (info.language) cards.push({ label: t("language"), value: info.language });
  if (info.date) cards.push({ label: t("date"), value: info.date });
  if (info.currency) cards.push({ label: t("currency"), value: info.currency });
  if (info.territory) cards.push({ label: t("territory"), value: info.territory });
  if (info.version) cards.push({ label: t("version"), value: info.version });
  cards.push({ label: t("articles"), value: String(allProducts.length || "\u2014") });

  $("catalog-header").innerHTML = cards.map((c) =>
    '<div class="info-card">' +
      '<div class="info-card-label">' + esc(c.label) + '</div>' +
      '<div class="info-card-value">' + esc(c.value) + '</div>' +
    '</div>'
  ).join("");
}

function renderProducts() {
  const grid = $("product-grid");
  if (filteredProducts.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted);text-align:center;padding:2rem 0">' + esc(t("noArticles")) + '</p>';
    return;
  }
  grid.innerHTML = filteredProducts.map((p) => {
    let html = '<div class="product-card">';
    html += '<div class="product-card-top">';
    if (p.aid) html += '<span class="product-aid">' + esc(p.aid) + '</span>';
    if (p.descShort) html += '<span class="product-desc-short">' + esc(p.descShort) + '</span>';
    if (p.ean) html += '<span class="product-ean">' + esc(p.ean) + '</span>';
    html += '</div>';

    if (p.descLong) html += '<div class="product-desc-long">' + esc(p.descLong) + '</div>';

    // Prices
    if (p.prices.length) {
      html += '<div class="product-prices">';
      for (const pr of p.prices) {
        const typeLabel = pr.type === "net_list" || pr.type === "nrp" ? t("priceNet") :
          pr.type === "gros_list" ? t("priceGross") : pr.type || "";
        html += '<span class="price-tag">';
        html += esc(pr.amount);
        if (pr.currency) html += ' <span class="price-currency">' + esc(pr.currency) + '</span>';
        if (typeLabel) html += ' <span class="price-type">' + esc(typeLabel) + '</span>';
        if (pr.lowerBound && pr.lowerBound !== "1") html += ' <span class="price-type">ab ' + esc(pr.lowerBound) + '</span>';
        html += '</span>';
      }
      html += '</div>';
    }

    // Meta
    const meta = [];
    if (p.manufacturerName) meta.push('<span class="product-meta-item"><strong>' + esc(p.manufacturerName) + '</strong></span>');
    if (p.manufacturerAid) meta.push('<span class="product-meta-item">MPN: <strong>' + esc(p.manufacturerAid) + '</strong></span>');
    if (p.orderUnit) meta.push('<span class="product-meta-item">OE: <strong>' + esc(p.orderUnit) + '</strong></span>');
    if (meta.length) html += '<div class="product-meta">' + meta.join("") + '</div>';

    // Feature groups
    for (const group of p.featureGroups) {
      html += '<details class="product-features">';
      if (group.name) {
        html += '<summary>' + t("featureGroup").replace("{name}", esc(group.name)).replace("{n}", group.features.length) + '</summary>';
      } else {
        html += '<summary>' + t("features").replace("{n}", group.features.length) + '</summary>';
      }
      html += '<div class="feature-grid">';
      for (const f of group.features) {
        html += '<span class="feature-item"><span class="feature-name">' + esc(f.name) + ':</span> ';
        html += '<span class="feature-value">' + esc(f.value) + '</span>';
        if (f.unit) html += ' <span class="feature-unit">' + esc(f.unit) + '</span>';
        html += '</span>';
      }
      html += '</div></details>';
    }

    html += '</div>';
    return html;
  }).join("");
}

function updateCount() {
  const el = $("product-count");
  if (el) el.textContent = filteredProducts.length > 0
    ? t("productCount").replace("{n}", filteredProducts.length)
    : "";
}

/* ===== Search ===== */
function initSearch() {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    searchClear.hidden = !q;
    if (!q) {
      filteredProducts = allProducts;
    } else {
      filteredProducts = allProducts.filter((p) =>
        (p.aid && p.aid.toLowerCase().includes(q)) ||
        (p.descShort && p.descShort.toLowerCase().includes(q)) ||
        (p.descLong && p.descLong.toLowerCase().includes(q)) ||
        (p.ean && p.ean.toLowerCase().includes(q)) ||
        (p.manufacturerAid && p.manufacturerAid.toLowerCase().includes(q)) ||
        (p.manufacturerName && p.manufacturerName.toLowerCase().includes(q))
      );
    }
    renderProducts();
    updateCount();
  });
  searchClear.addEventListener("click", () => {
    searchInput.value = "";
    searchClear.hidden = true;
    filteredProducts = allProducts;
    renderProducts();
    updateCount();
  });
}

/* ===== Init ===== */
async function init() {
  initUserMenu();
  initFileHandling();
  initSearch();

  try {
    const res = await fetch("/api/me");
    if (res.ok) {
      currentUser = await res.json();
      if (currentUser.name) {
        const parts = currentUser.name.split(" ");
        $("user-initials").textContent =
          parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
        $("user-info").textContent = currentUser.name;
      }
    }
  } catch {}

  applyLocale();
}

init();
