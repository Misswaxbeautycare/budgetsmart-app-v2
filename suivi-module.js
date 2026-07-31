/* ══════════════════════════════════════════════════════════════
   MODULE SUIVI — Dettes / Agenda / Tâches / Objectifs consolidés
   ══════════════════════════════════════════════════════════════ */

function suiviToday() { return new Date().toISOString().slice(0,10); }
function suiviJoursRestants(dateStr) {
  const t = new Date(); t.setHours(0,0,0,0);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  d.setHours(0,0,0,0);
  return Math.round((d - t) / 86400000);
}

function suiviInit() {
  document.querySelectorAll('.suivi-tab').forEach(btn => {
    btn.addEventListener('click', () => suiviGo(btn.dataset.tab));
  });
  const bAdd = document.getElementById('btnAddDette');
  if (bAdd) bAdd.addEventListener('click', addDette);
  const bEv = document.getElementById('btnAddEvenement');
  if (bEv) bEv.addEventListener('click', addEvenement);
  const bTa = document.getElementById('btnAddTache');
  if (bTa) bTa.addEventListener('click', addTache);
  const tDay = document.getElementById('sTacheDate');
  if (tDay) { tDay.value = suiviToday(); tDay.addEventListener('change', renderTaches); }
  const rev = document.getElementById('sRevenu');
  if (rev) {
    const p = ls('profile', {});
    rev.value = p.revenuDisponible || 0;
    rev.addEventListener('change', () => {
      const pp = ls('profile', {});
      pp.revenuDisponible = parseFloat(rev.value) || 0;
      sv('profile', pp);
      renderRecommandations();
    });
  }
  suiviGo('dettes');
}

function suiviGo(tab) {
  document.querySelectorAll('.suivi-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.suivi-panel').forEach(p => p.style.display = (p.dataset.panel === tab ? 'block' : 'none'));
  if (tab === 'dettes')    { renderDettes(); renderRecommandations(); }
  if (tab === 'agenda')    renderAgendaSuivi();
  if (tab === 'taches')    renderTaches();
  if (tab === 'objectifs') renderObjectifsConsolides();
}

function addDette() {
  const dettes = ls('dettes', []);
  dettes.push({ id: Date.now(), nom: 'Nouvelle dette', montant: 0, taux: 0, echeance: suiviToday(), paye: false, note: '' });
  sv('dettes', dettes);
  renderDettes(); renderRecommandations();
}
function updateDette(id, field, val) {
  const dettes = ls('dettes', []);
  const d = dettes.find(x => x.id === id);
  if (!d) return;
  d[field] = field === 'montant' || field === 'taux' ? parseFloat(val) || 0 : val;
  sv('dettes', dettes);
  renderDettes(); renderRecommandations(); renderAgendaSuivi();
}
function toggleDettePaye(id) {
  const dettes = ls('dettes', []);
  const d = dettes.find(x => x.id === id);
  if (!d) return;
  d.paye = !d.paye;
  sv('dettes', dettes);
  renderDettes(); renderRecommandations(); renderAgendaSuivi();
  if (d.paye) toast('Dette marquée payée !');
}
function removeDette(id) {
  if (!confirm('Supprimer cette dette ?')) return;
  sv('dettes', ls('dettes', []).filter(x => x.id !== id));
  renderDettes(); renderRecommandations(); renderAgendaSuivi();
}

function renderDettes() {
  const dettes = ls('dettes', []), p = ls('profile', {}), cur = p.currency || '€';
  const total = dettes.filter(d => !d.paye).reduce((s, d) => s + (d.montant || 0), 0);
  txt('sTotalDettes', fmt(total, cur));

  const lst = document.getElementById('dettesList'); if (!lst) return;
  if (!dettes.length) { lst.innerHTML = '<div class="empty">Aucune dette enregistrée.</div>'; return; }

  lst.innerHTML = dettes.map(d => {
    const jrs = suiviJoursRestants(d.echeance);
    const enRetard = !d.paye && jrs < 0;
    const proche = !d.paye && jrs >= 0 && jrs <= 7;
    const cls = d.paye ? 'sd-paye' : enRetard ? 'sd-retard' : proche ? 'sd-proche' : '';
    return `<div class="sd-item ${cls}">
      <input class="sd-nom" value="${d.nom}" onchange="updateDette(${d.id},'nom',this.value)"/>
      <input class="sd-montant" type="number" value="${d.montant}" onchange="updateDette(${d.id},'montant',this.value)"/>
      <input class="sd-taux" type="number" value="${d.taux||0}" onchange="updateDette(${d.id},'taux',this.value)" title="Taux %"/>
      <input class="sd-echeance" type="date" value="${d.echeance}" onchange="updateDette(${d.id},'echeance',this.value||'${suiviToday()}')"/>
      <button class="sd-paye-btn ${d.paye?'on':''}" onclick="toggleDettePaye(${d.id})">${d.paye ? '✓' : ''}</button>
      <button class="sd-del" onclick="removeDette(${d.id})">✕</button>
    </div>`;
  }).join('');
}

