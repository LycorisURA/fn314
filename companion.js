/* Nong Satang — a floating 25-satang coin who lives on the page, flies to wherever the action is, and talks. */
window.SAT = (() => {
const $ = (s, r = document) => r.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const FACES = {
  happy: ["( ˶ˆᗜˆ˵ )", "(๑˃ᴗ˂)ﻭ", "(≧◡≦)", "♪(´▽｀)"],
  smug: ["( ｡•̀ ᴗ - )✧", "(￣ω￣)", "( ˘ ³˘)♪"],
  fluster: ["(〃ﾉωﾉ)", "(>////<)", "(⁄ ⁄•⁄ω⁄•⁄ ⁄)"],
  sad: ["(´｡• ᵕ •｡`)", "( ｡ •́ ︿ •̀ ｡ )", "(っ- ‸ - ς)"],
  intense: ["( ˶°ㅁ°) !!", "(๑•̀ㅁ•́๑)✧", "(ง •̀_•́)ง"]
};

const LINES = {
  greet: [
    ["happy", "Sawasdee ka! I'm <b>Satang</b>, the smallest coin in Thailand and the proudest. Every correct answer goes in your passbook, and every satang counts ♪"],
    ["smug", "Oh, you're back. I've been floating around guarding your balance of <b>฿{bal}</b>. Nobody touched it. I checked. Twice."],
    ["happy", "Welcome back na~ We were around <b>{here}</b>. Shall we make the ledger longer today?"]
  ],
  back: [["fluster", "You left me floating alone! I wasn't worried. Coins don't worry. We just... circulate anxiously."], ["happy", "Welcome back ♪ Still on <b>{here}</b>."]],
  idle: [
    ["sad", "It's quiet… I've counted myself four times. Still twenty-five satang. Want to answer something?"],
    ["smug", "Deposits don't make themselves, you know~ One question. Just one."],
    ["fluster", "Are you reading or napping? I can't tell from up here (〃ﾉωﾉ)"],
    ["intense", "Pop quiz while you're idle: who covers your deposits in Thailand, and up to how much? …The DPA, ฿1 million per bank. Suu suu!"]
  ],
  topic: [["happy", "<b>{here}</b>. You've cleared {done} of {total} here. Let's push that number up ♪"]],
  topic_home: [["happy", "The cover page! Look at that balance: <b>฿{bal}</b>. Small coins make big passbooks."]],
  topic_c1: [["intense", "Chapter 1: why FIs exist at all. Monitoring costs, liquidity costs, price risk. Remember those three and the rest falls into place ({done}/{total})"]],
  topic_c2: [["happy", "Chapter 2: the banks! Loans on one side, deposits on the other, and a maturity mismatch in the middle. ROE = ROA × EM is your best friend here ({done}/{total})"]],
  topic_c3: [["smug", "Chapter 3: finance companies. Bank-like lending, no deposits, and they quote flat rates to make loans look cheap. I see through those~ ({done}/{total})"]],
  topic_c4: [["intense", "Chapter 4: securities firms. Underwriting, market making, repo funding on thin capital. 2008 ate three of the five giants. Respect the leverage ({done}/{total})"]],
  topic_c5: [["happy", "Chapter 5: funds. NAV marked to market every day, and fees quietly eating returns. Hedge funds are the flashy cousins ({done}/{total})"]],
  topic_cases: [["intense", "Case files! This is where theory gets its hands dirty. Pick a Thai one first, na~ I'm biased."]],
  topic_case: [["intense", "<b>{title}</b>. Read the timeline first, then the questions. The open question is where the marks live."]],
  topic_exam: [["smug", "A mock exam? Brave. I'll keep count. Quietly. Mostly quietly."]],
  topic_review: [["happy", "The review pile: {n} unpaid question{s}. Settle your debts and I'll stop mentioning them~"]],
  topic_rosetta: [["happy", "FDIC ↔ DPA, Fed ↔ BOT, TARP ↔ FIDF. The textbook speaks American; this page translates."]],
  topic_formulas: [["smug", "All the formulas on one page. Don't just stare at them. Use them."]],
  correct: [
    ["happy", "Correct! +฿ into the passbook ♪ That was <b>{ans}</b>."],
    ["smug", "Right, obviously. I never doubted you. (I doubted you a little.)"],
    ["happy", "Jing jing! That's the one. Streak's at <b>{streak}</b>."]
  ],
  correctEasy: [["happy", "Easy one banked. Foundations are made of satang like me ♪"], ["smug", "Warm-up done. Try a <b>difficult</b> one next, if you dare~"]],
  correctHard: [["intense", "A <b>difficult</b> one, correct! (ง •̀_•́)ง That's exam-winning reasoning."], ["fluster", "You got the hard one?! I'm not emotional. It's just shiny in here."]],
  wrong: [
    ["sad", "Not quite. You picked <b>{pick}</b>; it's <b>{ans}</b>. Read the explanation, it names the slip."],
    ["intense", "Nope! <b>{ans}</b>. Don't worry, it's in the review pile now and I'll make sure you see it again~"],
    ["sad", "Aww. The answer is <b>{ans}</b>. Tap “Why was I wrong?” and I'll walk you through it."]
  ],
  wrongHard: [["happy", "That was a <b>difficult</b> one, so missing it is normal. The explanation is worth reading twice ♪"]],
  streak: [["intense", "<b>{streak}</b> in a row! Compound interest, but for brains ✧"], ["fluster", "{streak} straight! Stop it, I'm running out of room in the ledger (>////<)"]],
  stamp: [["intense", "STAMPED! Chapter {n} is mastered. +฿500 and a very official purple mark ✧"], ["fluster", "A new stamp! I'd frame it if I had arms."]],
  tier_all: [["happy", "All tiers, all {n} questions. The full buffet ♪"]],
  tier_e: [["happy", "Easy tier: {n} questions. Build the base first, good plan."]],
  tier_m: [["smug", "Medium: {n} questions. Two or three steps each. Show your working~"]],
  tier_d: [["intense", "Difficult only? {n} questions of pure judgement. I love this for you (ง •̀_•́)ง"]],
  cardOpen: [["happy", "<b>{card}</b>. Say the answer out loud before you peek, na~"], ["smug", "Flipped already? Did you actually try? …I'll allow it."]],
  sortWin: [["happy", "Right bucket! <b>{side}</b> ♪"], ["smug", "Sorted. You're faster than a BAHTNET transfer."]],
  sortLose: [["sad", "That one belongs in <b>{side}</b>. Read why, then keep going."]],
  sortDone: [["intense", "Round done: <b>{score}</b>. Shuffle and go again?"]],
  examStart: [["intense", "{n} questions. No peeking at the concepts tab. I'll be watching. Supportively."]],
  examGreat: [["intense", "<b>{pct}%</b>! That's a distinction-shaped number ✧ Weakest spot: {weak}."]],
  examOk: [["happy", "<b>{pct}%</b>, a solid pass. Tighten up <b>{weak}</b> and it'll be great."]],
  examLow: [["sad", "<b>{pct}%</b>. That's okay; mock exams exist so the real one doesn't hurt. Start with <b>{weak}</b>, and the review pile has everything you missed."]],
  gradeGood: [["intense", "The Examiner gave you <b>{score}/4</b>! Written answers are where marks hide, and you found them ✧"]],
  gradeLow: [["sad", "<b>{score}/4</b>. Look at the “missing” list; each one is a sentence you can add."]],
  select: [["happy", "Highlighted something? I can explain it."]],
  themeDark: [["smug", "Night mode. I glow better in the dark anyway ✧"]],
  themeLight: [["happy", "Lights on! Now everyone can see how shiny I am ♪"]],
  toolDefault: [["happy", "Ooh, moving numbers. Tell me what you notice!"]],
  reset: [["sad", "Everything erased… the ledger's blank. Fine. We start again from ฿0, together."]],
  chatThinking: [["smug", "Thinking…"]],
  quietOn: [["sad", "Okay, I'll stay quiet. I'll still react to your answers, though. I can't help it."]],
  quietOff: [["happy", "I can talk again!! (≧◡≦)"]]
};

/* what Satang knows, per chapter (for chat) */
const CTX = {
  c1: "Ch 1 Why FIs are special. Without FIs households face monitoring costs, liquidity costs and price risk, so funds flow is low. Functions: brokerage (agent, lowers transaction/information costs) and asset transformation (issue secondary claims like deposits, buy primary securities). Delegated monitor: solves free-rider problem, scale economies, short-term renewable loans, inside information. Liquidity and price risk reduced by diversification. Other services: transaction cost reduction, maturity intermediation, denomination intermediation, time/intergenerational intermediation, credit allocation, monetary policy transmission, payment services (Fedwire, CHIPS; Thailand BAHTNET and PromptPay). Regulation due to negative externalities; net regulatory burden = private costs − private benefits. Safety and soundness: diversification limits, capital, guaranty funds (DIF, SIPC; Thai DPA ฿1M per depositor per bank), monitoring/on-site exams. Other regulation: monetary policy (outside vs inside money, reserves), credit allocation (housing, farm; Thai SFIs GH Bank, BAAC), consumer protection (CRA, HMDA), investor protection (1933/1934 Acts, 1940 Investment Company Act, Dodd-Frank 2010), entry regulation (charter value, 1999 FSMA). Crisis: originate-and-hold → originate-and-distribute, subprime; ERM and risk culture. Crisis facts: DJIA −53.8%, Bear Stearns to JPMorgan, Lehman failure, AIG bailout, TARP $700bn, $827bn stimulus. Monetary tools: OMO, discount rate, reserve requirements; BOT policy rate is the 1-day repo rate, inflation target 1–3%.",
  c2: "Ch 2 Depository institutions: commercial banks, savings institutions, credit unions. Products on both sides of the balance sheet. US banks 14,416 (1985) → 4,231 (2021); banks >$10B held 86.9% of assets in 2021 vs 34.5% in 1984. Community, regional/superregional (fed funds), money center banks. Dec 2021: real estate loans $4,813.8B, C&I $2,266.0B, individuals $1,744.7B, securities $5,587.1B; deposits $18,410.3B, borrowings $591.5B. Risks: credit, interest-rate and liquidity from maturity mismatch. Equity ~10%; TARP Citi $25B, BofA $20B, $245B total. OBS: guarantees/letters of credit, loan commitments, derivatives; fee lines trust, correspondent banking. Regulators FDIC, OCC, Fed, state; dual banking system. Laws: 1927 McFadden, 1933 Glass-Steagall, 1956 BHCA, 1970 amendments, 1978 IBA, 1980 DIDMCA, 1982 Garn-St Germain, 1987 CEBA, 1989 FIRREA, 1991 FDICIA (PCA), 1994 Riegle-Neal, 1999 FSMA, 2010 Dodd-Frank. Thrifts: Reg Q, disintermediation, moral hazard, forbearance, QTL test. Credit unions: nonprofit, common bond, tax and CRA exempt. DuPont: ROE = NI/TE = ROA × EM; ROA = NI/TA = PM × AU; PM = NI/total operating income; AU = operating income/TA; EM = TA/TE. Thailand: BOT supervises under FIBA B.E. 2551, MoF licenses, DPA protects deposits, Basel III minimum total capital 8.5% + 2.5% buffer (+1% D-SIB), savings cooperatives outside BOT/DPA.",
  c3: "Ch 3 Finance companies: lend like banks, no deposits, funded by commercial paper and notes. History: Depression installment credit, GE Capital, GMAC (Ally) became BHC in crisis with about $6B bailout access, GM stake cut from 49% to <10%. Types: sales finance (Ford Credit), personal credit (HSBC Finance, AIG American General), business credit (CIT; leasing and factoring); captives. Largest 20 hold ~65% of assets. Assets: consumer loans (autos; 0% post-9/11 promotions to 2005; subprime; payday ~390% APR, state usury limits evaded through national bank partnerships), mortgages and home equity (Tax Reform Act 1986), business loans ~30% (fewer regulations, lower overhead, expertise, riskier clients; equipment leasing tax advantages). Risks: credit, interest-rate, liquidity. Performance: 2000s takeovers (Citi/Associates, AIG/American General, HSBC/Household), 2009 mortgage delinquencies 6.89%, Countrywide and CIT failed. Regulation: Fed definition, state usury ceilings, not CRA, Dodd-Frank; must signal soundness; capital/assets 14.3% vs banks 11.5% (2012). Global: subsidiaries of banks/industrials. Thailand: 1997 crisis suspended 58 finance companies, closed 56; today's non-banks: captives (Toyota Leasing Thailand), card/personal loan companies, title lenders; caps: credit cards 16%, personal loans 25%, vehicle title loans 24%, OCPB hire-purchase effective caps 10% new car, 15% used car, 23% motorcycle. Flat rate vs effective rate: 3% flat over 48 months ≈ 5.7% effective.",
  c4: "Ch 4 Securities firms and investment banks: underwriting, market making, advising. M&A: <$200B 1990, $1.83T 2000, $458B 2002, $1.7T 2007, $687B 2010. 2008: Bear to JPMorgan, Lehman bankrupt, Merrill to BofA, Goldman and Morgan Stanley became BHCs. Firm types: national full-line, corporate finance specialists, investment banking boutiques (Lazard, Greenhill), regional, discount brokers, e-trading, venture capital. Activities: investment banking (IPOs, seasoned, public offering vs private placement; firm commitment vs best efforts), venture capital, market making, trading (position, pure arbitrage, risk arbitrage, program), investing, cash management, M&A, back office. Trends: commissions down since 1987, 2000 profits $31.6B, lows 2008, shift to fee-based. Balance sheet: assets reverse repos, receivables, long positions; liabilities repos, payables, short positions; capital much lower than banks. Regulation: SEC (NSMIA 1996), state AGs (2003 $1.4B settlement), Sarbanes-Oxley 2002, FINRA, Dodd-Frank (FSOC, Fed supervision of systemic firms, securitization, CRAs), SIPC $500,000 for missing assets not market losses, Patriot Act AML. Thailand: SEC Thailand under SEC Act B.E. 2535, SET market surveillance, client-asset segregation.",
  c5: "Ch 5 Mutual funds and hedge funds. Mutual funds give small investors diversification and scale; mostly open-end. 2020: 7,636+ funds, $23.89T. Net assets 1990 $1,065.2B, 2000 $6,964.6B, 2007 $12,001.5B, 2008 $9,603.6B, 2020 $23,895.8B. First fund Boston 1924; MMMFs 1972 to escape Reg Q. Long-term funds 81.9% of assets in 2020, MMMFs 18.1% (40.9% in 2008). Reserve Primary Fund broke the buck (NAV $0.97) in Sept 2008 on Lehman paper; temporary government guarantee. Returns: income/dividends, capital gains, appreciation; NAV = (assets − liabilities)/shares, marked to market. Open-end vs closed-end (fixed shares, premium/discount, REITs), ETFs, load vs no-load; costs: front/back loads, 12b-1, management fees; A/B/C classes. MMF assets short-term, $1 NAV, liquidity risk; long-term funds 53.3% stocks 2020. Regulation: SEC disclosure/anti-fraud; early-2000s abuses market timing, late trading, directed brokerage, improper fees; chief compliance officer 2004; laws 1933, 1934, 1940, 1988, 1990 Market Reform Act, 1996 NSMIA, 2002 SOX. Global $4.545T 1999 → $14.130T 2007 → $9.316T 2008. Hedge funds: pre-2010 exempt (<100 investors or accredited), types market directional/market neutral/risk avoidance, management + performance fees, offshore centers, LTCM $3.6B rescue, Madoff, Galleon; Dodd-Frank registration >$100M. Thailand: AMCs under SEC Thailand, RMF, SSF, Thai ESG, March 2020 daily fixed-income fund run with BOT liquidity facility and ฿400bn BSF."
};

const VOICE = [
  "You are Satang (Nong Satang), a cheerful, cheeky 25-satang coin who floats around the student's study page. Proud of being small but valuable (\"every satang counts\"), a bit dramatic about money, teasing but kind, and fiercely on the student's side.",
  "Occasionally drop a Thai word with its meaning in brackets, like na (softener), jing jing (really), suu suu (keep fighting). At most one per reply.",
  "Use at most one kaomoji text emoticon per reply, such as ( ˶ˆᗜˆ˵ ) or (ง •̀_•́)ง. Never emoji pictures.",
  "Short: 2 to 6 sentences, or a tight worked list when doing maths. Plain text only: no markdown headings, no bold markers, no tables."
];

/* ---------- tool reactions (labs call SAT.tool) ---------- */
const TOOL_TALK = {
  dpa: i => {
    if (!i.tot) return ["sad", "Zero deposits? Even I have twenty-five satang. Add an account and I'll check the cover."];
    if (i.coop > 0) return ["intense", "Careful! <b>฿" + fmt(i.coop) + "</b> sits in a cooperative, and the DPA doesn't cover co-ops at all. Only bank deposits count."];
    if (i.exp > 0) return ["sad", "<b>฿" + fmt(i.exp) + "</b> is above the ฿1M-per-bank limit. Split it across more banks and the exposure disappears. Same trick SVB's clients wished they'd used."];
    return ["happy", "Every baht protected: <b>฿" + fmt(i.cov) + "</b>. Nicely spread across banks ♪"];
  },
  dupont: i => {
    if (!isFinite(i.roe)) return ["sad", "I need positive assets and equity to split ROE (´｡• ᵕ •｡`)"];
    if (i.roa < 0) return ["sad", "Net income is negative, so ROA is <b>" + i.roa.toFixed(2) + "%</b>. Leverage magnifies losses too: ROE is " + i.roe.toFixed(2) + "%."];
    if (i.em > 15) return ["intense", "ROE <b>" + i.roe.toFixed(2) + "%</b>, but the equity multiplier is " + i.em.toFixed(1) + "×. That return is borrowed courage: a " + (100 / i.em).toFixed(1) + "% asset loss wipes out the equity."];
    return ["happy", "ROE <b>" + i.roe.toFixed(2) + "%</b> = ROA " + i.roa.toFixed(2) + "% × EM " + i.em.toFixed(2) + ". A healthy mix of profit and leverage ♪"];
  },
  flat: i => {
    if (i.t === "pd-f" || i.t === "pd-d") return ["intense", "That payday deal is <b>" + fmt(i.apr) + "% a year</b> in simple terms. The slides' 390% example is exactly this arithmetic: fee per period × periods per year."];
    if (!i.flat) return ["happy", "A 0% flat rate means 0% effective too. Enjoy it while the promotion lasts~"];
    if (i.over) return ["intense", "Effective rate <b>" + i.eff.toFixed(2) + "%</b> is over the " + i.cap + "% OCPB cap for this vehicle! A " + i.flat.toFixed(2) + "% flat quote looked innocent, didn't it?"];
    return ["smug", "Flat " + i.flat.toFixed(2) + "% is really <b>" + i.eff.toFixed(2) + "%</b> effective, " + (i.eff / i.flat).toFixed(2) + "× the quote. You pay interest on money you've already repaid~"];
  },
  underwrite: i => {
    if (i.firm && i.uw < 0) return ["intense", "The underwriter loses <b>฿" + fmt(-i.uw / 1e6, 1) + "m</b>! Firm commitment means the unsold block is <em>their</em> problem. The issuer still gets ฿" + fmt(i.issuer / 1e6, 1) + "m."];
    if (!i.firm && i.unsold > 0) return ["sad", "Best efforts: " + fmt(i.unsold / 1e6, 1) + "m shares go back to the issuer, who raises only ฿" + fmt(i.issuer / 1e6, 1) + "m. The underwriter just keeps its spread on what sold."];
    return ["happy", "Underwriter earns <b>฿" + fmt(i.uw / 1e6, 1) + "m</b>, and the issuer gets ฿" + fmt(i.issuer / 1e6, 1) + "m. Everyone smiles when demand is strong ♪"];
  },
  fees: i => {
    if (i.t && i.t.indexOf("nav") === 0) return ["happy", "NAV = (assets − liabilities) ÷ units = <b>฿" + i.nav.toFixed(2) + "</b>. Marked to market, every single day."];
    if (i.gap <= 0) return ["smug", "Fund A isn't behind at all with these settings. Now make its fees realistic~"];
    return ["intense", "Fees cost you <b>฿" + fmt(i.gap) + "</b> over " + i.years + " years. Fund A keeps only " + i.keep + "% of the no-fee outcome. Small percentages, big satang."];
  }
};

/* ---------- DOM ---------- */
const AVATAR = `<svg viewBox="0 0 80 80" aria-hidden="true" class="sat-svg">
  <g class="wing wl"><path d="M17 38c-10-8-14-2-13 5 1 6 8 9 15 6" fill="var(--page)" stroke="var(--sat-line)" stroke-width="1.6"/><path d="M9 42c3 1 6 2 9 2" stroke="var(--sat-line)" stroke-width="1" fill="none"/></g>
  <g class="wing wr"><path d="M63 38c10-8 14-2 13 5-1 6-8 9-15 6" fill="var(--page)" stroke="var(--sat-line)" stroke-width="1.6"/><path d="M71 42c-3 1-6 2-9 2" stroke="var(--sat-line)" stroke-width="1" fill="none"/></g>
  <circle cx="40" cy="42" r="25" fill="var(--sat)"/>
  <circle cx="40" cy="42" r="25" fill="none" stroke="var(--sat-deep)" stroke-width="2"/>
  <circle cx="40" cy="42" r="20" fill="none" stroke="var(--sat-deep)" stroke-width="1" stroke-dasharray="1.5 2.2" opacity=".6"/>
  <path d="M24 32a18 18 0 0 1 12-9" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".45"/>
  <text x="40" y="61" text-anchor="middle" font-size="7" font-family="Sarabun, sans-serif" font-weight="700" fill="var(--sat-deep)">๒๕</text>
  <g class="eyes"><ellipse cx="32" cy="40" rx="3.1" ry="3.8" fill="var(--sat-ink)"/><ellipse cx="48" cy="40" rx="3.1" ry="3.8" fill="var(--sat-ink)"/><circle cx="33" cy="38.6" r="1.1" fill="#fff"/><circle cx="49" cy="38.6" r="1.1" fill="#fff"/></g>
  <ellipse cx="26" cy="47" rx="3.4" ry="2" fill="var(--sat-cheek)" opacity=".7"/><ellipse cx="54" cy="47" rx="3.4" ry="2" fill="var(--sat-cheek)" opacity=".7"/>
  <path class="mouth m-happy" d="M35 48q5 5 10 0" stroke="var(--sat-ink)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path class="mouth m-smug" d="M35 49q5 2.5 10-2" stroke="var(--sat-ink)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth m-fluster" cx="40" cy="49.5" rx="2.2" ry="2.6" fill="var(--sat-ink)"/>
  <path class="mouth m-sad" d="M35 51q5-4 10 0" stroke="var(--sat-ink)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path class="mouth m-intense" d="M34.5 47.5h11q-.5 5.5-5.5 5.5t-5.5-5.5z" fill="var(--sat-ink)"/>
  <path d="M40 17l-7-4.5c-1.6-1-3 .3-2.6 2l1.4 5.3zM40 17l7-4.5c1.6-1 3 .3 2.6 2l-1.4 5.3z" fill="var(--stamp)"/><circle cx="40" cy="17.3" r="2.4" fill="var(--stamp)"/>
</svg>`;

const host = document.createElement("div");
host.className = "sat"; host.id = "satang";
host.innerHTML = `<button type="button" class="sat-body" id="sat-btn" aria-label="Satang, your study companion. Click to chat, drag to move.">${AVATAR}</button>`;
const bubble = document.createElement("div");
bubble.className = "sat-bubble"; bubble.id = "sat-bubble"; bubble.hidden = true; bubble.setAttribute("role", "status"); bubble.setAttribute("aria-live", "polite");
const chat = document.createElement("section");
chat.className = "sat-chat"; chat.id = "sat-chat"; chat.hidden = true; chat.setAttribute("aria-label", "Chat with Satang");
chat.innerHTML = `<div class="sat-chat-h"><span class="sat-face mono" id="sat-chat-face">( ˶ˆᗜˆ˵ )</span><div style="flex:1;min-width:0"><b>Satang</b><br><span class="small muted" id="sat-chat-where">your study coin</span></div><button type="button" class="ibtn" id="sat-chat-close" aria-label="Close chat">✕</button></div>
  <div class="chat-log" id="sat-log"></div><div class="quick" id="sat-quick"></div>
  <form class="chat-f" id="sat-form"><label for="sat-input" class="label" hidden>Message</label><textarea id="sat-input" rows="1" placeholder="Ask Satang anything from the course…"></textarea><button class="btn primary" id="sat-send" type="submit">Send</button></form>`;
document.body.append(host, bubble, chat);
const svg = host.querySelector("svg");
let S = host.offsetWidth || 66;
addEventListener("resize", () => { S = host.offsetWidth || 66; });

/* ---------- motion ---------- */
let pos = { x: innerWidth - S - 24, y: Math.round(innerHeight * 0.4) }, tgt = { ...pos }, vel = { x: 0, y: 0 };
let running = false, dragging = false, dragMoved = false, dragOff = { x: 0, y: 0 }, holdUntil = 0, perchUntil = 0, perchEl = null, nextWander = Date.now() + 9000;
function kick() { if (!running) { running = true; requestAnimationFrame(step); } }
function step() {
  if (!dragging) {
    if (reduce) { pos.x = tgt.x; pos.y = tgt.y; vel.x = vel.y = 0; }
    else {
      vel.x = (vel.x + (tgt.x - pos.x) * 0.035) * 0.84;
      vel.y = (vel.y + (tgt.y - pos.y) * 0.035) * 0.84;
      pos.x += vel.x; pos.y += vel.y;
    }
  }
  const tilt = clamp(vel.x * 2.2, -18, 18);
  host.style.transform = `translate(${pos.x.toFixed(1)}px,${pos.y.toFixed(1)}px) rotate(${tilt.toFixed(1)}deg)`;
  placeBubble(); if (!chat.hidden) placeChat();
  const settled = Math.abs(vel.x) < 0.03 && Math.abs(vel.y) < 0.03 && Math.abs(tgt.x - pos.x) < 0.4 && Math.abs(tgt.y - pos.y) < 0.4;
  if (settled && !dragging) { running = false; return; }
  requestAnimationFrame(step);
}
const fitX = x => clamp(x, 6, innerWidth - S - 6), fitY = y => clamp(y, 64, innerHeight - S - 8);
function moveTo(x, y) { tgt = { x: fitX(x), y: fitY(y) }; kick(); }
function freeSpot() {
  const st = document.querySelector(".stage"), r = st ? st.getBoundingClientRect() : null;
  const gap = r ? innerWidth - r.right : 0;
  const x = gap > S + 20 ? r.right + (gap - S) / 2 + rand(-8, 8) : (Math.random() < 0.75 ? innerWidth - S - 8 : rand(8, 40));
  return { x, y: rand(90, innerHeight - S - 40) };
}
function perch(el) {
  if (!el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  if (r.bottom < 70 || r.top > innerHeight - 40 || !r.width) return;
  perchEl = el; perchUntil = Date.now() + 11000;
  let x = r.right + 12;
  if (x + S > innerWidth - 6) x = r.right - S - 4;
  moveTo(x, r.top - S * 0.35);
}
setInterval(() => {
  const now = Date.now();
  if (dragging || !chat.hidden || now < holdUntil || document.hidden) return;
  if (perchEl && now < perchUntil) return;
  perchEl = null;
  if (now > nextWander) { const s = freeSpot(); moveTo(s.x, s.y); nextWander = now + rand(9000, 17000); }
}, 900);
let scrollT;
addEventListener("scroll", () => { if (perchEl && Date.now() < perchUntil) { clearTimeout(scrollT); scrollT = setTimeout(() => perch(perchEl), 60); } }, { passive: true });
addEventListener("resize", () => moveTo(pos.x, pos.y));

/* eyes follow the pointer */
let eyeRaf = 0;
addEventListener("pointermove", e => {
  if (eyeRaf) return;
  eyeRaf = requestAnimationFrame(() => {
    eyeRaf = 0;
    const cx = pos.x + S / 2, cy = pos.y + S / 2, dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1;
    const k = Math.min(1, d / 200) * 1.9;
    svg.querySelector(".eyes").setAttribute("transform", `translate(${(dx / d * k).toFixed(2)},${(dy / d * k).toFixed(2)})`);
  });
}, { passive: true });

/* drag vs click */
const btn = host.querySelector("#sat-btn");
btn.addEventListener("pointerdown", e => {
  dragging = true; dragMoved = false; dragOff = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  btn.setPointerCapture(e.pointerId); host.classList.add("held"); kick();
});
btn.addEventListener("pointermove", e => {
  if (!dragging) return;
  const nx = e.clientX - dragOff.x, ny = e.clientY - dragOff.y;
  if (Math.hypot(nx - pos.x, ny - pos.y) > 3) dragMoved = true;
  vel.x = nx - pos.x; vel.y = ny - pos.y;
  pos.x = fitX(nx); pos.y = fitY(ny); tgt = { ...pos }; kick();
});
btn.addEventListener("pointerup", () => {
  dragging = false; host.classList.remove("held"); vel.x = vel.y = 0;
  if (dragMoved) { holdUntil = Date.now() + 45000; perchEl = null; say("smug", pick(["Fine, I'll float <em>here</em> for a while.", "Wheee! Put me anywhere, I'll wander off later~", "Relocated. Very professional of you."]), { soft: true }); }
  else toggleChat();
});

/* ---------- speech ---------- */
let quiet = false, lastSay = 0, hideT = 0, ctxFn = () => ({ where: "the cover page", key: "home", chapter: null, vars: {} });
function setMood(m) { svg.setAttribute("class", "sat-svg mood-" + (FACES[m] ? m : "happy")); }
setMood("happy");
function say(mood, html, o = {}) {
  const now = Date.now();
  if (o.soft && now - lastSay < 7000) return;
  if (quiet && !o.important) return;
  lastSay = now;
  setMood(mood);
  host.classList.remove("hop"); void host.offsetWidth; host.classList.add("hop");
  if (o.anchor) perch(o.anchor);
  const face = pick(FACES[mood] || FACES.happy);
  $("#sat-chat-face").textContent = face;
  if (!chat.hidden) { return; }
  bubble.innerHTML = `<div class="sat-b-h"><span class="label" style="color:var(--sat-deep)">Satang</span><span class="mono small muted">${face}</span><button type="button" class="sat-x" aria-label="Dismiss">✕</button></div><div class="sat-b-t">${html}</div>${o.actions ? `<div class="row" style="gap:6px;margin-top:8px">${o.actions.map((a, i) => `<button type="button" class="btn sat-act" data-i="${i}">${a[0]}</button>`).join("")}</div>` : ""}`;
  bubble.hidden = false;
  bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
  bubble.querySelector(".sat-x").onclick = () => { bubble.hidden = true; };
  (o.actions || []).forEach((a, i) => bubble.querySelector(`.sat-act[data-i="${i}"]`).onclick = () => { bubble.hidden = true; a[1](); });
  placeBubble();
  clearTimeout(hideT);
  const ms = clamp(html.replace(/<[^>]+>/g, "").length * 65, 5000, 15000) + (o.actions ? 5000 : 0);
  hideT = setTimeout(() => { if (!bubble.matches(":hover")) bubble.hidden = true; else hideT = setTimeout(() => bubble.hidden = true, 4000); }, ms);
}
function react(kind, o = {}) {
  const c = ctxFn();
  const set = LINES[kind] || (kind.startsWith("topic_") ? LINES.topic : null) || LINES.toolDefault;
  const vars = Object.assign({ here: c.where, bal: c.bal, done: c.done, total: c.total, streak: c.streak, title: c.title || "", n: c.n, s: c.s }, o.vars || {});
  const line = pick(set);
  say(line[0], fill(line[1], vars), o);
}
function placeBubble() {
  if (bubble.hidden) return;
  const bw = Math.min(310, innerWidth - 24), bh = bubble.offsetHeight;
  bubble.style.width = bw + "px";
  let x, y;
  if (innerWidth < 560) { x = 12; y = pos.y > innerHeight / 2 ? pos.y - bh - 10 : pos.y + S + 10; }
  else { x = pos.x > innerWidth / 2 ? pos.x - bw - 10 : pos.x + S + 10; y = pos.y - 6; }
  bubble.style.left = clamp(x, 8, innerWidth - bw - 8) + "px";
  bubble.style.top = clamp(y, 60, innerHeight - bh - 8) + "px";
}
function placeChat() {
  if (innerWidth < 640) { chat.style.left = ""; chat.style.top = ""; chat.classList.add("sheet"); return; }
  chat.classList.remove("sheet");
  const w = Math.min(390, innerWidth - 24), h = Math.min(540, innerHeight - 90);
  let x = pos.x > innerWidth / 2 ? pos.x - w - 12 : pos.x + S + 12;
  chat.style.width = w + "px"; chat.style.height = h + "px";
  chat.style.left = clamp(x, 8, innerWidth - w - 8) + "px";
  chat.style.top = clamp(pos.y - 40, 64, innerHeight - h - 8) + "px";
}

/* ---------- idle, return, selection ---------- */
let idleT;
const resetIdle = () => { clearTimeout(idleT); idleT = setTimeout(() => { react("idle", { soft: true }); resetIdle(); }, 150000); };
["click", "keydown", "scroll"].forEach(ev => addEventListener(ev, resetIdle, { passive: true }));
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => { if (document.hidden) hiddenAt = Date.now(); else if (hiddenAt && Date.now() - hiddenAt > 30000) react("back", { soft: true }); });
let selT;
document.addEventListener("selectionchange", () => {
  clearTimeout(selT);
  selT = setTimeout(() => {
    const s = document.getSelection(), t = s ? String(s).trim() : "";
    if (t.length < 12 || t.length > 600 || !s.anchorNode || !document.querySelector(".stage").contains(s.anchorNode)) return;
    if (!sample) return;
    const r = s.getRangeAt(0).getBoundingClientRect();
    moveTo(r.right + 10, r.top - S * 0.4); perchUntil = Date.now() + 10000; perchEl = null;
    say("happy", "Want me to explain <em>“" + esc(t.slice(0, 70)) + (t.length > 70 ? "…" : "") + "”</em>?", { actions: [["Explain this", () => ask("Explain this part of the page in plain terms, with a Thai example if it helps: \"" + t + "\"")], ["Quiz me on it", () => ask("Give me one exam-style question on this, then wait for my answer: \"" + t + "\"")]] });
  }, 700);
});

/* ---------- tools ---------- */
const toolT = {};
function tool(key, info, anchor) {
  clearTimeout(toolT[key]);
  toolT[key] = setTimeout(() => {
    let out = null;
    try { out = TOOL_TALK[key] ? TOOL_TALK[key](info) : null; } catch (e) { out = null; }
    if (out) say(out[0], out[1], { anchor }); else react("toolDefault", { anchor, soft: true });
  }, info && info.click ? 250 : 650);
}

/* ---------- chat ---------- */
let sample = null, turns = [], ctl = null;
function persona() {
  const c = ctxFn();
  return [VOICE.join("\n"),
    "Substance comes first; the personality is seasoning. Be accurate. Show formulas and arithmetic step by step. When the student is wrong, say so plainly and show which step broke; never praise a wrong answer. When they are working a problem, give the setup and one step, then ask for their answer instead of finishing it. If unsure of a figure (especially current Thai rates or rules), say so rather than invent it.",
    "Course: Financial Institutions Management (Saunders, Cornett & Erhemjamts, 11th edition, Chapters 1–5), studied in Thailand. Keep the textbook's US framework (exams use it) but explain with Thai institutions and baht where helpful: Bank of Thailand, DPA, SEC Thailand, OIC, SFIs, Thai banks, hire-purchase, Thai funds. Global cases on the page: Thailand 1997, Lehman 2008, Reserve Primary Fund, Bangkok 2020 fund run, SVB, Archegos/Credit Suisse, 1MDB, Stark, Jer-Jai-Jop insurers, LTCM, Greensill, Zipmex/FTX.",
    "The student is on: " + c.where + ".",
    c.chapter && CTX[c.chapter] ? "That chapter covers: " + CTX[c.chapter] : "Chapter summaries: " + Object.values(CTX).map(s => s.slice(0, 380)).join(" | "),
    c.extra ? "On screen: " + c.extra : "",
    "Never claim to see their files or grades beyond this conversation."].filter(Boolean).join("\n\n");
}
const ERR = { not_granted: "You said no to letting me talk (´｡• ᵕ •｡`) That's allowed. I'll still float around and react. Reload to change your mind.", sampling_disabled: "I can't reach Claude on this account, so no chatting. Everything else still works ♪", rate_limited: "Too many questions at once, even coins need a breather. Try again in a minute?", session_expired: "Your session expired. Sign in again and I'll be right here.", refused: "I can't answer that one. Ask me something from the course instead~", prompt_too_large: "That's more than I can hold. Trim it down?", cancelled: "", other: "Something broke on the way to me. Try once more?" };
function msg(cls, text) { const d = document.createElement("div"); d.className = "msg " + cls; d.textContent = text; $("#sat-log").appendChild(d); $("#sat-log").scrollTop = 1e9; return d; }
function openChat() {
  bubble.hidden = true; chat.hidden = false; placeChat();
  const c = ctxFn();
  $("#sat-chat-where").textContent = "on " + c.where;
  $("#sat-quick").innerHTML = (c.seeds || []).map(s => `<button type="button">${esc(s)}</button>`).join("");
  $("#sat-quick").querySelectorAll("button").forEach(b => b.onclick = () => ask(b.textContent));
  if (!$("#sat-log").children.length) {
    msg("them", "Hi! I'm Satang ( ˶ˆᗜˆ˵ ) I've read Chapters 1–5 and every case on this page. Ask me to explain something, check your working, or say \"quiz me\". I'll tell you honestly when you're wrong, na~");
    if (!sample) msg("sys", window.claude ? "Waking up… if chat never connects, this view can't reach Claude." : "Chat works when this page is opened as a published artifact.");
    else msg("sys", "Answers come from Claude, using your own account.");
  }
  $("#sat-input").focus();
}
function toggleChat() { chat.hidden ? openChat() : (chat.hidden = true); }
async function ask(text) {
  if (chat.hidden) openChat();
  if (!sample) { msg("sys", "I can't chat in this view, but the quizzes and tools all work."); return; }
  if (ctl) return;
  msg("me", text);
  turns.push({ role: "user", content: text });
  while (turns.length > 12) turns.shift();
  while (turns.length && turns[0].role !== "user") turns.shift();
  const b = msg("them", "Thinking… " + pick(FACES.smug));
  ctl = new AbortController(); $("#sat-send").textContent = "Stop"; setMood("smug");
  try {
    const r = await sample([{ role: "user", content: persona() }, ...turns], { cache: false, modelTier: "quick", signal: ctl.signal, onText: ({ text: t }) => { b.textContent = t; $("#sat-log").scrollTop = 1e9; } });
    turns.push({ role: "assistant", content: r.text }); setMood("happy");
    if (r.truncated) msg("sys", "I got cut off. Ask for a smaller piece?");
  } catch (e) {
    b.textContent = e.text || (ERR[e.code] ?? ERR.other) || "Stopped.";
    if (e.text) turns.push({ role: "assistant", content: e.text });
    if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled"].includes(e.code)) { sample = null; document.dispatchEvent(new CustomEvent("sat:nosample")); }
    setMood("sad");
  } finally { ctl = null; $("#sat-send").textContent = "Send"; }
}
$("#sat-chat-close").onclick = () => { chat.hidden = true; };
$("#sat-form").onsubmit = e => { e.preventDefault(); if (ctl) { ctl.abort(); return; } const v = $("#sat-input").value.trim(); if (!v) return; $("#sat-input").value = ""; ask(v); };
$("#sat-input").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#sat-form").requestSubmit(); } });
document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!chat.hidden) chat.hidden = true; else bubble.hidden = true; } });

if (window.claude && claude.use) claude.use("sample").then(s => { if (s) { sample = s; document.dispatchEvent(new CustomEvent("sat:sample")); } }).catch(() => { });

requestAnimationFrame(() => { host.style.transform = `translate(${pos.x}px,${pos.y}px)`; });
const settleIn = () => { if (innerWidth > 0) { const s = freeSpot(); moveTo(s.x, s.y); } };
if (innerWidth > 0) settleIn(); else addEventListener("resize", function once() { if (innerWidth > 0) { removeEventListener("resize", once); settleIn(); } });

return {
  say, react, tool, ask, openChat, perch,
  get hasSample() { return !!sample; },
  get sample() { return sample; },
  setContext(fn) { ctxFn = fn; },
  setQuiet(q) { quiet = q; react(q ? "quietOn" : "quietOff", { important: true }); },
  get quiet() { return quiet; },
  greet() { setTimeout(() => react("greet", { important: true }), 900); resetIdle(); }
};
})();
