(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const strip = s => String(s).replace(/<[^>]+>/g, "");
const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const CH = FI.chapters, CASES = FI.cases;
const TIERS = { e: "Easy", m: "Medium", d: "Difficult" };
const LS = "fi-passbook-v1";
const blank = () => ({ bal: 0, streak: 0, best: 0, ans: {}, ledger: [], stamps: {}, missed: [], grades: {}, wins: {}, mocks: [], quiet: false, ts: 0 });
let S = blank();
try { const raw = localStorage.getItem(LS); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) { }
let dbDoc = null, saveT = 0;
function save() {
  S.ts = Date.now();
  try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { }
  if (dbDoc) { clearTimeout(saveT); saveT = setTimeout(() => dbDoc.set(JSON.parse(JSON.stringify(S))).catch(() => { }), 900); }
}
let view = { page: "home" }, popStamp = null, lastQ = "";

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

/* ---------- ledger & rewards ---------- */
const beDate = () => { const d = new Date(); return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + String((d.getFullYear() + 543) % 100).padStart(2, "0"); };
function post(desc, amt) { S.bal += amt; S.ledger.unshift({ d: beDate(), desc, amt, bal: S.bal }); S.ledger = S.ledger.slice(0, 50); }
function record(id, ok, exam, pick) {
  const prev = S.ans[id], meta = QMAP[id], tag = meta.src + " · Q" + (meta.n + 1);
  if (ok) {
    S.streak++; S.best = Math.max(S.best, S.streak);
    let amt = exam ? 50 : (!prev ? 100 : (prev.ok ? 0 : 20));
    if (amt && tierOf(id) === "d") amt += exam ? 25 : (prev ? 0 : 50);
    const bonus = amt >= 50 ? Math.min(S.streak - 1, 10) * 10 : 0;
    if (amt + bonus > 0) post((exam ? "EXAM " : "DEP ") + tag + (bonus ? " · streak " + S.streak : ""), amt + bonus);
    S.missed = S.missed.filter(x => x !== id);
  } else {
    S.streak = 0;
    if (!S.missed.includes(id)) S.missed.push(id);
  }
  if (!exam) S.ans[id] = { ok: ok || !!(prev && prev.ok), first: prev ? prev.first : ok, pick };
  const stamped = checkStamps();
  save(); paintHud();
  return stamped;
}
function checkStamps() {
  let got = null;
  CH.forEach(c => {
    const ids = chIds(c);
    if (!S.stamps[c.id] && correctCount(ids) >= Math.ceil(ids.length * 0.8)) {
      S.stamps[c.id] = beDate(); post("STAMP Ch " + c.n + " mastered", 500); popStamp = c.id; got = c;
      toast("Chapter " + c.n + " stamped · +฿500");
    }
  });
  return got;
}
function paintHud() {
  $("#hud-bal").textContent = fmt(S.bal);
  $("#hud-streak").textContent = S.streak;
  $("#hud-stamps").textContent = Object.keys(S.stamps).length;
  $("#hud-stamps-of").textContent = CH.length;
  const big = $("#big-bal"); if (big) big.textContent = fmt(S.bal);
}
function toast(t) { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; $("#toasts").appendChild(el); setTimeout(() => el.remove(), 2600); }

/* ---------- companion context ---------- */
const PAGE_NAMES = { home: "the cover page", cases: "the case files list", exam: "the mock exam", review: "the review pile", rosetta: "the US–Thailand regulator map", formulas: "the formula sheet" };
const SEEDS = {
  c1: ["Explain delegated monitoring with a Thai example", "Why do FIs get special regulation?", "Quiz me on Chapter 1"],
  c2: ["Walk me through ROE = ROA × EM", "Which US banking law did what?", "Quiz me on Chapter 2"],
  c3: ["Why is a flat rate misleading?", "How do finance companies fund themselves?", "Quiz me on Chapter 3"],
  c4: ["Firm commitment vs best efforts?", "Why did repo funding sink Lehman?", "Quiz me on Chapter 4"],
  c5: ["How is NAV calculated?", "Why do closed-end funds trade at discounts?", "Quiz me on Chapter 5"],
  c6: ["Combined ratio vs operating ratio?", "Why did AIG need a bailout?", "Quiz me on Chapter 6"],
  c7: ["Refinancing vs reinvestment risk?", "How do the nine risks interact?", "Quiz me on Chapter 7"],
  case: ["Summarise this case in five lines", "Help me plan the open answer", "Link this case to the chapters"],
  other: ["What should I study first?", "Quiz me on anything", "FDIC vs Thailand's DPA"]
};
PAL.setContext(() => {
  const c = view.page === "ch" ? CH.find(x => x.id === view.id) : null, k = view.page === "case" ? CASES.find(x => x.id === view.id) : null;
  const ids = c ? chIds(c) : k ? caseIds(k) : [];
  return {
    where: c ? "Chapter " + c.n + " · " + c.short + " (" + (view.tab || "concepts") + " tab)" : k ? "case file: " + k.title : PAGE_NAMES[view.page] || view.page,
    chapter: c ? c.id : null, title: k ? k.title : c ? c.title : "", bal: fmt(S.bal), done: correctCount(ids), total: ids.length, streak: S.streak,
    n: S.missed.length, s: S.missed.length === 1 ? "" : "s",
    seeds: c ? SEEDS[c.id] : k ? SEEDS.case : SEEDS.other,
    extra: (lastQ ? "Question on screen: " + strip(lastQ).slice(0, 700) + " " : "") + (k ? "Case background: " + strip(k.story.join(" ")).slice(0, 900) : "")
  };
});

/* ---------- router ---------- */
function go(page, id, tab) {
  const changed = page !== view.page || id !== view.id;
  view = { page, id, tab }; lastQ = "";
  render(); window.scrollTo({ top: 0 });
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
  else if (view.page === "rosetta") renderRosetta(st);
  else if (view.page === "formulas") renderFormulas(st);
  else renderHome(st);
  paintHud();
}
const ring = f => { const C = 2 * Math.PI * 9; return `<svg class="ring" viewBox="0 0 22 22" aria-hidden="true"><circle class="bg" cx="11" cy="11" r="9"/><circle class="fg" cx="11" cy="11" r="9" stroke-dasharray="${(f * C).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 11 11)"/></svg>`; };
function renderRail() {
  const cur = (p, id) => (view.page === p && (!id || view.id === id)) || (p === "cases" && view.page === "case") ? "true" : "false";
  const item = (p, id, glyph, text, extra = "", hue = "") => `<button type="button" class="nav" data-page="${p}" data-id="${id || ""}"${hue ? ` style="--hue:var(${hue})"` : ""} aria-current="${cur(p, id)}">${glyph}<span class="t">${text}</span>${extra}</button>`;
  $("#rail").innerHTML =
    `<span class="label sec">Passbook</span>` + item("home", "", `<span class="glyph">¶</span>`, "Cover page") +
    `<span class="label sec">Chapters</span>` + CH.map(c => item("ch", c.id, `<span class="denom">${c.note}</span>`, c.short, ring(correctCount(chIds(c)) / c.quiz.length), "--" + c.id)).join("") +
    `<span class="label sec">Apply</span>` + item("cases", "", `<span class="glyph">§</span>`, "Case files", `<span class="mono small muted">${CASES.length}</span>`) +
    item("exam", "", `<span class="glyph">✎</span>`, "Mock exam") + item("review", "", `<span class="glyph">↻</span>`, "Review pile", `<span class="mono small muted">${S.missed.length}</span>`) +
    `<span class="label sec">Reference</span>` + item("rosetta", "", `<span class="glyph">⇄</span>`, "US ↔ Thailand map") + item("formulas", "", `<span class="glyph">∑</span>`, "Formula sheet");
  $$("#rail .nav").forEach(b => b.onclick = () => go(b.dataset.page, b.dataset.id || undefined));
}

/* ---------- home ---------- */
function ledgerTable(n) {
  const rows = S.ledger.slice(0, n);
  const body = rows.length ? rows.map(r => `<tr><td>${r.d}</td><td>${esc(r.desc)}</td><td class="r cr">${r.amt ? "+" + fmt(r.amt) : ""}</td><td class="r">${fmt(r.bal)}</td></tr>`).join("")
    : `<tr><td>${beDate()}</td><td>OPEN · account opened</td><td class="r"></td><td class="r">0</td></tr><tr><td></td><td class="muted">Answer a question to make your first deposit</td><td></td><td></td></tr>`;
  return `<table class="ledger"><thead><tr><th>Date (BE)</th><th>Particulars</th><th class="r">Deposit</th><th class="r">Balance</th></tr></thead><tbody>${body}</tbody></table>`;
}
const stampHtml = c => `<span class="stamp ${S.stamps[c.id] ? "" : "off"} ${popStamp === c.id ? "pop" : ""}" style="${S.stamps[c.id] ? `border-color:var(--${c.id});color:var(--${c.id})` : ""}" title="${S.stamps[c.id] ? "Stamped " + S.stamps[c.id] : "Score 80% on the chapter quiz"}"><span><b>${c.note}</b>Ch ${c.n}</span></span>`;
function tierCounts(ids) { const t = { e: 0, m: 0, d: 0 }; ids.forEach(id => t[tierOf(id)]++); return t; }
function renderHome(st) {
  const done = Object.values(S.ans).filter(a => a.ok).length, tc = tierCounts(ALL), sortN = Object.values(FI.sorters).reduce((a, s) => a + s.items.length, 0);
  const next = CH.find(c => !S.stamps[c.id]);
  st.innerHTML = `
  <section class="leaf cover">
    <div class="cover-l">
      <span class="label">Account holder · you · Saunders, Cornett &amp; Erhemjamts, Ch 1–7</span>
      <h1>Banks, brokers and funds, <em>read through Thailand.</em></h1>
      <p class="muted" style="max-width:56ch">Each correct answer is a deposit, and difficult ones pay more. Score 80% on a chapter quiz and the page gets stamped. Claude, floating around your screen, keeps the ledger and reacts to everything you do. Drag her anywhere, or click her to chat.</p>
      <div class="row" style="align-items:flex-end;gap:26px">
        <div><span class="label">Balance</span><div class="bal-big"><small>฿</small><span id="big-bal">${fmt(S.bal)}</span></div></div>
        <div class="small muted mono" style="padding-bottom:6px">${done}/${ALL.length} questions cleared<br>best streak ${S.best}</div>
      </div>
      <div class="tablewrap">${ledgerTable(5)}</div>
    </div>
    <div class="cover-r"><canvas id="guilloche" aria-hidden="true"></canvas>
      <div class="seal"><span class="label">Book No. 0001</span><span class="label">BE ${new Date().getFullYear() + 543}</span></div>
    </div>
  </section>
  <section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="row" style="justify-content:space-between">
      <div class="head"><span class="label">Stamp page</span><h2 style="font-size:26px">${CH.length} chapters, ${CH.length} stamps</h2></div>
      ${next ? `<button type="button" class="btn primary" id="go-next">Continue: Chapter ${next.n} →</button>` : `<button type="button" class="btn primary" id="go-exam">All stamped · sit the mock exam →</button>`}
    </div>
    <div class="row" style="gap:18px">${CH.map(stampHtml).join("")}</div>
    <div class="tierstats"><span>Question bank: <b style="color:var(--ink)">${ALL.length}</b></span><span class="tier e">${tc.e} easy</span><span class="tier m">${tc.m} medium</span><span class="tier d">${tc.d} difficult</span><span>+ ${sortN} sorter cards · ${CASES.length} open case questions</span></div>
  </section>
  <section style="display:flex;flex-direction:column;gap:12px">
    <span class="label">Chapters · coloured like the banknotes</span>
    <div class="grid">${CH.map(c => { const f = correctCount(chIds(c)) / c.quiz.length;
      return `<button type="button" class="note" data-ch="${c.id}" style="--hue:var(--${c.id})"><span class="nt"><span class="mono small">CHAPTER ${c.n}</span><b>${c.note}</b></span><span class="nb"><h3>${c.short}</h3><span class="small muted">${c.concepts.length} concepts · ${c.cards.length} cards · ${c.quiz.length} questions · ${FI.sorters[c.id].title} · ${c.labName}</span><span class="meter"><i style="width:${(f * 100).toFixed(0)}%"></i></span></span></button>`; }).join("")}</div>
  </section>
  <section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:14px">
    <div class="row" style="justify-content:space-between"><div class="head"><span class="label">Case files</span><h2 style="font-size:26px">What actually happened</h2></div><button type="button" class="btn" id="go-cases">All ${CASES.length} cases →</button></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">${[CASES[0], CASES[4], CASES[7], CASES[5]].map(caseCard).join("")}</div>
  </section>
  <section class="grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr))">
    <div class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:8px"><span class="label">Review pile</span><h3 style="font-size:22px">${S.missed.length} question${S.missed.length === 1 ? "" : "s"} to retry</h3><p class="small muted">Questions you missed wait here until you get them right.</p><div><button type="button" class="btn" id="go-review">Open review</button></div></div>
    <div class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:8px"><span class="label">Mock exam</span><h3 style="font-size:22px">Tier-mixed papers</h3><p class="small muted">45% easy, 33% medium, 22% difficult, drawn from the chapters you pick. You get a report by chapter and tier.${S.mocks.length ? " Last: " + S.mocks[S.mocks.length - 1].pct + "%." : ""}</p><div><button type="button" class="btn" id="go-exam2">Set up an exam</button></div></div>
    <div class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:8px"><span class="label">US ↔ Thailand</span><h3 style="font-size:22px">The regulator map</h3><p class="small muted">FDIC → DPA, TARP → FIDF, Fedwire → BAHTNET. The textbook's US institutions, translated.</p><div><button type="button" class="btn" id="go-rosetta">Open the map</button></div></div>
  </section>`;
  popStamp = null;
  $$(".note", st).forEach(b => b.onclick = () => go("ch", b.dataset.ch));
  $$(".case-card", st).forEach(b => b.onclick = () => go("case", b.dataset.case));
  const on = (sel, fn) => { const el = $(sel, st); if (el) el.onclick = fn; };
  on("#go-next", () => go("ch", next.id)); on("#go-exam", () => go("exam")); on("#go-exam2", () => go("exam"));
  on("#go-cases", () => go("cases")); on("#go-review", () => go("review")); on("#go-rosetta", () => go("rosetta"));
  drawGuilloche();
}
function drawGuilloche() {
  const cv = $("#guilloche"); if (!cv) return;
  const r = cv.getBoundingClientRect(); if (!r.width) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = r.width * dpr; cv.height = r.height * dpr;
  const g = cv.getContext("2d"); g.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), col = v => cs.getPropertyValue(v).trim();
  const cx = r.width / 2, cy = r.height / 2 - 8, R = Math.min(r.width, r.height) * 0.43;
  [[R, 0.2, 9, "--accent", 0.5], [R * 0.74, 0.16, 13, "--c2", 0.42], [R * 0.5, 0.14, 7, "--stamp", 0.5]].forEach(([Rr, amp, k, c, a]) => {
    g.strokeStyle = col(c); g.globalAlpha = a; g.lineWidth = 0.7;
    for (let s = 0; s < 14; s++) {
      g.beginPath();
      for (let t = 0; t <= Math.PI * 2 + 0.005; t += 0.006) {
        const rad = Rr * (1 - amp) + Rr * amp * Math.cos(k * t + s * 0.45);
        const x = cx + rad * Math.cos(t), y = cy + rad * Math.sin(t);
        t === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
  });
  g.globalAlpha = 1; g.fillStyle = col("--ink"); g.textAlign = "center"; g.textBaseline = "middle";
  g.font = "700 " + Math.round(R * 0.36) + "px 'Bodoni Moda', Georgia, serif"; g.fillText("฿", cx, cy + 2);
}

/* ---------- chapter ---------- */
function renderChapter(st, c, tab) {
  tab = tab || "learn";
  const so = FI.sorters[c.id];
  const TABS = [["learn", "Concepts"], ["cards", "Flashcards"], ["quiz", `Quiz · ${correctCount(chIds(c))}/${c.quiz.length}`], ["sort", so.title], ["lab", c.labName], ["sheet", "Formulas"]];
  st.innerHTML = `<section class="leaf" style="--hue:var(--${c.id})"><div class="band"></div><div class="leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="row" style="justify-content:space-between;align-items:flex-start;gap:18px">
      <div class="head" style="flex:1;min-width:240px"><span class="label">Chapter ${c.n} · ${c.note} note</span><h2>${c.title}</h2><p>${c.thesis}</p></div>${stampHtml(c)}
    </div>
    <div class="tabs" role="tablist">${TABS.map(([k, l]) => `<button type="button" class="tab" role="tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join("")}</div>
    <div id="pane"></div></div></section>`;
  popStamp = null;
  $$(".tab", st).forEach(b => b.onclick = () => go("ch", c.id, b.dataset.tab));
  const pane = $("#pane", st);
  if (tab === "cards") renderCards(pane, c);
  else if (tab === "quiz") renderQuiz(pane, c);
  else if (tab === "sort") renderSorter(pane, c.id);
  else if (tab === "lab") window.LABS[c.lab](pane);
  else if (tab === "sheet") pane.innerHTML = formulaBlock(c);
  else {
    pane.innerHTML = `<div class="concepts">${c.concepts.map(k => `<article class="concept"><h3>${k.h}</h3><p>${k.b}</p>${k.th ? `<div class="thai"><span class="label">Thai lens</span>${k.th}</div>` : ""}</article>`).join("")}</div>
    <div class="row" style="margin-top:10px"><button type="button" class="btn primary" id="to-quiz">Take the quiz →</button><button type="button" class="btn" id="to-cards">Flashcards</button><button type="button" class="btn" id="to-sort">${so.title}</button></div>`;
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
      <div class="row" style="justify-content:center;margin-top:16px"><button type="button" class="btn" id="fc-prev">← Previous</button><button type="button" class="btn" id="fc-flip">Flip</button><button type="button" class="btn" id="fc-next">Next →</button></div>`;
    const fl = $("#flash", pane);
    const flip = () => { fl.classList.toggle("flip"); if (fl.classList.contains("flip")) PAL.react("cardOpen", { soft: true, anchor: fl, vars: { card: strip(f) } }); };
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
  pane.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    <div class="row" style="justify-content:space-between;gap:10px">
      <div class="filter" role="group" aria-label="Filter by difficulty">${[["all", "All"], ["e", "Easy"], ["m", "Medium"], ["d", "Difficult"]].map(([k, l]) => `<button type="button" class="btn" data-f="${k}" aria-pressed="${k === filter}">${l}</button>`).join("")}</div>
      <div class="tierstats" id="tstats">${tierStats(all)}</div>
    </div><div id="qhost"></div></div>`;
  $$(".filter .btn", pane).forEach(b => b.onclick = () => { renderQuiz(pane, c, b.dataset.f); PAL.react("tier_" + b.dataset.f, { soft: true, vars: { n: b.dataset.f === "all" ? all.length : all.filter(id => tierOf(id) === b.dataset.f).length } }); });
  runner($("#qhost", pane), ids, { onFinish: () => chapterSummary(pane, c), onAnswer: () => { const t = $("#tstats", pane); if (t) t.innerHTML = tierStats(all); } });
}
function chapterSummary(pane, c) {
  const ids = chIds(c), n = correctCount(ids), wrong = ids.filter(id => !(S.ans[id] && S.ans[id].ok));
  pane.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
    <span class="label">Quiz summary</span><h3 style="font-size:28px">${n} of ${ids.length} correct</h3>
    <div class="tierstats">${tierStats(ids)}</div>
    <p class="muted">${S.stamps[c.id] ? "This chapter is stamped. Well banked." : `You need ${Math.ceil(ids.length * 0.8)} correct for the stamp.`}</p>
    ${wrong.length ? `<div class="row">${wrong.slice(0, 20).map(id => `<button type="button" class="btn" data-j="${ids.indexOf(id)}">Q${ids.indexOf(id) + 1} <span class="tier ${tierOf(id)}">${tierOf(id)}</span></button>`).join("")}</div>` : ""}
    <div class="row"><button type="button" class="btn" id="back-learn">Back to concepts</button>${c.n < CH.length ? `<button type="button" class="btn primary" id="next-ch">Chapter ${c.n + 1} →</button>` : `<button type="button" class="btn primary" id="to-cases">Case files →</button>`}</div></div>`;
  $$("[data-j]", pane).forEach(b => b.onclick = () => runner(pane, ids, { start: +b.dataset.j, onFinish: () => chapterSummary(pane, c) }));
  $("#back-learn", pane).onclick = () => go("ch", c.id, "learn");
  const nx = $("#next-ch", pane); if (nx) nx.onclick = () => go("ch", CH[c.n].id);
  const tc = $("#to-cases", pane); if (tc) tc.onclick = () => go("cases");
  renderRail();
}
function runner(el, ids, opts = {}) {
  if (!ids.length) { el.innerHTML = `<p class="muted">No questions in this filter.</p>`; return; }
  let i = opts.start || 0;
  const local = {}, retry = {}, fresh = !!(opts.exam || opts.fresh);
  const state = id => fresh ? local[id] : (S.ans[id] && !retry[id] ? { ok: S.ans[id].ok, pick: S.ans[id].pick } : null);
  function draw() {
    const id = ids[i], { q, src } = QMAP[id], stt = state(id), tier = tierOf(id);
    lastQ = q.q;
    el.innerHTML = `<div class="q">
      <div class="row" style="justify-content:space-between;gap:8px"><span class="label">${opts.showSrc ? esc(src) + " · " : ""}Question ${i + 1} of ${ids.length}</span>
        <span class="row" style="gap:6px"><span class="tier ${tier}">${TIERS[tier]}</span><span class="src">${esc(q.src || "Slides")}</span><span class="label">${q.t === "num" ? "Calculation" : "Choice"}</span></span></div>
      <div class="q-prompt">${q.q}</div><div id="qbody"></div><div id="qexp"></div>
      <div class="qnav"><div class="dots">${ids.map((d, j) => { const s = state(d); return `<button type="button" class="dot ${s ? (s.ok ? "ok" : "no") : ""} ${j === i ? "cur" : ""}" data-j="${j}" aria-label="Go to question ${j + 1}"></button>`; }).join("")}</div>
      <div class="row"><button type="button" class="btn" id="qprev" ${i === 0 ? "disabled" : ""}>← Previous</button><button type="button" class="btn ${stt ? "primary" : ""}" id="qnext">${i === ids.length - 1 ? (opts.finishLabel || "Finish") : "Next →"}</button></div></div></div>`;
    const body = $("#qbody", el), exp = $("#qexp", el);
    const ansText = () => q.t === "mcq" ? strip(q.o[q.a]) : fmt(q.a, q.a % 1 ? 2 : 0) + " " + (q.unit || "");
    const reveal = ok => {
      exp.innerHTML = `<div class="explain ${ok ? "ok" : "no"}"><b>${ok ? "Correct." : "Not quite."}</b> ${q.x}</div>` +
        `<div class="helpers">${!ok && !fresh ? `<button type="button" class="btn" id="qretry">Try again</button>` : ""}${PAL.hasSample ? (ok ? `<button type="button" class="btn" id="qpush">Push me further</button>` : `<button type="button" class="btn" id="qwhy">Why was I wrong?</button>`) : ""}</div>`;
      const rt = $("#qretry", el); if (rt) rt.onclick = () => { retry[id] = true; draw(); };
      const ctx = "Question: " + strip(q.q) + (q.t === "mcq" ? " Options: " + q.o.map(strip).join(" | ") : "") + " Correct answer: " + ansText() + ". Explanation on the page: " + strip(q.x);
      const pw = $("#qpush", el); if (pw) pw.onclick = () => PAL.ask("I got this right. Push me further with one harder follow-up question on the same idea, and wait for my answer. " + ctx);
      const wy = $("#qwhy", el); if (wy) wy.onclick = () => PAL.ask("I answered \"" + (stt ? stt.pick : "") + "\" and got it wrong. Explain which step or idea I probably got wrong, briefly. " + ctx);
    };
    const answer = (ok, pick, pickText) => {
      if (fresh) local[id] = { ok, pick };
      retry[id] = false;
      const stamped = record(id, ok, opts.exam, pick);
      if (!opts.exam && !S.ans[id]) S.ans[id] = { ok, pick };
      draw();
      renderRail(); if (opts.onAnswer) opts.onAnswer();
      const anchor = $("#qexp", el);
      if (stamped) PAL.react("stamp", { anchor, important: true, vars: { n: stamped.n } });
      else if (ok && S.streak > 0 && S.streak % 4 === 0) PAL.react("streak", { anchor, vars: { streak: S.streak } });
      else PAL.react(ok ? (tier === "d" ? "correctHard" : tier === "e" && Math.random() < 0.5 ? "correctEasy" : "correct") : (tier === "d" ? "wrongHard" : "wrong"), { anchor, vars: { pick: esc(String(pickText).slice(0, 60)), ans: esc(ansText().slice(0, 70)), streak: S.streak } });
    };
    if (q.t === "mcq") {
      const ord = order(id, q.o.length);
      body.innerHTML = `<div class="opts">${ord.map((j, p) => `<button type="button" class="opt" data-o="${j}"><span class="k">${"ABCDEF"[p]}</span><span>${q.o[j]}</span></button>`).join("")}</div>`;
      if (stt) {
        $$(".opt", body).forEach(b => { const j = +b.dataset.o; b.disabled = true; if (j === q.a) b.classList.add("right"); else if (j === stt.pick) b.classList.add("wrong"); });
        reveal(stt.ok);
      } else $$(".opt", body).forEach(b => b.onclick = () => answer(+b.dataset.o === q.a, +b.dataset.o, strip(q.o[+b.dataset.o])));
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
      w.played++; if (ok) { w.won++; score++; if (Object.values(S.wins).reduce((a, x) => a + x.won, 0) <= 80) post("SORT " + so.title, 10); }
      save(); paintHud();
      $$("[data-s]", pane).forEach(x => { x.disabled = true; const k = +x.dataset.s; if (k === it.side) x.classList.add("primary"); });
      if (!ok) b.style.borderColor = "var(--bad)";
      const last = i === deck.length - 1;
      $("#sort-why", pane).innerHTML = `<div class="explain ${ok ? "ok" : "no"} sorter-why"><b>${ok ? "Right." : "Not quite: " + so.sides[it.side] + "."}</b> ${it.why}</div><div class="row" style="margin:0 18px 16px"><button type="button" class="btn primary" id="sort-next">${last ? "See score" : "Next card →"}</button></div>`;
      $("#sort-next", pane).onclick = () => { if (!last) { i++; draw(); } else done(); };
      PAL.react(ok ? "sortWin" : "sortLose", { soft: ok, anchor: $("#sort-card", pane), vars: { side: so.sides[it.side] } });
    });
  };
  const done = () => {
    pane.innerHTML = `<div class="sorter"><div class="sorter-top"><h3 style="font-size:20px">${so.title}: ${score}/${deck.length}</h3></div><div class="sorter-card">${score === deck.length ? "Perfect round." : score >= deck.length * 0.7 ? "Strong round. One more for a perfect score?" : "Worth another pass. Read each reason, then shuffle again."}</div><div class="sorter-sides"><button type="button" class="btn primary" id="sort-again">Shuffle and play again</button></div></div>`;
    $("#sort-again", pane).onclick = () => renderSorter(pane, key);
    PAL.react("sortDone", { anchor: pane, vars: { score: score + "/" + deck.length } });
  };
  draw();
}

/* ---------- cases ---------- */
function caseCard(k) {
  const n = correctCount(caseIds(k));
  return `<button type="button" class="case-card" data-case="${k.id}"><span class="yr">${k.year}</span><span style="display:flex;flex-direction:column;gap:6px">
    <span class="row" style="gap:6px"><span class="flag ${k.th ? "th" : ""}">${k.th ? "Thailand" : "Global"}</span>${k.ch.map(n => `<span class="denom" style="--hue:var(--c${n});min-width:0;padding:1px 6px">Ch ${n}</span>`).join("")}<span class="mono small muted" style="margin-left:auto">${n}/${k.qs.length}</span></span>
    <b style="font-family:var(--display);font-size:19px;font-weight:500;line-height:1.2">${k.title}</b><span class="small muted">${k.hook}</span></span></button>`;
}
function renderCases(st) {
  st.innerHTML = `<section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="head"><span class="label">Case files · ${CASES.length} events · ${CASES.reduce((a, k) => a + k.qs.length, 0)} graded questions</span><h2>Theory, meet the headlines</h2><p>Each file has a timeline, the story, how it links to the chapters, four tiered questions, and an open question the Examiner can mark. Thai cases are flagged in blue.</p></div>
    <div class="row" id="case-filter"><button type="button" class="btn primary" data-f="all">All</button><button type="button" class="btn" data-f="th">Thailand</button><button type="button" class="btn" data-f="gl">Global</button>${CH.map(c => `<button type="button" class="btn" data-f="c${c.n}">Ch ${c.n}</button>`).join("")}</div>
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
  st.innerHTML = `<section class="leaf"><div class="band" style="--hue:var(${k.th ? "--c2" : "--accent"})"></div><div class="leaf-pad" style="display:flex;flex-direction:column;gap:18px">
    <button type="button" class="btn" id="back" style="align-self:flex-start">← All cases</button>
    <div class="head"><span class="row" style="gap:8px"><span class="flag ${k.th ? "th" : ""}">${k.where}</span><span class="label">${k.year}</span>${k.ch.map(n => `<span class="denom" style="--hue:var(--c${n});min-width:0;padding:1px 6px">Ch ${n}</span>`).join("")}</span>
      <h2>${k.title}</h2><p style="font-family:var(--display);font-style:italic;font-size:20px;color:var(--ink-2)">${k.hook}</p></div>
    <div><span class="label">Timeline</span><div class="timeline">${k.timeline.map(([w, e]) => `<div class="tl"><span>${w}</span><span>${e}</span></div>`).join("")}</div></div>
    <div class="story">${k.story.map(p => `<p>${p}</p>`).join("")}</div>
    <div class="thai" style="border-color:var(--accent);background:var(--accent-wash)"><span class="label" style="color:var(--accent-ink)">Course link</span>${k.lens}</div>
  </div></section>
  <section class="leaf leaf-pad"><span class="label">Graded questions</span><div id="case-q" style="margin-top:10px"></div></section>
  <section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:12px">
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
      const gain = (score - (prev.best || 0)) * 50; if (gain > 0) post("CASE " + k.year + " open answer " + score + "/4", gain);
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
  return `<div class="grade"><div class="row" style="justify-content:space-between"><span class="label">Examiner's mark</span><span class="mono" style="font-size:22px">${r.score}/4</span></div>
    <p><b>${esc(r.verdict)}</b></p>
    ${r.covered.length ? `<p class="small"><span class="chip ok">Covered</span> ${r.covered.map(esc).join(" · ")}</p>` : ""}
    ${r.missing.length ? `<p class="small"><span class="chip no">Missing</span> ${r.missing.map(esc).join(" · ")}</p>` : ""}
    ${r.tip ? `<p class="small muted">${esc(r.tip)}</p>` : ""}</div>`;
}

/* ---------- exam & review ---------- */
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
function renderExam(st) {
  st.innerHTML = `<section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="head"><span class="label">Mock exam</span><h2>Set your paper</h2><p>Questions are drawn to a 45% easy / 33% medium / 22% difficult mix. Each correct answer banks ฿50 (฿75 for difficult), and every miss goes to your review pile.</p></div>
    <div class="row">${CH.map(c => `<label class="btn" style="--hue:var(--${c.id})"><input type="checkbox" id="ex-${c.id}" checked> <span class="denom">${c.note}</span> Ch ${c.n}</label>`).join("")}<label class="btn"><input type="checkbox" id="ex-cases" checked> Case questions</label></div>
    <div class="row"><div class="field" style="width:200px"><label for="ex-n">Number of questions</label><select id="ex-n"><option>10</option><option selected>20</option><option>30</option><option>40</option></select></div><p class="small muted" id="ex-mix"></p></div>
    <div><button type="button" class="btn primary" id="ex-go">Start the exam</button></div>
    ${S.mocks.length ? `<div class="tablewrap"><table class="ledger"><thead><tr><th>Date</th><th class="r">Questions</th><th class="r">Score</th></tr></thead><tbody>${S.mocks.slice(-5).reverse().map(m => `<tr><td>${m.d}</td><td class="r">${m.n}</td><td class="r">${m.pct}%</td></tr>`).join("")}</tbody></table></div>` : ""}</section>
    <section id="ex-area"></section>`;
  const pool = () => { let p = []; CH.forEach(c => { if ($("#ex-" + c.id, st).checked) p = p.concat(chIds(c)); }); if ($("#ex-cases", st).checked) CASES.forEach(k => { if (k.ch.some(n => $("#ex-c" + n, st).checked)) p = p.concat(caseIds(k)); }); return p; };
  const mixNote = () => { const n = +$("#ex-n", st).value, d = Math.round(n * MIX.d), m = Math.round(n * MIX.m); $("#ex-mix", st).textContent = `${n - d - m} easy · ${m} medium · ${d} difficult from ${pool().length} available · about ${Math.round(n * 1.5)} minutes`; };
  $$("input,select", st).forEach(x => x.addEventListener("change", mixNote)); mixNote();
  $("#ex-go", st).onclick = () => {
    const p = pool(); if (!p.length) { toast("Pick at least one chapter"); return; }
    const ids = drawPaper(p, +$("#ex-n", st).value), area = $("#ex-area", st);
    st.firstElementChild.hidden = true; area.className = "leaf leaf-pad";
    runner(area, ids, { exam: true, showSrc: true, finishLabel: "Hand in", onFinish: local => {
      const left = ids.filter(id => !local[id]).length;
      if (left && !area.dataset.warned) { area.dataset.warned = "1"; PAL.say("intense", "<b>" + left + "</b> unanswered! Press Hand in again if you really mean it.", { anchor: area, important: true }); return; }
      examReport(area, ids, local);
    } });
    PAL.react("examStart", { anchor: area, vars: { n: ids.length } });
  };
}
function examReport(area, ids, local) {
  const right = ids.filter(id => local[id] && local[id].ok), by = {}, bt = { e: [0, 0], m: [0, 0], d: [0, 0] };
  ids.forEach(id => { const s = QMAP[id].ch ? QMAP[id].src : "Case files"; by[s] = by[s] || [0, 0]; by[s][1]++; bt[tierOf(id)][1]++; if (local[id] && local[id].ok) { by[s][0]++; bt[tierOf(id)][0]++; } });
  const pct = Math.round(right.length / ids.length * 100);
  const weak = Object.entries(by).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1])[0][0];
  S.mocks.push({ d: beDate(), n: ids.length, pct }); S.mocks = S.mocks.slice(-30); save();
  area.innerHTML = `<div style="display:flex;flex-direction:column;gap:14px">
    <span class="label">Result slip</span>
    <div class="row" style="gap:24px;align-items:flex-end"><div class="bal-big">${pct}<small style="margin-left:4px">%</small></div><p class="muted">${right.length} of ${ids.length} correct · ${ids.length - Object.keys(local).length} unanswered · weakest: ${weak}</p></div>
    <div class="tierstats">${["e", "m", "d"].map(t => `<span class="tier ${t}">${TIERS[t]} ${bt[t][0]}/${bt[t][1]}</span>`).join("")}</div>
    <div class="tablewrap"><table class="ledger"><thead><tr><th>Section</th><th class="r">Correct</th><th class="r">Score</th></tr></thead><tbody>${Object.entries(by).map(([s, [a, b]]) => `<tr><td>${s}</td><td class="r">${a}/${b}</td><td class="r">${Math.round(a / b * 100)}%</td></tr>`).join("")}</tbody></table></div>
    <div class="row"><button type="button" class="btn primary" id="ex-again">New exam</button><button type="button" class="btn" id="ex-review">Review pile (${S.missed.length})</button></div></div>`;
  $("#ex-again", area).onclick = () => go("exam");
  $("#ex-review", area).onclick = () => go("review");
  renderRail();
  PAL.react(pct >= 80 ? "examGreat" : pct >= 60 ? "examOk" : "examLow", { anchor: area, important: true, vars: { pct, weak } });
}
function renderReview(st) {
  const ids = S.missed.filter(id => QMAP[id]);
  st.innerHTML = `<section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="head"><span class="label">Review pile</span><h2>${ids.length ? "Settle your unpaid questions" : "Nothing outstanding"}</h2><p>${ids.length ? "Get each one right to clear it from the pile." : "Every question you have missed has been cleared. Sit a mock exam to find new gaps."}</p></div>
    <div id="rv"></div></section>`;
  if (!ids.length) { $("#rv", st).innerHTML = `<button type="button" class="btn primary" id="rv-exam">Mock exam →</button>`; $("#rv-exam", st).onclick = () => go("exam"); return; }
  runner($("#rv", st), ids, { fresh: true, showSrc: true, finishLabel: "Done", onFinish: () => go("review") });
}

