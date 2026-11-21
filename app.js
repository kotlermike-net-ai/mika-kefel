/* לוח הכפל של מיקה ומרגו */
(() => {
  "use strict";

  // ---------- נתונים ----------
  const COLORS = {
    1: ["#a9dcf5", "#1f6f99"],
    2: ["#f9b9c8", "#c23a63"],
    3: ["#f8ec9c", "#b38a00"],
    4: ["#b7e4a8", "#2f8a2a"],
    5: ["#dcc0f3", "#7a3fb0"],
    6: ["#fbc8dd", "#b8326f"],
    7: ["#a9cdf2", "#2557a8"],
    8: ["#fcc995", "#c0620a"],
    9: ["#f8acac", "#b8272c"],
    10: ["#cdeb9c", "#4d8a12"],
  };

  const NUM_WORDS = ["אפס", "אחת", "שתיים", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע", "עשר"];

  const PRAISE = ["נכון! 🐾", "מרגו גאה בך! 🐶", "בול! ⭐", "איזה יופי! 💜", "וואו, מעולה! 🦴", "את אלופה! 🏆"];
  const ENCOURAGE = ["את יכולה! 🐾", "בואי ננסה 💜", "מרגו מחכה 🐶", "לאט ובנחת 🙂"];

  // אלבום: כל לוח פותח תמונה. יש 3 תמונות, ולכן כל אחת מופיעה בכמה סגנונות.
  const ALBUM = {
    1: { src: "img/margo.jpg", pos: "50% 40%", filter: "", sticker: "🎓", cap: "מרגו מתכוננת לשיעור" },
    2: { src: "img/mika-rome.jpg", pos: "62% 60%", filter: "", sticker: "🇮🇹", cap: "מיקה ברומא!" },
    3: { src: "img/margo.jpg", pos: "50% 30%", filter: "", rotate: true, sticker: "🙃", cap: "מרגו הפוכה מרוב שמחה" },
    4: { src: "img/mika-corn.jpg", pos: "60% 35%", filter: "", sticker: "🌽", cap: "מיקה בשדה התירס" },
    5: { src: "img/margo-face.jpg", pos: "50% 50%", filter: "saturate(1.3)", sticker: "💖", cap: "מי הכלבה הכי יפה?" },
    6: { src: "img/mika-rome.jpg", pos: "35% 80%", filter: "", sticker: "✌️", cap: "מיקה עושה שלום" },
    7: { src: "img/margo.jpg", pos: "50% 65%", filter: "sepia(.35)", sticker: "🦴", cap: "מרגו סופרת עד 70" },
    8: { src: "img/mika-corn-face.jpg", pos: "50% 40%", filter: "", sticker: "👑", cap: "מלכת הכפל" },
    9: { src: "img/margo-face.jpg", pos: "70% 80%", filter: "", sticker: "🤫", cap: "מרגו שומרת על סוד" },
    10: { src: "img/mika-rome-face.jpg", pos: "50% 40%", filter: "", sticker: "🏆", cap: "סיימת את כל הלוח!" },
  };

  const PRACTICE_LEN = 10;
  const DAILY_LEN = 5;
  const BREAK_MINUTES = 10;

  // ---------- שמירה ----------
  const KEY = "mika-kefel-v1";
  const state = Object.assign(
    { stars: {}, album: [], daily: { last: null, streak: 0 }, sound: true, calm: null },
    JSON.parse(localStorage.getItem(KEY) || "{}")
  );
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  // ---------- עזרים ----------
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const setColor = (el, n) => {
    el.style.setProperty("--c", COLORS[n][0]);
    el.style.setProperty("--d", COLORS[n][1]);
  };
  const todayStr = (d = new Date()) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const starsText = (n) => "⭐".repeat(n) + "☆".repeat(3 - n);

  // ---------- ניווט בין מסכים ----------
  const TITLES = {
    home: "הלוח של מיקה",
    focus: "לוח הכפל",
    practice: "תרגול עם מרגו",
    result: "סוף הסבב",
    map: "מפת הכפל",
    album: "האלבום",
  };
  let current = "home";

  function show(name, title) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("screen-" + name).classList.add("active");
    $("topTitle").textContent = title || TITLES[name];
    current = name;
    window.scrollTo(0, 0);
    if (name === "home") renderHome();
  }

  // ---------- צלילים ----------
  let audioCtx = null;
  function chime() {
    if (!state.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      [660, 880].forEach((f, i) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        const t = audioCtx.currentTime + i * 0.13;
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
        o.connect(g).connect(audioCtx.destination);
        o.start(t);
        o.stop(t + 0.5);
      });
    } catch (e) { /* בלי צליל */ }
  }

  // ---------- הקראה ----------
  let heVoice = null;
  function findVoice() {
    if (!("speechSynthesis" in window)) return;
    heVoice = speechSynthesis.getVoices().find((v) => /^he|^iw/i.test(v.lang)) || null;
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

  // ---------- מסך הבית ----------
  function renderHome() {
    const wrap = $("cards");
    wrap.innerHTML = "";
    for (let n = 1; n <= 10; n++) {
      const card = document.createElement("button");
      card.className = "card";
      setColor(card, n);
      card.setAttribute("aria-label", `לוח ${n}`);
      let rows = "";
      for (let i = 1; i <= 10; i++) rows += `<div>${n}×${i}=${n * i}</div>`;
      card.innerHTML = `
        <div class="card-rows">${rows}</div>
        <div class="card-side">
          <img class="card-dog" src="img/margo-face.jpg" alt="">
          <div class="card-num">${n}</div>
          <div class="card-stars">${starsText(state.stars[n] || 0)}</div>
        </div>`;
      card.onclick = () => openFocus(n);
      wrap.appendChild(card);
    }

    const doneToday = state.daily.last === todayStr();
    $("btnDaily").classList.toggle("done", doneToday);
    $("dailyStatus").textContent = doneToday ? "✅ הושלם היום!" : "5 שאלות";
    $("streakNum").textContent = currentStreak();
    $("albumStatus").textContent = `${state.album.length} מתוך 10`;
  }

  function currentStreak() {
    const { last, streak } = state.daily;
    if (!last) return 0;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return last === todayStr() || last === todayStr(y) ? streak : 0;
  }

  // ---------- לוח אחד בגדול ----------
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
      rows += `<div class="row"><span>${focusN} × ${i} =</span><span class="ans">${focusN * i}</span></div>`;
    }
    card.innerHTML = `
      <div class="focus-big">
        <div class="focus-num">${focusN}</div>
        <img class="focus-dog" src="img/margo-face.jpg" alt="מרגו">
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

  // ---------- תרגול ----------
  let quiz = null;

  function startPractice(n) {
    const bs = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, PRACTICE_LEN);
    quiz = { mode: "table", table: n, qs: bs.map((b) => [n, b]), i: 0, score: 0, firstTry: true };
    show("practice", `תרגול לוח ${n}`);
    renderBones();
    renderQuestion();
  }

  function startDaily() {
    const qs = [];
    const seen = new Set();
    while (qs.length < DAILY_LEN) {
      const a = rand(2, 10), b = rand(2, 10);
      const k = Math.min(a, b) + "x" + Math.max(a, b);
      if (seen.has(k)) continue;
      seen.add(k);
      qs.push([a, b]);
    }
    quiz = { mode: "daily", table: null, qs, i: 0, score: 0, firstTry: true };
    show("practice", "📅 האתגר היומי");
    renderBones();
    renderQuestion();
  }

  function renderBones() {
    const wrap = $("bones");
    wrap.innerHTML = "";
    quiz.qs.forEach((_, i) => {
      const s = document.createElement("span");
      s.className = "bone";
      s.textContent = "🦴";
      wrap.appendChild(s);
    });
  }

  function updateBones() {
    [...$("bones").children].forEach((b, i) => {
      b.classList.toggle("current", i === quiz.i);
    });
  }

  function makeOptions(a, b) {
    const ans = a * b;
    const cand = shuffle([a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, ans + 1, ans - 1, ans + 2, ans + a, ans - a]);
    const opts = [ans];
    for (const c of cand) {
      if (opts.length === 4) break;
      if (c > 0 && !opts.includes(c)) opts.push(c);
    }
    while (opts.length < 4) {
      const c = ans + rand(-6, 6);
      if (c > 0 && !opts.includes(c)) opts.push(c);
    }
    return shuffle(opts);
  }

  function renderQuestion() {
    const [a, b] = quiz.qs[quiz.i];
    quiz.firstTry = true;
    quiz.answered = false;
    const qBox = document.querySelector(".question");
    setColor(qBox, quiz.mode === "table" ? quiz.table : a);
    $("question").textContent = `${a} × ${b} = ?`;
    $("hint").innerHTML = "";
    $("btnNextQ").hidden = true;
    $("bubble").textContent = pick(ENCOURAGE);
    updateBones();

    const wrap = $("options");
    wrap.innerHTML = "";
    makeOptions(a, b).forEach((v) => {
      const btn = document.createElement("button");
      btn.className = "opt";
      btn.textContent = v;
      btn.onclick = () => answer(btn, v);
      wrap.appendChild(btn);
    });
  }

  function answer(btn, v) {
    if (quiz.answered || btn.classList.contains("tried")) return;
    const [a, b] = quiz.qs[quiz.i];
    if (v === a * b) {
      quiz.answered = true;
      btn.classList.add("right");
      document.querySelectorAll(".opt").forEach((o) => (o.disabled = true));
      $("question").textContent = `${a} × ${b} = ${a * b}`;
      if (quiz.firstTry) {
        quiz.score++;
        $("bones").children[quiz.i].classList.add("got");
      }
      $("bubble").textContent = quiz.firstTry ? pick(PRAISE) : "יופי, הצלחת! 💜";
      $("hint").innerHTML = "";
      const m = $("margoBig");
      m.classList.remove("nod");
      void m.offsetWidth;
      m.classList.add("nod");
      chime();
      $("btnNextQ").hidden = false;
      $("btnNextQ").focus();
    } else {
      quiz.firstTry = false;
      btn.classList.add("tried");
      btn.disabled = true;
      $("bubble").textContent = "כמעט! בואי נספור ביחד 🐾";
      showHint(a, b);
    }
  }

  function showHint(a, b) {
    // סופרים בקפיצות של המספר הגדול, עד צעד אחד לפני התשובה
    const step = Math.max(a, b), times = Math.min(a, b);
    const seq = [];
    for (let i = 1; i < times; i++) seq.push(step * i);
    const txt = seq.length
      ? `נספור בקפיצות של ${step}: <bdi dir="ltr" class="seq">${seq.join(", ")}, ?</bdi>`
      : `${times} פעמים ${step} זה פשוט ${step} 😉`;
    $("hint").innerHTML = "💡 " + txt;
  }

  function nextQuestion() {
    quiz.i++;
    if (quiz.i >= quiz.qs.length) finishQuiz();
    else renderQuestion();
  }

  function finishQuiz() {
    const { score, qs, mode, table } = quiz;
    const total = qs.length;
    let unlocked = false;

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
      }
      $("resultStars").textContent = `🔥 ${state.daily.streak} ימים ברצף!`;
    }
    save();

    const great = score >= total * 0.8;
    $("resultTitle").textContent = great ? "כל הכבוד מיקה! 🎉" : "עבודה יפה מיקה! 💜";
    $("resultScore").textContent = `${score} מתוך ${total} בניסיון הראשון`;
    $("resultPhoto").src = pick(["img/mika-rome.jpg", "img/mika-corn.jpg"]);
    $("resultUnlock").hidden = !unlocked;
    $("btnResultAlbum").hidden = !unlocked;
    $("btnAgain").textContent = mode === "daily" ? "🎯 לתרגול לוחות" : "🔁 עוד סבב";
    show("result");
  }

  $("btnNextQ").onclick = nextQuestion;
  $("btnSpeak").onclick = () => {
    const [a, b] = quiz.qs[quiz.i];
    speak(`${NUM_WORDS[a]} כפול ${NUM_WORDS[b]}`);
  };
  $("btnAgain").onclick = () => {
    if (quiz.mode === "daily") show("home");
    else startPractice(quiz.table);
  };
  $("btnResultHome").onclick = () => show("home");
  $("btnResultAlbum").onclick = () => { renderAlbum(); show("album"); };

  // ---------- מפת הכפל ----------
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
        cell.className = "cell";
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = r * c;
        cell.onclick = () => pickCell(r, c);
        cell.onmouseenter = () => lineCells(r, c);
        map.appendChild(cell);
      }
    }
    map.onmouseleave = () => { if (picked) lineCells(...picked); else lineCells(0, 0); };
    $("mapInfo").textContent = "לחצי על משבצת 👆";
    picked = null;
  }

  let picked = null;
  function lineCells(r, c) {
    $("map").querySelectorAll(".cell").forEach((el) => {
      const er = +el.dataset.r || 0, ec = +el.dataset.c || 0;
      const inLine = (r && er === r && (ec <= c)) || (c && ec === c && (er <= r));
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

  // ---------- אלבום ----------
  function photoHtml(n) {
    const p = ALBUM[n];
    const style = `object-position:${p.pos};filter:${p.filter || "none"};${p.rotate ? "transform:rotate(180deg);" : ""}`;
    return `<img class="ph" src="${p.src}" alt="${p.cap}" style="${style}">`;
  }

  function renderAlbum() {
    const wrap = $("album");
    wrap.innerHTML = "";
    for (let n = 1; n <= 10; n++) {
      const open = state.album.includes(n);
      const el = document.createElement(open ? "button" : "div");
      el.className = "polaroid" + (open ? "" : " locked");
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

  // ---------- כפתורים עליונים ----------
  $("btnHome").onclick = () => show("home");
  $("btnDaily").onclick = startDaily;
  $("btnMap").onclick = () => { renderMap(); show("map"); };
  $("btnAlbum").onclick = () => { renderAlbum(); show("album"); };

  function applyToggles() {
    $("btnSound").classList.toggle("off", !state.sound);
    $("btnSound").textContent = state.sound ? "🔔" : "🔕";
    document.body.classList.toggle("calm", !!state.calm);
    $("btnCalm").classList.toggle("off", !state.calm);
    $("btnCalm").title = state.calm ? "מצב רגוע פעיל (בלי אנימציות)" : "מצב רגוע (בלי אנימציות)";
  }
  $("btnSound").onclick = () => { state.sound = !state.sound; save(); applyToggles(); };
  $("btnCalm").onclick = () => { state.calm = !state.calm; save(); applyToggles(); };

  $("btnFull").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // ---------- מקלדת ----------
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("photoModal").hidden) $("photoModal").hidden = true;
      else if (current !== "home") show("home");
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

  // ---------- מרגו מציצה (רק במסך הבית והאלבום) ----------
  setInterval(() => {
    if (state.calm || !["home", "album"].includes(current)) return;
    const p = $("peek");
    p.classList.add("show");
    setTimeout(() => p.classList.remove("show"), 3500);
  }, 30000);

  // ---------- תזכורת להפסקה ----------
  let breakTimer;
  function armBreak() {
    clearTimeout(breakTimer);
    breakTimer = setTimeout(() => ($("breakModal").hidden = false), BREAK_MINUTES * 60 * 1000);
  }
  $("btnBreakDone").onclick = () => { $("breakModal").hidden = true; armBreak(); };

  // ---------- התחלה ----------
  if (state.calm === null) state.calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  applyToggles();
  renderHome();
  armBreak();
})();
