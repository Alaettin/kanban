/* =====================================================================
   Card Scanner – Frontend Logic
   ===================================================================== */

// ---------------------------------------------------------------------------
// i18n
// ---------------------------------------------------------------------------
const I18N = {
  de: {
    brandText: "Card Scanner",
    listTitle: "Visitenkarten",
    emptyText: "Noch keine Visitenkarten gescannt.",
    emptyHint: "Tippe auf den Button unten, um eine Karte zu scannen.",
    scanBtn: "Scannen",
    ocrText: "Text wird erkannt\u2026",
    editTitleNew: "Neue Karte",
    editTitleEdit: "Karte bearbeiten",
    lblName: "Name",
    lblCompany: "Firma",
    lblPosition: "Position",
    lblPhone: "Telefon",
    lblEmail: "E-Mail",
    lblWebsite: "Website",
    lblAddress: "Adresse",
    saveBtn: "Speichern",
    deleteBtn: "L\u00f6schen",
    confirmText: "Karte wirklich l\u00f6schen?",
    confirmCancel: "Abbrechen",
    confirmOk: "L\u00f6schen",
    logout: "Logout",
    ocrFailed: "Texterkennung fehlgeschlagen. Bitte manuell eingeben.",
    saved: "Gespeichert",
    deleted: "Gel\u00f6scht",
    webcamTitle: "Kamera",
    webcamNoAccess: "Kein Kamerazugriff m\u00f6glich. Bitte Bild hochladen.",
    uploadBtn: "Bild hochladen",
    rawTextLabel: "Erkannter Text",
    lblCardId: "Card ID",
    constructConfirm: "DTI Connector f\u00fcr Card Scanner erstellen? Hier\u00fcber k\u00f6nnen deine Visitenkarten \u00fcber die API abgerufen werden.",
    constructOk: "Erstellen",
    syncConfirm: "Karten in den DTI Connector \u00fcbertragen/aktualisieren?",
    syncOk: "Aktualisieren",
    syncSuccess: "{count} Karte(n) synchronisiert",
    syncFailed: "Synchronisierung fehlgeschlagen",
    constructFailed: "Connector konnte nicht erstellt werden",
    dtiCancel: "Abbrechen",
    qrUrlLabel: "Base-URL f\u00fcr QR-Code eingeben",
    qrUrlOk: "\u00dcbernehmen",
    qrUrlCancel: "Abbrechen",
    qrUrlInvalid: "Bitte eine g\u00fcltige URL eingeben (https://...)",
    autosyncEnable: "Auto-Sync aktivieren? Neue Scans werden automatisch in den DTI Connector \u00fcbertragen.",
    autosyncDisable: "Auto-Sync deaktivieren?",
    autosyncOn: "Auto-Sync aktiviert",
    autosyncOff: "Auto-Sync deaktiviert",
    autosyncOk: "Ja",
  },
  en: {
    brandText: "Card Scanner",
    listTitle: "Business Cards",
    emptyText: "No business cards scanned yet.",
    emptyHint: "Tap the button below to scan a card.",
    scanBtn: "Scan",
    ocrText: "Recognizing text\u2026",
    editTitleNew: "New Card",
    editTitleEdit: "Edit Card",
    lblName: "Name",
    lblCompany: "Company",
    lblPosition: "Position",
    lblPhone: "Phone",
    lblEmail: "Email",
    lblWebsite: "Website",
    lblAddress: "Address",
    saveBtn: "Save",
    deleteBtn: "Delete",
    confirmText: "Really delete this card?",
    confirmCancel: "Cancel",
    confirmOk: "Delete",
    logout: "Logout",
    ocrFailed: "Text recognition failed. Please enter manually.",
    saved: "Saved",
    deleted: "Deleted",
    webcamTitle: "Camera",
    webcamNoAccess: "No camera access. Please upload an image.",
    uploadBtn: "Upload image",
    rawTextLabel: "Recognized text",
    lblCardId: "Card ID",
    constructConfirm: "Create a DTI Connector for Card Scanner? This allows your business cards to be accessed via the API.",
    constructOk: "Create",
    syncConfirm: "Transfer/update cards to the DTI Connector?",
    syncOk: "Update",
    syncSuccess: "{count} card(s) synchronized",
    syncFailed: "Synchronization failed",
    constructFailed: "Failed to create connector",
    dtiCancel: "Cancel",
    qrUrlLabel: "Enter base URL for QR code",
    qrUrlOk: "Apply",
    qrUrlCancel: "Cancel",
    qrUrlInvalid: "Please enter a valid URL (https://...)",
    autosyncEnable: "Enable auto-sync? New scans will be automatically transferred to the DTI Connector.",
    autosyncDisable: "Disable auto-sync?",
    autosyncOn: "Auto-sync enabled",
    autosyncOff: "Auto-sync disabled",
    autosyncOk: "Yes",
  },
};

