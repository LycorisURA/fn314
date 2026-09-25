/* FI Quest game layer: XP and ranks, achievements, daily quests, day streaks, sounds, confetti, floating numbers. */
window.GAME = (() => {
const $ = (s, r = document) => r.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = n => Number(n).toLocaleString("en-US");
const today = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const dayKey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

/* ---------- binding to app state ---------- */
let getS = () => ({}), save = () => { }, hooks = {};
function init(o) { getS = o.getS; save = o.save; hooks = o.hooks || {}; ensure(); rollDay(); }
function ensure() {
  const S = getS();
  S.xp = S.xp || 0; S.bond = S.bond || 0; S.level = S.level || 1;
  S.ach = S.ach || {}; S.gifts = S.gifts || {}; S.wear = S.wear || "";
  S.stats = Object.assign({ flips: 0, labs: {}, pats: 0, gifts: 0, chats: 0, quests: 0, pops: 0, popsRight: 0, drags: 0, examBest: 0, saOk: 0, hardOk: 0, reviewCleared: 0, pages: {}, answered: 0, sortPerfect: 0, sessions: 0, night: 0, early: 0 }, S.stats || {});
  S.days = Object.assign({ last: "", streak: 0, hist: [] }, S.days || {});
  S.quests = S.quests || { date: "", list: [] };
  if (S.sound === undefined) S.sound = true;
}

/* ---------- ranks ---------- */
const RANKS = [[1, "Trainee Teller"], [3, "Teller"], [5, "Loan Officer"], [7, "Credit Analyst"], [9, "Treasury Dealer"], [11, "Risk Analyst"], [13, "Branch Manager"], [15, "Fund Manager"], [17, "Chief Risk Officer"], [19, "Deputy Governor"], [22, "Governor"], [25, "Legend of Silom Road"]];
const xpFor = L => 45 * (L - 1) * (L - 1) + 60 * (L - 1);
const levelOf = xp => { let L = 1; while (xpFor(L + 1) <= xp) L++; return L; };
const rankOf = L => { let t = RANKS[0][1]; RANKS.forEach(([l, n]) => { if (L >= l) t = n; }); return t; };
const nextRank = L => RANKS.find(([l]) => l > L);
function levelInfo() {
  const S = getS(), L = levelOf(S.xp), a = xpFor(L), b = xpFor(L + 1);
  return { level: L, title: rankOf(L), xp: S.xp, into: S.xp - a, need: b - a, frac: (S.xp - a) / (b - a), next: nextRank(L) };
}
function xp(n, anchor, why) {
  if (!n) return;
  const S = getS(), before = levelOf(S.xp);
  S.xp += n; float("+" + n + " XP", anchor, "xp", 22);
  const after = levelOf(S.xp);
  if (after > before) { S.level = after; rankUp(after); }
  save(); paintHud();
  checkAch();
}
function rankUp(L) {
  const title = rankOf(L), info = levelInfo();
  sfx("levelup"); confetti(160);
  overlay(`<span class="kicker">Rank up</span><div class="rankbig">${L}</div><h2 style="font-size:26px">${title}</h2><p class="muted">${info.next ? "Next title at level " + info.next[0] + ": " + info.next[1] : "You have reached the top of the ladder."}</p><button type="button" class="btn primary" data-close>Keep going</button>`);
  if (hooks.onLevelUp) hooks.onLevelUp(L, title);
}

/* ---------- day streak ---------- */
function rollDay() {
  const S = getS(), t = today();
  if (S.days.last === t) return false;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.days.streak = S.days.last === dayKey(y) ? S.days.streak + 1 : 1;
  const gap = S.days.last ? Math.round((new Date(t) - new Date(S.days.last)) / 864e5) : 0;
  S.days.last = t; S.days.hist = [...new Set([...(S.days.hist || []), t])].slice(-14);
  S.stats.sessions++;
  save();
  if (hooks.onNewDay) hooks.onNewDay(S.days.streak, gap);
  return true;
}
function daysHtml() {
  const S = getS(), out = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); const k = dayKey(d); out.push(`<span class="${S.days.hist.includes(k) ? "on" : ""} ${i === 0 ? "today" : ""}" title="${k}">${["S", "M", "T", "W", "T", "F", "S"][d.getDay()]}</span>`); }
  return `<div class="days">${out.join("")}</div>`;
}