/* ---------- reference ---------- */
function renderRosetta(st) {
  st.innerHTML = `<section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:16px">
    <div class="head"><span class="label">Reference</span><h2>US ↔ Thailand regulator map</h2><p>The textbook is written around US institutions, and exams will use those names. This map shows what plays the same role in the Thai system.</p></div>
    <div class="tablewrap"><table class="rosetta"><thead><tr><th>Role</th><th>United States (textbook)</th><th>Thailand</th></tr></thead><tbody>${FI.rosetta.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div>
    <p class="small muted">Thai rate caps, coverage limits and licensing rules change. Check current figures with the BOT, DPA, SEC Thailand or OIC before quoting them in an assessment.</p></section>`;
}
function renderFormulas(st) {
  st.innerHTML = `<section class="leaf leaf-pad" style="display:flex;flex-direction:column;gap:20px">
    <div class="head"><span class="label">Reference</span><h2>Formula sheet</h2><p>Every calculation used in the quizzes, labs and cases, grouped by chapter.</p></div>
    ${CH.map(c => `<div style="--hue:var(--${c.id})"><div class="row" style="gap:10px;margin-bottom:4px"><span class="denom">${c.note}</span><h3 style="font-size:20px">Ch ${c.n} · ${c.short}</h3></div>${formulaBlock(c)}</div>`).join("")}</section>`;
}