let locale = localStorage.getItem("kanban-locale") || "de";
function t(key) {
  return (I18N[locale] && I18N[locale][key]) || (I18N.de && I18N.de[key]) || key;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let cards = [];
let editingId = null; // null = new card, string = existing scan_id
let tesseractWorker = null;
let pendingImageBase64 = null; // original image kept for saving
let qrBaseUrl = null;
let autoSyncEnabled = false;

// ---------------------------------------------------------------------------
// DOM
// ---------------------------------------------------------------------------
const listView = document.getElementById("card-list-view");
const editView = document.getElementById("card-edit-view");
const cardGrid = document.getElementById("card-grid");
const emptyState = document.getElementById("empty-state");
const cardCount = document.getElementById("card-count");
const scanBtn = document.getElementById("scan-btn");
const cameraInput = document.getElementById("camera-input");
const ocrOverlay = document.getElementById("ocr-overlay");
const cardForm = document.getElementById("card-form");
const editBackBtn = document.getElementById("edit-back-btn");
const deleteBtn = document.getElementById("delete-btn");
const confirmDialog = document.getElementById("confirm-dialog");
const confirmCancel = document.getElementById("confirm-cancel");
const confirmOk = document.getElementById("confirm-ok");
const uploadBtn = document.getElementById("upload-btn");

// Image modal
const imageModal = document.getElementById("image-modal");
const imageModalImg = document.getElementById("image-modal-img");
const imageModalClose = document.getElementById("image-modal-close");
let imageModalScanId = null;

// Webcam
const webcamModal = document.getElementById("webcam-modal");
const webcamVideo = document.getElementById("webcam-video");
const webcamCanvas = document.getElementById("webcam-canvas");
const webcamCapture = document.getElementById("webcam-capture");
const webcamClose = document.getElementById("webcam-close");
let webcamStream = null;

// Header
const userMenuToggle = document.getElementById("user-menu-toggle");
const userMenu = document.getElementById("user-menu");
const userInitials = document.getElementById("user-initials");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");
const localeDeBtn = document.getElementById("locale-de-btn");
const localeEnBtn = document.getElementById("locale-en-btn");

// ---------------------------------------------------------------------------
// API helper
// ---------------------------------------------------------------------------
async function api(path, options = {}) {
  const { method = "GET", body } = options;
  try {
    const res = await fetch("/apps/card-scanner" + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 401) {
      window.location.href = "/";
      return { ok: false };
    }
    const payload = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, payload };
  } catch (err) {
    return { ok: false, error: err };
  }
}

// ---------------------------------------------------------------------------
// Tesseract.js – lazy load via CDN
// ---------------------------------------------------------------------------
async function ensureTesseract() {
  if (window.Tesseract) return;
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ---------------------------------------------------------------------------
// Image preprocessing – sharpen + Otsu binarization for better OCR
// ---------------------------------------------------------------------------
function preprocessImage(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const W = img.width;
      const H = img.height;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, W, H);
      const d = imageData.data;

      // 1) Convert to grayscale array
      const gray = new Uint8Array(W * H);
      for (let i = 0; i < gray.length; i++) {
        const j = i * 4;
        gray[i] = Math.round(0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2]);
      }

      // 2) Unsharp mask (sharpen)
      const sharp = new Uint8Array(W * H);
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = y * W + x;
          if (x === 0 || x === W - 1 || y === 0 || y === H - 1) {
            sharp[idx] = gray[idx];
            continue;
          }
          // 3x3 blur approximation
          const blur =
            (gray[idx - W - 1] + gray[idx - W] + gray[idx - W + 1] +
             gray[idx - 1] + gray[idx] + gray[idx + 1] +
             gray[idx + W - 1] + gray[idx + W] + gray[idx + W + 1]) / 9;
          // Unsharp mask: original + strength * (original - blur)
          const val = gray[idx] + 1.5 * (gray[idx] - blur);
          sharp[idx] = Math.max(0, Math.min(255, Math.round(val)));
        }
      }

      // 3) Otsu's threshold — find optimal binary threshold
      const histogram = new Array(256).fill(0);
      for (let i = 0; i < sharp.length; i++) histogram[sharp[i]]++;
      const total = sharp.length;
      let sumAll = 0;
      for (let i = 0; i < 256; i++) sumAll += i * histogram[i];

      let sumBg = 0, wBg = 0, maxVariance = 0, threshold = 128;
      for (let t = 0; t < 256; t++) {
        wBg += histogram[t];
        if (wBg === 0) continue;
        const wFg = total - wBg;
        if (wFg === 0) break;
        sumBg += t * histogram[t];
        const meanBg = sumBg / wBg;
        const meanFg = (sumAll - sumBg) / wFg;
        const variance = wBg * wFg * (meanBg - meanFg) * (meanBg - meanFg);
        if (variance > maxVariance) {
          maxVariance = variance;
          threshold = t;
        }
      }

      // 4) Apply threshold → black/white
      for (let i = 0; i < sharp.length; i++) {
        const val = sharp[i] > threshold ? 255 : 0;
        const j = i * 4;
        d[j] = d[j + 1] = d[j + 2] = val;
      }
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Canvas toBlob failed"))), "image/png");
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = imageSource instanceof Blob ? URL.createObjectURL(imageSource) : imageSource;
  });
}

