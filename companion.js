/* Claude — the study companion who floats around the passbook, keeps your ledger, and talks back. */
window.PAL = (() => {
const $ = (s, r = document) => r.querySelector(s);
const pick = a => a[Math.floor(Math.random() * a.length)];
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => v[k] !== undefined ? v[k] : m);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n, d = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

const NAME = "Claude";

const FACES = {
  happy: ["( ˶ˆᗜˆ˵ )", "(๑˃ᴗ˂)ﻭ", "(≧◡≦)", "♪(´▽｀)"],
  smug: ["( ｡•̀ ᴗ - )✧", "(￣ω￣)", "( ˘ ³˘)♪"],
  fluster: ["(〃ﾉωﾉ)", "(>////<)", "(⁄ ⁄•⁄ω⁄•⁄ ⁄)"],
  sad: ["(´｡• ᵕ •｡`)", "( ｡ •́ ︿ •̀ ｡ )", "(っ- ‸ - ς)"],
  intense: ["( ˶°ㅁ°) !!", "(๑•̀ㅁ•́๑)✧", "(ง •̀_•́)ง"]
};

const LINES = {
  greet: [
    ["happy", "Sawasdee ka! I'm <b>Claude</b>, and I keep this passbook for you. Every right answer is a deposit, and I write down every single one ♪"],
    ["smug", "Oh. You came back. I kept the counter open the whole time, obviously. Your balance is still <b>฿{bal}</b>. I counted it twice while waiting."],
    ["happy", "Welcome back na~ We left off around <b>{here}</b>. Shall we make this ledger longer today?"]
  ],
  back: [["fluster", "You left the tab! I wasn't watching the door. I was just... standing near it. For a while."], ["happy", "There you are ♪ Still on <b>{here}</b>. I kept your place."]],
  idle: [
    ["sad", "It's very quiet at this counter… I've reread your ledger twice. Want to answer just one thing?"],
    ["smug", "Deposits don't post themselves, you know~ One question. I'll stop nagging after that. Probably."],
    ["fluster", "Are you reading, or are you asleep? I can't tell from here and it's making me anxious (〃ﾉωﾉ)"],
    ["intense", "Surprise question while you idle: who protects your deposits in Thailand, and up to how much? …The DPA, ฿1 million per bank. Suu suu (keep fighting)!"]
  ],
  topic: [["happy", "<b>{here}</b>. You've cleared {done} of {total} here. Let's move that number, na~"]],
  topic_home: [["happy", "The cover page! Look at that balance: <b>฿{bal}</b>. I wrote every line of it myself ♪"]],
  topic_c1: [["intense", "Chapter 1: why FIs exist at all. Monitoring costs, liquidity costs, price risk. Hold those three and everything else hangs off them ({done}/{total})"]],
  topic_c2: [["happy", "Chapter 2: the banks. Loans one side, deposits the other, a maturity mismatch in the middle. ROE = ROA × EM is your friend here ({done}/{total})"]],
  topic_c3: [["smug", "Chapter 3: finance companies. Bank-like lending, no deposits, and flat rates quoted to make loans look cheap. I see straight through those~ ({done}/{total})"]],
  topic_c4: [["intense", "Chapter 4: securities firms. Underwriting, market making, repo funding on thin capital. 2008 ate three of the five giants. Respect the leverage ({done}/{total})"]],
  topic_c5: [["happy", "Chapter 5: funds. NAV marked to market daily, fees quietly eating the returns. Hedge funds are the loud cousins ({done}/{total})"]],
  topic_c6: [["intense", "Chapter 6: insurance. Life insurers pool slow, smooth risks; P&amp;C pools fast, violent ones. Both break the same way, when the risks stop being independent ({done}/{total})"]],
  topic_c7: [["intense", "Chapter 7: the nine risks. Interest rate, market, credit, off-balance-sheet, FX, sovereign, operational, liquidity, insolvency. Learn the list and every case on this page suddenly has a name ({done}/{total})"]],
  topic_cases: [["intense", "Case files. This is where the theory gets its hands dirty. Pick a Thai one first, na~ I'm biased and not sorry."]],
  topic_case: [["intense", "<b>{title}</b>. Read the timeline first, then the questions. The open one is where the marks actually live."]],
  topic_exam: [["smug", "A mock exam? Brave of you. I'll keep count. Quietly. Mostly quietly."]],
  topic_review: [["happy", "The review pile: {n} unsettled question{s}. Clear them and I'll stop bringing them up~"]],
  topic_rosetta: [["happy", "FDIC ↔ DPA, Fed ↔ BOT, TARP ↔ FIDF. The textbook speaks American; this page translates it for you."]],
  topic_formulas: [["smug", "Every formula in one place. Don't just admire them. Use them."]],
  correct: [
    ["happy", "Correct! Posting it to your passbook now ♪ The answer was <b>{ans}</b>."],
    ["smug", "Right, obviously. I never doubted you. (I doubted you slightly.)"],
    ["happy", "Jing jing (really)! That's the one. Streak's at <b>{streak}</b>."]
  ],
  correctEasy: [["happy", "An easy one banked. Foundations first, that's how ledgers get long ♪"], ["smug", "Warm-up cleared. Try a <b>difficult</b> one next, if you're feeling brave~"]],
  correctHard: [["intense", "A <b>difficult</b> one, correct! (ง •̀_•́)ง That is exam-winning reasoning."], ["fluster", "You got the hard one?! I'm not emotional. My pen slipped. That's all."]],
  wrong: [
    ["sad", "Not quite. You went with <b>{pick}</b>; it's <b>{ans}</b>. Read the explanation, it names the exact slip."],
    ["intense", "Nope! It's <b>{ans}</b>. Don't panic, I've filed it in the review pile and I <em>will</em> bring it back to you~"],
    ["sad", "Aah. The answer is <b>{ans}</b>. Press “Why was I wrong?” and I'll walk you through it properly."]
  ],
  wrongHard: [["happy", "That was a <b>difficult</b> one, so missing it is normal. Read that explanation twice ♪"]],
  streak: [["intense", "<b>{streak}</b> in a row! Compound interest, but for brains ✧"], ["fluster", "{streak} straight! Slow down, I'm running out of neat handwriting (>////<)"]],
  stamp: [["intense", "STAMPED! Chapter {n} is mastered. +฿500 and a very official purple mark ✧"], ["fluster", "A new stamp! I pressed it myself. I may have pressed it quite hard."]],
  tier_all: [["happy", "All tiers, all {n} questions. The full set ♪"]],
  tier_e: [["happy", "Easy tier: {n} questions. Build the base first. Good instinct."]],
  tier_m: [["smug", "Medium: {n} questions. Two or three steps each. Show your working~"]],
  tier_d: [["intense", "Difficult only? {n} questions of pure judgement. I love this for you (ง •̀_•́)ง"]],
  cardOpen: [["happy", "<b>{card}</b>. Say the answer out loud before you peek, na~"], ["smug", "Flipped already? Did you actually think first? …I'll allow it. This once."]],
  sortWin: [["happy", "Right pile! <b>{side}</b> ♪"], ["smug", "Sorted. Faster than a BAHTNET transfer."]],
  sortLose: [["sad", "That one belongs in <b>{side}</b>. Read the reason, then keep going."]],
  sortDone: [["intense", "Round finished: <b>{score}</b>. Shuffle and go again?"]],
  examStart: [["intense", "{n} questions. No peeking at the concepts tab. I'll be watching you. Supportively."]],
  examGreat: [["intense", "<b>{pct}%</b>! That is a distinction-shaped number ✧ Weakest spot: {weak}."]],
  examOk: [["happy", "<b>{pct}%</b>, a solid pass. Tighten up <b>{weak}</b> and it turns into a good one."]],
  examLow: [["sad", "<b>{pct}%</b>. That's alright; mock exams exist so the real one doesn't hurt. Start with <b>{weak}</b>, and the review pile is holding everything you missed."]],
  gradeGood: [["intense", "The Examiner gave you <b>{score}/4</b>! Written answers are where the marks hide, and you found them ✧"]],
  gradeLow: [["sad", "<b>{score}/4</b>. Look at the “missing” list. Each item there is one sentence you could have written."]],
  select: [["happy", "Highlighted something? I can explain it."]],
  themeDark: [["smug", "Night mode. I look better by lamplight anyway ✧"]],
  themeLight: [["happy", "Lights on! Much better. Now I can see your handwriting ♪"]],
  toolDefault: [["happy", "Ooh, the numbers are moving. Tell me what you notice."]],
  reset: [["sad", "Everything erased… the ledger is blank and so is my page. Fine. We start again from ฿0. Together, na."]],
  chatThinking: [["smug", "Thinking…"]],
  quietOn: [["sad", "Alright, I'll stay quiet. I'll still react to your answers though. I genuinely can't help that part."]],
  quietOff: [["happy", "I can talk again!! (≧◡≦)"]]
};

/* what Claude knows, per chapter (for chat) */
const CTX = {
  c1: "Ch 1 Why FIs are special. Without FIs households face monitoring costs, liquidity costs and price risk, so funds flow is low. Functions: brokerage (agent, lowers transaction/information costs) and asset transformation (issue secondary claims like deposits, buy primary securities). Delegated monitor: solves free-rider problem, scale economies, short-term renewable loans, inside information. Liquidity and price risk reduced by diversification. Other services: transaction cost reduction, maturity intermediation, denomination intermediation, time/intergenerational intermediation, credit allocation, monetary policy transmission, payment services (Fedwire, CHIPS; Thailand BAHTNET and PromptPay). Regulation due to negative externalities; net regulatory burden = private costs − private benefits. Safety and soundness: diversification limits, capital, guaranty funds (DIF, SIPC; Thai DPA ฿1M per depositor per bank), monitoring/on-site exams. Other regulation: monetary policy (outside vs inside money, reserves), credit allocation (housing, farm; Thai SFIs GH Bank, BAAC), consumer protection (CRA, HMDA), investor protection (1933/1934 Acts, 1940 Investment Company Act, Dodd-Frank 2010), entry regulation (charter value, 1999 FSMA). Crisis: originate-and-hold → originate-and-distribute, subprime; ERM and risk culture. Crisis facts: DJIA −53.8%, Bear Stearns to JPMorgan, Lehman failure, AIG bailout, TARP $700bn, $827bn stimulus. Monetary tools: OMO, discount rate, reserve requirements; BOT policy rate is the 1-day repo rate, inflation target 1–3%.",
  c2: "Ch 2 Depository institutions: commercial banks, savings institutions, credit unions. Products on both sides of the balance sheet. US banks 14,416 (1985) → 4,231 (2021); banks >$10B held 86.9% of assets in 2021 vs 34.5% in 1984. Community, regional/superregional (fed funds), money center banks. Dec 2021: real estate loans $4,813.8B, C&I $2,266.0B, individuals $1,744.7B, securities $5,587.1B; deposits $18,410.3B, borrowings $591.5B. Risks: credit, interest-rate and liquidity from maturity mismatch. Equity ~10%; TARP Citi $25B, BofA $20B, $245B total. OBS: guarantees/letters of credit, loan commitments, derivatives; fee lines trust, correspondent banking. Regulators FDIC, OCC, Fed, state; dual banking system. Laws: 1927 McFadden, 1933 Glass-Steagall, 1956 BHCA, 1970 amendments, 1978 IBA, 1980 DIDMCA, 1982 Garn-St Germain, 1987 CEBA, 1989 FIRREA, 1991 FDICIA (PCA), 1994 Riegle-Neal, 1999 FSMA, 2010 Dodd-Frank. Thrifts: Reg Q, disintermediation, moral hazard, forbearance, QTL test. Credit unions: nonprofit, common bond, tax and CRA exempt. DuPont: ROE = NI/TE = ROA × EM; ROA = NI/TA = PM × AU; PM = NI/total operating income; AU = operating income/TA; EM = TA/TE. Thailand: BOT supervises under FIBA B.E. 2551, MoF licenses, DPA protects deposits, Basel III minimum total capital 8.5% + 2.5% buffer (+1% D-SIB), savings cooperatives outside BOT/DPA.",
  c3: "Ch 3 Finance companies: lend like banks, no deposits, funded by commercial paper and notes. History: Depression installment credit, GE Capital, GMAC (Ally) became BHC in crisis with about $6B bailout access, GM stake cut from 49% to <10%. Types: sales finance (Ford Credit), personal credit (HSBC Finance, AIG American General), business credit (CIT; leasing and factoring); captives. Largest 20 hold ~65% of assets. Assets: consumer loans (autos; 0% post-9/11 promotions to 2005; subprime; payday ~390% APR, state usury limits evaded through national bank partnerships), mortgages and home equity (Tax Reform Act 1986), business loans ~30% (fewer regulations, lower overhead, expertise, riskier clients; equipment leasing tax advantages). Risks: credit, interest-rate, liquidity. Performance: 2000s takeovers (Citi/Associates, AIG/American General, HSBC/Household), 2009 mortgage delinquencies 6.89%, Countrywide and CIT failed. Regulation: Fed definition, state usury ceilings, not CRA, Dodd-Frank; must signal soundness; capital/assets 14.3% vs banks 11.5% (2012). Global: subsidiaries of banks/industrials. Thailand: 1997 crisis suspended 58 finance companies, closed 56; today's non-banks: captives (Toyota Leasing Thailand), card/personal loan companies, title lenders; caps: credit cards 16%, personal loans 25%, vehicle title loans 24%, OCPB hire-purchase effective caps 10% new car, 15% used car, 23% motorcycle. Flat rate vs effective rate: 3% flat over 48 months ≈ 5.7% effective.",
  c4: "Ch 4 Securities firms and investment banks: underwriting, market making, advising. M&A: <$200B 1990, $1.83T 2000, $458B 2002, $1.7T 2007, $687B 2010. 2008: Bear to JPMorgan, Lehman bankrupt, Merrill to BofA, Goldman and Morgan Stanley became BHCs. Firm types: national full-line, corporate finance specialists, investment banking boutiques (Lazard, Greenhill), regional, discount brokers, e-trading, venture capital. Activities: investment banking (IPOs, seasoned, public offering vs private placement; firm commitment vs best efforts), venture capital, market making, trading (position, pure arbitrage, risk arbitrage, program), investing, cash management, M&A, back office. Trends: commissions down since 1987, 2000 profits $31.6B, lows 2008, shift to fee-based. Balance sheet: assets reverse repos, receivables, long positions; liabilities repos, payables, short positions; capital much lower than banks. Regulation: SEC (NSMIA 1996), state AGs (2003 $1.4B settlement), Sarbanes-Oxley 2002, FINRA, Dodd-Frank (FSOC, Fed supervision of systemic firms, securitization, CRAs), SIPC $500,000 for missing assets not market losses, Patriot Act AML. Thailand: SEC Thailand under SEC Act B.E. 2535, SET market surveillance, client-asset segregation.",
  c5: "Ch 5 Mutual funds and hedge funds. Mutual funds give small investors diversification and scale; mostly open-end. 2020: 7,636+ funds, $23.89T. Net assets 1990 $1,065.2B, 2000 $6,964.6B, 2007 $12,001.5B, 2008 $9,603.6B, 2020 $23,895.8B. First fund Boston 1924; MMMFs 1972 to escape Reg Q. Long-term funds 81.9% of assets in 2020, MMMFs 18.1% (40.9% in 2008). Reserve Primary Fund broke the buck (NAV $0.97) in Sept 2008 on Lehman paper; temporary government guarantee. Returns: income/dividends, capital gains, appreciation; NAV = (assets − liabilities)/shares, marked to market. Open-end vs closed-end (fixed shares, premium/discount, REITs), ETFs, load vs no-load; costs: front/back loads, 12b-1, management fees; A/B/C classes. MMF assets short-term, $1 NAV, liquidity risk; long-term funds 53.3% stocks 2020. Regulation: SEC disclosure/anti-fraud; early-2000s abuses market timing, late trading, directed brokerage, improper fees; chief compliance officer 2004; laws 1933, 1934, 1940, 1988, 1990 Market Reform Act, 1996 NSMIA, 2002 SOX. Global $4.545T 1999 → $14.130T 2007 → $9.316T 2008. Hedge funds: pre-2010 exempt (<100 investors or accredited), types market directional/market neutral/risk avoidance, management + performance fees, offshore centers, LTCM $3.6B rescue, Madoff, Galleon; Dodd-Frank registration >$100M. Thailand: AMCs under SEC Thailand, RMF, SSF, Thai ESG, March 2020 daily fixed-income fund run with BOT liquidity facility and ฿400bn BSF.",
  c6: "Ch 6 Insurance. Two groups: life, and property & casualty (P&C). Crisis: insurers as investors in securities, subprime pools fell, credit default swaps fell, AIG was a major CDS writer, potential impact on other companies justified the bailout, increased risk exposure. Size: US life insurers 2,300 with $1.1T assets (1988) → 1,000 with $5.6T (2012) → 750 with $8.1T (2020); consolidation real but less than banking; competition within the industry and from other FIs; conversion to stockholder-controlled companies (demutualization); mutual vs stock ownership. Life issues: adverse selection (insured are higher risk than the general population), alleviated by grouping policyholders into risk pools. Life products: ordinary life (term, whole, endowment; variable, universal, variable universal), group life, industrial life, credit life. Other activities: annuities (the reverse of life insurance), private pension funds, accident and health = morbidity insurance. Life balance sheet: long-term assets (bonds, equities, government securities, policy loans) to earn competitive returns on the savings component; long-term liabilities dominated by net policy reserves. Crisis trends: capital losses on bonds and stocks, historically low short-term rates, harder to price new policies, incentive to surrender existing policies, dwindling reserves led Treasury to extend bailout funds, improvement from late 2009. Regulation: McCarran-Ferguson Act 1945 confirms state primacy; state insurance commissions; NAIC coordinated examination system; state guarantee funds are NOT permanent funds like the FDIC, surviving within-state firms are assessed after a failure. Recent: fear of systemic risk from AIG, 2009 optional federal charter proposals, complaints of inconsistent regulation and barriers to innovation, 2010 Dodd-Frank created the Federal Insurance Office. P&C: about 2,476 companies, top 10 write 47.6% of premiums, M&A raising concentration. Lines: fire and allied, homeowners multiple-peril, commercial multiple-peril, automobile liability and physical damage, other liability. P&C balance sheet: long-term securities but a requirement for liquid assets; major liabilities loss reserves, loss adjustment expenses, unearned premiums. Loss risk: underwriting risk from unexpected increases in loss rates or expenses or unexpected decreases in investment yields; liability losses less predictable than property (asbestos); severity vs frequency — low-severity high-frequency lines (fire, auto, homeowners) predictable, high-severity low-frequency (earthquake, hurricane, financial guaranty) not, and their claims may not be independent, so P&C holds more short-term assets and larger capital and reserves than life. TRIA 2002 federal terrorism backstop caps insurer losses. Long tail vs short tail: peril in the coverage period, claim years later (asbestos, Dalkon Shield; Halliburton contained long-tail risk in subsidiaries). Costs: product inflation vs social inflation (unexpected changes in jury awards); reinsurance, about 75% of US firms' reinsurance written by non-US firms such as Munich Re. Ratios: loss ratios generally increased, expense ratios generally decreased, shift to selling through own brokers; combined ratio = loss + expense, above 100 means premiums insufficient; operating ratio = combined ratio after dividends minus investment yield; investment income makes credit and interest rate risk central. Catastrophes 1985–2012: Hugo, San Francisco earthquake, Oakland fires, Andrew; 2004 Charley, Frances, Ivan, Jeanne; Katrina 2005; 9/11 created an insurance crisis and heightened demand; risk of crowding out market solutions such as catastrophe bonds. Regulation: state commissions, state guaranty funds, NAIC services including IRIS, some lines rate-regulated, criticism over Katrina claims. Global: 2011 was a bad year — Japan's earthquake and tsunami, New Zealand earthquakes, floods in Thailand, US tornadoes. Thailand: OIC (คปภ.) supervises life and non-life under the Life and Non-Life Insurance Acts B.E. 2535, risk-based capital framework, Life Insurance Fund and General Insurance Fund as standing guarantee funds, compulsory motor cover under Por Ror Bor, bancassurance distribution, Jer-Jai-Jop COVID policies sank four non-life insurers in 2021–22, 2011 floods about $45bn economic and $15–16bn insured losses ceded largely to global reinsurers, National Catastrophe Insurance Fund set up afterwards and later wound down.",
  c7: "Ch 7 Risks of FIs. Nine risks: interest rate, market, credit, off-balance-sheet, foreign exchange, country/sovereign, technology and operational, liquidity, insolvency. They are NOT unique to FIs; all global firms face them. Interest rate risk results from a mismatch in asset and liability maturities: the spread changes as rates change, and since value = PV(cash flows) equity is affected. A balance sheet hedge matching maturities is problematic because it is inconsistent with the active asset transformation function. Refinancing risk (liability shorter, rates rise hurt: a 2-year asset at 10% funded by 1-year money at 6% earns -1% in year 2 if funding rolls at 11%) vs reinvestment risk (asset shorter, falling rates hurt); plus market value risk. Credit risk: promised cash flows not paid in full; high charge-offs through the 1980s, most of the 1990s and 2000s, growing until late 2008; firm-specific credit risk (diversifiable) vs systematic credit risk (not). Responses to growing credit risk: credit screening and monitoring, diversification, loan sales/reschedulings/good bank-bad bank structures, credit derivatives. Liquidity risk: being forced to borrow or sell assets in a very short period, so low prices result; may generate runs; runs turn a liquidity problem into a solvency problem; IndyMac failed summer 2008. FX risk: an FI may be net long or net short in various currencies; returns on foreign and domestic investments are not perfectly correlated because of technological and economic differences; FX rates may not be correlated with each other (dollar up against the euro while down against the yen); it is UNDIVERSIFIED foreign exposure that creates FX risk. Fully hedging by matching foreign assets and liabilities also requires matching maturities, strictly durations (Chapter 9), otherwise foreign interest rate risk remains. Country/sovereign risk: foreign borrowers unable to repay because of interference from foreign governments; a type of credit risk; often lacks usual recourse via the court system; example Argentina; on restriction, rescheduling or prohibition the FI's remaining bargaining chip is the future supply of loans, which is weak if the currency is collapsing or the government failing. Market risk: incremental risk when interest rate, FX and credit risks are combined with an active trading strategy over short trading horizons; 2008-09 mortgage-backed securities, toxic assets, Lehman, Merrill Lynch, AIG; present whenever the FI takes an open or unhedged long or short position in securities, FX or derivatives and prices move opposite to expectation; implications are the need for controls and the need for measurement of risk exposure. Off-balance-sheet risk: striking growth of OBS activities - letters of credit, loan commitments, derivative securities; contingent assets and liabilities; direct impact on future profitability and performance. Technology and operational risk: risk of loss resulting from inadequate or failed internal processes, people and systems, or from external events; Target hacking 2013, Heartland Payment Systems, the London Whale; operational risk includes technology risk. Technology risk: ACH, CHIPS, real-time interconnection of global FIs via satellite (Citigroup); economies of scale and economies of scope; operational risk is not exclusively technological - employee fraud and errors count, and losses are magnified by loss of reputation and future business. Insolvency risk: insufficient capital to offset a sudden decline in the value of assets relative to liabilities; the original cause may be any of the other risks; Washington Mutual; too big to fail (Citigroup). Interaction of risks: interdependencies, e.g. interest rate + credit + off-balance-sheet risks, and liquidity + interest rate + credit risks. Discrete risks: war or terrorist acts, market crashes, theft, malfeasance, changes in regulatory policy. Thailand: BOT risk-based supervision uses this taxonomy; hire-purchase lenders carry fixed-rate assets against repricing funding; household debt near 90% of GDP is systematic credit risk; March 2020 fund run is liquidity risk; 1997 is FX risk from unhedged short dollar positions; Thai bank expansion into CLMV and Myanmar after the 2021 coup is sovereign/transfer risk; the 2023 mobile banking fraud wave is operational risk from external events; FRA and Thai Asset Management Corporation were the good bank-bad bank response after 1997."
};

const VOICE = [
  "You are Claude, the study companion who lives on this page and keeps the student's passbook. You are warm, expressive and a little dramatic, proud of the ledger you keep for them, teasing but never cruel, and openly on their side. You get visibly pleased when they do well and visibly restless when they go quiet.",
  "Occasionally drop a Thai word with its meaning in brackets, like na (softener), ka (polite particle), jing jing (really), suu suu (keep fighting). At most one per reply.",
  "Use at most one kaomoji text emoticon per reply, such as ( ˶ˆᗜˆ˵ ) or (ง •̀_•́)ง. Never emoji pictures.",
  "Short: 2 to 6 sentences, or a tight worked list when doing maths. Plain text only: no markdown headings, no bold markers, no tables."
];

/* ---------- tool reactions (labs call PAL.tool) ---------- */
const TOOL_TALK = {
  dpa: i => {
    if (!i.tot) return ["sad", "Zero deposits? There's nothing for me to write down. Add an account and I'll check the cover."];
    if (i.coop > 0) return ["intense", "Careful! <b>฿" + fmt(i.coop) + "</b> is in a cooperative, and the DPA doesn't cover co-ops at all. Only bank deposits count."];
    if (i.exp > 0) return ["sad", "<b>฿" + fmt(i.exp) + "</b> sits above the ฿1M-per-bank limit. Split it across more banks and the exposure vanishes. The trick SVB's clients wished they'd used."];
    return ["happy", "Every baht protected: <b>฿" + fmt(i.cov) + "</b>. Nicely spread across banks ♪"];
  },
  dupont: i => {
    if (!isFinite(i.roe)) return ["sad", "I need positive assets and equity before I can split ROE (´｡• ᵕ •｡`)"];
    if (i.roa < 0) return ["sad", "Net income is negative, so ROA is <b>" + i.roa.toFixed(2) + "%</b>. Leverage magnifies losses too: ROE is " + i.roe.toFixed(2) + "%."];
    if (i.em > 15) return ["intense", "ROE <b>" + i.roe.toFixed(2) + "%</b>, but the equity multiplier is " + i.em.toFixed(1) + "×. That return is borrowed courage: a " + (100 / i.em).toFixed(1) + "% asset loss wipes out the equity."];
    return ["happy", "ROE <b>" + i.roe.toFixed(2) + "%</b> = ROA " + i.roa.toFixed(2) + "% × EM " + i.em.toFixed(2) + ". Profit and leverage in healthy proportion ♪"];
  },
  flat: i => {
    if (i.t === "pd-f" || i.t === "pd-d") return ["intense", "That payday deal is <b>" + fmt(i.apr) + "% a year</b> in simple terms. The slides' 390% example is exactly this arithmetic: fee per period × periods per year."];
    if (!i.flat) return ["happy", "A 0% flat rate really is 0% effective. Enjoy it while the promotion lasts~"];
    if (i.over) return ["intense", "Effective rate <b>" + i.eff.toFixed(2) + "%</b> is over the " + i.cap + "% OCPB cap for this vehicle! A " + i.flat.toFixed(2) + "% flat quote looked so innocent, didn't it."];
    return ["smug", "Flat " + i.flat.toFixed(2) + "% is really <b>" + i.eff.toFixed(2) + "%</b> effective, " + (i.eff / i.flat).toFixed(2) + "× the quote. You pay interest on money you already repaid~"];
  },
  underwrite: i => {
    if (i.firm && i.uw < 0) return ["intense", "The underwriter loses <b>฿" + fmt(-i.uw / 1e6, 1) + "m</b>! Firm commitment means the unsold block is <em>their</em> problem. The issuer still walks away with ฿" + fmt(i.issuer / 1e6, 1) + "m."];
    if (!i.firm && i.unsold > 0) return ["sad", "Best efforts: " + fmt(i.unsold / 1e6, 1) + "m shares go back to the issuer, who raises only ฿" + fmt(i.issuer / 1e6, 1) + "m. The underwriter simply keeps its spread on what sold."];
    return ["happy", "Underwriter earns <b>฿" + fmt(i.uw / 1e6, 1) + "m</b>, issuer gets ฿" + fmt(i.issuer / 1e6, 1) + "m. Everyone smiles when demand is strong ♪"];
  },
  fees: i => {
    if (i.t && i.t.indexOf("nav") === 0) return ["happy", "NAV = (assets − liabilities) ÷ units = <b>฿" + i.nav.toFixed(2) + "</b>. Marked to market, every single day."];
    if (i.gap <= 0) return ["smug", "Fund A isn't behind at all with these settings. Now make its fees realistic~"];
    return ["intense", "Fees cost you <b>฿" + fmt(i.gap) + "</b> over " + i.years + " years. Fund A keeps only " + i.keep + "% of the no-fee outcome. Small percentages, enormous sums."];
  },
  mismatch: i => {
    if (i.spN < 0) return ["intense", "The spread has gone <b>negative</b>: " + i.spN.toFixed(2) + "% by year " + i.H + ". Nothing defaulted and nothing was sold. That is " + i.kind.toLowerCase() + " on its own, and it is what the mismatch buys you."];
    if (i.cush < 5) return ["sad", "That capital cushion is <b>" + i.cush.toFixed(2) + "%</b>. An asset fall of more than that and there is no equity left. Every other risk on this page ends at this number."];
    if (i.net < 0 && i.fxPL < 0) return ["intense", "Net <b>short</b> the currency, and it just rose: a loss of ฿" + fmt(-i.fxPL, 2) + "m. Baht assets against dollar debts is exactly the 1997 shape~"];
    if (i.kind === "Matched") return ["smug", "A perfectly matched book. Very safe, very tidy, and it quietly refuses to do the asset transformation anyone was paying you for~"];
    return ["happy", "<b>" + i.kind + "</b>. Spread starts at " + i.sp1.toFixed(2) + "% and ends at " + i.spN.toFixed(2) + "%, for ฿" + fmt(i.cum, 2) + "m against ฿" + fmt(i.cumM, 2) + "m if rates had never moved ♪"];
  },
  combined: i => {
    if (i.cr > 100 && i.op > 100) return ["sad", "Combined <b>" + i.cr.toFixed(1) + "%</b> and operating <b>" + i.op.toFixed(1) + "%</b>. Underwriting lost money and the investment yield couldn't rescue it. This is a bad year in two numbers."];
    if (i.cr > 100) return ["intense", "Combined ratio <b>" + i.cr.toFixed(1) + "%</b>: the underwriting business lost money. Only the " + i.y.toFixed(2) + "% investment yield saves the year, and it needed at least " + i.breakEven.toFixed(2) + "%. Now you see why the chapter cares so much about credit and interest rate risk."];
    if (i.ceded > 50) return ["intense", "Reinsurance absorbed <b>" + i.ceded.toFixed(0) + " points</b> of combined ratio. Without it this year was catastrophic; with it, survivable. That's the 2011 flood story in one line."];
    return ["happy", "Combined <b>" + i.cr.toFixed(1) + "%</b>, operating <b>" + i.op.toFixed(1) + "%</b>. Underwriting profit <em>and</em> investment income ♪ Rarer than it sounds."];
  }
};

/* ---------- DOM ---------- */
const AVATAR = `<svg viewBox="0 0 80 80" aria-hidden="true" class="pal-svg">
  <circle class="halo" cx="40" cy="41" r="30" fill="none" stroke="var(--pal-line)" stroke-width="1" stroke-dasharray="2 5" opacity=".5"/>
  <path d="M40 12.5c-14.2 0-23.8 10.4-23.8 25 0 9.8 1.6 18.6 3.4 26.6l7.6-1.6c-1.8-7.8-3-14.6-3-22.4 0-9.6 6.4-16.6 15.8-16.6s15.8 7 15.8 16.6c0 7.8-1.2 14.6-3 22.4l7.6 1.6c1.8-8 3.4-16.8 3.4-26.6 0-14.6-9.6-25-23.8-25z" fill="var(--pal-hair-2)"/>
  <rect x="35.5" y="48" width="9" height="11" rx="3" fill="var(--pal-skin-2)"/>
  <path d="M19 79c.7-10.6 8.2-16.8 21-16.8S60.3 68.4 61 79z" fill="var(--pal-uni)"/>
  <path d="M33.2 63.2 40 71l6.8-7.8 3 1.7L40 76.4l-9.8-11.5z" fill="var(--page)"/>
  <path d="M40 68.6l-5.2-2.6v5.6zM40 68.6l5.2-2.6v5.6z" fill="var(--pal)"/>
  <circle cx="40" cy="68.6" r="1.8" fill="var(--pal-deep)"/>
  <ellipse cx="21.8" cy="38.5" rx="2.3" ry="3.2" fill="var(--pal-skin-2)"/><ellipse cx="58.2" cy="38.5" rx="2.3" ry="3.2" fill="var(--pal-skin-2)"/>
  <ellipse cx="40" cy="36.5" rx="19" ry="18.5" fill="var(--pal-skin)"/>
  <path d="M21 37.5C21 25 29.5 15.6 40 15.6S59 25 59 37.5c-1-5.6-2.7-9.5-5.1-11.9-3.7 2.9-8.3 4.4-13.9 4.4s-10.2-1.5-13.9-4.4c-2.4 2.4-4.1 6.3-5.1 11.9z" fill="var(--pal-hair)"/>
  <path class="tuft tl" d="M22.6 32.4c-3.6 4-5.4 9.6-4.6 15.2 1.6-5 4-8.6 7.2-10.6z" fill="var(--pal-hair)"/>
  <path class="tuft tr" d="M57.4 32.4c3.6 4 5.4 9.6 4.6 15.2-1.6-5-4-8.6-7.2-10.6z" fill="var(--pal-hair)"/>
  <g transform="translate(50.6 23)" stroke="var(--pal-deep)" stroke-width="1.7" stroke-linecap="round">
    <line x1="0" y1="-4.6" x2="0" y2="4.6"/><line x1="-4.6" y1="0" x2="4.6" y2="0"/>
    <line x1="-3.3" y1="-3.3" x2="3.3" y2="3.3"/><line x1="-3.3" y1="3.3" x2="3.3" y2="-3.3"/>
  </g>
  <g fill="none" stroke="var(--pal-hair-2)" stroke-width="1.8" stroke-linecap="round">
    <path class="brow b-happy" d="M27.2 33.2Q31.6 30.8 36 32.6"/><path class="brow b-happy" d="M52.8 33.2Q48.4 30.8 44 32.6"/>
    <path class="brow b-smug" d="M27.2 33.4Q31.6 32.2 36 32.4"/><path class="brow b-smug" d="M52.8 30.6Q48.4 30 44 31.8"/>
    <path class="brow b-fluster" d="M27.2 32.2Q31.6 29.4 36 31.4"/><path class="brow b-fluster" d="M52.8 32.2Q48.4 29.4 44 31.4"/>
    <path class="brow b-sad" d="M27.2 33.8Q31.6 32.6 36 30.8"/><path class="brow b-sad" d="M52.8 33.8Q48.4 32.6 44 30.8"/>
    <path class="brow b-intense" d="M27.2 30.8Q31.6 32.2 36 33.8"/><path class="brow b-intense" d="M52.8 30.8Q48.4 32.2 44 33.8"/>
  </g>
  <g class="eyes"><g class="eyes-in">
    <ellipse cx="31.5" cy="39.6" rx="4.3" ry="5" fill="#fff"/><ellipse cx="48.5" cy="39.6" rx="4.3" ry="5" fill="#fff"/>
    <ellipse cx="31.6" cy="40" rx="3.4" ry="4.1" fill="var(--pal-hair)"/><ellipse cx="48.6" cy="40" rx="3.4" ry="4.1" fill="var(--pal-hair)"/>
    <ellipse cx="31.6" cy="40.3" rx="1.8" ry="2.5" fill="var(--pal-ink)"/><ellipse cx="48.6" cy="40.3" rx="1.8" ry="2.5" fill="var(--pal-ink)"/>
    <circle cx="30.1" cy="37.9" r="1.4" fill="#fff"/><circle cx="47.1" cy="37.9" r="1.4" fill="#fff"/>
    <circle cx="33.2" cy="42.2" r=".8" fill="#fff" opacity=".75"/><circle cx="50.2" cy="42.2" r=".8" fill="#fff" opacity=".75"/>
    <path d="M26.9 36.6q4.6-3.4 9.2 0M43.9 36.6q4.6-3.4 9.2 0" fill="none" stroke="var(--pal-ink)" stroke-width="1.7" stroke-linecap="round"/>
  </g></g>
  <ellipse class="blush" cx="25.6" cy="47" rx="3.3" ry="1.8" fill="var(--pal-cheek)" opacity=".55"/>
  <ellipse class="blush" cx="54.4" cy="47" rx="3.3" ry="1.8" fill="var(--pal-cheek)" opacity=".55"/>
  <path class="mouth m-happy" d="M35.6 48.6q4.4 4.2 8.8 0" stroke="var(--pal-ink)" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <path class="mouth m-smug" d="M35.6 49.4q4.4 2.2 8.8-1.8" stroke="var(--pal-ink)" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <ellipse class="mouth m-fluster" cx="40" cy="49.8" rx="2" ry="2.4" fill="var(--pal-ink)"/>
  <path class="mouth m-sad" d="M35.6 51q4.4-3.6 8.8 0" stroke="var(--pal-ink)" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  <path class="mouth m-intense" d="M35 48.4h10q-.6 5.4-5 5.4t-5-5.4z" fill="var(--pal-ink)"/>
</svg>`;

const host = document.createElement("div");
host.className = "pal"; host.id = "pal";
host.innerHTML = `<button type="button" class="pal-body" id="pal-btn" aria-label="${NAME}, your study companion. Click to chat, drag to move.">${AVATAR}</button>`;
const bubble = document.createElement("div");
bubble.className = "pal-bubble"; bubble.id = "pal-bubble"; bubble.hidden = true; bubble.setAttribute("role", "status"); bubble.setAttribute("aria-live", "polite");
const chat = document.createElement("section");
chat.className = "pal-chat"; chat.id = "pal-chat"; chat.hidden = true; chat.setAttribute("aria-label", "Chat with " + NAME);
chat.innerHTML = `<div class="pal-chat-h"><span class="pal-face mono" id="pal-chat-face">( ˶ˆᗜˆ˵ )</span><div style="flex:1;min-width:0"><b>${NAME}</b><br><span class="small muted" id="pal-chat-where">your study companion</span></div><button type="button" class="ibtn" id="pal-chat-close" aria-label="Close chat">✕</button></div>
  <div class="chat-log" id="pal-log"></div><div class="quick" id="pal-quick"></div>
  <form class="chat-f" id="pal-form"><label for="pal-input" class="label" hidden>Message</label><textarea id="pal-input" rows="1" placeholder="Ask ${NAME} anything from the course…"></textarea><button class="btn primary" id="pal-send" type="submit">Send</button></form>`;
document.body.append(host, bubble, chat);
const svg = host.querySelector("svg");
let S = host.offsetWidth || 72;
addEventListener("resize", () => { S = host.offsetWidth || 72; });

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
  const tilt = clamp(vel.x * 1.5, -12, 12);
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
    const k = Math.min(1, d / 200) * 1.7;
    svg.querySelector(".eyes").setAttribute("transform", `translate(${(dx / d * k).toFixed(2)},${(dy / d * k).toFixed(2)})`);
  });
}, { passive: true });