function suiviPlanDette(d) {
  const jrs = suiviJoursRestants(d.echeance);
  const montant = d.montant || 0, taux = d.taux || 0;
  const coutMensuel = taux > 0 ? (montant * (taux/100)) / 12 : 0;
  let niveau, conseil, montantMensuelEstime;

  if (jrs < 0) {
    niveau = 'urgent';
    conseil = `En retard de ${Math.abs(jrs)} j — paie au moins un acompte aujourd'hui.` +
      (taux >= 15 ? ` À ${taux}%, chaque mois de retard coûte ~${fmt(coutMensuel)} en intérêts.` : '');
    montantMensuelEstime = montant;
  } else if (jrs <= 30) {
    niveau = taux >= 15 || montant > 1500 ? 'complexe' : 'moderee';
    const semaines = Math.max(Math.ceil(jrs/7), 1);
    conseil = `${semaines} semaine(s) restantes. Vire ${fmt(montant/semaines)}/semaine.` +
      (taux >= 15 ? ` Taux élevé (${taux}%) — priorise-la sur les dettes à 0%.` : '');
    montantMensuelEstime = montant;
  } else {
    niveau = taux >= 15 || montant > 2000 ? 'complexe' : 'simple';
    const mois = Math.max(Math.ceil(jrs/30), 1);
    conseil = `Marge large (${mois} mois). ${fmt(montant/mois)}/mois suffit.` +
      (taux >= 15 ? ` Mais coûte ${fmt(coutMensuel)}/mois en intérêts — ne la laisse pas traîner.` : '');
    montantMensuelEstime = montant / mois;
  }
  return { niveau, conseil, taux, coutMensuel, montantMensuelEstime };
}

function suiviPriorite(dettes) {
  const impayees = dettes.filter(d => !d.paye);
  if (impayees.length < 2) return null;
  return [...impayees].sort((a,b) => {
    const ra = suiviJoursRestants(a.echeance) < 0, rb = suiviJoursRestants(b.echeance) < 0;
    if (ra !== rb) return ra ? -1 : 1;
    if ((a.taux||0) !== (b.taux||0)) return (b.taux||0) - (a.taux||0);
    return (b.montant||0) - (a.montant||0);
  });
}

function renderRecommandations() {
  const box = document.getElementById('sRecommandations'); if (!box) return;
  const dettes = ls('dettes', []).filter(d => !d.paye);
  const goals = ls('goals', []);
  const p = ls('profile', {});
  const revenu = p.revenuDisponible || 0;

  if (!dettes.length) { box.innerHTML = ''; return; }

  const chargeMensuelle = dettes.reduce((s,d) => s + suiviPlanDette(d).montantMensuelEstime, 0);
  const coutInteret = dettes.reduce((s,d) => s + suiviPlanDette(d).coutMensuel, 0);
  const ratio = revenu > 0 ? chargeMensuelle / revenu : null;
  const cher = dettes.filter(d => (d.taux||0) >= 15);

  let analyse = '';
  if (ratio !== null) {
    if (ratio > 1) analyse += `<div class="sr-alerte">Le remboursement estimé (${fmt(chargeMensuelle)}/mois) dépasse ta trésorerie disponible (${fmt(revenu)}). Renégocie des délais ou réduis d'autres dépenses.</div>`;
    else if (ratio > 0.7) analyse += `<div class="sr-attention">Tu utilises ${Math.round(ratio*100)}% de ta trésorerie pour rembourser — c'est serré.</div>`;
    else analyse += `<div class="sr-succes">Charge de remboursement raisonnable : ${Math.round(ratio*100)}% de ta trésorerie disponible.</div>`;
  }
  if (coutInteret > 5) analyse += `<div class="sr-attention">Coût des intérêts : ~${fmt(coutInteret)}/mois si rien ne bouge.</div>`;
  if (cher.length >= 2) analyse += `<div class="sr-alerte">${cher.length} dettes à taux élevé (≥15%) — envisage une consolidation.</div>`;

  const ordre = suiviPriorite(ls('dettes', []));
  const ordreHtml = ordre ? `<div class="sr-ordre">
      <strong>Ordre de priorité (avalanche) :</strong>
      <ol>${ordre.map(d => `<li>${d.nom} — ${fmt(d.montant)} (${d.taux||0}%)${suiviJoursRestants(d.echeance)<0?' · en retard':''}</li>`).join('')}</ol>
    </div>` : '';

  const cartes = dettes.map(d => {
    const plan = suiviPlanDette(d);
    return `<div class="sr-carte sr-${plan.niveau}">
      <strong>${d.nom}</strong>${d.taux ? ' — '+d.taux+'%' : ''}
      <p>${plan.conseil}</p>
    </div>`;
  }).join('');

  box.innerHTML = analyse + ordreHtml + cartes;
}

function addEvenement() {
  const titre = document.getElementById('sEvTitre')?.value.trim();
  const date  = document.getElementById('sEvDate')?.value || suiviToday();
  if (!titre) { toast('Titre du rendez-vous manquant.'); return; }
  const ev = ls('evenements', []);
  ev.push({ id: Date.now(), titre, date });
  sv('evenements', ev);
  document.getElementById('sEvTitre').value = '';
  renderAgendaSuivi();
}
function removeEvenement(id) {
  sv('evenements', ls('evenements', []).filter(e => e.id !== id));
  renderAgendaSuivi();
}