async function runOCR(imageSource) {
  await ensureTesseract();

  // Preprocess image for better recognition
  let processed;
  try {
    processed = await preprocessImage(imageSource);
  } catch {
    processed = imageSource; // fallback to original
  }

  const worker = await Tesseract.createWorker("deu+eng", 1, {
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js",
  });
  await worker.setParameters({
    tessedit_pageseg_mode: "3", // Fully automatic page segmentation
    tessedit_char_whitelist: "",  // Allow all characters
  });
  const { data } = await worker.recognize(processed);
  await worker.terminate();
  return data.text;
}

// ---------------------------------------------------------------------------
// Parse business card text – improved heuristics
// ---------------------------------------------------------------------------
const PHONE_LABELS = /^(tel\.?|telefon|phone|fon|mobil|mobile|cell|handy|fax)[:\s]/i;
const EMAIL_LABELS = /^(e-?mail|mail)[:\s]/i;
const WEB_LABELS = /^(web|www|website|homepage|internet)[:\s]/i;
const ADDR_LABELS = /^(adresse|address|anschrift)[:\s]/i;

const TITLE_KEYWORDS =
  /\b(ceo|cfo|cto|coo|cio|vp|director|manager|head|lead|chief|president|founder|partner|associate|consultant|engineer|architect|designer|developer|analyst|koordinator|leiter|leiterin|gesch[aä]ftsf[uü]hrer|gesch[aä]ftsf[uü]hrerin|vorstand|prokurist|inhaber|inhaberin|berater|beraterin|referent|assistent|assistentin|abteilungsleiter|teamleiter|professor|prof\.|dr\.|dipl\.)\b/i;

const STREET_PATTERNS =
  /\b(str\.|stra[sß]e|straße|strasse|weg\b|gasse|platz|allee|ring\b|damm|ufer|chaussee|avenue|ave\.?|street|st\.|road|rd\.|lane|drive|boulevard|blvd)\b/i;

const ZIP_PATTERNS = /\b\d{4,5}\s+[A-ZÄÖÜ]/; // 12345 Berlin, 8001 Zürich etc.

function parseCardText(text) {
  const rawLines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 1);

  let email = "", phone = "", website = "", address = "";
  const phones = [];
  const addressParts = [];
  const unmatched = [];

  for (const line of rawLines) {
    const lower = line.toLowerCase();

    // --- Labeled lines (e.g. "Tel: +49 123...") ---
    if (PHONE_LABELS.test(line)) {
      const val = line.replace(PHONE_LABELS, "").trim();
      if (val && !phone) phone = val;
      else if (val) phones.push(val);
      continue;
    }
    if (EMAIL_LABELS.test(line)) {
      const val = line.replace(EMAIL_LABELS, "").trim();
      if (val && !email) email = val;
      continue;
    }
    if (WEB_LABELS.test(line)) {
      const val = line.replace(WEB_LABELS, "").trim();
      if (val && !website) website = val;
      continue;
    }
    if (ADDR_LABELS.test(line)) {
      addressParts.push(line.replace(ADDR_LABELS, "").trim());
      continue;
    }

    // --- Email (unlabeled) ---
    const emailMatch = line.match(/[\w.+\-]+@[\w.\-]+\.\w{2,}/);
    if (emailMatch) {
      if (!email) email = emailMatch[0];
      continue;
    }

    // --- Website (unlabeled) ---
    const webMatch = line.match(/(https?:\/\/|www\.)\S+/i);
    if (webMatch) {
      if (!website) website = webMatch[0];
      continue;
    }

    // --- Phone (unlabeled) – line is mostly phone characters ---
    const stripped = line.replace(/[\s\-\(\)\.\/\+:]/g, "");
    const digitRatio = (stripped.match(/\d/g) || []).length / (stripped.length || 1);
    if (/^\+?\d[\d\s\-\(\)\.\/]{5,}$/.test(line.replace(/^[A-Za-z:]+\s*/, "")) || (digitRatio > 0.7 && stripped.length >= 6)) {
      const cleaned = line.replace(/^[A-Za-zÄÖÜäöü]+[:\s]+/, "").trim();
      if (!phone) phone = cleaned || line;
      else phones.push(cleaned || line);
      continue;
    }

    // --- Address line (street name or zip code) ---
    if (STREET_PATTERNS.test(line) || ZIP_PATTERNS.test(line)) {
      addressParts.push(line);
      continue;
    }

    unmatched.push(line);
  }

  // Assemble address
  if (addressParts.length) {
    address = addressParts.join(", ");
  }

  // If we found extra phone numbers, append to phone field
  if (phones.length && phone) {
    phone = phone + " / " + phones.join(" / ");
  } else if (phones.length && !phone) {
    phone = phones[0];
  }

  // --- Classify unmatched lines: name, company, position ---
  let name = "", company = "", position = "";

  // Look for a line that matches job title keywords → position
  const posIdx = unmatched.findIndex((l) => TITLE_KEYWORDS.test(l));
  if (posIdx >= 0) {
    position = unmatched.splice(posIdx, 1)[0];
  }

  // Remaining: first line likely name, second likely company
  // Heuristic: name lines are shorter and mostly letters, company may contain GmbH, AG, Ltd, Inc etc.
  const companyKeywords = /\b(gmbh|ag|kg|ohg|gbr|e\.v\.|mbh|co\.|ltd|inc|corp|llc|se|sa|plc|ug|gesellschaft|stiftung|verein|verlag|group|holding)\b/i;

  for (let i = 0; i < unmatched.length; i++) {
    if (companyKeywords.test(unmatched[i])) {
      company = unmatched.splice(i, 1)[0];
      break;
    }
  }

  // First remaining = name (if it looks like a name: mostly alpha, < 40 chars, no obvious non-name)
  if (unmatched.length >= 1) {
    name = unmatched[0];
  }
  if (unmatched.length >= 2 && !company) {
    company = unmatched[1];
  }
  if (unmatched.length >= 2 && !position && company) {
    // If we already have company from keyword, second unmatched might be position
    for (let i = 1; i < unmatched.length; i++) {
      if (!position && unmatched[i] !== company) {
        position = unmatched[i];
        break;
      }
    }
  }

  // Collect any leftover lines into address if address is still empty
  const leftover = unmatched.slice(company ? 2 : 1).filter((l) => l !== position && l !== company);
  if (leftover.length && !address) {
    address = leftover.join(", ");
  }

  return { name, company, position, phone, email, website, address };
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------
function showView(view) {
  listView.classList.remove("active");
  editView.classList.remove("active");
  view.classList.add("active");
}