/* ---------- achievements ---------- */
const ACH = [
  { id: "first", ic: "🪙", name: "First deposit", d: "Answer one question correctly", t: s => s.correct >= 1 },
  { id: "ten", ic: "📗", name: "Ten in the book", d: "10 questions correct", t: s => s.correct >= 10 },
  { id: "fifty", ic: "📘", name: "Half a hundred", d: "50 questions correct", t: s => s.correct >= 50 },
  { id: "hundred", ic: "📕", name: "Century", d: "100 questions correct", t: s => s.correct >= 100 },
  { id: "twohundred", ic: "📚", name: "Bookworm", d: "200 questions correct", t: s => s.correct >= 200 },
  { id: "all", ic: "🏦", name: "Full ledger", d: "Every question in the bank correct", t: s => s.correct >= s.total && s.total > 0 },
  { id: "streak5", ic: "🔥", name: "On a roll", d: "5 correct in a row", t: s => s.S.best >= 5 },
  { id: "streak10", ic: "🚀", name: "Unstoppable", d: "10 correct in a row", t: s => s.S.best >= 10 },
  { id: "streak20", ic: "💫", name: "Compound interest", d: "20 correct in a row", t: s => s.S.best >= 20 },
  { id: "stamp1", ic: "📮", name: "First seal", d: "Master a chapter (80% of its quiz)", t: s => Object.keys(s.S.stamps).length >= 1 },
  { id: "stampall", ic: "👑", name: "Seven seals", d: "Master all seven chapters", t: s => Object.keys(s.S.stamps).length >= 7 },
  { id: "hard10", ic: "🧠", name: "Difficult taste", d: "10 difficult questions correct", t: s => s.S.stats.hardOk >= 10 },
  { id: "sa5", ic: "✍️", name: "Wordsmith", d: "Pass 5 written answers", t: s => s.S.stats.saOk >= 5 },
  { id: "sortperf", ic: "🃏", name: "Clean sort", d: "A perfect sorter round", t: s => s.S.stats.sortPerfect >= 1 },
  { id: "sort50", ic: "🎴", name: "Card shark", d: "50 sorter cards right", t: s => Object.values(s.S.wins).reduce((a, w) => a + w.won, 0) >= 50 },
  { id: "flip50", ic: "🔁", name: "Flip flop", d: "Flip 50 flashcards", t: s => s.S.stats.flips >= 50 },
  { id: "labs", ic: "🧪", name: "Lab rat", d: "Open all seven labs", t: s => Object.keys(s.S.stats.labs).length >= 7 },
  { id: "exam80", ic: "🎓", name: "Distinction", d: "Score 80% or more on a mock exam", t: s => s.S.stats.examBest >= 80 },
  { id: "exam100", ic: "💯", name: "Flawless paper", d: "A perfect mock exam", t: s => s.S.stats.examBest >= 100 },
  { id: "debtfree", ic: "🧾", name: "Debt free", d: "Clear a review pile of five or more", t: s => s.S.stats.reviewCleared >= 1 },
  { id: "night", ic: "🌙", name: "Night owl", d: "Answer a question after midnight", t: s => s.S.stats.night >= 1 },
  { id: "early", ic: "🌅", name: "Early bird", d: "Answer a question before 8 am", t: s => s.S.stats.early >= 1 },
  { id: "days3", ic: "📅", name: "Three-day habit", d: "Study three days in a row", t: s => s.S.days.streak >= 3 },
  { id: "days7", ic: "🗓️", name: "One week straight", d: "Study seven days in a row", t: s => s.S.days.streak >= 7 },
  { id: "chat", pal: true, ic: "💬", name: "Said hello", d: "Send your companion a chat message", t: s => s.S.stats.chats >= 1 },
  { id: "pat10", pal: true, ic: "🤍", name: "Head pats", d: "Pat her ten times", t: s => s.S.stats.pats >= 10 },
  { id: "pat50", pal: true, ic: "💗", name: "Spoiled rotten", d: "Pat her fifty times", t: s => s.S.stats.pats >= 50 },
  { id: "gift", pal: true, ic: "🎁", name: "Gift giver", d: "Buy her a first gift", t: s => s.S.stats.gifts >= 1 },
  { id: "bond3", pal: true, ic: "🫶", name: "Study buddy", d: "Reach bond tier 3 with your companion", t: s => s.bondTier >= 3 },
  { id: "bond6", pal: true, ic: "💞", name: "Inseparable", d: "Reach the final bond tier", t: s => s.bondTier >= 6 },
  { id: "drag", pal: true, ic: "🫳", name: "Relocated", d: "Drag your companion somewhere new", t: s => s.S.stats.drags >= 1 },
  { id: "quests10", ic: "🗡️", name: "Quest hunter", d: "Claim ten daily quests", t: s => s.S.stats.quests >= 10 },
  { id: "rich", ic: "💰", name: "Five figures", d: "Hold ฿10,000 at once", t: s => s.S.bal >= 10000 },
  { id: "historian", ic: "🏛️", name: "Historian", d: "Read the crisis ledger, the regulator map and the formula sheet", t: s => s.S.stats.pages.crises && s.S.stats.pages.rosetta && s.S.stats.pages.formulas },
  { id: "pop5", pal: true, ic: "⚡", name: "Caught off guard", d: "Answer five of her pop quizzes", t: s => s.S.stats.popsRight >= 5 },
  { id: "lvl10", ic: "🏅", name: "Double digits", d: "Reach level 10", t: s => levelOf(s.S.xp) >= 10 },
  { id: "lvl20", ic: "🏆", name: "Governor material", d: "Reach level 20", t: s => levelOf(s.S.xp) >= 20 }
];
let bondTierFn = () => 0, totals = () => ({ correct: 0, total: 0 });
function checkAch() {
  const S = getS(), t = totals(), ctx = { S, correct: t.correct, total: t.total, bondTier: bondTierFn() };
  const got = [];
  const palOn = hooks.palOn ? hooks.palOn() : true;
  ACH.forEach(a => { if (S.ach[a.id] || (a.pal && !palOn)) return; let ok = false; try { ok = !!a.t(ctx); } catch (e) { } if (ok) { S.ach[a.id] = today(); got.push(a); } });
  if (!got.length) return;
  save();
  got.forEach((a, i) => setTimeout(() => {
    sfx("ach"); confetti(60); toast(a.ic + " Achievement: " + a.name, "gold");
    S.xp += 50; save(); paintHud();
    if (hooks.onAchievement) hooks.onAchievement(a);
  }, i * 1400));
}