function renderAgendaSuivi() {
  const dettes = ls('dettes', []).filter(d => !d.paye);
  const ev = ls('evenements', []);
  const items = [
    ...dettes.map(d => ({ id:'d'+d.id, titre:d.nom, date:d.echeance, source:'dette', montant:d.montant })),
    ...ev.map(e => ({ id:'e'+e.id, titre:e.titre, date:e.date, source:'manuel' })),
  ].sort((a,b) => new Date(a.date) - new Date(b.date));

  const lst = document.getElementById('agendaList'); if (!lst) return;
  if (!items.length) { lst.innerHTML = '<div class="empty">Aucun rendez-vous.</div>'; return; }

  lst.innerHTML = items.map(it => {
    const jrs = suiviJoursRestants(it.date);
    const cls = jrs < 0 ? 'sa-retard' : jrs <= 7 ? 'sa-proche' : '';
    return `<div class="sa-item ${cls}">
      <strong>${it.titre}</strong>
      <span>${new Date(it.date).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})} · ${jrs<0?'en retard':'dans '+jrs+' j'}${it.montant?' · '+fmt(it.montant):''}</span>
      ${it.source==='manuel' ? `<button onclick="removeEvenement(${it.id.slice(1)})">✕</button>` : ''}
    </div>`;
  }).join('');
}

function addTache() {
  const titre = document.getElementById('sTacheTitre')?.value.trim();
  const date = document.getElementById('sTacheDate')?.value || suiviToday();
  if (!titre) return;
  const t = ls('taches', []);
  t.push({ id: Date.now(), date, titre, fait: false });
  sv('taches', t);
  document.getElementById('sTacheTitre').value = '';
  renderTaches();
}
function toggleTache(id) {
  const t = ls('taches', []);
  const x = t.find(i => i.id === id);
  if (x) { x.fait = !x.fait; sv('taches', t); renderTaches(); }
}
function removeTache(id) {
  sv('taches', ls('taches', []).filter(t => t.id !== id));
  renderTaches();
}
function renderTaches() {
  const date = document.getElementById('sTacheDate')?.value || suiviToday();
  const taches = ls('taches', []).filter(t => t.date === date);
  const fait = taches.filter(t => t.fait).length;
  txt('sTacheCompteur', taches.length ? `${fait}/${taches.length} faites` : 'aucune tâche');

  const lst = document.getElementById('tachesList'); if (!lst) return;
  if (!taches.length) { lst.innerHTML = '<div class="empty">Rien de prévu ce jour.</div>'; return; }
  lst.innerHTML = taches.map(t => {
    const enDanger = !t.fait && suiviJoursRestants(t.date) < 0;
    return `<div class="st-item ${enDanger?'st-danger':''} ${t.fait?'st-fait':''}">
      <button class="st-check" onclick="toggleTache(${t.id})">${t.fait?'✓':''}</button>
      <span>${t.titre}</span>
      <button class="st-del" onclick="removeTache(${t.id})">✕</button>
    </div>`;
  }).join('');
}

function renderObjectifsConsolides() {
  const goals = ls('goals', []);
  const dettes = ls('dettes', []).filter(d => !d.paye);
  const p = ls('profile', {}), cur = p.currency || '€';
  const lst = document.getElementById('objectifsConsolides'); if (!lst) return;

  const totalDettes = dettes.reduce((s,d) => s + (d.montant||0), 0);
  const enteteHtml = `<div class="oc-resume">
    <span>${goals.length} objectif(s) d'épargne · ${fmt(goals.reduce((s,g)=>s+(g.sav||0),0), cur)} économisés</span>
    <span>${dettes.length} dette(s) en cours · ${fmt(totalDettes, cur)} restant</span>
  </div>`;

  if (!goals.length) { lst.innerHTML = enteteHtml + '<div class="empty">Aucun objectif — ajoute-en un depuis la page Objectifs.</div>'; return; }

  lst.innerHTML = enteteHtml + goals.map(g => {
    const pct = Math.min(100, Math.round(((g.sav||0)/g.target)*100)) || 0;
    return `<div class="oc-item">
      <strong>${g.name}</strong>
      <div class="pb-bar"><div class="pb-fill" style="width:${pct}%"></div></div>
      <span>${fmt(g.sav||0,cur)} / ${fmt(g.target,cur)} — ${pct}%</span>
    </div>`;
  }).join('');
}

let _suiviDejaLance = false;
function _suiviTenterDemarrage() {
  if (_suiviDejaLance) return;
  if (document.body.classList.contains('authed') && document.getElementById('p-suivi')) {
    _suiviDejaLance = true;
    suiviInit();
  }
}
new MutationObserver(_suiviTenterDemarrage).observe(document.body, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('DOMContentLoaded', () => setTimeout(_suiviTenterDemarrage, 300));