// ---------------------------------------------------------------------------
// Render card list
// ---------------------------------------------------------------------------
function renderCards() {
  cardGrid.innerHTML = "";
  cardCount.textContent = cards.length ? `(${cards.length})` : "";
  emptyState.hidden = cards.length > 0;

  for (const card of cards) {
    const el = document.createElement("div");
    el.className = "card-row";
    el.dataset.id = card.scan_id;

    let primary = card.name || card.company || card.email || "\u2014";
    let secondary = [];
    if (card.company && card.name) secondary.push(card.company);
    if (card.position) secondary.push(card.position);

    let contact = [];
    if (card.phone) contact.push(`<div class="contact-line">${phoneSVG()}<span>${esc(card.phone)}</span></div>`);
    if (card.email) contact.push(`<div class="contact-line">${mailSVG()}<span>${esc(card.email)}</span></div>`);

    // Thumbnail box (separate white box on the left)
    const thumbHTML = card.has_image
      ? `<div class="card-thumb-box" data-scan-id="${esc(card.scan_id)}">
           <svg viewBox="0 0 24 24" class="thumb-placeholder"><rect x="2" y="3" width="20" height="18" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M21 15l-5-5L5 21"/></svg>
         </div>`
      : "";

    const trashSVG = `<button class="card-delete-btn" type="button" title="${esc(t("deleteBtn"))}"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>`;

    const qrHTML = (qrBaseUrl && card.card_id) ? `<div class="card-qr-box" data-card-id="${esc(card.card_id)}"></div>` : "";

    el.innerHTML = `
      ${thumbHTML}
      ${qrHTML}
      <div class="card-item">
        <div class="card-item-body">
          <div class="card-item-main">
            <div class="card-item-name">${esc(primary)}</div>
            ${secondary.length ? `<div class="card-item-sub">${esc(secondary.join(" \u00b7 "))}</div>` : ""}
          </div>
          ${contact.length ? `<div class="card-item-contact">${contact.join("")}</div>` : ""}
        </div>
        ${trashSVG}
      </div>
    `;

    // Thumbnail click → open image modal
    const thumb = el.querySelector(".card-thumb-box");
    if (thumb) {
      thumb.addEventListener("click", (e) => {
        e.stopPropagation();
        openImageModal(card.scan_id);
      });
      loadThumb(thumb, card.scan_id);
    }

    // QR code box → render QR + click handler
    const qrBox = el.querySelector(".card-qr-box");
    if (qrBox) {
      const fullUrl = qrBaseUrl + card.card_id;
      new QRCode(qrBox, { text: fullUrl, width: 68, height: 68, colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H });
      qrBox.addEventListener("click", (e) => {
        e.stopPropagation();
        openQrModal(fullUrl);
      });
    }

    // Trash button click → confirm delete
    const trashBtn = el.querySelector(".card-delete-btn");
    trashBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editingId = card.scan_id;
      confirmDialog.showModal();
    });

    // Card info click → edit
    const cardInfo = el.querySelector(".card-item");
    cardInfo.addEventListener("click", () => openEdit(card.scan_id));
    cardGrid.appendChild(el);
  }
}

