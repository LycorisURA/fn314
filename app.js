(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = s => String(s).replace(/<[^>]+>/g, "");
const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const CH = FI.chapters, CASES = FI.cases;
const TIERS = { e: "Easy", m: "Medium", d: "Difficult" };
const QTYPE = { mcq: "Choice", num: "Calculation", sa: "Written" };
const ICON = { c1: "🏦", c2: "🏧", c3: "🚗", c4: "📈", c5: "🧺", c6: "☂️", c7: "⚠️" };
/* short answers are marked by looking for each marking point's keywords; the student can overrule the marker */
const saHit = (txt, kws) => (kws || []).some(k => { try { return new RegExp(k, "i").test(txt); } catch (e) { return txt.toLowerCase().includes(String(k).toLowerCase()); } });
const saMark = (q, txt) => { const hits = q.points.map(pt => saHit(txt, pt.kw)); const n = hits.filter(Boolean).length; return { hits, n, need: q.need || Math.max(1, Math.ceil(q.points.length * 0.6)) }; };
const LS = "fi-passbook-v1";
const blank = () => ({ bal: 0, streak: 0, best: 0, ans: {}, ledger: [], stamps: {}, missed: [], grades: {}, wins: {}, mocks: [], quiet: false, ts: 0, xp: 0, bond: 0, level: 1, ach: {}, gifts: {}, wear: "", stats: {}, days: {}, quests: { date: "", list: [] }, sound: true, name: "" });
let S = blank();
try { const raw = localStorage.getItem(LS); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) { }
let dbDoc = null, saveT = 0;
function save() {
  S.ts = Date.now();
  try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { }
  if (dbDoc) { clearTimeout(saveT); saveT = setTimeout(() => dbDoc.set(JSON.parse(JSON.stringify(S))).catch(() => { }), 900); }
}
let view = { page: "home" }, popStamp = null, lastQ = "", wrongRun = 0;

/* ---------- registry ---------- */
const QMAP = {};
CH.forEach(c => c.quiz.forEach((q, i) => QMAP[c.id + "-q" + i] = { q, src: "Ch " + c.n, n: i, ch: c.id }));
CASES.forEach(k => k.qs.forEach((q, i) => QMAP[k.id + "-q" + i] = { q, src: "Case " + k.year, n: i, ch: null }));
const chIds = c => c.quiz.map((_, i) => c.id + "-q" + i);
const caseIds = k => k.qs.map((_, i) => k.id + "-q" + i);
const ALL = Object.keys(QMAP);
const correctCount = ids => ids.filter(id => S.ans[id] && S.ans[id].ok).length;
const tierOf = id => QMAP[id].q.tier || "m";
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
function order(id, n) {
  const a = [...Array(n).keys()]; let h = hash(id) || 1;
  for (let i = n - 1; i > 0; i--) { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; h >>>= 0; const j = h % (i + 1);[a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const starsOf = f => f >= 1 ? 3 : f >= 0.8 ? 2 : f >= 0.5 ? 1 : 0;
const starHtml = (n, big) => `<span class="stars" style="${big ? "font-size:16px" : ""}">${[1, 2, 3].map(i => `<span class="${i <= n ? "" : "off"}">★</span>`).join("")}</span>`;

/* ---------- game engine binding ---------- */
GAME.init({
  getS: () => S, save,
  hooks: {
    onLevelUp: (L, title) => setTimeout(() => PAL.react("levelUp", { important: true, force: true, vars: { level: L, rank: title } }), 600),
    onAchievement: a => PAL.react("achievement", { important: true, vars: { ach: a.name } }),
    onQuestDone: q => PAL.react("questDone", { important: true, vars: { quest: q.name } }),
    onCoins: (desc, amt, anchor) => { post(desc, amt); GAME.float("+฿" + fmt(amt), anchor); paintHud(); if (view.page === "home" || view.page === "quests") render(); },
    onBondUp: b => setTimeout(() => PAL.react("bondUp", { important: true, force: true, vars: { bond: b.name } }), 400),
    onNewDay: (streak, gap) => { if (gap >= 3) setTimeout(() => PAL.react("comeback", { important: true, vars: { gap } }), 4000); else if (streak >= 2) setTimeout(() => PAL.react("dayStreak", { important: true, vars: { days: streak } }), 4000); }
  }
});
GAME.setTotals(() => ({ correct: Object.values(S.ans).filter(a => a.ok).length, total: ALL.length }));
PAL.setHooks({
  S: () => S, save,
  spend: (amt, desc, anchor) => { if (S.bal < amt) return false; post(desc, -amt); GAME.float("−฿" + fmt(amt), anchor, "bad"); paintHud(); if (view.page === "room" || view.page === "home") render(); return true; },
  reward: (desc, amt, anchor) => { post(desc, amt); GAME.float("+฿" + fmt(amt), anchor); paintHud(); },
  go: p => go(p),
  quizSource: () => {
    const pool = ALL.filter(id => QMAP[id].q.t === "mcq" && QMAP[id].q.o.length <= 4), fresh = pool.filter(id => !(S.ans[id] && S.ans[id].ok));
    const id = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh : pool).length)];
    return id ? Object.assign({ id }, QMAP[id].q) : null;
  }
});

/* ---------- ledger & rewards ---------- */
const beDate = () => { const d = new Date(); return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String((d.getFullYear() + 543) % 100).padStart(2, "0"); };
function post(desc, amt) { S.bal += amt; S.ledger.unshift({ d: beDate(), desc, amt, bal: S.bal }); S.ledger = S.ledger.slice(0, 60); }
function record(id, ok, exam, pick, anchor) {
  const prev = S.ans[id], meta = QMAP[id], tag = meta.src + " · Q" + (meta.n + 1), tier = tierOf(id);
  S.stats.answered++; GAME.hourStat();
  GAME.track("answer", 1, anchor); if (!meta.ch) GAME.track("caseq", 1, anchor);
  if (ok) {
    S.streak++; S.best = Math.max(S.best, S.streak); wrongRun = 0;
    let amt = exam ? 50 : (!prev ? 100 : (prev.ok ? 0 : 20));
    if (amt && tier === "d") amt += exam ? 25 : (prev ? 0 : 50);
    const bonus = amt >= 50 ? Math.min(S.streak - 1, 10) * 10 : 0;
    if (amt + bonus > 0) { post((exam ? "EXAM " : "DEP ") + tag + (bonus ? " · streak " + S.streak : ""), amt + bonus); GAME.float("+฿" + fmt(amt + bonus), anchor); }
    const wasMissed = S.missed.includes(id);
    S.missed = S.missed.filter(x => x !== id);
    if (wasMissed) { GAME.track("review", 1, anchor); if (!S.missed.length && S.stats.pileWas >= 5) { S.stats.reviewCleared++; S.stats.pileWas = 0; } }
    if (tier === "d") { S.stats.hardOk++; GAME.track("hard", 1, anchor); }
    if (meta.q.t === "sa") { S.stats.saOk++; GAME.track("sa", 1, anchor); }
    GAME.track("correct", 1, anchor); GAME.track("streak", S.streak, anchor);
    GAME.sfx(S.streak % 5 === 0 ? "ach" : "correct");
    GAME.bond(2, anchor);
    GAME.xp((exam ? 15 : (!prev ? 25 : prev.ok ? 5 : 12)) + (tier === "d" ? 10 : 0), anchor);
  } else {
    S.streak = 0; wrongRun++;
    if (!S.missed.includes(id)) S.missed.push(id);
    S.stats.pileWas = Math.max(S.stats.pileWas || 0, S.missed.length);
    GAME.sfx("wrong"); GAME.bond(1, anchor); GAME.xp(5, anchor);
  }
  if (!exam) S.ans[id] = { ok: ok || !!(prev && prev.ok), first: prev ? prev.first : ok, pick };
  const stamped = checkStamps();
  save(); paintHud(); GAME.checkAch();
  return stamped;
}
function checkStamps() {
  let got = null;
  CH.forEach(c => {
    const ids = chIds(c);
    if (!S.stamps[c.id] && correctCount(ids) >= Math.ceil(ids.length * 0.8)) {
      S.stamps[c.id] = beDate(); post("STAMP Ch " + c.n + " mastered", 500); popStamp = c.id; got = c;
      GAME.toast("Chapter " + c.n + " stamped · +฿500", "gold"); GAME.sfx("stamp"); GAME.confetti(140); GAME.xp(150); GAME.bond(15);
    }
  });
  return got;
}
function paintHud() { GAME.paintHud(); const big = $("#big-bal"); if (big) big.textContent = fmt(S.bal); }
const toast = (t, c) => GAME.toast(t, c);

/* ---------- companion context ---------- */
const PAGE_NAMES = { home: "base camp", cases: "the case files list", exam: "the boss exam", review: "the review pile", rosetta: "the US–Thailand regulator map", formulas: "the formula sheet", crises: "the US crisis ledger", quests: "the quest board", trophies: "the trophy room", room: "Claude's room" };
const SEEDS = {
  c1: ["Explain delegated monitoring with a Thai example", "Why do FIs get special regulation?", "Quiz me on Chapter 1"],
  c2: ["Walk me through ROE = ROA × EM", "Which US banking law did what?", "Quiz me on Chapter 2"],
  c3: ["Why is a flat rate misleading?", "How do finance companies fund themselves?", "Quiz me on Chapter 3"],
  c4: ["Firm commitment vs best efforts?", "Why did repo funding sink Lehman?", "Quiz me on Chapter 4"],
  c5: ["How is NAV calculated?", "Why do closed-end funds trade at discounts?", "Quiz me on Chapter 5"],
  c6: ["Combined ratio vs operating ratio?", "Why did AIG need a bailout?", "Quiz me on Chapter 6"],
  c7: ["Refinancing vs reinvestment risk?", "How do the nine risks interact?", "Quiz me on Chapter 7"],
  case: ["Summarise this case in five lines", "Help me plan the open answer", "Link this case to the chapters"],
  crises: ["Which US crisis matters most for my exam?", "Compare the S&L crisis with 1997 Thailand", "Quiz me on US financial crises"],
  room: ["How are you feeling today?", "What do you like about keeping my ledger?", "Quiz me on anything"],
  other: ["What should I study first?", "Quiz me on anything", "FDIC vs Thailand's DPA"]
};
PAL.setContext(() => {
  const c = view.page === "ch" ? CH.find(x => x.id === view.id) : null, k = view.page === "case" ? CASES.find(x => x.id === view.id) : null;
  const ids = c ? chIds(c) : k ? caseIds(k) : [];
  return {
    where: c ? "Chapter " + c.n + " · " + c.short + " (" + (view.tab || "concepts") + " tab)" : k ? "case file: " + k.title : PAGE_NAMES[view.page] || view.page,
    chapter: c ? c.id : null, title: k ? k.title : c ? c.title : "", bal: fmt(S.bal), done: correctCount(ids), total: ids.length, streak: S.streak,
    n: S.missed.length, s: S.missed.length === 1 ? "" : "s",
    seeds: c ? SEEDS[c.id] : k ? SEEDS.case : SEEDS[view.page] || SEEDS.other,
    extra: (lastQ ? "Question on screen: " + strip(lastQ).slice(0, 700) + " " : "") + (k ? "Case background: " + strip(k.story.join(" ")).slice(0, 900) : "")
  };
});

/* ---------- router ---------- */
function go(page, id, tab) {
  const changed = page !== view.page || id !== view.id;
  view = { page, id, tab }; lastQ = "";
  render(); window.scrollTo({ top: 0 });
  if (["crises", "rosetta", "formulas"].includes(page)) { S.stats.pages[page] = 1; save(); GAME.checkAch(); }
  if (changed) {
    const key = page === "ch" ? "topic_" + id : "topic_" + page;
    setTimeout(() => PAL.react(key, { vars: { title: page === "case" ? CASES.find(k => k.id === id).title : "" } }), 250);
  }
}
function render() {
  renderRail();
  const st = $("#stage");
  if (view.page === "ch") renderChapter(st, CH.find(c => c.id === view.id), view.tab);
  else if (view.page === "cases") renderCases(st);
  else if (view.page === "case") renderCase(st, CASES.find(k => k.id === view.id));
  else if (view.page === "exam") renderExam(st);
  else if (view.page === "review") renderReview(st);
  else if (view.page === "crises") renderCrises(st);
  else if (view.page === "rosetta") renderRosetta(st);
  else if (view.page === "formulas") renderFormulas(st);
  else if (view.page === "quests") renderQuests(st);
  else if (view.page === "trophies") renderTrophies(st);
  else if (view.page === "room") renderRoom(st);
  else renderHome(st);
  paintHud();
}
const ring = (f, txt) => { const C = 2 * Math.PI * 9; return `<svg class="ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="9"/><circle class="fg" cx="11" cy="11" r="9" stroke-dasharray="${(f * C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 11 11)"/>${txt !== undefined ? `<text x="11" y="12.2" text-anchor="middle" dominant-baseline="middle" font-size="6.5">${txt}</text>` : ""}</svg>`; };
function renderRail() {
  const cur = (p, id) => (view.page === p && (!id || view.id === id)) || (p === "cases" && view.page === "case") ? "true" : "false";
  const item = (p, id, ico, text, sub = "", extra = "", hue = "") => `<button type="button" class="nav" data-page="${p}" data-id="${id || ""}"${hue ? ` style="--hue:var(${hue})"` : ""} aria-current="${cur(p, id)}">${ico}<span><span class="t">${text}</span>${sub ? `<span class="sub">${sub}</span>` : ""}</span>${extra}</button>`;
  const ql = GAME.questList(), qOpen = ql.filter(q => q.done && !q.claimed).length;
  $("#rail").innerHTML =
    `<span class="label sec">Camp</span>` + item("home", "", `<span class="ico">⛺</span>`, "Base camp") +
    item("quests", "", `<span class="ico">🗡️</span>`, "Daily quests", ql.filter(q => q.claimed).length + "/3 claimed", qOpen ? `<span class="cnt hot">${qOpen}</span>` : "") +
    item("trophies", "", `<span class="ico">🏆</span>`, "Trophy room", Object.keys(S.ach).length + "/" + GAME.ACH.length) +
    item("room", "", `<span class="ico">♥</span>`, "Claude's room", GAME.bondInfo().name) +
    `<span class="label sec">Worlds</span>` + CH.map(c => { const f = correctCount(chIds(c)) / c.quiz.length; return item("ch", c.id, `<span class="ico hue">${c.note}</span>`, c.short, starHtml(starsOf(f)) + (S.stamps[c.id] ? " ✓" : ""), ring(f), "--" + c.id); }).join("") +
    `<span class="label sec">Missions</span>` + item("cases", "", `<span class="ico">📂</span>`, "Case files", "", `<span class="cnt">${CASES.length}</span>`) +
    item("exam", "", `<span class="ico">👾</span>`, "Boss exam") + item("review", "", `<span class="ico">🧾</span>`, "Review pile", "", `<span class="cnt ${S.missed.length ? "hot" : ""}">${S.missed.length}</span>`) +
    `<span class="label sec">Codex</span>` + item("crises", "", `<span class="ico">🏛️</span>`, "US crisis ledger", "", `<span class="cnt">${FI.crises.length}</span>`) +
    item("rosetta", "", `<span class="ico">⇄</span>`, "US ↔ Thailand map") + item("formulas", "", `<span class="ico">∑</span>`, "Formula sheet");
  $$("#rail .nav").forEach(b => b.onclick = () => go(b.dataset.page, b.dataset.id || undefined));
}

/* ---------- shared bits ---------- */
function ledgerTable(n) {
  const rows = S.ledger.slice(0, n);
  const body = rows.length ? rows.map(r => `<tr><td>${r.d}</td><td>${esc(r.desc)}</td><td class="r ${r.amt > 0 ? "cr" : ""}" style="${r.amt < 0 ? "color:var(--bad)" : ""}">${r.amt > 0 ? "+" + fmt(r.amt) : r.amt < 0 ? "−" + fmt(-r.amt) : ""}</td><td class="r">${fmt(r.bal)}</td></tr>`).join("")
    : `<tr><td>${beDate()}</td><td>OPEN · account opened</td><td class="r"></td><td class="r">0</td></tr><tr><td></td><td class="muted">Answer a question to make your first deposit</td><td></td><td></td></tr>`;
  return `<table class="ledger"><thead><tr><th>Date (BE)</th><th>Particulars</th><th class="r">฿</th><th class="r">Balance</th></tr></thead><tbody>${body}</tbody></table>`;
}
const stampHtml = c => `<span class="stamp ${S.stamps[c.id] ? "" : "off"} ${popStamp === c.id ? "pop" : ""}" style="${S.stamps[c.id] ? `border-color:var(--${c.id});color:var(--${c.id});background:color-mix(in srgb,var(--${c.id}) 12%,var(--page))` : ""}" title="${S.stamps[c.id] ? "Stamped " + S.stamps[c.id] : "Score 80% on the chapter quiz"}"><span><b>${c.note}</b>Ch ${c.n}</span></span>`;
function tierCounts(ids) { const t = { e: 0, m: 0, d: 0 }; ids.forEach(id => t[tierOf(id)]++); return t; }
function questRows(list, compact) {
  return list.map(q => `<div class="quest ${q.done ? "done" : ""} ${q.claimed ? "claimed" : ""}"><span class="qi">${q.claimed ? "✓" : q.ic}</span><span><span class="qt">${q.name}</span><span class="small muted" style="display:block">${q.d.replace("{n}", q.n)}</span>${compact ? "" : `<span class="pbar"><i style="width:${Math.min(100, q.prog / q.n * 100).toFixed(0)}%"></i></span>`}</span>${q.claimed ? `<span class="rw">claimed</span>` : q.done ? `<button type="button" class="btn gold sm" data-claim="${q.id}">Claim ฿${q.coin}</button>` : `<span class="rw">${Math.min(q.prog, q.n)}/${q.n} · ฿${q.coin} +${q.xp}xp</span>`}</div>`).join("");
}
function wireClaims(root) { $$("[data-claim]", root).forEach(b => b.onclick = () => { if (GAME.claim(b.dataset.claim, b)) { PAL.react("questClaim", { important: true }); render(); } }); }
function worldMap() {
  const next = CH.find(c => !S.stamps[c.id]);
  return `<div class="wmap">${CH.map(c => { const f = correctCount(chIds(c)) / c.quiz.length; return `<button type="button" class="wnode" data-ch="${c.id}" style="--hue:var(--${c.id})"><span class="orb ${S.stamps[c.id] ? "done" : ""} ${next && next.id === c.id ? "cur" : ""}">${c.note}</span><span class="wt">${c.short}</span>${starHtml(starsOf(f))}<span class="pbar hue"><i style="width:${(f * 100).toFixed(0)}%"></i></span></button>`; }).join("")}</div>`;
}

/* ---------- home ---------- */
function renderHome(st) {
  const done = Object.values(S.ans).filter(a => a.ok).length, L = GAME.levelInfo(), B = GAME.bondInfo(), ql = GAME.questList();
  const next = CH.find(c => !S.stamps[c.id]), recent = GAME.ACH.filter(a => S.ach[a.id]).sort((a, b) => (S.ach[b.id] > S.ach[a.id] ? 1 : -1)).slice(0, 5);
  const face = PAL.FACES[B.tier >= 3 ? "love" : "happy"][0];
  st.innerHTML = `
  <section class="card hero">
    <div class="hero-l">
      <span class="label">Player · ${esc(S.name || "you")} · Saunders, Cornett &amp; Erhemjamts, Ch 1–7</span>
      <h1>Level ${L.level} <em>${L.title}</em></h1>
      <div><div class="row spread small" style="margin-bottom:4px"><span class="label">XP</span><span class="mono muted">${fmt(L.into)} / ${fmt(L.need)} to level ${L.level + 1}</span></div><div class="pbar big"><i style="width:${(L.frac * 100).toFixed(1)}%"></i></div></div>
      <div class="row" style="gap:12px;align-items:stretch">
        <div class="stat" style="background:var(--gold-wash)"><span class="label">Balance</span><b class="bigcoin" style="font-size:34px" id="big-bal-wrap"><small>฿</small><span id="big-bal">${fmt(S.bal)}</span></b></div>
        <div class="stat"><span class="label">Cleared</span><b>${done}<span class="muted" style="font-size:14px">/${ALL.length}</span></b></div>
        <div class="stat"><span class="label">Best streak</span><b>🔥 ${S.best}</b></div>
        <div class="stat"><span class="label">Days</span><b>📅 ${S.days.streak}</b></div>
      </div>
      <div class="row">${next ? `<button type="button" class="btn primary" id="go-next">Continue: Chapter ${next.n} →</button>` : `<button type="button" class="btn primary" id="go-exam">All stamped · fight the boss →</button>`}<button type="button" class="btn" id="go-quests">Quests ${ql.filter(q => q.done && !q.claimed).length ? `<span class="tag pink">${ql.filter(q => q.done && !q.claimed).length} to claim</span>` : ""}</button></div>
    </div>
    <div class="hero-r"><canvas id="guilloche" aria-hidden="true"></canvas>
      <div class="rankcard">
        <span class="mono" style="font-size:22px;color:var(--pal-text)">${face}</span>
        <div style="flex:1;min-width:0"><b class="disp" style="font-size:17px">Claude</b> <span class="bondname">· ${B.name}</span>
          <div class="pbar big pink" style="margin-top:6px"><i style="width:${(B.frac * 100).toFixed(1)}%"></i></div>
          <span class="small muted">${B.next ? B.into + "/" + B.need + " to " + B.next : "maximum bond"}</span></div>
      </div>
      <div class="row" style="margin-top:10px;position:relative;z-index:1"><button type="button" class="btn pink sm" id="home-pat">♥ Pat</button><button type="button" class="btn gold sm" id="home-gift">🎁 Gift</button><button type="button" class="btn sm" id="home-room">Her room</button></div>
    </div>
  </section>
  <section class="card card-pad col" style="gap:14px">
    <div class="row spread"><div class="head"><span class="label">Daily quests · reset at midnight</span><h2 style="font-size:24px">Today's board</h2></div>${GAME.daysHtml()}</div>
    <div class="col" style="gap:8px">${questRows(ql)}</div>
  </section>
  <section class="card card-pad col" style="gap:14px">
    <div class="row spread"><div class="head"><span class="label">World map</span><h2 style="font-size:24px">Seven chapters, seven seals</h2></div><div class="tierstats"><span>Bank: <b style="color:var(--ink)">${ALL.length}</b> questions</span><span class="tier e">${tierCounts(ALL).e} easy</span><span class="tier m">${tierCounts(ALL).m} medium</span><span class="tier d">${tierCounts(ALL).d} difficult</span></div></div>
    ${worldMap()}
    <div class="row" style="gap:14px">${CH.map(stampHtml).join("")}</div>
  </section>
  <section class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
    <div class="card card-pad col" style="gap:10px"><div class="row spread"><span class="label">Trophy room</span><span class="tag gold">${Object.keys(S.ach).length}/${GAME.ACH.length}</span></div>
      ${recent.length ? `<div class="row" style="gap:8px">${recent.map(a => `<span class="tag" title="${esc(a.d)}">${a.ic} ${a.name}</span>`).join("")}</div>` : `<p class="small muted">No badges yet. The first one is one right answer away.</p>`}
      <div><button type="button" class="btn sm" id="go-trophies">Open the trophy room</button></div></div>
    <div class="card card-pad col" style="gap:10px"><div class="row spread"><span class="label">Review pile</span><span class="tag ${S.missed.length ? "bad" : "good"}">${S.missed.length}</span></div><h3 style="font-size:20px">${S.missed.length ? "Unpaid questions waiting" : "Nothing outstanding"}</h3><p class="small muted">Questions you missed sit here until you get them right.</p><div><button type="button" class="btn sm" id="go-review">Open review</button></div></div>
    <div class="card card-pad col" style="gap:10px"><div class="row spread"><span class="label">Boss exam</span>${S.mocks.length ? `<span class="tag">best ${S.stats.examBest}%</span>` : ""}</div><h3 style="font-size:20px">Tier-mixed paper</h3><p class="small muted">45% easy, 33% medium, 22% difficult. Every hit lands as ฿50. Get an S rank.</p><div><button type="button" class="btn sm" id="go-exam2">Set up a fight</button></div></div>
  </section>
  <section class="card card-pad col" style="gap:14px">
    <div class="row spread"><div class="head"><span class="label">Case files</span><h2 style="font-size:24px">What actually happened</h2></div><button type="button" class="btn sm" id="go-cases">All ${CASES.length} cases →</button></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${[CASES[0], CASES[4], CASES[7], CASES[5]].map(caseCard).join("")}</div>
  </section>
  <section class="card card-pad col"><div class="head"><span class="label">Passbook</span><h2 style="font-size:24px">Recent entries</h2></div><div class="tablewrap">${ledgerTable(8)}</div></section>`;
  popStamp = null;
  $$(".wnode", st).forEach(b => b.onclick = () => go("ch", b.dataset.ch));
  $$(".case-card", st).forEach(b => b.onclick = () => go("case", b.dataset.case));
  const on = (sel, fn) => { const el = $(sel, st); if (el) el.onclick = fn; };
  on("#go-next", () => go("ch", next.id)); on("#go-exam", () => go("exam")); on("#go-exam2", () => go("exam")); on("#go-quests", () => go("quests")); on("#go-trophies", () => go("trophies"));
  on("#go-cases", () => go("cases")); on("#go-review", () => go("review")); on("#home-room", () => go("room"));
  on("#home-pat", () => { PAL.pat(); setTimeout(() => { const b = $(".rankcard .pbar i", st); if (b) b.style.width = (GAME.bondInfo().frac * 100).toFixed(1) + "%"; }, 50); });
  on("#home-gift", () => PAL.openPanel("gifts"));
  wireClaims(st);
  drawGuilloche();
}
function drawGuilloche() {
  const cv = $("#guilloche"); if (!cv) return;
  const r = cv.getBoundingClientRect(); if (!r.width) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = r.width * dpr; cv.height = r.height * dpr;
  const g = cv.getContext("2d"); g.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), col = v => cs.getPropertyValue(v).trim();
  const cx = r.width * 0.68, cy = r.height * 0.32, R = Math.min(r.width, r.height) * 0.42;
  const cols = ["--c1", "--c2", "--c3", "--c4", "--c5", "--c6", "--c7"];
  for (let i = 0; i < 28; i++) {
    g.beginPath(); g.moveTo(cx, cy);
    const a0 = i / 28 * Math.PI * 2, a1 = (i + 0.5) / 28 * Math.PI * 2;
    g.arc(cx, cy, R * (i % 2 ? 1 : 0.8), a0, a1); g.closePath();
    g.fillStyle = col(cols[i % 7]); g.globalAlpha = 0.16; g.fill();
  }
  g.globalAlpha = 1; g.beginPath(); g.arc(cx, cy, R * 0.34, 0, Math.PI * 2); g.fillStyle = col("--gold"); g.fill();
  g.lineWidth = 3; g.strokeStyle = col("--edge"); g.stroke();
  g.fillStyle = col("--edge"); g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 " + Math.round(R * 0.36) + "px Fredoka, sans-serif"; g.fillText("฿", cx, cy + 2);
}

