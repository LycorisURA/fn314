/* A sweep of US financial crises, each labelled with the Chapter 7 risk that carried it and the law that answered it. */
FI.crises = [
  { era: "1929–33", name: "The Great Crash and the banking panics", ch: [1, 2, 4],
    what: "The Dow fell about <b>89%</b> from its September 1929 peak to July 1932. Roughly <b>9,000 banks failed</b> between 1930 and 1933 in successive waves of runs, until a national bank holiday closed every bank in March 1933 so that examiners could reopen only the sound ones.",
    risk: "Liquidity risk turning into insolvency risk, with no deposit insurance to stop the run and a central bank that did not act as lender of last resort in time.",
    fix: "The <b>Banking Act of 1933 (Glass-Steagall)</b> created the FDIC, separated commercial from investment banking and introduced Regulation Q. The <b>Securities Act 1933</b> and <b>Securities Exchange Act 1934</b> added disclosure and the SEC.",
    th: "Thailand had no deposit insurance until the DPA in 2008. After 1997 it used a blanket government guarantee instead, and stepped down to the ฿1m limit only years later." },

  { era: "1974", name: "Franklin National Bank", ch: [2],
    what: "The twentieth-largest US bank failed after losses on <b>foreign exchange trading</b> and bad loans, the largest US bank failure to that date. Weeks earlier <b>Bankhaus Herstatt</b> had been closed in Germany midway through settlement, leaving counterparties who had paid Deutschmarks with no dollars in return.",
    risk: "Foreign exchange and market risk inside a commercial bank, plus settlement risk: paying one leg of a trade before receiving the other.",
    fix: "The Fed kept Franklin alive through the discount window while the FDIC arranged a sale. The episode produced the <b>Basel Committee</b> at the end of 1974, and 'Herstatt risk' is still the name for settlement risk.",
    th: "BAHTNET settles Thai large-value payments in real time precisely so that one leg cannot be paid without the other." },

  { era: "1982–89", name: "The LDC debt crisis", ch: [2],
    what: "Mexico's <b>August 1982 moratorium</b> began a wave of sovereign defaults across Latin America. The largest US money-centre banks had lent more to the region than their entire capital, on the old comfort that countries do not go bankrupt.",
    risk: "Country or sovereign risk, undiversified and concentrated. The borrowers were often solvent; the governments could not or would not transfer the currency.",
    fix: "Years of rescheduling, then the <b>Brady Plan</b> from 1989, which swapped bank loans for tradable Brady bonds and forced the losses into the open.",
    th: "Thailand's 1997 IMF programme was a rescheduling rather than a sovereign default, which is why Thai sovereign debt kept its market access." },

  { era: "1980–95", name: "The Savings and Loan crisis", ch: [2, 1],
    what: "Thrifts held <b>long fixed-rate mortgages funded by short deposits</b>. When rates spiked in 1980–81 the spread went negative and the industry was economically insolvent. Deregulation then let them chase risk, and insured deposits funded the attempt. <b>1,043 thrifts holding about $519bn of assets failed between 1986 and 1995</b>, at a total cost near <b>$160bn</b>, roughly $132bn of it public.",
    risk: "Refinancing risk first, then credit risk, then insolvency, amplified by moral hazard and by regulatory forbearance that let dead institutions keep gambling.",
    fix: "<b>FIRREA 1989</b> abolished the FSLIC and the Bank Board, created the OTS and the Resolution Trust Corporation, and raised capital standards. <b>FDICIA 1991</b> added prompt corrective action and risk-based deposit insurance premiums.",
    th: "Thailand's finance companies in 1997 tell the same story at speed: a maturity and currency mismatch, then forbearance through the FIDF, then 56 closures at once." },

  { era: "1984", name: "Continental Illinois", ch: [2],
    what: "The seventh-largest US bank had bought energy loans from the failed Penn Square Bank and funded itself with <b>uninsured wholesale and foreign deposits</b>. In May 1984 those depositors left electronically, with no queue outside any branch. The FDIC guaranteed <b>all</b> depositors and creditors and took 80% of the bank.",
    risk: "Concentrated credit risk, then liquidity risk through wholesale funding that can leave in an afternoon.",
    fix: "None immediately, and that is the point: the phrase <b>\"too big to fail\"</b> entered the language in the 1984 congressional hearings. <b>FDICIA 1991</b> later restricted such rescues to a formal systemic risk exception.",
    th: "That same systemic risk exception was used in March 2023 to cover every SVB depositor, uninsured ones included." },

  { era: "1987", name: "Black Monday", ch: [4],
    what: "On <b>19 October 1987</b> the Dow fell <b>22.6% in a single day</b>, the largest one-day percentage fall on record. Portfolio insurance strategies sold automatically into a falling market, and program trading carried the selling across index futures and cash equities at once.",
    risk: "Market risk, with liquidity vanishing in a one-way market: everyone's hedge required selling at the same moment.",
    fix: "<b>Circuit breakers</b> and trading curbs, and a one-sentence Fed statement promising to supply liquidity, which is often credited with stopping the panic.",
    th: "The SET has used a ceiling-and-floor limit on individual stocks and market-wide circuit breakers for the same reason." },

  { era: "1990", name: "Drexel Burnham Lambert", ch: [4],
    what: "The firm that built the <b>high-yield (junk) bond</b> market filed for bankruptcy in February 1990, after junk prices collapsed, its own inventory became unsaleable and it was penalised for securities law violations.",
    risk: "Credit and market risk concentrated in a single market the firm had itself created, plus the operational and legal risk of how it was run.",
    fix: "No single statute, but it ended the idea that an investment bank could safely warehouse an entire asset class it also made the market in.",
    th: "Stark Corporation's debenture investors in 2023 learned the smaller version: a market can close entirely for one class of paper." },

  { era: "1994", name: "The bond rout and Orange County", ch: [4],
    what: "The Fed roughly doubled the fed funds rate through 1994 and bond markets fell worldwide. <b>Orange County, California</b>, had borrowed through repo to lever a bet that rates would stay low, lost about <b>$1.7bn</b>, and filed the largest municipal bankruptcy to that date in December 1994.",
    risk: "Interest rate risk multiplied by leverage, in a portfolio that was supposed to be a conservative cash fund for schools and cities.",
    fix: "No federal statute, but it reshaped municipal investment rules and disclosure, and it is the standard teaching case for derivatives oversight by a governing board.",
    th: "The lesson recurs wherever a treasury function quietly becomes a trading desk, which is also the London Whale case on this page." },

  { era: "1998", name: "Long-Term Capital Management", ch: [5],
    what: "Russia's August 1998 default made LTCM's supposedly unrelated convergence trades move together. With about <b>$4.8bn of capital against $125bn of assets</b> and over $1 trillion of derivatives notional, the fund could not unwind. The New York Fed convened <b>14 firms to inject $3.6bn</b>.",
    risk: "Market risk with extreme leverage, and correlations rising towards one exactly when diversification was meant to protect the book.",
    fix: "No legislation. Disclosure and counterparty risk practices tightened, and hedge fund adviser registration eventually arrived with Dodd-Frank in 2010.",
    th: "The same arithmetic as 1997: leverage means a small adverse move is a total loss of capital." },

  { era: "2000–02", name: "The dot-com bust, Enron and WorldCom", ch: [4, 5],
    what: "The Nasdaq fell about <b>78%</b> from its March 2000 peak to October 2002. <b>Enron</b> failed in December 2001 and <b>WorldCom</b> in July 2002 on accounting fraud, and Arthur Andersen collapsed with them.",
    risk: "Market risk, plus operational and reputational risk in the gatekeepers: auditors who were also consultants, and analysts whose research helped win underwriting business.",
    fix: "<b>Sarbanes-Oxley 2002</b> on audit independence and executive certification of accounts, and the <b>2003 global research settlement</b>, $1.4bn across ten firms, separating research from investment banking.",
    th: "Chapter 4's conflict-of-interest material comes straight from this episode, and Stark shows what happens when Thai gatekeepers miss the same signals." },

  { era: "2007–09", name: "The global financial crisis", ch: [1, 2, 4, 5, 6],
    what: "Subprime lending under <b>originate-to-distribute</b>, packaged into securities and funded with overnight repo. Bear Stearns went to JPMorgan in March 2008; Fannie Mae and Freddie Mac were seized, Lehman filed and AIG was rescued in September 2008. The DJIA was down <b>53.8%</b> from its peak by March 2009.",
    risk: "Every category at once: credit risk in the loans, market risk in the securities, liquidity risk in repo, off-balance-sheet risk in the conduits, and insolvency at the end of it.",
    fix: "<b>TARP</b>, $700bn, and an $827bn stimulus, then <b>Dodd-Frank 2010</b>: the FSOC, the CFPB, the Volcker rule, central clearing for many derivatives and the Federal Insurance Office.",
    th: "Thailand's banks held little US mortgage paper and came through the direct hit well. The damage arrived through exports and the 2011 floods that followed." },

  { era: "2023", name: "The regional bank failures", ch: [2],
    what: "<b>Silicon Valley Bank</b> failed on 10 March, <b>Signature Bank</b> on 12 March and <b>First Republic</b> on 1 May. SVB held long-dated Treasuries and mortgage securities carrying large unrealised losses, against deposits that were overwhelmingly uninsured and concentrated in one industry that talked to itself.",
    risk: "Interest rate risk sitting quietly as an unrealised loss, realised by a liquidity run, ending as insolvency. Chapter 7's interdependency example, live.",
    fix: "A systemic risk exception covering all deposits, and the Fed's <b>Bank Term Funding Program</b> lending against securities at par rather than market value. The 2018 rollback of supervision thresholds for mid-sized banks remains contested.",
    th: "Thai banks are funded overwhelmingly by retail deposits under the ฿1m DPA limit, which is a slower and stickier funding base than SVB's." }
];