function esc(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function phoneSVG() {
  return '<span class="contact-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></span>';
}

function mailSVG() {
  return '<span class="contact-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>';
}

// ---------------------------------------------------------------------------
// Thumbnail loading + Image modal
// ---------------------------------------------------------------------------
const thumbCache = {};

async function loadThumb(thumbEl, scanId) {
  if (thumbCache[scanId]) {
    thumbEl.innerHTML = `<img src="${thumbCache[scanId]}" alt="" />`;
    return;
  }
  const res = await api("/api/cards/" + scanId + "/image");
  if (res.ok && res.payload?.image) {
    thumbCache[scanId] = res.payload.image;
    thumbEl.innerHTML = `<img src="${res.payload.image}" alt="" />`;
  }
}

async function openImageModal(scanId) {
  imageModalScanId = scanId;
  imageModalImg.src = "";
  imageModal.classList.add("active");

  if (thumbCache[scanId]) {
    imageModalImg.src = thumbCache[scanId];
  } else {
    const res = await api("/api/cards/" + scanId + "/image");
    if (res.ok && res.payload?.image) {
      thumbCache[scanId] = res.payload.image;
      imageModalImg.src = res.payload.image;
    }
  }
}

function closeImageModal() {
  imageModal.classList.remove("active");
  imageModalImg.src = "";
  imageModalScanId = null;
}

imageModalClose.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) closeImageModal();
});

// ---------------------------------------------------------------------------
// Edit view
// ---------------------------------------------------------------------------
function openEdit(scanId) {
  pendingImageBase64 = null;
  const rawSection = document.getElementById("raw-text-section");
  const rawDisplay = document.getElementById("raw-text-display");
  const cardIdGroup = document.getElementById("card-id-group");
  if (scanId) {
    editingId = scanId;
    const card = cards.find((c) => c.scan_id === scanId);
    if (!card) return;
    document.getElementById("f-name").value = card.name || "";
    document.getElementById("f-company").value = card.company || "";
    document.getElementById("f-position").value = card.position || "";
    document.getElementById("f-phone").value = card.phone || "";
    document.getElementById("f-email").value = card.email || "";
    document.getElementById("f-website").value = card.website || "";
    document.getElementById("f-address").value = card.address || "";
    // Show card_id (read-only)
    if (card.card_id) {
      document.getElementById("f-card-id").value = card.card_id;
      cardIdGroup.hidden = false;
    } else {
      cardIdGroup.hidden = true;
    }
    deleteBtn.hidden = true;
    document.getElementById("edit-title").textContent = t("editTitleEdit");
    // Show raw text if available
    if (card.raw_text) {
      rawDisplay.textContent = card.raw_text;
      rawSection.hidden = false;
    } else {
      rawSection.hidden = true;
    }
  } else {
    editingId = null;
    cardForm.reset();
    deleteBtn.hidden = true;
    rawSection.hidden = true;
    cardIdGroup.hidden = true;
    document.getElementById("edit-title").textContent = t("editTitleNew");
  }
  showView(editView);
}

function openNewWithData(data) {
  editingId = null;
  document.getElementById("f-name").value = data.name || "";
  document.getElementById("f-company").value = data.company || "";
  document.getElementById("f-position").value = data.position || "";
  document.getElementById("f-phone").value = data.phone || "";
  document.getElementById("f-email").value = data.email || "";
  document.getElementById("f-website").value = data.website || "";
  document.getElementById("f-address").value = data.address || "";
  deleteBtn.hidden = true;
  document.getElementById("edit-title").textContent = t("editTitleNew");
  // Show raw OCR text
  const rawSection = document.getElementById("raw-text-section");
  const rawDisplay = document.getElementById("raw-text-display");
  if (data.raw_text) {
    rawDisplay.textContent = data.raw_text;
    rawSection.hidden = false;
  } else {
    rawSection.hidden = true;
  }
  showView(editView);
}

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------
cardForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    name: document.getElementById("f-name").value.trim(),
    company: document.getElementById("f-company").value.trim(),
    position: document.getElementById("f-position").value.trim(),
    phone: document.getElementById("f-phone").value.trim(),
    email: document.getElementById("f-email").value.trim(),
    website: document.getElementById("f-website").value.trim(),
    address: document.getElementById("f-address").value.trim(),
  };

  if (editingId) {
    const res = await api("/api/cards/" + editingId, { method: "PUT", body });
    if (res.ok) {
      const idx = cards.findIndex((c) => c.scan_id === editingId);
      if (idx >= 0) Object.assign(cards[idx], body);
    }
  } else {
    const rawEl = document.getElementById("raw-text-display");
    body.raw_text = rawEl ? rawEl.textContent : "";
    if (pendingImageBase64) {
      body.image = pendingImageBase64;
    }
    const res = await api("/api/cards", { method: "POST", body });
    if (res.ok && res.payload) {
      cards.unshift({
        scan_id: res.payload.scan_id,
        card_id: res.payload.card_id,
        ...body,
        has_image: pendingImageBase64 ? 1 : 0,
        created_at: new Date().toISOString(),
      });
      // Auto-sync to DTI Connector
      if (autoSyncEnabled && csConnectorId) {
        api("/api/cards/sync-dti", { method: "POST", body: {} }).then((syncRes) => {
          if (syncRes.ok) {
            const count = syncRes.payload?.synced || 0;
            showToast(t("syncSuccess").replace("{count}", count));
          }
        });
      }
    }
    pendingImageBase64 = null;
  }

  renderCards();
  showView(listView);
});

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------
deleteBtn.addEventListener("click", () => {
  confirmDialog.showModal();
});

