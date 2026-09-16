(() => {
const C = ["Case", "Case", "Case"];
const add = (id, tiers, q) => FI.extend(id, tiers, C, [Object.assign({ src: "Case" }, q)]);

add("k1", "mmm", { t: "mcq", tier: "d", q: "Why did the baht's fixed peg itself encourage the risky borrowing that brought down the finance companies?",
  o: ["It made exports uncompetitive", "Borrowers treated the peg as a guarantee against currency losses, so cheap dollar debt looked riskless: a form of moral hazard", "It raised Thai interest rates to zero", "It banned foreign borrowing"], a: 1,
  x: "An implicit promise that the exchange rate won't move removes the perceived cost of a currency mismatch. When the promise broke, every unhedged borrower was exposed at once." });

add("k2", "mem", { t: "num", tier: "m", q: "The slides say the DJIA fell 53.8% by March 2009. If it had peaked at 14,165, what level did it reach?",
  a: 6544.23, tol: 3, unit: "points",
  x: "14,165 × (1 − 0.538) = 14,165 × 0.462 = <b>6,544</b>. Multiplying by 0.538 gives the fall (7,621 points), not the level." });

add("k3", "emm", { t: "num", tier: "d", q: "Illustration: a money fund has $62.5bn of assets and 62.5bn shares at $1.00. $785m of Lehman paper is written to zero with no redemptions yet. What is the NAV per share, to 4 decimals?",
  a: 0.9874, tol: 0.0002, unit: "$",
  x: "(62.5 − 0.785) ÷ 62.5 = <b>$0.9874</b>, already below the $0.995 that rounds to $1.00. Redemptions then shrink the fund while the loss stays, so the NAV falls further. Reserve Primary reported $0.97." });

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

add("k9", "dem", { t: "num", tier: "m", q: "A Jer-Jai-Jop policy costs ฿500 and pays ฿50,000 on a positive test. Ignoring expenses and investment income, above what infection rate, in %, does the insurer lose money?",
  a: 1, tol: 0.001, unit: "%",
  x: "Break-even rate = premium ÷ payout = 500 ÷ 50,000 = <b>1%</b>. Omicron infected far more than 1% of policyholders, so the pool was never going to balance." });

add("k10", "emm", { t: "num", tier: "d", q: "Illustration: in early 1998 LTCM had roughly $4.8bn of capital supporting $125bn of balance-sheet assets. What percentage fall in asset value would wipe out its capital?",
  a: 3.84, tol: 0.01, unit: "%",
  x: "4.8 ÷ 125 = <b>3.84%</b>. That is leverage of about 26×, before counting derivatives notionals of over $1 trillion. A small adverse move becomes fatal." });

add("k11", "emm", { t: "mcq", tier: "m", q: "Greensill advanced money against <em>future</em> receivables, invoices that did not yet exist. Why does that change the risk?",
  o: ["It makes the loans safer", "Without an existing invoice owed by a third party, the loan is really unsecured credit to the client itself", "Future receivables are government guaranteed", "It turns the loan into equity"], a: 1,
  x: "Factoring is safe-ish because a creditworthy buyer owes the invoice. Remove the invoice and you are simply lending to a possibly weak company, under a label that sounds low risk." });

add("k12", "mee", { t: "mcq", tier: "e", q: "Which basic custody principle, if properly enforced, would have protected the customers of Zipmex and FTX?",
  o: ["Deposit insurance", "Segregation of client assets from the firm's own assets", "Mark-to-market accounting", "Higher trading commissions"], a: 1,
  x: "Client assets must be held separately and never lent or spent by the firm. It is the first rule of brokerage custody." });

add("k13", "mmd", { t: "mcq", tier: "d", q: "AIG posted no collateral on its credit default swaps while it was AAA-rated. Why did losing that rating turn a valuation problem into a liquidity crisis?",
  o: ["Downgrades cancel derivative contracts", "The contracts required collateral against mark-to-market losses once the rating fell, so AIG owed cash immediately on protection it had not yet paid a claim on", "Regulators seized the insurance subsidiaries", "The swaps had to be converted into equity"], a: 1,
  x: "No default had happened. The mark-to-market moved, the rating trigger fired, and AIG had to find cash it did not hold. The same distinction between solvency and liquidity runs through Lehman and SVB." });

add("k14", "mme", { t: "num", tier: "m", q: "A Thai insurer wrote ฿2,000m of premiums and faced ฿9,500m of gross flood claims, of which ฿8,300m was recovered from reinsurers. Ignoring expenses, what was its retained loss ratio, in %?",
  a: 60, tol: 0.5, unit: "%",
  x: "Retained loss = 9,500 − 8,300 = ฿1,200m, and 1,200 ÷ 2,000 = <b>60%</b>. Gross, the loss ratio was 475%. That gap is the whole purpose of a reinsurance treaty, and it is why the bill for a Thai flood is settled in Munich and Zurich." });

add("k15", "mmd", { t: "mcq", tier: "d", q: "The value-at-risk model covering the portfolio was replaced with one reporting roughly half the risk of the old one. Why is that worse than simply breaching a limit?",
  o: ["It is not worse; the numbers were still reported", "Breaching a limit is visible and triggers escalation, while changing the measure makes the exposure disappear from every report that anyone reviews", "VaR models are not used in practice", "It only affects regulatory capital"], a: 1,
  x: "A control that can be redefined by the people it constrains is not a control. This is why Chapter 7 pairs the need for controls with the need for measurement: neither survives without the other being independent." });

add("k16", "mmd", { t: "mcq", tier: "d", q: "After settling with the holdouts in 2016, Argentina regained market access and defaulted again in 2020. What does that sequence say about the lender's bargaining chip?",
  o: ["Future lending is decisive leverage over any sovereign", "The chip works only while the borrower values tomorrow's credit more than today's relief, which is exactly when a fragile sovereign does not", "Sovereign defaults cannot repeat", "Courts ultimately enforce sovereign debt"], a: 1,
  x: "Chapter 7 says the chip is weak when the currency is collapsing or the government is failing. Argentina cashed the chip in 2016 and was back in default within four years, which is the chapter's caveat playing out on schedule." });

add("k17", "mmm", { t: "num", tier: "d", q: "A thrift holds ฿1,000m of 30-year mortgages yielding 8% funded entirely by deposits. Deposit rates rise from 6% to 15%. What is its annual spread income now, in ฿ million?",
  a: -70, tol: 1, unit: "฿m",
  x: "1,000 × (8% − 15%) = <b>−฿70m</b> a year, against +฿20m before. Nothing defaulted; the mortgages still pay 8%. This is why the industry was economically insolvent in 1981, years before the bad lending began." });

add("k18", "mme", { t: "mcq", tier: "d", q: "Continental Illinois had few retail deposits because Illinois restricted branching. Why does that detail matter so much?",
  o: ["Branches are more profitable than wire transfers", "Retail deposits are small, insured and slow to move, while the wholesale funding it used instead was large, uninsured and able to leave within hours", "It meant the bank had no access to the Fed", "Branching rules set interest rates"], a: 1,
  x: "The composition of the funding decided the speed of the failure. SVB in 2023 had the same profile for a different reason: its depositors were businesses, not households, so almost none of the money was under the insured limit." });

add("k19", "emm", { t: "num", tier: "m", q: "The Dow peaked at 381 in September 1929 and bottomed at 41 in July 1932. What was the fall, in %?",
  a: 89.24, tol: 0.5, unit: "%",
  x: "(381 − 41) ÷ 381 = <b>89.2%</b>. For comparison, the 2007–09 fall was 53.8%, and it took the Dow until 1954 to regain its 1929 level." });
})();
