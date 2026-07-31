'use strict';

/* Version simplifiée et sûre : ne touche plus à window.open ni à
   getStripeLink, pour ne plus jamais bloquer aucun bouton du site.
   Se contente de vérifier le plan et débloquer les fonctionnalités. */
if (!window.__deblocageChargeUneFois) {
window.__deblocageChargeUneFois = true;

const _SUPABASE_URL = 'https://otpnegpmvsmutyhhmkvp.supabase.co';
const _SUPABASE_KEY = 'sb_publishable_TrwWbJEwRijrmgEcNtzOqw_aosdIv_E';
const _sbDeblocage = supabase.createClient(_SUPABASE_URL, _SUPABASE_KEY);

window.currentPlan = "gratuit";

window.estAdmin = function () {
  return !!ls('bs_admin');
};

window.chargerAbonnement = async function () {
  try {
    const { data: sessionData } = await _sbDeblocage.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) { window.currentPlan = "gratuit"; appliquerDeblocagePlan(); return; }

    const { data, error } = await _sbDeblocage
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", user.id)
      .single();

    window.currentPlan = (!error && data && data.status === "active") ? data.plan : "gratuit";
  } catch (e) {
    window.currentPlan = "gratuit";
  }
  appliquerDeblocagePlan();
};

window.appliquerDeblocagePlan = function () {
  const admin = window.estAdmin();
  const debloquePremium = admin || currentPlan === "premium" || currentPlan === "business";

  const labels = { gratuit: "Plan Gratuit", basic: "Plan Basic", premium: "Plan Premium", business: "Plan Business" };
  const labelAffiche = admin ? "Admin — Accès Complet" : (labels[currentPlan] || "Plan Gratuit");
  txt("spPlan", labelAffiche);
  txt("sbPlan", labelAffiche.toUpperCase());

  window._objectifsIllimites = admin || currentPlan !== "gratuit";

  document.querySelectorAll(".ob-lock").forEach((el) => {
    el.style.display = debloquePremium ? "none" : "block";
  });
};

window.addGoal = function () {
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

}