confirmCancel.addEventListener("click", () => confirmDialog.close());

confirmOk.addEventListener("click", async () => {
  confirmDialog.close();
  if (!editingId) return;
  const res = await api("/api/cards/" + editingId, { method: "DELETE" });
  if (res.ok) {
    delete thumbCache[editingId];
    cards = cards.filter((c) => c.scan_id !== editingId);
    renderCards();
    showView(listView);
  }
});

// ---------------------------------------------------------------------------
// Back
// ---------------------------------------------------------------------------
editBackBtn.addEventListener("click", () => {
  showView(listView);
});

// ---------------------------------------------------------------------------
// Blob → base64 data URL
// ---------------------------------------------------------------------------
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ---------------------------------------------------------------------------
// Shared OCR processing
// ---------------------------------------------------------------------------
async function processImage(imageSource) {
  ocrOverlay.classList.add("active");
  try {
    // Capture original image as base64 before OCR preprocessing
    let originalBlob = imageSource;
    if (!(imageSource instanceof Blob)) {
      // imageSource is a data URL string – convert to blob
      const r = await fetch(imageSource);
      originalBlob = await r.blob();
    }
    pendingImageBase64 = await blobToBase64(originalBlob);

    const rawText = await runOCR(imageSource);
    ocrOverlay.classList.remove("active");

    if (!rawText || rawText.trim().length === 0) {
      alert(t("ocrFailed"));
      openNewWithData({});
      return;
    }

    const parsed = parseCardText(rawText);
    parsed.raw_text = rawText;
    openNewWithData(parsed);
  } catch (err) {
    console.error("OCR error:", err);
    ocrOverlay.classList.remove("active");
    alert(t("ocrFailed"));
    openNewWithData({});
  }
}

// ---------------------------------------------------------------------------
// Scan button → open webcam
// ---------------------------------------------------------------------------
scanBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
    });
    webcamStream = stream;
    webcamVideo.srcObject = stream;
    webcamModal.classList.add("active");
  } catch (err) {
    console.warn("Webcam not available:", err);
    alert(t("webcamNoAccess"));
  }
});

// ---------------------------------------------------------------------------
// Webcam capture
// ---------------------------------------------------------------------------
webcamCapture.addEventListener("click", () => {
  const ctx = webcamCanvas.getContext("2d");
  webcamCanvas.width = webcamVideo.videoWidth;
  webcamCanvas.height = webcamVideo.videoHeight;
  ctx.drawImage(webcamVideo, 0, 0);

  // Stop stream + close modal
  stopWebcam();

  // Convert canvas to blob and process
  webcamCanvas.toBlob(
    (blob) => {
      if (blob) processImage(blob);
    },
    "image/jpeg",
    0.92
  );
});

function stopWebcam() {
  if (webcamStream) {
    webcamStream.getTracks().forEach((track) => track.stop());
    webcamStream = null;
  }
  webcamVideo.srcObject = null;
  webcamModal.classList.remove("active");
}

webcamClose.addEventListener("click", stopWebcam);

// Close webcam on backdrop click
webcamModal.addEventListener("click", (e) => {
  if (e.target === webcamModal) stopWebcam();
});

// ---------------------------------------------------------------------------
// Upload button → file picker
// ---------------------------------------------------------------------------
uploadBtn.addEventListener("click", () => {
  cameraInput.value = "";
  cameraInput.click();
});