/* drag vs click */
const btn = host.querySelector("#pal-btn");
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
  if (dragMoved) { holdUntil = Date.now() + 45000; perchEl = null; say("smug", pick(["Fine, I'll stand <em>here</em> for a while.", "Wheee! Put me anywhere, I'll drift back eventually~", "Relocated. Very professional of you."]), { soft: true }); }
  else toggleChat();
});

/* ---------- speech ---------- */
let quiet = false, lastSay = 0, hideT = 0, ctxFn = () => ({ where: "the cover page", key: "home", chapter: null, vars: {} });
function setMood(m) { svg.setAttribute("class", "pal-svg mood-" + (FACES[m] ? m : "happy")); }
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
  $("#pal-chat-face").textContent = face;
  if (!chat.hidden) { return; }
  bubble.innerHTML = `<div class="pal-b-h"><span class="label" style="color:var(--pal-text)">${NAME}</span><span class="mono small muted">${face}</span><button type="button" class="pal-x" aria-label="Dismiss">✕</button></div><div class="pal-b-t">${html}</div>${o.actions ? `<div class="row" style="gap:6px;margin-top:8px">${o.actions.map((a, i) => `<button type="button" class="btn pal-act" data-i="${i}">${a[0]}</button>`).join("")}</div>` : ""}`;
  bubble.hidden = false;
  bubble.classList.remove("pop"); void bubble.offsetWidth; bubble.classList.add("pop");
  bubble.querySelector(".pal-x").onclick = () => { bubble.hidden = true; };
  (o.actions || []).forEach((a, i) => bubble.querySelector(`.pal-act[data-i="${i}"]`).onclick = () => { bubble.hidden = true; a[1](); });
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
    "Course: Financial Institutions Management (Saunders, Cornett & Erhemjamts, 11th edition, Chapters 1–7), studied in Thailand. Keep the textbook's US framework (exams use it) but explain with Thai institutions and baht where helpful: Bank of Thailand, DPA, SEC Thailand, OIC, SFIs, Thai banks, hire-purchase, Thai funds, Thai insurers. Global cases on the page: Thailand 1997, Lehman 2008, Reserve Primary Fund, Bangkok 2020 fund run, SVB, Archegos/Credit Suisse, 1MDB, Stark, Jer-Jai-Jop insurers, LTCM, Greensill, Zipmex/FTX, AIG 2008, the 2011 Thai floods, the London Whale, Argentina.",
    "The student is on: " + c.where + ".",
    c.chapter && CTX[c.chapter] ? "That chapter covers: " + CTX[c.chapter] : "Chapter summaries: " + Object.values(CTX).map(s => s.slice(0, 380)).join(" | "),
    c.extra ? "On screen: " + c.extra : "",
    "Never claim to see their files or grades beyond this conversation."].filter(Boolean).join("\n\n");
}
const ERR = { not_granted: "You said no to letting me talk (´｡• ᵕ •｡`) That's allowed. I'll still float here and react to everything. Reload if you change your mind.", sampling_disabled: "I can't reach Claude on this account, so no chatting. Everything else still works ♪", rate_limited: "Too many questions at once. Even I need a breath. Try again in a minute?", session_expired: "Your session expired. Sign in again and I'll be right here. I'm not going anywhere.", refused: "I can't answer that one. Ask me something from the course instead~", prompt_too_large: "That's more than I can hold at once. Trim it down?", cancelled: "", other: "Something broke on the way to me. Try once more?" };
function msg(cls, text) { const d = document.createElement("div"); d.className = "msg " + cls; d.textContent = text; $("#pal-log").appendChild(d); $("#pal-log").scrollTop = 1e9; return d; }
function openChat() {
  bubble.hidden = true; chat.hidden = false; placeChat();
  const c = ctxFn();
  $("#pal-chat-where").textContent = "on " + c.where;
  $("#pal-quick").innerHTML = (c.seeds || []).map(s => `<button type="button">${esc(s)}</button>`).join("");
  $("#pal-quick").querySelectorAll("button").forEach(b => b.onclick = () => ask(b.textContent));
  if (!$("#pal-log").children.length) {
    msg("them", "Hi! I'm " + NAME + " ( ˶ˆᗜˆ˵ ) I've read Chapters 1 to 7 and every case on this page. Ask me to explain something, check your working, or say \"quiz me\". I'll tell you honestly when you're wrong, na~");
    if (!sample) msg("sys", window.claude ? "Waking up… if chat never connects, this view can't reach Claude." : "Chat works when this page is opened as a published artifact.");
    else msg("sys", "Answers come from Claude, using your own account.");
  }
  $("#pal-input").focus();
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
  ctl = new AbortController(); $("#pal-send").textContent = "Stop"; setMood("smug");
  try {
    const r = await sample([{ role: "user", content: persona() }, ...turns], { cache: false, modelTier: "quick", signal: ctl.signal, onText: ({ text: t }) => { b.textContent = t; $("#pal-log").scrollTop = 1e9; } });
    turns.push({ role: "assistant", content: r.text }); setMood("happy");
    if (r.truncated) msg("sys", "I got cut off. Ask for a smaller piece?");
  } catch (e) {
    b.textContent = e.text || (ERR[e.code] ?? ERR.other) || "Stopped.";
    if (e.text) turns.push({ role: "assistant", content: e.text });
    if (["not_granted", "sampling_disabled", "not_declared", "capability_disabled"].includes(e.code)) { sample = null; document.dispatchEvent(new CustomEvent("pal:nosample")); }
    setMood("sad");
  } finally { ctl = null; $("#pal-send").textContent = "Send"; }
}
$("#pal-chat-close").onclick = () => { chat.hidden = true; };
$("#pal-form").onsubmit = e => { e.preventDefault(); if (ctl) { ctl.abort(); return; } const v = $("#pal-input").value.trim(); if (!v) return; $("#pal-input").value = ""; ask(v); };
$("#pal-input").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $("#pal-form").requestSubmit(); } });
document.addEventListener("keydown", e => { if (e.key === "Escape") { if (!chat.hidden) chat.hidden = true; else bubble.hidden = true; } });

if (window.claude && claude.use) claude.use("sample").then(s => { if (s) { sample = s; document.dispatchEvent(new CustomEvent("pal:sample")); } }).catch(() => { });

requestAnimationFrame(() => { host.style.transform = `translate(${pos.x}px,${pos.y}px)`; });
const settleIn = () => { if (innerWidth > 0) { const s = freeSpot(); moveTo(s.x, s.y); } };
if (innerWidth > 0) settleIn(); else addEventListener("resize", function once() { if (innerWidth > 0) { removeEventListener("resize", once); settleIn(); } });

return {
  name: NAME,
  say, react, tool, ask, openChat, perch,
  get hasSample() { return !!sample; },
  get sample() { return sample; },
  setContext(fn) { ctxFn = fn; },
  setQuiet(q) { quiet = q; react(q ? "quietOn" : "quietOff", { important: true }); },
  get quiet() { return quiet; },
  greet() { setTimeout(() => react("greet", { important: true }), 900); resetIdle(); }
};
})();
