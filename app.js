/* לוח הכפל של מיקה ומרגו */
(() => {
  "use strict";

  // ================= נתונים קבועים =================
  const COLORS = {
    1: ["#a9dcf5", "#1a6690"],
    2: ["#f9b9c8", "#b02f58"],
    3: ["#f8ec9c", "#8a6a00"],
    4: ["#b7e4a8", "#2a7a26"],
    5: ["#dcc0f3", "#6f36a3"],
    6: ["#fbc8dd", "#a82b64"],
    7: ["#a9cdf2", "#214f99"],
    8: ["#fcc995", "#a3520a"],
    9: ["#f8acac", "#a82227"],
    10: ["#cdeb9c", "#40760e"],
  };

  const NUM_WORDS = ["אפס", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע", "עשר"];
  const PRAISE = ["נכון! 🐾", "מרגו גאה בך! 🐶", "בול! ⭐", "איזה יופי! 💜", "וואו, מעולה! 🦴", "את אלופה! 🏆"];
  const ENCOURAGE = ["את יכולה! 🐾", "בואי ננסה 💜", "מרגו מחכה 🐶", "לאט ובנחת 🙂"];

  // סיפורי כפל: a קבוצות, ובכל קבוצה b פריטים. icon הוא מה שסופרים.
  // fixed: התבנית מתאימה רק כש-b שווה למספר הזה.
  const STORIES = [
    { icon: "🧒", t: (a, b) => `בשיעור קפוארה הילדים עומדים ב-${a} שורות, ובכל שורה ${b} ילדים. כמה ילדים יש בשיעור?` },
    { icon: "🤸", t: (a, b) => `מיקה עושה ${b} גלגלונים בכל אימון קפוארה. כמה גלגלונים היא עשתה אחרי ${a} אימונים?` },
    { icon: "🥁", t: (a, b) => `המורה לקפוארה ניגן בברימבאו ${a} שירים, ובכל שיר ${b} תיפופים חזקים. כמה תיפופים היו?` },
    { icon: "💫", t: (a, b) => `${a} רקדניות היפ-הופ עלו לבמה, וכל אחת הסתובבה ${b} סיבובים. כמה סיבובים היו בסך הכל?` },
    { icon: "🪑", t: (a, b) => `באולם ההופעה יש ${a} שורות של כיסאות, ובכל שורה ${b} כיסאות. כמה כיסאות יש באולם?` },
    { icon: "👏", t: (a, b) => `בשיר ההיפ-הופ יש ${a} בתים, ובכל בית מוחאים כפיים ${b} פעמים. כמה מחיאות כפיים היו?` },
    { icon: "👟", t: (a, b) => `לכל רקדנית יש ${b} זוגות סניקרס צבעוניות. כמה זוגות יש ל-${a} רקדניות?` },
    { icon: "⭐", t: (a, b) => `${a} רקדניות שמו משקפי שמש מצחיקים, ועל הכובע של כל אחת ${b} מדבקות. כמה מדבקות יש?` },
    { icon: "🧁", t: (a, b) => `אחרי ההופעה כל אחד מ-${a} הרקדנים קיבל ${b} קאפקייקס. מרגו ניסתה לגנוב אחד 🙊 כמה קאפקייקס חילקו?` },
    { icon: "🦴", t: (a, b) => `מרגו מקבלת ${b} עצמות בכל יום. כמה עצמות היא תקבל אחרי ${a} ימים? (היא מקווה שהמון!)` },
    { icon: "🐾", fixed: 4, t: (a) => `${a} כלבים כמו מרגו עלו לרקוד היפ-הופ. לכל כלב 4 רגליים. כמה רגליים רוקדות על הבמה?` },
    { icon: "✋", fixed: 2, t: (a) => `${a} ילדים מהקפוארה עשו עמידת ידיים בבת אחת. כמה ידיים נוגעות ברצפה?` },
    { icon: "🦶", fixed: 2, t: (a) => `${a} רקדניות קפצו גבוה מהבמה. כמה רגליים היו באוויר באותו רגע?` },
    { icon: "😎", fixed: 2, t: (a) => `${a} רקדנים שמו משקפי שמש. לכל זוג משקפיים 2 עדשות. כמה עדשות יש?` },
  ];

  function makeStory(a, b) {
    const fits = STORIES.filter((s) => (s.fixed ? s.fixed === b : true));
    const special = fits.filter((s) => s.fixed);
    const s = special.length && Math.random() < 0.6 ? pick(special) : pick(fits.filter((x) => !x.fixed));
    return { text: s.t(a, b), icon: s.icon };
  }

  // רמות: שם + אילו לוחות נכנסים לאתגר היומי
  const LEVELS = [
    null,
    { title: "גורה סקרנית", tables: [1, 2, 10] },
    { title: "מחפשת עצמות", tables: [1, 2, 5, 10] },
    { title: "רצה בגבעות", tables: [1, 2, 3, 5, 10] },
    { title: "שומרת הלוח", tables: [1, 2, 3, 4, 5, 10] },
    { title: "החברה הכי טובה של מרגו", tables: [1, 2, 3, 4, 5, 9, 10] },
    { title: "מאלפת מספרים", tables: [1, 2, 3, 4, 5, 6, 9, 10] },
    { title: "קוסמת הכפל", tables: [1, 2, 3, 4, 5, 6, 7, 9, 10] },
    { title: "גיבורת הגבעות", tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { title: "אלופת הלהקה", tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { title: "מלכת הכפל 👑", tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  ];
  const MAX_LEVEL = 10;
  const xpForLevel = (lv) => 50 * lv * (lv - 1); // 1:0, 2:100, 3:300, 4:600 ...

  // חזרה מרווחת: כמה ימים לחכות לפני שתרגיל חוזר, לפי "קופסה"
  const BOX_DAYS = [0, 1, 2, 4, 7, 14];
  const MASTERED_BOX = 3;

  const ALBUM = {
    1: { src: "img/margo.jpg", pos: "50% 40%", sticker: "🎓", cap: "מרגו מתכוננת לשיעור" },
    2: { src: "img/mika-rome.jpg", pos: "62% 60%", sticker: "🇮🇹", cap: "מיקה ברומא!" },
    3: { src: "img/margo.jpg", pos: "50% 30%", rotate: true, sticker: "🙃", cap: "מרגו הפוכה מרוב שמחה" },
    4: { src: "img/mika-corn.jpg", pos: "60% 35%", sticker: "🌽", cap: "מיקה בשדה התירס" },
    5: { src: "img/margo-face.jpg", pos: "50% 50%", filter: "saturate(1.3)", sticker: "💖", cap: "מי הכלבה הכי יפה?" },
    6: { src: "img/mika-rome.jpg", pos: "35% 80%", sticker: "✌️", cap: "מיקה עושה שלום" },
    7: { src: "img/margo.jpg", pos: "50% 65%", filter: "sepia(.35)", sticker: "🦴", cap: "מרגו סופרת עד 70" },
    8: { src: "img/mika-corn-face.jpg", pos: "50% 40%", sticker: "👑", cap: "מלכת הכפל" },
    9: { src: "img/margo-face.jpg", pos: "70% 80%", sticker: "🤫", cap: "מרגו שומרת על סוד" },
    10: { src: "img/mika-rome-face.jpg", pos: "50% 40%", sticker: "🏆", cap: "סיימת את כל הלוח!" },
  };

  const PRACTICE_LEN = 10;
  const MAX_RETRY = 3;
  const BREAK_MINUTES = 10;

  // ================= שמירה בדפדפן =================
  const KEY = "mika-kefel-v1";
  const DEFAULTS = {
    stars: {}, album: [], daily: { last: null, streak: 0 },
    sound: true, music: false, calm: null, night: false, xp: 0, facts: {},
  };
  let state;
  try {
    state = Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || "{}"));
  } catch (e) {
    state = Object.assign({}, DEFAULTS);
  }
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* אחסון מלא */ }
  };

  // ================= עזרים =================
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const setColor = (el, n) => {
    el.style.setProperty("--c", COLORS[n][0]);
    el.style.setProperty("--d", COLORS[n][1]);
  };
  const todayStr = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
  const starsText = (n) => "⭐".repeat(n) + "☆".repeat(3 - n);
  const motionOK = () => !state.calm && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ================= זיכרון לכל תרגיל =================
  const factKey = (a, b) => `${Math.min(a, b)}x${Math.max(a, b)}`;
  const getFact = (a, b) => state.facts[factKey(a, b)] || { box: 0, seen: 0, right: 0, last: null };

  function recordFact(a, b, firstTry) {
    const f = getFact(a, b);
    f.seen++;
    if (firstTry) { f.right++; f.box = Math.min(f.box + 1, BOX_DAYS.length - 1); }
    else f.box = Math.max(0, Math.min(f.box - 1, 1));
    f.last = todayStr();
    state.facts[factKey(a, b)] = f;
  }

  const isKnown = (a, b) => getFact(a, b).box >= MASTERED_BOX;

  function tableMastery(n) {
    let sum = 0;
    for (let b = 1; b <= 10; b++) sum += Math.min(getFact(n, b).box, MASTERED_BOX);
    return sum / (10 * MASTERED_BOX);
  }

  function suggestedTable() {
    const lv = levelInfo().level;
    const pool = LEVELS[lv].tables.filter((t) => t !== 1);
    let best = pool[0], bestM = 2;
    pool.forEach((t) => {
      const m = tableMastery(t);
      if (m < bestM - 0.001) { bestM = m; best = t; }
    });
    return bestM >= 0.99 ? null : best;
  }

  // ================= נקודות ורמות =================
  function levelInfo() {
    let level = 1;
    while (level < MAX_LEVEL && state.xp >= xpForLevel(level + 1)) level++;
    const base = xpForLevel(level);
    const next = level < MAX_LEVEL ? xpForLevel(level + 1) : base;
    const pct = level < MAX_LEVEL ? (state.xp - base) / (next - base) : 1;
    return { level, base, next, pct, title: LEVELS[level].title };
  }

  let pendingLevelUp = null;
  function addXp(n) {
    const before = levelInfo().level;
    state.xp += n;
    const after = levelInfo().level;
    if (after > before) pendingLevelUp = after;
    renderLevel();
  }

  function renderLevel() {
    const li = levelInfo();
    $("levelNum").textContent = li.level;
    $("levelNum2").textContent = li.level;
    $("levelTitle").textContent = li.title;
    $("levelFill").style.width = `${Math.round(li.pct * 100)}%`;
    $("xpFill").style.width = `${Math.round(li.pct * 100)}%`;
    $("levelChip").title = `רמה ${li.level}: ${li.title}`;
    $("xpText").textContent = li.level < MAX_LEVEL
      ? `${state.xp - li.base} / ${li.next - li.base} נקודות לרמה הבאה`
      : "הגעת לרמה הכי גבוהה! 👑";
  }

  function showLevelUp() {
    if (!pendingLevelUp) return;
    const lv = pendingLevelUp;
    pendingLevelUp = null;
    $("levelBadge").textContent = lv;
    const newTables = LEVELS[lv].tables.filter((t) => !LEVELS[lv - 1].tables.includes(t));
    $("levelModalText").innerHTML = `עכשיו את <b>${LEVELS[lv].title}</b>!` +
      (newTables.length ? `<br>מרגו הוסיפה לאתגר היומי את לוח ${newTables.join(" ו-")} 🐾` : "");
    $("levelModal").hidden = false;
    confetti();
    fanfare();
  }

  // ================= ניווט =================
  const TITLES = { home: "הלוח של מיקה", focus: "לוח הכפל", practice: "תרגול עם מרגו", result: "סוף הסבב", map: "מפת הכפל", album: "האלבום" };
  let current = "home";

  function show(name, title) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("screen-" + name).classList.add("active");
    $("topTitle").textContent = title || TITLES[name];
    current = name;
    window.scrollTo(0, 0);
    if (name === "home") renderHome();
  }

  // ================= צלילים =================
  let audioCtx = null;
  const ctx = () => {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  };

  function tone(freq, start, dur, vol = 0.12, type = "sine", dest) {
    const c = ctx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    o.connect(g).connect(dest || c.destination);
    o.start(start);
    o.stop(start + dur + 0.05);
  }

  function chime() {
    if (!state.sound) return;
    try { const t = ctx().currentTime; tone(660, t, 0.45); tone(880, t + 0.12, 0.5); } catch (e) {}
  }
  function softBoop() {
    if (!state.sound) return;
    try { tone(330, ctx().currentTime, 0.25, 0.06, "triangle"); } catch (e) {}
  }
  function fanfare() {
    if (!state.sound) return;
    try { const t = ctx().currentTime; [523, 659, 784, 1047].forEach((f, i) => tone(f, t + i * 0.12, 0.6, 0.1)); } catch (e) {}
  }

  // ================= מוזיקת רקע רגועה =================
  // קובץ המנגינה (כבר מוקלט בעוצמה נמוכה) מתנגן בלופ, עם כניסה ויציאה הדרגתיות.
  // באייפד הדפדפן מתעלם משינוי עוצמה, ולכן הקובץ עצמו שקט.
  const MUSIC_VOLUME = 0.8;
  const bgm = new Audio("audio/music.mp3?v=6");
  bgm.loop = true;
  bgm.preload = "none";
  bgm.volume = 0;
  let bgmFailed = false;
  let fadeTimer = null;
  bgm.addEventListener("error", () => {
    bgmFailed = true;
    if (state.music) startSynth();
  });
  bgm.addEventListener("playing", () => $("btnMusic").classList.add("playing"));
  bgm.addEventListener("pause", () => $("btnMusic").classList.remove("playing"));

  function fadeTo(target, ms, done) {
    clearInterval(fadeTimer);
    const steps = 20, from = bgm.volume;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      try { bgm.volume = Math.max(0, Math.min(1, from + (target - from) * (i / steps))); } catch (e) {}
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, ms / steps);
  }

  function startMusic(fromUser) {
    if (bgmFailed) return startSynth();
    clearInterval(fadeTimer);
    const p = bgm.play();
    if (p && p.catch) {
      p.catch(() => {
        if (!fromUser) return;
        showToast("המוזיקה לא התחילה 🎵 בדקו שהשמע במכשיר פתוח (ובאייפד שמתג ההשתקה כבוי), ולחצו שוב על כפתור המוזיקה.");
        state.music = false;
        save();
        applyToggles();
      });
    }
    fadeTo(MUSIC_VOLUME, 1500);
  }

  function stopMusic() {
    stopSynth();
    if (bgm.paused) return;
    fadeTo(0, 700, () => bgm.pause());
  }

  // ----- מנגינה מסונתזת (גיבוי אם קובץ המוזיקה לא נטען) -----
  // אקורדים רכים (C, Am, F, G) ומנגינה פנטטונית אקראית, בעוצמה נמוכה
  const CHORDS = [[261.6, 329.6, 392], [220, 261.6, 329.6], [174.6, 220, 261.6], [196, 246.9, 293.7]];
  const MELODY = [523.3, 587.3, 659.3, 784, 880];
  const BEAT = 60 / 66;
  let music = { gain: null, timer: null, beat: 0, next: 0 };

  function startSynth() {
    try {
      const c = ctx();
      if (music.timer) return;
      music.gain = c.createGain();
      music.gain.gain.setValueAtTime(0, c.currentTime);
      music.gain.gain.linearRampToValueAtTime(0.5, c.currentTime + 2);
      music.gain.connect(c.destination);
      music.beat = 0;
      music.next = c.currentTime + 0.1;
      music.timer = setInterval(scheduleMusic, 200);
    } catch (e) {}
  }

  function scheduleMusic() {
    const c = ctx();
    while (music.next < c.currentTime + 0.6) {
      const t = music.next;
      const chord = CHORDS[Math.floor(music.beat / 4) % CHORDS.length];
      if (music.beat % 4 === 0) chord.forEach((f) => tone(f / 2, t, BEAT * 4, 0.035, "triangle", music.gain));
      tone(chord[music.beat % 3], t, BEAT * 0.9, 0.025, "sine", music.gain);
      if (Math.random() < 0.45) tone(pick(MELODY), t + BEAT / 2, BEAT * 1.4, 0.03, "sine", music.gain);
      music.beat++;
      music.next += BEAT;
    }
  }

  function stopSynth() {
    if (!music.timer) return;
    clearInterval(music.timer);
    music.timer = null;
    try {
      const g = music.gain;
      g.gain.linearRampToValueAtTime(0, ctx().currentTime + 0.8);
      setTimeout(() => g.disconnect(), 1000);
    } catch (e) {}
  }

  // ================= הקראה =================
  let heVoice = null;
  function findVoice() {
    if (!("speechSynthesis" in window)) return;
    heVoice = speechSynthesis.getVoices().find((v) => /^(he|iw)/i.test(v.lang)) || null;
    $("btnSpeak").hidden = !heVoice;
  }
  function speak(text) {
    if (!heVoice) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = heVoice;
    u.lang = heVoice.lang;
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }
  if ("speechSynthesis" in window) {
    findVoice();
    speechSynthesis.onvoiceschanged = findVoice;
  } else {
    $("btnSpeak").hidden = true;
  }

  // ================= אפקטים =================
  function flyBone(fromEl, toEl) {
    if (!motionOK() || !fromEl || !toEl || !fromEl.animate) return;
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "fly";
    el.textContent = "🦴";
    $("fx").appendChild(el);
    const x0 = a.left + a.width / 2 - 16, y0 = a.top + a.height / 2 - 16;
    const x1 = b.left + b.width / 2 - 16, y1 = b.top + b.height / 2 - 16;
    el.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1)`, opacity: 1 },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 80}px) scale(1.4) rotate(180deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${x1}px, ${y1}px) scale(.8) rotate(360deg)`, opacity: 0.2 },
    ], { duration: 750, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => el.remove();
  }

  function confetti() {
    if (!motionOK()) return;
    const colors = ["#ffc93c", "#6a4fd8", "#f9879c", "#7cc95a", "#5ab4f0"];
    const w = window.innerWidth;
    for (let i = 0; i < 36; i++) {
      const el = document.createElement("div");
      el.className = "confetti";
      el.style.background = pick(colors);
      $("fx").appendChild(el);
      const x = w / 2 + rand(-80, 80), y = window.innerHeight * 0.35;
      const dx = rand(-w / 2.5, w / 2.5), dy = rand(-260, -60);
      el.animate([
        { transform: `translate(${x}px, ${y}px) rotate(0)`, opacity: 1 },
        { transform: `translate(${x + dx * 0.6}px, ${y + dy}px) rotate(${rand(90, 360)}deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${x + dx}px, ${y + 420}px) rotate(${rand(360, 720)}deg)`, opacity: 0 },
      ], { duration: rand(1400, 2000), easing: "cubic-bezier(.2,.6,.4,1)" }).onfinish = () => el.remove();
    }
  }

  function restartAnim(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  // ================= מסך הבית =================
  function renderHome() {
    renderLevel();
    const sug = suggestedTable();
    const wrap = $("cards");
    wrap.innerHTML = "";
    for (let n = 1; n <= 10; n++) {
      const card = document.createElement("button");
      card.className = "card" + (n === sug ? " suggested" : "");
      card.style.setProperty("--i", n);
      setColor(card, n);
      card.setAttribute("aria-label", `לוח ${n}`);
      let rows = "";
      for (let i = 1; i <= 10; i++) rows += `<div>${n}×${i}=${n * i}</div>`;
      const m = Math.round(tableMastery(n) * 100);
      card.innerHTML = `
        <div class="card-rows">${rows}</div>
        <div class="card-side">
          <img class="card-dog" src="img/margo-face.jpg" alt="" width="52" height="52">
          <div class="card-num">${n}</div>
          <div class="mastery" title="כמה מהלוח את כבר יודעת: ${m}%"><span style="width:${m}%"></span></div>
          <div class="card-stars">${starsText(state.stars[n] || 0)}</div>
        </div>`;
      card.onclick = () => openFocus(n);
      wrap.appendChild(card);
    }

    const doneToday = state.daily.last === todayStr();
    $("dailyCard").classList.toggle("done", doneToday);
    $("dailyTitle").textContent = doneToday ? "האתגר של היום הושלם! ✅" : "האתגר של היום";
    $("dailySub").textContent = doneToday
      ? "אפשר לעשות עוד אחד בשביל נקודות נוספות"
      : `${dailyLength()} שאלות שמרגו בחרה לפי הרמה שלך`;
    $("btnDaily").textContent = doneToday ? "עוד אחד" : "יאללה!";
    $("streakNum").textContent = currentStreak();
    $("albumStatus").textContent = `${state.album.length}/10`;

    const tip = $("tip");
    if (sug) {
      tip.hidden = false;
      tip.innerHTML = `<span aria-hidden="true">💡</span> מרגו ממליצה: לוח ${sug}`;
    } else tip.hidden = true;
  }

  function currentStreak() {
    const { last, streak } = state.daily;
    if (!last) return 0;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return last === todayStr() || last === todayStr(y) ? streak : 0;
  }

  // ================= לוח אחד בגדול =================
  let focusN = 1;
  let hideAnswers = false;

  function openFocus(n) {
    focusN = n;
    renderFocus();
    show("focus", `לוח ${n}`);
  }

  function renderFocus() {
    const card = $("focusCard");
    setColor(card, focusN);
    card.classList.toggle("hidden-answers", hideAnswers);
    let rows = "";
    for (let i = 1; i <= 10; i++) {
      rows += `<div class="row" style="--i:${i}"><span>${focusN} × ${i} =</span><span class="ans">${focusN * i}</span></div>`;
    }
    card.innerHTML = `
      <div class="focus-big">
        <div class="focus-num">${focusN}</div>
        <img class="focus-dog" src="img/margo-face.jpg" alt="מרגו" width="110" height="110">
        <div class="card-stars" style="font-size:1.5rem">${starsText(state.stars[focusN] || 0)}</div>
      </div>
      <div class="focus-rows">${rows}</div>`;
    card.querySelectorAll(".row").forEach((r) => {
      r.onclick = () => { if (hideAnswers) r.classList.toggle("revealed"); };
    });
    $("btnHide").textContent = hideAnswers ? "👀 הראי תשובות" : "🙈 הסתירי תשובות";
    $("topTitle").textContent = `לוח ${focusN}`;
  }

  function stepFocus(d) {
    focusN = ((focusN - 1 + d + 10) % 10) + 1;
    renderFocus();
  }

  $("focusPrev").onclick = () => stepFocus(-1);
  $("focusNext").onclick = () => stepFocus(1);
  $("btnHide").onclick = () => { hideAnswers = !hideAnswers; renderFocus(); };
  $("btnPractice").onclick = () => startPractice(focusN);

  // ================= בחירת שאלות =================
  // שאלה: { a, b, missing } - missing=true פירושו "a × ? = a·b"
  function startPractice(n) {
    const bs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, PRACTICE_LEN);
    startQuiz({ mode: "table", table: n, qs: bs.map((b) => ({ a: n, b, missing: false })) }, `תרגול לוח ${n}`);
  }

  function dailyLength() {
    return Math.min(8, 5 + Math.floor((levelInfo().level - 1) / 3));
  }

  function buildDaily() {
    const lv = levelInfo().level;
    const tables = LEVELS[lv].tables;
    const today = todayStr();
    const all = [];
    const seenKeys = new Set();
    tables.filter((t) => t !== 1).forEach((a) => {
      for (let b = 2; b <= 10; b++) {
        const k = factKey(a, b);
        if (seenKeys.has(k)) continue;
        seenKeys.add(k);
        all.push({ a, b, f: getFact(a, b) });
      }
    });

    const weak = all.filter((x) => x.f.seen > 0 && x.f.box <= 1).sort((x, y) => x.f.box - y.f.box);
    const due = all.filter((x) => x.f.box >= 2 && (!x.f.last || daysBetween(x.f.last, today) >= BOX_DAYS[x.f.box]));
    const fresh = all.filter((x) => x.f.seen === 0);

    const n = dailyLength();
    const chosen = [];
    const take = (list, k) => {
      shuffle(list);
      for (const x of list) {
        if (chosen.length >= n || k <= 0) break;
        if (!chosen.includes(x)) { chosen.push(x); k--; }
      }
    };
    take(weak.slice(0, 6), Math.ceil(n * 0.4));
    take(fresh, Math.ceil(n * 0.3));
    take(due, n);
    take(all, n);

    const missingChance = lv >= 7 ? 0.4 : lv >= 4 ? 0.25 : 0;
    const storyCount = lv >= 5 ? 2 : 1;
    return shuffle(chosen).map((x, i) => {
      const swap = Math.random() < 0.5;
      const a = swap ? x.b : x.a, b = swap ? x.a : x.b;
      if (i < storyCount) return { a, b, missing: false, story: makeStory(a, b) };
      return { a, b, missing: Math.random() < missingChance };
    }).sort(() => Math.random() - 0.5);
  }

  function startDaily() {
    startQuiz({ mode: "daily", table: null, qs: buildDaily() }, "האתגר היומי");
  }

  // סבב של סיפורי כפל בלבד, מהלוחות שברמה של מיקה
  function startStories() {
    const tables = LEVELS[levelInfo().level].tables.filter((t) => t !== 1);
    const qs = [];
    const used = new Set();
    while (qs.length < 6) {
      const a = rand(2, 6), b = pick(tables);
      if (used.has(a + "x" + b)) continue;
      used.add(a + "x" + b);
      qs.push({ a, b, missing: false, story: makeStory(a, b) });
    }
    startQuiz({ mode: "stories", table: null, qs }, "סיפורי כפל");
  }

  function storyPics(q) {
    const { a, b } = q;
    const icon = q.story.icon;
    if (a * b <= 40) {
      let html = "";
      for (let r = 0; r < a; r++) html += `<span class="grp" style="--i:${r}">${icon.repeat(b)}</span>`;
      return html;
    }
    let html = "";
    for (let r = 0; r < a; r++) html += `<span class="grp chip" dir="ltr" style="--i:${r}">${icon} × ${b}</span>`;
    return html;
  }

  // ================= מנוע התרגול =================
  let quiz = null;

  function startQuiz(q, title) {
    quiz = Object.assign(q, { i: 0, score: 0, xp: 0, retry: [], inRetry: false });
    show("practice", title);
    renderBones();
    renderQuestion();
  }

  function renderBones() {
    const wrap = $("bones");
    wrap.innerHTML = "";
    quiz.qs.forEach(() => {
      const s = document.createElement("span");
      s.className = "bone";
      s.textContent = "🦴";
      wrap.appendChild(s);
    });
  }

  const currentQ = () => (quiz.inRetry ? quiz.retry[quiz.i] : quiz.qs[quiz.i]);
  const answerOf = (q) => (q.missing ? q.b : q.a * q.b);

  function makeOptions(q) {
    const ans = answerOf(q);
    let cand;
    if (q.missing) cand = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3];
    else cand = [q.a * (q.b + 1), q.a * (q.b - 1), (q.a + 1) * q.b, (q.a - 1) * q.b, ans + 1, ans - 1, ans + q.a, ans + 2];
    const opts = [ans];
    for (const c of shuffle(cand)) {
      if (opts.length === 4) break;
      if (c > 0 && !opts.includes(c)) opts.push(c);
    }
    while (opts.length < 4) {
      const c = ans + rand(-6, 6);
      if (c > 0 && !opts.includes(c)) opts.push(c);
    }
    return shuffle(opts);
  }

  function questionHtml(q, solved) {
    if (q.missing) {
      const mid = solved ? `<span class="blank">${q.b}</span>` : `<span class="blank">?</span>`;
      return `${q.a} × ${mid} = ${q.a * q.b}`;
    }
    return `${q.a} × ${q.b} = ${solved ? q.a * q.b : "?"}`;
  }

  function renderQuestion() {
    const q = currentQ();
    quiz.firstTry = true;
    quiz.answered = false;
    const qBox = document.querySelector(".question");
    setColor(qBox, quiz.mode === "table" ? quiz.table : q.a);
    $("question").innerHTML = questionHtml(q, false);
    const storyBox = $("story");
    if (q.story) {
      storyBox.hidden = false;
      qBox.hidden = true;
      setColor(storyBox, q.a);
      $("storyText").textContent = q.story.text;
      $("storyPics").innerHTML = storyPics(q);
      restartAnim(storyBox, "swap");
    } else {
      storyBox.hidden = true;
      qBox.hidden = false;
      restartAnim(qBox, "swap");
    }
    $("hint").innerHTML = "";
    $("btnNextQ").hidden = true;
    $("roundLabel").hidden = !quiz.inRetry;
    setBubble(quiz.inRetry ? "בואי ננסה שוב, הפעם זה יצליח 💪" : pick(ENCOURAGE));
    [...$("bones").children].forEach((b, i) => b.classList.toggle("current", !quiz.inRetry && i === quiz.i));

    const wrap = $("options");
    wrap.innerHTML = "";
    makeOptions(q).forEach((v) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.textContent = v;
      btn.onclick = () => answer(btn, v);
      wrap.appendChild(btn);
    });
  }

  function setBubble(text) {
    $("bubble").textContent = text;
    restartAnim($("bubble"), "pop");
  }

  function answer(btn, v) {
    if (quiz.answered || btn.classList.contains("tried")) return;
    const q = currentQ();
    if (v === answerOf(q)) {
      quiz.answered = true;
      btn.classList.add("right");
      document.querySelectorAll(".opt").forEach((o) => (o.disabled = true));
      $("question").innerHTML = questionHtml(q, true);
      if (q.story) document.querySelector(".question").hidden = false;
      if (!quiz.inRetry) {
        recordFact(q.a, q.b, quiz.firstTry);
        if (quiz.firstTry) {
          quiz.score++;
          quiz.xp += 10;
          const bone = $("bones").children[quiz.i];
          flyBone(btn, bone);
          setTimeout(() => bone.classList.add("got"), motionOK() ? 650 : 0);
        } else {
          quiz.xp += 3;
          if (quiz.retry.length < MAX_RETRY) quiz.retry.push({ a: q.a, b: q.b, missing: q.missing, story: q.story });
        }
      } else {
        quiz.xp += 2;
      }
      setBubble(quiz.firstTry ? pick(PRAISE) : "יופי, הצלחת! 💜");
      $("hint").innerHTML = "";
      restartAnim($("margoBig"), "nod");
      if (q.story) restartAnim($("storyMika"), "hop");
      chime();
      $("btnNextQ").hidden = false;
      $("btnNextQ").focus({ preventScroll: true });
    } else {
      quiz.firstTry = false;
      btn.classList.add("tried");
      btn.disabled = true;
      softBoop();
      setBubble("כמעט! בואי נספור ביחד 🐾");
      showHint(q);
    }
  }

  function showHint(q) {
    if (q.missing) {
      const seq = [];
      for (let i = 1; i <= 10 && q.a * i <= q.a * q.b; i++) seq.push(q.a * i);
      $("hint").innerHTML = `💡 נספור בקפיצות של ${q.a} עד ${q.a * q.b}: <bdi dir="ltr" class="seq">${seq.slice(0, -1).join(", ")}, ${q.a * q.b}</bdi><br>כמה קפיצות עשינו?`;
      return;
    }
    const step = Math.max(q.a, q.b), times = Math.min(q.a, q.b);
    const seq = [];
    for (let i = 1; i < times; i++) seq.push(step * i);
    $("hint").innerHTML = "💡 " + (seq.length
      ? `נספור בקפיצות של ${step}: <bdi dir="ltr" class="seq">${seq.join(", ")}, ?</bdi>`
      : `${times} פעמים ${step} זה פשוט ${step} 😉`);
  }

  function nextQuestion() {
    quiz.i++;
    const list = quiz.inRetry ? quiz.retry : quiz.qs;
    if (quiz.i < list.length) return renderQuestion();
    if (!quiz.inRetry && quiz.retry.length) {
      quiz.inRetry = true;
      quiz.i = 0;
      return renderQuestion();
    }
    finishQuiz();
  }

  function finishQuiz() {
    const { score, qs, mode, table } = quiz;
    const total = qs.length;
    let unlocked = false;
    let bonus = 20;

    if (mode === "table") {
      const stars = score === total ? 3 : score >= 8 ? 2 : score >= 5 ? 1 : 0;
      state.stars[table] = Math.max(state.stars[table] || 0, stars);
      if (score >= 8 && !state.album.includes(table)) {
        state.album.push(table);
        unlocked = true;
      }
      $("resultStars").textContent = starsText(stars);
    } else {
      const today = todayStr();
      if (state.daily.last !== today) {
        state.daily.streak = currentStreak() + 1;
        state.daily.last = today;
        bonus += 30;
      }
      $("resultStars").textContent = `🔥 ${state.daily.streak} ימים ברצף!`;
    }
    addXp(quiz.xp + bonus);
    save();

    const great = score >= total * 0.8;
    $("resultTitle").textContent = great ? "כל הכבוד מיקה! 🎉" : "עבודה יפה מיקה! 💜";
    $("resultScore").textContent = `${score} מתוך ${total} בניסיון הראשון`;
    $("resultXp").textContent = `+${quiz.xp + bonus} נקודות ⭐`;
    $("resultPhoto").src = mode === "stories" ? "img/mika-cartoon.jpg" : pick(["img/mika-rome.jpg", "img/mika-corn.jpg"]);
    $("resultUnlock").hidden = !unlocked;
    $("btnResultAlbum").hidden = !unlocked;
    $("btnAgain").textContent = mode === "daily" ? "🏠 לבית" : "🔁 עוד סבב";
    if (mode === "stories") $("resultStars").textContent = "🤸💃🐶";
    show("result");
    if (great) confetti();
    if (pendingLevelUp) setTimeout(showLevelUp, motionOK() ? 1200 : 0);
  }

  $("btnNextQ").onclick = nextQuestion;
  $("btnSpeak").onclick = () => {
    const q = currentQ();
    if (q.story) return speak(q.story.text);
    speak(q.missing
      ? `${NUM_WORDS[q.a]} כפול כמה שווה ${q.a * q.b}?`
      : `${NUM_WORDS[q.a]} כפול ${NUM_WORDS[q.b]}`);
  };
  $("btnAgain").onclick = () => {
    if (quiz.mode === "daily") show("home");
    else if (quiz.mode === "stories") startStories();
    else startPractice(quiz.table);
  };
  $("btnResultHome").onclick = () => show("home");
  $("btnResultAlbum").onclick = () => { renderAlbum(); show("album"); };
  $("btnLevelClose").onclick = () => { $("levelModal").hidden = true; };

  // ================= מפת הכפל =================
  let picked = null;

  function renderMap() {
    const map = $("map");
    map.innerHTML = "";
    const corner = document.createElement("div");
    corner.className = "cell corner";
    corner.textContent = "×";
    map.appendChild(corner);
    for (let c = 1; c <= 10; c++) {
      const h = document.createElement("div");
      h.className = "cell head";
      h.dataset.c = c;
      setColor(h, c);
      h.textContent = c;
      map.appendChild(h);
    }
    for (let r = 1; r <= 10; r++) {
      const h = document.createElement("div");
      h.className = "cell head";
      h.dataset.r = r;
      setColor(h, r);
      h.textContent = r;
      map.appendChild(h);
      for (let c = 1; c <= 10; c++) {
        const cell = document.createElement("button");
        cell.className = "cell" + (isKnown(r, c) ? " known" : "");
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = r * c;
        cell.setAttribute("aria-label", `${r} כפול ${c} שווה ${r * c}`);
        cell.onclick = () => pickCell(r, c);
        cell.onmouseenter = () => lineCells(r, c);
        map.appendChild(cell);
      }
    }
    map.onmouseleave = () => (picked ? lineCells(...picked) : lineCells(0, 0));
    map.classList.toggle("show-known", $("mapKnown").checked);
    $("mapInfo").textContent = "לחצי על משבצת";
    picked = null;
  }

  function lineCells(r, c) {
    $("map").querySelectorAll(".cell").forEach((el) => {
      const er = +el.dataset.r || 0, ec = +el.dataset.c || 0;
      const inLine = (r && er === r && ec <= c) || (c && ec === c && er <= r);
      el.classList.toggle("line", !!inLine);
    });
  }

  function pickCell(r, c) {
    picked = [r, c];
    $("map").querySelectorAll(".cell").forEach((el) => {
      el.classList.toggle("picked", +el.dataset.r === r && +el.dataset.c === c);
    });
    lineCells(r, c);
    $("mapInfo").textContent = `${r} × ${c} = ${r * c}`;
    speak(`${NUM_WORDS[r]} כפול ${NUM_WORDS[c]}, ${r * c}`);
  }

  $("mapKnown").onchange = (e) => $("map").classList.toggle("show-known", e.target.checked);

  // ================= אלבום =================
  function photoHtml(n) {
    const p = ALBUM[n];
    const style = `object-position:${p.pos};filter:${p.filter || "none"};${p.rotate ? "transform:rotate(180deg);" : ""}`;
    return `<img class="ph" src="${p.src}" alt="${p.cap}" style="${style}" loading="lazy">`;
  }

  function renderAlbum() {
    const wrap = $("album");
    wrap.innerHTML = "";
    for (let n = 1; n <= 10; n++) {
      const open = state.album.includes(n);
      const el = document.createElement(open ? "button" : "div");
      el.className = "polaroid" + (open ? "" : " locked");
      el.style.setProperty("--i", n);
      setColor(el, n);
      if (open) {
        el.innerHTML = `${photoHtml(n)}<span class="sticker">${ALBUM[n].sticker}</span><div class="cap">${ALBUM[n].cap}</div>`;
        el.onclick = () => {
          $("photoModalContent").innerHTML = `${photoHtml(n)}<div class="cap">${ALBUM[n].sticker} ${ALBUM[n].cap}</div>`;
          $("photoModal").hidden = false;
        };
      } else {
        el.innerHTML = `<div class="lock">🔒</div><div class="cap">סיימי את לוח ${n}</div>`;
      }
      wrap.appendChild(el);
    }
  }

  $("btnPhotoClose").onclick = () => ($("photoModal").hidden = true);
  $("photoModal").onclick = (e) => { if (e.target.id === "photoModal") $("photoModal").hidden = true; };

  // ================= כפתורים עליונים =================
  $("btnHome").onclick = () => show("home");
  $("btnDaily").onclick = startDaily;
  $("btnMap").onclick = () => { renderMap(); show("map"); };
  $("btnStories").onclick = startStories;
  $("btnAlbum").onclick = () => { renderAlbum(); show("album"); };
  $("tip").onclick = () => { const s = suggestedTable(); if (s) openFocus(s); };

  function applyToggles() {
    $("btnSound").setAttribute("aria-pressed", String(!!state.sound));
    $("btnMusic").setAttribute("aria-pressed", String(!!state.music));
    $("btnCalm").setAttribute("aria-pressed", String(!!state.calm));
    $("btnNight").setAttribute("aria-pressed", String(!!state.night));
    document.body.classList.toggle("calm", !!state.calm);
    document.body.classList.toggle("night", !!state.night);
    document.querySelector('meta[name="theme-color"]').content = state.night ? "#1b2350" : "#bfe9ff";
  }
  $("btnSound").onclick = () => { state.sound = !state.sound; save(); applyToggles(); chime(); };
  $("btnMusic").onclick = () => {
    state.music = !state.music;
    save();
    applyToggles();
    state.music ? startMusic(true) : stopMusic();
  };
  $("btnCalm").onclick = () => {
    state.calm = !state.calm;
    save();
    applyToggles();
    showToast(state.calm ? "מצב רגוע: האנימציות כבויות 🌿" : "האנימציות חזרו ✨", 2500);
  };
  $("btnNight").onclick = () => { state.night = !state.night; save(); applyToggles(); };
  $("btnFull").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // הדפדפן מאפשר צליל רק אחרי לחיצה ראשונה
  document.addEventListener("pointerdown", (e) => {
    if (state.music && !e.target.closest("#btnMusic")) startMusic(false);
  }, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMusic();
    else if (state.music) startMusic();
  });

  // ================= מקלדת =================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      for (const id of ["photoModal", "levelModal", "syncModal", "importModal"]) if (!$(id).hidden) { $(id).hidden = true; return; }
      if (current !== "home") show("home");
      return;
    }
    if (current === "focus") {
      if (e.key === "ArrowLeft") stepFocus(1);
      if (e.key === "ArrowRight") stepFocus(-1);
    }
    if (current === "practice") {
      const opts = document.querySelectorAll(".opt");
      const k = parseInt(e.key, 10);
      if (k >= 1 && k <= 4 && opts[k - 1]) opts[k - 1].click();
    }
  });

  // ================= מרגו מציצה (רק בבית ובאלבום) =================
  setInterval(() => {
    if (!motionOK() || !["home", "album"].includes(current)) return;
    const p = $("peek");
    p.classList.add("show");
    setTimeout(() => p.classList.remove("show"), 3500);
  }, 30000);

  // ================= תזכורת להפסקה =================
  let breakTimer;
  function armBreak() {
    clearTimeout(breakTimer);
    breakTimer = setTimeout(() => ($("breakModal").hidden = false), BREAK_MINUTES * 60 * 1000);
  }
  $("btnBreakDone").onclick = () => { $("breakModal").hidden = true; armBreak(); };

  // ================= הודעה קטנה =================
  let toastTimer;
  function showToast(msg, ms = 6000) {
    const t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), ms);
  }
  $("toast").onclick = () => ($("toast").hidden = true);

  // ================= מעבר בין מכשירים =================
  // כל ההתקדמות נשמרת בדפדפן של המכשיר. כדי להעביר אותה, יוצרים קישור
  // שההתקדמות מקודדת בחלק שאחרי ה-#. החלק הזה לא נשלח לשום שרת.
  const b64enc = (str) => btoa(unescape(encodeURIComponent(str))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const b64dec = (str) => decodeURIComponent(escape(atob(str.replace(/-/g, "+").replace(/_/g, "/"))));

  function exportLink() {
    const f = {};
    Object.entries(state.facts).forEach(([k, v]) => (f[k] = [v.box, v.seen, v.right, v.last]));
    const data = { v: 1, x: state.xp, s: state.stars, a: state.album, d: state.daily, f };
    return location.origin + location.pathname + "#sync=" + b64enc(JSON.stringify(data));
  }

  function mergeProgress(d) {
    state.xp = Math.max(state.xp || 0, d.x || 0);
    Object.entries(d.s || {}).forEach(([k, v]) => (state.stars[k] = Math.max(state.stars[k] || 0, v)));
    (d.a || []).forEach((n) => { if (!state.album.includes(n)) state.album.push(n); });
    if (d.d && d.d.last && (!state.daily.last || d.d.last > state.daily.last ||
        (d.d.last === state.daily.last && d.d.streak > state.daily.streak))) {
      state.daily = { last: d.d.last, streak: d.d.streak };
    }
    Object.entries(d.f || {}).forEach(([k, arr]) => {
      const inc = { box: arr[0], seen: arr[1], right: arr[2], last: arr[3] };
      const cur = state.facts[k];
      if (!cur || (inc.last || "") > (cur.last || "") || ((inc.last || "") === (cur.last || "") && inc.seen > cur.seen)) {
        state.facts[k] = inc;
      }
    });
    save();
  }

  let pendingImport = null;
  function checkImport() {
    const m = location.hash.match(/^#sync=([A-Za-z0-9_-]+)$/);
    if (!m) return;
    history.replaceState(null, "", location.pathname + location.search);
    try {
      pendingImport = JSON.parse(b64dec(m[1]));
    } catch (e) {
      showToast("הקישור לא תקין 🙁 נסו ליצור קישור חדש במכשיר השני.");
      return;
    }
    let lv = 1;
    while (lv < MAX_LEVEL && (pendingImport.x || 0) >= xpForLevel(lv + 1)) lv++;
    $("importText").innerHTML = `מצאתי התקדמות של מיקה ממכשיר אחר:<br><b>רמה ${lv}</b>, ${(pendingImport.a || []).length} תמונות באלבום, ${Object.keys(pendingImport.f || {}).length} תרגילים בזיכרון.<br>למזג אותה עם מה שיש כאן? שום דבר לא יימחק.`;
    $("importModal").hidden = false;
  }

  $("btnImportYes").onclick = () => {
    if (pendingImport) mergeProgress(pendingImport);
    pendingImport = null;
    $("importModal").hidden = true;
    renderHome();
    showToast("ההתקדמות נטענה! 🐾", 3000);
  };
  $("btnImportNo").onclick = () => { pendingImport = null; $("importModal").hidden = true; };

  $("btnSync").onclick = () => {
    $("syncLink").value = exportLink();
    $("syncModal").hidden = false;
  };
  $("btnSyncClose").onclick = () => ($("syncModal").hidden = true);
  $("btnSyncShare").onclick = async () => {
    const url = $("syncLink").value;
    if (navigator.share) {
      try { await navigator.share({ title: "ההתקדמות של מיקה", text: "לוח הכפל של מיקה ומרגו 🐶", url }); return; } catch (e) { if (e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("הקישור הועתק 📋 עכשיו הדביקו אותו בוואטסאפ ופתחו במכשיר השני.", 4000);
    } catch (e) {
      $("syncLink").select();
      showToast("סמנו את הקישור והעתיקו אותו ידנית.", 4000);
    }
  };

  // ================= התחלה =================
  if (state.calm === null) state.calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  applyToggles();
  renderHome();
  armBreak();
  checkImport();
})();