cameraInput.addEventListener("change", async (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  processImage(file);
});

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------
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
  document.getElementById("brand-text").textContent = t("brandText");
  document.getElementById("list-title").textContent = t("listTitle");
  document.getElementById("empty-text").textContent = t("emptyText");
  document.getElementById("empty-hint").textContent = t("emptyHint");
  document.getElementById("scan-btn-label").textContent = t("scanBtn");
  document.getElementById("ocr-text").textContent = t("ocrText");
  document.getElementById("lbl-name").textContent = t("lblName");
  document.getElementById("lbl-company").textContent = t("lblCompany");
  document.getElementById("lbl-position").textContent = t("lblPosition");
  document.getElementById("lbl-phone").textContent = t("lblPhone");
  document.getElementById("lbl-email").textContent = t("lblEmail");
  document.getElementById("lbl-website").textContent = t("lblWebsite");
  document.getElementById("lbl-address").textContent = t("lblAddress");
  document.getElementById("save-btn").textContent = t("saveBtn");
  document.getElementById("delete-btn").textContent = t("deleteBtn");
  document.getElementById("confirm-text").textContent = t("confirmText");
  document.getElementById("confirm-cancel").textContent = t("confirmCancel");
  document.getElementById("confirm-ok").textContent = t("confirmOk");
  document.getElementById("webcam-title").textContent = t("webcamTitle");
  document.getElementById("raw-text-label").textContent = t("rawTextLabel");
  document.getElementById("lbl-card-id").textContent = t("lblCardId");
  uploadBtn.title = t("uploadBtn");
  logoutBtn.textContent = t("logout");
  renderCards();
}

localeDeBtn.addEventListener("click", () => setLocale("de"));
localeEnBtn.addEventListener("click", () => setLocale("en"));

// ---------------------------------------------------------------------------
// User menu
// ---------------------------------------------------------------------------
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
  await fetch("/auth/logout", { method: "POST" });
  window.location.href = "/";
});

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
const csToast = document.getElementById("cs-toast");
let toastTimer = null;
function showToast(msg) {
  csToast.textContent = msg;
  csToast.hidden = false;
  requestAnimationFrame(() => csToast.classList.add("visible"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    csToast.classList.remove("visible");
    setTimeout(() => { csToast.hidden = true; }, 300);
  }, 2500);
}

// ---------------------------------------------------------------------------
// DTI Connector integration
// ---------------------------------------------------------------------------
const csDtiButtons = document.getElementById("cs-dti-buttons");
const csConstructBtn = document.getElementById("cs-construct-btn");
const csDocsBtn = document.getElementById("cs-docs-btn");
const csSyncBtn = document.getElementById("cs-sync-btn");
const csQrBtn = document.getElementById("cs-qr-btn");
const csAutosyncBtn = document.getElementById("cs-autosync-btn");
const dtiDialog = document.getElementById("dti-dialog");
const dtiDialogText = document.getElementById("dti-dialog-text");
const dtiDialogCancel = document.getElementById("dti-dialog-cancel");
const dtiDialogOk = document.getElementById("dti-dialog-ok");

let csConnectorId = null;
let pendingDtiAction = null; // "construct" | "sync"

function showDtiState(hasConnector, connectorId) {
  csConnectorId = connectorId || null;
  csDtiButtons.hidden = false;
  if (hasConnector) {
    csConstructBtn.hidden = true;
    csDocsBtn.hidden = false;
    csDocsBtn.href = "/apps/dti-connector/docs?connector=" + connectorId;
    csSyncBtn.hidden = false;
    csQrBtn.hidden = false;
    csAutosyncBtn.hidden = false;
    csAutosyncBtn.classList.toggle("active", autoSyncEnabled);
  } else {
    csConstructBtn.hidden = false;
    csDocsBtn.hidden = true;
    csSyncBtn.hidden = true;
    csQrBtn.hidden = true;
    csAutosyncBtn.hidden = true;
  }
}

csConstructBtn.addEventListener("click", () => {
  pendingDtiAction = "construct";
  dtiDialogText.textContent = t("constructConfirm");
  dtiDialogOk.textContent = t("constructOk");
  dtiDialogCancel.textContent = t("dtiCancel");
  dtiDialog.showModal();
});

csSyncBtn.addEventListener("click", () => {
  pendingDtiAction = "sync";
  dtiDialogText.textContent = t("syncConfirm");
  dtiDialogOk.textContent = t("syncOk");
  dtiDialogCancel.textContent = t("dtiCancel");
  dtiDialog.showModal();
});

csAutosyncBtn.addEventListener("click", () => {
  pendingDtiAction = "autosync-toggle";
  dtiDialogText.textContent = autoSyncEnabled ? t("autosyncDisable") : t("autosyncEnable");
  dtiDialogOk.textContent = t("autosyncOk");
  dtiDialogCancel.textContent = t("dtiCancel");
  dtiDialog.showModal();
});

dtiDialogCancel.addEventListener("click", () => {
  dtiDialog.close();
  pendingDtiAction = null;
});

