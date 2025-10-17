/* NAVBAR */
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

/* Config */
const defaultConfig = {
  main_title: "Meet Our House Teachers",
  school_name: "The American School of Tampico",
  footer_text: "House System 2025",
};

/* Data (tal cual) */
const teachersData = {
  aegir: [
    { name: "Ana Sofia Haces", email: "ahaces@ats.edu.mx", houseMaster: false },
    { name: "Edgar Leyto Leyto", email: "eleyto@ats.edu.mx", houseMaster: false },
    { name: "Etienne Du Toit", email: "edutoit@ats.edu.mx", houseMaster: true },
    { name: "Gloria Morales", email: "gmorales@ats.edu.mx", houseMaster: false },
    { name: "Lilia Durán", email: "lduran@ats.edu.mx", houseMaster: false },
    { name: "Lizzette Martinez", email: "lmartinez@ats.edu.mx", houseMaster: false },
    { name: "Luz Alejandra Rodriguez", email: "l.rodriguez@ats.edu.mx", houseMaster: false },
    { name: "Maria De Jesus Ponce", email: "mponce@ats.edu.mx", houseMaster: false },
    { name: "Michael Adam Geer", email: "mgeer@ats.edu.mx", houseMaster: false },
  ],
  kai: [
    { name: "Ana Cecilia Davila", email: "adavila@ats.edu.mx", houseMaster: false },
    { name: "Berenice Tinajero", email: "btinajero@ats.edu.mx", houseMaster: false },
    { name: "Betty Olguin", email: "bolguin@ats.edu.mx", houseMaster: false },
    { name: "Carrie Heeter", email: "cheeter@ats.edu.mx", houseMaster: false },
    { name: "Isaac Martínez", email: "imartinez@ats.edu.mx", houseMaster: false },
    { name: "James Roman", email: "jroman@ats.edu.mx", houseMaster: true },
    { name: "Judith Páez", email: "jpaez@ats.edu.mx", houseMaster: false },
    { name: "Noel Hernández", email: "nhernandez@ats.edu.mx", houseMaster: false },
    { name: "Teresa Villela", email: "tvillela@ats.edu.mx", houseMaster: false },
  ],
  nerida: [
    { name: "Cynthia Juárez", email: "c.juarez@ats.edu.mx", houseMaster: false },
    { name: "Elvia González", email: "egonzalez@ats.edu.mx", houseMaster: false },
    { name: "Iliana Olvera", email: "iolvera@ats.edu.mx", houseMaster: true },
    { name: "Jessica Hernández", email: "jhernandez@ats.edu.mx", houseMaster: false },
    { name: "Keili Gunden", email: "kgunden@ats.edu.mx", houseMaster: false },
    { name: "Ma.Alejandra Roman", email: "mroman@ats.edu.mx", houseMaster: false },
    { name: "Maria Elena Montes", email: "mechavez@ats.edu.mx", houseMaster: false },
    { name: "Mariana Sabbatini", email: "msabbatini@ats.edu.mx", houseMaster: false },
    { name: "Mariola Pintado", email: "mpintado@ats.edu.mx", houseMaster: false },
  ],
  pelagia: [
    { name: "Alejandro Magaña", email: "amagana@ats.edu.mx", houseMaster: false },
    { name: "Jesus Gonzalez", email: "jegonzalez@ats.edu.mx", houseMaster: false },
    { name: "Juan Ponce", email: "jponce@ats.edu.mx", houseMaster: true },
    { name: "Lilia Gloria Peña", email: "lpena@ats.edu.mx", houseMaster: false },
    { name: "Lorena Montiel", email: "lmontiel@ats.edu.mx", houseMaster: false },
    { name: "Marcela Morales", email: "mmorales@ats.edu.mx", houseMaster: false },
    { name: "Pato Mendez", email: "pmendez@ats.edu.mx", houseMaster: false },
    { name: "Ruth Lozano Leiva", email: "rlozano@ats.edu.mx", houseMaster: false },
    { name: "Victoria Mejía", email: "vmejia@ats.edu.mx", houseMaster: false },
  ],
};