/* ---------- boot ---------- */
function setTheme(t) { document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem(LS + "-theme", t); } catch (e) { } }
try { const t = localStorage.getItem(LS + "-theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) { }
$("#brand").onclick = () => go("home");
$("#btn-theme").onclick = () => {
  const cur = document.documentElement.getAttribute("data-theme"), sysDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
  const next = cur ? (cur === "dark" ? "light" : "dark") : (sysDark ? "light" : "dark");
  setTheme(next); drawGuilloche(); PAL.react(next === "dark" ? "themeDark" : "themeLight", { soft: true });
};
const qb = $("#btn-quiet");
const paintQuiet = () => { qb.textContent = S.quiet ? PAL.name + ": quiet" : PAL.name + ": on"; qb.setAttribute("aria-pressed", String(!S.quiet)); };
qb.onclick = () => { S.quiet = !S.quiet; save(); paintQuiet(); PAL.setQuiet(S.quiet); };
let armed = 0;
$("#btn-reset").onclick = () => {
  if (Date.now() - armed > 4000) { armed = Date.now(); toast("Press ↺ again to close the account and erase progress"); PAL.say("sad", "You want to erase the whole passbook? Press ↺ once more and I'll do it…", { important: true }); return; }
  armed = 0; S = blank(); save(); go("home"); PAL.react("reset", { important: true });
};
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(drawGuilloche, 150); });
if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", drawGuilloche);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawGuilloche);
document.addEventListener("pal:sample", () => { const g = $("#grade"); if (g) g.hidden = false; });

if (S.quiet) PAL.setQuiet(true);
paintQuiet();
render();
PAL.greet();

function merge(remote) {
  if (!remote || typeof remote !== "object") return false;
  const m = Object.assign(blank(), S);
  Object.entries(remote.ans || {}).forEach(([id, a]) => { if (!m.ans[id] || (a.ok && !m.ans[id].ok)) m.ans[id] = a; });
  if ((remote.bal || 0) > m.bal) { m.bal = remote.bal; m.ledger = remote.ledger || m.ledger; }
  m.best = Math.max(m.best, remote.best || 0);
  Object.assign(m.stamps, remote.stamps || {});
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
      if (snap.exists && merge(snap.data())) { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) { } render(); toast("Progress synced"); }
      save();
    }, () => { });
  }).catch(() => { });
}
})();
