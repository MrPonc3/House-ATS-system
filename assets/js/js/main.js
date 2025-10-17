/* ===== NAVBAR ===== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => links?.classList.toggle('open'));

  const path = location.pathname.replace(/\/+$/, '');
  const isSecondary = path.includes('/pages/secondary.html') || path.endsWith('/secondary.html');
  const activeKey = isSecondary ? 'secondary' : 'home';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === activeKey) a.classList.add('active');
  });
});

/* ===== Config ===== */
const JSON_URL = "./houses_from_toJSON_template1_latest.json";
const REVEAL_DELAY_MS = 6500;
const MESSAGES = [
  "#analizando tu perfil…",
  "#indagando en tu historial…",
  "cargando respuesta…"
];

/* Images */
const HOUSE_IMAGES = {
  Aegir: "./img/house-aegir.png",
  Pelagia: "./img/house-pelagia.png",
  Kai: "./img/house-kai.png",
  Nerida: "./img/house-nerida.png",
};

/* State */
const state = { list: [], nameIndex: {}, initialized: false };
const $ = (sel) => document.querySelector(sel);

function assertEl(el, idOrDesc) {
  if (!el) { console.error(`❌ Missing element: ${idOrDesc}.`); throw new Error(`Missing element: ${idOrDesc}`); }
  return el;
}
function normalize(s) {
  return String(s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

/* Data shaping */
function flattenData(db) {
  if (!db || !db.HOUSES) { console.error("❌ JSON shape invalid."); return []; }
  const out = [], H = db.HOUSES || {};
  const houses = ["Aegir","Pelagia","Kai","Nerida"], levels = ["MS","HS"];
  for (const house of houses) {
    const bucket = H[house]; if (!bucket) continue;
    for (const level of levels) {
      const arr = Array.isArray(bucket[level]) ? bucket[level] : [];
      for (const r of arr) {
        out.push({
          name: r["Student Name"] ?? r["name"] ?? "",
          email: r["email"] ?? "",
          gender: r["Female/male"] ?? r["gender"] ?? "",
          house, level,
        });
      }
    }
  }
  return out;
}
function buildNameIndex(list) {
  const idx = {};
  for (const r of list) {
    const key = normalize(r.name); if (!key) continue;
    (idx[key] ||= []).push(r);
  }
  return idx;
}

/* Suggestions */
function getSuggestions(q) {
  const k = normalize(q); if (k.length < 4) return [];
  const keys = Object.keys(state.nameIndex).filter((x) => x.includes(k));
  const names = keys.map((x) => state.nameIndex[x][0].name);
  return [...new Set(names)].sort((a,b)=>a.localeCompare(b)).slice(0,12);
}
function renderSuggestions(items) {
  const ul = assertEl($("#suggestList"), "#suggestList");
  ul.innerHTML = items.map((txt,i)=>`<li class="suggest-item" role="option" id="opt-${i}" tabindex="0">${txt}</li>`).join("");
  ul.hidden = items.length === 0;
  assertEl($("#nameInput"), "#nameInput").setAttribute("aria-expanded", String(!ul.hidden));
}
function clearSuggestions() {
  const ul = assertEl($("#suggestList"), "#suggestList");
  ul.innerHTML = ""; ul.hidden = true;
  assertEl($("#nameInput"), "#nameInput").setAttribute("aria-expanded", "false");
}
function pickSuggestion(text) { assertEl($("#nameInput"), "#nameInput").value = text; clearSuggestions(); }

/* Lookup */
function findRecord(input) {
  const k = normalize(input);
  if (state.nameIndex[k]) return state.nameIndex[k][0];
  const partial = Object.keys(state.nameIndex).find((x) => x.includes(k));
  return partial ? state.nameIndex[partial][0] : null;
}

/* Loader & carousel */
function cycleLoaderMessages() {
  const msgEl = assertEl($("#loaderMsg"), "#loaderMsg");
  let i = 0; msgEl.textContent = MESSAGES[i];
  const timer = setInterval(() => { i = (i + 1) % MESSAGES.length; msgEl.textContent = MESSAGES[i]; }, 2000);
  return timer;
}
function prepareCarouselLoop() {
  const track = $(".carousel-track"); if (!track) return;
  const items = Array.from(track.children); if (!items.length) return;
  items.forEach((n)=> track.appendChild(n.cloneNode(true)));
}

/* House intros */
const HOUSE_INTROS = {
  Aegir: "Aegir honors steadiness and teamwork—calm in the storm, strong in purpose. Your resolve inspires others to sail true.",
  Pelagia: "Pelagia celebrates empathy, creativity, and community. Your spark brings people together and ignites fresh ideas.",
  Kai: "Kai prizes courage, discipline, and mastery. Your determination forges paths where others hesitate.",
  Nerida: "Nerida exalts curiosity, adaptability, and practical wisdom. Your inquisitive mind uncovers elegant solutions.",
};
function renderResult(rec) {
  const img = assertEl($("#houseImg"), "#houseImg");
  img.src = HOUSE_IMAGES[rec.house] || ""; img.alt = `House crest: ${rec.house}`;
  assertEl($("#studentName"), "#studentName").textContent = rec.name || "";
  assertEl($("#houseName"), "#houseName").textContent = rec.house || "";
  assertEl($("#houseIntro"), "#houseIntro").textContent = HOUSE_INTROS[rec.house] || "";
  assertEl($("#result"), "#result").hidden = false;
}

/* UI helpers */
function showError(msg){ const el = assertEl($("#error"), "#error"); el.textContent = msg; el.hidden = false; }
function hideError(){ assertEl($("#error"), "#error").hidden = true; }
function showModal(){ assertEl($("#loaderModal"), "#loaderModal").hidden = false; }
function hideModal(){ assertEl($("#loaderModal"), "#loaderModal").hidden = true; }

/* Init data */
async function initData() {
  const res = await fetch(JSON_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Cannot load JSON (HTTP ${res.status}).`);
  const data = await res.json();
  state.list = flattenData(data);
  if (!state.list.length) throw new Error("JSON loaded but 0 records.");
  state.nameIndex = buildNameIndex(state.list);
  state.initialized = true;
}

/* Bindings */
function bindEvents() {
  const nameInput = assertEl($("#nameInput"), "#nameInput");
  const suggestList = assertEl($("#suggestList"), "#suggestList");
  const form = assertEl($("#lookupForm"), "#lookupForm");
  const againBtn = assertEl($("#againBtn"), "#againBtn");

  nameInput.addEventListener("input", (e) => { hideError(); renderSuggestions(getSuggestions(e.target.value || "")); });
  suggestList.addEventListener("click", (e) => { const li = e.target.closest(".suggest-item"); if (li) pickSuggestion(li.textContent); });
  suggestList.addEventListener("keydown", (e) => { if (e.key === "Enter") { const li = e.target.closest(".suggest-item"); if (li) { e.preventDefault(); pickSuggestion(li.textContent); } } });
  document.addEventListener("click", (e) => { if (!e.target.closest(".suggest-wrap")) clearSuggestions(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); hideError(); clearSuggestions();
    if (!state.initialized) return showError("Data not loaded yet. Please try again in a moment.");
    const name = nameInput.value.trim(); if (!name) return showError("Please type your name.");
    const rec = findRecord(name); if (!rec) return showError("Name not found. Pick a suggestion.");
    showModal(); const timer = cycleLoaderMessages();
    setTimeout(()=>{ clearInterval(timer); hideModal(); renderResult(rec); }, REVEAL_DELAY_MS);
  });

  againBtn.addEventListener("click", () => {
    assertEl($("#result"), "#result").hidden = true;
    nameInput.value = ""; nameInput.focus(); hideError();
  });
}

/* Boot */
document.addEventListener("DOMContentLoaded", async () => {
  try { prepareCarouselLoop(); await initData(); }
  catch (err) { console.error(err); showError(err.message || "Error loading data."); }
  bindEvents();
});
