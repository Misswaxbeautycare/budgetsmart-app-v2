'use strict';
/* ══ SUPABASE ══ */
const SUPABASE_URL = 'https://otpnegpmvsmutyhhmkvp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cG5lZ3BtdnNtdXR5aGhta3ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzkxMzYsImV4cCI6MjA5NzIxNTEzNn0.n0BOebUlmZpMzygGAhNlRSyYnLiPNU0iM0xousqscHo';
const sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = null;

/* ══ CONSTANTES ══ */
const STRIPE         = 'https://buy.stripe.com/3cI28r0nRbNva7J3VyaEE00';
const STRIPE_BASIC   = 'https://buy.stripe.com/aFa6oH0nRbNv3Jl77KaEE03';
const STRIPE_PREMIUM = 'https://buy.stripe.com/00wbJ14E76tbfs3eAcaEE02';
const STRIPE_BUSI    = 'https://buy.stripe.com/cNi9ATc6z9Fn7ZB4ZCaEE01';
const PAYPAL         = 'https://www.paypal.me/Misswaxbeautycare';
const CALENDLY       = 'https://calendly.com/missnyungedigitalservices/echange-projet-digital-ecommerce';
const ADMIN_PWD      = 'Budgetsmart20@131690-25';
const APP_URL        = 'https://misswaxbeautycare.github.io/budgetsmart';

const CATS = {nourriture:'🥗',transport:'🚌',loyer:'🏠',factures:'💡',shopping:'🛍',sante:'💊',enfants:'👶',business:'💼',loisirs:'🎭',epargne:'💰',dettes:'📉',autre:'📦'};
const COLORS = ['#2E7D5E','#1E5A9C','#C8922A','#D4621A','#7B3DB5','#B53051','#4AAB9B'];

const TIPS = [
  {cat:'Budget',txt:'La règle 50/30/20 : 50% besoins, 30% envies, 20% épargne. Commencez dès aujourd\'hui.'},
  {cat:'Épargne',txt:'Automatisez votre épargne dès le jour de votre salaire — avant toute dépense.'},
  {cat:'Dépenses',txt:'Attendez 48h avant tout achat non essentiel. L\'envie disparaît souvent.'},
  {cat:'Mindset',txt:'Chaque euro économisé aujourd\'hui est une liberté gagnée demain.'},
  {cat:'Alimentation',txt:'Cuisinez à la maison 3 fois cette semaine. Économisez 20 à 50 €.'},
  {cat:'Abonnements',txt:'Faites le bilan de vos abonnements inutilisés ce mois-ci.'},
  {cat:'Investissement',txt:'50 € par mois à 5% donnent 76 000 € en 30 ans. Commencez tôt.'},
  {cat:'Dettes',txt:'Remboursez d\'abord la dette avec le taux d\'intérêt le plus élevé.'},
  {cat:'Urgences',txt:'Constituez un fonds d\'urgence de 3 mois de dépenses.'},
  {cat:'Business',txt:'Séparez finances personnelles et professionnelles dès le 1er jour.'},
  {cat:'Famille',txt:'Impliquez vos enfants dans le budget familial dès 8 ans.'},
  {cat:'Couple',txt:'Parlez d\'argent avec votre partenaire chaque mois.'},
  {cat:'Shopping',txt:'Faites une liste avant chaque course et respectez-la.'},
];

const DEFIS = [
  {name:'1 € par jour',             desc:'Économisez 1 € de plus chaque jour pendant 30 jours.',  dur:'30 jours',   obj:30,  q:1},
  {name:'7 jours sans dépense',     desc:'Zéro restaurant, shopping, achat impulsif pendant 7j.',  dur:'7 jours',    obj:50,  q:7},
  {name:'Défi 30 jours épargne',    desc:'Épargnez chaque jour et atteignez votre objectif.',      dur:'30 jours',   obj:465, q:15},
  {name:'Défi rentrée scolaire',    desc:'Préparez le budget rentrée semaine par semaine.',         dur:'8 semaines', obj:160, q:20},
  {name:'Défi business',            desc:'Mettez de côté chaque mois pour lancer votre activité.', dur:'12 mois',    obj:600, q:50},
  {name:'Défi famille',             desc:'Objectif commun pour toute la famille.',                  dur:'3 mois',     obj:300, q:10},
  {name:'5 € par jour',             desc:'Économisez 5 € chaque jour. En 30 jours = 150 € !',      dur:'30 jours',   obj:150, q:5},
  {name:'10 € par jour',            desc:'Économisez 10 € par jour. En 30 jours = 300 € !',        dur:'30 jours',   obj:300, q:10},
  {name:'20 € par jour',            desc:'Économisez 20 € par jour. En 30 jours = 600 € !',        dur:'30 jours',   obj:600, q:20},
  {name:'20 € par semaine',         desc:'Mettez 20 € de côté chaque semaine.',                    dur:'12 semaines',obj:240, q:20},
  {name:'50 € par semaine',         desc:'Économisez 50 € par semaine. En 12 semaines = 600 € !',  dur:'12 semaines',obj:600, q:50},
];

const MSG_SUCCES = [
  '🏆 Vous avez atteint votre objectif ! Vous êtes incroyable !',
  '🎉 Bravo ! Vous avez prouvé que vous pouvez le faire !',
  '⭐ Félicitations ! Votre discipline financière est exemplaire !',
  '💪 Objectif atteint ! Votre futur vous remercie !',
];
const MSG_RAPPEL = [
  '⏰ N\'oubliez pas d\'ajouter votre épargne aujourd\'hui !',
  '💡 Un petit montant ajouté chaque jour fait une grande différence !',
  '🎯 Restez constant — c\'est la clé du succès !',
  '📅 Chaque jour compte — ne manquez pas celui-ci !',
];
const MSG_ENC = [
  'Continuez comme ça, vous êtes sur la bonne voie !',
  'Chaque euro compte — vous faites un excellent travail !',
  'La constance est la clé du succès financier. Bravo !',
  'Vous construisez votre liberté financière jour après jour !',
];

const PLANS = {
  eu:[
    {name:'Gratuit', price:'0',    unit:'€/mois', feats:['Tableau de bord complet','Fiche quotidienne (7j)','1 objectif personnel','Conseils basiques','3 défis épargne'], cta:'Plan actuel'},
    {name:'Basic',   price:'2,99', unit:'€/mois', feats:['Objectifs illimités','Graphiques mensuels','Tous les défis','Catégories perso','Résumé mensuel'], cta:'Choisir Basic'},
    {name:'Premium', price:'5,99', unit:'€/mois', feats:['Tout Basic inclus','Projet Business','Projet Couple','Export PDF','Mode famille','Alertes'], cta:'Choisir Premium', feat:true, badge:'Populaire'},
    {name:'Business',price:'9,99', unit:'€/mois', feats:['Tout Premium inclus','Plusieurs profils','Budget familial','Rapports avancés','Export Excel','Assistance'], cta:'Choisir Business'},
  ],
  af:[
    {name:'Gratuit', price:'0', unit:'€/mois', feats:['Tableau de bord','Fiche quotidienne (7j)','1 objectif','Conseils basiques'], cta:'Plan actuel'},
    {name:'Basic',   price:'1', unit:'€/mois', feats:['Objectifs illimités','Graphiques mensuels','Tous les défis','Catégories perso'], cta:'Choisir Basic — 1€/mois'},
    {name:'Premium', price:'2', unit:'€/mois', feats:['Tout Basic inclus','Projet Business','Projet Couple','Export PDF','Mode famille'], cta:'Choisir Premium — 2€/mois', feat:true, badge:'Populaire'},
    {name:'Business',price:'3', unit:'€/mois', feats:['Tout Premium inclus','Plusieurs profils','Budget familial','Rapports avancés','Export Excel'], cta:'Choisir Business — 3€/mois'},
  ],
};

let pMode = 'eu';
let coOffer = null;

/* ══ INIT ══ */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

function initAuthUI() {
  const b = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };
  b('tabLogin',  () => switchAuthTab('login'));
  b('tabSignup', () => switchAuthTab('signup'));
  b('btnLogin',  doLogin);
  b('btnSignup', doSignup);
  b('btnForgot', e => { e.preventDefault(); doForgotPassword(); });
}

function showEmailConfirmScreen(email) {
  const box = document.querySelector('.auth-box');
  if (!box) return;
  box.innerHTML = `
    <div style="font-size:3rem;margin-bottom:14px">📧</div>
    <div class="auth-title" style="font-size:1.3rem">Vérifiez votre email !</div>
    <p style="font-size:0.9rem;color:#4B5563;margin:14px 0;line-height:1.6">
      Nous avons envoyé un lien de confirmation à<br/><strong>${email}</strong>
    </p>
    <p style="font-size:0.85rem;color:#6B7280;margin-bottom:18px;line-height:1.6">
      Cliquez sur le lien dans l'email pour activer votre compte, puis revenez ici pour vous connecter.
    </p>
    <button class="btn-g" id="btnBackToLogin" style="width:100%">Retour à la connexion</button>
    <p style="font-size:0.76rem;color:#6B7280;margin-top:14px">
      Vous ne voyez pas l'email ? Vérifiez vos spams.
    </p>
  `;
  const btn = document.getElementById('btnBackToLogin');
  if (btn) btn.addEventListener('click', () => location.reload());
}

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab==='login');
  document.getElementById('tabSignup').classList.toggle('active', tab==='signup');
  document.getElementById('loginForm').style.display  = tab==='login'?'block':'none';
  document.getElementById('signupForm').style.display = tab==='signup'?'block':'none';
  hideAuthError();
}
function showAuthError(msg) { const el=document.getElementById('authError'); if(el){el.textContent=msg;el.style.display='block';} }
function hideAuthError()    { const el=document.getElementById('authError'); if(el) el.style.display='none'; }

async function initAuth() {
  initAuthUI();
  try {
    const { data } = await sbClient.auth.getSession();
    if (data && data.session) {
      onAuthSuccess(data.session.user);
      return;
    }
  } catch(e) { console.log('Session check:', e.message); }
  document.body.classList.remove('authed');
  sbClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) onAuthSuccess(session.user);
    if (event === 'SIGNED_OUT') { document.body.classList.remove('authed'); }
  });
}

async function doLogin() {
  hideAuthError();
  const email = document.getElementById('loginEmail')?.value.trim();
  const pwd   = document.getElementById('loginPwd')?.value;
  if (!email || !pwd) { showAuthError('Remplissez votre email et mot de passe.'); return; }
  const btn = document.getElementById('btnLogin');
  if(btn){btn.disabled=true;btn.textContent='Connexion en cours…';}
  try {
    const { data, error } = await sbClient.auth.signInWithPassword({ email, password: pwd });
    if(btn){btn.disabled=false;btn.textContent='Se connecter';}
    if (error) {
      if(error.message.includes('Invalid login credentials')||error.message.includes('invalid_credentials')) {
        showAuthError('Email ou mot de passe incorrect. Vérifiez vos informations.');
      } else if(error.message.includes('Email not confirmed')) {
        showAuthError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.');
      } else {
        showAuthError('Erreur: ' + error.message);
      }
      return;
    }
    if(data && data.user) onAuthSuccess(data.user);
  } catch(e) {
    if(btn){btn.disabled=false;btn.textContent='Se connecter';}
    showAuthError('Erreur de connexion. Vérifiez votre connexion internet.');
  }
}