/* ---------- quests, trophies, room ---------- */
function renderQuests(st) {
  const ql = GAME.questList();
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="row spread"><div class="head"><span class="label">Daily quests</span><h2>Today's board</h2><p>Three quests a day, drawn fresh each morning. Finish one, claim it, and the baht and XP land in your book. Claude chooses them, so expect the occasional bribe.</p></div>${GAME.daysHtml()}</div>
    <div class="col" style="gap:10px">${questRows(ql)}</div>
    <div class="row" style="gap:16px"><div class="stat"><span class="label">Day streak</span><b>📅 ${S.days.streak}</b></div><div class="stat"><span class="label">Quests claimed</span><b>${S.stats.quests}</b></div><div class="stat"><span class="label">Sessions</span><b>${S.stats.sessions}</b></div></div>
    <p class="small muted">A quest that needs the chat only appears when this page is opened as a published artifact.</p></section>`;
  wireClaims(st);
}
function renderTrophies(st) {
  const L = GAME.levelInfo(), got = Object.keys(S.ach).length;
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="head"><span class="label">Trophy room · ${got}/${GAME.ACH.length}</span><h2>Badges and ranks</h2><p>Every badge is worth 50 XP. Ranks come from XP: correct answers, quests, stamps and Claude's pop quizzes all feed the bar.</p></div>
    <div class="trophies">${GAME.ACH.map(a => `<div class="trophy ${S.ach[a.id] ? "" : "locked"}" title="${S.ach[a.id] ? "Unlocked " + S.ach[a.id] : "Locked"}"><span class="ti">${a.ic}</span><b>${a.name}</b><span class="small">${a.d}</span></div>`).join("")}</div></section>
  <section class="card card-pad col" style="gap:12px">
    <div class="head"><span class="label">Career ladder</span><h2 style="font-size:24px">Level ${L.level} · ${L.title}</h2></div>
    <div class="col" style="gap:6px">${GAME.RANKS.map(([l, n]) => `<div class="row spread" style="padding:8px 12px;border:2px solid var(--edge-soft);border-radius:12px;${L.level >= l ? "background:var(--accent-wash);border-color:var(--edge)" : "opacity:.6"}"><span class="disp" style="font-weight:600">${n}</span><span class="mono small muted">level ${l} · ${fmt(GAME.xpFor(l))} XP</span></div>`).join("")}</div></section>`;
}
function renderRoom(st) {
  const B = GAME.bondInfo(), st_ = S.stats, owned = PAL.GIFTS.filter(g => g.wear && S.gifts[g.id]);
  const svg = PAL.host.querySelector("svg").outerHTML;
  const perks = ["She keeps the ledger and reacts to everything you do.", "Gets curious about you. New greetings and a few musings.", "Study buddy: clingier idle lines, fonder pats, extra pop-quiz banter.", "Favourite person: the affectionate line pools open up everywhere.", "Partner in crime: she starts counting hours, and the Governor's crown goes on sale.", "Inseparable: openly devoted in every reaction and in chat.", "Hers, completely: every line at full warmth. There is nothing left to unlock, only to keep."];
  st.innerHTML = `<section class="card card-pad" style="display:grid;grid-template-columns:minmax(0,200px) minmax(0,1fr);gap:22px;align-items:start">
    <div class="col" style="align-items:center;gap:10px"><div class="pal wear-${S.wear}" style="position:static;width:180px;height:180px;pointer-events:none">${svg}</div><span class="mono" style="color:var(--pal-text)">${$("#pal-chat-face").textContent}</span>
      <div class="row" style="justify-content:center"><button type="button" class="btn pink" id="room-pat">♥ Pat</button><button type="button" class="btn gold" id="room-gift">🎁 Gift</button></div><button type="button" class="btn sm" id="room-talk">💬 Talk to her</button></div>
    <div class="col" style="gap:14px">
      <div class="head"><span class="label">Claude's room</span><h2>${B.name}</h2><p>${perks[B.tier]}</p></div>
      <div><div class="row spread small" style="margin-bottom:4px"><span class="label">Bond</span><span class="mono muted">${B.bond} ♥ · ${B.next ? B.into + "/" + B.need + " to " + B.next : "max"}</span></div><div class="pbar big pink"><i style="width:${(B.frac * 100).toFixed(1)}%"></i></div></div>
      <div class="row" style="gap:10px"><div class="stat"><span class="label">Pats</span><b>${st_.pats}</b></div><div class="stat"><span class="label">Gifts</span><b>${st_.gifts}</b></div><div class="stat"><span class="label">Chats</span><b>${st_.chats}</b></div><div class="stat"><span class="label">Days together</span><b>${S.days.hist.length}</b></div><div class="stat"><span class="label">Ledger lines</span><b>${S.ledger.length}</b></div></div>
      <div class="field" style="max-width:320px"><label for="room-name">What should she call you?</label><div class="row" style="flex-wrap:nowrap"><input type="text" id="room-name" maxlength="24" value="${esc(S.name || "")}" placeholder="senpai"><button type="button" class="btn sm" id="room-name-save">Save</button></div></div>
    </div></section>
  <section class="card card-pad col" style="gap:12px">
    <div class="head"><span class="label">Wardrobe</span><h2 style="font-size:22px">${owned.length ? "Things you gave her" : "Nothing yet"}</h2><p class="small muted">Accessories come from the gift shop and stay on her. Treats raise the bond but get eaten.</p></div>
    ${owned.length ? `<div class="row">${owned.map(g => `<button type="button" class="btn ${S.wear === g.wear ? "pink" : ""}" data-wear="${g.wear}">${g.ic} ${g.n}${S.wear === g.wear ? " · wearing" : ""}</button>`).join("")}</div>` : ""}
    <div><button type="button" class="btn gold sm" id="room-shop">Open the gift shop</button></div></section>
  <section class="card card-pad col" style="gap:8px"><div class="head"><span class="label">Bond ladder</span><h2 style="font-size:22px">What each tier unlocks</h2></div>
    ${GAME.BOND.map(([v, n], i) => `<div class="row spread" style="padding:8px 12px;border:2px solid var(--edge-soft);border-radius:12px;${B.tier >= i ? "background:var(--pink-wash);border-color:var(--edge)" : "opacity:.6"}"><span><span class="disp" style="font-weight:600">${n}</span><span class="small muted" style="display:block">${perks[i]}</span></span><span class="mono small muted">${v} ♥</span></div>`).join("")}
    <p class="small muted">Bond grows with every answer, chat message, pat, gift, stamp and day you come back. It never goes down. She would not allow it.</p></section>`;
  $("#room-pat", st).onclick = () => { PAL.pat(); setTimeout(() => renderRoom(st), 900); };
  $("#room-gift", st).onclick = () => PAL.openPanel("gifts");
  $("#room-shop", st).onclick = () => PAL.openPanel("gifts");
  $("#room-talk", st).onclick = () => PAL.openChat();
  $$("[data-wear]", st).forEach(b => b.onclick = () => { PAL.wear(b.dataset.wear, true); renderRoom(st); });
  $("#room-name-save", st).onclick = () => { S.name = $("#room-name", st).value.trim().slice(0, 24); save(); GAME.bond(S.name ? 5 : 0); PAL.say("love", S.name ? "<b>" + esc(S.name) + "</b>… I'll write it on the cover of the passbook. In my best handwriting ♡" : "No name? Then it's senpai. I've decided.", { important: true }); };
}