/* ---------- daily quests ---------- */
const QUESTS = [
  { id: "answer8", ic: "📝", name: "Warm up", d: "Answer {n} questions", ev: "answer", n: 8, coin: 150, xp: 60 },
  { id: "right5", ic: "✅", name: "Five deposits", d: "Get {n} questions right", ev: "correct", n: 5, coin: 200, xp: 70 },
  { id: "hard2", ic: "🧠", name: "Hard mode", d: "Get {n} difficult questions right", ev: "hard", n: 2, coin: 250, xp: 90 },
  { id: "streak4", ic: "🔥", name: "Heat check", d: "Reach a streak of {n}", ev: "streak", n: 4, coin: 200, xp: 80, max: true },
  { id: "sort6", ic: "🃏", name: "Sorting hat", d: "Sort {n} cards correctly", ev: "sort", n: 6, coin: 120, xp: 50 },
  { id: "flip10", ic: "🔁", name: "Card flipper", d: "Flip {n} flashcards", ev: "flip", n: 10, coin: 100, xp: 40 },
  { id: "lab1", ic: "🧪", name: "Lab visit", d: "Play with a lab", ev: "lab", n: 1, coin: 120, xp: 50 },
  { id: "review2", ic: "🧾", name: "Settle up", d: "Clear {n} questions from the review pile", ev: "review", n: 2, coin: 200, xp: 80 },
  { id: "pat3", ic: "🤍", name: "Be nice to her", d: "Pat your companion {n} times", ev: "pat", n: 3, coin: 80, xp: 30, pal: true },
  { id: "case1", ic: "📂", name: "Field work", d: "Open a case file and answer one of its questions", ev: "caseq", n: 1, coin: 150, xp: 60 },
  { id: "sa1", ic: "✍️", name: "In your own words", d: "Pass a written answer", ev: "sa", n: 1, coin: 220, xp: 90 },
  { id: "pop1", ic: "⚡", name: "Quick reflexes", d: "Answer one of her pop quizzes", ev: "pop", n: 1, coin: 100, xp: 40, pal: true },
  { id: "chat1", ic: "💬", name: "Office hours", d: "Ask your companion something in chat", ev: "chat", n: 1, coin: 100, xp: 40, needsChat: true, pal: true },
  { id: "exam1", ic: "👾", name: "Boss fight", d: "Finish a mock exam", ev: "exam", n: 1, coin: 300, xp: 120 }
];
const seed = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; }; };
function rollQuests(force) {
  const S = getS(), t = today();
  if (!force && S.quests.date === t && S.quests.list.length) return S.quests.list;
  const palOn = hooks.palOn ? hooks.palOn() : true;
  const r = seed(t + "fiquest"), pool = QUESTS.filter(q => (!q.pal || palOn) && (!q.needsChat || (window.PAL && PAL.hasSample)));
  const out = [];
  while (out.length < 3 && pool.length) { const i = Math.floor(r() * pool.length); out.push(pool.splice(i, 1)[0]); }
  S.quests = { date: t, list: out.map(q => ({ id: q.id, prog: 0, claimed: false })) };
  save();
  return S.quests.list;
}
const questDef = id => QUESTS.find(q => q.id === id);
function questList() { return rollQuests().map(q => Object.assign({}, questDef(q.id), q, { done: q.prog >= questDef(q.id).n })); }
function track(ev, n = 1, anchor) {
  const S = getS();
  if (S.quests.date !== today()) rollQuests();
  let hit = null;
  S.quests.list.forEach(q => {
    const d = questDef(q.id); if (!d || d.ev !== ev || q.claimed) return;
    const was = q.prog >= d.n;
    q.prog = d.max ? Math.max(q.prog, n) : q.prog + n;
    if (q.prog >= d.n && !was) hit = d;
  });
  save();
  if (hit) { sfx("ach"); toast("Quest complete: " + hit.name, "gold"); if (hooks.onQuestDone) hooks.onQuestDone(hit); paintHud(); }
}
function claim(id, anchor) {
  const S = getS(), q = S.quests.list.find(x => x.id === id), d = questDef(id);
  if (!q || q.claimed || q.prog < d.n) return false;
  q.claimed = true; S.stats.quests++;
  if (hooks.onCoins) hooks.onCoins("QUEST " + d.name, d.coin, anchor);
  xp(d.xp, anchor);
  sfx("coin"); confetti(50); save();
  return true;
}

