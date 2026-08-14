import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { FIREBASE_CONFIG } from './firebase-config.js';

(function () {
  'use strict';

  const SESSION_KEY = 'powerhouseIndependentLivingSessionV2';
  const DEFAULT_STAFF_USERNAME = 'admin';
  const DEFAULT_STAFF_PASSWORD = 'powerhouse';

  const q = (text, icon) => ({ text, icon });

  const ZONES = [
    {
      id: 'bedroom',
      title: 'Bedroom and getting ready',
      short: 'Bedroom',
      icon: 'fa-bed',
      image: 'assets/zones/bedroom.jpg',
      intro: 'Think about getting dressed, organising your things and being ready for the day.',
      questions: [
        q('I choose clothes that are right for the weather and what I am doing.', 'fa-cloud'),
        q('I get dressed by myself, including fastenings such as buttons or zips.', 'fa-male'),
        q('I make my bed.', 'fa-bed'),
        q('I tidy my bedroom and put things back in the right place.', 'fa-archive'),
        q('I put clean clothes away in drawers or a wardrobe.', 'fa-archive'),
        q('I get my bag and belongings ready before I need to leave.', 'fa-briefcase'),
        q('I can pack the things I need for a day out or overnight stay.', 'fa-suitcase'),
        q('I can follow my own morning routine and be ready on time.', 'fa-clock-o')
      ]
    },
    {
      id: 'bathroom',
      title: 'Bathroom and self-care',
      short: 'Bathroom',
      icon: 'fa-shower',
      image: 'assets/zones/bathroom.jpg',
      intro: 'Think about washing, personal care and leaving the bathroom ready for the next person.',
      questions: [
        q('I wash or shower myself.', 'fa-shower'),
        q('I dry myself properly after washing.', 'fa-tint'),
        q('I brush my teeth as part of my daily routine.', 'fa-smile-o'),
        q('I use deodorant and other personal care items I need.', 'fa-magic'),
        q('I wash and manage my hair.', 'fa-scissors'),
        q('I use the toilet and leave it clean for the next person.', 'fa-bath'),
        q('I notice when toiletries are running low and tell someone or add them to a list.', 'fa-shopping-basket'),
        q('I leave the bathroom tidy and put wet towels or clothes in the right place.', 'fa-tint')
      ]
    },
    {
      id: 'kitchen',
      title: 'Kitchen, food and drinks',
      short: 'Kitchen',
      icon: 'fa-cutlery',
      image: 'assets/zones/kitchen.jpg',
      intro: 'Think about making food and drinks safely, cleaning up and storing food correctly.',
      questions: [
        q('I make myself a cold drink.', 'fa-glass'),
        q('I make a hot drink safely.', 'fa-coffee'),
        q('I make my own breakfast.', 'fa-cutlery'),
        q('I prepare a simple meal or snack.', 'fa-cutlery'),
        q('I use kitchen equipment safely, such as a microwave, toaster, hob or oven when appropriate.', 'fa-fire'),
        q('I wash crockery, cutlery and cooking equipment after using it.', 'fa-cutlery'),
        q('I load or unload a dishwasher if there is one at home.', 'fa-refresh'),
        q('I wipe kitchen worktops and leave the food preparation area clean.', 'fa-eraser'),
        q('I check use-by dates and recognise food that may not be safe to eat.', 'fa-calendar-times-o'),
        q('I put food back in the fridge, freezer or cupboard in the correct place.', 'fa-archive')
      ]
    },
    {
      id: 'laundry',
      title: 'Laundry and clothes care',
      short: 'Laundry',
      icon: 'fa-refresh',
      image: 'assets/zones/laundry.jpg',
      intro: 'Think about washing, drying and looking after your clothes.',
      questions: [
        q('I sort clothes ready for washing.', 'fa-random'),
        q('I check pockets before clothes go into the washing machine.', 'fa-search'),
        q('I use a washing machine on a suitable setting.', 'fa-refresh'),
        q('I add the right amount of washing detergent or laundry product.', 'fa-flask'),
        q('I use a tumble dryer safely when one is available.', 'fa-sun-o'),
        q('I hang clothes on a clothes horse or washing line to dry.', 'fa-sun-o'),
        q('I fold clean clothes.', 'fa-compress'),
        q('I iron simple items safely when needed.', 'fa-thermometer-half'),
        q('I notice when clothing is damaged or needs replacing.', 'fa-exclamation-circle')
      ]
    },
    {
      id: 'cleaning',
      title: 'Cleaning and shared spaces',
      short: 'House jobs',
      icon: 'fa-home',
      image: 'assets/zones/cleaning.jpg',
      intro: 'Think about the jobs that help keep bedrooms and shared spaces clean and comfortable.',
      questions: [
        q('I vacuum or sweep a floor.', 'fa-magic'),
        q('I mop a hard floor and leave it safe to walk on.', 'fa-tint'),
        q('I dust or wipe surfaces.', 'fa-eraser'),
        q('I clean up a spill when it happens.', 'fa-tint'),
        q('I change my bedding.', 'fa-bed'),
        q('I help keep shared rooms tidy.', 'fa-home'),
        q('I empty bins and sort recycling into the right bin.', 'fa-recycle'),
        q('I use household cleaning products safely and follow the label.', 'fa-flask'),
        q('I complete regular jobs around the house without always being asked.', 'fa-check-circle')
      ]
    },
    {
      id: 'safety',
      title: 'Home safety and basic maintenance',
      short: 'Home safety',
      icon: 'fa-shield',
      image: 'assets/zones/safety.jpg',
      intro: 'Think about spotting problems, staying safe and knowing when to get help.',
      questions: [
        q('I notice trip hazards, broken items or other problems that could be unsafe.', 'fa-exclamation-triangle'),
        q('I know not to use damaged plugs, chargers or wires and I tell someone about them.', 'fa-plug'),
        q('I know what to do if I notice a water leak.', 'fa-tint'),
        q('I know what to do if I smell gas and that I should not try to repair it myself.', 'fa-fire'),
        q('I can adjust the thermostat or heating controls to a sensible temperature.', 'fa-thermometer-half'),
        q('I can tighten a simple loose screw using the correct tool.', 'fa-wrench'),
        q('I can change a lightbulb safely after the power is off and the bulb is cool.', 'fa-lightbulb-o'),
        q('I know where smoke alarms are and I tell someone if an alarm is damaged or beeping.', 'fa-bell'),
        q('I know when a job is unsafe for me and I should get help instead of trying it myself.', 'fa-hand-paper-o')
      ]
    },
    {
      id: 'shopping',
      title: 'Shopping and storage',
      short: 'Shopping',
      icon: 'fa-shopping-basket',
      image: 'assets/zones/shopping.jpg',
      intro: 'Think about planning shopping, unpacking it and putting things in the correct places.',
      questions: [
        q('I help make a shopping list for things the home needs.', 'fa-list'),
        q('I put shopping away in the correct places.', 'fa-shopping-basket'),
        q('I know which foods belong in the fridge, freezer or cupboard.', 'fa-snowflake-o'),
        q('I store cleaning products away from food and in a safe place.', 'fa-lock'),
        q('I rotate food so older items are used before newer items.', 'fa-sort-amount-asc'),
        q('I notice when basic household items are running low.', 'fa-exclamation-circle'),
        q('I can choose a sensible replacement when an item I normally buy is unavailable.', 'fa-exchange'),
        q('I can help carry and unpack shopping without damaging items.', 'fa-shopping-bag')
      ]
    },
    {
      id: 'organisation',
      title: 'Home organisation and getting help',
      short: 'Getting help',
      icon: 'fa-key',
      image: 'assets/zones/organisation.jpg',
      intro: 'Think about remembering important information, organising jobs and asking the right person for help.',
      questions: [
        q('I know my home address and postcode.', 'fa-map-marker'),
        q('I keep important belongings such as keys, phone and wallet in a safe place.', 'fa-key'),
        q('I can use a calendar or reminder for appointments and household jobs.', 'fa-calendar-check-o'),
        q('I can explain a household problem clearly to someone who can help.', 'fa-commenting'),
        q('I can phone or message a landlord, housing service or tradesperson when a repair is needed.', 'fa-phone'),
        q('I know the difference between an urgent problem and something that can wait.', 'fa-clock-o'),
        q('I answer the door safely and check who is there before letting anyone in.', 'fa-eye'),
        q('I know who I can contact if I need help at home.', 'fa-address-book'),
        q('I can take responsibility for a household job from start to finish.', 'fa-check-square-o')
      ]
    }
  ];

  const ANSWERS = [
    { value: 3, label: 'On my own', icon: 'fa-check-circle' },
    { value: 2, label: 'With a reminder', icon: 'fa-bell-o' },
    { value: 1, label: 'With some help', icon: 'fa-users' },
    { value: 0, label: 'Not yet', icon: 'fa-circle-o' }
  ];

  let db = { version: 2, staff: null, classes: [], students: [] };
  let session = loadSession();
  let loginRole = 'student';
  let adminView = 'dashboard';
  let studentView = 'home';
  let currentZone = 0;
  let firestore = null;
  let firebaseReady = false;
  let bootstrapError = null;

  function uid(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function defaultClasses() {
    return [
      { id: 'mint', name: 'Mint' },
      { id: 'peach', name: 'Peach' },
      { id: 'amber', name: 'Amber' },
      { id: 'teal', name: 'Teal' },
      { id: 'sage', name: 'Sage' },
      { id: 'orange', name: 'Orange' }
    ];
  }

  function blankAssessment() {
    return { answers: {}, startedAt: null, updatedAt: null, completedAt: null };
  }

  function firebaseConfigured() {
    const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
    return FIREBASE_CONFIG && required.every(key => {
      const value = String(FIREBASE_CONFIG[key] || '');
      return value && !value.includes('PASTE_');
    });
  }

  async function hashText(value) {
    const bytes = new TextEncoder().encode(String(value));
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function ensureSeedData() {
    const adminRef = doc(firestore, 'settings', 'admin');
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        username: DEFAULT_STAFF_USERNAME,
        passwordHash: await hashText(DEFAULT_STAFF_PASSWORD),
        updatedAt: new Date().toISOString()
      });
    }

    const classSnap = await getDocs(collection(firestore, 'classes'));
    if (classSnap.empty) {
      for (const item of defaultClasses()) {
        await setDoc(doc(firestore, 'classes', item.id), {
          name: item.name,
          createdAt: new Date().toISOString()
        });
      }
    }
  }

  async function refreshData() {
    const [adminSnap, classSnap, learnerSnap] = await Promise.all([
      getDoc(doc(firestore, 'settings', 'admin')),
      getDocs(collection(firestore, 'classes')),
      getDocs(collection(firestore, 'learners'))
    ]);

    const staffData = adminSnap.exists() ? adminSnap.data() : null;
    db.staff = staffData ? {
      username: String(staffData.username || DEFAULT_STAFF_USERNAME).toLowerCase(),
      passwordHash: String(staffData.passwordHash || '')
    } : null;

    const preferredClassOrder = ['mint', 'peach', 'amber', 'teal', 'sage', 'orange'];
    db.classes = classSnap.docs.map(snap => ({ id: snap.id, ...snap.data() }))
      .map(item => ({ id: item.id, name: String(item.name || 'Class') }))
      .sort((a, b) => {
        const ai = preferredClassOrder.indexOf(a.id);
        const bi = preferredClassOrder.indexOf(b.id);
        if (ai >= 0 && bi >= 0) return ai - bi;
        if (ai >= 0) return -1;
        if (bi >= 0) return 1;
        return a.name.localeCompare(b.name);
      });

    db.students = learnerSnap.docs.map(snap => {
      const data = snap.data();
      return {
        id: snap.id,
        name: String(data.name || 'Learner'),
        classId: String(data.classId || ''),
        username: String(data.username || '').toLowerCase(),
        passwordHash: String(data.passwordHash || ''),
        assessment: data.assessment && typeof data.assessment === 'object'
          ? {
              answers: data.assessment.answers && typeof data.assessment.answers === 'object' ? data.assessment.answers : {},
              startedAt: data.assessment.startedAt || null,
              updatedAt: data.assessment.updatedAt || null,
              completedAt: data.assessment.completedAt || null
            }
          : blankAssessment()
      };
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  async function saveStudent(student) {
    await setDoc(doc(firestore, 'learners', student.id), {
      name: student.name,
      classId: student.classId,
      username: student.username.toLowerCase(),
      passwordHash: student.passwordHash,
      assessment: student.assessment || blankAssessment(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  async function saveAssessment(student) {
    await setDoc(doc(firestore, 'learners', student.id), {
      assessment: student.assessment || blankAssessment(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  async function deleteStudentRecord(studentId) {
    await deleteDoc(doc(firestore, 'learners', studentId));
  }

  async function saveClass(item) {
    await setDoc(doc(firestore, 'classes', item.id), {
      name: item.name,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  async function deleteClassRecord(classId) {
    await deleteDoc(doc(firestore, 'classes', classId));
  }

  async function saveStaff() {
    await setDoc(doc(firestore, 'settings', 'admin'), {
      username: db.staff.username.toLowerCase(),
      passwordHash: db.staff.passwordHash,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  function loadSession() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  function saveSession() {
    if (session) sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(SESSION_KEY);
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  let activeSpeechButton = null;

  function resetSpeechButton(button) {
    if (!button) return;
    button.dataset.speaking = 'false';
    button.classList.remove('speaking');
    button.innerHTML = '<i class="fa fa-volume-up" aria-hidden="true"></i><span>Read aloud</span>';
  }

  function speakText(text, button) {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      alert('Read aloud is not available in this browser. Try Chrome, Edge or Safari.');
      return;
    }

    if (button && button.dataset.speaking === 'true') {
      window.speechSynthesis.cancel();
      resetSpeechButton(button);
      activeSpeechButton = null;
      return;
    }

    window.speechSynthesis.cancel();
    if (activeSpeechButton) resetSpeechButton(activeSpeechButton);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => String(v.lang).toLowerCase() === 'en-gb') || voices.find(v => String(v.lang).toLowerCase().startsWith('en'));
    if (preferred) utterance.voice = preferred;

    if (button) {
      activeSpeechButton = button;
      button.dataset.speaking = 'true';
      button.classList.add('speaking');
      button.innerHTML = '<i class="fa fa-stop-circle" aria-hidden="true"></i><span>Stop</span>';
    }

    const finish = function () {
      if (button) resetSpeechButton(button);
      if (activeSpeechButton === button) activeSpeechButton = null;
    };
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
  }

  function zoneIcon(zone) {
    return `<i class="fa ${esc(zone.icon)}" aria-hidden="true"></i>`;
  }

  function className(classId) {
    const item = db.classes.find(c => c.id === classId);
    return item ? item.name : 'No class';
  }

  function getStudent() {
    return session && session.role === 'student' ? db.students.find(s => s.id === session.userId) : null;
  }

  function totalQuestions() {
    return ZONES.reduce((sum, z) => sum + z.questions.length, 0);
  }

  function answerKey(zoneId, index) {
    return zoneId + ':' + index;
  }

  function assessmentStats(student) {
    const answers = (student && student.assessment && student.assessment.answers) || {};
    let answered = 0;
    let points = 0;
    let max = 0;
    const zoneStats = [];

    ZONES.forEach(zone => {
      let zoneAnswered = 0;
      let zonePoints = 0;
      zone.questions.forEach((q, index) => {
        const key = answerKey(zone.id, index);
        max += 3;
        if (Object.prototype.hasOwnProperty.call(answers, key)) {
          const value = Number(answers[key]);
          answered += 1;
          zoneAnswered += 1;
          points += value;
          zonePoints += value;
        }
      });
      const zoneMax = zone.questions.length * 3;
      zoneStats.push({
        id: zone.id,
        title: zone.short,
        answered: zoneAnswered,
        total: zone.questions.length,
        complete: zoneAnswered === zone.questions.length,
        score: zoneMax ? Math.round((zonePoints / zoneMax) * 100) : 0
      });
    });

    return {
      answered,
      total: totalQuestions(),
      points,
      max,
      complete: answered === totalQuestions(),
      progress: Math.round((answered / totalQuestions()) * 100),
      score: answered ? Math.round((points / (answered * 3)) * 100) : 0,
      finalScore: max ? Math.round((points / max) * 100) : 0,
      zoneStats
    };
  }

  function scoreLevel(score) {
    if (score < 30) return { name: 'Starting out', message: 'You are building the basics. Pick one or two skills to practise first.' };
    if (score < 55) return { name: 'Developing', message: 'You can do some tasks and are building confidence with others.' };
    if (score < 80) return { name: 'Increasing independence', message: 'You are doing many home tasks with growing independence.' };
    return { name: 'Confident', message: 'You are showing strong independence across many home skills.' };
  }

  function handleSaveError(error) {
    console.error(error);
    alert('Your latest change could not be saved online. Check the internet connection and try again.');
  }

  function render() {
    if (!session) return renderLogin();
    if (session.role === 'staff') return renderStaff();
    if (session.role === 'student' && getStudent()) return renderStudent();
    logout();
  }

  function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <main class="login-page">
        <section class="login-shell">
          <div class="login-intro">
            <div>
              <img class="brand-lockup" src="assets/powerhouse-logo.png" alt="The Powerhouse">
              <h1>Independent Living Skills Check</h1>
              <p>Move through the home, think about what you can do now and find the skills you want to practise next.</p>
              <div class="intro-pills">
                <span class="intro-pill">Home skills</span>
                <span class="intro-pill">Self-care</span>
                <span class="intro-pill">Safety</span>
                <span class="intro-pill">Confidence</span>
              </div>
            </div>
            <p>West SILC Powerhouse - training tool for learning and practice.</p>
          </div>
          <div class="login-card ${loginRole === 'staff' ? 'admin-login-mode' : ''}">
            <button class="admin-access-btn" id="adminAccessBtn" type="button" aria-label="Administration" title="Settings">
              <i class="fa ${loginRole === 'staff' ? 'fa-unlock-alt' : 'fa-cog'}" aria-hidden="true"></i>
            </button>
            <div class="login-heading-row">
              <div>
                <h2>Sign in</h2>
                <p class="sub">Enter your username and password.</p>
              </div>
              ${loginRole === 'staff' ? '<div class="admin-mode-mark"><i class="fa fa-lock" aria-hidden="true"></i></div>' : ''}
            </div>
            <form id="loginForm" class="form-grid">
              <div class="field">
                <label for="loginUsername">Username</label>
                <input id="loginUsername" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required>
              </div>
              <div class="field">
                <label for="loginSecret">Password</label>
                <div class="password-field-wrap">
                  <input id="loginSecret" name="secret" type="password" autocomplete="current-password" required>
                  <button class="password-toggle" id="passwordToggle" type="button" aria-label="Show password"><i class="fa fa-eye" aria-hidden="true"></i></button>
                </div>
              </div>
              <button class="lime-btn" id="loginSubmit" type="submit">Sign in</button>
            </form>
            <div id="loginError" class="error-box"></div>
          </div>
        </section>
      </main>`;

    document.getElementById('adminAccessBtn').addEventListener('click', function () {
      loginRole = loginRole === 'staff' ? 'student' : 'staff';
      renderLogin();
    });

    document.getElementById('passwordToggle').addEventListener('click', function () {
      const input = document.getElementById('loginSecret');
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      this.innerHTML = `<i class="fa ${showing ? 'fa-eye' : 'fa-eye-slash'}" aria-hidden="true"></i>`;
      this.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    });

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
  }

  async function handleLogin(event) {
    event.preventDefault();
    const username = event.target.username.value.trim().toLowerCase();
    const secret = event.target.secret.value;
    const error = document.getElementById('loginError');
    const submit = document.getElementById('loginSubmit');
    error.classList.remove('show');
    submit.disabled = true;
    submit.textContent = 'Checking...';

    try {
      await refreshData();
      const secretHash = await hashText(secret);

      if (loginRole === 'staff') {
        if (db.staff && username === db.staff.username.toLowerCase() && secretHash === db.staff.passwordHash) {
          session = { role: 'staff' };
          saveSession();
          adminView = 'dashboard';
          render();
          return;
        }
      } else {
        const learner = db.students.find(s => s.username.toLowerCase() === username && s.passwordHash === secretHash);
        if (learner) {
          session = { role: 'student', userId: learner.id };
          saveSession();
          studentView = 'home';
          currentZone = firstIncompleteZone(learner);
          render();
          return;
        }
      }

      error.textContent = 'Those sign-in details do not match. Please try again or ask a member of staff.';
      error.classList.add('show');
    } catch (e) {
      console.error(e);
      error.textContent = 'We could not connect to the online database. Check the internet connection and try again.';
      error.classList.add('show');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Sign in';
    }
  }

  function logout() {
    session = null;
    saveSession();
    render();
  }

  function firstIncompleteZone(student) {
    const stats = assessmentStats(student);
    const index = stats.zoneStats.findIndex(z => !z.complete);
    return index < 0 ? 0 : index;
  }

  function sidebar(items, active, userHtml) {
    return `
      <aside class="sidebar" id="sidebar">
        <img class="sidebar-logo" src="assets/powerhouse-logo.png" alt="The Powerhouse">
        <div class="user-card">${userHtml}</div>
        <nav class="nav-list">
          ${items.map(item => `<button class="nav-btn ${active === item.id ? 'active' : ''}" data-nav="${item.id}">${esc(item.label)}</button>`).join('')}
        </nav>
        <div class="sidebar-spacer"></div>
        <button class="logout-btn" id="logoutBtn">Log out</button>
      </aside>`;
  }

  function topbar(title, subtitle, extra) {
    return `
      <header class="topbar">
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <button class="ghost-btn mobile-menu" id="menuBtn" type="button">Menu</button>
          <div style="min-width:0">
            <h1>${esc(title)}</h1>
            <p>${esc(subtitle || '')}</p>
          </div>
        </div>
        <div class="top-actions">${extra || ''}</div>
      </header>`;
  }

  function wireShell(navHandler) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', function () {
      navHandler(this.dataset.nav);
      const side = document.getElementById('sidebar');
      if (side) side.classList.remove('open');
    }));
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) menuBtn.addEventListener('click', function () {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  function renderStudent() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    activeSpeechButton = null;
    const student = getStudent();
    const stats = assessmentStats(student);
    const items = [
      { id: 'home', label: 'My home' },
      { id: 'assessment', label: stats.answered ? 'Continue assessment' : 'Start assessment' },
      { id: 'results', label: 'My results' },
      { id: 'homehub', label: 'Home Hub games' }
    ];

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-shell">
        ${sidebar(items, studentView, `<strong>${esc(student.name)}</strong><span>${esc(className(student.classId))}</span>`)}
        <main class="main">
          ${topbar(studentViewTitle(), 'Independent living practice and progress', studentView === 'assessment' ? `<span class="badge">${stats.progress}% answered</span>` : '')}
          <div class="content" id="studentContent"></div>
        </main>
      </div>`;

    wireShell(function (view) {
      if (view === 'homehub') {
        window.open('https://home-hub-580da.web.app/', '_blank', 'noopener');
        return;
      }
      studentView = view;
      if (view === 'assessment') currentZone = firstIncompleteZone(student);
      renderStudent();
    });

    if (studentView === 'assessment') renderAssessment(student);
    else if (studentView === 'results') renderStudentResults(student);
    else renderStudentHome(student);
  }

  function studentViewTitle() {
    if (studentView === 'assessment') return 'Skills assessment';
    if (studentView === 'results') return 'My results';
    return 'My independent living';
  }

  function renderStudentHome(student) {
    const stats = assessmentStats(student);
    const content = document.getElementById('studentContent');
    content.innerHTML = `
      <section class="hero">
        <img src="assets/house-artwork.png" alt="Illustrated home with different rooms">
        <div class="hero-copy">
          <span class="hero-kicker">Your home skills journey</span>
          <h2>${stats.answered ? 'Keep building your independence.' : 'What can you do at home?'}</h2>
          <p>${stats.answered ? `You have answered ${stats.answered} of ${stats.total} questions. Your answers save automatically online.` : 'Move through each area of the home and choose the answer that best describes what you can do now.'}</p>
          <div class="hero-actions">
            <button class="lime-btn" id="startAssessment">${stats.answered ? 'Continue assessment' : 'Start my assessment'}</button>
            ${stats.answered ? '<button class="ghost-btn" style="color:white;border-color:rgba(255,255,255,.45)" id="viewResultsHero">View my results</button>' : ''}
          </div>
        </div>
      </section>
      <section class="card-grid">
        <article class="card span-4">
          <div class="stat"><div><p>Questions answered</p><strong>${stats.answered}/${stats.total}</strong></div><div class="stat-badge">Q</div></div>
        </article>
        <article class="card span-4">
          <div class="stat"><div><p>Zones complete</p><strong>${stats.zoneStats.filter(z => z.complete).length}/${ZONES.length}</strong></div><div class="stat-badge">Z</div></div>
        </article>
        <article class="card span-4">
          <div class="stat"><div><p>${stats.complete ? 'Independence score' : 'Current score'}</p><strong>${stats.answered ? stats.score + '%' : '--'}</strong></div><div class="stat-badge">%</div></div>
        </article>
        <article class="card span-12">
          <h3>Your progress through the house</h3>
          <p>Complete one zone at a time. You can change an answer whenever you need to.</p>
          <div class="progress-track"><div class="progress-fill" style="width:${stats.progress}%"></div></div>
          <div class="zone-strip">
            ${stats.zoneStats.map((z, i) => { const item = ZONES[i]; return `<button class="zone-chip home-zone-chip ${z.complete ? 'done' : ''}" data-zone-jump="${i}"><span class="zone-chip-icon">${zoneIcon(item)}</span><span class="zone-chip-copy"><strong>${esc(item.short)}</strong><small>${z.answered}/${z.total} answered</small></span>${z.complete ? '<i class="fa fa-check-circle zone-done-tick" aria-hidden="true"></i>' : ''}</button>`; }).join('')}
          </div>
        </article>
        <article class="card span-12 home-hub-card">
          <img src="assets/login-background.png" alt="Powerhouse Home Hub games room">
          <div class="home-hub-copy">
            <h3>Practise in the Home Hub</h3>
            <p>Use the Home Hub games to practise independent living skills in a familiar Powerhouse environment.</p>
            <a class="lime-btn" style="display:inline-block;text-decoration:none" href="https://home-hub-580da.web.app/" target="_blank" rel="noopener">Open Home Hub</a>
          </div>
        </article>
      </section>`;

    document.getElementById('startAssessment').addEventListener('click', function () {
      studentView = 'assessment';
      currentZone = firstIncompleteZone(student);
      renderStudent();
    });
    const vr = document.getElementById('viewResultsHero');
    if (vr) vr.addEventListener('click', function () { studentView = 'results'; renderStudent(); });
    document.querySelectorAll('[data-zone-jump]').forEach(btn => btn.addEventListener('click', function () {
      studentView = 'assessment';
      currentZone = Number(this.dataset.zoneJump);
      renderStudent();
    }));
  }

  function renderAssessment(student) {
    const zone = ZONES[currentZone];
    const stats = assessmentStats(student);
    const answers = student.assessment.answers || {};
    const content = document.getElementById('studentContent');
    if (!student.assessment.startedAt) {
      student.assessment.startedAt = new Date().toISOString();
      saveAssessment(student).catch(handleSaveError);
    }

    content.innerHTML = `
      <section class="card assessment-wrap assessment-card">
        <div class="zone-hero">
          <img src="${esc(zone.image)}" alt="${esc(zone.short)} area from the Powerhouse Home Hub house artwork">
          <div class="zone-hero-shade"></div>
          <div class="zone-hero-content">
            <div class="zone-hero-icon">${zoneIcon(zone)}</div>
            <div class="zone-hero-copy">
              <span class="zone-kicker">Zone ${currentZone + 1} of ${ZONES.length}</span>
              <h2>${esc(zone.title)}</h2>
              <p>${esc(zone.intro)}</p>
            </div>
            <button class="read-aloud-btn read-zone-btn" id="readZoneIntro" type="button" aria-label="Read the zone introduction aloud">
              <i class="fa fa-volume-up" aria-hidden="true"></i><span>Read aloud</span>
            </button>
          </div>
        </div>

        <div class="assessment-instructions">
          <div class="instruction-icon"><i class="fa fa-check-square-o" aria-hidden="true"></i></div>
          <div>
            <strong>How independent are you with each task?</strong>
            <span>Choose the answer that best describes what you can do now. There are no wrong answers.</span>
          </div>
        </div>

        <div class="progress-track"><div class="progress-fill" style="width:${stats.progress}%"></div></div>
        <div class="zone-strip visual-zone-strip">
          ${stats.zoneStats.map((z, i) => {
            const item = ZONES[i];
            return `<button class="zone-chip ${z.complete ? 'done' : ''} ${i === currentZone ? 'current' : ''}" data-zone="${i}" type="button">
              <span class="zone-chip-icon">${zoneIcon(item)}</span>
              <span class="zone-chip-copy"><strong>${esc(item.short)}</strong><small>${z.answered}/${z.total}</small></span>
              ${z.complete ? '<i class="fa fa-check-circle zone-done-tick" aria-hidden="true"></i>' : ''}
            </button>`;
          }).join('')}
        </div>

        <div class="question-list visual-question-list">
          ${zone.questions.map((question, index) => {
            const key = answerKey(zone.id, index);
            const selected = Object.prototype.hasOwnProperty.call(answers, key) ? Number(answers[key]) : null;
            return `<article class="question visual-question">
              <div class="question-topline">
                <div class="question-symbol" aria-hidden="true"><i class="fa ${esc(question.icon)}"></i></div>
                <div class="question-copy">
                  <span class="question-count">Question ${index + 1} of ${zone.questions.length}</span>
                  <div class="question-text">${esc(question.text)}</div>
                </div>
                <button class="read-aloud-btn" data-speak-question="${index}" type="button" aria-label="Read question ${index + 1} aloud">
                  <i class="fa fa-volume-up" aria-hidden="true"></i><span>Read aloud</span>
                </button>
              </div>
              <div class="answer-row visual-answer-row">
                ${ANSWERS.map(answer => `<button class="answer-btn ${selected === answer.value ? 'selected' : ''}" data-answer-key="${esc(key)}" data-value="${answer.value}" type="button">
                  <i class="fa ${esc(answer.icon)}" aria-hidden="true"></i><span>${esc(answer.label)}</span>
                </button>`).join('')}
              </div>
            </article>`;
          }).join('')}
        </div>

        <div class="assessment-nav">
          <div>
            ${currentZone > 0 ? '<button class="secondary-btn" id="prevZone"><i class="fa fa-arrow-left" aria-hidden="true"></i> Previous zone</button>' : ''}
          </div>
          <span class="save-note"><i class="fa fa-check-circle" aria-hidden="true"></i> Answers save automatically.</span>
          <div>
            ${currentZone < ZONES.length - 1 ? '<button class="lime-btn" id="nextZone">Next zone <i class="fa fa-arrow-right" aria-hidden="true"></i></button>' : '<button class="lime-btn" id="finishAssessment">View my results <i class="fa fa-bar-chart" aria-hidden="true"></i></button>'}
          </div>
        </div>
      </section>`;

    const readZone = document.getElementById('readZoneIntro');
    if (readZone) readZone.addEventListener('click', function () {
      speakText(`${zone.title}. ${zone.intro} Choose the answer that best describes what you can do now.`, this);
    });

    document.querySelectorAll('[data-speak-question]').forEach(btn => btn.addEventListener('click', function () {
      const question = zone.questions[Number(this.dataset.speakQuestion)];
      if (question) speakText(question.text, this);
    }));

    document.querySelectorAll('[data-answer-key]').forEach(btn => btn.addEventListener('click', function () {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      student.assessment.answers[this.dataset.answerKey] = Number(this.dataset.value);
      student.assessment.updatedAt = new Date().toISOString();
      const newStats = assessmentStats(student);
      if (newStats.complete && !student.assessment.completedAt) student.assessment.completedAt = new Date().toISOString();
      saveAssessment(student).catch(handleSaveError);
      renderStudent();
    }));

    document.querySelectorAll('[data-zone]').forEach(btn => btn.addEventListener('click', function () {
      currentZone = Number(this.dataset.zone);
      renderStudent();
    }));
    const prev = document.getElementById('prevZone');
    if (prev) prev.addEventListener('click', function () { currentZone -= 1; renderStudent(); window.scrollTo(0, 0); });
    const next = document.getElementById('nextZone');
    if (next) next.addEventListener('click', function () { currentZone += 1; renderStudent(); window.scrollTo(0, 0); });
    const finish = document.getElementById('finishAssessment');
    if (finish) finish.addEventListener('click', function () { studentView = 'results'; renderStudent(); window.scrollTo(0, 0); });
  }

  function renderStudentResults(student) {
    const stats = assessmentStats(student);
    const level = scoreLevel(stats.score);
    const next = stats.zoneStats.slice().sort((a, b) => a.score - b.score).slice(0, 3);
    const content = document.getElementById('studentContent');

    content.innerHTML = `
      ${!stats.complete ? `<div class="notice">You have answered ${stats.answered} of ${stats.total} questions. Your score will become more accurate when every zone is complete.</div>` : ''}
      <section class="results-grid">
        <article class="card">
          <div class="score-ring" style="--score:${stats.score}"><span>${stats.score}%</span></div>
          <div style="text-align:center;margin-top:18px">
            <span class="level-badge">${esc(level.name)}</span>
            <p>${esc(level.message)}</p>
            <button class="secondary-btn" id="changeAnswers">Review my answers</button>
          </div>
        </article>
        <article class="card">
          <h3>My skills by zone</h3>
          <p>These scores help you see where you feel most independent and what you may want to practise next.</p>
          <div class="zone-results">
            ${stats.zoneStats.map(z => `<div class="zone-result">
              <div class="zone-result-line"><span>${esc(z.title)}</span><span>${z.score}%</span></div>
              <div class="progress-track"><div class="progress-fill" style="width:${z.score}%"></div></div>
            </div>`).join('')}
          </div>
          <h3 style="margin-top:22px">Suggested next steps</h3>
          <div class="next-steps">
            ${next.map(z => `<div class="next-step"><strong>${esc(z.title)}</strong><br><span>Choose one skill in this zone to practise this week.</span></div>`).join('')}
          </div>
        </article>
      </section>`;

    document.getElementById('changeAnswers').addEventListener('click', function () {
      studentView = 'assessment';
      currentZone = firstIncompleteZone(student);
      renderStudent();
    });
  }

  function renderStaff() {
    const items = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'students', label: 'Learners' },
      { id: 'classes', label: 'Classes' },
      { id: 'settings', label: 'Staff settings' }
    ];
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="app-shell">
        ${sidebar(items, adminView, '<strong>Staff admin</strong><span>Online database</span>')}
        <main class="main">
          ${topbar(adminTitle(), 'Manage learner access and review independent living assessments', '<button class="ghost-btn" id="refreshDataBtn"><i class="fa fa-refresh" aria-hidden="true"></i> Refresh data</button><span class="badge cloud-badge"><i class="fa fa-cloud" aria-hidden="true"></i> Firestore</span>')}
          <div class="content" id="adminContent"></div>
        </main>
      </div>`;

    wireShell(function (view) { adminView = view; renderStaff(); });
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', async function () {
      this.disabled = true;
      this.innerHTML = '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Refreshing';
      try {
        await refreshData();
        renderStaff();
      } catch (e) {
        console.error(e);
        alert('Could not refresh the online data. Check the internet connection.');
        this.disabled = false;
        this.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i> Refresh data';
      }
    });

    if (adminView === 'students') renderAdminStudents();
    else if (adminView === 'classes') renderAdminClasses();
    else if (adminView === 'settings') renderAdminSettings();
    else renderAdminDashboard();
  }

  function adminTitle() {
    if (adminView === 'students') return 'Learners';
    if (adminView === 'classes') return 'Classes';
    if (adminView === 'settings') return 'Staff settings';
    return 'Staff dashboard';
  }

  function renderAdminDashboard() {
    const complete = db.students.filter(s => assessmentStats(s).complete).length;
    const started = db.students.filter(s => assessmentStats(s).answered > 0).length;
    const scores = db.students.map(s => assessmentStats(s)).filter(s => s.answered > 0).map(s => s.score);
    const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const content = document.getElementById('adminContent');
    content.innerHTML = `
      <div class="notice success-notice"><strong>Online:</strong> classes, learner accounts and assessment progress are being saved to Cloud Firestore. This is a training-only self-assessment system.</div>
      <section class="card-grid">
        <article class="card span-4"><div class="stat"><div><p>Learners</p><strong>${db.students.length}</strong></div><div class="stat-badge">L</div></div></article>
        <article class="card span-4"><div class="stat"><div><p>Assessments started</p><strong>${started}</strong></div><div class="stat-badge">A</div></div></article>
        <article class="card span-4"><div class="stat"><div><p>Assessments complete</p><strong>${complete}</strong></div><div class="stat-badge">C</div></div></article>
        <article class="card span-6">
          <h3>Class overview</h3>
          <div class="zone-results">
            ${db.classes.map(c => {
              const count = db.students.filter(s => s.classId === c.id).length;
              return `<div class="zone-result"><div class="zone-result-line"><span>${esc(c.name)}</span><span>${count} learner${count === 1 ? '' : 's'}</span></div></div>`;
            }).join('') || '<div class="empty">No classes yet.</div>'}
          </div>
        </article>
        <article class="card span-6">
          <h3>Assessment picture</h3>
          <p>Average current score for learners who have started the assessment.</p>
          <div class="score-ring" style="--score:${average};width:160px"><span>${average}%</span></div>
        </article>
      </section>`;
  }

  function renderAdminStudents() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
      <section class="card">
        <div class="admin-toolbar">
          <div><h2>Manage learners</h2><p>Create a username and password, then assign each learner to a class.</p></div>
          <button class="lime-btn" id="addStudentBtn">Add learner</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Class</th><th>Username</th><th>Password</th><th>Progress</th><th>Score</th><th>Actions</th></tr></thead>
            <tbody>
              ${db.students.map(student => {
                const stats = assessmentStats(student);
                return `<tr>
                  <td><strong>${esc(student.name)}</strong></td>
                  <td><span class="badge">${esc(className(student.classId))}</span></td>
                  <td>${esc(student.username)}</td>
                  <td><span class="password-set-badge"><i class="fa fa-lock" aria-hidden="true"></i> Set</span></td>
                  <td>${stats.answered}/${stats.total}</td>
                  <td>${stats.answered ? stats.score + '%' : '--'}</td>
                  <td><div class="table-actions">
                    <button class="small-btn" data-view-student="${student.id}">Results</button>
                    <button class="small-btn" data-edit-student="${student.id}">Edit</button>
                    <button class="small-btn" data-reset-student="${student.id}">Reset</button>
                    <button class="small-btn danger" data-delete-student="${student.id}">Delete</button>
                  </div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="7" class="empty">No learners added yet.</td></tr>'}
            </tbody>
          </table>
        </div>
      </section>`;

    document.getElementById('addStudentBtn').addEventListener('click', function () { openStudentModal(); });
    document.querySelectorAll('[data-edit-student]').forEach(btn => btn.addEventListener('click', function () { openStudentModal(this.dataset.editStudent); }));
    document.querySelectorAll('[data-delete-student]').forEach(btn => btn.addEventListener('click', async function () {
      const student = db.students.find(s => s.id === this.dataset.deleteStudent);
      if (student && confirm('Delete ' + student.name + '? This will also delete their saved assessment answers.')) {
        try {
          await deleteStudentRecord(student.id);
          db.students = db.students.filter(s => s.id !== student.id);
          renderStaff();
        } catch (e) { handleSaveError(e); }
      }
    }));
    document.querySelectorAll('[data-reset-student]').forEach(btn => btn.addEventListener('click', async function () {
      const student = db.students.find(s => s.id === this.dataset.resetStudent);
      if (student && confirm('Reset all assessment answers for ' + student.name + '?')) {
        student.assessment = blankAssessment();
        try {
          await saveAssessment(student);
          renderStaff();
        } catch (e) { handleSaveError(e); }
      }
    }));
    document.querySelectorAll('[data-view-student]').forEach(btn => btn.addEventListener('click', function () { openStaffResults(this.dataset.viewStudent); }));
  }

  function openStudentModal(studentId) {
    const existing = studentId ? db.students.find(s => s.id === studentId) : null;
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal">
        <h3>${existing ? 'Edit learner' : 'Add learner'}</h3>
        <form id="studentForm" class="form-grid">
          <div class="field"><label>Name or display name</label><input name="name" value="${existing ? esc(existing.name) : ''}" required></div>
          <div class="field"><label>Class</label><select name="classId" required>${db.classes.map(c => `<option value="${c.id}" ${existing && existing.classId === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
          <div class="two-col">
            <div class="field"><label>Username</label><input name="username" value="${existing ? esc(existing.username) : ''}" pattern="[A-Za-z0-9._\\-]{2,40}" title="Use 2-40 letters, numbers, dots, underscores or hyphens" autocomplete="off" required></div>
            <div class="field"><label>${existing ? 'New password' : 'Password'}</label><input name="password" type="password" minlength="4" autocomplete="new-password" ${existing ? 'placeholder="Leave blank to keep current password"' : 'required'}></div>
          </div>
          ${existing ? '<p class="form-help"><i class="fa fa-info-circle" aria-hidden="true"></i> Leave the password box empty if you only want to change the name, class or username.</p>' : ''}
          <div id="studentFormError" class="error-box"></div>
          <div class="modal-actions"><button class="ghost-btn" type="button" id="cancelStudent">Cancel</button><button class="lime-btn" id="saveStudentBtn" type="submit">Save learner</button></div>
        </form>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('cancelStudent').addEventListener('click', function () { modal.remove(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('studentForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      const username = values.username.trim().toLowerCase();
      const duplicate = db.students.find(s => s.username.toLowerCase() === username && (!existing || s.id !== existing.id));
      const err = document.getElementById('studentFormError');
      const saveBtn = document.getElementById('saveStudentBtn');
      if (duplicate) {
        err.textContent = 'That username is already being used. Choose a different one.';
        err.classList.add('show');
        return;
      }
      if (!existing && String(values.password || '').length < 4) {
        err.textContent = 'Choose a password with at least 4 characters.';
        err.classList.add('show');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      try {
        if (existing) {
          existing.name = values.name.trim();
          existing.classId = values.classId;
          existing.username = username;
          if (values.password) existing.passwordHash = await hashText(values.password);
          await saveStudent(existing);
        } else {
          const learner = {
            id: uid('learner'),
            name: values.name.trim(),
            classId: values.classId,
            username,
            passwordHash: await hashText(values.password),
            assessment: blankAssessment()
          };
          await saveStudent(learner);
          db.students.push(learner);
          db.students.sort((a, b) => a.name.localeCompare(b.name));
        }
        modal.remove();
        renderStaff();
      } catch (error) {
        console.error(error);
        err.textContent = 'The learner could not be saved to Firebase. Check the internet connection and try again.';
        err.classList.add('show');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save learner';
      }
    });
  }

  function openStaffResults(studentId) {
    const student = db.students.find(s => s.id === studentId);
    if (!student) return;
    const stats = assessmentStats(student);
    const level = scoreLevel(stats.score);
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal">
        <h3>${esc(student.name)} - assessment</h3>
        <p><span class="badge">${esc(className(student.classId))}</span></p>
        <div class="score-ring" style="--score:${stats.score};width:150px"><span>${stats.answered ? stats.score + '%' : '--'}</span></div>
        <p style="text-align:center"><strong>${stats.answered ? esc(level.name) : 'Not started'}</strong><br>${stats.answered}/${stats.total} questions answered</p>
        <div class="zone-results">${stats.zoneStats.map(z => `<div class="zone-result"><div class="zone-result-line"><span>${esc(z.title)}</span><span>${z.answered}/${z.total} - ${z.score}%</span></div><div class="progress-track"><div class="progress-fill" style="width:${z.score}%"></div></div></div>`).join('')}</div>
        <div class="modal-actions"><button class="primary-btn" type="button" id="closeResults">Close</button></div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('closeResults').addEventListener('click', function () { modal.remove(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
  }

  function renderAdminClasses() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
      <section class="card">
        <div class="admin-toolbar"><div><h2>Classes</h2><p>Add or remove class groups used when creating learner accounts.</p></div></div>
        <form id="classForm" class="inline-form" style="grid-template-columns:minmax(220px,1fr) auto;margin-bottom:20px">
          <div class="field"><label>New class name</label><input name="name" placeholder="e.g. Mint" required></div>
          <button class="lime-btn" id="addClassBtn" type="submit">Add class</button>
        </form>
        <div class="zone-results">
          ${db.classes.map(c => {
            const count = db.students.filter(s => s.classId === c.id).length;
            return `<div class="zone-result"><div class="zone-result-line"><span>${esc(c.name)}</span><span>${count} learner${count === 1 ? '' : 's'} <button class="small-btn danger" data-delete-class="${c.id}" ${count ? 'disabled title="Move learners to another class first"' : ''}>Delete</button></span></div></div>`;
          }).join('')}
        </div>
      </section>`;

    document.getElementById('classForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = e.target.name.value.trim();
      if (!name) return;
      if (db.classes.some(c => c.name.toLowerCase() === name.toLowerCase())) return alert('That class already exists.');
      const item = { id: uid('class'), name };
      const btn = document.getElementById('addClassBtn');
      btn.disabled = true;
      try {
        await saveClass(item);
        db.classes.push(item);
        db.classes.sort((a, b) => a.name.localeCompare(b.name));
        renderStaff();
      } catch (error) {
        handleSaveError(error);
        btn.disabled = false;
      }
    });
    document.querySelectorAll('[data-delete-class]').forEach(btn => btn.addEventListener('click', async function () {
      if (this.disabled) return;
      const item = db.classes.find(c => c.id === this.dataset.deleteClass);
      if (item && confirm('Delete class ' + item.name + '?')) {
        try {
          await deleteClassRecord(item.id);
          db.classes = db.classes.filter(c => c.id !== item.id);
          renderStaff();
        } catch (error) { handleSaveError(error); }
      }
    }));
  }

  function renderAdminSettings() {
    const content = document.getElementById('adminContent');
    content.innerHTML = `
      <section class="card" style="max-width:760px">
        <h3>Staff sign-in details</h3>
        <p>Change the admin username or set a new password. Passwords are converted to a one-way hash before being stored in Firestore.</p>
        <form id="staffSettingsForm" class="form-grid">
          <div class="field"><label>Staff username</label><input name="username" value="${esc(db.staff ? db.staff.username : '')}" pattern="[A-Za-z0-9._\\-]{2,40}" required></div>
          <div class="field"><label>New password</label><input name="password" type="password" minlength="4" autocomplete="new-password" placeholder="Leave blank to keep current password"></div>
          <button class="lime-btn" id="saveStaffBtn" type="submit">Save staff login</button>
        </form>
      </section>
      <section class="card" style="max-width:760px;margin-top:18px">
        <h3>Data storage</h3>
        <p><strong>Firebase project:</strong> ${esc(FIREBASE_CONFIG.projectId)}</p>
        <p>Classes, usernames, password hashes and assessment responses are stored in Cloud Firestore. The site does not use Firebase Authentication.</p>
        <p class="form-help"><i class="fa fa-info-circle" aria-hidden="true"></i> Keep this system for training and self-assessment only. Do not add confidential learner records, EHCP information, addresses or medical details.</p>
      </section>`;

    document.getElementById('staffSettingsForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const values = Object.fromEntries(new FormData(e.target).entries());
      const btn = document.getElementById('saveStaffBtn');
      btn.disabled = true;
      btn.textContent = 'Saving...';
      try {
        db.staff.username = values.username.trim().toLowerCase();
        if (values.password) db.staff.passwordHash = await hashText(values.password);
        await saveStaff();
        alert('Staff login updated.');
        renderStaff();
      } catch (error) {
        handleSaveError(error);
        btn.disabled = false;
        btn.textContent = 'Save staff login';
      }
    });
  }

  function renderSetupRequired() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <main class="setup-page">
        <section class="setup-card">
          <img src="assets/powerhouse-logo.png" alt="The Powerhouse">
          <div class="setup-icon"><i class="fa fa-database" aria-hidden="true"></i></div>
          <h1>Firebase needs connecting</h1>
          <p>The website build is ready. Add your Firebase Web App configuration to <code>public/firebase-config.js</code>, then reload the page.</p>
          <div class="setup-steps">
            <div><strong>1</strong><span>Create or open the Firebase project.</span></div>
            <div><strong>2</strong><span>Create Cloud Firestore and publish the included <code>firestore.rules</code>.</span></div>
            <div><strong>3</strong><span>Register a Web App and paste its configuration into <code>firebase-config.js</code>.</span></div>
          </div>
          <p class="setup-small">Full copy-and-paste instructions are included in README.md.</p>
        </section>
      </main>`;
  }

  function renderConnectionError(error) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <main class="setup-page">
        <section class="setup-card">
          <img src="assets/powerhouse-logo.png" alt="The Powerhouse">
          <div class="setup-icon error"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
          <h1>Could not connect to Firebase</h1>
          <p>Check the Firebase configuration, make sure Cloud Firestore has been created, and publish the included Firestore rules.</p>
          <button class="lime-btn" id="retryFirebase">Try again</button>
          <details><summary>Technical details</summary><pre>${esc(error && error.message ? error.message : String(error || 'Unknown error'))}</pre></details>
        </section>
      </main>`;
    document.getElementById('retryFirebase').addEventListener('click', function () { window.location.reload(); });
  }

  async function bootstrap() {
    if (!firebaseConfigured()) {
      renderSetupRequired();
      return;
    }
    try {
      const firebaseApp = initializeApp(FIREBASE_CONFIG);
      firestore = getFirestore(firebaseApp);
      await ensureSeedData();
      await refreshData();
      firebaseReady = true;
      render();
    } catch (error) {
      bootstrapError = error;
      console.error(error);
      renderConnectionError(error);
    }
  }

  bootstrap();
})();
