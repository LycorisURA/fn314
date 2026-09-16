FI.cases = [
  { id: "k1", title: "Tom Yum Kung: the night 56 finance companies died", where: "Thailand", year: "1997", th: true, ch: [1, 3],
    hook: "Borrow dollars short, lend baht long into a property bubble, and assume the peg holds forever.",
    timeline: [["1993", "BIBF licences make cheap offshore dollar funding easy"], ["Jun 1997", "BOT suspends 16 finance companies"], ["2 Jul 1997", "Baht floated; it loses about half its value within months"], ["Aug 1997", "42 more suspended (58 total); IMF-led package of $17.2bn"], ["8 Dec 1997", "56 of the 58 permanently closed; FRA set up to liquidate assets"]],
    story: [
      "In the mid-1990s, Thai finance companies (บริษัทเงินทุน) were the fast-growing edge of the system. They took no deposits, funded themselves with promissory notes and short-term foreign borrowing, and lent aggressively to property developers and stock-market investors. Finance One, the largest, was a symbol of the boom.",
      "When property prices turned and speculators attacked the baht, the model broke on every side at once. Borrowers defaulted (credit risk), dollar debts ballooned in baht terms (FX risk), and short-term creditors refused to roll over (liquidity risk). The Financial Institutions Development Fund (FIDF) lent heavily to keep them alive, and its losses ran to roughly ฿1.4 trillion, a public debt the banking system still helps service through FIDF fees levied on deposits."
    ],
    lens: "Chapter 3 says finance companies must signal soundness to market lenders because they have no safety net. Thailand 1997 is what happens when that signal fails for a whole sector at once. Chapter 1's negative externalities show up too: the cost landed on taxpayers and on every bank depositor through FIDF levies.",
    qs: [
      { t: "mcq", q: "Which funding feature made Thai finance companies especially fragile in 1997?", o: ["Insured retail deposits", "Short-term, often foreign-currency borrowing that had to be rolled over", "Long-term equity from parents", "Central bank reserves"], a: 1, x: "No deposits and no lender-of-last-resort access, just short, flighty wholesale and offshore funding. That is Chapter 3's liquidity point." },
      { t: "mcq", q: "The FIDF's huge losses from supporting failed institutions are best described as an example of:", o: ["Denomination intermediation", "A negative externality of FI failure borne by the public", "Credit allocation regulation", "Brokerage"], a: 1, x: "The losses spilled beyond the firms' own shareholders and creditors onto taxpayers and bank depositors." },
      { t: "mcq", q: "Floating the baht turned dollar borrowing into a solvency problem because:", o: ["Dollar liabilities rose in baht terms while baht assets did not", "Interest rates in the US fell", "Deposit insurance was removed", "The SET closed"], a: 0, x: "A currency mismatch: liabilities in USD, assets in THB. When the baht halved, debts roughly doubled." }
    ],
    open: { q: "As a BOT examiner in 1996, which three warning signs on a finance company's balance sheet would you have flagged, and what would you have required?", points: ["Maturity mismatch: short-term funding against long-term property loans", "Currency mismatch: foreign-currency liabilities against baht assets", "Concentration in property and margin lending", "A remedy such as higher capital, exposure limits, FX hedging or funding-term requirements"] } },

  { id: "k2", title: "Lehman weekend: when originate-to-distribute came home", where: "United States → global", year: "2007–09", th: false, ch: [1, 2, 4],
    hook: "Securitization was meant to spread risk. It mostly spread it to the institutions least able to see it.",
    timeline: [["2006–07", "US home prices fall; foreclosure filings up 93% from July 2006 to July 2007"], ["Mar 2008", "Bear Stearns rescued by JPMorgan Chase; Fed lends beyond depositories"], ["Sep 2008", "Fannie Mae and Freddie Mac seized; Lehman files for bankruptcy; AIG bailed out"], ["Oct 2008", "$700bn TARP"], ["Feb 2009", "$827bn stimulus; DJIA down 53.8% from its peak by March"]],
    story: [
      "Banks and mortgage lenders made subprime and exotic loans in order to sell them into mortgage-backed securities. Investment banks packaged and levered those securities, funding their inventories with overnight repo. When defaults rose, nobody knew who held the losses, so repo lenders pulled back from everyone.",
      "Lehman Brothers, with thin capital and repo funding, could not find a buyer and filed on 15 September 2008. The shock hit money market funds, interbank lending and global banks within days. Goldman Sachs and Morgan Stanley survived only by becoming bank holding companies."
    ],
    lens: "Chapter 1 (originate-to-distribute, ERM), Chapter 2 (TARP capital injections, OBS toxic assets) and Chapter 4 (repo funding, thin capital, end of the stand-alone investment bank) all meet here.",
    qs: [
      { t: "mcq", q: "Why did originate-to-distribute weaken credit quality?", o: ["Loans had to be held to maturity", "Originators passed default risk on, so they had less incentive to screen", "Regulators banned mortgage securitization", "Deposit rates were capped"], a: 1, x: "If you keep the fee but sell the risk, screening effort falls." },
      { t: "mcq", q: "What funding source vanished for Bear Stearns and Lehman?", o: ["Retail deposits", "Repo borrowing", "Insurance premiums", "Government grants"], a: 1, x: "Broker-dealers fund inventories in the repo market. When lenders doubted the collateral, the funding disappeared overnight." },
      { t: "mcq", q: "TARP's capital injections into Citigroup ($25bn) and Bank of America ($20bn) aimed mainly to:", o: ["Replace deposits", "Rebuild equity capital so banks could absorb losses and keep lending", "Buy the banks' branches", "Pay depositors directly"], a: 1, x: "Chapter 2: bank equity is the loss-absorbing cushion." }
    ],
    open: { q: "Explain how an ERM approach might have changed a large bank's exposure to subprime MBS before 2007.", points: ["Viewing credit, liquidity and market risk as interrelated rather than in silos", "Aggregating off-balance-sheet and warehouse exposures", "Stress testing falling house prices and funding runs", "Risk culture and governance: incentives and a board-level risk appetite"] } },

  { id: "k3", title: "Breaking the buck: the Reserve Primary Fund", where: "United States", year: "2008", th: false, ch: [5],
    hook: "A fund that promised $1.00 per share discovered its promise was only as good as Lehman's paper.",
    timeline: [["15 Sep 2008", "Lehman files; Reserve Primary holds about $785m of Lehman commercial paper"], ["16 Sep 2008", "NAV falls to $0.97, breaking the buck"], ["16–18 Sep", "Institutional investors pull money from prime money market funds industry-wide"], ["19 Sep 2008", "US Treasury announces a temporary guarantee for money market funds"]],
    story: [
      "Money market mutual funds keep a stable $1 share price and are marketed as nearly as safe as deposits, but they are uninsured. The Reserve Primary Fund had reached for yield with commercial paper, including Lehman's.",
      "Once the Lehman paper was written down, the fund's NAV fell below $1. Investors everywhere asked which other fund might be next, and a run spread through prime funds, freezing the commercial paper market that finance companies and corporations relied on."
    ],
    lens: "Chapter 5: MMMFs hold short-term assets and fix the share price at $1, and that structure carries significant liquidity risk. Chapter 3 connects too: CP buyers fleeing meant finance companies lost their key funding.",
    qs: [
      { t: "mcq", q: "Breaking the buck means:", o: ["A fund's NAV falls below $1.00 per share", "A fund doubles in value", "A bank fails a stress test", "The dollar depreciates"], a: 0, x: "The $1 stable NAV is the MMMF promise, and falling to $0.97 broke it." },
      { t: "mcq", q: "Why did the run spread to other money market funds that held no Lehman paper?", o: ["They were legally merged", "Investors could not easily tell which funds were exposed, so redeeming early paid off", "The SEC ordered redemptions", "Their NAVs were insured"], a: 1, x: "First-mover advantage plus opacity is a classic run. Whoever redeems first gets $1." },
      { t: "mcq", q: "Which market froze as a knock-on effect, hurting finance companies?", o: ["Commercial paper", "Residential property", "Equity IPOs", "Gold"], a: 0, x: "MMMFs were huge CP buyers, and finance companies are the largest CP issuers." }
    ],
    open: { q: "Should money market funds be treated like banks, with deposit insurance and capital, or forced to float their NAV? Argue one side using course concepts.", points: ["A deposit-like liquidity promise without a safety net invites runs", "Insurance brings moral hazard and a net regulatory burden", "A floating NAV removes the $1 illusion but may push money to banks", "Links to the later SEC reforms: floating NAV for institutional prime funds"] } },

  { id: "k4", title: "Bangkok, March 2020: the daily-fund run", where: "Thailand", year: "2020", th: true, ch: [5, 3, 1],
    hook: "Funds sold as \"like a savings account\" held corporate paper nobody wanted to buy.",
    timeline: [["Early Mar 2020", "COVID shock; investors redeem from daily fixed-income and money market funds"], ["Mid-Mar", "Funds sell corporate bonds and CP into a frozen market; prices gap down"], ["22 Mar 2020", "BOT launches the Mutual Fund Liquidity Facility through commercial banks"], ["Apr 2020", "Emergency decree creates the ฿400bn Corporate Bond Stabilization Fund (BSF)"]],
    story: [
      "Thai investors had poured savings into daily fixed-income funds that offered same-day liquidity and a slightly higher yield than deposits. Many held short-term corporate debentures and bills, including paper issued by non-bank lenders and property developers.",
      "When COVID panic hit, redemptions forced asset sales into a market with few buyers. The BOT stepped in with liquidity for funds through banks and a stabilisation fund to help solid companies roll over maturing bonds, extending the central bank's safety net to non-banks."
    ],
    lens: "The Reserve Primary lesson in a Thai setting, twelve years on. It also shows Chapter 3's funding risk (non-bank issuers depend on bond markets) and Chapter 1's point that authorities intervene because of negative externalities.",
    qs: [
      { t: "mcq", q: "Which mismatch made Thai daily fixed-income funds vulnerable?", o: ["Daily redemption promises against less-liquid corporate bond holdings", "Foreign currency deposits", "Long-term equity liabilities", "Fixed NAV guaranteed by the DPA"], a: 0, x: "The liquidity promised to unitholders exceeded the liquidity of the assets." },
      { t: "mcq", q: "Were unitholders in these funds covered by the DPA's ฿1 million protection?", o: ["Yes, fully", "Yes, up to ฿1 million", "No, because mutual fund units are investments, not deposits", "Only for RMFs"], a: 2, x: "The DPA protects deposits at member banks. Fund units carry market risk." },
      { t: "mcq", q: "The ฿400bn BSF mainly helped:", o: ["Depositors of failed banks", "Creditworthy firms unable to refinance maturing corporate bonds", "Hedge funds", "Insurance companies paying COVID claims"], a: 1, x: "It bridged rollover needs for fundamentally sound issuers while the market was frozen." }
    ],
    open: { q: "Design one disclosure rule and one structural rule for Thai daily fixed-income funds to reduce run risk.", points: ["Disclosure: plain-language warning that units are not deposits, plus liquidity and credit profile", "Structural: liquidity buffers, redemption gates or fees, swing pricing", "Limits on concentration in low-rated or illiquid issuers", "The trade-off with investor access and yield"] } },

  { id: "k5", title: "Silicon Valley Bank: a 36-hour bank run on a smartphone", where: "United States", year: "2023", th: false, ch: [2, 1],
    hook: "No bad loans. Just long bonds, rising rates and depositors who all knew each other on group chats.",
    timeline: [["2020–21", "Deposits surge; SVB buys long-dated Treasuries and MBS"], ["2022", "Fed hikes rapidly; bond values fall; most deposits above the $250k FDIC limit"], ["8 Mar 2023", "SVB sells securities at a $1.8bn loss and announces a capital raise"], ["9 Mar", "Customers try to withdraw about $42bn in one day"], ["10–12 Mar", "Bank closed; regulators invoke the systemic-risk exception and protect all deposits"]],
    story: [
      "SVB served tech start-ups and venture funds, a concentrated, connected depositor base whose balances were mostly uninsured. It invested excess deposits in long-duration securities just before the fastest rate-hiking cycle in decades.",
      "When the bank disclosed a loss and needed capital, venture investors told portfolio companies to move their cash. The withdrawals outran anything a traditional run could manage, and the bank failed within about two days."
    ],
    lens: "Chapter 2's key inference, maturity mismatch creating interest-rate and liquidity risk, played out in real time. Chapter 1: deposit insurance exists to stop contagious runs, but uninsured depositors run first.",
    qs: [
      { t: "mcq", q: "SVB's core balance-sheet mistake was:", o: ["Too many risky consumer loans", "Funding long-duration securities with short, uninsured deposits as rates rose", "Holding too much cash", "Too much equity capital"], a: 1, x: "Interest-rate risk plus liquidity risk: the textbook maturity mismatch." },
      { t: "mcq", q: "Why did uninsured deposits make the run faster?", o: ["Insured depositors have no reason to run; uninsured ones lose money if they wait", "Uninsured deposits pay no interest", "FDIC forbids withdrawals over $250k", "They were held in foreign currency"], a: 0, x: "A coverage limit removes the incentive to run only for balances beneath it." },
      { t: "num", q: "A Thai SME keeps ฿6,000,000 in one bank that fails. Under the DPA's ฿1 million per depositor per bank limit, how much is unprotected, in ฿?", a: 5000000, tol: 1, unit: "฿", x: "6,000,000 − 1,000,000 = <b>฿5,000,000</b> exposed, which is why corporate treasurers spread cash across banks." }
    ],
    open: { q: "Could an SVB-style run happen at a Thai bank? Discuss depositor mix, deposit protection and supervision.", points: ["Thai banks have broad retail deposit bases, less concentrated than SVB's tech clients", "DPA ฿1M cap: large corporate deposits are uninsured", "Mobile banking and PromptPay make withdrawals instant", "BOT supervision, interest-rate-risk limits, LCR and D-SIB buffers"] } },

  { id: "k6", title: "Archegos to UBS: the prime broker's nightmare", where: "Switzerland / United States", year: "2021–23", th: false, ch: [4, 5],
    hook: "A family office no one had heard of borrowed like a hedge fund and cost one bank $5.5bn.",
    timeline: [["2020–21", "Archegos builds concentrated, levered positions through total return swaps with several prime brokers"], ["Late Mar 2021", "ViacomCBS share offering drops the stock; margin calls go unmet"], ["26 Mar 2021", "Goldman and Morgan Stanley dump blocks fast; slower banks take the losses"], ["Apr 2021", "Credit Suisse reports about $5.5bn in losses; Nomura about $2.9bn"], ["19 Mar 2023", "After Greensill, Archegos and a deposit run, UBS agrees to buy Credit Suisse for CHF 3bn; CHF 16bn of AT1 bonds written off"]],
    story: [
      "Archegos, Bill Hwang's family office, escaped hedge-fund-style disclosure. Using swaps, it held huge exposures to a handful of stocks, and no single prime broker saw the full picture of its leverage.",
      "When prices fell, the banks raced each other to sell collateral. Those that moved first escaped. Credit Suisse, already weakened by Greensill, lost the most, and two years later confidence collapsed and Switzerland engineered its sale to UBS."
    ],
    lens: "Chapter 4's broker-dealer balance sheet: receivables from clients, market risk, thin capital. Chapter 5: hedge-fund-like vehicles slipping around the $100M registration logic of Dodd-Frank, and why regulators fear systemic leverage.",
    qs: [
      { t: "mcq", q: "Why did prime brokers underestimate Archegos's total leverage?", o: ["It borrowed from only one bank", "Exposure was split across several banks via swaps, and family offices had little disclosure", "It was an SEC-registered mutual fund", "It held only government bonds"], a: 1, x: "Fragmented, opaque exposure: each bank saw only its own slice." },
      { t: "mcq", q: "Why did the banks that sold first lose less?", o: ["Collateral prices fell as everyone sold the same stocks", "Regulators reimbursed them", "SIPC covered them", "They had deposit insurance"], a: 0, x: "A fire sale: late sellers get the lowest prices." },
      { t: "mcq", q: "Credit Suisse's AT1 bonds being written off before shareholders were wiped out shocked markets because:", o: ["AT1 are deposits", "Investors expected equity to absorb losses first", "AT1 are government guaranteed", "UBS refused to pay cash"], a: 1, x: "It upended the expected creditor hierarchy, even though the contract terms allowed it." }
    ],
    open: { q: "Propose two changes to prime brokerage risk management that would have limited losses on a client like Archegos.", points: ["Aggregate exposure reporting across brokers, or swap position disclosure", "Concentration-based margin (dynamic margining)", "Stress testing the client's full portfolio", "Stronger credit-risk escalation and governance at the bank"] } },

  { id: "k7", title: "1MDB: the bond deals that cost Goldman $2.9bn", where: "Malaysia / global", year: "2012–20", th: false, ch: [4],
    hook: "Three bond issues, about $600m in fees, and money that ended up in yachts and a Hollywood film.",
    timeline: [["2012–13", "Goldman arranges three bond deals for 1MDB raising about $6.5bn"], ["2015", "Reports reveal billions diverted from the Malaysian state fund"], ["2018", "Former Goldman banker pleads guilty in the US"], ["Oct 2020", "Goldman agrees to a global resolution of more than $2.9bn; separate settlement with Malaysia"]],
    story: [
      "Malaysia's state fund 1MDB needed money quickly and confidentially. Goldman Sachs underwrote the bonds, buying them itself and placing them later, and earned fees far above normal sovereign-style deals.",
      "Investigators found that much of the money was siphoned off with the help of bribes to officials. The case became a textbook example of underwriter gatekeeping failures, weak compliance and conflicts of interest."
    ],
    lens: "Chapter 4: underwriting (firm commitment and private placement), advisory conflicts, SEC enforcement and anti-money-laundering scrutiny under the Patriot Act. It also shows why regulators extended oversight to investment bank conduct.",
    qs: [
      { t: "mcq", q: "Goldman bought the 1MDB bonds itself before placing them with investors. This structure resembles:", o: ["A best-efforts offering", "A firm commitment underwriting", "Market timing", "Factoring"], a: 1, x: "The underwriter takes the securities onto its own books, bearing placement risk, which justified the high fees." },
      { t: "mcq", q: "The main regulatory failure the case highlights is:", o: ["Capital adequacy", "Anti-money-laundering and anti-bribery compliance in underwriting", "Deposit insurance pricing", "Mutual fund loads"], a: 1, x: "KYC and AML controls, and the gatekeeper role of the underwriter." },
      { t: "mcq", q: "Unusually high underwriting fees should have signalled to compliance teams that:", o: ["The deal was low risk", "There might be undisclosed risks or improper payments", "The bonds were insured", "The issuer had excess cash"], a: 1, x: "An outsized spread is a red flag, not just good business." }
    ],
    open: { q: "As the Thai SEC, what lessons from 1MDB would you apply when a state enterprise hires a securities firm to raise bonds?", points: ["Enhanced due diligence on use of proceeds", "Fee reasonableness and disclosure", "AML and politically-exposed-person screening", "Independent compliance and accountability for underwriters and advisers"] } },

  { id: "k8", title: "Stark Corporation: when the debentures went dark", where: "Thailand", year: "2023", th: true, ch: [4, 3],
    hook: "A listed cable maker, a restatement, and about ฿9.2bn of bonds held by Thai investors.",
    timeline: [["2021–22", "Stark raises money through debentures and share offerings"], ["Early 2023", "Auditor issues and delayed 2022 financial statements"], ["Mid 2023", "Restated accounts reveal massive losses; debenture defaults of about ฿9.2bn"], ["2023–24", "SEC Thailand files complaints against former executives over alleged falsified accounts"]],
    story: [
      "Stark Corporation looked like a growth story in wires and cables. Investors, many of them high-net-worth individuals buying through wealth channels, bought its debentures for yield.",
      "When the 2022 accounts were finally produced, the numbers were far worse than previously reported. Bondholders faced default, and questions turned to the gatekeepers: auditors, financial advisers, the institutions that arranged and sold the bonds, and supervisory oversight."
    ],
    lens: "Chapter 4's investor protection and gatekeeper themes, in a Thai setting. It parallels the Sarbanes-Oxley response to Enron and WorldCom, and Chapter 3's point that non-bank borrowers depend on the goodwill of bond markets.",
    qs: [
      { t: "mcq", q: "The US law passed after a similar wave of accounting frauds (Enron, WorldCom) was:", o: ["Glass-Steagall", "Sarbanes-Oxley", "Riegle-Neal", "NSMIA"], a: 1, x: "SOX (2002) strengthened audit oversight and corporate responsibility for financial reports." },
      { t: "mcq", q: "Which Thai regulator is responsible for enforcement over securities fraud by listed companies?", o: ["Bank of Thailand", "SEC Thailand", "OIC", "DPA"], a: 1, x: "SEC Thailand enforces the Securities and Exchange Act." },
      { t: "mcq", q: "Why were debenture holders exposed with no protection?", o: ["Corporate bonds are investments with credit risk, not deposits", "The DPA had run out of money", "SIPC doesn't operate on weekends", "Debentures are always secured"], a: 0, x: "Market and credit losses are never covered by deposit or broker protection schemes." }
    ],
    open: { q: "What obligations should a bank's wealth-management arm have when selling high-yield corporate debentures to retail clients?", points: ["Suitability and know-your-customer assessment", "Clear disclosure of credit risk and the absence of deposit protection", "Managing conflicts of interest when the group also arranged the issue", "Concentration limits for individual clients"] } },

  { id: "k9", title: "\"Jer-Jai-Jop\": the COVID policies that sank four insurers", where: "Thailand", year: "2021–22", th: true, ch: [1, 6],
    hook: "Pay ฿500, test positive, get ฿50,000. It worked until Omicron.",
    timeline: [["2020", "Non-life insurers sell cheap pay-on-diagnosis COVID policies to millions"], ["2021", "Delta wave; claims soar; OIC blocks mass cancellation of policies"], ["Oct–Dec 2021", "Asia Insurance 1950 and The One Insurance have licences revoked"], ["Oct 2022", "Southeast Insurance and Thai Insurance licences revoked; the guarantee fund takes over claims worth tens of billions of baht"]],
    story: [
      "\"Jer-Jai-Jop\" (เจอ จ่าย จบ) policies paid a lump sum simply for testing positive. Actuaries priced them for a low infection rate, but Omicron made infection nearly universal.",
      "Insurers could not cancel the policies and could not pay the claims. Several failed, leaving the General Insurance Fund with obligations far larger than its resources and forcing debates about who pays."
    ],
    lens: "Chapter 1's safety-and-soundness tools: guaranty funds (the Thai counterpart to SIPC and the DIF), monitoring, and the negative externalities of FI failure. It is also a clear case of correlated risk defeating diversification, the very benefit FIs normally provide.",
    qs: [
      { t: "mcq", q: "Why did diversification fail these insurers?", o: ["Claims were highly correlated; one virus hit almost all policyholders", "They had too few customers", "Premiums were too high", "They invested in stocks"], a: 0, x: "Pooling works when risks are independent. A pandemic makes them move together." },
      { t: "mcq", q: "A guaranty fund paying failed insurers' claims is the Thai counterpart to which US institutions?", o: ["SEC and FINRA", "Deposit Insurance Fund and SIPC-style guaranty funds", "Federal Reserve discount window", "CFPB"], a: 1, x: "Chapter 1 lists guaranty funds (DIF, SIPC) as a safety-and-soundness layer." },
      { t: "mcq", q: "The OIC blocking policy cancellations protected consumers but increased insurer losses. This trade-off is part of:", o: ["Net regulatory burden", "Maturity intermediation", "Brokerage", "Outside money"], a: 0, x: "Regulation carries private costs as well as benefits." }
    ],
    open: { q: "Was the OIC right to block cancellation of Jer-Jai-Jop policies? Weigh consumer protection against solvency.", points: ["Consumer trust and contract fairness", "Solvency and contagion to the guarantee fund", "Moral hazard for future product design", "Alternatives: earlier capital calls, product approval standards, stress testing"] } },

  { id: "k10", title: "LTCM: Nobel laureates and a $3.6bn rescue", where: "United States", year: "1998", th: false, ch: [5],
    hook: "The models said a Russian default was a 1-in-a-billion event. It happened in August.",
    timeline: [["1994", "LTCM launches with star traders and Nobel-winning economists"], ["1995–97", "Strong returns from convergence trades at high leverage"], ["Aug 1998", "Russia defaults; spreads widen instead of converging"], ["23 Sep 1998", "New York Fed brokers a $3.6bn recapitalisation by 14 banks"]],
    story: [
      "Long-Term Capital Management made convergence bets, expecting price gaps between similar bonds to close, and levered them many times over with derivatives exposure in the hundreds of billions.",
      "When Russia defaulted, investors fled to the safest, most liquid assets. Gaps widened, losses compounded, and LTCM's banks faced losses if it was forced to dump positions. The Fed organised a private rescue to avoid a disorderly unwinding."
    ],
    lens: "Chapter 5: the hedge fund regulatory gap and systemic threat that led to SEC scrutiny, and later to Dodd-Frank registration. It links to Chapter 4 through the counterparty exposure of the dealer banks.",
    qs: [
      { t: "mcq", q: "LTCM's main strategy is best described as:", o: ["Market directional equity investing", "Highly leveraged convergence or relative-value trading", "Money market investing", "Venture capital"], a: 1, x: "It bet on spread convergence, market-neutral in theory but hugely levered." },
      { t: "mcq", q: "Why did the Fed care about a private hedge fund?", o: ["LTCM held insured deposits", "Its forced liquidation threatened major banks and markets: systemic risk", "It was a government agency", "It underwrote Treasury auctions"], a: 1, x: "Counterparty losses and fire sales could have spread widely." },
      { t: "mcq", q: "Which post-2010 rule reflects the lesson of LTCM?", o: ["Hedge fund advisers over $100M must register with the SEC", "MMMFs must hold $1 NAV", "Banks may not sell insurance", "Payday loans capped at 36%"], a: 0, x: "Dodd-Frank brought large hedge fund advisers into registration and reporting." }
    ],
    open: { q: "LTCM was bailed out by private banks rather than taxpayers. Does that make it a success of regulation or a failure? Discuss moral hazard.", points: ["No public money, but the Fed's coordination signalled implicit support", "Moral hazard: large, levered players expect rescue", "Counterparty banks' lax risk management", "Transparency and leverage limits as alternatives"] } },

  { id: "k11", title: "Greensill: supply-chain finance without a safety net", where: "UK / Switzerland / Australia", year: "2021", th: false, ch: [3, 5],
    hook: "A factoring business dressed up as a fintech, funded through \"low-risk\" investment funds.",
    timeline: [["2011–19", "Greensill Capital grows fast, buying receivables and packaging them into notes"], ["2017–20", "Credit Suisse funds sell about $10bn of Greensill-sourced notes to clients as low risk"], ["Mar 2021", "Credit insurance on the notes lapses; Credit Suisse freezes the funds; Greensill files for insolvency"]],
    story: [
      "Supply-chain finance is factoring at scale: pay a supplier early, collect from the buyer later. Greensill extended this to \"future receivables\" that did not yet exist, with heavy exposure to one industrial group.",
      "The notes sat in Credit Suisse funds marketed as conservative. When the insurer withdrew cover, funding stopped, and the structure collapsed within days."
    ],
    lens: "Chapter 3: business credit, factoring, dependence on market funding, and lighter oversight of non-depositories. Chapter 5: fund liquidity and mis-described risk profiles.",
    qs: [
      { t: "mcq", q: "Supply-chain finance is closest to which Chapter 3 activity?", o: ["Payday lending", "Factoring", "Home equity lending", "Deposit taking"], a: 1, x: "Advancing cash against receivables at a discount." },
      { t: "num", q: "A supplier sells a ฿5,000,000 receivable due in 90 days to a finance company for ฿4,900,000. What is the annualised simple cost, in %? (Discount ÷ cash advanced × 365/90)", a: 8.28, tol: 0.05, unit: "%", x: "100,000 ÷ 4,900,000 = 2.041%, and × 365/90 = <b>8.28%</b>." },
      { t: "mcq", q: "Why did losing credit insurance end Greensill's funding?", o: ["Fund investors relied on it to treat notes as low-risk; without it, buyers vanished", "Insurance replaced deposits", "The Fed required it", "It made the receivables disappear"], a: 0, x: "Market-funded lenders survive on signals of safety, as Chapter 3 describes." }
    ],
    open: { q: "Should non-bank lenders like Greensill face bank-style regulation? Use net regulatory burden in your answer.", points: ["Lower burden enables innovation and serves riskier clients", "But opacity and concentration can create systemic spillovers", "Activity-based versus entity-based regulation", "Disclosure and concentration limits for funds buying such notes"] } },

  { id: "k12", title: "Zipmex and FTX: when the fintech held your coins", where: "Thailand / Bahamas", year: "2022", th: true, ch: [1, 4],
    hook: "The app looked like a broker. Behind it, customer assets were lent out or spent.",
    timeline: [["Jul 2022", "Zipmex, licensed in Thailand, halts withdrawals citing exposure to lenders Babel Finance and Celsius"], ["Nov 2022", "FTX collapses after revelations that customer funds were used by trading affiliate Alameda"], ["2022–23", "SEC Thailand tightens rules on digital asset custody and lending products"], ["2024", "FTX founder sentenced to 25 years in US prison"]],
    story: [
      "Crypto exchanges offered brokerage-like apps plus \"earn\" products paying high yields. Customers believed their coins sat safely in custody.",
      "At both Zipmex and FTX, customer assets had been moved into risky lending or affiliate trading. When prices fell and withdrawals surged, the shortfall became visible, and there was no SIPC or DPA backstop."
    ],
    lens: "Chapter 4: segregation of client assets and why SIPC exists for brokers. Chapter 1: investor protection regulation and the changing dynamics of specialness as fintechs mimic FIs without their rules.",
    qs: [
      { t: "mcq", q: "The core failure at both firms was:", o: ["High commissions", "Commingling or rehypothecating customer assets instead of keeping them segregated", "Too much capital", "Deposit insurance fraud"], a: 1, x: "Segregation of client assets is the first rule of brokerage custody." },
      { t: "mcq", q: "Which protection that a US broker's customers have did FTX customers lack?", o: ["SIPC coverage for missing assets", "Market loss insurance", "DPA ฿1M cover", "Guaranteed returns"], a: 0, x: "SIPC covers missing customer property at failed registered broker-dealers, not crypto platforms." },
      { t: "mcq", q: "Under Thai law, which body regulates digital asset exchanges?", o: ["Bank of Thailand", "SEC Thailand", "OIC", "Ministry of Commerce"], a: 1, x: "SEC Thailand, under the Emergency Decree on Digital Asset Businesses B.E. 2561 (2018)." }
    ],
    open: { q: "Should Thailand create a SIPC-style protection fund for digital asset exchanges? Discuss the benefits and the moral-hazard risks.", points: ["Protects retail investors against custody failures", "Could encourage risk-taking and false comfort", "Funding: levies on exchanges and net regulatory burden", "Alternatives: strict segregation, audits, proof of reserves, bans on yield products"] } },

  { id: "k13", title: "AIG: the insurer that had written the world's credit cover", where: "United States → global", year: "2008", th: false, ch: [6, 1, 4],
    hook: "The insurance subsidiaries were solvent and well regulated. The unit that broke the firm was not an insurer at all.",
    timeline: [["1998–2005", "AIG Financial Products in London writes credit default swap protection on super-senior CDO tranches, eventually around $440bn notional"], ["2005", "AIG loses its AAA rating; the swaps now carry collateral triggers"], ["2007–08", "Subprime pools fall in value; counterparties demand collateral AIG does not have"], ["15–16 Sep 2008", "Ratings downgrades trigger a wave of calls; the Fed lends $85bn for a 79.9% equity stake, the day after Lehman files"], ["2009–12", "Support rises to roughly $182bn; AIG sells subsidiaries and repays; Treasury exits its stake in December 2012"]],
    story: [
      "AIG was two companies wearing one name. The insurance operations were licensed, examined and reserved under state insurance commissions, and they largely stayed solvent throughout. Beside them sat AIG Financial Products, a derivatives dealer that sold protection against default on the senior tranches of mortgage securitizations. Because AIG was AAA-rated it originally posted no collateral, and because the tranches were rated super-senior the premium looked like free money on risk that was never supposed to be drawn.",
      "Two things broke together. As subprime pools fell in value, the contracts required AIG to post collateral against mark-to-market losses on protection it had not yet paid out on. At the same time the life subsidiaries' securities lending programme had reinvested cash collateral in mortgage paper, and those lenders wanted their cash back. On 16 September 2008, the day after Lehman filed, the Federal Reserve lent $85bn against a 79.9% equity stake, and support eventually reached about $182bn.",
      "The justification was never the policyholders. It was the counterparties: banks across the US and Europe that had bought AIG's protection and were holding capital on the assumption it was good. The holding company had been supervised by the Office of Thrift Supervision, because AIG owned a small thrift, and no insurance regulator had authority over the derivatives book at all."
    ],
    lens: "Chapter 6 opens with exactly this: insurers as investors in securities, subprime pools and credit default swaps falling in value, AIG as a major CDS writer, and the potential impact on other companies used to justify the bailout. It is also the origin of the chapter's later regulatory story, the fear of systemic risk that produced the 2009 federal charter proposals and Dodd-Frank's Federal Insurance Office in 2010.",
    qs: [
      { t: "mcq", q: "Which part of AIG created the losses that required the rescue?", o: ["Its state-regulated life and P&C underwriting subsidiaries", "AIG Financial Products, a derivatives dealer writing credit default swaps", "Its reinsurance recoveries", "Its unearned premium reserves"], a: 1, x: "The insurance companies were reserved and supervised. The failure came from a non-insurance unit that no insurance commissioner regulated, which is why the chapter treats AIG as a regulatory-gap story as much as a credit story." },
      { t: "mcq", q: "Writing credit default swap protection on senior mortgage tranches most resembles which insurance problem from the chapter?", o: ["Adverse selection in group life", "A high-severity, low-frequency line whose claims are not independent", "Unearned premium accounting", "Morbidity underwriting"], a: 1, x: "Steady premium income for an event that was supposed to be almost impossible, and when it did happen it happened to every contract at once. Pooling gives no protection against a single correlated draw." },
      { t: "mcq", q: "The chapter says the AIG rescue was justified by the potential impact on other companies. What does that mean in practice?", o: ["Policyholders would have lost their life cover", "Banks that had bought AIG's protection were holding capital against it, so an AIG default would have hit their solvency simultaneously", "AIG owed money to the FDIC", "State guarantee funds would have been enriched"], a: 1, x: "This is Chapter 1's negative externality in its purest form: the cost of one firm's failure is borne by institutions that never dealt with its policyholders." }
    ],
    open: { q: "AIG's insurance subsidiaries were solvent and supervised, yet the group failed. What does this case imply about how insurance groups should be regulated?", points: ["Functional, entity-by-entity supervision leaves gaps at group and holding-company level", "Non-insurance activities can be funded by, or threaten, regulated insurance capital", "Collateral and liquidity triggers turn a solvency question into an immediate cash question", "Remedies: group-wide supervision, the Federal Insurance Office and FSOC designation, the Thai OIC's group and risk-based capital requirements", "Countervailing cost: net regulatory burden and the risk of duplicating state and federal oversight"] } },

  { id: "k14", title: "Seven industrial estates under water: Thailand, 2011", where: "Thailand → global supply chains", year: "2011–12", th: true, ch: [6, 1],
    hook: "Thousands of separate policies, written across years and lines, turned into a single claim event.",
    timeline: [["Jul–Sep 2011", "An unusually heavy monsoon fills the Chao Phraya basin; upstream dams release water"], ["Oct 2011", "Flood waters reach Ayutthaya and Pathum Thani; Saha Rattana Nakorn, Rojana, Hi-Tech, Bang Pa-in, Nava Nakorn and Bangkadi estates inundated in turn"], ["Nov 2011", "Global hard-disk and automotive production falls as Thai plants stop; component prices spike worldwide"], ["2012", "Reinsurers reprice or withdraw Thai flood cover; the government sets up a ฿50bn National Catastrophe Insurance Fund to restore capacity"], ["2013–15", "Private capacity returns; the state fund is wound down"]],
    story: [
      "The 2011 floods caused roughly $45bn of economic damage, of which about $15–16bn was insured, making it one of the costliest freshwater flood events ever recorded. What made it an insurance event rather than a humanitarian one was geography: seven industrial estates north of Bangkok, packed with Japanese-owned electronics and automotive plants, went under within weeks of each other.",
      "Thai non-life insurers had written property and business-interruption cover on those factories, but they had ceded most of the risk to global reinsurers, and it was Munich Re, Swiss Re and the Japanese reinsurers that absorbed the bulk of the bill. Business interruption cover reached far beyond Thailand: factories in Japan and Malaysia that never saw a drop of water claimed for the parts they could no longer buy.",
      "The aftermath was a capacity crisis. Reinsurers repriced Thai flood risk sharply or excluded it, and Thai manufacturers found cover unaffordable or unavailable. The government responded with a state-backed National Catastrophe Insurance Fund, which provided capacity until the private market returned and was then wound down."
    ],
    lens: "Chapter 6's global-issues slide lists the Thai floods beside Japan's earthquake and tsunami and the New Zealand earthquakes as what made 2011 a bad year worldwide. It is the chapter's severity-versus-frequency argument in one event: a high-severity, low-frequency line whose claims are emphatically not independent, the reason P&C insurers hold more liquid assets and larger capital than life insurers, the reason about 75% of reinsurance is written offshore, and a live example of the debate about government schemes crowding out market solutions such as catastrophe bonds.",
    qs: [
      { t: "mcq", q: "Why does a flood like this defeat the pooling logic of insurance?", o: ["Because the policies were mispriced individually", "Because one event triggers a great many policies at the same time, so the claims are not independent", "Because flood damage is always total", "Because reinsurance is unavailable for property risks"], a: 1, x: "Pooling converts many independent risks into a predictable average. A single flood makes thousands of policies into one draw, which is the definition of a high-severity, low-frequency line." },
      { t: "mcq", q: "Most of the insured loss was ultimately paid by non-Thai reinsurers. Which point from the chapter does that illustrate?", o: ["Adverse selection", "That roughly three quarters of reinsurance is written by foreign firms, so catastrophe risk is exported across borders", "Unearned premium accounting", "Social inflation"], a: 1, x: "The chapter makes the point about US insurers ceding around 75% of their reinsurance to firms such as Munich Re. The same structure is why a Thai monsoon lands on European and Japanese balance sheets." },
      { t: "mcq", q: "The government created a state catastrophe fund when private flood capacity withdrew. What is the chapter's warning about that response?", o: ["State funds always cost more to administer", "Government action can crowd out market solutions such as catastrophe bonds and blunt the price signal that flood risk had become more expensive", "Insurance became compulsory", "It breaches the McCarran-Ferguson Act"], a: 1, x: "The fund restored capacity quickly, and it was wound down as the private market returned. The chapter's concern is a scheme priced below the risk, which removes the incentive for private capital to carry and price it." }
    ],
    open: { q: "You advise a Thai non-life insurer rebuilding its flood book after 2011. Explain how you would limit the risk of another correlated loss, and what it would cost.", points: ["Reinsurance structure: proportional and excess-of-loss treaties, and the retention level chosen", "Accumulation control: aggregate exposure limits by river basin, industrial estate and postcode", "Policy design: sub-limits, deductibles, separate flood pricing and exclusions", "Capital and liquidity: larger short-term asset holdings and risk-based capital under the OIC", "Alternatives to reinsurance: catastrophe bonds and state-backed capacity, with the crowding-out trade-off", "Honest costs: cover becomes dearer and narrower, and some clients go uninsured"] } }
];