/* ---------- bond helpers (Claude's affection) ---------- */
const BOND = [[0, "Stranger at the counter"], [60, "Regular customer"], [180, "Study buddy"], [400, "Favourite person"], [800, "Partner in crime"], [1400, "Inseparable"], [2200, "Hers, completely"]];
function bondInfo() {
  const S = getS(), b = S.bond || 0;
  let tier = 0; BOND.forEach(([v], i) => { if (b >= v) tier = i; });
  const a = BOND[tier][0], nx = BOND[tier + 1];
  return { bond: b, tier, name: BOND[tier][1], into: b - a, need: nx ? nx[0] - a : 1, frac: nx ? (b - a) / (nx[0] - a) : 1, next: nx ? nx[1] : null, max: !nx };
}
bondTierFn = () => bondInfo().tier;
function bond(n, anchor) {
  if (!n) return null;
  const S = getS(), before = bondInfo().tier;
  S.bond = Math.max(0, (S.bond || 0) + n);
  if (n > 0) float("+" + n + " ♥", anchor, "love", 18);
  save(); paintHud();
  const after = bondInfo();
  if (after.tier > before) { sfx("love"); confetti(90); toast("♥ Bond: " + after.name, "pink"); if (hooks.onBondUp) hooks.onBondUp(after); }
  checkAch();
  return after;
}

/* ---------- HUD ---------- */
function paintHud() {
  const S = getS(), L = levelInfo(), B = bondInfo();
  const set = (id, v) => { const el = $(id); if (el && el.textContent !== String(v)) { el.textContent = v; const p = el.closest(".pill"); if (p) { p.classList.remove("bump"); void p.offsetWidth; p.classList.add("bump"); } } };
  set("#hud-lvl-n", L.level); set("#hud-lvl-t", L.title);
  const xpEl = $("#hud-xp"); if (xpEl) xpEl.style.width = (L.frac * 100).toFixed(1) + "%";
  set("#hud-bal", fmt(S.bal)); set("#hud-streak", S.streak); set("#hud-bond", B.bond); set("#hud-days", S.days.streak);
  const f = $("#hud-fire"); if (f) f.classList.toggle("cold", !S.streak);
  const snd = $("#btn-sound"); if (snd) snd.setAttribute("aria-pressed", String(!!S.sound));
}