/* Quotes */
const quotesData = {
  aegir: [
    "Calm seas or stormy waves, we steer together.",
    "Steady hearts build steady teams.",
    "Strength is gentle when it lifts others.",
    "Lead with patience; win with unity.",
    "Where respect flows, progress follows.",
  ],
  kai: [
    "Ride the wave—adapt, learn, and try again.",
    "Curiosity is the tide that lifts every mind.",
    "Change the angle, change the answer.",
    "Brave ideas begin with brave questions.",
    "Be fluid, not flimsy—flex and commit.",
  ],
  nerida: [
    "Kindness is courage in everyday clothes.",
    "Care for one, and you strengthen all.",
    "Listen deeply; people bloom when heard.",
    "Community is built one helpful act at a time.",
    "Empathy turns differences into bridges.",
  ],
  pelagia: [
    "Courage is choosing the right wave to face.",
    "Excellence is a habit of small, honest steps.",
    "Integrity is your compass when no one is watching.",
    "Aim high; the horizon is only a start line.",
    "Do the hard thing—then help the next person do it too.",
  ],
};

/* Helpers */
const mailto = (email) => `<a href="mailto:${email}" class="uk-link-muted">${email}</a>`;
function teacherCard(t, houseKey){
  const houseClass =
    houseKey === 'aegir' ? 'card-border-aegir' :
    houseKey === 'kai' ? 'card-border-kai' :
    houseKey === 'nerida' ? 'card-border-nerida' : 'card-border-pelagia';

  return `
    <div>
      <div class="uk-card uk-card-default uk-card-hover uk-border-rounded ${houseClass}">
        <div class="uk-card-body uk-position-relative">
          ${t.houseMaster ? `<span class="uk-label master-label uk-position-small uk-position-top-right">👑 House Master</span>` : ''}
          <h3 class="uk-card-title uk-margin-small-bottom">${t.name}</h3>
          <p class="uk-text-meta uk-margin-remove">${mailto(t.email)}</p>
        </div>
      </div>
    </div>
  `;
}
function renderGrid(houseKey, list){
  const el = document.getElementById(`grid-${houseKey}`);
  el.innerHTML = list.map(t => teacherCard(t, houseKey)).join('');
  UIkit.update(el);
}
function renderQuotes(houseKey){
  const wrap = document.getElementById(`quotes-${houseKey}`);
  const arr = quotesData[houseKey] || [];
  if (!wrap) return;
  wrap.innerHTML = `<div class="quote-list">${arr.map(q => `<blockquote>“${q}”</blockquote>`).join('')}</div>`;
}
function attachFilters(houseKey){
  const input = document.getElementById(`search-${houseKey}`);
  const chk = document.getElementById(`masters-${houseKey}`);
  const apply = () => {
    const q = (input.value || '').toLowerCase().trim();
    const onlyMasters = !!chk.checked;
    const base = teachersData[houseKey] || [];
    const filtered = base.filter(t => {
      const hit = t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q);
      return hit && (!onlyMasters || t.houseMaster);
    });
    renderGrid(houseKey, filtered);
  };
  input.addEventListener('input', apply);
  chk.addEventListener('change', apply);
  apply();
}
function applyConfig(){
  document.getElementById('mainTitle').textContent = defaultConfig.main_title;
  document.getElementById('schoolName').textContent = defaultConfig.school_name;
  document.getElementById('footerText').textContent = defaultConfig.footer_text;
}
function initAll(){
  applyConfig();
  ['aegir','kai','nerida','pelagia'].forEach(h => { attachFilters(h); renderQuotes(h); });
  const modal = UIkit.modal('#welcome-modal'); if (modal) modal.show();
}
document.addEventListener('DOMContentLoaded', initAll);