async function doSignup() {
  hideAuthError();
  const name  = document.getElementById('signupName')?.value.trim();
  const email = document.getElementById('signupEmail')?.value.trim();
  const pwd   = document.getElementById('signupPwd')?.value;
  if (!name || !email || !pwd) { showAuthError('Remplissez tous les champs.'); return; }
  if (pwd.length < 6) { showAuthError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
  const btn = document.getElementById('btnSignup');
  if(btn){btn.disabled=true;btn.textContent='Création en cours…';}
  try {
    const { data, error } = await sbClient.auth.signUp({
      email, password: pwd,
      options:{ data:{ name }, emailRedirectTo: 'https://misswaxbeautycare.github.io/budgetsmart-app-v2' }
    });
    if(btn){btn.disabled=false;btn.textContent='Créer mon compte';}
    if (error) {
      if(error.message.includes('already registered')||error.message.includes('already')) {
        showAuthError('Cet email est déjà utilisé. Cliquez sur "Connexion".');
      } else {
        showAuthError('Erreur: ' + error.message);
      }
      return;
    }
    if (data.user && !data.session) {
      showEmailConfirmScreen(email);
      return;
    }
    if (data.session) onAuthSuccess(data.user);
  } catch(e) {
    if(btn){btn.disabled=false;btn.textContent='Créer mon compte';}
    showAuthError('Erreur. Vérifiez votre connexion internet.');
  }
}

async function doForgotPassword() {
  const email = document.getElementById('loginEmail')?.value.trim();
  if (!email) { showAuthError('Saisissez votre email d\'abord.'); return; }
  const { error } = await sbClient.auth.resetPasswordForEmail(email);
  if (error) { showAuthError(error.message); return; }
  toast('Email de réinitialisation envoyé !');
}

async function doLogout() {
  if(!confirm('Voulez-vous vous déconnecter ?')) return;
  await sbClient.auth.signOut();
  location.reload();
}

async function onAuthSuccess(user) {
  currentUser = user;
  document.body.classList.add('authed');
  const name = user.user_metadata?.name || user.email.split('@')[0];
  const p = ls('profile', {});
  if (!p.name)  p.name  = name;
  if (!p.email) p.email = user.email;
  sv('profile', p);
  txt('userEmailDisplay', user.email);

  // Sync profile to Supabase (upsert)
  try {
    await sbClient.from('profiles').upsert({
      id: user.id,
      email: user.email,
      name: name,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });
  } catch(e) { console.log('Profile sync:', e.message); }

  initApp();
}

function initApp() {
  initNav();
  initMobile();
  initAllButtons();
  loadProfile();
  loadPhoto();
  setDate();
  setEntryDate();
  renderDash();
  renderEntries();
  renderGoals();
  renderTips();
  renderDefis();
  renderPricingAll();
  initCoaching();
  initAdmin();
  initPWA();
  initNotif();
  suiviInit();
  initDarkMode();
  initOnboarding();
  initScanner();
  initPDF();
  checkAdminMessage();
  initFacturation();
}


/* ══ MODULE SUIVI COMPLET AMÉLIORÉ ══ */
function suiviToday() { return new Date().toISOString().slice(0,10); }
function suiviJoursRestants(dateStr) {
  const t=new Date(); t.setHours(0,0,0,0);
  const d=new Date(dateStr); if(isNaN(d.getTime())) return 999;
  d.setHours(0,0,0,0);
  return Math.round((d-t)/86400000);
}

let calCurrentDate = new Date();

function renderSuivi() { suiviGo('dettes'); }

function suiviInit() {
  document.querySelectorAll('.suivi-tab').forEach(btn =>
    btn.addEventListener('click', () => suiviGo(btn.dataset.tab))
  );
  const b=(id,fn)=>{const el=document.getElementById(id);if(el)el.addEventListener('click',fn);};
  b('btnAddDette',         addDette);
  b('btnAddEvenement',     addEvenement);
  b('btnAddTache',         addTache);
  b('btnSuiviAddGoal',     () => go('goals'));
  b('calPrev',             () => { calCurrentDate.setMonth(calCurrentDate.getMonth()-1); renderCalendar(); });
  b('calNext',             () => { calCurrentDate.setMonth(calCurrentDate.getMonth()+1); renderCalendar(); });
  b('btnTacheAujourdhui',  () => { const d=document.getElementById('sTacheDate'); if(d){d.value=suiviToday();renderTaches();} });

  const tDay=document.getElementById('sTacheDate');
  if(tDay){tDay.value=suiviToday();tDay.addEventListener('change',renderTaches);}
  const rev=document.getElementById('sRevenu');
  if(rev){
    const p=ls('profile',{}); rev.value=p.revenuDisponible||'';
    rev.addEventListener('change',()=>{const pp=ls('profile',{});pp.revenuDisponible=parseFloat(rev.value)||0;sv('profile',pp);renderRecommandations();});
  }
}

function suiviGo(tab) {
  document.querySelectorAll('.suivi-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  document.querySelectorAll('.suivi-panel').forEach(p=>p.style.display=p.dataset.panel===tab?'block':'none');
  if(tab==='dettes')    {renderDettes();renderRecommandations();}
  if(tab==='agenda')    renderCalendar();
  if(tab==='taches')    {renderTaches();renderTaskStats();}
  if(tab==='objectifs') {renderObjectifsConsolides();renderProjections();}
}

/* ══ DETTES AMÉLIORÉES ══ */
function addDette() {
  const dettes=ls('dettes',[]);
  dettes.push({id:Date.now(),nom:'Nouvelle dette',montant:0,taux:0,echeance:suiviToday(),paye:false,mensualite:0});
  sv('dettes',dettes); renderDettes(); renderRecommandations(); toast('Dette ajoutée !');
}
function updateDette(id,field,val) {
  const dettes=ls('dettes',[]),d=dettes.find(x=>x.id===id); if(!d) return;
  d[field]=(field==='montant'||field==='taux'||field==='mensualite')?parseFloat(val)||0:val;
  sv('dettes',dettes); renderDettes(); renderRecommandations();
}
function toggleDettePaye(id) {
  const dettes=ls('dettes',[]),d=dettes.find(x=>x.id===id); if(!d) return;
  d.paye=!d.paye; sv('dettes',dettes); renderDettes(); renderRecommandations();
  toast(d.paye?'✅ Dette payée !':'Dette remise en attente.');
}
function removeDette(id) {
  if(!confirm('Supprimer ?')) return;
  sv('dettes',ls('dettes',[]).filter(x=>x.id!==id)); renderDettes(); renderRecommandations();
}
function calcMensualite(montant, taux, mois) {
  if(!taux) return montant/Math.max(mois,1);
  const r=taux/100/12;
  return (montant*r*Math.pow(1+r,mois))/(Math.pow(1+r,mois)-1);
}
function renderDettes() {
  const dettes=ls('dettes',[]),p=ls('profile',{}),cur=p.currency||'€';
  const impayees=dettes.filter(d=>!d.paye);
  const payees=dettes.filter(d=>d.paye);
  const retard=impayees.filter(d=>suiviJoursRestants(d.echeance)<0);
  txt('sTotalDettes',fmt(impayees.reduce((s,d)=>s+(d.montant||0),0),cur));
  txt('sTotalPayees',fmt(payees.reduce((s,d)=>s+(d.montant||0),0),cur));
  txt('sNbRetard',retard.length.toString());
  const lst=document.getElementById('dettesList'); if(!lst) return;
  if(!dettes.length){lst.innerHTML='<div class="empty">Aucune dette enregistrée.</div>';return;}
  lst.innerHTML=dettes.map(d=>{
    const jrs=suiviJoursRestants(d.echeance);
    const moisRestants=Math.max(Math.ceil(jrs/30),1);
    const mensualite=calcMensualite(d.montant,d.taux,moisRestants);
    const cls=d.paye?'sd-paye':jrs<0?'sd-retard':jrs<=7?'sd-proche':'';
    return `<div class="sd-item ${cls}">
      <div class="sd-main">
        <input class="inp sd-nom" value="${d.nom}" onchange="updateDette(${d.id},'nom',this.value)" placeholder="Nom de la dette"/>
        <div class="sd-fields">
          <div class="sd-field"><label>Montant (€)</label><input class="inp" type="number" value="${d.montant}" onchange="updateDette(${d.id},'montant',this.value)"/></div>
          <div class="sd-field"><label>Taux (%)</label><input class="inp" type="number" value="${d.taux||0}" onchange="updateDette(${d.id},'taux',this.value)"/></div>
          <div class="sd-field"><label>Échéance</label><input class="inp" type="date" value="${d.echeance}" onchange="updateDette(${d.id},'echeance',this.value)"/></div>
          <div class="sd-field sd-mensualite"><label>Mensualité conseillée</label><div class="sd-calc">${fmt(mensualite,cur)}/mois</div></div>
        </div>
      </div>
      <div class="sd-actions">
        <div class="sd-info">${jrs<0?'<span style="color:#E8631C">⚠️ En retard de '+Math.abs(jrs)+' j</span>':jrs===0?'<span style="color:#E8631C">⚠️ Échéance aujourd'hui</span>':jrs<=7?'<span style="color:#D98C12">⏰ Dans '+jrs+' j</span>':'<span style="color:#6B5F52">Dans '+jrs+' j ('+moisRestants+' mois)</span>'}</div>
        <div class="sd-btns">
          <button class="sd-paye-btn ${d.paye?'on':''}" onclick="toggleDettePaye(${d.id})">${d.paye?'✓ Payée':'Marquer payée'}</button>
          <button class="tx-del" onclick="removeDette(${d.id})">✕</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function renderRecommandations() {
  const box=document.getElementById('sRecommandations'); if(!box) return;
  const dettes=ls('dettes',[]).filter(d=>!d.paye);
  const p=ls('profile',{}),cur=p.currency||'€';
  if(!dettes.length){box.innerHTML='<div class="sr-succes">✅ Aucune dette en cours — continuez comme ça !</div>';return;}
  const enRetard=dettes.filter(d=>suiviJoursRestants(d.echeance)<0);
  const cher=dettes.filter(d=>(d.taux||0)>=15);
  const totalMensuel=dettes.reduce((s,d)=>{
    const mois=Math.max(Math.ceil(suiviJoursRestants(d.echeance)/30),1);
    return s+calcMensualite(d.montant,d.taux,mois);
  },0);
  const revenu=p.revenuDisponible||0;
  let html='<div class="sr-titre">💡 Analyse & recommandations</div>';
  if(enRetard.length) html+=`<div class="sr-carte sr-urgent">⚠️ ${enRetard.length} dette(s) en retard — réglez-les immédiatement !</div>`;
  if(cher.length) html+=`<div class="sr-carte sr-complexe">💸 ${cher.length} dette(s) à taux ≥15% — priorité absolue (méthode avalanche)</div>`;
  if(revenu>0){
    const ratio=totalMensuel/revenu;
    if(ratio>0.5) html+=`<div class="sr-carte sr-urgent">📊 Vos dettes représentent ${Math.round(ratio*100)}% de votre trésorerie — c'est critique. Renégociez des délais.</div>`;
    else if(ratio>0.3) html+=`<div class="sr-carte sr-complexe">📊 Charge de remboursement : ${Math.round(ratio*100)}% de votre trésorerie — c'est serré.</div>`;
    else html+=`<div class="sr-carte sr-simple">📊 Charge de remboursement raisonnable : ${Math.round(ratio*100)}% de votre trésorerie.</div>`;
  }
  html+=`<div class="sr-carte sr-simple">💰 Mensualités totales conseillées : <strong>${fmt(totalMensuel,cur)}/mois</strong></div>`;
  const sorted=[...dettes].sort((a,b)=>{const ra=suiviJoursRestants(a.echeance)<0,rb=suiviJoursRestants(b.echeance)<0;if(ra!==rb)return ra?-1:1;return(b.taux||0)-(a.taux||0);});
  html+='<div class="sr-titre" style="margin-top:14px">🏆 Ordre de remboursement conseillé</div><ol class="sr-ordre">'+sorted.map((d,i)=>`<li><strong>${d.nom}</strong> — ${fmt(d.montant,cur)} ${d.taux?'('+d.taux+'%)':''} ${suiviJoursRestants(d.echeance)<0?'⚠️ en retard':''}</li>`).join('')+'</ol>';
  box.innerHTML=html;
}

/* ══ AGENDA CALENDRIER ══ */
const EV_COLORS={'personnel':'#2E7DD6','finance':'#E8631C','sante':'#1F9D6B','travail':'#D98C12','dette':'#E8631C'};

function addEvenement() {
  const titre=document.getElementById('sEvTitre')?.value.trim();
  const date=document.getElementById('sEvDate')?.value||suiviToday();
  const heure=document.getElementById('sEvHeure')?.value||'09:00';
  const type=document.getElementById('sEvType')?.value||'personnel';
  const rappel=parseInt(document.getElementById('sEvRappel')?.value)||0;
  if(!titre){toast('Saisissez un titre.');return;}
  const ev=ls('evenements',[]); ev.push({id:Date.now(),titre,date,heure,type,rappel});
  sv('evenements',ev);
  document.getElementById('sEvTitre').value='';
  renderCalendar(); toast('Rendez-vous ajouté !');
  if(rappel>0&&Notification.permission==='granted'){
    const evDate=new Date(date+'T'+heure); const rappelDate=new Date(evDate); rappelDate.setDate(rappelDate.getDate()-rappel);
    if(rappelDate>new Date()) toast('Rappel programmé '+rappel+' jour(s) avant !');
  }
}
function removeEvenement(id) {
  sv('evenements',ls('evenements',[]).filter(e=>e.id!==id)); renderCalendar();
}
function renderCalendar() {
  const y=calCurrentDate.getFullYear(), m=calCurrentDate.getMonth();
  const monthNames=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  txt('calMonthLabel',monthNames[m]+' '+y);
  const firstDay=new Date(y,m,1).getDay();
  const daysInMonth=new Date(y,m+1,0).getDate();
  const today=new Date(); today.setHours(0,0,0,0);
  const ev=ls('evenements',[]);
  const dettes=ls('dettes',[]).filter(d=>!d.paye);
  const grid=document.getElementById('calGrid'); if(!grid) return;
  const days=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
  let html=days.map(d=>`<div class="cal-header-cell">${d}</div>`).join('');
  const startDay=(firstDay+6)%7;
  for(let i=0;i<startDay;i++) html+='<div class="cal-cell cal-empty"></div>';
  for(let day=1;day<=daysInMonth;day++){
    const dateStr=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayDate=new Date(y,m,day);
    const isToday=dayDate.getTime()===today.getTime();
    const dayEv=ev.filter(e=>e.date===dateStr);
    const dayDettes=dettes.filter(d=>d.echeance===dateStr);
    const total=dayEv.length+dayDettes.length;
    html+=`<div class="cal-cell ${isToday?'cal-today':''} ${total?'cal-has-events':''}" onclick="calSelectDay('${dateStr}')">
      <div class="cal-day-num">${day}</div>
      ${dayEv.slice(0,2).map(e=>`<div class="cal-ev-dot" style="background:${EV_COLORS[e.type]||'#E8631C'}" title="${e.titre}"></div>`).join('')}
      ${dayDettes.slice(0,1).map(d=>`<div class="cal-ev-dot" style="background:#E8631C" title="💳 ${d.nom}"></div>`).join('')}
      ${total>3?`<div class="cal-more">+${total-2}</div>`:''}
    </div>`;
  }
  grid.innerHTML=html;
}
function calSelectDay(dateStr) {
  const ev=ls('evenements',[]).filter(e=>e.date===dateStr);
  const dettes=ls('dettes',[]).filter(d=>d.paye===false&&d.echeance===dateStr);
  const panel=document.getElementById('calDayEvents');
  const title=document.getElementById('calDayTitle');
  const list=document.getElementById('calDayList');
  if(!panel||!title||!list) return;
  const d=new Date(dateStr);
  title.textContent=d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  if(!ev.length&&!dettes.length){list.innerHTML='<div class="empty">Aucun événement ce jour.</div>';panel.style.display='block';return;}
  list.innerHTML=[
    ...ev.map(e=>`<div class="sa-item" style="border-color:${EV_COLORS[e.type]||'#E8631C'}">
      <div class="sa-info">
        <div class="sa-titre">${e.titre}</div>
        <div class="sa-date">${e.heure||''} · ${e.type} ${e.rappel?'· Rappel '+e.rappel+'j avant':''}</div>
      </div>
      <button class="tx-del" onclick="removeEvenement(${e.id})">✕</button>
    </div>`),
    ...dettes.map(d=>`<div class="sa-item sd-retard"><div class="sa-info"><div class="sa-titre">💳 Échéance : ${d.nom}</div><div class="sa-date">${fmt(d.montant)} — ${suiviJoursRestants(d.echeance)<0?'En retard !':'Aujourd'hui !'}</div></div></div>`)
  ].join('');
  panel.style.display='block';
}

/* ══ TÂCHES AMÉLIORÉES ══ */
function addTache() {
  const titre=document.getElementById('sTacheTitre')?.value.trim();
  const date=document.getElementById('sTacheDate')?.value||suiviToday();
  const prio=document.getElementById('sTachePrio')?.value||'normal';
  const cat=document.getElementById('sTacheCat')?.value||'perso';
  if(!titre) return;
  const t=ls('taches',[]); t.push({id:Date.now(),date,titre,fait:false,prio,cat});
  sv('taches',t); document.getElementById('sTacheTitre').value=''; renderTaches(); renderTaskStats();
}
function toggleTache(id) {
  const t=ls('taches',[]),x=t.find(i=>i.id===id);
  if(x){x.fait=!x.fait;sv('taches',t);renderTaches();renderTaskStats();}
}
function removeTache(id) {
  sv('taches',ls('taches',[]).filter(t=>t.id!==id)); renderTaches(); renderTaskStats();
}
function renderTaches() {
  const date=document.getElementById('sTacheDate')?.value||suiviToday();
  const taches=ls('taches',[]).filter(t=>t.date===date);
  const fait=taches.filter(t=>t.fait).length;
  const pct=taches.length?Math.round(fait/taches.length*100):0;
  const el=document.getElementById('sTacheCompteur');
  if(el) el.innerHTML=taches.length?`<span style="color:${pct===100?'#1F9D6B':'#E8631C'}">${fait}/${taches.length} (${pct}%)</span>`:'';
  const lst=document.getElementById('tachesList'); if(!lst) return;
  if(!taches.length){lst.innerHTML='<div class="empty">Aucune tâche pour ce jour.</div>';return;}
  const prioColors={'urgent':'#E8631C','normal':'#2E7DD6','faible':'#6B5F52'};
  const catIcons={'perso':'👤','finance':'💰','travail':'💼','autre':'📦'};
  const sorted=[...taches].sort((a,b)=>{const p={'urgent':0,'normal':1,'faible':2};return p[a.prio]-p[b.prio];});
  lst.innerHTML=sorted.map(t=>`
    <div class="st-item ${t.fait?'st-fait':''} st-prio-${t.prio}">
      <button class="st-check ${t.fait?'on':''}" onclick="toggleTache(${t.id})">${t.fait?'✓':''}</button>
      <div class="st-body">
        <span class="st-titre">${t.titre}</span>
        <div class="st-meta">
          <span style="color:${prioColors[t.prio]||'#6B5F52'};font-size:0.78rem;font-weight:800">${t.prio.toUpperCase()}</span>
          <span style="font-size:0.78rem;color:#6B5F52">${catIcons[t.cat]||'📦'} ${t.cat}</span>
        </div>
      </div>
      <button class="tx-del" onclick="removeTache(${t.id})">✕</button>
    </div>`).join('');
}
function renderTaskStats() {
  const el=document.getElementById('taskStatsRow'); if(!el) return;
  const taches=ls('taches',[]);
  const today=suiviToday();
  const thisWeek=new Date(); thisWeek.setDate(thisWeek.getDate()-7);
  const todayT=taches.filter(t=>t.date===today);
  const weekT=taches.filter(t=>new Date(t.date)>=thisWeek);
  const todayPct=todayT.length?Math.round(todayT.filter(t=>t.fait).length/todayT.length*100):0;
  const weekPct=weekT.length?Math.round(weekT.filter(t=>t.fait).length/weekT.length*100):0;
  el.innerHTML=`
    <div class="task-stat"><span>Aujourd'hui</span><strong>${todayT.filter(t=>t.fait).length}/${todayT.length}</strong><div class="ts-bar"><div class="ts-fill" style="width:${todayPct}%"></div></div></div>
    <div class="task-stat"><span>Cette semaine</span><strong>${weekT.filter(t=>t.fait).length}/${weekT.length}</strong><div class="ts-bar"><div class="ts-fill" style="width:${weekPct}%"></div></div></div>
    <div class="task-stat"><span>Urgent en attente</span><strong style="color:#E8631C">${taches.filter(t=>!t.fait&&t.prio==='urgent').length}</strong></div>
    <div class="task-stat"><span>Total complétées</span><strong style="color:#1F9D6B">${taches.filter(t=>t.fait).length}</strong></div>
  `;
}

/* ══ OBJECTIFS + PROJECTIONS ══ */
function renderObjectifsConsolides() {
  const goals=ls('goals',[]),dettes=ls('dettes',[]).filter(d=>!d.paye);
  const entries=ls('entries',[]);
  const p=ls('profile',{}),cur=p.currency||'€';
  const lst=document.getElementById('objectifsConsolides'); if(!lst) return;
  const totalEp=goals.reduce((s,g)=>s+(g.sav||0),0);
  const totalDt=dettes.reduce((s,d)=>s+(d.montant||0),0);
  let html=`<div class="oc-resume">
    <div class="oc-stat"><span>Épargne totale</span><strong style="color:#1F9D6B">${fmt(totalEp,cur)}</strong></div>
    <div class="oc-stat"><span>Dettes restantes</span><strong style="color:#E8631C">${fmt(totalDt,cur)}</strong></div>
    <div class="oc-stat"><span>Solde net</span><strong style="color:${totalEp-totalDt>=0?'#1F9D6B':'#E8631C'}">${fmt(totalEp-totalDt,cur)}</strong></div>
  </div>`;
  if(!goals.length){lst.innerHTML=html+'<div class="empty">Aucun objectif créé.</div>';return;}
  html+=goals.map(g=>{
    const pct=Math.min(100,Math.round(((g.sav||0)/g.target)*100))||0;
    const restant=Math.max(0,g.target-(g.sav||0));
    return `<div class="oc-item">
      <div class="sgi-hd"><div class="sgi-name">${g.name} ${pct>=100?'🏆':''}</div><div class="sgi-pct" style="color:${pct>=100?'#1F9D6B':'#E8631C'}">${pct}%</div></div>
      <div class="pb-bar"><div class="pb-fill" style="width:${pct}%"></div></div>
      <div class="sgi-meta">${fmt(g.sav||0,cur)} / ${fmt(g.target,cur)} — Restant : ${fmt(restant,cur)}</div>
    </div>`;
  }).join('');
  lst.innerHTML=html;
}
function renderProjections() {
  const goals=ls('goals',[]);
  const entries=ls('entries',[]);
  const p=ls('profile',{}),cur=p.currency||'€';
  const el=document.getElementById('projectionsContent'); if(!el) return;
  if(!goals.length){el.innerHTML='<div class="empty">Créez des objectifs pour voir les projections.</div>';return;}
  const now=new Date(),thisMonth=now.getMonth(),thisYear=now.getFullYear();
  const lastMonth=entries.filter(e=>{const d=new Date(e.date);return d.getMonth()===thisMonth&&d.getFullYear()===thisYear;});
  const mSav=lastMonth.reduce((s,e)=>s+(e.sav||0),0);
  el.innerHTML=goals.filter(g=>(g.sav||0)<g.target).map(g=>{
    const restant=g.target-(g.sav||0);
    if(mSav<=0) return `<div class="proj-item"><div class="proj-name">${g.name}</div><div class="proj-conseil">Enregistrez vos économies mensuelles pour obtenir une projection.</div></div>`;
    const moisEstimes=Math.ceil(restant/mSav);
    const dateEstimee=new Date(); dateEstimee.setMonth(dateEstimee.getMonth()+moisEstimes);
    const cible=g.date?new Date(g.date):null;
    const enAvance=cible&&dateEstimee<=cible;
    return `<div class="proj-item ${enAvance?'proj-ok':'proj-warn'}">
      <div class="proj-name">${g.name}</div>
      <div class="proj-data">
        <span>Rythme actuel : <strong>${fmt(mSav,cur)}/mois</strong></span>
        <span>Objectif atteint dans : <strong>${moisEstimes} mois</strong> (${dateEstimee.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})})</span>
        ${cible?`<span style="color:${enAvance?'#1F9D6B':'#E8631C'}">${enAvance?'✅ Vous serez en avance sur votre date cible !':'⚠️ À ce rythme, vous dépasserez votre date cible.'}</span>`:''}
      </div>
      <div class="proj-conseil">${moisEstimes<=3?'Excellent rythme — continuez !':moisEstimes<=12?'Bon rythme — restez régulier.':'Augmentez vos économies mensuelles pour atteindre cet objectif plus vite.'}</div>
    </div>`;
  }).join('');
}



/* ══ MODE SOMBRE ══ */
function initDarkMode() {
  const isDark = localStorage.getItem('bs_dark') === '1';
  if (isDark) applyDark(true);
  const b = (id, fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click', fn); };
  b('btnDarkMode',     toggleDark);
  b('btnDarkModeSide', toggleDark);
  b('setDark',         toggleDark);
  const dt = document.getElementById('darkToggle');
  if (dt && isDark) dt.classList.add('on');
}
function toggleDark() {
  const isDark = document.body.classList.contains('dark');
  applyDark(!isDark);
  localStorage.setItem('bs_dark', (!isDark)?'1':'0');
  const dt = document.getElementById('darkToggle');
  if (dt) dt.classList.toggle('on', !isDark);
  toast((!isDark) ? '🌙 Mode sombre activé' : '☀️ Mode clair activé');
}
function applyDark(on) {
  document.body.classList.toggle('dark', on);
  const btn1 = document.getElementById('btnDarkMode');
  const btn2 = document.getElementById('btnDarkModeSide');
  if (btn1) btn1.textContent = on ? '☀️' : '🌙';
  if (btn2) btn2.textContent = on ? '☀️ Mode clair' : '🌙 Mode sombre';
}

/* ══ ONBOARDING ══ */
function initOnboarding() {
  if (localStorage.getItem('bs_onboarded') === '1') return;
  const overlay = document.getElementById('onboardingOverlay');
  if (overlay) overlay.style.display = 'flex';
  document.querySelectorAll('.ob-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.next;
      if (next === 'done') {
        if (overlay) overlay.style.display = 'none';
        localStorage.setItem('bs_onboarded', '1');
        return;
      }
      document.querySelectorAll('.ob-slide').forEach(s => s.style.display = 'none');
      document.querySelectorAll('.ob-step-dot').forEach((d,i) => d.classList.toggle('active', i < parseInt(next)));
      const slide = document.getElementById('obSlide' + next);
      if (slide) slide.style.display = 'block';
    });
  });
}

/* ══ SCANNER REÇU ══ */
function initScanner() {
  const b = (id, fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click', fn); };
  b('btnScanReceipt', openScanner);
  b('btnScanClose',   closeScanner);
  b('btnScanSave',    saveScan);
  const file = document.getElementById('scanFile');
  if (file) file.addEventListener('change', handleScanFile);
  const preview = document.getElementById('scanPreview');
  if (preview) preview.addEventListener('click', () => document.getElementById('scanFile')?.click());
}
function openScanner() {
  const modal = document.getElementById('scanModal');
  if (modal) modal.classList.add('open');
  const eDate = document.getElementById('eDate')?.value;
  // Pre-fill date from current entry date
}
function closeScanner() {
  const modal = document.getElementById('scanModal');
  if (modal) modal.classList.remove('open');
  const img = document.getElementById('scanImg');
  if (img) { img.src=''; img.style.display='none'; }
  ['scanMontant','scanNote'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
}
function handleScanFile(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = document.getElementById('scanImg');
    const ph  = document.querySelector('.scan-placeholder');
    if (img) { img.src = ev.target.result; img.style.display = 'block'; }
    if (ph)  ph.style.display = 'none';
    // Store receipt image with the entry
    localStorage.setItem('bs_last_receipt', ev.target.result);
  };
  reader.readAsDataURL(file);
}
function saveScan() {
  const montant = parseFloat(document.getElementById('scanMontant')?.value)||0;
  const cat     = document.getElementById('scanCat')?.value || 'autre';
  const note    = document.getElementById('scanNote')?.value.trim() || 'Reçu scanné';
  const receipt = localStorage.getItem('bs_last_receipt') || '';
  if (!montant) { toast('Saisissez le montant du reçu.'); return; }
  const entries = ls('entries', []);
  entries.push({
    id: Date.now(), date: new Date().toISOString().slice(0,10),
    inc: 0, exp: montant, cat, sav: 0, note, receipt
  });
  sv('entries', entries);
  localStorage.removeItem('bs_last_receipt');
  closeScanner(); renderEntries(); renderDash();
  toast('✅ Dépense enregistrée depuis le reçu !');
}

/* ══ EXPORT PDF ══ */
function initPDF() {
  const b = (id, fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click', fn); };
  b('setPDF',          openPDFModal);
  b('btnPdfGenerate',  generatePDF);
  b('btnPdfClose',     () => { const m=document.getElementById('pdfModal'); if(m) m.classList.remove('open'); });
  // Set current month
  const m = document.getElementById('pdfMois');
  if (m) m.value = new Date().getMonth().toString();
}
function openPDFModal() {
  const modal = document.getElementById('pdfModal');
  if (modal) modal.classList.add('open');
}
function generatePDF() {
  const mois  = parseInt(document.getElementById('pdfMois')?.value)||0;
  const annee = parseInt(document.getElementById('pdfAnnee')?.value)||new Date().getFullYear();
  const entries = ls('entries', []).filter(e => {
    const d = new Date(e.date);
    return d.getMonth()===mois && d.getFullYear()===annee;
  });
  const goals   = ls('goals', []);
  const p       = ls('profile', {}), cur = p.currency||'€';
  const moisNoms = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const inc = entries.reduce((s,e)=>s+(e.inc||0),0);
  const exp = entries.reduce((s,e)=>s+(e.exp||0),0);
  const sav = entries.reduce((s,e)=>s+(e.sav||0),0);

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/>
<title>BudgetSmart — Rapport ${moisNoms[mois]} ${annee}</title>
<style>
  body{font-family:'Segoe UI',sans-serif;color:#1A1410;background:#fff;padding:30px;max-width:800px;margin:0 auto;}
  h1{font-size:2rem;color:#E8631C;margin-bottom:4px;}
  h2{font-size:1.3rem;color:#1A1410;margin:24px 0 12px;border-bottom:2px solid #F0DFC4;padding-bottom:8px;}
  .header{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #E8631C;padding-bottom:16px;margin-bottom:24px;}
  .logo{font-size:1.5rem;font-weight:800;}
  .logo em{color:#E8631C;font-style:normal;}
  .kpi-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px;}
  .kpi{background:#FFF7EE;border:2px solid #F0DFC4;border-radius:10px;padding:14px;text-align:center;}
  .kpi label{display:block;font-size:0.72rem;text-transform:uppercase;color:#6B5F52;margin-bottom:5px;font-weight:700;}
  .kpi strong{font-size:1.6rem;font-weight:800;}
  .inc{color:#1F9D6B;} .exp{color:#E8631C;} .sav{color:#D98C12;}
  table{width:100%;border-collapse:collapse;font-size:0.9rem;}
  th{background:#E8631C;color:#fff;padding:9px 12px;text-align:left;}
  td{padding:8px 12px;border-bottom:1px solid #F0DFC4;}
  tr:nth-child(even) td{background:#FFF7EE;}
  .footer{margin-top:30px;text-align:center;font-size:0.8rem;color:#6B5F52;border-top:1px solid #F0DFC4;padding-top:12px;}
  @media print{body{padding:15px;}}
</style>
</head><body>
<div class="header">
  <div class="logo">Budget<em>Smart</em></div>
  <div><strong>Rapport mensuel</strong><br/>${moisNoms[mois]} ${annee}<br/><small>${p.name||'Mon compte'}</small></div>
</div>
<div class="kpi-row">
  <div class="kpi"><label>Revenus</label><strong class="inc">+${fmt(inc,cur)}</strong></div>
  <div class="kpi"><label>Dépenses</label><strong class="exp">-${fmt(exp,cur)}</strong></div>
  <div class="kpi"><label>Économisé</label><strong class="sav">${fmt(sav,cur)}</strong></div>
</div>
<div class="kpi-row">
  <div class="kpi"><label>Solde net</label><strong class="${inc-exp>=0?'inc':'exp'}">${fmt(inc-exp,cur)}</strong></div>
  <div class="kpi"><label>Transactions</label><strong>${entries.length}</strong></div>
  <div class="kpi"><label>Objectifs actifs</label><strong>${goals.filter(g=>(g.sav||0)<g.target).length}</strong></div>
</div>
<h2>📊 Détail des transactions</h2>
${entries.length ? `<table>
  <thead><tr><th>Date</th><th>Catégorie</th><th>Note</th><th>Revenus</th><th>Dépenses</th><th>Économies</th></tr></thead>
  <tbody>${entries.map(e=>`<tr>
    <td>${new Date(e.date).toLocaleDateString('fr-FR')}</td>
    <td>${e.cat||'—'}</td>
    <td>${e.note||'—'}</td>
    <td class="inc">${e.inc?'+'+fmt(e.inc,cur):''}</td>
    <td class="exp">${e.exp?'-'+fmt(e.exp,cur):''}</td>
    <td class="sav">${e.sav?fmt(e.sav,cur):''}</td>
  </tr>`).join('')}</tbody>
</table>` : '<p>Aucune transaction ce mois.</p>'}
${goals.length?`<h2>🎯 Objectifs d'épargne</h2><table>
  <thead><tr><th>Objectif</th><th>Économisé</th><th>Cible</th><th>Progression</th></tr></thead>
  <tbody>${goals.map(g=>{const pct=Math.min(100,Math.round(((g.sav||0)/g.target)*100));return`<tr><td>${g.name}</td><td class="inc">${fmt(g.sav||0,cur)}</td><td>${fmt(g.target,cur)}</td><td>${pct}% ${pct>=100?'🏆':''}</td></tr>`;}).join('')}</tbody>
</table>`:''}
<div class="footer">Rapport généré par BudgetSmart · ${new Date().toLocaleDateString('fr-FR')} · © Miss Nyunge Digital Services</div>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 800);
  }
  const modal = document.getElementById('pdfModal');
  if (modal) modal.classList.remove('open');
  toast('📄 Rapport PDF généré !');
}

/* ══ ADMIN REVENUS & MESSAGES ══ */
async function renderAdminRevenue(users) {
  if (!users || !isAdmin) return;
  const plans = { gratuit:0, basic:2.99, premium:5.99, business:9.99 };
  const payants = users.filter(u => u.plan && u.plan !== 'gratuit');
  const revenu  = payants.reduce((s,u) => s + (plans[u.plan]||0), 0);
  const taux    = users.length ? Math.round(payants.length/users.length*100) : 0;
  txt('adPayants',    payants.length.toString());
  txt('adRevenu',     fmt(revenu) + '/mois');
  txt('adConversion', taux + '%');
}

async function sendMessageToAll() {
  const msg = document.getElementById('adMessage')?.value.trim();
  const status = document.getElementById('adMessageStatus');
  if (!msg) { toast('Écrivez un message.'); return; }
  if (!confirm('Envoyer ce message à tous les utilisateurs ?')) return;
  const btn = document.getElementById('btnSendMessage');
  if (btn) { btn.disabled=true; btn.textContent='Envoi…'; }
  try {
    // Store message in Supabase for users to see on next login
    const { error } = await sbClient.from('profiles').update({
      last_admin_message: msg,
      message_date: new Date().toISOString()
    }).neq('id', currentUser?.id);
    if (error) throw error;
    if (status) { status.innerHTML='<div class="sr-simple" style="padding:10px">✅ Message envoyé à tous les utilisateurs !</div>'; }
    toast('✅ Message envoyé !');
    document.getElementById('adMessage').value = '';
  } catch(e) {
    if (status) status.innerHTML = '<div class="sr-urgent" style="padding:10px">❌ Erreur : '+e.message+'</div>';
  }
  if (btn) { btn.disabled=false; btn.textContent='📤 Envoyer à tous'; }
}

/* ══ NOTIFICATION ADMIN MESSAGE ══ */
async function checkAdminMessage() {
  if (!currentUser) return;
  try {
    const { data } = await sbClient.from('profiles').select('last_admin_message,message_date').eq('id',currentUser.id).single();
    if (data?.last_admin_message && data?.message_date) {
      const msgDate = new Date(data.message_date);
      const lastSeen = localStorage.getItem('bs_last_msg_seen');
      if (!lastSeen || new Date(lastSeen) < msgDate) {
        setTimeout(() => {
          toast('📢 Message de BudgetSmart : ' + data.last_admin_message);
          localStorage.setItem('bs_last_msg_seen', data.message_date);
        }, 2000);
      }
    }
  } catch(e) {}
}


/* ══ MODULE FACTURATION COMPLET ══ */
let currentFacture = null;
let factLogoData   = null;
let factureTab     = 'liste';

function initFacturation() {
  // Tabs
  document.querySelectorAll('[data-panel]').forEach(() => {});
  const b = (id,fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click',fn); };
  b('btnNewFacture',     () => { factNew(); factGo('creer'); });
  b('btnAddLigne',       factAddLigne);
  b('btnSaveFacture',    factSave);
  b('btnPreviewFacture', factPreview);
  b('btnDownloadFacture',factDownload);
  b('btnShareWA',        () => factShare('wa'));
  b('btnShareEmail',     () => factShare('email'));
  b('btnPdfRecreate',    pdfRecreate);
  b('btnPdfShareWA',     () => pdfShare('wa'));
  b('btnPdfShareEmail',  () => pdfShare('email'));
  b('btnNewFacture',     () => factGo('creer'));

  // Logo upload
  const logo = document.getElementById('fLogo');
  if (logo) logo.addEventListener('change', e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      factLogoData = ev.target.result;
      const img = document.getElementById('fLogoPreview');
      if(img) { img.src=factLogoData; img.style.display='block'; }
    };
    reader.readAsDataURL(file);
  });

  // PDF Logo upload
  const pdfLogo = document.getElementById('pdfLogo');
  if (pdfLogo) pdfLogo.addEventListener('change', e => {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById('pdfLogoPreview');
      if(img) { img.src=ev.target.result; img.style.display='inline-block'; }
      localStorage.setItem('bs_pdf_logo', ev.target.result);
    };
    reader.readAsDataURL(file);
  });

  // Color swatches
  document.querySelectorAll('.fc-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      document.querySelectorAll('.fc-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      const el = document.getElementById('fCouleur'); if(el) el.value = sw.dataset.color;
      factCalcTotaux();
    });
  });

  // Auto-calc on input change
  ['fRemise','fTVA'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', factCalcTotaux);
  });

  // PDF Upload
  const pdfFile = document.getElementById('pdfUploadFile');
  if (pdfFile) pdfFile.addEventListener('change', handlePDFUpload);

  const pdfZone = document.getElementById('pdfUploadZone');
  if (pdfZone) {
    pdfZone.addEventListener('click', () => document.getElementById('pdfUploadFile')?.click());
    pdfZone.addEventListener('dragover', e => { e.preventDefault(); pdfZone.style.borderColor='var(--or)'; });
    pdfZone.addEventListener('drop', e => { e.preventDefault(); pdfZone.style.borderColor=''; const f=e.dataTransfer.files[0]; if(f) { document.getElementById('pdfUploadFile').files=e.dataTransfer.files; handlePDFUpload({target:{files:e.dataTransfer.files}}); } });
  }

  // Search/filter
  const search = document.getElementById('factSearch');
  const filter = document.getElementById('factFilter');
  if (search) search.addEventListener('input', renderFacturesList);
  if (filter) filter.addEventListener('change', renderFacturesList);

  // Set default date
  const fd = document.getElementById('fDate');
  const fe = document.getElementById('fEcheance');
  if (fd) fd.value = new Date().toISOString().slice(0,10);
  if (fe) { const d=new Date(); d.setDate(d.getDate()+30); fe.value=d.toISOString().slice(0,10); }

  // Auto-numero
  const fn = document.getElementById('fNumero');
  if (fn && !fn.value) {
    const factures = ls('factures',[]);
    fn.value = 'FAC-' + String(factures.length+1).padStart(3,'0');
  }

  // Prefill from profile
  const p = ls('profile', {});
  const fe2 = document.getElementById('fEmail');
  if (fe2 && !fe2.value && p.email) fe2.value = p.email;

  // Load saved company info
  const saved = ls('factCompany', {});
  if (saved.entreprise) document.getElementById('fEntreprise').value = saved.entreprise;
  if (saved.adresse)    document.getElementById('fAdresse').value    = saved.adresse;
  if (saved.tel)        document.getElementById('fTel').value        = saved.tel;
  if (saved.logo)       { factLogoData=saved.logo; const img=document.getElementById('fLogoPreview'); if(img){img.src=saved.logo;img.style.display='block';} }

  initTemplateSelector();
  factAddLigne(); // Start with one empty line
  renderFacturesList();
}

function factGo(tab) {
  factureTab = tab;
  // Handle facturation tabs separately from suivi tabs
  const allTabs = document.querySelectorAll('#p-facturation .suivi-tab');
  const allPanels = document.querySelectorAll('#p-facturation .suivi-panel');
  allTabs.forEach(b => b.classList.toggle('active', b.dataset.tab===tab));
  allPanels.forEach(p => p.style.display = p.dataset.panel===tab?'block':'none');
  if (tab==='liste') renderFacturesList();
}

function factNew() {
  currentFacture = null;
  ['fEntreprise','fAdresse','fEmail','fTel','fClientNom','fClientAdresse','fClientEmail','fClientTel','fNote'].forEach(id => {
    const el=document.getElementById(id);
  });
  document.getElementById('fRemise').value = '0';
  document.getElementById('fTVA').value    = '0';
  document.getElementById('fStatut').value = 'brouillon';
  document.getElementById('fCouleur').value = '#E8631C';
  document.querySelectorAll('.fc-swatch').forEach((s,i) => s.classList.toggle('active',i===0));
  const fn = document.getElementById('fNumero');
  if (fn) fn.value = 'FAC-'+String(ls('factures',[]).length+1).padStart(3,'0');
  document.getElementById('factLignes').innerHTML = '';
  factAddLigne();
  factCalcTotaux();
  const pv = document.getElementById('factPreviewContainer');
  if (pv) pv.style.display='none';

  // Restore saved company
  const saved = ls('factCompany',{});
  if (saved.entreprise) document.getElementById('fEntreprise').value = saved.entreprise;
  if (saved.adresse)    document.getElementById('fAdresse').value    = saved.adresse;
  if (saved.email)      document.getElementById('fEmail').value      = saved.email;
  if (saved.tel)        document.getElementById('fTel').value        = saved.tel;
  if (saved.logo)       { factLogoData=saved.logo; const img=document.getElementById('fLogoPreview'); if(img){img.src=saved.logo;img.style.display='block';} }
}

function factAddLigne() {
  const container = document.getElementById('factLignes'); if(!container) return;
  const id = Date.now();
  const div = document.createElement('div');
  div.className = 'fact-ligne';
  div.dataset.id = id;
  div.innerHTML = `
    <input type="text"   class="inp fl-desc"  placeholder="Description du service…"/>
    <input type="number" class="inp fl-qty"   placeholder="Qté" value="1" min="0.01" step="0.01"/>
    <input type="number" class="inp fl-prix"  placeholder="Prix unitaire" min="0" step="0.01"/>
    <div class="fl-total">0,00</div>
    <button class="fl-del tx-del">✕</button>
  `;
  container.appendChild(div);
  div.querySelectorAll('.fl-qty,.fl-prix').forEach(el => el.addEventListener('input', () => {
    const qty  = parseFloat(div.querySelector('.fl-qty')?.value)||0;
    const prix = parseFloat(div.querySelector('.fl-prix')?.value)||0;
    div.querySelector('.fl-total').textContent = fmt(qty*prix).replace(' €','');
    factCalcTotaux();
  }));
  div.querySelector('.fl-del').addEventListener('click', () => { div.remove(); factCalcTotaux(); });
}

function factGetLignes() {
  const lignes = [];
  document.querySelectorAll('.fact-ligne').forEach(div => {
    const desc  = div.querySelector('.fl-desc')?.value.trim()||'';
    const qty   = parseFloat(div.querySelector('.fl-qty')?.value)||0;
    const prix  = parseFloat(div.querySelector('.fl-prix')?.value)||0;
    if (desc||prix) lignes.push({desc,qty,prix,total:qty*prix});
  });
  return lignes;
}

function factCalcTotaux() {
  const lignes   = factGetLignes();
  const sousTotal= lignes.reduce((s,l)=>s+l.total,0);
  const remise   = parseFloat(document.getElementById('fRemise')?.value)||0;
  const tva      = parseFloat(document.getElementById('fTVA')?.value)||0;
  const remiseMt = sousTotal*remise/100;
  const apresRem = sousTotal-remiseMt;
  const tvaMt    = apresRem*tva/100;
  const total    = apresRem+tvaMt;
  const cur      = document.getElementById('fDevise')?.value||'€';
  txt('ftSousTotal', fmt(sousTotal,cur));
  txt('ftRemise',    remise?'-'+fmt(remiseMt,cur):'—');
  txt('ftTVA',       tva?'+'+fmt(tvaMt,cur):'—');
  txt('ftTotal',     fmt(total,cur));
}

function factBuildData() {
  const cur = document.getElementById('fDevise')?.value||'€';
  const lignes = factGetLignes();
  const remise = parseFloat(document.getElementById('fRemise')?.value)||0;
  const tva    = parseFloat(document.getElementById('fTVA')?.value)||0;
  const sousTotal = lignes.reduce((s,l)=>s+l.total,0);
  const remiseMt  = sousTotal*remise/100;
  const tvaMt     = (sousTotal-remiseMt)*tva/100;
  const total     = sousTotal-remiseMt+tvaMt;
  return {
    id:        currentFacture?.id||Date.now(),
    numero:    document.getElementById('fNumero')?.value||'',
    date:      document.getElementById('fDate')?.value||'',
    echeance:  document.getElementById('fEcheance')?.value||'',
    devise:    cur,
    couleur:   document.getElementById('fCouleur')?.value||'#E8631C',
    statut:    document.getElementById('fStatut')?.value||'brouillon',
    logo:      factLogoData,
    entreprise:document.getElementById('fEntreprise')?.value||'',
    adresse:   document.getElementById('fAdresse')?.value||'',
    email:     document.getElementById('fEmail')?.value||'',
    tel:       document.getElementById('fTel')?.value||'',
    clientNom: document.getElementById('fClientNom')?.value||'',
    clientAdresse:document.getElementById('fClientAdresse')?.value||'',
    clientEmail:  document.getElementById('fClientEmail')?.value||'',
    clientTel:    document.getElementById('fClientTel')?.value||'',
    note:      document.getElementById('fNote')?.value||'',
    lignes, remise, tva, sousTotal, remiseMt, tvaMt, total, cur
  };
}

function factSave() {
  const data = factBuildData();
  if (!data.clientNom && !data.lignes.length) { toast('Remplissez au moins le client et une ligne.'); return; }
  const factures = ls('factures',[]);
  const idx = factures.findIndex(f=>f.id===data.id);
  if (idx>=0) factures[idx]=data; else factures.push(data);
  sv('factures',factures);
  // Save company info for next time
  sv('factCompany',{entreprise:data.entreprise,adresse:data.adresse,email:data.email,tel:data.tel,logo:data.logo});
  currentFacture = data;
  toast('✅ Facture sauvegardée !');
  renderFacturesList();
}

function factPreview() {
  const data = factBuildData();
  const container = document.getElementById('factPreviewContainer');
  const preview   = document.getElementById('factPreview');
  if (!container||!preview) return;
  const tpl = FACT_TEMPLATES[currentTemplate];
  let html;
  try { html = tpl?.build ? tpl.build(data) : buildModerne(data); } catch(e) { html = buildModerne(data); }
  preview.innerHTML = `<iframe srcdoc="${html.replace(/"/g,"&quot;")}" style="width:100%;min-height:700px;border:none;border-radius:var(--r)"></iframe>`;
  container.style.display='block';
  container.scrollIntoView({behavior:'smooth'});
}

function factDownload() {
  const data = factBuildData();
  factSave();
  generateFacturePDF(data);
}

function generateFacturePDF(data) {
  const tpl = FACT_TEMPLATES[currentTemplate];
  let html;
  try {
    if (tpl && tpl.build) html = tpl.build(data);
    else html = buildFactureHTML(data, true);
  } catch(e) { html = buildModerne(data); }
  const win = window.open('','_blank');
  if (win) { win.document.write(html); win.document.close(); setTimeout(()=>win.print(),800); }
  toast('📥 Facture PDF générée !');
}

function buildFactureHTML(data, forPrint) {
  const c = data.couleur||'#E8631C';
  const cur = data.cur||data.devise||'€';
  const moisNoms=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const fmtDate = d => { if(!d) return '—'; const dt=new Date(d); return dt.getDate()+' '+moisNoms[dt.getMonth()]+' '+dt.getFullYear(); };
  const statusLabel = {'brouillon':'BROUILLON','envoyee':'ENVOYÉE','payee':'PAYÉE'};
  const statusColor = {'brouillon':'#6B5F52','envoyee':c,'payee':'#1F9D6B'};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/>
<title>Facture ${data.numero||''} — ${data.clientNom||''}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1A1410;background:#fff;padding:${forPrint?'0':'20px'};max-width:820px;margin:0 auto;font-size:14px;}
  .fact-doc{background:#fff;${forPrint?'':'border:1px solid #E0D4C0;border-radius:12px;overflow:hidden;'}}
  .fact-top{background:${c};color:#fff;padding:32px 36px 24px;}
  .fact-top-row{display:flex;justify-content:space-between;align-items:flex-start;}
  .fact-logo{max-height:60px;max-width:160px;filter:brightness(0) invert(1);}
  .fact-title{font-size:2.2rem;font-weight:800;letter-spacing:-0.02em;}
  .fact-numero{font-size:1rem;opacity:0.85;margin-top:4px;}
  .fact-status{display:inline-block;background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:20px;font-size:0.78rem;font-weight:800;text-transform:uppercase;margin-top:8px;}
  .fact-body{padding:32px 36px;}
  .fact-parties{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:28px;}
  .fact-partie h3{font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:${c};margin-bottom:8px;font-weight:800;}
  .fact-partie p{font-size:0.92rem;color:#2E2620;line-height:1.6;}
  .fact-info-bar{display:flex;gap:24px;background:#F7F0E2;border-radius:10px;padding:14px 18px;margin-bottom:24px;}
  .fi-item span{display:block;font-size:0.68rem;text-transform:uppercase;color:#6B5F52;font-weight:800;margin-bottom:2px;}
  .fi-item strong{font-size:0.92rem;color:#1A1410;}
  table{width:100%;border-collapse:collapse;margin-bottom:20px;}
  thead tr{background:${c};color:#fff;}
  thead th{padding:10px 14px;text-align:left;font-size:0.82rem;font-weight:700;}
  thead th:last-child{text-align:right;}
  tbody td{padding:10px 14px;border-bottom:1px solid #F0E4D0;font-size:0.9rem;}
  tbody td:last-child{text-align:right;font-weight:700;}
  tbody tr:nth-child(even) td{background:#FDF8F0;}
  .fact-totaux{display:flex;justify-content:flex-end;}
  .totaux-table{width:280px;}
  .tt-row{display:flex;justify-content:space-between;padding:6px 0;font-size:0.9rem;border-bottom:1px solid #F0E4D0;}
  .tt-total{font-size:1.1rem;font-weight:900;color:${c};border-top:2.5px solid ${c};border-bottom:none;padding-top:10px;margin-top:4px;}
  .fact-note{margin-top:24px;padding:16px;background:#F7F0E2;border-radius:10px;font-size:0.88rem;color:#6B5F52;line-height:1.6;}
  .fact-footer{margin-top:28px;padding-top:14px;border-top:2px solid #F0E4D0;display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;color:#9B8B6E;}
  .fact-footer strong{color:${c};}
  @media print{body{padding:0;}.fact-doc{border:none;border-radius:0;}}
</style></head><body>
<div class="fact-doc">
  <div class="fact-top">
    <div class="fact-top-row">
      <div>
        ${data.logo?`<img src="${data.logo}" class="fact-logo" alt="Logo"/>`:
          `<div style="font-size:1.4rem;font-weight:900;opacity:0.9">${data.entreprise||'Mon Entreprise'}</div>`}
        <div style="font-size:0.88rem;margin-top:8px;opacity:0.75">${data.adresse||''}</div>
        <div style="font-size:0.88rem;opacity:0.75">${data.email||''} ${data.tel?'· '+data.tel:''}</div>
      </div>
      <div style="text-align:right">
        <div class="fact-title">FACTURE</div>
        <div class="fact-numero">${data.numero||'—'}</div>
        <div class="fact-status">${statusLabel[data.statut]||'BROUILLON'}</div>
      </div>
    </div>
  </div>
  <div class="fact-body">
    <div class="fact-parties">
      <div class="fact-partie">
        <h3>De</h3>
        <p><strong>${data.entreprise||'—'}</strong><br/>${data.adresse||''}<br/>${data.email||''}<br/>${data.tel||''}</p>
      </div>
      <div class="fact-partie">
        <h3>Facturer à</h3>
        <p><strong>${data.clientNom||'—'}</strong><br/>${data.clientAdresse||''}<br/>${data.clientEmail||''}<br/>${data.clientTel||''}</p>
      </div>
    </div>
    <div class="fact-info-bar">
      <div class="fi-item"><span>Date</span><strong>${fmtDate(data.date)}</strong></div>
      <div class="fi-item"><span>Échéance</span><strong>${fmtDate(data.echeance)}</strong></div>
      <div class="fi-item"><span>N° Facture</span><strong>${data.numero||'—'}</strong></div>
      <div class="fi-item"><span>Total</span><strong style="color:${c}">${fmt(data.total,cur)}</strong></div>
    </div>
    <table>
      <thead><tr><th>Description</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead>
      <tbody>${(data.lignes||[]).map(l=>`<tr>
        <td>${l.desc||'—'}</td>
        <td>${l.qty}</td>
        <td>${fmt(l.prix,cur)}</td>
        <td>${fmt(l.total,cur)}</td>
      </tr>`).join('')}</tbody>
    </table>
    <div class="fact-totaux">
      <div class="totaux-table">
        <div class="tt-row"><span>Sous-total</span><span>${fmt(data.sousTotal,cur)}</span></div>
        ${data.remise?`<div class="tt-row"><span>Remise (${data.remise}%)</span><span>-${fmt(data.remiseMt,cur)}</span></div>`:''}
        ${data.tva?`<div class="tt-row"><span>TVA (${data.tva}%)</span><span>+${fmt(data.tvaMt,cur)}</span></div>`:''}
        <div class="tt-row tt-total"><span>TOTAL À PAYER</span><span>${fmt(data.total,cur)}</span></div>
      </div>
    </div>
    ${data.note?`<div class="fact-note">📝 ${data.note}</div>`:''}
    <div class="fact-footer">
      <span>Merci pour votre confiance !</span>
      <strong>${data.entreprise||'BudgetSmart'}</strong>
    </div>
  </div>
</div>
${forPrint?'<script>window.onload=()=>setTimeout(()=>window.print(),600);<\/script>':''}
</body></html>`;
}

function factShare(method) {
  const data = factBuildData();
  factSave();
  const msg = `Bonjour,

Veuillez trouver ci-joint la facture ${data.numero||''} d'un montant de ${fmt(data.total,data.cur||'€')} en date du ${new Date(data.date).toLocaleDateString('fr-FR')}.

Merci pour votre confiance !
${data.entreprise||''}`;
  if (method==='wa') {
    window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
    toast('💬 Ouvrez WhatsApp, collez le message et joignez le PDF téléchargé.');
    generateFacturePDF(data);
  } else {
    window.open(`mailto:${data.clientEmail||''}?subject=Facture ${data.numero||''}&body=${encodeURIComponent(msg)}`,'_blank');
    generateFacturePDF(data);
  }
}

function renderFacturesList() {
  const factures = ls('factures',[]);
  const search   = document.getElementById('factSearch')?.value.toLowerCase()||'';
  const filter   = document.getElementById('factFilter')?.value||'all';
  const lst      = document.getElementById('facturesList'); if(!lst) return;
  let filtered = factures.filter(f => {
    const matchSearch = !search || (f.clientNom||'').toLowerCase().includes(search) || (f.numero||'').toLowerCase().includes(search);
    const matchFilter = filter==='all' || f.statut===filter;
    return matchSearch && matchFilter;
  }).reverse();
  if (!filtered.length) { lst.innerHTML='<div class="empty">Aucune facture trouvée.</div>'; return; }
  const statusColor={'brouillon':'#6B5F52','envoyee':'#2E7DD6','payee':'#1F9D6B'};
  const statusLabel={'brouillon':'Brouillon','envoyee':'Envoyée','payee':'Payée'};
  lst.innerHTML = filtered.map(f => `
    <div class="fact-list-item" style="border-left:4px solid ${f.couleur||'#E8631C'}">
      <div class="fli-main">
        <div class="fli-numero">${f.numero||'—'}</div>
        <div class="fli-client">${f.clientNom||'—'}</div>
        <div class="fli-date">${f.date?new Date(f.date).toLocaleDateString('fr-FR'):''}</div>
      </div>
      <div class="fli-right">
        <div class="fli-total" style="color:${f.couleur||'#E8631C'}">${fmt(f.total||0,f.cur||'€')}</div>
        <span class="fli-status" style="color:${statusColor[f.statut]||'#6B5F52'}">${statusLabel[f.statut]||'—'}</span>
        <div class="fli-actions">
          <button class="btn-out fli-edit" data-id="${f.id}" style="padding:7px 12px;font-size:0.86rem">✏️ Modifier</button>
          <button class="btn-out fli-pdf" data-id="${f.id}" style="padding:7px 12px;font-size:0.86rem">📥 PDF</button>
          <button class="tx-del fli-del" data-id="${f.id}">✕</button>
        </div>
      </div>
    </div>`).join('');

  lst.querySelectorAll('.fli-edit').forEach(btn => btn.addEventListener('click', () => factEdit(+btn.dataset.id)));
  lst.querySelectorAll('.fli-pdf').forEach(btn => btn.addEventListener('click', () => {
    const f = ls('factures',[]).find(x=>x.id===+btn.dataset.id); if(f) generateFacturePDF(f);
  }));
  lst.querySelectorAll('.fli-del').forEach(btn => btn.addEventListener('click', () => {
    if(!confirm('Supprimer cette facture ?')) return;
    sv('factures', ls('factures',[]).filter(f=>f.id!==+btn.dataset.id));
    renderFacturesList(); toast('Facture supprimée.');
  }));
}

function factEdit(id) {
  const f = ls('factures',[]).find(x=>x.id===id); if(!f) return;
  currentFacture = f;
  factGo('creer');
  // Fill form
  const set = (elId, val) => { const el=document.getElementById(elId); if(el) el.value=val||''; };
  set('fNumero',f.numero); set('fDate',f.date); set('fEcheance',f.echeance);
  set('fDevise',f.devise); set('fCouleur',f.couleur); set('fStatut',f.statut);
  set('fEntreprise',f.entreprise); set('fAdresse',f.adresse); set('fEmail',f.email); set('fTel',f.tel);
  set('fClientNom',f.clientNom); set('fClientAdresse',f.clientAdresse); set('fClientEmail',f.clientEmail); set('fClientTel',f.clientTel);
  set('fNote',f.note); set('fRemise',f.remise||0); set('fTVA',f.tva||0);
  if(f.logo){factLogoData=f.logo;const img=document.getElementById('fLogoPreview');if(img){img.src=f.logo;img.style.display='block';}}
  // Color swatch
  document.querySelectorAll('.fc-swatch').forEach(s=>s.classList.toggle('active',s.dataset.color===f.couleur));
  // Lines
  document.getElementById('factLignes').innerHTML='';
  (f.lignes||[{desc:'',qty:1,prix:0}]).forEach(l=>{
    factAddLigne();
    const lines=document.querySelectorAll('.fact-ligne');
    const last=lines[lines.length-1];
    if(last){last.querySelector('.fl-desc').value=l.desc||'';last.querySelector('.fl-qty').value=l.qty||1;last.querySelector('.fl-prix').value=l.prix||0;last.querySelector('.fl-total').textContent=fmt(l.total||0).replace(' €','');}
  });
  factCalcTotaux();
}

/* ── IMPORT PDF ── */
async function handlePDFUpload(e) {
  const file = e.target.files[0]; if(!file) return;
  const extracted = document.getElementById('pdfExtracted');
  if(extracted) extracted.style.display='none';
  toast('📄 Lecture du PDF en cours…');
  try {
    // Read as ArrayBuffer for text extraction
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const text = extractTextFromPDF(uint8);
    if(extracted) extracted.style.display='block';
    // Fill extracted fields
    const titre = document.getElementById('pdfTitre');
    const notes = document.getElementById('pdfNotes');
    const date  = document.getElementById('pdfDate');
    const montant=document.getElementById('pdfMontant');
    if(titre)  titre.value  = file.name.replace('.pdf','').replace(/_/g,' ');
    if(notes)  notes.value  = text.slice(0,1000);
    if(date)   date.value   = new Date().toISOString().slice(0,10);
    // Try to find a total amount in the text
    const matches = text.match(/(\d{1,6}[.,]\d{2})\s*€?/g);
    if(matches&&montant) montant.value = parseFloat(matches[matches.length-1].replace(',','.'))||0;
    toast('✅ PDF lu ! Vérifiez et modifiez les champs ci-dessous.');
  } catch(err) {
    toast('PDF lu — remplissez les champs manuellement.');
    const extracted=document.getElementById('pdfExtracted');
    if(extracted) extracted.style.display='block';
  }
}

function extractTextFromPDF(uint8) {
  try {
    const str = new TextDecoder('latin1').decode(uint8);
    const results = [];
    let i = 0;
    while (i < str.length) {
      if (str[i] === '(') {
        let j = i + 1;
        let word = '';
        while (j < str.length && str[j] !== ')' && j - i < 100) {
          word += str[j]; j++;
        }
        if (word.length > 3 && /[a-zA-ZÀ-ÿ0-9€]/.test(word)) {
          results.push(word.replace(/\n/g, ' ').trim());
        }
        i = j + 1;
      } else { i++; }
    }
    return results.join(' ') || 'Vérifiez et complétez manuellement.';
  } catch(e) {
    return 'Contenu extrait — vérifiez et complétez manuellement.';
  }
}

function pdfRecreate() {
  const titre   = document.getElementById('pdfTitre')?.value||'Facture';
  const client  = document.getElementById('pdfClient')?.value||'—';
  const montant = parseFloat(document.getElementById('pdfMontant')?.value)||0;
  const date    = document.getElementById('pdfDate')?.value||new Date().toISOString().slice(0,10);
  const notes   = document.getElementById('pdfNotes')?.value||'';
  const logo    = localStorage.getItem('bs_pdf_logo')||null;
  const p       = ls('profile',{}), cur=p.currency||'€';
  const saved   = ls('factCompany',{});

  const data = {
    id: Date.now(), numero:'IMP-'+Date.now().toString().slice(-4),
    date, echeance:'', devise:cur, cur, couleur:'#1E5A9C',
    statut:'brouillon', logo,
    entreprise: saved.entreprise||p.name||'Mon Entreprise',
    adresse:saved.adresse||'', email:saved.email||p.email||'', tel:saved.tel||'',
    clientNom:client, clientAdresse:'', clientEmail:'', clientTel:'',
    note:notes,
    lignes:[{desc:titre,qty:1,prix:montant,total:montant}],
    remise:0,tva:0,sousTotal:montant,remiseMt:0,tvaMt:0,total:montant
  };
  generateFacturePDF(data);
}

function pdfShare(method) {
  const client  = document.getElementById('pdfClient')?.value||'';
  const montant = document.getElementById('pdfMontant')?.value||'0';
  const saved   = ls('factCompany',{});
  const msg = `Bonjour,

Veuillez trouver ci-joint la facture d'un montant de ${montant} €.

Merci pour votre confiance !
${saved.entreprise||''}`;
  pdfRecreate();
  if(method==='wa') window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');
  else window.open('mailto:'+client+'?subject=Facture&body='+encodeURIComponent(msg),'_blank');
}


/* ══ MODÈLES DE FACTURES ══ */
const FACT_TEMPLATES = {
  moderne: {
    nom:'Moderne Orange', couleur:'#E8631C', accent:'#FF8C42',
    bg:'#FFF7F0', headerStyle:'gradient',
    build: (data) => buildModerne(data)
  },
  corporate: {
    nom:'Corporate Bleu', couleur:'#1E3A5F', accent:'#2E5A8E',
    bg:'#F0F4F8', headerStyle:'solid',
    build: (data) => buildCorporate(data)
  },
  elegant: {
    nom:'Élégant Violet', couleur:'#2C1654', accent:'#4A2480',
    bg:'#F8F5FF', headerStyle:'split',
    build: (data) => buildElegant(data)
  },
  nature: {
    nom:'Nature Vert', couleur:'#1F9D6B', accent:'#2ECC8E',
    bg:'#F0FBF6', headerStyle:'wave',
    build: (data) => buildNature(data)
  },
  gold: {
    nom:'Premium Or', couleur:'#1A1410', accent:'#D98C12',
    bg:'#FDFAF0', headerStyle:'dark',
    build: (data) => buildGold(data)
  },
  minimal: {
    nom:'Minimaliste', couleur:'#1A1410', accent:'#E8631C',
    bg:'#FFFFFF', headerStyle:'minimal',
    build: (data) => buildMinimal(data)
  },
  simple: {
    nom:'Simple sans design', couleur:'#333333', accent:'#333333',
    bg:'#FFFFFF', headerStyle:'simple',
    build: (data) => buildSimple(data)
  },
  afrique: {
    nom:'Afrique Business', couleur:'#C8390A', accent:'#F0AB35',
    bg:'#FFF5F0', headerStyle:'afrique',
    build: (data) => buildAfrique(data)
  },
};

let currentTemplate = 'moderne';

function initTemplateSelector() {
  const b = (id,fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click',fn); };

  document.querySelectorAll('.tpl-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.tpl-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentTemplate = card.dataset.tpl;
    });
  });

  b('btnSelectTemplate', () => {
    applyTemplate(currentTemplate);
    document.getElementById('templateSelector').style.display='none';
    document.getElementById('factFormCard').style.display='block';
    factNew();
  });

  b('btnSkipTemplate', () => {
    currentTemplate = 'moderne';
    document.getElementById('templateSelector').style.display='none';
    document.getElementById('factFormCard').style.display='block';
    factNew();
  });

  b('btnChangeTemplate', () => {
    document.getElementById('templateSelector').style.display='block';
    document.getElementById('factFormCard').style.display='none';
    document.getElementById('factPreviewContainer').style.display='none';
  });
}

function applyTemplate(tplKey) {
  const tpl = FACT_TEMPLATES[tplKey]; if(!tpl) return;
  const couleur = document.getElementById('fCouleur');
  if (couleur) couleur.value = tpl.couleur;
  document.querySelectorAll('.fc-swatch').forEach(s => s.classList.toggle('active', s.dataset.color===tpl.couleur));
  toast('Modèle "'+tpl.nom+'" appliqué !');
}

/* ══ BUILDERS DE MODÈLES ══ */
function factBaseStyle(bg, c, accent) {
  return `*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1A1410;background:${bg};padding:0;max-width:820px;margin:0 auto;font-size:14px;}
table{width:100%;border-collapse:collapse;}
@media print{body{background:#fff;}}`;
}

function buildModerne(data) {
  const c=data.couleur||'#E8631C', cur=data.cur||data.devise||'€';
  const fmtDate=d=>{if(!d)return'—';const dt=new Date(d);return dt.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Facture ${data.numero}</title>
<style>
  ${factBaseStyle('#FFF7F0',c,'#FF8C42')}
  .wrap{background:#fff;min-height:100vh;}
  .top{background:linear-gradient(135deg,${c},${c}DD);padding:36px 40px;color:#fff;display:flex;justify-content:space-between;align-items:flex-start;}
  .top-left{}
  .logo-img{max-height:55px;max-width:150px;filter:brightness(0) invert(1);margin-bottom:12px;}
  .co-name{font-size:1.4rem;font-weight:800;}
  .co-info{font-size:0.84rem;opacity:0.8;margin-top:6px;line-height:1.6;}
  .top-right{text-align:right;}
  .fact-label{font-size:2.5rem;font-weight:900;letter-spacing:-0.02em;}
  .fact-num{font-size:0.92rem;opacity:0.85;margin-top:4px;}
  .fact-status-badge{display:inline-block;background:rgba(255,255,255,0.25);padding:4px 14px;border-radius:20px;font-size:0.76rem;font-weight:800;text-transform:uppercase;margin-top:8px;border:1.5px solid rgba(255,255,255,0.4);}
  .body{padding:34px 40px;}
  .info-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:0;background:${c}15;border-radius:12px;overflow:hidden;margin-bottom:28px;}
  .info-cell{padding:14px 16px;border-right:1px solid ${c}25;}
  .info-cell:last-child{border-right:none;}
  .ic-label{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.08em;color:${c};font-weight:800;margin-bottom:4px;}
  .ic-val{font-size:0.92rem;font-weight:700;color:#1A1410;}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px;}
  .partie h4{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:${c};font-weight:800;margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid ${c};}
  .partie p{font-size:0.9rem;line-height:1.65;color:#2E2620;}
  thead tr{background:${c};color:#fff;}
  thead th{padding:11px 14px;font-size:0.82rem;font-weight:700;text-align:left;}
  thead th:last-child{text-align:right;}
  tbody td{padding:10px 14px;border-bottom:1px solid #F5E8DC;font-size:0.9rem;color:#2E2620;}
  tbody td:last-child{text-align:right;font-weight:700;color:${c};}
  tbody tr:last-child td{border-bottom:none;}
  tbody tr:nth-child(even) td{background:#FDF5EE;}
  .totaux{display:flex;justify-content:flex-end;margin-top:20px;}
  .tot-box{width:280px;background:${c}08;border-radius:10px;padding:16px;}
  .tt{display:flex;justify-content:space-between;padding:7px 0;font-size:0.9rem;border-bottom:1px solid ${c}15;}
  .tt:last-child{border-bottom:none;font-size:1.1rem;font-weight:900;color:${c};padding-top:12px;margin-top:4px;border-top:2px solid ${c};}
  .note{margin-top:24px;padding:14px 18px;background:${c}08;border-left:4px solid ${c};border-radius:0 8px 8px 0;font-size:0.88rem;color:#6B5F52;line-height:1.6;}
  .footer{margin-top:28px;padding-top:14px;border-top:1px solid #F5E8DC;display:flex;justify-content:space-between;font-size:0.8rem;color:#9B8B6E;}
  .footer strong{color:${c};}
</style></head><body><div class="wrap">
<div class="top">
  <div class="top-left">
    ${data.logo?`<img src="${data.logo}" class="logo-img"/>`:
    `<div class="co-name">${data.entreprise||'Mon Entreprise'}</div>`}
    <div class="co-info">${data.adresse||''}<br/>${data.email||''} ${data.tel?'· '+data.tel:''}</div>
  </div>
  <div class="top-right">
    <div class="fact-label">FACTURE</div>
    <div class="fact-num">${data.numero||'—'}</div>
    <div class="fact-status-badge">${{brouillon:'BROUILLON',envoyee:'ENVOYÉE',payee:'✓ PAYÉE'}[data.statut]||'BROUILLON'}</div>
  </div>
</div>
<div class="body">
  <div class="info-strip">
    <div class="info-cell"><div class="ic-label">Date</div><div class="ic-val">${fmtDate(data.date)}</div></div>
    <div class="info-cell"><div class="ic-label">Échéance</div><div class="ic-val">${fmtDate(data.echeance)}</div></div>
    <div class="info-cell"><div class="ic-label">Facturé à</div><div class="ic-val">${data.clientNom||'—'}</div></div>
    <div class="info-cell"><div class="ic-label">Total</div><div class="ic-val" style="color:${c};font-size:1rem;font-weight:900">${fmt(data.total,cur)}</div></div>
  </div>
  <div class="parties">
    <div class="partie"><h4>Émetteur</h4><p><strong>${data.entreprise||'—'}</strong><br/>${data.adresse||''}<br/>${data.email||''}<br/>${data.tel||''}</p></div>
    <div class="partie"><h4>Client</h4><p><strong>${data.clientNom||'—'}</strong><br/>${data.clientAdresse||''}<br/>${data.clientEmail||''}<br/>${data.clientTel||''}</p></div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr></thead>
    <tbody>${(data.lignes||[]).map(l=>`<tr><td>${l.desc||'—'}</td><td>${l.qty}</td><td>${fmt(l.prix,cur)}</td><td>${fmt(l.total,cur)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totaux"><div class="tot-box">
    <div class="tt"><span>Sous-total</span><span>${fmt(data.sousTotal,cur)}</span></div>
    ${data.remise?`<div class="tt"><span>Remise (${data.remise}%)</span><span>-${fmt(data.remiseMt,cur)}</span></div>`:''}
    ${data.tva?`<div class="tt"><span>TVA (${data.tva}%)</span><span>+${fmt(data.tvaMt,cur)}</span></div>`:''}
    <div class="tt"><span>TOTAL</span><span>${fmt(data.total,cur)}</span></div>
  </div></div>
  ${data.note?`<div class="note">📝 ${data.note}</div>`:''}
  <div class="footer"><span>Merci pour votre confiance !</span><strong>${data.entreprise||''}</strong></div>
</div></div></body></html>`;
}

function buildCorporate(data) {
  const c='#1E3A5F', cur=data.cur||data.devise||'€';
  const fmtDate=d=>{if(!d)return'—';return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'});};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Facture ${data.numero}</title>
<style>
  ${factBaseStyle('#F0F4F8',c,'#2E5A8E')}
  .wrap{background:#fff;}
  .top{background:${c};color:#fff;padding:0;}
  .top-main{padding:30px 40px;display:flex;justify-content:space-between;align-items:center;}
  .logo-img{max-height:50px;filter:brightness(0) invert(1);}
  .co-name-top{font-size:1.3rem;font-weight:800;color:#fff;}
  .fact-ref{text-align:right;}
  .fact-ref-label{font-size:2rem;font-weight:900;letter-spacing:0.05em;}
  .fact-ref-num{font-size:0.9rem;opacity:0.7;margin-top:3px;}
  .blue-bar{height:6px;background:linear-gradient(90deg,#D98C12,#F0AB35);}
  .body{padding:32px 40px;}
  .meta-row{display:flex;gap:24px;margin-bottom:28px;padding:16px 20px;background:#F0F4F8;border-radius:8px;}
  .meta-item{flex:1;}
  .meta-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.08em;color:#6B8AAA;font-weight:800;margin-bottom:4px;}
  .meta-val{font-size:0.92rem;font-weight:700;color:${c};}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:28px;}
  .partie-label{font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#6B8AAA;font-weight:800;margin-bottom:8px;}
  .partie p{font-size:0.9rem;line-height:1.7;color:#2E2620;}
  .partie p strong{color:${c};}
  thead tr{background:${c};color:#fff;}
  thead th{padding:12px 14px;font-size:0.82rem;font-weight:700;text-align:left;}
  thead th:last-child{text-align:right;}
  tbody td{padding:10px 14px;border-bottom:1px solid #E8EEF4;font-size:0.9rem;}
  tbody td:last-child{text-align:right;font-weight:700;color:${c};}
  tbody tr:nth-child(even) td{background:#F7FAFC;}
  .totaux{display:flex;justify-content:flex-end;margin-top:20px;}
  .tot-box{width:260px;}
  .tt{display:flex;justify-content:space-between;padding:8px 0;font-size:0.9rem;border-bottom:1px solid #E8EEF4;color:#2E2620;}
  .tt-final{font-size:1.1rem;font-weight:900;color:#fff;background:${c};padding:12px 16px;border-radius:8px;margin-top:8px;}
  .note{margin-top:22px;padding:14px;background:#F0F4F8;border-radius:8px;font-size:0.88rem;color:#6B8AAA;line-height:1.6;}
  .footer{margin-top:24px;text-align:center;font-size:0.8rem;color:#9BB0C4;padding-top:14px;border-top:1px solid #E8EEF4;}
</style></head><body><div class="wrap">
<div class="top">
  <div class="top-main">
    <div>${data.logo?`<img src="${data.logo}" class="logo-img"/>`:
    `<div class="co-name-top">${data.entreprise||'Entreprise'}</div>`}
    <div style="font-size:0.82rem;color:rgba(255,255,255,0.6);margin-top:6px">${data.adresse||''}</div></div>
    <div class="fact-ref">
      <div class="fact-ref-label">FACTURE</div>
      <div class="fact-ref-num">N° ${data.numero||'—'}</div>
      <div style="margin-top:8px;background:#D98C12;color:#fff;padding:3px 12px;border-radius:4px;font-size:0.76rem;font-weight:800;display:inline-block">${{brouillon:'BROUILLON',envoyee:'ENVOYÉE',payee:'PAYÉE'}[data.statut]||''}</div>
    </div>
  </div>
  <div class="blue-bar"></div>
</div>
<div class="body">
  <div class="meta-row">
    <div class="meta-item"><div class="meta-label">Date d'émission</div><div class="meta-val">${fmtDate(data.date)}</div></div>
    <div class="meta-item"><div class="meta-label">Date d'échéance</div><div class="meta-val">${fmtDate(data.echeance)}</div></div>
    <div class="meta-item"><div class="meta-label">Contact</div><div class="meta-val">${data.email||'—'}</div></div>
    <div class="meta-item"><div class="meta-label">Montant total</div><div class="meta-val" style="font-size:1.1rem;color:#D98C12">${fmt(data.total,cur)}</div></div>
  </div>
  <div class="parties">
    <div><div class="partie-label">De</div><p><strong>${data.entreprise||'—'}</strong><br/>${data.adresse||''}<br/>${data.email||''}<br/>${data.tel||''}</p></div>
    <div><div class="partie-label">Facturé à</div><p><strong>${data.clientNom||'—'}</strong><br/>${data.clientAdresse||''}<br/>${data.clientEmail||''}<br/>${data.clientTel||''}</p></div>
  </div>
  <table>
    <thead><tr><th>Description</th><th>Qté</th><th>Prix unit.</th><th>Total HT</th></tr></thead>
    <tbody>${(data.lignes||[]).map(l=>`<tr><td>${l.desc||'—'}</td><td>${l.qty}</td><td>${fmt(l.prix,cur)}</td><td>${fmt(l.total,cur)}</td></tr>`).join('')}</tbody>
  </table>
  <div class="totaux"><div class="tot-box">
    <div class="tt"><span>Sous-total HT</span><span>${fmt(data.sousTotal,cur)}</span></div>
    ${data.remise?`<div class="tt"><span>Remise (${data.remise}%)</span><span>-${fmt(data.remiseMt,cur)}</span></div>`:''}
    ${data.tva?`<div class="tt"><span>TVA (${data.tva}%)</span><span>+${fmt(data.tvaMt,cur)}</span></div>`:''}
    <div class="tt-final"><span>TOTAL À PAYER</span><span style="float:right">${fmt(data.total,cur)}</span></div>
  </div></div>
  ${data.note?`<div class="note">Conditions : ${data.note}</div>`:''}
  <div class="footer">${data.entreprise||''} · ${data.adresse||''} · ${data.email||''}</div>
</div></div></body></html>`;
}

function buildSimple(data) {
  const cur=data.cur||data.devise||'€';
  const fmtDate=d=>{if(!d)return'—';return new Date(d).toLocaleDateString('fr-FR');};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Facture ${data.numero}</title>
<style>
  body{font-family:'Courier New',monospace;color:#000;background:#fff;padding:30px;max-width:720px;margin:0 auto;font-size:13px;}
  h1{font-size:1.6rem;text-align:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:20px;}
  .row{display:flex;justify-content:space-between;margin-bottom:4px;}
  .sep{border-top:1px solid #999;margin:14px 0;}
  .sep2{border-top:2px solid #000;margin:14px 0;}
  table{width:100%;border-collapse:collapse;margin:14px 0;}
  th,td{border:1px solid #000;padding:7px 10px;text-align:left;font-size:12px;}
  th{background:#000;color:#fff;}
  td:last-child{text-align:right;}
  .total-line{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;}
  .total-final{font-size:1.1rem;font-weight:bold;border-top:2px solid #000;padding-top:8px;margin-top:4px;}
  @media print{body{padding:10px;}}
</style></head><body>
<h1>FACTURE</h1>
<div class="row"><span><strong>De :</strong> ${data.entreprise||'—'}</span><span><strong>N° :</strong> ${data.numero||'—'}</span></div>
<div class="row"><span>${data.adresse||''}</span><span><strong>Date :</strong> ${fmtDate(data.date)}</span></div>
<div class="row"><span>${data.email||''} ${data.tel?'· '+data.tel:''}</span><span><strong>Échéance :</strong> ${fmtDate(data.echeance)}</span></div>
<div class="sep"></div>
<div class="row"><span><strong>Facturé à :</strong> ${data.clientNom||'—'}</span></div>
<div class="row"><span>${data.clientAdresse||''}</span></div>
<div class="row"><span>${data.clientEmail||''} ${data.clientTel?'· '+data.clientTel:''}</span></div>
<div class="sep2"></div>
<table>
  <thead><tr><th>Description</th><th>Qté</th><th>Prix unit.</th><th>Total</th></tr></thead>
  <tbody>${(data.lignes||[]).map(l=>`<tr><td>${l.desc||'—'}</td><td>${l.qty}</td><td>${fmt(l.prix,cur)}</td><td>${fmt(l.total,cur)}</td></tr>`).join('')}</tbody>
</table>
<div class="sep"></div>
<div class="total-line"><span>Sous-total</span><span>${fmt(data.sousTotal,cur)}</span></div>
${data.remise?`<div class="total-line"><span>Remise (${data.remise}%)</span><span>-${fmt(data.remiseMt,cur)}</span></div>`:''}
${data.tva?`<div class="total-line"><span>TVA (${data.tva}%)</span><span>+${fmt(data.tvaMt,cur)}</span></div>`:''}
<div class="total-line total-final"><span>TOTAL À PAYER</span><span>${fmt(data.total,cur)}</span></div>
${data.note?`<div class="sep"></div><div>Note : ${data.note}</div>`:''}
</body></html>`;
}

function buildMinimal(data) {
  const c=data.couleur||'#1A1410', cur=data.cur||data.devise||'€';
  const fmtDate=d=>{if(!d)return'—';return new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});};
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"/><title>Facture ${data.numero}</title>
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1A1410;background:#fff;padding:50px;max-width:780px;margin:0 auto;font-size:13px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:60px;}
  .logo-img{max-height:45px;max-width:140px;}
  .co-name{font-size:1.2rem;font-weight:700;color:#1A1410;}
  .co-info{font-size:0.82rem;color:#888;margin-top:4px;line-height:1.6;}
  .fact-title{font-size:2.8rem;font-weight:200;letter-spacing:-0.02em;color:#1A1410;text-align:right;}
  .fact-num{font-size:0.88rem;color:#999;text-align:right;margin-top:4px;}
  .line{height:1px;background:#E0D0C0;margin:30px 0;}
  .parties{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:40px;}
  .partie-label{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.12em;color:#999;margin-bottom:8px;}
  .partie p{font-size:0.9rem;line-height:1.7;color:#2E2620;}
  .dates{display:flex;gap:40px;margin-bottom:40px;}
  .date-item{}
  .date-label{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:4px;}
  .date-val{font-size:0.92rem;font-weight:600;}
  table{width:100%;border-collapse:collapse;margin-bottom:30px;}
  th{font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#999;padding:10px 0;text-align:left;border-bottom:1px solid #E0D0C0;font-weight:400;}
  th:last-child{text-align:right;}
  td{padding:12px 0;font-size:0.9rem;border-bottom:1px solid #F0E8DC;color:#2E2620;}
  td:last-child{text-align:right;font-weight:600;}
  .totaux{display:flex;justify-content:flex-end;}
  .tot-box{width:220px;}
  .tt{display:flex;justify-content:space-between;padding:7px 0;font-size:0.88rem;color:#888;}
  .tt-final{display:flex;justify-content:space-between;padding:14px 0 0;font-size:1.1rem;font-weight:700;color:#1A1410;border-top:2px solid #1A1410;margin-top:8px;}
  .note{margin-top:40px;font-size:0.84rem;color:#999;line-height:1.7;border-top:1px solid #F0E8DC;padding-top:20px;}
</style></head><body>
<div class="header">
  <div>${data.logo?`<img src="${data.logo}" class="logo-img"/>`:
  `<div class="co-name">${data.entreprise||'Entreprise'}</div>`}
  <div class="co-info">${data.adresse||''}<br/>${data.email||''} ${data.tel?'· '+data.tel:''}</div></div>
  <div><div class="fact-title">Facture</div><div class="fact-num">${data.numero||'—'}</div></div>
</div>
<div class="line"></div>
<div class="parties">
  <div><div class="partie-label">Facturé à</div><p><strong>${data.clientNom||'—'}</strong><br/>${data.clientAdresse||''}<br/>${data.clientEmail||''}</p></div>
  <div class="dates">
    <div class="date-item"><div class="date-label">Date</div><div class="date-val">${fmtDate(data.date)}</div></div>
    <div class="date-item"><div class="date-label">Échéance</div><div class="date-val">${fmtDate(data.echeance)}</div></div>
  </div>
</div>
<table>
  <thead><tr><th>Description</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead>
  <tbody>${(data.lignes||[]).map(l=>`<tr><td>${l.desc||'—'}</td><td>${l.qty}</td><td>${fmt(l.prix,cur)}</td><td>${fmt(l.total,cur)}</td></tr>`).join('')}</tbody>
</table>
<div class="totaux"><div class="tot-box">
  ${data.remise?`<div class="tt"><span>Remise</span><span>-${fmt(data.remiseMt,cur)}</span></div>`:''}
  ${data.tva?`<div class="tt"><span>TVA</span><span>+${fmt(data.tvaMt,cur)}</span></div>`:''}
  <div class="tt-final"><span>Total</span><span>${fmt(data.total,cur)}</span></div>
</div></div>
${data.note?`<div class="note">${data.note}</div>`:''}
</body></html>`;
}

function buildGold(data) { data.couleur='#1A1410'; data.accent='#D98C12'; return buildModerne({...data,couleur:'#1A1410'}); }
function buildElegant(data) { return buildModerne({...data,couleur:'#2C1654'}); }
function buildNature(data)  { return buildModerne({...data,couleur:'#1F9D6B'}); }
function buildAfrique(data) { return buildModerne({...data,couleur:'#C8390A'}); }

/* ══ NAVIGATION ══ */
function initNav() {
  document.querySelectorAll('.ni').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); go(el.dataset.p); closeSidebar(); });
  });
  const sp = document.getElementById('sp');
  if (sp) sp.addEventListener('click', () => { go('profile'); closeSidebar(); });
  const sbUp = document.querySelector('.sb-up');
  if (sbUp) sbUp.addEventListener('click', e => { e.preventDefault(); go('pricing'); closeSidebar(); });
}

function go(page) {
  if (!page) return;
  document.querySelectorAll('.ni').forEach(i => i.classList.toggle('active', i.dataset.p === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === 'p-' + page));
  window.scrollTo(0, 0);
  if (page === 'admin') renderAdmin();
  if (page === 'dashboard') { renderDash(); initPWABanner(); }
  if (page === 'suivi')       { renderSuivi(); suiviInit(); }
  if (page === 'facturation') { renderFacturesList(); factGo('liste'); }
}

function initMobile() {
  const btn = document.getElementById('menuBtn');
  const sb  = document.getElementById('sidebar');
  const ov  = document.getElementById('ov');
  if (btn) btn.addEventListener('click', () => { sb.classList.toggle('open'); ov.classList.toggle('show'); });
  if (ov)  ov.addEventListener('click', closeSidebar);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('ov').classList.remove('show');
}

/* ══ TOUS LES BOUTONS ══ */
function initAllButtons() {
  const b = (id, fn) => { const el = document.getElementById(id); if (el) el.addEventListener('click', fn); };

  /* Dashboard */
  b('coCta',        () => go('coaching'));
  b('upsellBar',    () => go('pricing'));
  b('oPersonal',    () => go('goals'));
  b('oBusiness',    () => go('business'));
  b('oCouple',      () => go('couple'));
  b('btnSeeGoals',      () => go('goals'));
  b('btnSeeAllDefis',   () => go('defis'));
  b('btnSeeAllGoals',   () => go('goals'));
  b('btnSuiviAddGoal',  () => go('goals'));
  b('btnSuiviAddDefi',  () => go('defis'));
  b('btnSendMessage',   sendMessageToAll);

  /* PWA Banner */
  b('btnPWA',       pwaInstall);

  /* Coaching buttons */
  b('coBack', () => coStep(1));
  b('coCard', () => payCoaching('card'));
  b('coPP',   () => payCoaching('paypal'));
  b('btnPWAClose',  () => { const bn = document.getElementById('pwaBanner'); if (bn) bn.style.display = 'none'; });

  /* Daily */
  b('btnAddEntry',  addEntry);

  /* Goals */
  b('btnAddGoal',   addGoal);
  b('ugBusiness',   () => go('business'));
  b('ugCouple',     () => go('couple'));

  /* Tips */
  b('btnNewTip',    () => txt('tipText', TIPS[Math.floor(Math.random()*TIPS.length)].txt));

  /* Family */
  b('btnFamCard',   () => window.open(STRIPE_BUSI, '_blank'));
  b('btnFamPP',     () => window.open(PAYPAL, '_blank'));

  /* Pricing toggles */
  b('togEU', () => { pMode='eu'; document.getElementById('togEU').classList.add('active'); document.getElementById('togAF').classList.remove('active'); renderPricingMain(); });
  b('togAF', () => { pMode='af'; document.getElementById('togAF').classList.add('active'); document.getElementById('togEU').classList.remove('active'); renderPricingMain(); });

  /* Pricing payment */
  b('selCard', () => window.open(getStripeLink(document.getElementById('selName')?.textContent), '_blank'));
  b('selPP',   () => window.open(PAYPAL, '_blank'));

  /* Business project */
  b('pcBCard', () => window.open(getStripeLink('Business'), '_blank'));
  b('pcBPP',   () => window.open(PAYPAL, '_blank'));

  /* Couple project */
  b('pcCCard', () => window.open(getStripeLink('Business'), '_blank'));
  b('pcCPP',   () => window.open(PAYPAL, '_blank'));

  /* Modal */
  b('mCard',  () => { closeModal(); window.open(STRIPE, '_blank'); });
  b('mPP',    () => { closeModal(); window.open(PAYPAL, '_blank'); });
  b('mClose', closeModal);
  const modal = document.getElementById('modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  /* Profile */
  b('btnSaveProfile', saveProfile);
  b('btnExport',      exportData);
  b('btnClear',       clearData);
  b('btnAdmin',       adminLogin);

  /* Profile PWA install */
  b('btnLogout',      adminLogout);
  b('btnRefreshUsers', renderAdmin);

  // Admin search filter
  const adSearch = document.getElementById('adSearchUser');
  if (adSearch) adSearch.addEventListener('input', () => {
    const q = adSearch.value.toLowerCase();
    document.querySelectorAll('.admin-user-row').forEach(row => {
      const email = row.querySelector('.aur-email')?.textContent.toLowerCase()||'';
      const name  = row.querySelector('.aur-name')?.textContent.toLowerCase()||'';
      row.style.display = (email.includes(q)||name.includes(q)) ? 'flex' : 'none';
    });
  });

  /* Photo */
  const pi = document.getElementById('photoInput');
  if (pi) pi.addEventListener('change', handlePhoto);

  /* Share */
  const shareUrl = APP_URL;
  const shareMsg = encodeURIComponent('🌟 Découvrez BudgetSmart !\n\nL\'app qui vous aide à gérer votre budget et épargner intelligemment.\n\n✅ Dépenses quotidiennes\n✅ Objectifs d\'épargne\n✅ Défis d\'épargne\n✅ Coaching financier\n\n🎁 7 jours gratuits !\n\n👉 ' + APP_URL);
  b('btnCopyLink', () => navigator.clipboard.writeText(shareUrl).then(() => toast('Lien copié !')));
  b('btnCopyMsg',  () => { const box = document.getElementById('shareMsgBox'); if (box) navigator.clipboard.writeText(box.textContent.trim()).then(() => toast('Message copié !')); });
  b('shareWA',  () => window.open('https://wa.me/?text=' + shareMsg, '_blank'));
  b('shareFB',  () => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl), '_blank'));
  b('shareIG',  () => navigator.clipboard.writeText(shareUrl).then(() => toast('Lien copié ! Collez dans votre bio Instagram.')));
  b('shareTK',  () => navigator.clipboard.writeText(shareUrl).then(() => toast('Lien copié ! Collez dans votre bio TikTok.')));
  b('shareEM',  () => window.open('mailto:?subject=BudgetSmart&body=' + shareMsg, '_blank'));
  b('shareTW',  () => window.open('https://twitter.com/intent/tweet?text=' + shareMsg, '_blank'));

  /* Settings */
  b('setProfile',  () => go('profile'));
  b('setPricing',  () => go('pricing'));
  b('setCoaching', () => go('coaching'));
  b('setShare',    () => go('share'));
  b('setExport',   exportData);
  b('setClear',    clearData);
  b('setPWA',      pwaInstall);
  b('setNotif',    initNotif);
  b('setLogout',   doLogout);
  const notifT = document.getElementById('notifToggle');
  if (notifT) notifT.addEventListener('click', () => {
    notifT.classList.toggle('on');
    if (!notifT.classList.contains('on')) return;
    initNotif();
    toast('Notifications activées !');
  });

  /* Admin nav */
  document.querySelectorAll('.anb').forEach(btn => btn.addEventListener('click', () => go(btn.dataset.p)));
}

/* ══ UTILS ══ */
function ls(k, d) { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } }
function sv(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
function fmt(v, c) { c = c||'€'; return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+c; }
function txt(id, v) { const el = document.getElementById(id); if (el) el.textContent = v; }
function toast(msg) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.style.transform = 'translateY(0)'; t.style.opacity = '1';
  clearTimeout(t._t); t._t = setTimeout(() => { t.style.transform = 'translateY(80px)'; t.style.opacity = '0'; }, 3200);
}
function setDate() { const el = document.getElementById('phDate'); if (el) el.textContent = new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }
function setEntryDate() { const el = document.getElementById('eDate'); if (el) el.value = new Date().toISOString().slice(0,10); }
function getStripeLink(name) {
  if (!name) return STRIPE;
  if (name.toLowerCase().includes('basic'))    return STRIPE_BASIC;
  if (name.toLowerCase().includes('premium'))  return STRIPE_PREMIUM;
  if (name.toLowerCase().includes('business')) return STRIPE_BUSI;
  return STRIPE;
}

/* ══ DASHBOARD ══ */
function renderDash() {
  const entries = ls('entries', []);
  const now = new Date(), m = now.getMonth(), y = now.getFullYear();
  let inc=0, exp=0, sav=0; const cats={};
  entries.forEach(e => {
    const d = new Date(e.date);
    if (d.getMonth()===m && d.getFullYear()===y) {
      inc += e.inc||0; exp += e.exp||0; sav += e.sav||0;
      cats[e.cat] = (cats[e.cat]||0) + (e.exp||0);
    }
  });
  const p = ls('profile', {}), cur = p.currency||'€';
  txt('kBal', fmt(inc-exp, cur));
  txt('kInc', fmt(inc, cur));
  txt('kExp', fmt(exp, cur));
  txt('kSav', fmt(sav, cur));
  const ab = document.getElementById('alertBox');
  if (ab) { if (inc>0 && exp/inc>0.8) { ab.style.display='block'; txt('alertMsg','⚠ Vos dépenses représentent '+Math.round(exp/inc*100)+'% de vos revenus !'); } else ab.style.display='none'; }
  const goals = ls('goals', []);
  txt('oPersonalVal', fmt(goals.reduce((s,g)=>s+(g.sav||0),0), cur));
  drawDonut(cats, cur);
  drawBar(entries, cur);
  renderRecentTx(entries.slice(-5).reverse(), cur);
  renderActiveDefis();
  renderGoalEvo(cur);
  txt('dashTip', TIPS[Math.floor(Math.random()*TIPS.length)].txt);
}

/* ══ CHARTS ══ */
function drawDonut(cats, cur) {
  const cv = document.getElementById('donut'); if (!cv) return;
  const ctx = cv.getContext('2d'), cx=90,cy=90,R=75,r=48;
  ctx.clearRect(0,0,180,180);
  const ents = Object.entries(cats).filter(([,v])=>v>0);
  const tot = ents.reduce((s,[,v])=>s+v,0);
  const leg = document.getElementById('donutLeg'); if (leg) leg.innerHTML='';
  if (!tot) { ctx.strokeStyle='#D4D0C8';ctx.lineWidth=27;ctx.beginPath();ctx.arc(cx,cy,62,0,Math.PI*2);ctx.stroke();return; }
  let ang=-Math.PI/2;
  ents.forEach(([cat,val],i) => {
    const sl=(val/tot)*Math.PI*2,col=COLORS[i%COLORS.length];
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,ang,ang+sl);ctx.closePath();ctx.fillStyle=col;ctx.fill();ang+=sl;
    if (leg) { const d=document.createElement('div');d.className='dl';d.innerHTML='<div class="dd" style="background:'+col+'"></div><span style="flex:1">'+(CATS[cat]||'')+' '+cat+'</span><span style="font-weight:800">'+fmt(val,cur)+'</span>';leg.appendChild(d); }
  });
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  ctx.fillStyle='#0D1117';ctx.font='bold 10px DM Sans,sans-serif';ctx.textAlign='center';ctx.fillText(fmt(tot,cur).split(' ')[0],cx,cy-1);
  ctx.fillStyle='#6B7280';ctx.font='9px DM Sans,sans-serif';ctx.fillText('total',cx,cy+11);
}

function drawBar(all, cur) {
  const cv = document.getElementById('barC'); if (!cv) return;
  const ctx=cv.getContext('2d'),W=cv.width,H=cv.height,now=new Date();
  ctx.clearRect(0,0,W,H);
  const months=[];
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);months.push({lbl:d.toLocaleDateString('fr-FR',{month:'short'}),m:d.getMonth(),y:d.getFullYear(),inc:0,exp:0,sav:0});}
  all.forEach(e=>{const d=new Date(e.date),mm=months.find(x=>x.m===d.getMonth()&&x.y===d.getFullYear());if(mm){mm.inc+=e.inc||0;mm.exp+=e.exp||0;mm.sav+=e.sav||0;}});
  const pL=40,pR=8,pT=10,pB=24,cW=W-pL-pR,cH=H-pT-pB;
  const max=Math.max(...months.flatMap(m=>[m.inc,m.exp,m.sav]),1);
  ctx.strokeStyle='#E8E5E0';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){const y=pT+cH-(i/4)*cH;ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(pL+cW,y);ctx.stroke();ctx.fillStyle='#6B7280';ctx.font='8px DM Sans';ctx.textAlign='right';ctx.fillText(Math.round(max*i/4),pL-3,y+3);}
  const bw=cW/months.length,gw=bw*0.22,bwi=bw*0.19;
  months.forEach((mm,i)=>{
    const x=pL+i*bw+gw;
    [['#2E7D5E',mm.inc],['#D4621A',mm.exp],['#C8922A',mm.sav]].forEach(([col,val],j)=>{
      const bh=(val/max)*cH;ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x+j*(bwi+2),pT+cH-bh,bwi,bh,[3,3,0,0]);ctx.fill();
    });
    ctx.fillStyle='#6B7280';ctx.font='8px DM Sans';ctx.textAlign='center';ctx.fillText(mm.lbl,pL+i*bw+bw/2,H-6);
  });
  [['Revenus','#2E7D5E'],['Dépenses','#D4621A'],['Économies','#C8922A']].forEach(([lbl,col],i)=>{
    const lx=W-200+i*68;ctx.fillStyle=col;ctx.fillRect(lx,3,8,8);ctx.fillStyle='#6B7280';ctx.font='8px DM Sans';ctx.textAlign='left';ctx.fillText(lbl,lx+11,10);
  });
}

function renderRecentTx(entries, cur) {
  const el = document.getElementById('recentTx'); if (!el) return;
  if (!entries.length) { el.innerHTML='<div class="empty">Aucune transaction encore.</div>'; return; }
  el.innerHTML = entries.map(e => `
    <div class="tx-item">
      <div class="tx-cat">${CATS[e.cat]||'📦'}</div>
      <div class="tx-info"><div class="tx-date">${new Date(e.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})}</div><div class="tx-note">${e.note||e.cat}</div></div>
      <div class="tx-amt">
        ${e.inc?'<div class="tx-inc">+'+fmt(e.inc,cur)+'</div>':''}
        ${e.exp?'<div class="tx-exp">-'+fmt(e.exp,cur)+'</div>':''}
        ${e.sav?'<div class="tx-sav">+'+fmt(e.sav,cur)+'</div>':''}
      </div>
    </div>`).join('');
}

function renderActiveDefis() {
  const card = document.getElementById('activeDefiCard');
  const lst  = document.getElementById('activeDefiList');
  if (!card||!lst) return;
  const joined  = ls('joinedDefis', {});
  const savings = ls('defiSavings', {});
  const p = ls('profile',{}), cur = p.currency||'€';
  const keys = Object.keys(joined);
  if (!keys.length) { card.style.display='none'; return; }
  card.style.display='block';
  lst.innerHTML = keys.map(i => {
    const d = DEFIS[parseInt(i)]; if (!d) return '';
    const sav = savings[i]||0;
    const pct = Math.min(100,Math.round((sav/d.obj)*100));
    return `<div class="ad-item">
      <div class="ad-name">${d.name}</div>
      <div class="ad-bar"><div class="ad-fill" style="width:${pct}%"></div></div>
      <div class="ad-meta">${fmt(sav,cur)} économisé sur ${fmt(d.obj,cur)} — ${pct}%</div>
    </div>`;
  }).join('');
}

function renderGoalEvo(cur) {
  const card = document.getElementById('goalEvoCard');
  const lst  = document.getElementById('goalEvoList');
  if (!card||!lst) return;
  const goals = ls('goals', []);
  cur = cur || ls('profile',{}).currency||'€';
  if (!goals.length) { card.style.display='none'; return; }
  card.style.display='block';
  lst.innerHTML = goals.map(g => {
    const pct = Math.min(100,Math.round(((g.sav||0)/g.target)*100))||0;
    return `<div class="ad-item">
      <div class="ad-name">${g.name} ${pct>=100?'🏆':''}</div>
      <div class="ad-bar"><div class="ad-fill" style="width:${pct}%;background:linear-gradient(90deg,#1E5A9C,#2E7D5E)"></div></div>
      <div class="ad-meta">${fmt(g.sav||0,cur)} / ${fmt(g.target,cur)} — ${pct}%</div>
    </div>`;
  }).join('');
}

/* ══ DAILY ══ */
function addEntry() {
  const date = document.getElementById('eDate')?.value;
  const inc  = parseFloat(document.getElementById('eInc')?.value)||0;
  const exp  = parseFloat(document.getElementById('eExp')?.value)||0;
  const cat  = document.getElementById('eCat')?.value;
  const sav  = parseFloat(document.getElementById('eSav')?.value)||0;
  const note = document.getElementById('eNote')?.value.trim();
  if (!date) { toast('Sélectionnez une date.'); return; }
  if (!inc && !exp) { toast('Saisissez un revenu ou une dépense.'); return; }
  const entries = ls('entries', []);
  entries.push({id:Date.now(),date,inc,exp,cat,sav,note});
  sv('entries', entries);
  ['eInc','eExp','eSav','eNote'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  renderEntries(); renderDash();
  toast('Fiche enregistrée !');
}

function renderEntries() {
  const entries = ls('entries', []);
  const p = ls('profile',{}), cur = p.currency||'€';
  const now = new Date(), today = now.toISOString().slice(0,10);
  const wS = new Date(now); wS.setDate(now.getDate()-now.getDay());
  let dE=0,wE=0,mE=0,tS=0;
  entries.forEach(e => {
    if (e.date===today) dE+=e.exp||0;
    if (new Date(e.date)>=wS) wE+=e.exp||0;
    const d=new Date(e.date); if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()) mE+=e.exp||0;
    tS+=e.sav||0;
  });
  txt('tDay',fmt(dE,cur)); txt('tWeek',fmt(wE,cur)); txt('tMonth',fmt(mE,cur)); txt('tSaved',fmt(tS,cur));
  const lst = document.getElementById('entriesList'); if (!lst) return;
  if (!entries.length) { lst.innerHTML='<div class="empty">Aucune fiche encore.</div>'; return; }
  lst.innerHTML = [...entries].reverse().map(e => `
    <div class="tx-item">
      <div class="tx-cat">${CATS[e.cat]||'📦'}</div>
      <div class="tx-info"><div class="tx-date">${new Date(e.date).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'})}</div><div class="tx-note">${e.note||e.cat}</div></div>
      <div class="tx-amt">
        ${e.inc?'<div class="tx-inc">+'+fmt(e.inc,cur)+'</div>':''}
        ${e.exp?'<div class="tx-exp">-'+fmt(e.exp,cur)+'</div>':''}
        ${e.sav?'<div class="tx-sav">+'+fmt(e.sav,cur)+'</div>':''}
      </div>
      <button class="tx-del" data-id="${e.id}">✕</button>
    </div>`).join('');
  lst.querySelectorAll('.tx-del').forEach(btn => btn.addEventListener('click', () => delEntry(+btn.dataset.id)));
}
function delEntry(id) { if(!confirm('Supprimer ?'))return; sv('entries',ls('entries',[]).filter(e=>e.id!==id)); renderEntries(); renderDash(); }

/* ══ GOALS ══ */
function addGoal() {
  const goals = ls('goals', []);
  if (goals.length >= 1) { showModal('🔒','Objectifs illimités','Le Plan Gratuit inclut 1 objectif. Passez au Plan Basic pour des objectifs illimités !'); return; }
  const name   = document.getElementById('gCustom')?.value.trim() || document.getElementById('gName')?.value;
  const target = parseFloat(document.getElementById('gTarget')?.value)||0;
  const sav    = parseFloat(document.getElementById('gSaved')?.value)||0;
  const date   = document.getElementById('gDate')?.value;
  if (!target) { toast('Saisissez un montant cible.'); return; }
  goals.push({id:Date.now(),name,target,sav,date});
  sv('goals',goals);
  ['gCustom','gTarget','gSaved','gDate'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  renderGoals(); renderDash();
  toast('Objectif créé !');
}

function renderGoals() {
  const goals = ls('goals',[]), p = ls('profile',{}), cur = p.currency||'€';
  const lst = document.getElementById('goalsList'); if (!lst) return;
  if (!goals.length) { lst.innerHTML='<div class="empty">Aucun objectif. Commencez à rêver grand !</div>'; return; }
  lst.className='goals-grid';
  lst.innerHTML = goals.map(g => {
    const pct = Math.min(100,Math.round(((g.sav||0)/g.target)*100))||0;
    const dt = g.date?new Date(g.date).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}):'';
    return `<div class="goal-card">
      <div class="goal-hd">
        <div><div class="goal-name">${g.name}</div>${dt?'<div class="goal-dt">Date : '+dt+'</div>':''}</div>
        <button class="goal-del" data-id="${g.id}">✕</button>
      </div>
      <div class="goal-amts">
        <div><div style="font-size:0.68rem;color:#6B7280;font-weight:800;text-transform:uppercase;margin-bottom:2px">Économisé</div><div class="goal-sv">${fmt(g.sav||0,cur)}</div></div>
        <div class="goal-tg"><div style="font-size:0.68rem;color:#6B7280;font-weight:800;text-transform:uppercase;margin-bottom:2px">Objectif</div><strong style="font-family:'Cormorant Garamond',serif;font-size:1.1rem">${fmt(g.target,cur)}</strong></div>
      </div>
      <div class="pb-bar"><div class="pb-fill" style="width:${pct}%"></div></div>
      <div class="pb-pct">${pct}% — Restant : ${fmt(Math.max(0,g.target-(g.sav||0)),cur)}</div>
      <button class="goal-add" data-id="${g.id}">+ Ajouter des économies</button>
    </div>`;
  }).join('');
  lst.querySelectorAll('.goal-del').forEach(btn => btn.addEventListener('click', () => delGoal(+btn.dataset.id)));
  lst.querySelectorAll('.goal-add').forEach(btn => btn.addEventListener('click', () => addToGoal(+btn.dataset.id)));
}
function delGoal(id) { if(!confirm('Supprimer ?'))return; sv('goals',ls('goals',[]).filter(g=>g.id!==id)); renderGoals(); renderDash(); }
function addToGoal(id) {
  const amt = parseFloat(prompt('Montant économisé (€) :'));
  if (!amt||isNaN(amt)||amt<=0) return;
  const goals = ls('goals',[]), g = goals.find(x=>x.id===id);
  if (g) { g.sav = (g.sav||0)+amt; sv('goals',goals); renderGoals(); renderDash(); toast('Économies ajoutées !'); }
}

/* ══ TIPS ══ */
function renderTips() {
  txt('tipText', TIPS[Math.floor(Math.random()*TIPS.length)].txt);
  const grid = document.getElementById('tipsGrid'); if (!grid) return;
  grid.innerHTML = TIPS.map(t => `<div class="tip-card"><div class="tip-cat">${t.cat}</div><div class="tip-txt">${t.txt}</div></div>`).join('');
}

/* ══ DÉFIS ══ */
function renderDefis() {
  const grid = document.getElementById('defiGrid'); if (!grid) return;
  const joined  = ls('joinedDefis', {});
  const savings = ls('defiSavings', {});
  const lastAdd = ls('defiLastAdd', {});
  const today   = new Date().toISOString().slice(0,10);

  grid.innerHTML = DEFIS.map((d, i) => {
    const isJ    = !!joined[i];
    const saved  = savings[i]||0;
    const pct    = Math.min(100, Math.round((saved/d.obj)*100));
    const done   = pct >= 100;
    const elapsed= isJ ? Math.floor((new Date()-new Date(joined[i]))/(1000*60*60*24)) : 0;
    const missed = isJ && !done && lastAdd[i] !== today && elapsed > 0;

    let inner = '';
    if (isJ) {
      if (done) {
        inner = `<div class="defi-trophy">
          <div class="trophy-ico">🏆</div>
          <div class="trophy-t">Félicitations !</div>
          <div class="trophy-m">${MSG_SUCCES[i%MSG_SUCCES.length]}</div>
        </div>`;
      } else {
        inner = `
          <div class="defi-days">Jour <strong>${elapsed}</strong> — En cours</div>
          <div class="dp"><div class="dp-bar"><div class="dp-fill" style="width:${pct}%"></div></div><div class="dp-pct">${pct}%</div></div>
          ${missed?'<div class="defi-rappel">'+MSG_RAPPEL[i%MSG_RAPPEL.length]+'</div>':''}
          ${saved>0?'<div class="defi-enc">💪 '+MSG_ENC[i%MSG_ENC.length]+'</div>':''}
          <div class="defi-tracker">
            <div class="dt-amounts">
              <div class="dt-box sv"><span>Économisé</span><strong>${fmt(saved)}</strong></div>
              <div class="dt-box go"><span>Objectif</span><strong>${fmt(d.obj)}</strong></div>
              <div class="dt-box re"><span>Restant</span><strong>${fmt(Math.max(0,d.obj-saved))}</strong></div>
            </div>
            <div class="dt-hint">Conseil : ajoutez ${fmt(d.q)} par jour</div>
            <div class="dt-input">
              <input type="number" class="inp dt-inp" data-i="${i}" placeholder="Montant ajouté (€)" min="0" step="0.01"/>
              <button class="dt-add" data-i="${i}">Ajouter</button>
            </div>
          </div>`;
      }
    }

    return `<div class="defi-card ${isJ?'joined':''} ${done?'done':''}" data-i="${i}">
      <div class="defi-name">${d.name}</div>
      <div class="defi-desc">${d.desc}</div>
      <div class="defi-dur">${d.dur} · Objectif : ${fmt(d.obj)} · Conseil : ${fmt(d.q)}/jour</div>
      ${inner}
      ${!done?'<button class="defi-btn '+(isJ?'quit':'')+'">'+(isJ?'Abandonner':'Commencer ce défi')+'</button>':''}
    </div>`;
  }).join('');

  grid.querySelectorAll('.defi-btn').forEach(btn => btn.addEventListener('click', () => toggleDefi(+btn.closest('.defi-card').dataset.i)));
  grid.querySelectorAll('.dt-add').forEach(btn => btn.addEventListener('click', () => addDefiAmt(+btn.dataset.i)));
}

function toggleDefi(i) {
  let joined = ls('joinedDefis', {});
  if (joined[i]) { if(!confirm('Abandonner ce défi ?'))return; delete joined[i]; toast('Défi abandonné.'); }
  else { joined[i] = new Date().toISOString(); toast('Défi commencé ! Ajoutez votre premier montant.'); }
  sv('joinedDefis', joined);
  renderDefis(); renderActiveDefis();
}

function addDefiAmt(i) {
  const input = document.querySelector('.dt-inp[data-i="'+i+'"]');
  const amt = parseFloat(input?.value);
  if (!amt||isNaN(amt)||amt<=0) { toast('Saisissez un montant valide.'); return; }
  const savings = ls('defiSavings', {});
  const lastAdd = ls('defiLastAdd', {});
  const before  = savings[i]||0;
  savings[i] = before + amt;
  lastAdd[i] = new Date().toISOString().slice(0,10);
  sv('defiSavings', savings);
  sv('defiLastAdd', lastAdd);
  if (input) input.value = '';
  const d = DEFIS[i];
  if (savings[i] >= d.obj && before < d.obj) {
    setTimeout(() => showModal('🏆','Félicitations !','Vous avez atteint votre objectif "'+d.name+'" de '+fmt(d.obj)+' ! Vous êtes incroyable !'), 300);
    toast('🏆 OBJECTIF ATTEINT ! Félicitations !');
    if('Notification'in window && Notification.permission==='granted') {
      new Notification('🏆 Objectif atteint !',{body:d.name+' — '+fmt(d.obj)+' économisés !',icon:'./icons/icon-192.png'});
    }
  } else {
    toast('Bien joué ! '+fmt(amt)+' ajouté — '+Math.min(100,Math.round((savings[i]/d.obj)*100))+'% atteint !');
  }
  renderDefis(); renderActiveDefis();
}

/* ══ PRICING ══ */
function makePR(plans) {
  return plans.map((p,i) => `
    <div class="pr ${p.feat?'feat':''}" data-i="${i}">
      ${p.badge?'<div class="pr-badge">'+p.badge+'</div>':''}
      <div class="pr-name">${p.name}</div>
      <div class="pr-price">${p.price}<span class="pr-unit"> ${p.unit}</span></div>
      <ul class="pr-feats">${p.feats.map(f=>'<li>'+f+'</li>').join('')}</ul>
      <button class="pr-btn">${p.cta}</button>
    </div>`).join('');
}

function renderPricingMain() {
  const el = document.getElementById('pgMain'); if (!el) return;
  const plans = PLANS[pMode];
  el.style.gridTemplateColumns = 'repeat(4,1fr)';
  el.innerHTML = makePR(plans);
  el.querySelectorAll('.pr').forEach((card, i) => {
    card.addEventListener('click', () => {
      const plan = plans[i];
      if (plan.price==='0') { toast('Vous êtes sur le plan gratuit !'); return; }
      el.querySelectorAll('.pr').forEach(c => c.classList.remove('sel'));
      card.classList.add('sel');
      const bar = document.getElementById('selBar');
      if (bar) {
        bar.style.display='flex';
        txt('selName', plan.name);
        txt('selPrice', plan.price+' '+plan.unit);
        const sc = document.getElementById('selCard');
        if (sc) { sc.onclick = () => window.open(getStripeLink(plan.name),'_blank'); }
        bar.scrollIntoView({behavior:'smooth',block:'center'});
      }
      toast('Plan '+plan.name+' sélectionné !');
    });
  });
}

function renderPricingProject(elId, payBoxId) {
  const el = document.getElementById(elId); if (!el) return;
  const plans = PLANS['eu'].slice(1);
  el.style.gridTemplateColumns = 'repeat(3,1fr)';
  el.innerHTML = makePR(plans);
  el.querySelectorAll('.pr').forEach((card, i) => {
    card.addEventListener('click', () => {
      el.querySelectorAll('.pr').forEach(c => c.classList.remove('sel'));
      card.classList.add('sel');
      const box = document.getElementById(payBoxId);
      if (box) {
        box.style.display='block';
        const cb = box.querySelector('.btn-card');
        if (cb) cb.onclick = () => window.open(getStripeLink(plans[i].name),'_blank');
        box.scrollIntoView({behavior:'smooth',block:'center'});
      }
      toast('Plan '+plans[i].name+' sélectionné !');
    });
  });
}

function renderPricingAll() {
  renderPricingMain();
  renderPricingProject('pgBusiness','pcBusiness');
  renderPricingProject('pgCouple','pcCouple');
}

/* ══ COACHING ══ */
function initCoaching() {
  document.querySelectorAll('.co-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      coOffer = {offer: btn.dataset.offer, price: btn.dataset.price};
      coStep(2);
    });
  });
  const b = (id,fn) => { const el=document.getElementById(id); if(el) el.addEventListener('click',fn); };
  b('coBack', () => coStep(1));
  b('coCard', () => payCoaching('card'));
  b('coPP',   () => payCoaching('paypal'));
}

function coStep(n) {
  [1,2,3].forEach(i => {
    const el = document.getElementById('cs'+i); if(el) el.style.display=i===n?'block':'none';
    const s  = document.getElementById('st'+i); if(s){s.classList.remove('active','done');if(i===n)s.classList.add('active');if(i<n)s.classList.add('done');}
  });
  if (n===2&&coOffer) { txt('coOffer',coOffer.offer); txt('coPrice',coOffer.price); txt('coTotal',coOffer.price); }
  if (n===3&&coOffer) { txt('scDesc','Votre séance '+coOffer.offer+' ('+coOffer.price+') est confirmée. Réservez votre créneau :'); }
}

function payCoaching(method) {
  const name  = document.getElementById('coName')?.value.trim();
  const email = document.getElementById('coEmail')?.value.trim();
  if (!name||!email) { toast('Remplissez votre nom et email.'); return; }
  if (!coOffer) { toast('Sélectionnez une offre.'); return; }
  sv('coachingBooking',{name,email,phone:document.getElementById('coPhone')?.value,sit:document.getElementById('coSit')?.value,offer:coOffer,method,date:new Date().toISOString()});
  toast(method==='card'?'Redirection vers le paiement…':'Redirection vers PayPal…');
  setTimeout(()=>{window.open(method==='card'?STRIPE:PAYPAL,'_blank');setTimeout(()=>coStep(3),2000);},800);
}

/* ══ PROFILE ══ */
function loadProfile() {
  const p = ls('profile', {});
  const set = (id,v) => { const el=document.getElementById(id); if(el&&v!==undefined) el.value=v; };
  set('profName',p.name); set('profEmail',p.email); set('profCur',p.currency);
  set('profGoal',p.savingsGoal); set('profInc',p.income);
  const letter = p.name?p.name.charAt(0).toUpperCase():'U';
  txt('spAv',letter); txt('mhAv',letter); txt('photoLetter',letter);
  if (p.name) txt('spName',p.name);
}

function saveProfile() {
  const p = {
    name:        document.getElementById('profName')?.value||'',
    email:       document.getElementById('profEmail')?.value||'',
    currency:    document.getElementById('profCur')?.value||'€',
    savingsGoal: parseFloat(document.getElementById('profGoal')?.value)||0,
    income:      parseFloat(document.getElementById('profInc')?.value)||0,
  };
  sv('profile',p); loadProfile(); renderDash(); renderEntries(); renderGoals();
  toast('Profil enregistré !');
}

/* ══ PHOTO ══ */
function loadPhoto() {
  const data = localStorage.getItem('bs_photo');
  if (data) applyPhoto(data);
}
function handlePhoto(e) {
  const file = e.target.files[0]; if (!file) return;
  if (file.size>2*1024*1024) { toast('Photo trop grande (max 2MB)'); return; }
  const reader = new FileReader();
  reader.onload = ev => { localStorage.setItem('bs_photo',ev.target.result); applyPhoto(ev.target.result); toast('Photo mise à jour !'); };
  reader.readAsDataURL(file);
}
function applyPhoto(data) {
  const img = document.getElementById('photoImg'), let_ = document.getElementById('photoLetter');
  if (img){img.src=data;img.style.display='block';}  if(let_)let_.style.display='none';
  const av = document.getElementById('spAv');
  if(av)av.innerHTML='<img src="'+data+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>';
  const mh = document.getElementById('mhAv');
  if(mh)mh.innerHTML='<img src="'+data+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"/>';
}

/* ══ DATA ══ */
function exportData() {
  const data = {entries:ls('entries',[]),goals:ls('goals',[]),joinedDefis:ls('joinedDefis',{}),defiSavings:ls('defiSavings',{}),profile:ls('profile',{}),date:new Date().toISOString()};
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href=url; a.download='budgetsmart-'+new Date().toISOString().slice(0,10)+'.json'; a.click();
  URL.revokeObjectURL(url); toast('Données exportées !');
}
function clearData() {
  if(!confirm('Effacer toutes les données ? Action irréversible.'))return;
  ['entries','goals','joinedDefis','defiSavings','defiLastAdd','profile','bs_photo','bs_admin','bs_installed'].forEach(k=>localStorage.removeItem(k));
  location.reload();
}

/* ══ MODAL ══ */
function showModal(ico,title,text) {
  txt('mIco',ico); txt('mTitle',title); txt('mText',text);
  document.getElementById('modal').classList.add('open');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

/* ══ ADMIN ══ */
/* ══ ADMIN SUPABASE ══ */
let isAdmin = false;

async function initAdmin() {
  if (window.location.hash==='#admin') setTimeout(checkAdminAccess, 500);
  const logo = document.querySelector('.sidebar-logo');
  if (logo) { let c=0; logo.addEventListener('click',()=>{c++;if(c>=3){c=0;checkAdminAccess();}setTimeout(()=>{c=0;},1500);}); }
  await checkAdminAccess();
}

async function checkAdminAccess() {
  if (!currentUser) return;
  try {
    const { data } = await sbClient
      .from('profiles')
      .select('is_admin, plan')
      .eq('id', currentUser.id)
      .single();
    if (data?.is_admin) {
      isAdmin = true;
      activateAdmin();
    }
  } catch(e) {}
}

function activateAdmin() {
  const li = document.getElementById('adminLi'); if(li) li.style.display='block';
  const ac = document.getElementById('adminCard'); if(ac) ac.style.display='block';
  txt('sbPlan','Admin — Accès Complet');
  txt('spPlan','Propriétaire');
  renderAdmin();
}

async function renderAdmin() {
  if (!isAdmin) return;
  
  // Stats locales
  const entries=ls('entries',[]),goals=ls('goals',[]),joined=ls('joinedDefis',{}),p=ls('profile',{}),cur=p.currency||'€';
  const now=new Date(),m=now.getMonth(),y=now.getFullYear();
  let mE=0,tS=0;
  entries.forEach(e=>{const d=new Date(e.date);if(d.getMonth()===m&&d.getFullYear()===y)mE+=e.exp||0;tS+=e.sav||0;});
  txt('adSav',fmt(tS,cur)); txt('adExp',fmt(mE,cur));
  txt('adGoals',goals.length.toString()); txt('adDefis',Object.keys(joined).length.toString());

  // Charger tous les utilisateurs depuis Supabase
  try {
    const { data: users, error } = await sbClient
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    txt('adTotalUsers', (users?.length || 0).toString());
    renderUsersList(users || []);
    renderAdminRevenue(users || []);
  } catch(e) {
    console.error('Admin load error:', e);
    const ul = document.getElementById('adUsersList');
    if (ul) ul.innerHTML = '<div class="empty">Erreur de chargement des utilisateurs.</div>';
  }
}

function renderUsersList(users) {
  const ul = document.getElementById('adUsersList');
  if (!ul) return;
  if (!users.length) { ul.innerHTML = '<div class="empty">Aucun utilisateur inscrit.</div>'; return; }
  
  const planColors = {
    'gratuit':  '#6B5F52',
    'basic':    '#2E7DD6',
    'premium':  '#E8631C',
    'business': '#D98C12'
  };
  
  ul.innerHTML = users.map(u => `
    <div class="admin-user-row" data-id="${u.id}">
      <div class="aur-info">
        <div class="aur-email">${u.email || '—'}</div>
        <div class="aur-name">${u.name || 'Sans nom'}</div>
        <div class="aur-date">Inscrit le ${u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '—'}</div>
      </div>
      <div class="aur-plan">
        <select class="inp plan-select" data-uid="${u.id}" style="padding:7px 11px;font-size:0.92rem;font-weight:700;color:${planColors[u.plan||'gratuit']};border-color:${planColors[u.plan||'gratuit']}">
          <option value="gratuit"  ${(u.plan||'gratuit')==='gratuit'  ? 'selected':''}>Gratuit</option>
          <option value="basic"    ${u.plan==='basic'    ? 'selected':''}>Basic — 2,99€</option>
          <option value="premium"  ${u.plan==='premium'  ? 'selected':''}>Premium — 5,99€</option>
          <option value="business" ${u.plan==='business' ? 'selected':''}>Business — 9,99€</option>
        </select>
        <button class="btn-apply-plan" data-uid="${u.id}">Appliquer</button>
      </div>
      <div class="aur-status">
        <span class="aur-badge ${u.is_admin ? 'badge-admin' : 'badge-user'}">${u.is_admin ? '👑 Admin' : '👤 Utilisateur'}</span>
      </div>
    </div>
  `).join('');

  // Boutons Appliquer plan
  ul.querySelectorAll('.btn-apply-plan').forEach(btn => {
    btn.addEventListener('click', () => applyUserPlan(btn.dataset.uid));
  });

  // Mise à jour couleur select en temps réel
  ul.querySelectorAll('.plan-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const colors = {'gratuit':'#6B5F52','basic':'#2E7DD6','premium':'#E8631C','business':'#D98C12'};
      sel.style.color = colors[sel.value] || '#6B5F52';
      sel.style.borderColor = colors[sel.value] || '#6B5F52';
    });
  });
}

async function applyUserPlan(userId) {
  const sel = document.querySelector(`.plan-select[data-uid="${userId}"]`);
  if (!sel) return;
  const plan = sel.value;
  const btn = document.querySelector(`.btn-apply-plan[data-uid="${userId}"]`);
  if (btn) { btn.disabled = true; btn.textContent = 'En cours…'; }
  
  try {
    const { error } = await sbClient
      .from('profiles')
      .update({ plan, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
    toast(`✅ Plan ${plan} attribué avec succès !`);
    if (btn) { btn.disabled = false; btn.textContent = 'Appliquer'; }
  } catch(e) {
    toast('❌ Erreur : ' + e.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Appliquer'; }
  }
}

function adminLogout(){
  if(!confirm('Quitter le mode Admin ?')) return;
  localStorage.removeItem('bs_admin');
  location.reload();
}

/* ══ PWA ══ */
function initPWA() {
  if('serviceWorker'in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window._pwa=e;});
  window.addEventListener('appinstalled',()=>{
    const bn=document.getElementById('pwaBanner');
    if(bn)bn.style.display='none';
    localStorage.setItem('bs_installed','1');
    toast('BudgetSmart installé avec succès !');
  });
  initPWABanner();
}

function initPWABanner() {
  const bn = document.getElementById('pwaBanner');
  if (!bn) return;
  // Cacher si déjà installé
  if (window.matchMedia('(display-mode:standalone)').matches || localStorage.getItem('bs_installed')==='1') {
    bn.style.display='none'; return;
  }
  bn.style.display='flex';
}

function pwaInstall() {
  if(window._pwa){window._pwa.prompt();window._pwa.userChoice.then(r=>{if(r.outcome==='accepted'){toast('Installation en cours…');}window._pwa=null;});}
  else{const iOS=/iPad|iPhone|iPod/.test(navigator.userAgent);alert(iOS?'Sur iPhone :\n1. Appuyez sur bouton Partager\n2. "Sur l\'écran d\'accueil"\n3. "Ajouter"':'Sur Android :\n1. Menu Chrome (3 points)\n2. "Ajouter à l\'écran d\'accueil"\n3. "Ajouter"');}
}

/* ══ NOTIFICATIONS ══ */
function initNotif() {
  if(!('Notification'in window))return;
  if(Notification.permission==='default'){
    Notification.requestPermission().then(p=>{if(p==='granted'){scheduleNotif();toast('Notifications activées !');}});
  } else if(Notification.permission==='granted'){
    scheduleNotif();
  }
}
function scheduleNotif() {
  const today=new Date().toISOString().slice(0,10);
  if(localStorage.getItem('bs_notif')===today)return;
  const joined=ls('joinedDefis',{});
  const goals=ls('goals',[]);
  const savings=ls('defiSavings',{});
  const entries=ls('entries',[]);
  const todayEntries=entries.filter(e=>e.date===today);

  if(Object.keys(joined).length>0){
    setTimeout(()=>{
      const msgs=Object.keys(joined).map(i=>{const d=DEFIS[parseInt(i)];if(!d)return null;const s=savings[i]||0;const pct=Math.min(100,Math.round((s/d.obj)*100));return d.name+' — '+pct+'%';}).filter(Boolean);
      new Notification('BudgetSmart — Vos défis vous attendent !',{body:msgs.join('\n'),icon:'./icons/icon-192.png',tag:'defis'});
    },3000);
  }
  if(goals.length>0){
    setTimeout(()=>{
      const cur=ls('profile',{}).currency||'€';
      const msgs=goals.map(g=>{const pct=Math.min(100,Math.round(((g.sav||0)/g.target)*100))||0;return g.name+' — '+pct+'%';});
      new Notification('BudgetSmart — Vos objectifs d\'épargne',{body:msgs.join('\n'),icon:'./icons/icon-192.png',tag:'goals'});
    },6000);
  }
  setTimeout(()=>{
    new Notification('BudgetSmart — '+(todayEntries.length?'Bilan du jour':'Rappel quotidien'),{
      body:todayEntries.length?'Vous avez enregistré '+todayEntries.length+' entrée(s) aujourd\'hui. Continuez !':'N\'oubliez pas d\'enregistrer vos dépenses et économies d\'aujourd\'hui !',
      icon:'./icons/icon-192.png',tag:'daily'
    });
  },9000);
  localStorage.setItem('bs_notif',today);
}
