/* Themes intelligents harmonises - Q Revision Science Medicale
   Version legere : changement uniquement au clic / choix / saisie, sans boucle continue. */
(function () {
  'use strict';

  let qdashSearchSuppressUntil = 0;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const THEMES_NIVEAUX = [
    { k:'a1', re:/a1|base\s*sant/i, p:'#00B8D9', s:'#00C48C', a:'#FFD166', bg:'#E6FFFB', bg2:'#F0F9FF', ink:'#063344' },
    { k:'l1', re:/l1|emergent|émergent/i, p:'#16A34A', s:'#38BDF8', a:'#FACC15', bg:'#ECFDF5', bg2:'#EFF6FF', ink:'#052E16' },
    { k:'l2', re:/l2|ascendant/i, p:'#7C3AED', s:'#2563EB', a:'#22D3EE', bg:'#F5F3FF', bg2:'#EEF2FF', ink:'#1E1B4B' },
    { k:'a2', re:/a2|moyen|auxi/i, p:'#F97316', s:'#F43F5E', a:'#84CC16', bg:'#FFF7ED', bg2:'#FFF1F2', ink:'#431407' },
    { k:'l3inf', re:/l3.*inf|accompli.*inf|ide|infirm/i, p:'#0369A1', s:'#0D9488', a:'#F59E0B', bg:'#E0F2FE', bg2:'#F0FDFA', ink:'#082F49' },
    { k:'l3sf', re:/l3.*sf|accompli.*sf|sfm|sage/i, p:'#DB2777', s:'#7C3AED', a:'#FB923C', bg:'#FDF2F8', bg2:'#F5F3FF', ink:'#500724' },
    { k:'eff', re:/inf\/?sag|sag-m|examen|formation/i, p:'#0F766E', s:'#2563EB', a:'#EAB308', bg:'#ECFEFF', bg2:'#EFF6FF', ink:'#042F2E' }
  ];

  const THEMES_MATIERES = [
    { re:/anatom/i, p:'#EF4444', s:'#FB7185', a:'#F59E0B', bg:'#FFF1F2', label:'Anatomie' },
    { re:/physio/i, p:'#0284C7', s:'#22D3EE', a:'#10B981', bg:'#F0F9FF', label:'Physiologie' },
    { re:/pédiatr|pediatr|enfant|néonat|neonat/i, p:'#F97316', s:'#FBBF24', a:'#06B6D4', bg:'#FFF7ED', label:'Pédiatrie' },
    { re:/gyn|obst|sage|matern|accouche|grossesse/i, p:'#DB2777', s:'#C084FC', a:'#FB923C', bg:'#FDF2F8', label:'Gynécologie / Obstétrique' },
    { re:/chir|bloc|pansement|plaie/i, p:'#B91C1C', s:'#F97316', a:'#FACC15', bg:'#FEF2F2', label:'Chirurgie' },
    { re:/trauma|ortho|fract|luxat|entorse/i, p:'#D97706', s:'#F59E0B', a:'#EF4444', bg:'#FFFBEB', label:'Traumatologie' },
    { re:/uro|rein|urinaire|prostate/i, p:'#0E7490', s:'#2563EB', a:'#22C55E', bg:'#ECFEFF', label:'Urologie' },
    { re:/onco|cancer|tumeur/i, p:'#7C3AED', s:'#A855F7', a:'#06B6D4', bg:'#F5F3FF', label:'Oncologie' },
    { re:/pharma|médic|medic|therap|dose/i, p:'#4F46E5', s:'#8B5CF6', a:'#F59E0B', bg:'#EEF2FF', label:'Pharmacologie' },
    { re:/santé publique|sante publique|communaut|hygiène|hygiene|nutrition|pcimen/i, p:'#059669', s:'#14B8A6', a:'#FACC15', bg:'#ECFDF5', label:'Santé publique' },
    { re:/cardio|coeur|cœur|hta/i, p:'#DC2626', s:'#F43F5E', a:'#06B6D4', bg:'#FEF2F2', label:'Cardiologie' },
    { re:/neuro|cerveau|nerf/i, p:'#4338CA', s:'#0EA5E9', a:'#F59E0B', bg:'#EEF2FF', label:'Neurologie' },
    { re:/orl|ophtalmo|oeil|œil|oreille/i, p:'#0891B2', s:'#10B981', a:'#A3E635', bg:'#ECFEFF', label:'ORL / Ophtalmologie' },
    { re:/dictionnaire|medical|médical/i, p:'#0D9488', s:'#2563EB', a:'#F59E0B', bg:'#F0FDFA', label:'Dictionnaire' }
  ];

  const THEMES_PAGES = {
    start:{ p:'#2563EB', s:'#10B981', a:'#F59E0B', bg:'#F8FAFC', bg2:'#EFF6FF', ink:'#0F172A' },
    quiz:{ p:'#059669', s:'#2563EB', a:'#F59E0B', bg:'#ECFDF5', bg2:'#EFF6FF', ink:'#052E16' },
    admin:{ p:'#EA580C', s:'#7C3AED', a:'#06B6D4', bg:'#FFF7ED', bg2:'#F5F3FF', ink:'#431407' },
    dictionary:{ p:'#0D9488', s:'#2563EB', a:'#F59E0B', bg:'#F0FDFA', bg2:'#EFF6FF', ink:'#042F2E' },
    result:{ p:'#2563EB', s:'#7C3AED', a:'#22C55E', bg:'#EFF6FF', bg2:'#F5F3FF', ink:'#172554' },
    review:{ p:'#0F766E', s:'#4F46E5', a:'#F59E0B', bg:'#F0FDFA', bg2:'#EEF2FF', ink:'#042F2E' },
    code:{ p:'#7C3AED', s:'#06B6D4', a:'#FACC15', bg:'#F5F3FF', bg2:'#ECFEFF', ink:'#1E1B4B' }
  };

  const SUJET_ACCENTS = ['#06B6D4','#22C55E','#F97316','#EC4899','#8B5CF6','#EF4444','#14B8A6','#2563EB','#EAB308','#84CC16'];

  function value(id){ const el = document.getElementById(id); return el ? String(el.value || el.textContent || '').trim() : ''; }
  function hash(text){ let h=0; text=String(text||''); for(let i=0;i<text.length;i++){ h=((h<<5)-h+text.charCodeAt(i))|0; } return Math.abs(h); }
  function match(list, text){ return list.find(x => x.re && x.re.test(text || '')) || null; }
  function page(){
    const ids = [['screenCode','code'],['screenAdmin','admin'],['screenQuiz','quiz'],['screenResult','result'],['screenReview','review'],['screenDictionary','dictionary'],['screenStart','start']];
    for (const [id, p] of ids){ const el=document.getElementById(id); if(el && !el.classList.contains('hidden')) return p; }
    return 'start';
  }
  function context(){
    const de = $('#modeDE') && !$('#modeDE').classList.contains('hidden');
    return {
      page: page(),
      niveau: de ? value('selectDETrack') : value('selectLevel'),
      matiere: de ? value('selectDESubject') : value('selectSubject'),
      sujet: de ? value('selectDETopic') : value('selectTopic')
    };
  }
  function compose(ctx){
    const pg = THEMES_PAGES[ctx.page] || THEMES_PAGES.start;
    const nv = match(THEMES_NIVEAUX, ctx.niveau);
    const mt = match(THEMES_MATIERES, ctx.matiere + ' ' + ctx.sujet);
    return {
      primary: (mt && mt.p) || (nv && nv.p) || pg.p,
      secondary: (mt && mt.s) || (nv && nv.s) || pg.s,
      accent: ctx.sujet ? SUJET_ACCENTS[hash(ctx.sujet) % SUJET_ACCENTS.length] : ((mt && mt.a) || pg.a),
      bg: (mt && mt.bg) || (nv && nv.bg) || pg.bg,
      bg2: (nv && nv.bg2) || pg.bg2,
      ink: (nv && nv.ink) || pg.ink,
      matiereLabel: (mt && mt.label) || 'Matière'
    };
  }
  function apply(){
    const ctx = context();
    const t = compose(ctx);
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', t.primary);
    root.style.setProperty('--theme-secondary', t.secondary);
    root.style.setProperty('--theme-accent', t.accent);
    root.style.setProperty('--theme-bg', t.bg);
    root.style.setProperty('--theme-bg-2', t.bg2);
    root.style.setProperty('--theme-ink', t.ink);
    document.body.dataset.themePage = ctx.page;
    document.body.dataset.themeKey = [ctx.niveau, ctx.matiere, ctx.sujet].join('|');
    paintCards(ctx);
    updatePanel(ctx, t);
  }
  function updatePanel(ctx, t){
    let panel = $('#smartThemePanel');
    const start = $('#screenStart');
    if (!panel && start){
      panel = document.createElement('div');
      panel.id = 'smartThemePanel';
      panel.className = 'smart-theme-panel';
      start.insertBefore(panel, start.firstChild);
    }
    if (!panel) return;
    panel.innerHTML = '<div><small>Niveau</small><strong></strong></div><div><small>Matière</small><strong></strong></div><div><small>Sujet</small><strong></strong></div>';
    const vals = [ctx.niveau || 'À choisir', ctx.matiere || t.matiereLabel, ctx.sujet || 'À choisir'];
    $$('strong', panel).forEach((el,i)=> el.textContent = vals[i]);
  }
  function paintCards(ctx){
    const base = hash(ctx.niveau + ctx.matiere + ctx.sujet + ctx.page);
    $$('.card, .question, .dictItem, .reviewItem, .admin-box, .admin-count-row, .dynamic-accordion-lite').forEach((el, i) => {
      el.style.setProperty('--item-accent', SUJET_ACCENTS[(base + i) % SUJET_ACCENTS.length]);
    });
  }
  function accordions(){
    ['modeNormal','modeDE'].forEach(id => {
      const box = document.getElementById(id);
      if (!box || box.dataset.smartAccordion === '1') return;
      $$('.grid .field', box).forEach((field, i) => {
        if (field.closest('.dynamic-accordion-lite')) return;
        const label = field.querySelector('.label');
        const details = document.createElement('details');
        details.className = 'dynamic-accordion-lite';
        if (i === 0) details.open = true;
        const summary = document.createElement('summary');
        summary.textContent = (i + 1) + '. ' + (label ? label.textContent.trim() : 'Choix');
        field.parentNode.insertBefore(details, field);
        details.appendChild(summary);
        details.appendChild(field);
      });
      box.dataset.smartAccordion = '1';
    });
  }
  function bind(){
    // Interface tableau de bord: on garde les sélecteurs en cartes visibles, sans accordéons.
    apply();
    ['selectLevel','selectSubject','selectTopic','selectDETrack','selectDESubject','selectDETopic','inputDictionarySearch'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.dataset.smartThemeBound !== '1') {
        el.addEventListener('change', apply, { passive:true });
        el.addEventListener('input', apply, { passive:true });
        el.dataset.smartThemeBound = '1';
      }
    });
    document.addEventListener('click', function(){ window.setTimeout(apply, 80); }, { passive:true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, { once:true });
  else bind();
})();