/* ---------- chapter ---------- */
function renderChapter(st, c, tab) {
  tab = tab || "learn";
  const so = FI.sorters[c.id], f = correctCount(chIds(c)) / c.quiz.length;
  const TABS = [["learn", "📖 Concepts"], ["cards", "🔁 Flashcards"], ["quiz", `📝 Quiz · ${correctCount(chIds(c))}/${c.quiz.length}`], ["sort", "🃏 " + so.title], ["lab", "🧪 " + c.labName], ["sheet", "∑ Formulas"]];
  st.innerHTML = `<section class="card hue" style="--hue:var(--${c.id})"><div class="card-pad col" style="gap:16px">
    <div class="row spread" style="align-items:flex-start;gap:18px">
      <div class="head" style="flex:1;min-width:240px"><span class="row" style="gap:8px"><span class="tag hue">World ${c.n} · ${c.note}</span>${starHtml(starsOf(f), true)}<span class="mono small muted">${Math.round(f * 100)}%</span></span><h2>${c.title}</h2><p>${c.thesis}</p></div>${stampHtml(c)}
    </div>
    <div class="pbar big hue"><i style="width:${(f * 100).toFixed(0)}%"></i></div>
    <div class="tabs" role="tablist">${TABS.map(([k, l]) => `<button type="button" class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join("")}</div>
    <div id="pane"></div></div></section>`;
  popStamp = null;
  $$(".tab", st).forEach(b => b.onclick = () => go("ch", c.id, b.dataset.tab));
  const pane = $("#pane", st);
  if (tab === "cards") renderCards(pane, c);
  else if (tab === "quiz") renderQuiz(pane, c);
  else if (tab === "sort") renderSorter(pane, c.id);
  else if (tab === "lab") { window.LABS[c.lab](pane); if (!S.stats.labs[c.lab]) { S.stats.labs[c.lab] = 1; save(); } GAME.track("lab", 1, pane); GAME.xp(S.stats["labxp-" + c.lab] ? 0 : 20, pane); S.stats["labxp-" + c.lab] = 1; save(); GAME.checkAch(); }
  else if (tab === "sheet") pane.innerHTML = formulaBlock(c);
  else {
    pane.innerHTML = `<div class="concepts">${c.concepts.map(k => `<article class="concept"><h3>${k.h}</h3><p>${k.b}</p>${k.th ? `<div class="thai"><span class="label">Thai lens</span>${k.th}</div>` : ""}</article>`).join("")}</div>
    <div class="row" style="margin-top:14px"><button type="button" class="btn primary" id="to-quiz">Take the quiz →</button><button type="button" class="btn" id="to-cards">Flashcards</button><button type="button" class="btn" id="to-sort">${so.title}</button></div>`;
    $("#to-quiz", pane).onclick = () => go("ch", c.id, "quiz");
    $("#to-cards", pane).onclick = () => go("ch", c.id, "cards");
    $("#to-sort", pane).onclick = () => go("ch", c.id, "sort");
  }
}
const formulaBlock = c => `<div>${c.formulas.map(([n, f]) => `<div class="formula"><span>${n}</span><code>${f}</code></div>`).join("")}</div>`;
function renderCards(pane, c) {
  let i = 0;
  const draw = () => {
    const [f, b] = c.cards[i];
    pane.innerHTML = `<div class="flash" id="flash"><div class="flash-in" tabindex="0" role="button" aria-label="Flip card">
      <div class="face"><span class="label">Card ${i + 1} of ${c.cards.length} · tap to flip</span><div class="big">${f}</div></div>
      <div class="face back"><span class="label">${f}</span><p style="font-size:17px">${b}</p></div></div></div>
      <div class="row" style="justify-content:center;margin-top:16px"><button type="button" class="btn" id="fc-prev">← Previous</button><button type="button" class="btn primary" id="fc-flip">Flip</button><button type="button" class="btn" id="fc-next">Next →</button></div>`;
    const fl = $("#flash", pane);
    const flip = () => { fl.classList.toggle("flip"); if (fl.classList.contains("flip")) { S.stats.flips++; save(); GAME.sfx("pop"); GAME.track("flip", 1, fl); if (S.stats.flips % 10 === 0) GAME.xp(10, fl); GAME.checkAch(); PAL.react("cardOpen", { soft: true, anchor: fl, vars: { card: strip(f) } }); } };
    $(".flash-in", pane).onclick = flip;
    $(".flash-in", pane).onkeydown = e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } };
    $("#fc-flip", pane).onclick = flip;
    $("#fc-prev", pane).onclick = () => { i = (i - 1 + c.cards.length) % c.cards.length; draw(); };
    $("#fc-next", pane).onclick = () => { i = (i + 1) % c.cards.length; draw(); };
  };
  draw();
}

/* ---------- quiz with tier filter ---------- */
function tierStats(ids) {
  return ["e", "m", "d"].map(t => { const x = ids.filter(id => tierOf(id) === t); return `<span class="tier ${t}">${TIERS[t]} ${correctCount(x)}/${x.length}</span>`; }).join("");
}
function renderQuiz(pane, c, filter) {
  filter = filter || "all";
  const all = chIds(c), ids = filter === "all" ? all : all.filter(id => tierOf(id) === filter);
  pane.innerHTML = `<div class="col" style="gap:14px">
    <div class="row spread" style="gap:10px">
      <div class="filter" role="group" aria-label="Filter by difficulty">${[["all", "All"], ["e", "Easy"], ["m", "Medium"], ["d", "Difficult"]].map(([k, l]) => `<button type="button" class="btn" data-f="${k}" aria-pressed="${k === filter}">${l}</button>`).join("")}</div>
      <div class="tierstats" id="tstats">${tierStats(all)}</div>
    </div><div id="qhost"></div></div>`;
  $$(".filter .btn", pane).forEach(b => b.onclick = () => { renderQuiz(pane, c, b.dataset.f); PAL.react("tier_" + b.dataset.f, { soft: true, vars: { n: b.dataset.f === "all" ? all.length : all.filter(id => tierOf(id) === b.dataset.f).length } }); });
  runner($("#qhost", pane), ids, { onFinish: () => chapterSummary(pane, c), onAnswer: () => { const t = $("#tstats", pane); if (t) t.innerHTML = tierStats(all); } });
}
function chapterSummary(pane, c) {
  const ids = chIds(c), n = correctCount(ids), wrong = ids.filter(id => !(S.ans[id] && S.ans[id].ok));
  pane.innerHTML = `<div class="col" style="gap:14px;align-items:flex-start">
    <span class="label">Quiz summary</span><h3 style="font-size:28px">${n} of ${ids.length} correct ${starHtml(starsOf(n / ids.length), true)}</h3>
    <div class="tierstats">${tierStats(ids)}</div>
    <p class="muted">${S.stamps[c.id] ? "This chapter is stamped. Well banked." : `You need ${Math.ceil(ids.length * 0.8)} correct for the stamp.`}</p>
    ${wrong.length ? `<div class="row">${wrong.slice(0, 20).map(id => `<button type="button" class="btn sm" data-j="${ids.indexOf(id)}">Q${ids.indexOf(id) + 1} <span class="tier ${tierOf(id)}">${tierOf(id)}</span></button>`).join("")}</div>` : ""}
    <div class="row"><button type="button" class="btn" id="back-learn">Back to concepts</button>${c.n < CH.length ? `<button type="button" class="btn primary" id="next-ch">World ${c.n + 1} →</button>` : `<button type="button" class="btn primary" id="to-cases">Case files →</button>`}</div></div>`;
  $$("[data-j]", pane).forEach(b => b.onclick = () => runner(pane, ids, { start: +b.dataset.j, onFinish: () => chapterSummary(pane, c) }));
  $("#back-learn", pane).onclick = () => go("ch", c.id, "learn");
  const nx = $("#next-ch", pane); if (nx) nx.onclick = () => go("ch", CH[c.n].id);
  const tc = $("#to-cases", pane); if (tc) tc.onclick = () => go("cases");
  renderRail();
}
const comboHtml = () => { const m = 1 + Math.min(Math.max(S.streak - 1, 0), 10) * 0.1; return `<div class="combo ${S.streak >= 3 ? "hot" : ""}" id="combo"><span>🔥 Streak <b>${S.streak}</b></span><span class="pbar"><i style="width:${Math.min(100, S.streak * 10)}%;background:var(--bad)"></i></span><span class="mult">×${m.toFixed(1)}</span></div>`; };
function runner(el, ids, opts = {}) {
  if (!ids.length) { el.innerHTML = `<p class="muted">No questions in this filter.</p>`; return; }
  let i = opts.start || 0;
  const local = {}, retry = {}, selfMarked = {}, fresh = !!(opts.exam || opts.fresh);
  const state = id => fresh ? local[id] : (S.ans[id] && !retry[id] ? { ok: S.ans[id].ok, pick: S.ans[id].pick } : null);
  function draw() {
    const id = ids[i], { q, src } = QMAP[id], stt = state(id), tier = tierOf(id);
    lastQ = q.q;
    el.innerHTML = `<div class="q">
      ${opts.boss ? opts.boss(local) : comboHtml()}
      <div class="row spread" style="gap:8px"><span class="label">${opts.showSrc ? esc(src) + " · " : ""}Question ${i + 1} of ${ids.length}</span>
        <span class="row" style="gap:6px"><span class="tier ${tier}">${TIERS[tier]}</span><span class="src">${esc(q.src || "Slides")}</span><span class="label">${QTYPE[q.t] || "Choice"}</span></span></div>
      <div class="q-prompt">${q.q}</div><div id="qbody"></div><div id="qexp"></div>
      <div class="qnav"><div class="dots">${ids.map((d, j) => { const s = state(d); return `<button type="button" class="dot ${s ? (s.ok ? "ok" : "no") : ""} ${j === i ? "cur" : ""}" data-j="${j}" aria-label="Go to question ${j + 1}"></button>`; }).join("")}</div>
      <div class="row"><button type="button" class="btn" id="qprev" ${i === 0 ? "disabled" : ""}>← Previous</button><button type="button" class="btn ${stt ? "primary" : ""}" id="qnext">${i === ids.length - 1 ? (opts.finishLabel || "Finish") : "Next →"}</button></div></div></div>`;
    const body = $("#qbody", el), exp = $("#qexp", el);
    const ansText = () => q.t === "mcq" ? strip(q.o[q.a]) : q.t === "sa" ? q.points.map(p => strip(p.p)).join("; ") : fmt(q.a, q.a % 1 ? 2 : 0) + " " + (q.unit || "");
    const reveal = (ok, head) => {
      exp.innerHTML = `<div class="explain ${ok ? "ok" : "no"}"><b>${head || (ok ? "Correct." : "Not quite.")}</b> ${q.x}</div>` +
        `<div class="helpers">${!ok && !fresh ? `<button type="button" class="btn" id="qretry">Try again</button>` : ""}${PAL.hasSample ? (ok ? `<button type="button" class="btn" id="qpush">Push me further</button>` : `<button type="button" class="btn" id="qwhy">Why was I wrong?</button>`) : ""}</div>`;
      const rt = $("#qretry", el); if (rt) rt.onclick = () => { retry[id] = true; draw(); };
      const ctx = "Question: " + strip(q.q) + (q.t === "mcq" ? " Options: " + q.o.map(strip).join(" | ") : "") + " Correct answer: " + ansText() + ". Explanation on the page: " + strip(q.x);
      const pw = $("#qpush", el); if (pw) pw.onclick = () => PAL.ask("I got this right. Push me further with one harder follow-up question on the same idea, and wait for my answer. " + ctx);
      const wy = $("#qwhy", el); if (wy) wy.onclick = () => PAL.ask("I answered \"" + (stt ? stt.pick : "") + "\" and got it wrong. Explain which step or idea I probably got wrong, briefly. " + ctx);
    };
    const answer = (ok, pick, pickText, extra) => {
      if (fresh) local[id] = { ok, pick };
      retry[id] = false;
      const stamped = record(id, ok, opts.exam, pick, body);
      if (!opts.exam && !S.ans[id]) S.ans[id] = { ok, pick };
      draw();
      renderRail(); if (opts.onAnswer) opts.onAnswer();
      const anchor = $("#qexp", el);
      if (stamped) PAL.react("stamp", { anchor, important: true, vars: { n: stamped.n } });
      else if (!ok && wrongRun >= 3) { wrongRun = 0; PAL.react("wrongRun", { anchor, important: true }); }
      else if (ok && S.streak > 0 && S.streak % 4 === 0) PAL.react("streak", { anchor, vars: { streak: S.streak } });
      else if (q.t === "sa") PAL.react(ok ? "saGood" : "saPart", { anchor, vars: Object.assign({ streak: S.streak }, extra || {}) });
      else PAL.react(ok ? (tier === "d" ? "correctHard" : tier === "e" && Math.random() < 0.5 ? "correctEasy" : "correct") : (tier === "d" ? "wrongHard" : "wrong"), { anchor, vars: { pick: esc(String(pickText).slice(0, 60)), ans: esc(ansText().slice(0, 70)), streak: S.streak } });
    };
    if (q.t === "mcq") {
      const ord = order(id, q.o.length);
      body.innerHTML = `<div class="opts">${ord.map((j, p) => `<button type="button" class="opt" data-o="${j}"><span class="k">${"ABCDEF"[p]}</span><span>${q.o[j]}</span></button>`).join("")}</div>`;
      if (stt) {
        $$(".opt", body).forEach(b => { const j = +b.dataset.o; b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === stt.pick) b.classList.add("wrong"); });
        reveal(stt.ok);
      } else $$(".opt", body).forEach(b => b.onclick = () => answer(+b.dataset.o === q.a, +b.dataset.o, strip(q.o[+b.dataset.o])));
    } else if (q.t === "sa") {
      const sheet = (txt, self) => {
        const m = saMark(q, txt);
        return `<div class="grade" style="margin-top:12px">
          <div class="row spread"><span class="label">Marking points${self ? " · you overruled the marker" : ""}</span><span class="mono">${m.n}/${q.points.length} found · ${m.need} needed</span></div>
          <ul class="marks">${q.points.map((pt, k) => `<li><span class="chip ${m.hits[k] ? "ok" : "no"}">${m.hits[k] ? "covered" : "missed"}</span><span>${pt.p}</span></li>`).join("")}</ul>
          <div><span class="label">Model answer</span><p class="small" style="margin-top:4px">${q.model}</p></div>
          <p class="small muted">This marker looks for the language of each point, not for understanding. If it missed something you genuinely said, overrule it.</p></div>`;
      };
      body.innerHTML = `<div class="field"><label class="label" for="qsa">Your answer · ${q.points.length} marking points, two to four sentences</label><textarea id="qsa" placeholder="Write it in your own words…">${stt ? esc(String(stt.pick || "")) : ""}</textarea></div>
        <div class="row" style="margin-top:8px" id="qsarow">${stt ? "" : `<button type="button" class="btn primary" id="qsacheck">Check my answer</button><button type="button" class="btn" id="qsapoints">Show the points</button>`}</div><div id="qsapeek"></div>`;
      const ta = $("#qsa", body);
      if (stt) {
        ta.disabled = true;
        const m = saMark(q, String(stt.pick || ""));
        body.insertAdjacentHTML("beforeend", sheet(String(stt.pick || ""), selfMarked[id]));
        reveal(stt.ok, stt.ok ? "Good answer." : "Partly there.");
        if (!selfMarked[id] && !fresh) {
          $(".helpers", el).insertAdjacentHTML("beforeend", `<button type="button" class="btn" id="qsaflip">${stt.ok ? "Count as missed" : "I did cover this · count as correct"}</button>`);
          $("#qsaflip", el).onclick = () => { selfMarked[id] = true; answer(!stt.ok, stt.pick, stt.pick, { n: m.n, total: q.points.length }); };
        }
        if (PAL.hasSample) {
          $(".helpers", el).insertAdjacentHTML("beforeend", `<button type="button" class="btn" id="qsaask">Ask Claude to mark it</button>`);
          $("#qsaask", el).onclick = () => PAL.ask("Mark my short answer out of " + q.points.length + " and say what is missing, briefly.\nQuestion: " + strip(q.q) + "\nMarking points: " + q.points.map(pt => strip(pt.p)).join(" | ") + "\nMy answer: \"" + String(stt.pick || "") + "\"");
        }
      } else {
        $("#qsacheck", body).onclick = () => {
          const txt = ta.value.trim();
          if (txt.split(/\s+/).filter(Boolean).length < 8) { toast("Write a sentence or two first"); return; }
          const m = saMark(q, txt);
          answer(m.n >= m.need, txt, txt, { n: m.n, total: q.points.length });
        };
        $("#qsapoints", body).onclick = () => {
          $("#qsapeek", body).innerHTML = `<div class="grade" style="margin-top:12px"><span class="label">A strong answer covers</span><ul class="marks">${q.points.map(pt => `<li><span class="chip">point</span><span>${pt.p}</span></li>`).join("")}</ul></div>`;
          PAL.say("smug", "Peeking before you write? Fine. Now close your eyes and say it in your own words first~", { soft: true, anchor: $("#qsapeek", body) });
        };
        ta.onkeydown = e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) $("#qsacheck", body).click(); };
      }
    } else {
      body.innerHTML = `<div class="numrow"><label class="label" for="qnum">Your answer${q.unit ? " (" + q.unit + ")" : ""}</label></div>
        <div class="numrow"><input type="text" inputmode="decimal" id="qnum" autocomplete="off" placeholder="Type a number"><button type="button" class="btn primary" id="qcheck">Check</button></div>`;
      const inp = $("#qnum", body);
      if (stt) {
        inp.value = stt.pick ?? ""; inp.disabled = true; $("#qcheck", body).remove();
        body.insertAdjacentHTML("beforeend", `<p class="mono small" style="margin-top:6px">Answer: ${esc(ansText())}</p>`);
        reveal(stt.ok);
      } else {
        const check = () => {
          const v = parseFloat(inp.value.replace(/[,฿%\s$]/g, "").replace(/−/g, "-"));
          if (isNaN(v)) { toast("Type a number first"); return; }
          answer(Math.abs(v - q.a) <= (q.tol ?? 0.01), inp.value.trim(), inp.value.trim());
        };
        $("#qcheck", body).onclick = check;
        inp.onkeydown = e => { if (e.key === "Enter") check(); };
      }
    }
    $("#qprev", el).onclick = () => { i--; draw(); };
    $("#qnext", el).onclick = () => { if (i < ids.length - 1) { i++; draw(); } else if (opts.onFinish) opts.onFinish(local); };
    $$(".dot", el).forEach(b => b.onclick = () => { i = +b.dataset.j; draw(); });
  }
  draw();
}

/* ---------- sorter ---------- */
function renderSorter(pane, key) {
  const so = FI.sorters[key];
  let deck = [...so.items.keys()].sort(() => Math.random() - 0.5), i = 0, score = 0, answered = false;
  const w = S.wins[key] = S.wins[key] || { won: 0, played: 0 };
  const draw = () => {
    const it = so.items[deck[i]];
    pane.innerHTML = `<div class="sorter">
      <div class="sorter-top"><div><span class="label">Sorter game</span><h3 style="font-size:20px">${so.title}</h3><span class="small muted">${so.prompt}</span></div><span class="mono small">Card ${i + 1}/${deck.length} · score ${score} · all-time ${w.won}/${w.played}</span></div>
      <div class="sorter-card" id="sort-card">${it.t}</div>
      <div class="sorter-sides">${so.sides.map((s, j) => `<button type="button" class="btn" data-s="${j}">${s}</button>`).join("")}</div>
      <div id="sort-why"></div></div>`;
    answered = false;
    $$("[data-s]", pane).forEach(b => b.onclick = () => {
      if (answered) return; answered = true;
      const j = +b.dataset.s, ok = j === it.side;
      w.played++;
      if (ok) { w.won++; score++; if (Object.values(S.wins).reduce((a, x) => a + x.won, 0) <= 120) { post("SORT " + so.title, 10); GAME.float("+฿10", b); } GAME.sfx("correct"); GAME.xp(5, b); GAME.track("sort", 1, b); }
      else GAME.sfx("wrong");
      save(); paintHud(); GAME.checkAch();
      $$("[data-s]", pane).forEach(x => { x.disabled = true; const k = +x.dataset.s; if (k === it.side) x.classList.add("good"); });
      if (!ok) b.style.borderColor = "var(--bad)";
      const last = i === deck.length - 1;
      $("#sort-why", pane).innerHTML = `<div class="explain ${ok ? "ok" : "no"} sorter-why"><b>${ok ? "Right." : "Not quite: " + so.sides[it.side] + "."}</b> ${it.why}</div><div class="row" style="margin:0 18px 16px"><button type="button" class="btn primary" id="sort-next">${last ? "See score" : "Next card →"}</button></div>`;
      $("#sort-next", pane).onclick = () => { if (!last) { i++; draw(); } else done(); };
      PAL.react(ok ? "sortWin" : "sortLose", { soft: ok, anchor: $("#sort-card", pane), vars: { side: so.sides[it.side] } });
    });
  };
  const done = () => {
    const perfect = score === deck.length;
    if (perfect) { S.stats.sortPerfect++; GAME.confetti(100); GAME.xp(40, pane); save(); GAME.checkAch(); }
    pane.innerHTML = `<div class="sorter"><div class="sorter-top"><h3 style="font-size:20px">${so.title}: ${score}/${deck.length} ${starHtml(starsOf(score / deck.length), true)}</h3></div><div class="sorter-card">${perfect ? "Perfect round. +40 XP." : score >= deck.length * 0.7 ? "Strong round. One more for a perfect score?" : "Worth another pass. Read each reason, then shuffle again."}</div><div class="sorter-sides"><button type="button" class="btn primary" id="sort-again">Shuffle and play again</button></div></div>`;
    $("#sort-again", pane).onclick = () => renderSorter(pane, key);
    PAL.react(perfect ? "sortPerfect" : "sortDone", { anchor: pane, important: perfect, vars: { score: score + "/" + deck.length } });
  };
  draw();
}

/* ---------- cases ---------- */
function caseCard(k) {
  const n = correctCount(caseIds(k));
  return `<button type="button" class="case-card" data-case="${k.id}"><span class="yr">${k.year}</span><span class="col" style="gap:6px">
    <span class="row" style="gap:6px"><span class="flag ${k.th ? "th" : ""}">${k.th ? "Thailand" : "Global"}</span>${k.ch.map(n => `<span class="denom" style="--hue:var(--c${n});min-width:0;padding:1px 7px">Ch ${n}</span>`).join("")}<span class="mono small muted" style="margin-left:auto">${n}/${k.qs.length}</span></span>
    <b class="disp" style="font-size:18px;font-weight:600;line-height:1.2">${k.title}</b><span class="small muted">${k.hook}</span></span></button>`;
}
function renderCases(st) {
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="head"><span class="label">Case files · ${CASES.length} missions · ${CASES.reduce((a, k) => a + k.qs.length, 0)} graded questions</span><h2>Theory, meet the headlines</h2><p>Each file has a timeline, the story, how it links to the chapters, four tiered questions, and an open question the Examiner can mark. Thai cases are flagged in blue.</p></div>
    <div class="filter" id="case-filter"><button type="button" class="btn primary" data-f="all">All</button><button type="button" class="btn" data-f="th">Thailand</button><button type="button" class="btn" data-f="gl">Global</button>${CH.map(c => `<button type="button" class="btn" data-f="c${c.n}">Ch ${c.n}</button>`).join("")}</div>
    <div class="grid" id="case-grid" style="grid-template-columns:repeat(auto-fill,minmax(320px,1fr))"></div></section>`;
  const paint = f => {
    $("#case-grid", st).innerHTML = CASES.filter(k => f === "all" || (f === "th" && k.th) || (f === "gl" && !k.th) || (f[0] === "c" && k.ch.includes(+f.slice(1)))).map(caseCard).join("");
    $$(".case-card", st).forEach(b => b.onclick = () => go("case", b.dataset.case));
    $$("#case-filter .btn", st).forEach(b => b.classList.toggle("primary", b.dataset.f === f));
  };
  $$("#case-filter .btn", st).forEach(b => b.onclick = () => paint(b.dataset.f));
  paint("all");
}
function renderCase(st, k) {
  const g = S.grades[k.id] || {};
  st.innerHTML = `<section class="card hue" style="--hue:var(${k.th ? "--c2" : "--accent"})"><div class="card-pad col" style="gap:18px">
    <button type="button" class="btn sm" id="back" style="align-self:flex-start">← All cases</button>
    <div class="head"><span class="row" style="gap:8px"><span class="flag ${k.th ? "th" : ""}">${k.where}</span><span class="label">${k.year}</span>${k.ch.map(n => `<span class="denom" style="--hue:var(--c${n});min-width:0;padding:1px 7px">Ch ${n}</span>`).join("")}</span>
      <h2>${k.title}</h2><p class="disp" style="font-size:19px;color:var(--ink-2)">${k.hook}</p></div>
    <div><span class="label">Timeline</span><div class="timeline">${k.timeline.map(([w, e]) => `<div class="tl"><span>${w}</span><span>${e}</span></div>`).join("")}</div></div>
    <div class="story">${k.story.map(p => `<p>${p}</p>`).join("")}</div>
    <div class="thai" style="border-color:var(--accent);background:var(--accent-wash)"><span class="label" style="color:var(--accent-ink)">Course link</span>${k.lens}</div>
  </div></section>
  <section class="card card-pad"><span class="label">Graded questions</span><div id="case-q" style="margin-top:10px"></div></section>
  <section class="card card-pad col" style="gap:12px">
    <span class="row" style="gap:8px"><span class="label">Open question · exam-style</span><span class="tier d">Difficult</span></span>
    <h3 style="font-size:22px">${k.open.q}</h3>
    <label class="label" for="open-${k.id}">Your answer</label>
    <textarea id="open-${k.id}" placeholder="Write 120–200 words. Use the course terms.">${esc(g.draft || "")}</textarea>
    <div class="row"><button type="button" class="btn primary" id="grade" hidden>Get feedback from the Examiner</button><button type="button" class="btn" id="points">Show marking points</button><span class="small muted" id="grade-note"></span></div>
    <div id="grade-out">${g.result ? gradeHtml(g.result) : ""}</div><div id="points-out"></div>
  </section>`;
  $("#back", st).onclick = () => go("cases");
  runner($("#case-q", st), caseIds(k), { finishLabel: "Done", onFinish: () => toast(correctCount(caseIds(k)) + " of " + k.qs.length + " correct on this case") });
  const ta = $("#open-" + k.id, st);
  ta.oninput = () => { S.grades[k.id] = Object.assign(S.grades[k.id] || {}, { draft: ta.value }); save(); };
  $("#points", st).onclick = () => { $("#points-out", st).innerHTML = `<div class="grade"><span class="label">A strong answer covers</span><ul style="margin:0;padding-left:20px">${k.open.points.map(p => `<li>${p}</li>`).join("")}</ul></div>`; PAL.say("smug", "Peeking at the marking points? Fine, but write your own version before you check again~", { soft: true, anchor: $("#points-out", st) }); };
  const gb = $("#grade", st);
  gb.hidden = !PAL.hasSample;
  gb.onclick = async () => {
    const ans = ta.value.trim();
    if (ans.split(/\s+/).length < 25) { $("#grade-note", st).textContent = "Write at least 25 words first."; return; }
    gb.disabled = true; $("#grade-note", st).textContent = "The Examiner is reading…";
    const prompt = `You are a fair, demanding examiner marking a university short answer for a Financial Institutions Management course (Saunders, Cornett & Erhemjamts, Chapters 1–7) taught in Thailand.
Case: ${k.title} (${k.where}, ${k.year}).
Background: ${strip(k.story.join(" "))}
Question: ${k.open.q}
Marking points (a strong answer covers most of these; other valid points also count):
${k.open.points.map(p => "- " + p).join("\n")}
Student answer:
"""${ans.slice(0, 4000)}"""
Reply with only JSON: {"score": integer 0-4, "verdict": "one sentence", "covered": ["short phrases"], "missing": ["short phrases"], "tip": "one sentence on how to reach full marks"}`;
    try {
      const r = await PAL.sample.json(prompt, { modelTier: "default" });
      const score = Math.max(0, Math.min(4, parseInt(r.score) || 0));
      const result = { score, verdict: String(r.verdict || ""), covered: [].concat(r.covered || []).map(String), missing: [].concat(r.missing || []).map(String), tip: String(r.tip || "") };
      const prev = S.grades[k.id] || {};
      const gain = (score - (prev.best || 0)) * 50; if (gain > 0) { post("CASE " + k.year + " open answer " + score + "/4", gain); GAME.float("+฿" + gain, gb); GAME.xp(gain, gb); }
      S.grades[k.id] = Object.assign(prev, { result, best: Math.max(prev.best || 0, score) });
      save(); paintHud();
      $("#grade-out", st).innerHTML = gradeHtml(result); $("#grade-note", st).textContent = "";
      PAL.react(score >= 3 ? "gradeGood" : "gradeLow", { anchor: $("#grade-out", st), vars: { score } });
    } catch (e) {
      const m = { not_granted: "The Examiner needs permission to use Claude on your account.", rate_limited: "Too many requests just now. Try again in a minute.", session_expired: "Sign in to Claude again, then retry.", invalid_json: "The feedback came back garbled. Press the button to try again.", refused: "The Examiner declined that input. Rephrase and retry.", cancelled: "" };
      $("#grade-note", st).textContent = m[e && e.code] ?? "The Examiner is unavailable right now. Try again shortly.";
      if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled"].includes(e && e.code)) gb.hidden = true;
    } finally { gb.disabled = false; }
  };
}
function gradeHtml(r) {
  return `<div class="grade"><div class="row spread"><span class="label">Examiner's mark</span><span class="disp" style="font-size:24px;font-weight:700">${r.score}/4</span></div>
    <p><b>${esc(r.verdict)}</b></p>
    ${r.covered.length ? `<p class="small"><span class="chip ok">Covered</span> ${r.covered.map(esc).join(" · ")}</p>` : ""}
    ${r.missing.length ? `<p class="small"><span class="chip no">Missing</span> ${r.missing.map(esc).join(" · ")}</p>` : ""}
    ${r.tip ? `<p class="small muted">${esc(r.tip)}</p>` : ""}</div>`;
}

