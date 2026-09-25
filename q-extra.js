/* Exam-prep set: extra conceptual questions and written answers per chapter. Appended last, never reordered. */
(() => {
const mcq = (id, more) => FI.extend(id, "", [], more.map(q => Object.assign({ t: "mcq", src: "Exam" }, q)));
const sa = (id, more) => FI.extend(id, "", [], more.map(q => Object.assign({ t: "sa", src: "Written" }, q)));

/* ---------- Chapter 1 ---------- */
mcq("c1", [
  { tier: "e", q: "Which pair correctly separates an FI's two core functions?",
    o: ["Brokerage: the FI holds the risk; asset transformation: the FI acts as agent", "Brokerage: the FI acts as an agent and cuts information costs without holding a position; asset transformation: the FI issues its own claims and buys primary securities", "Both mean lending to households", "Brokerage is regulation; asset transformation is monetary policy"], a: 1,
    x: "A securities firm executing your order is a broker. A bank taking your deposit and lending it out has transformed the asset: your claim is on the bank, not on the borrower." },
  { tier: "m", q: "Why does delegated monitoring solve a free-rider problem?",
    o: ["Because regulators do the monitoring", "Because when thousands of small lenders each hope someone else will check the borrower, nobody does; one FI holding a large loan has the incentive and the scale to do it", "Because borrowers monitor themselves", "Because deposit insurance removes the need"], a: 1,
    x: "Concentrating the claim in one lender aligns the incentive with the cost of monitoring, and short-term renewable loans give the FI ongoing control." },
  { tier: "m", q: "Net regulatory burden is best described as:",
    o: ["The total cost of complying with regulation", "The private costs of regulation to the FI minus the private benefits it receives, such as deposit insurance and lender-of-last-resort access", "The fines paid in a year", "The capital ratio minus the minimum"], a: 1,
    x: "Regulation is justified by the negative externalities of FI failure, and the burden is net because FIs also receive valuable protections." },
  { tier: "d", q: "The move from originate-and-hold to originate-and-distribute weakened which of the special functions in Chapter 1?",
    o: ["Payment services", "Delegated monitoring: a lender that sells the loan on has little incentive to screen or monitor the borrower carefully", "Denomination intermediation", "Maturity intermediation"], a: 1,
    x: "Subprime originators were paid on volume and passed the credit risk into securitisations. The monitoring incentive that makes FIs special was priced out of the chain." },
  { tier: "e", q: "Which is an example of credit allocation regulation in Thailand?",
    o: ["The DPA's ฿1 million limit", "GH Bank and BAAC, specialised financial institutions mandated to lend to housing and farming", "The SEC's disclosure rules", "The BOT's policy rate"], a: 1,
    x: "Credit allocation directs lending to socially important sectors. The US equivalents in the slides are housing and farm credit programmes." },
  { tier: "d", q: "Why does the textbook say a world without FIs would have a low flow of funds even if savers and borrowers wanted to deal?",
    o: ["Because governments would ban direct lending", "Because monitoring costs, liquidity costs and price risk make direct claims unattractive to savers, so households hold cash and firms cannot raise enough", "Because interest rates would be zero", "Because there would be no payment system"], a: 1,
    x: "The three costs are the foundation of the chapter. Every special service an FI provides can be traced back to reducing one of them." }
]);
sa("c1", [
  { tier: "m", q: "Explain the difference between an FI acting as a broker and an FI acting as an asset transformer, with one Thai example of each.",
    points: [
      { p: "Broker: acts as agent, reduces transaction and information costs, holds no position", kw: ["agent", "broker", "no position", "transaction cost", "information cost", "commission"] },
      { p: "Asset transformer: issues its own secondary claims (deposits, policies) and buys primary securities (loans, bonds)", kw: ["own claim", "secondary", "primary", "issues? deposit", "transform", "its own"] },
      { p: "Thai broker example: a securities company executing SET orders", kw: ["securities compan", "SET", "order", "broker"] },
      { p: "Thai transformer example: a bank taking deposits and lending to firms", kw: ["deposit", "bank", "lend", "loan"] }
    ],
    model: "As a broker the FI acts as an agent: it matches savers and borrowers, reducing transaction and information costs, but holds no position itself, like a securities company executing a client's SET order for a commission. As an asset transformer the FI issues its own secondary claims, such as deposits, and uses the money to buy primary securities such as loans, like Kasikornbank taking savings deposits and lending them to an SME. The saver's claim is on the bank, not the borrower." },
  { tier: "d", q: "Why are FIs regulated more heavily than other firms? Name the justification and two safety-and-soundness tools, one US and one Thai.",
    points: [
      { p: "Negative externalities: an FI failure harms depositors, borrowers and the payment system, not just shareholders", kw: ["externalit", "spill", "harm(s)? (other|third|depositor|the system)", "contagion", "systemic"] },
      { p: "Capital requirements or diversification limits as a safety-and-soundness tool", kw: ["capital", "diversif", "concentration limit", "single borrower"] },
      { p: "Guaranty fund: FDIC/DIF in the US", kw: ["FDIC", "DIF", "deposit insurance", "guarant"] },
      { p: "Thai equivalent: DPA ฿1 million per depositor per bank, with BOT on-site examination", kw: ["DPA", "1 million", "Deposit Protection", "BOT", "Bank of Thailand", "examin"] }
    ],
    model: "FIs are special because their failure creates negative externalities: depositors lose access to money, borrowers lose credit lines and the payment system is disrupted, so the cost falls on society rather than only on shareholders. Safety-and-soundness regulation therefore imposes capital requirements and diversification limits, and provides guaranty funds: the FDIC's insurance fund in the US and the DPA's ฿1 million per depositor per bank cover in Thailand, backed by Bank of Thailand examination and monitoring." }
]);

/* ---------- Chapter 2 ---------- */
mcq("c2", [
  { tier: "e", q: "Which of these is an off-balance-sheet item for a bank?",
    o: ["A mortgage loan", "A loan commitment or standby letter of credit that becomes an asset or liability only if drawn or triggered", "Customer deposits", "Government bonds held"], a: 1,
    x: "OBS items are contingent claims. They earn fees today and can become real exposures tomorrow, which is why Chapter 7 gives them their own risk." },
  { tier: "m", q: "What did the 1933 Glass-Steagall Act do, and what undid its main separation?",
    o: ["Created the Fed; repealed by Dodd-Frank", "Separated commercial and investment banking and created the FDIC; the 1999 Financial Services Modernization Act (Gramm-Leach-Bliley) removed the separation", "Set reserve requirements; repealed by DIDMCA", "Allowed interstate branching; repealed by Riegle-Neal"], a: 1,
    x: "Keep the pairs straight: Glass-Steagall 1933 separates and insures; FSMA 1999 reunites. Riegle-Neal 1994 is interstate branching; FDICIA 1991 is prompt corrective action." },
  { tier: "m", q: "Regulation Q ceilings on deposit rates caused disintermediation in the 1970s because:",
    o: ["Banks refused deposits", "When market rates rose above the ceiling, savers pulled money out of banks and thrifts into money market funds that could pay the market rate", "Deposit insurance was abolished", "Thrifts were nationalised"], a: 1,
    x: "MMMFs were invented in 1972 precisely to escape Reg Q. The ceiling was phased out by DIDMCA in 1980, too late for many thrifts." },
  { tier: "d", q: "The thrift crisis is a textbook case of moral hazard plus forbearance. What does that mean?",
    o: ["Thrifts were too well capitalised", "Insured deposits removed depositor discipline, so insolvent thrifts could gamble for resurrection with cheap funding, and regulators let them keep operating instead of closing them", "Thrifts had no interest rate risk", "Congress banned mortgages"], a: 1,
    x: "FIRREA 1989 and FDICIA 1991's prompt corrective action were the answer: close weak institutions early, before the losses grow." },
  { tier: "e", q: "In Thailand, who licenses a commercial bank and who supervises it day to day?",
    o: ["The SEC licenses; the SET supervises", "The Ministry of Finance licenses; the Bank of Thailand supervises under the Financial Institutions Businesses Act", "The DPA licenses; the OIC supervises", "The BOT licenses; the DPA supervises"], a: 1,
    x: "The DPA protects deposits, the OIC handles insurers, and the SEC covers securities firms and funds. Savings cooperatives sit outside all of them." },
  { tier: "d", q: "A bank's ROE rises while its ROA is flat and its equity-to-assets ratio falls. What is the correct reading?",
    o: ["Management improved profitability", "The higher ROE came entirely from leverage: the bank is earning the same on its assets while owning a smaller share of them, so risk rose", "Asset utilisation improved", "Provisions fell"], a: 1,
    x: "ROE = ROA × EM. Flat ROA and a lower equity share means EM rose. Higher ROE from leverage alone is borrowed courage." }
]);
sa("c2", [
  { tier: "m", q: "Explain the DuPont decomposition of a bank's ROE and what each component tells a manager.",
    points: [
      { p: "ROE = ROA × equity multiplier", kw: ["ROA", "equity multiplier", "EM", "leverage"] },
      { p: "ROA = profit margin × asset utilisation", kw: ["profit margin", "asset utili", "PM", "AU"] },
      { p: "Profit margin measures cost control (income kept per baht of revenue); asset utilisation measures revenue generation per baht of assets", kw: ["cost", "expense", "revenue", "income per", "generate"] },
      { p: "The equity multiplier shows how much of ROE comes from leverage rather than performance", kw: ["leverage", "borrow", "thin", "cushion", "risk"] }
    ],
    model: "DuPont splits ROE into ROA times the equity multiplier, and ROA further into profit margin times asset utilisation. Profit margin (net income over operating income) shows how well the bank controls expenses, provisions and taxes; asset utilisation (operating income over assets) shows how much revenue the assets generate; the equity multiplier (assets over equity) shows leverage. Two banks can have the same ROE with very different risk: the one relying on a high multiplier has a thin equity cushion and is riskier." },
  { tier: "d", q: "Describe the sequence of US banking laws that first restricted and then liberalised bank activities and geography, naming at least four acts.",
    points: [
      { p: "McFadden 1927 restricted interstate branching", kw: ["McFadden", "1927", "interstate"] },
      { p: "Glass-Steagall 1933 separated commercial and investment banking and created the FDIC", kw: ["Glass", "1933", "separat", "FDIC"] },
      { p: "DIDMCA 1980 and Garn-St Germain 1982 deregulated deposit rates and thrift powers", kw: ["DIDMCA", "1980", "Garn", "1982", "Regulation Q", "Reg Q"] },
      { p: "Riegle-Neal 1994 allowed interstate branching; FSMA 1999 allowed financial holding companies to combine banking, securities and insurance", kw: ["Riegle", "1994", "FSMA", "1999", "Gramm", "Modernization", "holding compan"] }
    ],
    model: "McFadden (1927) confined banks to their home state, and Glass-Steagall (1933) separated commercial from investment banking while creating the FDIC. Deregulation began with DIDMCA (1980), which phased out Regulation Q ceilings, and Garn-St Germain (1982), which widened thrift powers. Riegle-Neal (1994) permitted interstate branching, and the Financial Services Modernization Act (1999) let financial holding companies combine banking, securities and insurance, reversing Glass-Steagall's separation. Dodd-Frank (2010) then re-tightened supervision after the crisis." }
]);

/* ---------- Chapter 3 ---------- */
mcq("c3", [
  { tier: "e", q: "A captive finance company is:",
    o: ["A finance company owned by a bank", "A finance subsidiary of a manufacturer or retailer that finances its parent's products, such as Ford Credit or Toyota Leasing Thailand", "A payday lender", "A government-owned lender"], a: 1,
    x: "Captives exist to move the parent's goods. Their credit standards and promotions (0% financing) serve sales as much as lending." },
  { tier: "m", q: "Why can finance companies lend to riskier borrowers than banks?",
    o: ["Because they are insured", "Because they face fewer regulations and lower overheads, specialise in particular assets, and price the risk explicitly rather than being constrained by deposit-taking rules", "Because their borrowers never default", "Because they are subsidised"], a: 1,
    x: "The trade-off is funding: without deposits they rely on commercial paper and notes, which can vanish in a crisis, as CIT and Countrywide discovered." },
  { tier: "m", q: "Factoring differs from an ordinary business loan because:",
    o: ["It is always cheaper", "The factor buys the client's receivables at a discount and collects from the client's customers, so the credit risk is on the customer who owes the invoice", "It requires collateral in property", "It is only available to banks"], a: 1,
    x: "That is why Greensill's 'future receivables' were so dangerous: with no invoice from a third party, the exposure was really unsecured credit to the client itself." },
  { tier: "d", q: "Payday lenders evaded state usury ceilings in the US mainly by:",
    o: ["Lending only in states with no ceilings", "Partnering with nationally chartered banks whose home-state rate rules applied, so the loans were 'exported' over state ceilings", "Registering as credit unions", "Charging fees in kind"], a: 1,
    x: "The rent-a-charter model turned a regulatory arbitrage into a business model, which is why federal regulators eventually intervened." },
  { tier: "e", q: "Which Thai lender is outside the DPA's deposit protection and the BOT's normal supervision?",
    o: ["A commercial bank", "A savings cooperative", "A finance company licensed by the MoF", "A credit foncier"], a: 1,
    x: "Cooperatives take members' savings but sit under the Cooperative Promotion Department, not the BOT or DPA. Chapter 1's guaranty fund does not reach them." },
  { tier: "d", q: "The 1997 closure of 56 Thai finance companies illustrates which combination of Chapter 3 weaknesses?",
    o: ["Too much capital and too little lending", "Wholesale, often foreign-currency, short-term funding against long-term property loans, with no deposit base and no lender of last resort once confidence broke", "Excessive regulation", "Over-reliance on retail deposits"], a: 1,
    x: "Finance companies borrowed dollars short through the BIBF and lent baht long into property. When the peg went, both the FX and the funding vanished together." }
]);
sa("c3", [
  { tier: "m", q: "Explain how finance companies fund themselves, and why that funding makes them fragile in a crisis compared with banks.",
    points: [
      { p: "No deposits; funded by commercial paper, notes and bank lines", kw: ["commercial paper", "notes", "no deposit", "not take deposit", "bank line", "wholesale", "bond"] },
      { p: "Market funding requires a continuous signal of soundness (higher capital, ratings)", kw: ["signal", "rating", "confiden", "capital", "sound"] },
      { p: "No deposit insurance and no lender of last resort, so a loss of confidence stops funding", kw: ["insur", "lender of last resort", "central bank", "confidence", "roll", "refinanc"] },
      { p: "Examples: 1997 Thai finance companies, CIT or Countrywide in 2008", kw: ["1997", "CIT", "Countrywide", "GMAC", "2008", "Thai finance"] }
    ],
    model: "Finance companies do not take deposits; they fund loans with commercial paper, medium-term notes and bank credit lines. Because that money comes from markets rather than insured depositors, they must constantly signal soundness, which is why they hold more capital than banks. In a crisis the signal fails: with no deposit insurance and no central bank lender of last resort, commercial paper cannot be rolled over and the company must sell assets or fail, as 56 Thai finance companies did in 1997 and as Countrywide and CIT did in 2008." },
  { tier: "d", q: "A hire-purchase contract is quoted at a flat rate. Explain why the effective rate is higher, why the OCPB caps the effective rate, and what a borrower should compare instead.",
    points: [
      { p: "Flat interest is charged on the original principal for the whole term even though the balance falls with each installment", kw: ["original", "whole term", "full (amount|principal)", "declin", "balance falls", "already repaid"] },
      { p: "So the effective rate is roughly double the flat rate", kw: ["double", "twice", "roughly 2", "higher", "about two"] },
      { p: "The cap is set in effective terms so lenders cannot hide cost behind a low-looking flat quote", kw: ["cap", "OCPB", "ceiling", "hide", "understat", "23", "10%", "15%"] },
      { p: "Compare effective (or APR) rates and total interest, not the flat quote", kw: ["effective", "APR", "total interest", "compare"] }
    ],
    model: "A flat rate charges interest on the original loan for every month of the contract, even though the borrower repays part of the principal each month, so interest is paid on money already returned; the effective rate on the declining balance is therefore roughly twice the flat quote. The OCPB sets its hire-purchase ceilings in effective terms (10% new cars, 15% used cars, 23% motorcycles) precisely so a low-looking flat rate cannot hide the true cost. Borrowers should compare effective rates or APRs and the total interest paid, never the flat quote alone." }
]);

/* ---------- Chapter 4 ---------- */
mcq("c4", [
  { tier: "e", q: "A private placement differs from a public offering because:",
    o: ["It is larger", "Securities are sold directly to a small number of qualified investors without SEC registration, trading speed and lower cost for less liquidity", "It is underwritten by the government", "It requires a stock exchange listing"], a: 1,
    x: "Chapter 4 lists public offering versus private placement as the first fork in investment banking." },
  { tier: "m", q: "Why did Goldman Sachs and Morgan Stanley convert to bank holding companies in 2008?",
    o: ["To pay less tax", "To gain access to Federal Reserve lending and stable deposit funding in exchange for Fed supervision and higher capital, after repo funding had failed Bear and Lehman", "To list on the NYSE", "To avoid SEC regulation entirely"], a: 1,
    x: "The independent broker-dealer model with thin capital and overnight funding ended that week. Survival meant becoming a bank." },
  { tier: "m", q: "SIPC protection covers:",
    o: ["Losses when a security falls in value", "Missing customer cash and securities (up to $500,000) if a broker-dealer fails, not market losses", "All deposits at investment banks", "Losses from bad advice"], a: 1,
    x: "SIPC is the securities analogue of the FDIC for custody, not for performance. Thailand relies on client-asset segregation rules rather than a fund." },
  { tier: "d", q: "Why is program trading classified as a trading activity with market risk rather than pure arbitrage?",
    o: ["Because it is illegal", "Because it takes simultaneous positions in baskets of stocks and index futures that may not converge as expected, so an open exposure exists until the trade unwinds", "Because it uses only cash", "Because it is done by regulators"], a: 1,
    x: "Chapter 4 lists position trading, pure arbitrage, risk arbitrage and program trading. Only pure arbitrage is riskless." },
  { tier: "e", q: "Which activity earns a securities firm fee income without taking a position?",
    o: ["Position trading", "M&A advisory", "Market making with inventory", "Proprietary investing"], a: 1,
    x: "The industry shifted toward fee-based income after commissions fell from 1987 onwards; advisory fees are the cleanest example." },
  { tier: "d", q: "Sarbanes-Oxley (2002) responded to which failure, and how?",
    o: ["The 2008 crisis; by creating the FSOC", "Accounting scandals (Enron, WorldCom) and conflicted research; by requiring executive certification of accounts, auditor independence and separating research from investment banking", "The 1987 crash; by adding circuit breakers", "Madoff; by regulating hedge funds"], a: 1,
    x: "Pair it with the 2003 $1.4bn state attorneys-general settlement over analyst conflicts. Dodd-Frank (2010) is the crisis-era law." }
]);
sa("c4", [
  { tier: "m", q: "Compare firm commitment and best efforts underwriting from the issuer's and the underwriter's point of view.",
    points: [
      { p: "Firm commitment: underwriter buys the whole issue and resells it, earning the spread", kw: ["buys? the (whole|entire|issue)", "purchase", "spread", "resell"] },
      { p: "Under firm commitment the price risk of unsold shares sits with the underwriter; the issuer's proceeds are certain", kw: ["price risk", "unsold", "certain", "guarantee", "bears? the risk"] },
      { p: "Best efforts: underwriter sells what it can for a commission; unsold shares return to the issuer", kw: ["commission", "what it can", "return", "unsold", "back to the issuer"] },
      { p: "Best efforts is cheaper but leaves the issuer with uncertain proceeds; used by riskier or smaller issuers", kw: ["cheaper", "uncertain", "smaller", "risk", "less"] }
    ],
    model: "In a firm commitment the underwriter buys the entire issue from the issuer at an agreed price and resells it to the public, earning the spread; the issuer's proceeds are certain and the risk that shares sell below the purchase price sits with the underwriter. In a best-efforts deal the underwriter acts as agent, sells as many shares as it can for a commission and returns unsold shares to the issuer, so the issuer bears the placement risk and may raise less than planned. Best efforts is cheaper for the issuer but is typically used by smaller or riskier issuers that underwriters will not guarantee." },
  { tier: "d", q: "Explain why repo funding made Lehman Brothers vulnerable, and what Chapter 7 risks were involved.",
    points: [
      { p: "Repos are overnight or very short-term secured borrowing against securities, so the balance sheet is funded day by day", kw: ["overnight", "short-term", "roll", "day", "secured"] },
      { p: "Rising haircuts or lenders refusing to roll force asset sales at falling prices: liquidity risk", kw: ["haircut", "refus", "roll", "fire sale", "liquidity"] },
      { p: "The collateral (mortgage securities) was losing value: market risk and credit risk", kw: ["mortgage", "collateral", "market risk", "credit risk", "value fell", "toxic"] },
      { p: "Thin capital meant the losses exhausted equity: insolvency risk", kw: ["capital", "equity", "insolven", "leverage", "thin"] }
    ],
    model: "Lehman financed a large inventory of mortgage-related securities with repos, overnight secured loans that had to be renewed every day. When the collateral fell in value (market and credit risk), lenders raised haircuts and then refused to roll the loans, forcing sales into a falling market: liquidity risk. Because the firm's capital was thin relative to its assets, the losses on those sales exhausted its equity, turning a liquidity problem into insolvency. The same sequence explains why Goldman and Morgan Stanley fled to bank holding company status days later." }
]);

/* ---------- Chapter 5 ---------- */
mcq("c5", [
  { tier: "e", q: "The key economic benefit a mutual fund gives a small investor is:",
    o: ["Guaranteed returns", "Diversification and professional management at a scale a small investor could not achieve alone", "Deposit insurance", "Tax exemption"], a: 1,
    x: "It is denomination intermediation from Chapter 1: small savers own slices of a large, diversified portfolio." },
  { tier: "m", q: "Market timing and late trading, the early-2000s fund abuses, both exploited:",
    o: ["High fees", "The once-a-day NAV: trading after the price was set, or arbitraging stale prices in the fund's foreign holdings, at the expense of long-term holders", "Closed-end discounts", "Hedge fund leverage"], a: 1,
    x: "The response was chief compliance officers (2004), fair-value pricing and redemption fees. The lesson: any fixed daily price invites someone to trade around it." },
  { tier: "m", q: "Why were hedge funds largely exempt from SEC registration before 2010?",
    o: ["Because they lost money", "Because they limited themselves to fewer than 100 investors or to accredited investors, so the 1940 Act's protections for small investors did not apply", "Because they held only Treasuries", "Because they were banks"], a: 1,
    x: "Dodd-Frank required registration for advisers above $100m. LTCM (1998) and Madoff had shown what opacity could hide." },
  { tier: "d", q: "The March 2020 Bangkok fund run and the 2008 Reserve Primary case share which mechanism?",
    o: ["Fraud by the manager", "Funds promising daily liquidity while holding assets that could not be sold quickly at par, so early redeemers were paid from the liquid assets and later ones faced losses, which is a first-mover incentive to run", "Excess capital", "Government seizure"], a: 1,
    x: "Liquidity mismatch creates the run incentive that Chapter 7 describes. The BOT's Mutual Fund Liquidity Facility and the US Treasury guarantee both aimed at removing the incentive to be first out." },
  { tier: "e", q: "Which Thai fund types carry tax incentives for long-term saving?",
    o: ["Money market funds", "RMF, SSF and Thai ESG funds", "Closed-end property funds", "Hedge funds"], a: 1,
    x: "They are the Thai counterparts of retirement-oriented fund products; the incentive comes with holding-period rules." },
  { tier: "d", q: "A fund's expense ratio looks small, yet Chapter 5 treats it as central. The best justification is:",
    o: ["Expenses are paid only once", "Expenses are deducted every year from a compounding base, so a one-point difference removes a large share of final wealth over decades", "Expense ratios are regulated at zero", "Only loads matter"], a: 1,
    x: "The Fee Drag lab and the rule of 72 tell the same story: fees slow the doubling time, and the loss compounds." }
]);
sa("c5", [
  { tier: "m", q: "Explain the difference between open-end and closed-end funds and why closed-end funds can trade at a discount to NAV.",
    points: [
      { p: "Open-end: fund issues and redeems units at NAV, so units outstanding vary", kw: ["redeem", "issue", "at NAV", "open-end", "units? (vary|change|outstanding)"] },
      { p: "Closed-end: fixed number of units traded on an exchange", kw: ["fixed", "exchange", "listed", "closed-end", "trade"] },
      { p: "Price is set by supply and demand, not by NAV, so it can sit above (premium) or below (discount)", kw: ["supply", "demand", "premium", "discount", "market price"] },
      { p: "No redemption mechanism forces price to NAV; investors may discount fees, illiquidity or poor management", kw: ["no redemption", "cannot redeem", "arbitrage", "fee", "illiquid", "management"] }
    ],
    model: "An open-end fund continuously issues and redeems units at NAV, so its size changes with investor flows and the price always equals NAV. A closed-end fund issues a fixed number of units that then trade on an exchange, like a share, at whatever price buyers and sellers agree. Because the fund does not redeem units, nothing forces the market price to NAV: investors who doubt the manager, dislike the fees or need liquidity sell below NAV, producing a discount, as with many listed property funds on the SET." },
  { tier: "d", q: "Describe how hedge funds differ from mutual funds in investors, strategies, fees and regulation.",
    points: [
      { p: "Investors: wealthy or accredited and few in number, versus the general public", kw: ["accredited", "wealthy", "100 investors", "high net worth", "public"] },
      { p: "Strategies: leverage, short selling, derivatives; market directional, market neutral or risk avoidance", kw: ["leverage", "short", "derivative", "directional", "neutral", "arbitrage"] },
      { p: "Fees: management fee plus performance fee (2 and 20), often with hurdle and high-water mark", kw: ["performance fee", "2 and 20", "20%", "high-water", "hurdle", "incentive"] },
      { p: "Regulation: historically exempt from the 1940 Act; Dodd-Frank registration above $100m; mutual funds face full SEC disclosure", kw: ["exempt", "1940", "Dodd", "register", "disclos", "SEC"] }
    ],
    model: "Mutual funds are sold to the general public, hold long positions in diversified portfolios, charge loads and expense ratios, and are fully regulated by the SEC under the 1940 Act with daily NAV disclosure. Hedge funds take money from a small number of wealthy or accredited investors, use leverage, short selling and derivatives in directional, market-neutral or risk-avoidance strategies, and charge a management fee plus a performance fee, typically 2 and 20, often subject to a hurdle and a high-water mark. Because their investors were deemed able to protect themselves, they were exempt from registration until Dodd-Frank required advisers above $100m to register." }
]);

/* ---------- Chapter 6 ---------- */
mcq("c6", [
  { tier: "e", q: "Adverse selection in life insurance means:",
    o: ["Insurers choose the wrong investments", "People who know they are higher risk are more likely to buy cover, so the insured pool is riskier than the general population unless the insurer screens and groups by risk class", "Policyholders cancel early", "Premiums are set by the state"], a: 1,
    x: "Risk pools, medical underwriting and group policies are the answers. Compare moral hazard, which is behaviour changing after cover is bought." },
  { tier: "m", q: "Why does a P&C insurer hold more short-term assets and more capital than a life insurer?",
    o: ["Because P&C premiums are larger", "Because P&C claims are less predictable, arrive faster and can be correlated (catastrophes), so it needs liquidity and a bigger cushion; life claims are slow, smooth and diversifiable", "Because life insurers are unregulated", "Because P&C insurers cannot invest"], a: 1,
    x: "Severity and frequency are the two axes: low-severity high-frequency lines are predictable; high-severity low-frequency ones are not, and their claims may not be independent." },
  { tier: "m", q: "A long-tail line is one where:",
    o: ["Policies last many years", "The insured event occurs during the coverage period but claims are filed or settled years later, as with asbestos or product liability", "Premiums are paid late", "Reinsurance is unavailable"], a: 1,
    x: "Long tails make reserving hard because the eventual cost is unknown for years, which is why Halliburton parked asbestos risk in subsidiaries." },
  { tier: "d", q: "Which statement about US state guaranty funds versus the FDIC is correct?",
    o: ["They are identical", "State insurance guaranty funds are not pre-funded; surviving insurers in the state are assessed after a failure, whereas the FDIC holds a standing fund", "Guaranty funds are federal", "The FDIC is assessed after each failure"], a: 1,
    x: "Thailand differs: the Life Insurance Fund and General Insurance Fund are standing funds under the OIC." },
  { tier: "e", q: "Social inflation refers to:",
    o: ["Rising premiums", "Unexpected increases in claim costs from larger jury awards and broader liability interpretations, as opposed to ordinary product inflation", "Higher interest rates", "More policies sold"], a: 1,
    x: "It is a P&C loss-cost driver that actuaries cannot read off a price index, which makes liability lines harder to price than property." },
  { tier: "d", q: "Why did the 2011 Thai floods not bankrupt Thai non-life insurers despite gross losses several times their premiums?",
    o: ["Claims were refused", "Most of the risk had been ceded to global reinsurers, so the retained loss was survivable; the bill was largely paid from Munich and Zurich", "The government paid all claims", "Policies excluded floods"], a: 1,
    x: "About 75% of US reinsurance is also written by non-US firms. Reinsurance is how a national catastrophe becomes a global one, deliberately." }
]);
sa("c6", [
  { tier: "m", q: "Explain the combined ratio and the operating ratio, and why an insurer can survive a combined ratio above 100%.",
    points: [
      { p: "Combined ratio = loss ratio + expense ratio", kw: ["loss ratio", "expense ratio", "loss.{0,20}plus.{0,20}expense", "combined"] },
      { p: "Above 100 means underwriting lost money: losses and expenses exceeded premiums", kw: ["above 100", "over 100", "exceed", "underwriting loss", "lost money", "more than premium"] },
      { p: "Operating ratio = combined ratio after policyholder dividends minus investment yield", kw: ["operating ratio", "investment yield", "investment income", "minus", "dividend"] },
      { p: "Investment income on premiums held before claims are paid can cover the underwriting loss, so credit and interest rate risk become central", kw: ["investment", "float", "held before", "cover", "credit risk", "interest rate risk"] }
    ],
    model: "The combined ratio adds the loss ratio (losses and loss adjustment expenses over premiums) to the expense ratio (underwriting expenses over premiums written); above 100% the underwriting business has lost money. The operating ratio subtracts the investment yield from the combined ratio after policyholder dividends. Because premiums are collected before claims are paid, the insurer earns investment income on that float, which can turn an underwriting loss into an overall profit, so the insurer's exposure to credit and interest rate risk on its investments matters as much as its underwriting." },
  { tier: "d", q: "Why did AIG, an insurer, need a bailout in 2008? Explain the role of credit default swaps and the collateral trigger.",
    points: [
      { p: "AIG Financial Products wrote credit default swaps guaranteeing mortgage-related securities, earning premiums as if it were insurance", kw: ["credit default swap", "CDS", "protection", "guarantee", "wrote", "insur"] },
      { p: "As the securities fell in value, mark-to-market losses on the swaps mounted", kw: ["mark", "fell", "value", "loss", "subprime", "mortgage"] },
      { p: "The contracts required collateral once AIG's rating fell, creating immediate cash demands", kw: ["collateral", "rating", "downgrade", "trigger", "cash"] },
      { p: "A valuation problem became a liquidity crisis; its size and interconnection justified the bailout (systemic risk), leading to the Federal Insurance Office and stricter oversight", kw: ["liquidity", "systemic", "counterpart", "bailout", "Federal Insurance Office", "Dodd"] }
    ],
    model: "AIG's financial products unit sold credit default swaps that promised to pay if mortgage-backed securities defaulted, collecting premiums much like insurance but without reserving as an insurer would. When those securities fell in value in 2008, the swaps showed large mark-to-market losses, and because the contracts required AIG to post collateral once its credit rating was cut, it suddenly owed cash on protection that had not yet paid a claim. The valuation problem became a liquidity crisis; since the counterparties were the world's largest banks, its failure threatened the system, which justified the bailout and led Dodd-Frank to create the Federal Insurance Office." }
]);

/* ---------- Chapter 7 ---------- */
mcq("c7", [
  { tier: "e", q: "Which risk is defined as the risk that promised cash flows on loans and securities will not be paid in full?",
    o: ["Liquidity risk", "Credit risk", "Market risk", "Operational risk"], a: 1,
    x: "Firm-specific credit risk can be diversified; systematic credit risk (a recession hitting all borrowers) cannot." },
  { tier: "m", q: "Why is a fully matched balance sheet, with asset and liability maturities equal, not the textbook's recommended answer to interest rate risk?",
    o: ["Because it is illegal", "Because it is inconsistent with the asset transformation function: FIs exist to fund long assets with short liabilities, so eliminating the mismatch eliminates the business", "Because it increases credit risk", "Because it is impossible to measure"], a: 1,
    x: "The Mismatch Desk lab shows it: a matched book is safe and tidy and earns no transformation spread." },
  { tier: "m", q: "Country or sovereign risk is classified as a type of credit risk, but differs because:",
    o: ["It is always smaller", "The lender usually cannot use the courts to enforce the claim, and the borrower's inability to pay stems from government action such as restrictions or reschedulings", "It only affects equity", "It is insured by the IMF"], a: 1,
    x: "The remaining bargaining chip is the future supply of loans, which is weak when the currency is collapsing, as Argentina keeps demonstrating." },
  { tier: "d", q: "Which sequence best describes how liquidity risk turns into insolvency risk?",
    o: ["Losses on loans reduce capital directly", "Depositors withdraw, the FI sells assets quickly at fire-sale prices, the realised losses exceed its equity, and a solvent institution becomes insolvent", "Interest rates fall and margins widen", "Operational failures cause fraud"], a: 1,
    x: "IndyMac 2008, SVB 2023 and Thailand 1997 all follow this path. The Chapter 1 answer is deposit insurance and a lender of last resort." },
  { tier: "e", q: "Which is an example of operational risk from external events?",
    o: ["A rise in interest rates", "The 2023 wave of mobile-banking fraud in Thailand or the 2013 Target data breach", "A borrower's bankruptcy", "A currency devaluation"], a: 1,
    x: "Operational risk covers failed processes, people, systems and external events; technology risk is a subset. Losses are magnified by reputational damage." },
  { tier: "d", q: "The London Whale case is used in Chapter 7 to illustrate:",
    o: ["Credit risk from consumer loans", "Market risk and operational risk together: a large open derivatives position whose risk measure was changed to make the exposure look smaller, defeating controls and measurement at once", "Sovereign risk", "Deposit insurance failure"], a: 1,
    x: "Controls and measurement must be independent of the people they constrain. Redefining VaR is worse than breaching a limit, because breaches are visible." }
]);
sa("c7", [
  { tier: "m", q: "Distinguish refinancing risk from reinvestment risk, and state which direction of rate change hurts in each case.",
    points: [
      { p: "Refinancing risk arises when liabilities are shorter than assets", kw: ["refinanc", "liabilit.{0,30}short", "borrow.{0,20}short", "funding.{0,20}short"] },
      { p: "Rising rates hurt: the funding rolls at a higher cost against a fixed asset yield", kw: ["ris(e|ing)", "higher", "increase", "up"] },
      { p: "Reinvestment risk arises when assets are shorter than liabilities", kw: ["reinvest", "asset.{0,30}short", "matur.{0,20}before"] },
      { p: "Falling rates hurt: proceeds are reinvested at lower yields while the funding cost is fixed", kw: ["fall", "lower", "decreas", "down"] }
    ],
    model: "Refinancing risk arises when an FI funds long-term assets with shorter-term liabilities: when the liabilities mature they must be refinanced, and if rates have risen the new funding costs more than the fixed yield on the asset, squeezing or reversing the spread. Reinvestment risk is the mirror image: when assets are shorter than liabilities, maturing assets must be reinvested, and if rates have fallen the new yield is lower than the fixed cost of the funding. Rising rates hurt the first case; falling rates hurt the second. Both are consequences of the maturity mismatch that asset transformation creates." },
  { tier: "d", q: "Using the 1997 Thai crisis, show how at least four of the nine Chapter 7 risks interacted.",
    points: [
      { p: "FX risk: baht assets funded by unhedged dollar borrowing; a net short dollar position", kw: ["FX", "foreign exchange", "dollar", "baht", "short", "unhedged", "devalu", "float"] },
      { p: "Interest rate and liquidity risk: short-term foreign funding against long-term property loans that could not be rolled", kw: ["short-term", "long-term", "roll", "liquidity", "matur", "property"] },
      { p: "Credit risk: property borrowers defaulted as the economy collapsed; systematic, not diversifiable", kw: ["credit", "default", "non-performing", "NPL", "systematic"] },
      { p: "Insolvency risk: losses exceeded thin capital; 56 finance companies closed and the FRA/TAMC good bank-bad bank response followed", kw: ["insolven", "capital", "closed", "56", "FRA", "TAMC", "bad bank"] }
    ],
    model: "Thai finance companies and banks borrowed dollars short through the BIBF and lent baht long into property, which created a net short dollar position (FX risk) alongside a maturity mismatch (interest rate risk). When the peg broke in July 1997 the baht lost about half its value, so dollar debts doubled in baht terms, and foreign lenders refused to roll the short-term loans (liquidity risk). Property borrowers defaulted across the whole economy at once, so the credit risk was systematic and could not be diversified. The combined losses exceeded the institutions' thin capital (insolvency risk); 56 of 58 suspended finance companies were closed, and the FRA and later the TAMC were the good bank-bad bank response." }
]);
})();
