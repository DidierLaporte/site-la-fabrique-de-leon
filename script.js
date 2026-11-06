const header=document.querySelector('header');
const menu=document.getElementById('menu');
function setMobileMenu(open){
  if(!header || !menu) return;
  header.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}
if(menu) menu.addEventListener('click',()=>setMobileMenu(!header.classList.contains('open')));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>setMobileMenu(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape') setMobileMenu(false)});


/* V22.1 — espace bénévoles protégé.
   Le mot de passe n'est pas stocké en clair dans le JavaScript : seule son empreinte SHA-256 est utilisée.
   Attention : cette protection contrôle l'accès depuis le site ; l'application externe doit avoir sa propre authentification
   si elle contient des données sensibles. */
const lockScreen=document.getElementById('tools-lock-screen');
const toolsContent=document.getElementById('tools-content');
const unlockForm=document.getElementById('unlock-form');
const passwordInput=document.getElementById('tools-password');
const errorMessage=document.getElementById('tools-error');
const lockButton=document.getElementById('tools-lock');
const PASSWORD_HASH='4014e5d5c8bd1f974ae5da37da9f68097aed199b849293d301b60bc26ae8e623';
const SESSION_KEY='fabrique_leon_benevole_auth';
let inactivityTimer;

async function sha256(value){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
function showTools(){
  lockScreen.hidden=true; toolsContent.hidden=false; passwordInput.value=''; errorMessage.hidden=true; resetInactivityTimer();
}
function lockTools(){
  sessionStorage.removeItem(SESSION_KEY);
  toolsContent.hidden=true; lockScreen.hidden=false;
  clearTimeout(inactivityTimer);
}
function resetInactivityTimer(){
  clearTimeout(inactivityTimer);
  inactivityTimer=setTimeout(lockTools,30*60*1000);
}
if(sessionStorage.getItem(SESSION_KEY)==='1') showTools();
if(unlockForm) unlockForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const hash=await sha256(passwordInput.value);
  if(hash===PASSWORD_HASH){ sessionStorage.setItem(SESSION_KEY,'1'); showTools(); }
  else { errorMessage.hidden=false; passwordInput.value=''; passwordInput.focus(); }
});
if(lockButton) lockButton.addEventListener('click',lockTools);
['click','keydown','mousemove','touchstart'].forEach(evt=>document.addEventListener(evt,()=>{if(!toolsContent.hidden) resetInactivityTimer();},{passive:true}));
// Ouvre automatiquement la rubrique légale ciblée depuis le pied de page
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target && target.tagName.toLowerCase() === 'details') target.open = true;
    });
  });
});


/* V26.51 — artistes regroupés visuellement par année, de la plus récente à la plus ancienne. */
window.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.artists-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.artist-card'));
  const yearOf = card => {
    const text = card.querySelector('.artist-year')?.textContent || '';
    const match = text.match(/20\d{2}/);
    return match ? Number(match[0]) : 0;
  };
  const hasSite = card => Boolean(card.querySelector('a[data-artist-site="true"]'));
  const nameOf = card => card.querySelector('h3')?.textContent.trim().toLocaleLowerCase('fr') || '';
  cards.sort((a, b) => yearOf(b) - yearOf(a) || Number(hasSite(b)) - Number(hasSite(a)) || nameOf(a).localeCompare(nameOf(b), 'fr'));
  let lastYear = null;
  cards.forEach(card => {
    const year = yearOf(card);
    if (year !== lastYear) {
      const heading = document.createElement('h3');
      heading.className = 'artist-year-heading';
      heading.textContent = year || 'Archives';
      heading.setAttribute('aria-label', `Artistes de ${year || 'années précédentes'}`);
      grid.appendChild(heading);
      lastYear = year;
    }
    grid.appendChild(card);
  });
});

/* V28.02 — navigation par clic extérieur, sans bouton de fermeture visible.
   Les liens de rubrique et le logo gardent leur comportement normal. */
function closeNavMenus() {
  document.querySelectorAll('.nav-group.is-open').forEach(item => {
    item.classList.remove('is-open');
    item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
  });
}

document.querySelectorAll('.nav-trigger').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    const group = button.closest('.nav-group');
    const opening = !group.classList.contains('is-open');
    closeNavMenus();
    if (opening) {
      group.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

document.addEventListener('click', event => {
  const target = event.target;
  const clickedTrigger = target.closest?.('.nav-trigger');
  const clickedDropdownLink = target.closest?.('.nav-dropdown a');
  if (clickedTrigger || clickedDropdownLink) return;

  // Un clic sur une zone libre de la page referme le sous-menu.
  // Les autres liens (dont le logo d’accueil) conservent leur navigation.
  closeNavMenus();

  // Le panneau hamburger se ferme aussi dès que l’on clique hors de l’en-tête.
  if (header?.classList.contains('open') && !target.closest?.('header')) setMobileMenu(false);
});

document.querySelectorAll('.nav-dropdown a').forEach(link => {
  link.addEventListener('click', () => {
    closeNavMenus();
    setMobileMenu(false);
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeNavMenus();
    setMobileMenu(false);
  }
});

/* V26.41 — compte à rebours automatique vers le troisième jeudi d'août. */
function thirdThursdayOfAugust(year) {
  const date = new Date(year, 7, 1, 18, 0, 0);
  const offset = (4 - date.getDay() + 7) % 7;
  date.setDate(1 + offset + 14);
  return date;
}
function updateFabriqueCountdown() {
  const now = new Date();
  let target = thirdThursdayOfAugust(now.getFullYear());
  if (target <= now) target = thirdThursdayOfAugust(now.getFullYear() + 1);
  const dateLabel = document.getElementById('next-event-date');
  if (dateLabel) dateLabel.textContent = new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(target).replace(/^./,c=>c.toLocaleUpperCase('fr-FR'));
  const remaining = Math.max(0, target.getTime() - now.getTime());
  const units = { 'count-days': Math.floor(remaining / 86400000), 'count-hours': Math.floor(remaining % 86400000 / 3600000), 'count-minutes': Math.floor(remaining % 3600000 / 60000) };
  Object.entries(units).forEach(([id,value]) => { const el=document.getElementById(id); if(el) el.textContent=String(value).padStart(2,'0'); });
  const dayDial=document.querySelector('[data-dial="days"]');
  const hourDial=document.querySelector('[data-dial="hours"]');
  const minuteDial=document.querySelector('[data-dial="minutes"]');
  if(dayDial) dayDial.style.setProperty('--progress', Math.max(0, Math.min(1, (remaining % 31536000000) / 31536000000))); 
  if(hourDial) hourDial.style.setProperty('--progress', Math.max(0, Math.min(1, (remaining % 86400000) / 86400000))); 
  if(minuteDial) minuteDial.style.setProperty('--progress', Math.max(0, Math.min(1, (remaining % 3600000) / 3600000)));  
}
updateFabriqueCountdown();
setInterval(updateFabriqueCountdown, 1000);

/* V26.55 — correction syntaxe compte à rebours et progression des cadrans. */