/* ---------- boss exam & review ---------- */
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; }
const MIX = { e: 0.45, m: 0.33, d: 0.22 };
function drawPaper(pool, n) {
  const by = { e: [], m: [], d: [] }; shuffle(pool).forEach(id => by[tierOf(id)].push(id));
  const want = { d: Math.round(n * MIX.d), m: Math.round(n * MIX.m) }; want.e = n - want.d - want.m;
  let out = [];
  ["e", "m", "d"].forEach(t => { out = out.concat(by[t].splice(0, want[t])); });
  const rest = shuffle([...by.e, ...by.m, ...by.d]);
  while (out.length < n && rest.length) out.push(rest.pop());
  return shuffle(out);
}
const BOSSES = ["The Maturity Mismatch", "The Flat-Rate Phantom", "Leverage, the Borrowed Courage", "The Fee Drag", "The Correlated Catastrophe", "The Bank Run"];
const rankLetter = pct => pct >= 95 ? "S" : pct >= 80 ? "A" : pct >= 65 ? "B" : pct >= 50 ? "C" : "D";
function renderExam(st) {
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="head"><span class="label">Boss exam</span><h2>Choose your fight</h2><p>Questions are drawn to a 45% easy / 33% medium / 22% difficult mix. Each correct answer lands a hit worth ฿50 (฿75 for difficult). You have five hearts; misses cost one but the fight goes on, and every miss goes to your review pile.</p></div>
    <div class="row">${CH.map(c => `<label class="btn" style="--hue:var(--${c.id})"><input type="checkbox" id="ex-${c.id}" checked> <span class="denom">${c.note}</span> Ch ${c.n}</label>`).join("")}<label class="btn"><input type="checkbox" id="ex-cases" checked> Case questions</label></div>
    <div class="row"><div class="field" style="width:200px"><label for="ex-n">Rounds</label><select id="ex-n"><option>10</option><option selected>20</option><option>30</option><option>40</option></select></div><p class="small muted" id="ex-mix"></p></div>
    <div><button type="button" class="btn primary" id="ex-go">👾 Start the fight</button></div>
    ${S.mocks.length ? `<div class="tablewrap"><table class="ledger"><thead><tr><th>Date</th><th class="r">Rounds</th><th class="r">Score</th><th class="r">Rank</th></tr></thead><tbody>${S.mocks.slice(-6).reverse().map(m => `<tr><td>${m.d}</td><td class="r">${m.n}</td><td class="r">${m.pct}%</td><td class="r"><b>${rankLetter(m.pct)}</b></td></tr>`).join("")}</tbody></table></div>` : ""}</section>
    <section id="ex-area"></section>`;
  const pool = () => { let p = []; CH.forEach(c => { if ($("#ex-" + c.id, st).checked) p = p.concat(chIds(c)); }); if ($("#ex-cases", st).checked) CASES.forEach(k => { if (k.ch.some(n => $("#ex-c" + n, st).checked)) p = p.concat(caseIds(k)); }); return p; };
  const mixNote = () => { const n = +$("#ex-n", st).value, d = Math.round(n * MIX.d), m = Math.round(n * MIX.m); $("#ex-mix", st).textContent = `${n - d - m} easy · ${m} medium · ${d} difficult from ${pool().length} available · about ${Math.round(n * 1.5)} minutes`; };
  $$("input,select", st).forEach(x => x.addEventListener("change", mixNote)); mixNote();
  $("#ex-go", st).onclick = () => {
    const p = pool(); if (!p.length) { toast("Pick at least one chapter"); return; }
    const ids = drawPaper(p, +$("#ex-n", st).value), area = $("#ex-area", st), boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    st.firstElementChild.hidden = true; area.className = "card card-pad";
    const bossBar = local => { const hits = ids.filter(id => local[id] && local[id].ok).length, miss = ids.filter(id => local[id] && !local[id].ok).length, hp = Math.max(0, 5 - miss); return `<div class="boss"><div class="row spread"><span class="bn">👾 ${boss}</span><span class="hearts">${[1, 2, 3, 4, 5].map(i => `<span class="${i <= hp ? "" : "lost"}">♥</span>`).join("")}</span></div><div class="row spread small"><span class="label">Boss HP</span><span class="mono muted">${ids.length - hits}/${ids.length}</span></div><div class="pbar big" style="--accent:var(--bad)"><i style="width:${((ids.length - hits) / ids.length * 100).toFixed(0)}%;background:var(--bad);animation:none"></i></div></div>`; };
    runner(area, ids, { exam: true, showSrc: true, finishLabel: "Hand in", boss: bossBar, onFinish: local => {
      const left = ids.filter(id => !local[id]).length;
      if (left && !area.dataset.warned) { area.dataset.warned = "1"; PAL.say("intense", "<b>" + left + "</b> unanswered! Press Hand in again if you really mean it.", { anchor: area, important: true }); return; }
      examReport(area, ids, local, boss);
    } });
    GAME.sfx("stamp");
    PAL.react("examStart", { anchor: area, vars: { n: ids.length } });
  };
}
function examReport(area, ids, local, boss) {
  const right = ids.filter(id => local[id] && local[id].ok), by = {}, bt = { e: [0, 0], m: [0, 0], d: [0, 0] };
  ids.forEach(id => { const s = QMAP[id].ch ? QMAP[id].src : "Case files"; by[s] = by[s] || [0, 0]; by[s][1]++; bt[tierOf(id)][1]++; if (local[id] && local[id].ok) { by[s][0]++; bt[tierOf(id)][0]++; } });
  const pct = Math.round(right.length / ids.length * 100), letter = rankLetter(pct);
  const weak = Object.entries(by).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0][0];
  S.mocks.push({ d: beDate(), n: ids.length, pct }); S.mocks = S.mocks.slice(-30);
  S.stats.examBest = Math.max(S.stats.examBest || 0, pct); save();
  GAME.track("exam", 1, area); GAME.xp(Math.round(pct * 1.5), area); if (pct >= 80) GAME.confetti(150); GAME.checkAch();
  area.innerHTML = `<div class="col" style="gap:14px">
    <span class="label">Battle result · ${boss}</span>
    <div class="row" style="gap:24px;align-items:flex-end"><div class="rankbig">${letter}</div><div><div class="bigcoin" style="color:var(--ink)">${pct}<small>%</small></div><p class="muted">${right.length} of ${ids.length} hits · ${ids.length - Object.keys(local).length} unanswered · weakest: ${weak}</p></div></div>
    <div class="tierstats">${["e", "m", "d"].map(t => `<span class="tier ${t}">${TIERS[t]} ${bt[t][0]}/${bt[t][1]}</span>`).join("")}</div>
    <div class="tablewrap"><table class="ledger"><thead><tr><th>Section</th><th class="r">Correct</th><th class="r">Score</th></tr></thead><tbody>${Object.entries(by).map(([s, [a, b]]) => `<tr><td>${s}</td><td class="r">${a}/${b}</td><td class="r">${Math.round(a / b * 100)}%</td></tr>`).join("")}</tbody></table></div>
    <div class="row"><button type="button" class="btn primary" id="ex-again">New fight</button><button type="button" class="btn" id="ex-review">Review pile (${S.missed.length})</button></div></div>`;
  $("#ex-again", area).onclick = () => go("exam");
  $("#ex-review", area).onclick = () => go("review");
  renderRail();
  PAL.react(pct >= 80 ? "examGreat" : pct >= 60 ? "examOk" : "examLow", { anchor: area, important: true, vars: { pct, weak } });
}
function renderReview(st) {
  const ids = S.missed.filter(id => QMAP[id]);
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="head"><span class="label">Review pile</span><h2>${ids.length ? "Settle your unpaid questions" : "Nothing outstanding"}</h2><p>${ids.length ? "Get each one right to clear it from the pile. Each clear pays ฿20 and counts toward today's quests." : "Every question you have missed has been cleared. Fight a boss to find new gaps."}</p></div>
    <div id="rv"></div></section>`;
  if (!ids.length) { $("#rv", st).innerHTML = `<button type="button" class="btn primary" id="rv-exam">Boss exam →</button>`; $("#rv-exam", st).onclick = () => go("exam"); return; }
  runner($("#rv", st), ids, { fresh: true, showSrc: true, finishLabel: "Done", onFinish: () => go("review") });
}