/* ---------- fx: sound ---------- */
let ac = null;
const SFX = {
  correct: [[523, .07, "triangle"], [784, .16, "triangle", .07]],
  wrong: [[220, .12, "square", .045], [160, .2, "square", .04, .1]],
  coin: [[1318, .05, "sine"], [1760, .12, "sine", .06, .05]],
  levelup: [[523, .1], [659, .1, "triangle", .07, .1], [784, .1, "triangle", .07, .2], [1046, .3, "triangle", .08, .3]],
  ach: [[880, .08, "triangle"], [1108, .08, "triangle", .06, .08], [1318, .22, "triangle", .07, .16]],
  pat: [[640, .06, "sine", .05], [860, .08, "sine", .04, .05]],
  love: [[988, .08, "sine", .06], [1318, .16, "sine", .06, .08], [1568, .2, "sine", .05, .16]],
  click: [[440, .03, "sine", .03]],
  pop: [[700, .05, "triangle", .05], [900, .05, "triangle", .05, .06]],
  stamp: [[196, .12, "triangle", .1], [392, .3, "triangle", .08, .1]]
};
function sfx(name) {
  const S = getS(); if (!S.sound) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const t0 = ac.currentTime;
    (SFX[name] || SFX.click).forEach(([f, d, type = "sine", g = .06, at = 0]) => {
      const o = ac.createOscillator(), v = ac.createGain();
      o.type = type; o.frequency.value = f;
      v.gain.setValueAtTime(0, t0 + at); v.gain.linearRampToValueAtTime(g, t0 + at + .01); v.gain.exponentialRampToValueAtTime(.0001, t0 + at + d);
      o.connect(v); v.connect(ac.destination); o.start(t0 + at); o.stop(t0 + at + d + .02);
    });
  } catch (e) { }
}

/* ---------- fx: confetti ---------- */
const cv = $("#confetti"); let parts = [], raf = 0;
function confetti(n = 80) {
  if (reduce || !cv) return;
  const g = cv.getContext("2d"), cs = getComputedStyle(document.documentElement);
  const cols = ["--accent", "--gold", "--pink", "--good", "--c2", "--c3"].map(v => cs.getPropertyValue(v).trim());
  cv.width = innerWidth; cv.height = innerHeight;
  for (let i = 0; i < n; i++) parts.push({ x: innerWidth / 2 + (Math.random() - .5) * innerWidth * .5, y: innerHeight * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 3, c: pick(cols), a: Math.random() * Math.PI, va: (Math.random() - .5) * .3, life: 1 });
  if (!raf) tick();
  function tick() {
    g.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .98; p.a += p.va; p.life -= .012; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.c; g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore(); });
    parts = parts.filter(p => p.life > 0 && p.y < cv.height + 20);
    raf = parts.length ? requestAnimationFrame(tick) : (g.clearRect(0, 0, cv.width, cv.height), 0);
  }
}

/* ---------- fx: floating numbers & toasts ---------- */
function float(text, anchor, cls = "", dx = 0) {
  let x, y;
  if (anchor && anchor.getBoundingClientRect) { const r = anchor.getBoundingClientRect(); x = r.left + Math.min(r.width - 20, 40 + dx); y = r.top + 6; }
  else if (anchor && anchor.x !== undefined) { x = anchor.x + dx; y = anchor.y; }
  else { x = innerWidth / 2 + dx; y = innerHeight * .4; }
  if (y < 60 || y > innerHeight - 20) { x = innerWidth - 140 + dx; y = 70; }
  const el = document.createElement("div"); el.className = "float " + cls; el.textContent = text;
  el.style.left = clamp(x, 8, innerWidth - 120) + "px"; el.style.top = y + "px";
  document.body.appendChild(el); setTimeout(() => el.remove(), 1200);
}
function toast(t, cls = "") { const el = document.createElement("div"); el.className = "toast " + cls; el.textContent = t; $("#toasts").appendChild(el); setTimeout(() => el.remove(), 2800); }
function overlay(html) {
  const ov = document.createElement("div"); ov.className = "overlay"; ov.innerHTML = `<div class="card">${html}</div>`;
  const close = () => ov.remove();
  ov.addEventListener("click", e => { if (e.target === ov || e.target.closest("[data-close]")) close(); });
  document.body.appendChild(ov);
  const b = ov.querySelector("[data-close]"); if (b) b.focus();
  return ov;
}

/* ---------- misc trackers ---------- */
function hourStat() { const S = getS(), h = new Date().getHours(); if (h < 5) S.stats.night++; else if (h < 8) S.stats.early++; }

return {
  init, ensure, RANKS, ACH, QUESTS, BOND,
  xp, levelInfo, levelOf, xpFor, rankOf,
  checkAch, setTotals(fn) { totals = fn; },
  rollQuests, questList, track, claim, questDef,
  bond, bondInfo,
  rollDay, daysHtml, hourStat,
  paintHud, sfx, confetti, float, toast, overlay,
  today
};
})();