dtiDialogOk.addEventListener("click", async () => {
  dtiDialog.close();
  if (pendingDtiAction === "construct") {
    const res = await api("/api/cards/create-dti-connector", { method: "POST", body: {} });
    if (res.ok && res.payload) {
      showDtiState(true, res.payload.connector_id);
    } else {
      alert(t("constructFailed"));
    }
  } else if (pendingDtiAction === "sync") {
    csSyncBtn.disabled = true;
    const res = await api("/api/cards/sync-dti", { method: "POST", body: {} });
    csSyncBtn.disabled = false;
    if (res.ok) {
      const count = res.payload?.synced || 0;
      showToast(t("syncSuccess").replace("{count}", count));
    } else {
      showToast(t("syncFailed"));
    }
  } else if (pendingDtiAction === "autosync-toggle") {
    autoSyncEnabled = !autoSyncEnabled;
    csAutosyncBtn.classList.toggle("active", autoSyncEnabled);
    await api("/api/cards/settings/auto-sync", { method: "PUT", body: { auto_sync: autoSyncEnabled } });
    showToast(autoSyncEnabled ? t("autosyncOn") : t("autosyncOff"));
  }
  pendingDtiAction = null;
});

// ---------------------------------------------------------------------------
// QR Code feature
// ---------------------------------------------------------------------------
const qrUrlDialog = document.getElementById("qr-url-dialog");
const qrUrlInput = document.getElementById("qr-url-input");
const qrUrlLabel = document.getElementById("qr-url-label");
const qrUrlOk = document.getElementById("qr-url-ok");
const qrUrlCancel = document.getElementById("qr-url-cancel");
const qrModal = document.getElementById("qr-modal");
const qrModalCanvas = document.getElementById("qr-modal-canvas");
const qrModalUrl = document.getElementById("qr-modal-url");
const qrModalClose = document.getElementById("qr-modal-close");

csQrBtn.addEventListener("click", () => {
  qrUrlLabel.textContent = t("qrUrlLabel");
  qrUrlOk.textContent = t("qrUrlOk");
  qrUrlCancel.textContent = t("qrUrlCancel");
  qrUrlInput.value = qrBaseUrl || "";
  qrUrlDialog.showModal();
  qrUrlInput.focus();
});

qrUrlCancel.addEventListener("click", () => qrUrlDialog.close());

qrUrlOk.addEventListener("click", async () => {
  const val = qrUrlInput.value.trim();
  if (!val) {
    qrBaseUrl = null;
    await api("/api/cards/settings/qr-base-url", { method: "PUT", body: { qr_base_url: null } });
    qrUrlDialog.close();
    renderCards();
    return;
  }
  if (!/^https?:\/\/.+/i.test(val)) {
    showToast(t("qrUrlInvalid"));
    return;
  }
  qrBaseUrl = val.endsWith("/") ? val : val + "/";
  await api("/api/cards/settings/qr-base-url", { method: "PUT", body: { qr_base_url: qrBaseUrl } });
  qrUrlDialog.close();
  renderCards();
});

const qrModalCopy = document.getElementById("qr-modal-copy");

function openQrModal(url) {
  qrModalCanvas.innerHTML = "";
  qrModalUrl.textContent = url;
  qrModalCopy.classList.remove("copied");
  qrModal.classList.add("active");
  new QRCode(qrModalCanvas, { text: url, width: 256, height: 256, colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H });
}

function closeQrModal() {
  qrModal.classList.remove("active");
  qrModalCanvas.innerHTML = "";
  qrModalUrl.textContent = "";
}

qrModalCopy.addEventListener("click", () => {
  const url = qrModalUrl.textContent;
  if (!url) return;
  navigator.clipboard.writeText(url).then(() => {
    qrModalCopy.classList.add("copied");
    setTimeout(() => qrModalCopy.classList.remove("copied"), 1500);
  });
});

qrModalClose.addEventListener("click", closeQrModal);
qrModal.addEventListener("click", (e) => { if (e.target === qrModal) closeQrModal(); });

async function checkDtiConnectorStatus() {
  try {
    const res = await api("/api/cards/dti-connector-status");
    if (res.ok && res.payload) {
      showDtiState(res.payload.exists, res.payload.connector_id);
    }
  } catch {}
}

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------
async function init() {
  // Load user (/api/me is on the central path, not app-scoped)
  const meRes = await fetch("/api/me").then((r) => r.json()).catch(() => null);
  if (meRes) {
    const initials = meRes.name
      ? meRes.name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()
      : "?";
    userInitials.textContent = initials;
    userInfo.textContent = meRes.name || meRes.email || "";
  }

  setLocale(locale);

  // Load settings from server
  const qrRes = await api("/api/cards/settings/qr-base-url");
  if (qrRes.ok && qrRes.payload?.qr_base_url) {
    qrBaseUrl = qrRes.payload.qr_base_url;
  }
  const asRes = await api("/api/cards/settings/auto-sync");
  if (asRes.ok && asRes.payload) {
    autoSyncEnabled = asRes.payload.auto_sync === true;
  }

  // Load cards
  const res = await api("/api/cards");
  if (res.ok && res.payload?.cards) {
    cards = res.payload.cards;
  }
  renderCards();

  // Check DTI connector status
  checkDtiConnectorStatus();
}

init();