/* ---------- reference ---------- */
function renderCrises(st) {
  const CR = FI.crises;
  st.innerHTML = `<section class="card card-pad col" style="gap:18px">
    <div class="head"><span class="label">Codex · ${CR.length} episodes</span><h2>The US crisis ledger</h2><p>Almost every rule in this course was written the week after something broke. Each entry names what happened, the Chapter 7 risk that carried it, and the law that answered it. Filter by the chapter it belongs to.</p></div>
    <div class="filter" id="cr-filter"><button type="button" class="btn primary" data-f="all">All</button>${CH.map(c => `<button type="button" class="btn" data-f="c${c.n}">Ch ${c.n}</button>`).join("")}</div>
    <div id="cr-list" class="col" style="gap:0"></div>
    <p class="small muted">Dates and loss figures follow the standard published accounts. Check them against the FDIC, the Fed or the BIS before quoting them in an assessment.</p></section>`;
  const paint = f => {
    const rows = CR.filter(k => f === "all" || k.ch.includes(+f.slice(1)));
    $("#cr-list", st).innerHTML = rows.length ? rows.map(k => `<article class="crisis">
      <div class="crisis-era"><span class="mono">${k.era}</span></div>
      <div class="col" style="gap:8px;min-width:0">
        <div class="row" style="gap:8px"><h3 style="font-size:20px;margin-right:auto">${k.name}</h3>${k.ch.map(n => `<span class="denom" style="--hue:var(--c${n});min-width:0;padding:1px 7px">Ch ${n}</span>`).join("")}</div>
        <p style="color:var(--ink-2);max-width:72ch">${k.what}</p>
        <div class="thai" style="border-color:var(--c3);background:color-mix(in srgb,var(--c3) 7%,var(--page))"><span class="label" style="color:var(--c3);display:block;margin-bottom:2px">The risk</span>${k.risk}</div>
        <p class="small" style="max-width:72ch"><span class="label" style="display:block;margin-bottom:2px">The answer</span>${k.fix}</p>
        ${k.th ? `<div class="thai"><span class="label">Thai lens</span>${k.th}</div>` : ""}
      </div></article>`).join("") : `<p class="muted">No episode on this page is tagged to that chapter.</p>`;
    $$("#cr-filter .btn", st).forEach(b => b.classList.toggle("primary", b.dataset.f === f));
  };
  $$("#cr-filter .btn", st).forEach(b => b.onclick = () => paint(b.dataset.f));
  paint("all");
}
function renderRosetta(st) {
  st.innerHTML = `<section class="card card-pad col" style="gap:16px">
    <div class="head"><span class="label">Codex</span><h2>US ↔ Thailand regulator map</h2><p>The textbook is written around US institutions, and exams will use those names. This map shows what plays the same role in the Thai system.</p></div>
    <div class="tablewrap"><table class="rosetta"><thead><tr><th>Role</th><th>United States (textbook)</th><th>Thailand</th></tr></thead><tbody>${FI.rosetta.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>
    <p class="small muted">Thai rate caps, coverage limits and licensing rules change. Check current figures with the BOT, DPA, SEC Thailand or OIC before quoting them in an assessment.</p></section>`;
}
function renderFormulas(st) {
  st.innerHTML = `<section class="card card-pad col" style="gap:20px">
    <div class="head"><span class="label">Codex</span><h2>Formula sheet</h2><p>Every calculation used in the quizzes, labs and cases, grouped by chapter.</p></div>
    ${CH.map(c => `<div style="--hue:var(--${c.id})"><div class="row" style="gap:10px;margin-bottom:8px"><span class="denom">${c.note}</span><h3 style="font-size:20px">Ch ${c.n} · ${c.short}</h3></div>${formulaBlock(c)}</div>`).join("")}</section>`;
}