/* Interface type tableau de bord + recherche niveau/matiere/sujet + menu refermable */
(function () {
  'use strict';

  let qdashSearchSuppressUntil = 0;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const text = (v) => String(v || '').trim();

  function optionValues(select) {
    if (!select) return [];
    return Array.from(select.options || []).map(o => o.value).filter(Boolean);
  }

  function isAppVisible() {
    const app = $('#appContent');
    return !!(app && !app.classList.contains('hidden'));
  }

  function forwardClick(targetId) {
    const el = document.getElementById(targetId);
    if (el && !el.classList.contains('hidden') && el.style.display !== 'none') el.click();
  }

  function closeMenu() {
    document.body.classList.add('qdash-menu-collapsed');
    document.body.classList.remove('qdash-menu-open');
  }

  function openMenu() {
    document.body.classList.remove('qdash-menu-collapsed');
    document.body.classList.add('qdash-menu-open');
  }

  function getCurrentLevelLabel() {
    return $('#selectLevel')?.value || $('#selectDETrack')?.value || 'Niveau';
  }



  function getManualLocalInfoForBadge(username) {
    const key = norm(username || '');
    const source = window.UTILISATEURS_LOCAUX_INFOS || window.LOCAL_USER_INFOS || window.localUserInfos || {};
    if (!key || !source || typeof source !== 'object') return null;
    let found = source[username] || null;
    if (!found) {
      for (const [id, value] of Object.entries(source)) {
        if (norm(id) === key) { found = value; break; }
      }
    }
    if (!found || typeof found !== 'object') return null;
    const last = text(found.nom || found.last_name || found.lastName || '');
    const first = text(found.prenom || found.prénom || found.first_name || found.firstName || '');
    const full = text(found.full_name || found.fullName || `${last} ${first}`.trim());
    const level = found.niveau || found.level || (Array.isArray(found.levels) ? found.levels[0] : '');
    return {
      levels: Array.isArray(found.levels) ? found.levels : (level ? [level] : []),
      first_name: first,
      last_name: last,
      full_name: full,
      firstName: first,
      lastName: last,
      fullName: full,
      source: 'local-manual',
      dynamic: true,
      localManual: true,
    };
  }

  function syncUserBadge() {
    const badge = $('#qdashUserName');
    const role = $('#qdashUserRole');
    const level = $('#qdashUserLevel');
    const current = localStorage.getItem('quizRevision.user.v1') || '';
    const lv = getCurrentLevelLabel();
    const manualCfg = getManualLocalInfoForBadge(current);
    if (manualCfg && current) {
      window.USERS = window.USERS || {};
      window.USERS[current] = { ...(window.USERS[current] || {}), ...manualCfg };
    }
    const cfg = manualCfg || (current && window.USERS && window.USERS[current] ? window.USERS[current] : null);
    const first = text(cfg?.first_name || cfg?.firstName || '');
    const last = text(cfg?.last_name || cfg?.lastName || '');
    const full = text(cfg?.full_name || cfg?.fullName || `${last} ${first}`.trim());
    const onlineCreated = !!(cfg && (cfg.dynamic || cfg.source === 'server' || full || first || last));

    if (badge) {
      if (current === '__ESSAI_GRATUIT__') badge.textContent = 'Essai gratuit';
      else badge.textContent = onlineCreated ? (full || current) : 'Étudiant(e)';
    }
    if (role) role.textContent = lv && lv !== 'Niveau' ? lv : 'Niveau non défini';
    if (level) level.textContent = lv;
    const adminBtn = $('#qdashNavAdmin');
    const oldAdmin = $('#btnAdmin');
    if (adminBtn) adminBtn.classList.toggle('hidden', !oldAdmin || oldAdmin.classList.contains('hidden'));
    const examBtn = $('#qdashNavExam');
    const oldExam = $('#btnModeDE');
    if (examBtn) examBtn.classList.toggle('hidden', !oldExam || oldExam.style.display === 'none');
  }

  function ensureShell() {
    const app = $('#appContent');
    if (!app || app.dataset.qdashReady === '1') return;
    app.dataset.qdashReady = '1';
    app.classList.add('qdash-shell');

    const sidebar = document.createElement('aside');
    sidebar.id = 'qdashSidebar';
    sidebar.className = 'qdash-sidebar';
    sidebar.innerHTML = `
      <div class="qdash-brand">
        <div class="qdash-logo">Q</div>
        <div><strong>Q REVISION</strong><span>Science Médicale</span></div>
      </div>
      <nav class="qdash-nav" aria-label="Menu principal">
        <div class="qdash-nav-title">Apprendre</div>
        <button type="button" id="qdashNavQuiz" class="qdash-nav-item"><span>▶</span> Commencer un Quiz</button>
        <button type="button" id="qdashNavDictionary" class="qdash-nav-item"><span>▤</span> Dictionnaire Médical</button>
        <button type="button" id="qdashNavExam" class="qdash-nav-item"><span>◒</span> Examens de fin de Formation</button>
        <div class="qdash-nav-title qdash-admin-title">Administration</div>
        <button type="button" id="qdashNavAdmin" class="qdash-nav-item hidden"><span>⚙</span> Administration</button>
      </nav>
      <div class="qdash-level-card">
        <span>Niveau actuel</span>
        <strong id="qdashUserLevel">Niveau</strong>
        <button type="button" id="qdashLevelHome">Changer de niveau</button>
      </div>
    `;
    app.insertBefore(sidebar, app.firstChild);

    const headerInner = $('.header__inner');
    if (headerInner && !$('#qdashMenuToggle')) {
      const toggle = document.createElement('button');
      toggle.id = 'qdashMenuToggle';
      toggle.className = 'qdash-menu-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Ouvrir ou fermer le menu');
      toggle.textContent = '☰';
      headerInner.insertBefore(toggle, headerInner.firstChild);

      const search = document.createElement('div');
      search.className = 'qdash-top-search';
      search.innerHTML = `<input id="qdashGlobalSearch" type="search" placeholder="Rechercher une matière ou un sujet..." autocomplete="off"><button type="button" id="qdashSearchBtn">⌕</button><div id="qdashSearchResults" class="qdash-search-results hidden"></div>`;
      const brand = $('.brand', headerInner);
      if (brand && brand.nextSibling) headerInner.insertBefore(search, brand.nextSibling);
      else headerInner.appendChild(search);

      const homeBtn = document.createElement('button');
      homeBtn.id = 'qdashHomeBtn';
      homeBtn.className = 'qdash-logout-btn qdash-home-btn';
      homeBtn.type = 'button';
      homeBtn.textContent = 'Accueil';
      homeBtn.title = 'Retour à l’accueil';
      headerInner.appendChild(homeBtn);

      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'qdashLogoutBtn';
      logoutBtn.className = 'qdash-logout-btn';
      logoutBtn.type = 'button';
      logoutBtn.textContent = 'Se déconnecter';
      logoutBtn.title = 'Se déconnecter';
      headerInner.appendChild(logoutBtn);

      const user = document.createElement('div');
      user.className = 'qdash-user-chip';
      user.innerHTML = `<span class="qdash-bell">🔔</span><span class="qdash-avatar">👩‍🎓</span><span><strong id="qdashUserName">Étudiant(e)</strong><small id="qdashUserRole">Niveau</small></span>`;
      headerInner.appendChild(user);
    }

    bindShellEvents();
    ensureDashboardBlocks();
    syncUserBadge();
  }

  function setActive(which) {
    $$('.qdash-nav-item').forEach(b => b.classList.remove('active'));
    const el = $('#qdashNav' + which);
    if (el) el.classList.add('active');
  }

  function showDashboardMode() {
    document.body.classList.add('qdash-dashboard-view');
    document.body.classList.remove('qdash-quiz-view');
    const title = $('#startTitle');
    const desc = $('#screenStart > .muted');
    if (title) title.textContent = 'Tableau de bord';
    if (desc) desc.textContent = 'Vue générale de vos révisions, matières, questions et synthèses.';
    updateDashboardStats();
  }

  function showQuizMode(mode) {
    document.body.classList.remove('qdash-dashboard-view');
    document.body.classList.add('qdash-quiz-view');
    const title = $('#startTitle');
    const desc = $('#screenStart > .muted');
    if (title) title.textContent = mode === 'de' ? 'Examen de fin de Formation' : 'Commencer un quiz';
    if (desc) desc.textContent = 'Choisis ton niveau, ta matière et ton sujet, puis démarre une session.';
    updateDashboardStats();
  }

  function bindShellEvents() {
    $('#qdashMenuToggle')?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (document.body.classList.contains('qdash-menu-collapsed')) openMenu(); else closeMenu();
    });

    $('#qdashHomeBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActive('Dashboard');
      forwardClick('btnHome');
      showDashboardMode();
      closeMenu();
    });

    $('#qdashLogoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const originalLogout = document.getElementById('btnLogout');
      if (originalLogout) originalLogout.click();
    });
    $('#qdashNavQuiz')?.addEventListener('click', () => { setActive('Quiz'); forwardClick('btnHome'); forwardClick('btnModeQuiz'); showQuizMode('normal'); closeMenu(); });
    $('#qdashNavDictionary')?.addEventListener('click', () => { setActive('Dictionary'); forwardClick('btnDictionary'); closeMenu(); });
    $('#qdashNavExam')?.addEventListener('click', () => { setActive('Exam'); forwardClick('btnHome'); forwardClick('btnModeDE'); showQuizMode('de'); closeMenu(); });
    $('#qdashNavAdmin')?.addEventListener('click', () => { setActive('Admin'); forwardClick('btnAdmin'); closeMenu(); });
    $('#qdashLevelHome')?.addEventListener('click', () => { forwardClick('btnHome'); openMenu(); });

    document.addEventListener('click', (e) => {
      const sidebar = $('#qdashSidebar');
      const toggle = $('#qdashMenuToggle');
      if (!isAppVisible() || !sidebar) return;
      if (!sidebar.contains(e.target) && !toggle?.contains(e.target)) closeMenu();
      const searchBox = $('.qdash-top-search');
      if (searchBox && !searchBox.contains(e.target)) hideSearchResults(false);
    }, true);

    ['selectLevel','selectSubject','selectTopic','selectDETrack','selectDESubject','selectDETopic'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.dataset.qdashSync !== '1') {
        el.dataset.qdashSync = '1';
        el.addEventListener('change', () => { window.setTimeout(() => { syncUserBadge(); updateDashboardStats(); runGlobalSearch(); }, 80); });
      }
    });
    $('#qdashGlobalSearch')?.addEventListener('input', runGlobalSearch);
    $('#qdashGlobalSearch')?.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideSearchResults(false); });
    $('#qdashSearchBtn')?.addEventListener('click', runGlobalSearch);
  }

  function ensureDashboardBlocks() {
    const start = $('#screenStart');
    if (!start || start.dataset.qdashDashboard === '1') return;
    start.dataset.qdashDashboard = '1';
    start.classList.add('qdash-dashboard');

    const banner = document.createElement('div');
    banner.className = 'qdash-hero-banner';
    banner.innerHTML = `
      <div><h2>Bienvenue ! 👋</h2><p>Prêt(e) à tester tes connaissances aujourd'hui ? Choisissez un sujet et commencez votre quiz.</p></div>
      <div class="qdash-hero-art" aria-hidden="true">🫀 🧬</div>
    `;
    start.insertBefore(banner, start.firstChild);

    const stats = document.createElement('div');
    stats.className = 'qdash-stat-grid';
    stats.innerHTML = `
      <div class="qdash-stat"><span>📄</span><strong id="qdashStatQuestions">0</strong><small>Questions</small></div>
      <div class="qdash-stat"><span>📚</span><strong id="qdashStatSubjects">0</strong><small>Matières</small></div>
      <div class="qdash-stat"><span>🎯</span><strong id="qdashStatTopics">0</strong><small>Sujets</small></div>
    `;
    banner.after(stats);

    const assistant = document.createElement('div');
    assistant.className = 'qdash-help-row';
    assistant.innerHTML = `
      <div><strong>Révisez à votre rythme</strong><small>Apprenez quand vous voulez, où vous voulez.</small></div>
      <div><strong>Suivez vos progrès</strong><small>Visualisez vos résultats et identifiez vos points faibles.</small></div>
      <div><strong>Entraînez-vous</strong><small>Des milliers de questions pour vous améliorer.</small></div>
      <div><strong>Réussissez</strong><small>Atteignez vos objectifs et soyez fier de vous !</small></div>
    `;
    start.appendChild(assistant);

    const synthesis = document.createElement('div');
    synthesis.className = 'qdash-synthesis-card is-collapsed';
    synthesis.id = 'qdashQuestionSynthesis';
    synthesis.innerHTML = `
      <button type="button" class="qdash-synthesis-toggle" id="qdashSynthesisToggle" aria-expanded="false">
        <span>📌 Synthèse des questions</span>
        <small id="qdashSynthesisCount">0 thème</small>
      </button>
      <p class="qdash-synthesis-note">Clique sur le bouton pour afficher les thèmes. Si un thème dépasse 40 questions, il est divisé en groupes de 40.</p>
      <div class="qdash-synthesis-list hidden" id="qdashSynthesisList"></div>
    `;
    assistant.before(synthesis);
    $('#qdashSynthesisToggle')?.addEventListener('click', () => {
      const card = $('#qdashQuestionSynthesis');
      const list = $('#qdashSynthesisList');
      const toggle = $('#qdashSynthesisToggle');
      const open = list?.classList.contains('hidden');
      if (list) list.classList.toggle('hidden', !open);
      if (card) card.classList.toggle('is-collapsed', !open);
      if (toggle) toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) updateQuestionSynthesis();
    });
    showDashboardMode();
    updateDashboardStats();
  }

  function collectAvailablePairs() {
    const selectLevel = $('#selectLevel');
    const selectSubject = $('#selectSubject');
    const selectTopic = $('#selectTopic');
    const level = selectLevel?.value || '';
    const levelKey = norm(level);
    const subjectOptions = optionValues(selectSubject).filter(s => !/^toutes/i.test(s));
    const subjectKeys = new Set(subjectOptions.map(norm));
    const pairs = [];

    subjectOptions.forEach(subject => pairs.push({ type: 'matiere', level, subject, topic: '' }));

    const questions = Array.isArray(window.QUIZ_QUESTIONS_QUIZ) ? window.QUIZ_QUESTIONS_QUIZ : (Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : []);
    questions.forEach(q => {
      const qLevel = text(q.level);
      const qSubject = text(q.subject);
      const qTopic = text(q.topic);
      if (!qSubject || !subjectKeys.has(norm(qSubject))) return;
      if (levelKey && levelKey !== norm('Tous les niveaux') && norm(qLevel) !== levelKey) return;
      if (qTopic) pairs.push({ type: 'sujet', level: qLevel || level, subject: qSubject, topic: qTopic });
    });

    optionValues(selectTopic).filter(t => !/^tous/i.test(t)).forEach(topic => {
      pairs.push({ type: 'sujet', level, subject: selectSubject?.value || '', topic });
    });

    const seen = new Set();
    return pairs.filter(p => {
      const key = [p.type, norm(p.level), norm(p.subject), norm(p.topic)].join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function hideSearchResults(clearContent = false) {
    const results = $('#qdashSearchResults');
    if (!results) return;
    results.classList.add('hidden');
    results.style.display = 'none';
    if (clearContent) results.innerHTML = '';
  }


  const THEME_PATTERNS = [
    ['Paludisme', /palud|plasmodium|anoph[eè]le|acc[eè]s palustre|goutte [eé]paisse|trophozo/i, '🦟'],
    ['Tuberculose', /tubercul|bk|bacille de koch|crachat|h[eé]moptysie|toux chronique/i, '🫁'],
    ['VIH / SIDA', /\bvih\b|\bsida\b|arv|r[eé]troviral|cd4|charge virale/i, '🧫'],
    ['Diabète', /diab[eè]te|insuline|glyc[eé]mie|hyperglyc|hypoglyc|acidoc[eé]tose/i, '🩸'],
    ['Hypertension artérielle', /hypertension|\bhta\b|tension art[eé]rielle|pression art[eé]rielle/i, '❤️'],
    ['Grossesse et accouchement', /grossesse|accouchement|parturiente|travail|dilatation|post[- ]partum|pr[eé][ -]?eclampsie|eclampsie/i, '🤰'],
    ['Nouveau-né / Néonatologie', /nouveau[- ]?n[eé]|n[eé]onat|apgar|pr[eé]matur|macrosom|allaitement/i, '👶'],
    ['Fractures et traumatologie', /fracture|luxation|entorse|traumatisme|humerus|hum[eé]rus|f[eé]mur|bassin|pl[aâ]tre/i, '🦴'],
    ['Plaies et pansements', /plaie|pansement|suppuration|cicatrisation|asepsie|antisepsie|abc[eè]s/i, '🩹'],
    ['Mitose', /\bmitose\b|division cellulaire|chromosome|prophase|metaphase|métaphase|anaphase|telophase|télophase/i, '🧬'],
    ['Méiose', /\bmeiose\b|\bméiose\b|gamete|gamète|haploide|haploïde/i, '🧬'],
    ['Diagnostic', /diagnostic|examen complementaire|examen complémentaire|bilan|scanner|radio|radiograph|echographie|échographie|analyse|s[eé]rologie|test rapide/i, '🩺'],
    ['Signes cliniques des maladies', /signe clinique|symptome|symptôme|douleur|fi[eè]vre|fievre|dyspnee|dyspnée|œdeme|oedeme|saignement|vomissement|diarrh[eé]e|c[eé]phal[eé]e/i, '❤️'],
    ['Physiopathologie / mécanismes importants', /physiopath|mecanisme|mécanisme|cause|etiologie|étiologie|facteur|pathogen|transmission|contamination/i, '⚙️'],
    ['Prise en charge', /prise en charge|traitement|soin|conduite a tenir|conduite à tenir|surveillance|prevention|prévention|infirmier|r[eé]f[eé]rer|urgence/i, '💉'],
    ['Complications', /complication|risque|séquelle|sequelle|choc|hemorrag|hémorrag|infection|d[eé]shydratation|d[eé]tresse/i, '🟣'],
    ['Cas cliniques', /cas clinique|patient|patiente|nouveau-ne|nouveau-né|enfant de|homme de|femme de|se pr[eé]sente/i, '⚕️'],
    ['Définition et classification', /definition|définition|classification|type|forme|stade|grade|d[eé]finir/i, '📘']
  ];

  function synthesisQuestionSignature(q) {
    const main = text(q?.question || q?.text || q?.statement || '');
    const choices = Array.isArray(q?.choices) ? q.choices.map(text).join(' ') : '';
    const indexedAnswer = Array.isArray(q?.answerIndices) ? q.answerIndices.map(n => Array.isArray(q?.choices) ? text(q.choices[n]) : String(n)).join(' ') : '';
    const singleAnswer = Number.isInteger(q?.answerIndex) && Array.isArray(q?.choices) ? text(q.choices[q.answerIndex]) : '';
    const answer = Array.isArray(q?.answer) ? q.answer.map(text).join(' ') : text(q?.answer || q?.correct || indexedAnswer || singleAnswer || '');
    return norm([main, choices, answer].join(' ')).replace(/^(q|question)\s*\d+[.):-]?\s*/i, '').replace(/[^a-z0-9àâäçéèêëîïôöùûüÿñæœ ]/gi, ' ').replace(/\s+/g, ' ').trim();
  }

  function readAppSettingsForSynthesis() {
    try {
      return JSON.parse(localStorage.getItem('quizRevision.appSettings.v1') || '{}') || {};
    } catch (_) {
      return {};
    }
  }

  function questionBankForSynthesis() {
    const settings = readAppSettingsForSynthesis();
    const deletedIds = new Set(Array.isArray(settings.deletedQuestionIds) ? settings.deletedQuestionIds.map(String) : []);
    const banks = [];
    // Sources automatiques : questions natives, questions EFF, questions ajoutées/importées
    // depuis l'administration, et questions ajoutées manuellement dans les tableaux JS.
    const sources = [
      window.QDASH_ALL_RAW_QUESTIONS,
      window.QUIZ_QUESTIONS_QUIZ,
      window.QUIZ_QUESTIONS,
      window.QUIZ_QUESTIONS_DE,
      settings.customQuestions
    ];
    sources.forEach(src => { if (Array.isArray(src)) banks.push(...src); });
    const seen = new Set();
    return banks.filter(q => {
      if (!q || deletedIds.has(String(q.id || ''))) return false;
      // Ne pas afficher ni compter les doublons dans la synthèse :
      // on compare d'abord le contenu de la question, puis les propositions et la réponse,
      // afin de supprimer les doublons même quand leurs identifiants sont différents.
      const signature = synthesisQuestionSignature(q) || norm(text(q.id || JSON.stringify(q).slice(0, 160)));
      if (!signature || seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
  }

  function themeForQuestion(q) {
    const rawTopic = text(q.topic);
    const ignoredTopic = !rawTopic || /^tous les sujets$/i.test(rawTopic) || /^sujet\s*(examen|\d+|n[°o]?|de)?/i.test(rawTopic) || /^examen/i.test(rawTopic);
    const body = [q.question, q.text, q.statement, q.explanation, Array.isArray(q.choices) ? q.choices.join(' ') : '', ignoredTopic ? '' : rawTopic].map(text).join(' ');
    for (const [label, re, icon] of THEME_PATTERNS) {
      if (re.test(body)) return { label, icon };
    }
    if (!ignoredTopic) return { label: rawTopic, icon: '📚' };
    return { label: 'Autres questions importantes', icon: '📌' };
  }

  function questionKey(q) {
    return text(q.id || q.question || q.text || q.statement || JSON.stringify(q).slice(0, 120));
  }

  function synthesisKeyForQuestion(q) {
    return [questionKey(q), synthesisQuestionSignature(q)].filter(Boolean).join('||QDASH_SIG||');
  }

  function qMatchesCurrentSelection(q) {
    const level = $('#selectLevel')?.value || '';
    const subject = $('#selectSubject')?.value || '';
    if (level && !/^tous les niveaux$/i.test(level) && norm(q.level) !== norm(level)) return false;
    if (subject && !/^toutes les matières$/i.test(subject) && norm(q.subject) !== norm(subject)) return false;
    return true;
  }

  function collectThemeGroups() {
    const groups = new Map();
    questionBankForSynthesis().filter(qMatchesCurrentSelection).forEach(q => {
      const theme = themeForQuestion(q);
      const key = norm(theme.label);
      if (!groups.has(key)) {
        groups.set(key, { label: theme.label, icon: theme.icon, keys: [], subjects: new Set(), topics: new Set(), samples: [] });
      }
      const g = groups.get(key);
      const launchKey = synthesisKeyForQuestion(q);
      if (!launchKey) return;
      g.keys.push(launchKey);
      if (q.subject) g.subjects.add(text(q.subject));
      if (q.topic) g.topics.add(text(q.topic));
      if (g.samples.length < 2 && q.question) g.samples.push(text(q.question));
    });
    return Array.from(groups.values()).sort((a, b) => b.keys.length - a.keys.length || a.label.localeCompare(b.label, 'fr'));
  }

  function startSynthesisGroup({ level, subject, theme, keys }) {
    if (typeof window.QDASH_START_GROUPED_QUIZ === 'function') {
      return window.QDASH_START_GROUPED_QUIZ({ level, subject, theme, keys });
    }
    return forwardClick('btnStart');
  }

  function updateQuestionSynthesis() {
    const box = $('#qdashSynthesisList');
    const count = $('#qdashSynthesisCount');
    if (!box) return;
    const groups = collectThemeGroups().filter(g => Array.isArray(g.keys) && g.keys.length > 0);
    if (count) count.textContent = `${groups.length} thème${groups.length > 1 ? 's' : ''}`;
    box.innerHTML = '';
    if (!groups.length) {
      box.innerHTML = '<div class="qdash-synthesis-empty">Aucune question trouvée pour le niveau et la matière sélectionnés.</div>';
      return;
    }

    groups.slice(0, 20).forEach((g, idx) => {
      const chunks = [];
      for (let i = 0; i < g.keys.length; i += 40) chunks.push(g.keys.slice(i, i + 40));
      const currentSubject = $('#selectSubject')?.value || 'Toutes les matières';
      const subject = (!currentSubject || /^toutes/i.test(currentSubject)) ? 'Toutes les matières' : currentSubject;
      const level = $('#selectLevel')?.value || 'Tous les niveaux';
      const accent = ['#E11D48','#2563EB','#16A34A','#7C3AED','#F97316','#0D9488'][idx % 6];

      if (chunks.length > 1) {
        const card = document.createElement('div');
        card.className = 'qdash-theme-row qdash-theme-row-with-select';
        card.style.setProperty('--theme-row-accent', accent);
        const selectId = `qdashThemeGroupSelect_${idx}_${Date.now()}`;
        const options = chunks.map((keys, chunkIndex) => {
          const from = chunkIndex * 40 + 1;
          const to = chunkIndex * 40 + keys.length;
          return `<option value="${chunkIndex}">Groupe ${chunkIndex + 1} — questions ${from} à ${to}</option>`;
        }).join('');
        card.innerHTML = `
          <span class="qdash-theme-icon">${g.icon}</span>
          <span class="qdash-theme-main">
            <strong>${g.label}</strong>
            <small>${g.keys.length} questions sans doublons, divisées en ${chunks.length} groupes de 40 maximum.</small>
            <select class="qdash-theme-group-select" id="${selectId}" aria-label="Choisir un groupe pour ${g.label.replace(/"/g, '&quot;')}">${options}</select>
          </span>
          <button type="button" class="qdash-theme-start-btn">Commencer</button>
        `;
        const select = card.querySelector('select');
        const startBtn = card.querySelector('.qdash-theme-start-btn');
        const launchSelected = async () => {
          const chunkIndex = Number(select?.value || 0);
          const keys = chunks[chunkIndex] || chunks[0] || [];
          await startSynthesisGroup({ level, subject, theme: `${g.label} — groupe ${chunkIndex + 1}`, keys });
        };
        startBtn?.addEventListener('click', launchSelected);
        select?.addEventListener('click', (e) => e.stopPropagation());
        select?.addEventListener('change', (e) => e.stopPropagation());
        box.appendChild(card);
        return;
      }

      const keys = chunks[0] || [];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qdash-theme-row';
      btn.style.setProperty('--theme-row-accent', accent);
      const range = g.samples[0] ? `<small>${g.samples[0]}</small>` : '<small>Clique pour lancer directement ce thème.</small>';
      btn.innerHTML = `
        <span class="qdash-theme-icon">${g.icon}</span>
        <span class="qdash-theme-main"><strong>${g.label}</strong>${range}</span>
        <span class="qdash-theme-count">${keys.length} question${keys.length > 1 ? 's' : ''}</span>
      `;
      btn.addEventListener('click', async () => {
        await startSynthesisGroup({ level, subject, theme: g.label, keys });
      });
      box.appendChild(btn);
    });
  }

  function updateDashboardStats() {
    const qInfo = $('#questionBankInfo')?.textContent || '';
    const qMatch = qInfo.match(/\d+/);
    const pairs = collectAvailablePairs();
    const subjects = new Set(pairs.map(p => norm(p.subject)).filter(Boolean));
    const topics = new Set(pairs.map(p => norm(p.topic)).filter(Boolean));
    if ($('#qdashStatQuestions')) $('#qdashStatQuestions').textContent = qMatch ? qMatch[0] : '0';
    if ($('#qdashStatSubjects')) $('#qdashStatSubjects').textContent = String(subjects.size || optionValues($('#selectSubject')).length || 0);
    if ($('#qdashStatTopics')) $('#qdashStatTopics').textContent = String(topics.size || optionValues($('#selectTopic')).length || 0);
    const synthesisList = $('#qdashSynthesisList');
    if (synthesisList && !synthesisList.classList.contains('hidden')) updateQuestionSynthesis();
  }

  function chooseResult(item) {
    const subject = $('#selectSubject');
    const topic = $('#selectTopic');
    const input = $('#qdashGlobalSearch');
    qdashSearchSuppressUntil = Date.now() + 900;
    hideSearchResults(true);
    if (input) {
      input.value = item.topic || item.subject || '';
      input.blur();
    }
    forwardClick('btnModeQuiz');
    if (item.subject && subject) {
      subject.value = item.subject;
      subject.dispatchEvent(new Event('change', { bubbles: true }));
    }
    window.setTimeout(() => {
      if (item.topic && topic) {
        const opt = optionValues(topic).find(v => norm(v) === norm(item.topic));
        if (opt) {
          topic.value = opt;
          topic.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
      hideSearchResults(true);
      forwardClick('btnHome');
      syncUserBadge();
      updateDashboardStats();
      window.setTimeout(() => hideSearchResults(true), 120);
    }, 140);
  }

  function runGlobalSearch() {
    const input = $('#qdashGlobalSearch');
    const results = $('#qdashSearchResults');
    if (!input || !results) return;
    if (Date.now() < qdashSearchSuppressUntil) { hideSearchResults(true); return; }
    const q = norm(input.value);
    if (!q) { hideSearchResults(true); return; }
    const matches = collectAvailablePairs().filter(p => norm(p.subject + ' ' + p.topic).includes(q)).slice(0, 12);
    if (!matches.length) {
      results.innerHTML = `<div class="qdash-result-empty">Aucun résultat dans votre niveau actuel.</div>`;
      results.style.display = '';
      results.classList.remove('hidden');
      return;
    }
    results.innerHTML = '';
    matches.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qdash-result-item';
      btn.innerHTML = `<strong>${item.type === 'matiere' ? item.subject : item.topic}</strong><small>${item.type === 'matiere' ? 'Matière' : 'Sujet'} • ${item.subject || 'Toutes les matières'} • ${item.level || 'niveau actuel'}</small>`;
      btn.addEventListener('click', (e) => { e.stopPropagation(); chooseResult(item); });
      results.appendChild(btn);
    });
    results.style.display = '';
    results.classList.remove('hidden');
  }

  function qdashSynthesisFingerprint() {
    try {
      const bank = questionBankForSynthesis();
      // Empreinte légère pour garder le site rapide : pas de parcours complet du texte
      // des questions à chaque contrôle automatique. Les ajouts/suppressions/modifications
      // déclenchées par l'administration appellent aussi qdash:questions-updated.
      const first = bank[0] || {};
      const last = bank[bank.length - 1] || {};
      return [bank.length, text(first.id), text(last.id), text(last.subject), text(last.topic)].join('|');
    } catch (_) {
      return String(Date.now());
    }
  }

  let qdashLastSynthesisFingerprint = '';
  let qdashRefreshTimer = null;
  function refreshSynthesisIfVisible() {
    if (qdashRefreshTimer) window.clearTimeout(qdashRefreshTimer);
    qdashRefreshTimer = window.setTimeout(() => {
      qdashLastSynthesisFingerprint = qdashSynthesisFingerprint();
      updateDashboardStats();
      const synthesisList = $('#qdashSynthesisList');
      if (synthesisList && !synthesisList.classList.contains('hidden')) updateQuestionSynthesis();
    }, 120);
  }

  function enableAutomaticSynthesisRefresh() {
    if (window.__qdashSynthesisAutoRefresh) return;
    window.__qdashSynthesisAutoRefresh = true;

    // Fonction publique : l'administration et les ajouts manuels peuvent appeler
    // window.QDASH_REFRESH_SYNTHESIS() après insertion/modification de questions.
    window.QDASH_REFRESH_SYNTHESIS = refreshSynthesisIfVisible;

    const originalSetItem = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function qdashSetItem(key, value) {
      const result = originalSetItem(key, value);
      if (key === 'quizRevision.appSettings.v1') {
        window.dispatchEvent(new CustomEvent('qdash:questions-updated', { detail: { source: 'localStorage' } }));
      }
      return result;
    };

    window.addEventListener('qdash:questions-updated', refreshSynthesisIfVisible);
    window.addEventListener('storage', (event) => {
      if (!event || event.key === 'quizRevision.appSettings.v1') refreshSynthesisIfVisible();
    });

    // Sécurité pour les ajouts manuels dans un fichier JS ou dans la console :
    // si un tableau de questions est modifié sans passer par l'administration,
    // la synthèse se recalcule toute seule.
    qdashLastSynthesisFingerprint = qdashSynthesisFingerprint();
    window.setInterval(() => {
      const app = $('#appContent');
      if (!app || app.classList.contains('hidden')) return;
      const synthesisList = $('#qdashSynthesisList');
      const shouldCheck = synthesisList && !synthesisList.classList.contains('hidden');
      if (!shouldCheck) return;
      const nextFingerprint = qdashSynthesisFingerprint();
      if (nextFingerprint !== qdashLastSynthesisFingerprint) {
        qdashLastSynthesisFingerprint = nextFingerprint;
        refreshSynthesisIfVisible();
      }
    }, 6000);
  }

  function boot() {
    enableAutomaticSynthesisRefresh();
    ensureShell();
    if (isAppVisible()) { openMenu(); syncUserBadge(); updateDashboardStats(); }
    const app = $('#appContent');
    if (app && !app.dataset.qdashObserver) {
      app.dataset.qdashObserver = '1';
      new MutationObserver(() => {
        ensureShell();
        if (isAppVisible()) { syncUserBadge(); updateDashboardStats(); }
      }).observe(app, { attributes: true, attributeFilter: ['class'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();

/* Correction connexion : masquer l'interface connectée sans bloquer l'authentification */
(function(){
  'use strict';
  function syncLoginView(){
    var screenCode = document.getElementById('screenCode');
    var appContent = document.getElementById('appContent');
    var loginVisible = !!(screenCode && !screenCode.classList.contains('hidden'));

    document.body.classList.toggle('qdash-login-view', loginVisible);
    document.body.classList.toggle('qdash-auth-view', !loginVisible && !!(appContent && !appContent.classList.contains('hidden')));

    if (loginVisible) {
      document.body.classList.remove('qdash-menu-open');
      document.body.classList.add('qdash-menu-collapsed');
    } else {
      // Très important : dès que la connexion est validée, on retire immédiatement
      // le mode page de connexion afin que le CSS ne bloque jamais l'affichage du site.
      document.body.classList.remove('qdash-login-view');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncLoginView, {once:true});
  else syncLoginView();
  var observer = new MutationObserver(syncLoginView);
  ['screenCode','appContent'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) observer.observe(el, {attributes:true, attributeFilter:['class']});
  });
  window.addEventListener('pageshow', syncLoginView);
})();
