(() => {
const C = ["Case", "Case", "Case"];
const add = (id, tiers, q) => FI.extend(id, tiers, C, [Object.assign({ src: "Case" }, q)]);

add("k1", "mmm", { t: "mcq", tier: "d", q: "Why did the baht's fixed peg itself encourage the risky borrowing that brought down the finance companies?",
  o: ["It made exports uncompetitive", "Borrowers treated the peg as a guarantee against currency losses, so cheap dollar debt looked riskless: a form of moral hazard", "It raised Thai interest rates to zero", "It banned foreign borrowing"], a: 1,
  x: "An implicit promise that the exchange rate won't move removes the perceived cost of a currency mismatch. When the promise broke, every unhedged borrower was exposed at once." });

add("k2", "mem", { t: "mcq", tier: "m", q: "The DJIA fell about 54% from its 2007 peak to March 2009. Why does the chapter dwell on the size of that fall?",
  o: ["Because it set the size of TARP", "Because FIs held these assets: the collapse in market values ate their capital and turned market risk into insolvency risk across the system", "Because stock prices set deposit rates", "Because the Dow is itself a bank"], a: 1,
  x: "Market risk becomes insolvency risk when the assets are on leveraged balance sheets. Bear, Lehman, Merrill and AIG all went through that door." });

add("k3", "emm", { t: "mcq", tier: "d", q: "Why did a loss of roughly 1% of its assets make the Reserve Primary Fund “break the buck”?",
  o: ["Because money funds are insured only up to 1%", "Because a money fund promises a stable $1.00 NAV; once assets fell below about $0.995 per share the promise failed, and redemptions made the fall worse", "Because the SEC ordered it to close", "Because the fund held no cash"], a: 1,
  x: "The Lehman paper was written to zero, the NAV slipped below the rounding threshold, and redemptions then shrank the fund while the loss stayed. Reserve Primary reported $0.97." });

add("k4", "mem", { t: "mcq", tier: "e", q: "Which Bank of Thailand tool in March 2020 let banks provide liquidity to money market and daily fixed-income funds?",
  o: ["The Corporate Bond Stabilization Fund", "The Mutual Fund Liquidity Facility", "Raising the reserve requirement", "Deposit Protection Agency cover"], a: 1,
  x: "The MFLF channelled BOT liquidity through banks to funds facing redemptions. The ฿400bn BSF came afterwards, aimed at corporate bond rollovers." });

add("k5", "mme", { t: "mcq", tier: "d", q: "Regulators invoked a systemic-risk exception to protect <em>all</em> SVB deposits, including those far above $250,000. What is the strongest criticism?",
  o: ["It cost taxpayers nothing", "It weakens large depositors' incentive to monitor banks, signalling de facto unlimited insurance: moral hazard", "It punished small depositors", "It broke Glass-Steagall"], a: 1,
  x: "Limits exist so big, sophisticated depositors discipline risky banks. Rescuing them anyway can prevent contagion now but invites the same behaviour later." });

add("k6", "mmd", { t: "mcq", tier: "m", q: "Archegos used total return swaps instead of buying shares outright. What did this achieve?",
  o: ["It removed all market risk", "It gave the economic gains and losses of the shares with bank-provided leverage, without owning them, so large stakes stayed out of public disclosures", "It made the positions insured", "It locked in a fixed return"], a: 1,
  x: "The banks held the shares as hedges and Archegos held the swap exposure. Leverage and opacity together, which is exactly what made the unwind so violent." });

add("k7", "emm", { t: "mcq", tier: "d", q: "Why might an issuer accept an unusually high underwriting spread, and why should that worry compliance?",
  o: ["High spreads always mean the bonds are safe", "The issuer may be paying for speed, secrecy, or the underwriter taking the whole deal onto its books; but outsized fees can also hide undisclosed risks or improper payments", "Spreads are fixed by law", "It lowers the issuer's cost of capital"], a: 1,
  x: "There are legitimate reasons, but an off-market fee is a classic red flag for due diligence and anti-bribery checks. That was the 1MDB lesson." });

add("k8", "eem", { t: "mcq", tier: "d", q: "Stark's debentures were bought largely by wealthy retail investors. Why did market discipline fail to price the risk in time?",
  o: ["Retail investors can't buy debentures", "Investors relied on gatekeepers (audited accounts, arrangers, sellers' reputations) rather than their own analysis, and those signals were wrong or late", "The bonds were government guaranteed", "Credit spreads are fixed by the SET"], a: 1,
  x: "Dispersed investors free-ride on others' monitoring, the same problem Chapter 1 says FIs solve. When the gatekeepers fail, nobody is really monitoring." });

add("k9", "dem", { t: "mcq", tier: "m", q: "Jer-Jai-Jop policies paid ฿50,000 on a positive COVID test for a ฿500 premium. Why did the product fail?",
  o: ["Claims were mostly fraudulent", "The premium only covers claims if about 1% or fewer policyholders test positive; Omicron made infections far more frequent, and correlated across the whole pool", "Reinsurers refused to pay", "The OIC banned it before launch"], a: 1,
  x: "Break-even is premium ÷ payout. Pandemic claims are not independent, which is the same failure mode Chapter 6 describes for catastrophes." });

add("k10", "emm", { t: "mcq", tier: "d", q: "LTCM ran about $4.8bn of capital against $125bn of balance-sheet assets. What did that leverage mean?",
  o: ["It was safe because the assets were government bonds", "A fall of under 4% in asset values would wipe out the capital; with derivatives on top, small moves became fatal", "Regulators had approved it", "Investors could not lose money"], a: 1,
  x: "About 26× leverage before counting over $1 trillion of derivatives notionals. The trades were sensible; the capital behind them was not." });

add("k11", "emm", { t: "mcq", tier: "m", q: "Greensill advanced money against <em>future</em> receivables, invoices that did not yet exist. Why does that change the risk?",
  o: ["It makes the loans safer", "Without an existing invoice owed by a third party, the loan is really unsecured credit to the client itself", "Future receivables are government guaranteed", "It turns the loan into equity"], a: 1,
  x: "Factoring is safe-ish because a creditworthy buyer owes the invoice. Remove the invoice and you are simply lending to a possibly weak company, under a label that sounds low risk." });

add("k12", "mee", { t: "mcq", tier: "e", q: "Which basic custody principle, if properly enforced, would have protected the customers of Zipmex and FTX?",
  o: ["Deposit insurance", "Segregation of client assets from the firm's own assets", "Mark-to-market accounting", "Higher trading commissions"], a: 1,
  x: "Client assets must be held separately and never lent or spent by the firm. It is the first rule of brokerage custody." });

add("k13", "mmd", { t: "mcq", tier: "d", q: "AIG posted no collateral on its credit default swaps while it was AAA-rated. Why did losing that rating turn a valuation problem into a liquidity crisis?",
  o: ["Downgrades cancel derivative contracts", "The contracts required collateral against mark-to-market losses once the rating fell, so AIG owed cash immediately on protection it had not yet paid a claim on", "Regulators seized the insurance subsidiaries", "The swaps had to be converted into equity"], a: 1,
  x: "No default had happened. The mark-to-market moved, the rating trigger fired, and AIG had to find cash it did not hold. The same distinction between solvency and liquidity runs through Lehman and SVB." });

add("k14", "mme", { t: "mcq", tier: "m", q: "A Thai insurer's gross flood claims were several times its premiums, yet its retained loss ratio was survivable. What made the difference?",
  o: ["A government bailout", "Reinsurance: most of the gross claims were recovered from reinsurers, so only the retained share hit the insurer's own results", "Policyholders withdrew their claims", "The claims were paid over twenty years"], a: 1,
  x: "Gross, the loss ratio was in the hundreds of percent. Net, it was 60%. That gap is the purpose of a reinsurance treaty, and why the bill for a Thai flood is settled in Munich and Zurich." });

add("k15", "mmd", { t: "mcq", tier: "d", q: "The value-at-risk model covering the portfolio was replaced with one reporting roughly half the risk of the old one. Why is that worse than simply breaching a limit?",
  o: ["It is not worse; the numbers were still reported", "Breaching a limit is visible and triggers escalation, while changing the measure makes the exposure disappear from every report that anyone reviews", "VaR models are not used in practice", "It only affects regulatory capital"], a: 1,
  x: "A control that can be redefined by the people it constrains is not a control. This is why Chapter 7 pairs the need for controls with the need for measurement: neither survives without the other being independent." });

add("k16", "mmd", { t: "mcq", tier: "d", q: "After settling with the holdouts in 2016, Argentina regained market access and defaulted again in 2020. What does that sequence say about the lender's bargaining chip?",
  o: ["Future lending is decisive leverage over any sovereign", "The chip works only while the borrower values tomorrow's credit more than today's relief, which is exactly when a fragile sovereign does not", "Sovereign defaults cannot repeat", "Courts ultimately enforce sovereign debt"], a: 1,
  x: "Chapter 7 says the chip is weak when the currency is collapsing or the government is failing. Argentina cashed the chip in 2016 and was back in default within four years, which is the chapter's caveat playing out on schedule." });

add("k17", "mmm", { t: "mcq", tier: "d", q: "A thrift holds 30-year fixed-rate mortgages funded by short-term deposits. When deposit rates jumped in the early 1980s, what happened to its spread?",
  o: ["It rose, because mortgage rates rose too", "It turned negative: the asset yield was locked for decades while the funding cost repriced immediately", "Nothing; thrifts were insured", "It depended on house prices"], a: 1,
  x: "Refinancing risk at industrial scale. The whole thrift industry was one big maturity mismatch, and Regulation Q had hidden the cost until deposits could reprice." });

add("k18", "mme", { t: "mcq", tier: "d", q: "Continental Illinois had few retail deposits because Illinois restricted branching. Why does that detail matter so much?",
  o: ["Branches are more profitable than wire transfers", "Retail deposits are small, insured and slow to move, while the wholesale funding it used instead was large, uninsured and able to leave within hours", "It meant the bank had no access to the Fed", "Branching rules set interest rates"], a: 1,
  x: "The composition of the funding decided the speed of the failure. SVB in 2023 had the same profile for a different reason: its depositors were businesses, not households, so almost none of the money was under the insured limit." });

add("k19", "emm", { t: "mcq", tier: "m", q: "The Dow fell about 89% between 1929 and 1932. Which Chapter 7 chain did that set off in the banking system?",
  o: ["FX risk turning into sovereign risk", "Market losses to depositor fear to runs: liquidity risk turned into insolvency risk, with no deposit insurance to stop it", "Operational risk turning into fraud", "Off-balance-sheet risk turning into derivatives losses"], a: 1,
  x: "Roughly 9,000 banks failed in successive waves of runs. Glass-Steagall's answer, the FDIC, targeted the run itself rather than the crash." });
})();
