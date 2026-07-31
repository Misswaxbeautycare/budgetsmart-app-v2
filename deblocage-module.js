'use strict';

const _SUPABASE_URL = 'https://otpnegpmvsmutyhhmkvp.supabase.co';
const _SUPABASE_KEY = 'sb_publishable_TrwWbJEwRijrmgEcNtzOqw_aosdIv_E';
const _sbDeblocage = supabase.createClient(_SUPABASE_URL, _SUPABASE_KEY);

let currentPlan = "gratuit";

function estAdmin() {
  return !!ls('bs_admin');
}

function ajouterIdentiteAuLien(base, userId, email) {
  if (!userId) return base;
  try {
    const url = new URL(base);
    url.searchParams.set("client_reference_id", userId);
    if (email) url.searchParams.set("prefilled_email", email);
    return url.toString();
  } catch { return base; }
}

async function chargerAbonnement() {
  const { data: sessionData } = await _sbDeblocage.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) { currentPlan = "gratuit"; appliquerDeblocagePlan(); return; }

  const { data, error } = await _sbDeblocage
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .single();

  currentPlan = (!error && data && data.status === "active") ? data.plan : "gratuit";
  appliquerDeblocagePlan();
}

function appliquerDeblocagePlan() {
  const admin = estAdmin();
  const debloquePremium = admin || currentPlan === "premium" || currentPlan === "business";

  const labels = { gratuit: "Plan Gratuit", basic: "Plan Basic", premium: "Plan Premium", business: "Plan Business" };
  const labelAffiche = admin ? "Admin — Accès Complet" : (labels[currentPlan] || "Plan Gratuit");
  txt("spPlan", labelAffiche);
  txt("sbPlan", labelAffiche.toUpperCase());

  window._objectifsIllimites = admin || currentPlan !== "gratuit";

  document.querySelectorAll(".ob-lock").forEach((el) => {
    el.style.display = debloquePremium ? "none" : "block";
  });
}

function addGoal() {
  const goals = ls('goals', []);
  if (goals.length >= 1 && !window._objectifsIllimites) {
    showModal('🔒', 'Objectifs illimités', 'Le Plan Gratuit inclut 1 objectif. Passez au Plan Basic pour des objectifs illimités !');
    return;
  }
  const name   = document.getElementById('gCustom')?.value.trim() || document.getElementById('gName')?.value;
  const target = parseFloat(document.getElementById('gTarget')?.value) || 0;
  const sav    = parseFloat(document.getElementById('gSaved')?.value) || 0;
  const date   = document.getElementById('gDate')?.value;
  if (!target) { toast('Saisissez un montant cible.'); return; }
  goals.push({ id: Date.now(), name, target, sav, date });
  sv('goals', goals);
  ['gCustom', 'gTarget', 'gSaved', 'gDate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  renderGoals(); renderDash();
  toast('Objectif créé !');
}

const _getStripeLinkOriginal = window.getStripeLink;
async function getStripeLinkAsync(name) {
  const base = _getStripeLinkOriginal(name);
  const { data: sessionData } = await _sbDeblocage.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) return base;
  return ajouterIdentiteAuLien(base, user.id, user.email);
}
window.getStripeLink = function (name) {
  const base = _getStripeLinkOriginal(name);
  const w = window.open(base, '_blank');
  getStripeLinkAsync(name).then(urlAvecIdentite => {
    if (w && urlAvecIdentite !== base) w.location = urlAvecIdentite;
  });
  return base;
};
const _windowOpenOriginal = window.open.bind(window);
window.open = function (url, ...rest) {
  if (typeof url === 'string' && url.includes('buy.stripe.com')) {
    return null;
  }
  return _windowOpenOriginal(url, ...rest);
};

let _deblocageDejaLance = false;
function _deblocageTenterDemarrage() {
  if (_deblocageDejaLance) return;
  if (document.body.classList.contains('authed')) {
    _deblocageDejaLance = true;
    chargerAbonnement();
  }
}
new MutationObserver(_deblocageTenterDemarrage).observe(document.body, { attributes: true, attributeFilter: ['class'] });
document.addEventListener('DOMContentLoaded', () => setTimeout(_deblocageTenterDemarrage, 400));