FI.rosetta = [
  ["Central bank & lender of last resort", "Federal Reserve", "Bank of Thailand (ธปท.)"],
  ["Deposit insurance", "FDIC · Deposit Insurance Fund · $250,000", "Deposit Protection Agency (DPA) · ฿1,000,000 per depositor per bank"],
  ["Bank licensing", "OCC (national) + states: dual banking system", "Ministry of Finance on BOT recommendation; single track"],
  ["Bank supervision law", "FDICIA, Dodd-Frank, Bank Holding Company Act", "Financial Institutions Businesses Act B.E. 2551 (2008)"],
  ["Monetary policy", "FOMC · fed funds target", "Monetary Policy Committee · 1-day repo policy rate · 1–3% inflation target"],
  ["Securities regulator", "SEC", "SEC Thailand (ก.ล.ต.) · SEC Act B.E. 2535"],
  ["Day-to-day market oversight", "FINRA", "Stock Exchange of Thailand (member surveillance)"],
  ["Broker failure protection", "SIPC · $500,000", "Client-asset segregation under SEC Thailand rules"],
  ["Insurance regulator", "State insurance commissioners; NAIC coordination; Federal Insurance Office (2010) monitors only", "Office of Insurance Commission (คปภ.) · single national regulator"],
  ["Insurance law", "McCarran-Ferguson Act 1945 · state primacy", "Life Insurance Act and Non-Life Insurance Act B.E. 2535 (1992)"],
  ["Insurer failure protection", "State guarantee funds · assessed on surviving firms after a failure", "Life Insurance Fund and General Insurance Fund · standing funds levied on premiums"],
  ["Insurer capital regime", "NAIC risk-based capital · IRIS early-warning ratios", "OIC risk-based capital (RBC) framework"],
  ["Compulsory motor cover", "State-by-state minimum liability requirements", "Por Ror Bor (พ.ร.บ.) · Protection for Motor Vehicle Accident Victims Act B.E. 2535"],
  ["Catastrophe backstop", "TRIA 2002 for terrorism; state wind pools", "National Catastrophe Insurance Fund after the 2011 floods, since wound down"],
  ["Credit unions", "NCUA-regulated credit unions", "Savings cooperatives · Ministry of Agriculture and Cooperatives"],
  ["Housing credit allocation", "Thrifts, Fannie Mae, Freddie Mac", "Government Housing Bank · Secondary Mortgage Corporation"],
  ["Farm credit", "Farm Credit System", "BAAC (ธ.ก.ส.)"],
  ["Crisis recapitalisation", "TARP, 2008 · $700bn", "FIDF, 1997 · losses serviced by levies on bank deposits"],
  ["Large-value payments", "Fedwire · CHIPS", "BAHTNET"],
  ["Retail instant payments", "FedNow (2023)", "PromptPay (2017)"],
  ["Consumer credit protection", "CFPB · state usury laws", "BOT market conduct + rate caps · OCPB for hire-purchase"],
  ["Digital assets", "SEC / CFTC (contested)", "SEC Thailand · Digital Asset Decree B.E. 2561"]
];
