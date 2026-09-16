window.LABS = (() => {
const $ = (s, r) => r.querySelector(s);
const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const num = (el) => { const v = parseFloat(el.value); return isNaN(v) ? 0 : v; };
const wire = (root, fn) => { root.querySelectorAll("input,select").forEach(i => i.addEventListener("input", e => fn(e))); fn(); };
const talk = (e, key, info, root) => { if (e && window.PAL) PAL.tool(key, Object.assign({ t: e.target && e.target.id, click: e.type === "click" || e.type === "change" }, info), root.querySelector(".readouts") || root); };
const ro = (label, value, note = "") => `<div class="ro"><span class="label">${label}</span><div class="v">${value}</div>${note ? `<span class="small muted">${note}</span>` : ""}</div>`;
const field = (id, label, value, attrs = "") => `<div class="field"><label for="${id}">${label}</label><input type="number" id="${id}" value="${value}" ${attrs}></div>`;
const intro = (title, text) => `<div class="head" style="margin-bottom:14px"><span class="label">Lab</span><h3 style="font-size:24px">${title}</h3><p class="small">${text}</p></div>`;

/* line chart: series [{pts:[[x,y]], color, label, dash}] */
function chart(series, { xLabel = "", yFmt = v => fmt(v), xMax, yMax }) {
  const W = 560, H = 260, L = 64, R = 16, T = 16, B = 36;
  const xm = xMax || Math.max(...series.flatMap(s => s.pts.map(p => p[0])));
  let ym = yMax || Math.max(...series.flatMap(s => s.pts.map(p => p[1])));
  const mag = Math.pow(10, Math.floor(Math.log10(ym || 1)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => ym / s <= 5) || mag * 10;
  ym = Math.ceil(ym / step) * step;
  const X = x => L + (x / xm) * (W - L - R), Y = y => T + (1 - y / ym) * (H - T - B);
  let g = "";
  for (let v = 0; v <= ym + 1e-9; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--rule-soft)"/><text x="${L - 8}" y="${Y(v) + 4}" text-anchor="end" font-size="11" style="fill:var(--ink-3)">${yFmt(v)}</text>`;
  const xs = 5;
  for (let k = 0; k <= xs; k++) { const v = Math.round(xm * k / xs); g += `<text x="${X(v)}" y="${H - B + 18}" text-anchor="middle" font-size="11" style="fill:var(--ink-3)">${v}</text>`; }
  g += `<text x="${W - R}" y="${H - 4}" text-anchor="end" font-size="11" style="fill:var(--ink-3)">${xLabel}</text>`;
  const lines = series.map(s => {
    const d = s.pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(1) + " " + Y(p[1]).toFixed(1)).join(" ");
    const last = s.pts[s.pts.length - 1];
    return `<path d="${d}" fill="none" style="stroke:var(${s.color})" stroke-width="2.2" ${s.dash ? 'stroke-dasharray="6 5"' : ""}/><circle cx="${X(last[0])}" cy="${Y(last[1])}" r="4" style="fill:var(${s.color})"/>`;
  }).join("");
  const legend = series.map(s => `<span class="row" style="gap:6px"><svg width="22" height="8" aria-hidden="true"><line x1="0" x2="22" y1="4" y2="4" style="stroke:var(${s.color})" stroke-width="2.5" ${s.dash ? 'stroke-dasharray="5 4"' : ""}/></svg><span class="small">${s.label}</span></span>`).join("");
  return `<div class="row" style="gap:16px;margin-bottom:6px">${legend}</div><div class="tablewrap"><svg viewBox="0 0 ${W} ${H}" style="width:100%;min-width:420px;height:auto" role="img" aria-label="Chart">${g}<line x1="${L}" x2="${W - R}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--ink-3)"/>${lines}</svg></div>`;
}

/* Ch1 — DPA coverage */
function dpa(el) {
  const rows = [
    { inst: "Kasikornbank · savings", amt: 700000, co: false },
    { inst: "Kasikornbank · fixed deposit", amt: 600000, co: false },
    { inst: "SCB · savings", amt: 400000, co: false },
    { inst: "Teachers' savings cooperative", amt: 2000000, co: true }
  ];
  el.innerHTML = intro("Deposit Cover Check", "The DPA protects up to ฿1,000,000 per depositor, <b>per bank</b>, across all accounts at that bank combined. Cooperatives are outside the scheme. The rows below are example figures; edit them or add your own.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px"><div id="dpa-rows" style="display:flex;flex-direction:column;gap:10px"></div><button class="btn" id="dpa-add">Add an account</button></div><div id="dpa-out"></div></div>`;
  const paintRows = () => {
    $("#dpa-rows", el).innerHTML = rows.map((r, i) => `<div style="border:1px solid var(--rule);border-radius:4px;padding:10px;display:grid;gap:6px">
      <div class="field"><label for="dpa-i${i}">Institution · account (same name before "·" = same bank)</label><input type="text" id="dpa-i${i}" value="${r.inst.replace(/"/g, "&quot;")}"></div>
      <div class="row" style="flex-wrap:nowrap"><div class="field" style="flex:1"><label for="dpa-a${i}">Balance (฿)</label><input type="number" id="dpa-a${i}" value="${r.amt}" step="50000" min="0"></div>
      <label class="small" style="display:flex;gap:6px;align-items:center;padding-top:18px"><input type="checkbox" id="dpa-c${i}" ${r.co ? "checked" : ""}> Co-op</label></div></div>`).join("");
    rows.forEach((r, i) => {
      $("#dpa-i" + i, el).oninput = e => { r.inst = e.target.value; calc(e); };
      $("#dpa-a" + i, el).oninput = e => { r.amt = +e.target.value || 0; calc(e); };
      $("#dpa-c" + i, el).onchange = e => { r.co = e.target.checked; calc(e); };
    });
  };
  const calc = (e) => {
    const by = {};
    rows.forEach(r => { const k = r.inst.split("·")[0].trim() || "Unnamed"; by[k] = by[k] || { amt: 0, co: false }; by[k].amt += r.amt; by[k].co = by[k].co || r.co; });
    let tot = 0, cov = 0, coop = 0;
    const trs = Object.entries(by).map(([k, v]) => { const c = v.co ? 0 : Math.min(v.amt, 1e6); tot += v.amt; cov += c; if (v.co) coop += v.amt; return `<tr><td>${k}${v.co ? ' <span class="chip no">not covered</span>' : ""}</td><td class="r">${fmt(v.amt)}</td><td class="r cr">${fmt(c)}</td><td class="r">${fmt(v.amt - c)}</td></tr>`; }).join("");
    $("#dpa-out", el).innerHTML = `<div class="readouts" style="margin-bottom:14px">${ro("Total deposits", "฿" + fmt(tot))}${ro("Protected", "฿" + fmt(cov))}${ro("Exposed", "฿" + fmt(tot - cov), tot ? Math.round((tot - cov) / tot * 100) + "% of your money" : "")}</div>
      <div class="tablewrap"><table class="ledger"><thead><tr><th>Institution</th><th class="r">Balance</th><th class="r">Protected</th><th class="r">Exposed</th></tr></thead><tbody>${trs}</tbody></table></div>
      <p class="small muted" style="margin-top:10px">Try moving money across banks: splitting ฿2M between two banks protects all of it. US comparison: the FDIC covers $250,000 per depositor, per bank, per ownership category.</p>`;
    talk(e, "dpa", { tot, cov, exp: tot - cov, coop }, el);
  };
  $("#dpa-add", el).onclick = () => { rows.push({ inst: "Bangkok Bank · savings", amt: 300000, co: false }); paintRows(); calc(); };
  paintRows(); calc();
}

/* Ch2 — DuPont */
function dupont(el) {
  const presets = {
    big: ["Large Thai bank (illustrative)", 160, 60, 48, 4200, 520],
    lev: ["Thin-capital bank", 150, 30, 22, 3000, 150],
    fee: ["Fee-heavy bank", 90, 80, 51, 3400, 420]
  };
  el.innerHTML = intro("DuPont Bench", "Pull a bank's ROE apart into profit margin, asset utilisation and leverage. Figures are in ฿bn and illustrative, not a real bank's accounts.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px">
      <div class="field"><label for="dp-p">Preset</label><select id="dp-p">${Object.entries(presets).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join("")}</select></div>
      ${field("dp-ii", "Interest income", 160)}${field("dp-ni2", "Non-interest income", 60)}${field("dp-ni", "Net income", 48)}${field("dp-ta", "Total assets", 4200)}${field("dp-te", "Total equity", 520)}
    </div><div id="dp-out"></div></div>`;
  const setP = k => { const p = presets[k];["dp-ii", "dp-ni2", "dp-ni", "dp-ta", "dp-te"].forEach((id, i) => $("#" + id, el).value = p[i + 1]); };
  $("#dp-p", el).onchange = e => { setP(e.target.value); calc(e); };
  const bar = (label, v, max, txt) => `<div class="bar"><span>${label}</span><span class="track"><i style="width:${Math.min(100, Math.max(0, v / max * 100)).toFixed(1)}%"></i></span><span class="mono" style="text-align:right">${txt}</span></div>`;
  const calc = (e) => {
    const ii = num($("#dp-ii", el)), nii = num($("#dp-ni2", el)), ni = num($("#dp-ni", el)), ta = num($("#dp-ta", el)), te = num($("#dp-te", el));
    const toi = ii + nii, pm = toi ? ni / toi : 0, au = ta ? toi / ta : 0, roa = pm * au, em = te ? ta / te : 0, roe = roa * em;
    const warn = em > 15;
    $("#dp-out", el).innerHTML = `<div class="readouts" style="margin-bottom:16px">${ro("ROE", (roe * 100).toFixed(2) + "%")}${ro("ROA", (roa * 100).toFixed(2) + "%")}${ro("Equity multiplier", em.toFixed(2) + "×", "equity = " + (te / ta * 100 || 0).toFixed(1) + "% of assets")}</div>
      <div class="bars">${bar("Profit margin", pm, 0.5, (pm * 100).toFixed(1) + "%")}${bar("Asset utilisation", au, 0.1, (au * 100).toFixed(2) + "%")}${bar("ROA", roa, 0.03, (roa * 100).toFixed(2) + "%")}${bar("Equity multiplier", em, 25, em.toFixed(1) + "×")}${bar("ROE", roe, 0.3, (roe * 100).toFixed(1) + "%")}</div>
      <p class="mono small" style="margin-top:14px">ROE = PM × AU × EM = ${(pm * 100).toFixed(1)}% × ${(au * 100).toFixed(2)}% × ${em.toFixed(2)} = ${(roe * 100).toFixed(2)}%</p>
      <p class="small" style="margin-top:8px">${warn ? '<span class="chip no">Leverage-driven</span> Equity is under 6.7% of assets. A small loss on assets would wipe out a large share of capital.' : '<span class="chip ok">Balanced</span> The return comes from margin and asset use, not just leverage.'}</p>`;
    talk(e, "dupont", { roe: roe * 100, roa: roa * 100, em, pm, au }, el);
  };
  wire(el, calc);
}

/* Ch3 — flat rate x-ray */
function effRate(P, pmt, n) {
  let lo = 0, hi = 0.2;
  for (let k = 0; k < 100; k++) { const r = (lo + hi) / 2; const pv = pmt * (1 - Math.pow(1 + r, -n)) / r; pv > P ? lo = r : hi = r; }
  return (lo + hi) / 2;
}
function flat(el) {
  el.innerHTML = intro("Flat-Rate X-Ray", "Thai hire-purchase and many informal loans quote a <b>flat</b> rate: interest on the original principal for the whole term. See what you really pay, and how it compares with the OCPB's effective-rate caps. Starting figures are an example.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px">
      ${field("fl-p", "Amount financed (฿)", 500000, 'step="10000" min="1000"')}${field("fl-r", "Flat rate (% a year)", 3, 'step="0.1" min="0"')}${field("fl-n", "Term (months)", 48, 'step="6" min="1" max="120"')}
      <div class="field"><label for="fl-t">Vehicle type (OCPB cap)</label><select id="fl-t"><option value="10">New car · 10%</option><option value="15">Used car · 15%</option><option value="23">Motorcycle · 23%</option></select></div>
      <div style="border-top:1px solid var(--rule);padding-top:10px;display:grid;gap:10px"><span class="label">Payday / informal loan</span>${field("pd-f", "Fee per ฿100 borrowed", 15, 'step="1" min="0"')}${field("pd-d", "Days per loan", 14, 'step="1" min="1"')}</div>
    </div><div id="fl-out"></div></div>`;
  const calc = (e) => {
    const P = num($("#fl-p", el)), f = num($("#fl-r", el)) / 100, n = Math.max(1, Math.round(num($("#fl-n", el)))), cap = +$("#fl-t", el).value;
    const interest = P * f * n / 12, pmt = (P + interest) / n;
    const r = f > 0 ? effRate(P, pmt, n) : 0, eff = r * 12;
    const pts = [], flatPts = [];
    let bal = P;
    for (let m = 0; m <= n; m++) { pts.push([m, Math.max(0, bal)]); flatPts.push([m, P]); bal = bal * (1 + r) - pmt; }
    const pdF = num($("#pd-f", el)), pdD = Math.max(1, num($("#pd-d", el)));
    const apr = pdF / 100 * 365 / pdD, ear = Math.pow(1 + pdF / 100, 365 / pdD) - 1;
    $("#fl-out", el).innerHTML = `<div class="readouts" style="margin-bottom:14px">${ro("Monthly installment", "฿" + fmt(pmt, 2))}${ro("Total interest", "฿" + fmt(interest))}${ro("Effective rate", (eff * 100).toFixed(2) + "%", "≈ " + (f ? (eff / f).toFixed(2) : "–") + "× the flat rate")}</div>
      <p class="small" style="margin-bottom:12px">${eff * 100 <= cap ? `<span class="chip ok">Within cap</span> ${(eff * 100).toFixed(2)}% ≤ ${cap}% effective ceiling.` : `<span class="chip no">Over cap</span> ${(eff * 100).toFixed(2)}% exceeds the ${cap}% effective ceiling.`}</p>
      ${chart([{ pts: flatPts, color: "--c3", label: "Principal the flat rate charges on", dash: true }, { pts, color: "--accent", label: "Principal you actually still owe" }], { xLabel: "month", yFmt: v => v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : Math.round(v / 1000) + "k" })}
      <p class="small muted" style="margin-top:6px">The gap between the lines is money you have already repaid but are still charged interest on.</p>
      <div class="readouts" style="margin-top:16px">${ro("Payday: simple APR", (apr * 100).toFixed(0) + "%")}${ro("Payday: compounded", ear > 1e3 ? ">100,000%" : (ear * 100).toFixed(0) + "%", "if rolled over all year")}</div>`;
    talk(e, "flat", { eff: eff * 100, flat: f * 100, cap, over: eff * 100 > cap, apr: apr * 100 }, el);
  };
  wire(el, calc);
}

/* Ch4 — underwriting desk */
function underwrite(el) {
  el.innerHTML = intro("Underwriting Desk", "Price a SET IPO and see who carries the risk. Set how much of the issue sells at the offer price, and where the rest clears. A firm-commitment underwriter must dump unsold shares; a best-efforts agent hands them back.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px">
      <div class="field"><label for="uw-m">Method</label><select id="uw-m"><option value="firm">Firm commitment</option><option value="best">Best efforts</option></select></div>
      ${field("uw-s", "Shares offered (million)", 50, 'step="1" min="1"')}${field("uw-b", "Price paid to issuer (฿)", 9.4, 'step="0.05" min="0"')}${field("uw-o", "Offer price (฿)", 10, 'step="0.05" min="0"')}
      <div class="field"><label for="uw-d">Demand at offer price: <span id="uw-dv" class="mono">70</span>%</label><input type="range" id="uw-d" min="0" max="100" value="70"></div>
      ${field("uw-c", "Price that clears the rest (฿)", 9, 'step="0.05" min="0"')}
      <button class="btn" id="uw-rand" type="button">Roll a new market</button>
    </div><div id="uw-out"></div></div>`;
  const calc = (e) => {
    const firm =$("#uw-m", el).value === "firm", S = num($("#uw-s", el)) * 1e6, b = num($("#uw-b", el)), o = num($("#uw-o", el)), d = num($("#uw-d", el)) / 100, c = num($("#uw-c", el));
    $("#uw-dv", el).textContent = Math.round(d * 100);
    const sold = S * d, rest = S - sold;
    let issuer, uw, unsold;
    if (firm) { issuer = S * b; uw = sold * (o - b) + rest * (c - b); unsold = 0; }
    else { issuer = sold * b; uw = sold * (o - b); unsold = rest; }
    const m = v => (v < 0 ? "−฿" : "฿") + fmt(Math.abs(v) / 1e6, 1) + "m";
    $("#uw-out", el).innerHTML = `<div class="readouts" style="margin-bottom:14px">${ro("Issuer receives", m(issuer))}${ro("Underwriter P/L", m(uw), uw < 0 ? "a loss on the unsold block" : "gross spread earned")}${ro("Shares returned to issuer", fmt(unsold / 1e6, 1) + "m")}</div>
      <div class="tablewrap"><table class="ledger"><tbody>
      <tr><td>Gross spread per share</td><td class="r">฿${(o - b).toFixed(2)} (${o ? ((o - b) / o * 100).toFixed(1) : 0}% of offer)</td></tr>
      <tr><td>Sold at offer</td><td class="r">${fmt(sold / 1e6, 1)}m × ฿${o.toFixed(2)}</td></tr>
      <tr><td>${firm ? "Dumped at clearing price" : "Unsold, returned"}</td><td class="r">${fmt(rest / 1e6, 1)}m${firm ? " × ฿" + c.toFixed(2) : ""}</td></tr>
      <tr><td>Who bears the price risk?</td><td class="r"><b>${firm ? "Underwriter" : "Issuer"}</b></td></tr></tbody></table></div>
      <p class="small muted" style="margin-top:10px">Break-even clearing price for the firm-commitment underwriter: ฿${rest > 0 ? (b - sold * (o - b) / rest).toFixed(2) : "–"}. Below it, the spread on shares sold can't cover the loss on the rest.</p>`;
    talk(e, "underwrite", { firm, uw, issuer, unsold }, el);
  };
  $("#uw-rand", el).onclick = e => { $("#uw-d", el).value = Math.round(30 + Math.random() * 70); $("#uw-c", el).value = (num($("#uw-o", el)) * (0.8 + Math.random() * 0.25)).toFixed(2); calc(e); };
  wire(el, calc);
}

/* Ch5 — fee drag */
function fees(el) {
  el.innerHTML = intro("Fee Drag", "Two funds with the same gross return. One charges a front-end fee and a high expense ratio, the other is a low-cost index fund. Starting values are an example: drag the sliders and watch the gap compound.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px">
      ${field("fe-i", "Initial investment (฿)", 100000, 'step="10000" min="0"')}
      <div class="field"><label for="fe-y">Years: <span class="mono" id="fe-yv">20</span></label><input type="range" id="fe-y" min="1" max="40" value="20"></div>
      ${field("fe-g", "Gross return (% a year)", 7, 'step="0.25"')}
      <span class="label" style="margin-top:6px;color:var(--c3)">Fund A · active</span>${field("fe-la", "Front-end fee (%)", 1.5, 'step="0.25" min="0"')}${field("fe-ea", "Expense ratio (% a year)", 1.5, 'step="0.05" min="0"')}
      <span class="label" style="margin-top:6px;color:var(--c1)">Fund B · index</span>${field("fe-lb", "Front-end fee (%)", 0, 'step="0.25" min="0"')}${field("fe-eb", "Expense ratio (% a year)", 0.25, 'step="0.05" min="0"')}
      <div style="border-top:1px solid var(--rule);padding-top:10px;display:grid;gap:10px"><span class="label">NAV check</span>${field("nav-a", "Market value of assets (฿m)", 133, 'step="1"')}${field("nav-l", "Liabilities (฿m)", 0, 'step="1"')}${field("nav-u", "Units outstanding (m)", 5, 'step="0.1" min="0.1"')}</div>
    </div><div id="fe-out"></div></div>`;
  const calc = (e) => {
    const I = num($("#fe-i", el)), Y = Math.round(num($("#fe-y", el))), g = num($("#fe-g", el)) / 100;
    $("#fe-yv", el).textContent = Y;
    const path = (load, er) => { const pts = []; let v = I * (1 - load / 100); for (let y = 0; y <= Y; y++) { pts.push([y, v]); v *= 1 + g - er / 100; } return pts; };
    const A = path(num($("#fe-la", el)), num($("#fe-ea", el))), B = path(num($("#fe-lb", el)), num($("#fe-eb", el)));
    const fa = A[A.length - 1][1], fb = B[B.length - 1][1], gross = I * Math.pow(1 + g, Y);
    const navU = num($("#nav-u", el)), nav = navU ? (num($("#nav-a", el)) - num($("#nav-l", el))) / navU : 0;
    $("#fe-out", el).innerHTML = `<div class="readouts" style="margin-bottom:14px">${ro("Fund A ends at", "฿" + fmt(fa))}${ro("Fund B ends at", "฿" + fmt(fb))}${ro("Cost of fees", "฿" + fmt(fb - fa), "A keeps " + (fa / gross * 100).toFixed(0) + "% of the no-fee outcome")}</div>
      ${chart([{ pts: B, color: "--c1", label: "Fund B · index" }, { pts: A, color: "--c3", label: "Fund A · active" }], { xLabel: "years", yFmt: v => v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : Math.round(v / 1000) + "k" })}
      <div class="readouts" style="margin-top:16px">${ro("NAV per unit", "฿" + nav.toFixed(2), "(assets − liabilities) ÷ units")}</div>`;
    talk(e, "fees", { gap: fb - fa, years: Y, keep: Math.round(fa / gross * 100), nav }, el);
  };
  wire(el, calc);
}

/* Ch6 — underwriting ledger */
function combined(el) {
  const presets = {
    steady: ["Steady Thai motor book", 4200, 3000, 270, 210, 1176, 0, 4.5],
    soft: ["Soft market: chasing premium", 4200, 3400, 250, 250, 1300, 40, 5],
    cat: ["Catastrophe year · 2011-style flood", 4200, 9000, 6300, 500, 1176, 0, 4.5]
  };
  el.innerHTML = intro("Underwriting Ledger", "Take a non-life insurer's year apart. The <b>combined ratio</b> asks whether premiums covered claims and costs; the <b>operating ratio</b> subtracts the investment yield and asks whether the year made money at all. Reinsurance sits in between. Figures are in ฿m and illustrative.") +
    `<div class="lab"><div style="display:flex;flex-direction:column;gap:10px">
      <div class="field"><label for="cb-p">Scenario</label><select id="cb-p">${Object.entries(presets).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join("")}</select></div>
      ${field("cb-prem", "Premiums earned", 4200, 'step="100" min="1"')}${field("cb-loss", "Gross losses incurred", 3000, 'step="100" min="0"')}${field("cb-re", "Recovered from reinsurers", 270, 'step="100" min="0"')}${field("cb-lae", "Loss adjustment expenses", 210, 'step="10" min="0"')}${field("cb-exp", "Underwriting expenses", 1176, 'step="10" min="0"')}${field("cb-div", "Dividends to policyholders", 0, 'step="10" min="0"')}${field("cb-y", "Investment yield (% of premiums)", 4.5, 'step="0.25" min="0"')}
    </div><div id="cb-out"></div></div>`;
  const setP = k => { const p = presets[k];["cb-prem", "cb-loss", "cb-re", "cb-lae", "cb-exp", "cb-div", "cb-y"].forEach((id, i) => $("#" + id, el).value = p[i + 1]); };
  $("#cb-p", el).onchange = e => { setP(e.target.value); calc(e); };
  const bar = (label, v, max, txt) => `<div class="bar"><span>${label}</span><span class="track"><i style="width:${Math.min(100, Math.max(0, v / max * 100)).toFixed(1)}%"></i></span><span class="mono" style="text-align:right">${txt}</span></div>`;
  const calc = (e) => {
    const prem = Math.max(1, num($("#cb-prem", el))), gross = num($("#cb-loss", el)), re = num($("#cb-re", el));
    const lae = num($("#cb-lae", el)), exp = num($("#cb-exp", el)), div = num($("#cb-div", el)), y = num($("#cb-y", el));
    const net = Math.max(0, gross - re);
    const lr = (net + lae) / prem * 100, er = exp / prem * 100, dr = div / prem * 100;
    const cr = lr + er, crd = cr + dr, op = crd - y;
    const grossCr = (gross + lae) / prem * 100 + er + dr;
    const breakEven = Math.max(0, crd - 100);
    const pts = (fn) => { const a = []; for (let k = 0; k <= 20; k++) { const extra = k * 100; a.push([extra, fn(extra)]); } return a; };
    const crAt = extra => (net + lae + extra) / prem * 100 + er + dr;
    $("#cb-out", el).innerHTML = `<div class="readouts" style="margin-bottom:16px">${ro("Loss ratio", lr.toFixed(2) + "%", "(net losses + LAE) ÷ premiums")}${ro("Expense ratio", er.toFixed(2) + "%")}${ro("Combined ratio", crd.toFixed(2) + "%", dr ? "after " + dr.toFixed(2) + "% dividends" : "no policyholder dividends")}${ro("Operating ratio", op.toFixed(2) + "%", "after a " + y.toFixed(2) + "% investment yield")}</div>
      <div class="bars">${bar("Loss ratio", lr, 200, lr.toFixed(1) + "%")}${bar("Expense ratio", er, 200, er.toFixed(1) + "%")}${bar("Combined ratio", crd, 200, crd.toFixed(1) + "%")}${bar("Operating ratio", op, 200, op.toFixed(1) + "%")}</div>
      <p class="small" style="margin-top:14px">${crd <= 100 ? `<span class="chip ok">Underwriting profit</span> Premiums covered claims and costs with ${(100 - crd).toFixed(2)}% to spare, before investment income.` : `<span class="chip no">Underwriting loss</span> Every ฿100 of premium paid out ฿${crd.toFixed(2)}. The year needs an investment yield above <b>${breakEven.toFixed(2)}%</b> to break even; it earned ${y.toFixed(2)}%.`}</p>
      <p class="small" style="margin-bottom:12px">${op <= 100 ? `<span class="chip ok">Profitable year</span> Overall profit margin ${(100 - op).toFixed(2)}% of premiums.` : `<span class="chip no">Loss-making year</span> Overall margin ${(100 - op).toFixed(2)}% of premiums: investment income could not close the gap.`}</p>
      ${chart([{ pts: pts(crAt), color: "--c3", label: "Combined ratio" }, { pts: pts(x => crAt(x) - y), color: "--accent", label: "Operating ratio" }, { pts: [[0, 100], [2000, 100]], color: "--ink-3", label: "Break-even (100)", dash: true }], { xLabel: "extra retained losses (฿m)", yFmt: v => Math.round(v) + "%" })}
      <div class="tablewrap" style="margin-top:14px"><table class="ledger"><tbody>
      <tr><td>Gross losses before reinsurance</td><td class="r">฿${fmt(gross)}m</td></tr>
      <tr><td>Recovered from reinsurers</td><td class="r cr">−฿${fmt(Math.min(re, gross))}m</td></tr>
      <tr><td>Retained by this insurer</td><td class="r">฿${fmt(net)}m</td></tr>
      <tr><td>Combined ratio <em>without</em> reinsurance</td><td class="r">${grossCr.toFixed(2)}%</td></tr>
      <tr><td>Reinsurance saved</td><td class="r">${(grossCr - crd).toFixed(2)} points</td></tr></tbody></table></div>
      <p class="small muted" style="margin-top:10px">Try the flood scenario: gross claims of more than twice the year's premiums, and the insurer still lands near break-even because most of the loss was ceded. About 75% of the reinsurance US insurers buy is written abroad, which is how one country's catastrophe becomes another continent's loss.</p>`;
    talk(e, "combined", { lr, er, cr: crd, op, y, breakEven, ceded: grossCr - crd, re }, el);
  };
  wire(el, calc);
}

return { dpa, dupont, flat, underwrite, fees, combined };
})();