/* ---------- boot ---------- */
function setTheme(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem(LS + "-theme", t); } catch (e) { } }
try { const t = localStorage.getItem(LS + "-theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) { }
$("#brand").onclick = () => go("home");
$("#hud-lvl").onclick = () => go("trophies");
$("#hud-love").onclick = () => go("room");
$("#btn-theme").onclick = () => {
  const cur = document.documentElement.getAttribute("data-theme"), sysDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  const next = cur ? (cur === "dark" ? "light" : "dark") : (sysDark ? "light" : "dark");
  setTheme(next); drawGuilloche(); GAME.sfx("click"); PAL.react(next === "dark" ? "themeDark" : "themeLight", { soft: true });
};
$("#btn-sound").onclick = () => { S.sound = !S.sound; save(); paintHud(); GAME.sfx("coin"); toast(S.sound ? "Sound on" : "Sound off"); };
const qb = $("#btn-quiet");
const paintQuiet = () => { qb.setAttribute("aria-pressed", String(!S.quiet)); qb.title = S.quiet ? "Claude is quiet · click to let her talk" : "Claude talks · click to quiet her"; };
qb.onclick = () => { S.quiet = !S.quiet; save(); paintQuiet(); PAL.setQuiet(S.quiet); };
let armed = 0;
$("#btn-reset").onclick = () => {
  if (Date.now() - armed > 4000) { armed = Date.now(); toast("Press ↺ again to close the account and erase progress"); PAL.say("sad", "You want to erase the whole passbook? Press ↺ once more and I'll do it…", { important: true }); return; }
  armed = 0; S = blank(); GAME.ensure(); GAME.rollDay(); save(); PAL.applyWear(); go("home"); PAL.react("reset", { important: true });
};
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(drawGuilloche, 150); });
if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawGuilloche);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawGuilloche);
document.addEventListener("pal:sample", () => { const g = $("#grade"); if (g) g.hidden = false; GAME.rollQuests(); renderRail(); });

if (S.quiet) PAL.setQuiet(true);
paintQuiet();
GAME.rollQuests();
render();
PAL.greet();
GAME.checkAch();

function merge(remote) {
  if (!remote || typeof remote !== "object") return false;
  const m = Object.assign(blank(), S);
  Object.entries(remote.ans || {}).forEach(([id, a]) => { if (!m.ans[id] || (a.ok && !m.ans[id].ok)) m.ans[id] = a; });
  if ((remote.bal || 0) > m.bal) { m.bal = remote.bal; m.ledger = remote.ledger || m.ledger; }
  m.best = Math.max(m.best, remote.best || 0);
  m.xp = Math.max(m.xp || 0, remote.xp || 0); m.bond = Math.max(m.bond || 0, remote.bond || 0);
  Object.assign(m.stamps, remote.stamps || {});
  Object.entries(remote.ach || {}).forEach(([k, v]) => { if (!m.ach[k]) m.ach[k] = v; });
  Object.entries(remote.gifts || {}).forEach(([k, v]) => { m.gifts[k] = Math.max(m.gifts[k] || 0, v); });
  if (!m.wear && remote.wear) m.wear = remote.wear;
  if (!m.name && remote.name) m.name = remote.name;
  Object.entries(remote.stats || {}).forEach(([k, v]) => { if (typeof v === "number") m.stats[k] = Math.max(m.stats[k] || 0, v); else if (v && typeof v === "object") m.stats[k] = Object.assign({}, v, m.stats[k] || {}); else if (m.stats[k] === undefined) m.stats[k] = v; });
  if (remote.days && (remote.days.streak || 0) > (m.days.streak || 0)) m.days = Object.assign({}, m.days, remote.days, { hist: [...new Set([...(m.days.hist || []), ...(remote.days.hist || [])])].sort().slice(-14) });
  if (remote.quests && remote.quests.date === m.quests.date && remote.quests.list) remote.quests.list.forEach(rq => { const lq = m.quests.list.find(x => x.id === rq.id); if (lq) { lq.prog = Math.max(lq.prog, rq.prog || 0); lq.claimed = lq.claimed || rq.claimed; } });
  m.missed = [...new Set([...(m.missed || []), ...(remote.missed || [])])].filter(id => !(m.ans[id] && m.ans[id].ok));
  Object.entries(remote.grades || {}).forEach(([k, g]) => { if (!m.grades[k] || (g.best || 0) > (m.grades[k].best || 0)) m.grades[k] = Object.assign({}, m.grades[k], g); });
  Object.entries(remote.wins || {}).forEach(([k, w]) => { if (!m.wins[k] || w.played > m.wins[k].played) m.wins[k] = w; });
  if ((remote.mocks || []).length > m.mocks.length) m.mocks = remote.mocks;
  const changed = JSON.stringify(m) !== JSON.stringify(S);
  S = m; return changed;
}
if (window.claude && claude.use) {
  claude.use("db").then(db => {
    if (!db) return;
    dbDoc = db.doc("progress/main");
    let first = true;
    dbDoc.onSnapshot(snap => {
      if (!first) return; first = false;
      if (snap.exists && merge(snap.data())) { GAME.ensure(); try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } PAL.applyWear(); render(); toast("Progress synced"); }
      save();
    }, () => { });
  }).catch(() => { });
}
})();
