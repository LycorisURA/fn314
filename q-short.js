/* Written short answers. Each carries its marking points, the keywords the local marker looks for, and a model answer.
   The marker checks language, not understanding, so the student can overrule it. Appended last, never reordered. */
(() => {
const add = (id, more) => FI.extend(id, "", [], more.map(q => Object.assign({ t: "sa", src: "Written" }, q)));

add("c1", [
  { tier: "m", q: "A saver could lend directly to a company instead of putting money in a bank. Name the three costs Chapter 1 says they would face, and explain what the bank does about each.",
    points: [
      { p: "Monitoring costs: checking the borrower is expensive, and one small saver cannot justify it", kw: ["monitor", "screen", "information cost"] },
      { p: "Liquidity costs: a direct long-term claim is hard to turn back into cash", kw: ["liquid", "hard to sell", "tie.{0,6}up", "get.{0,10}money back"] },
      { p: "Price risk: selling a claim early may mean selling below what was paid", kw: ["price risk", "fall in (value|price)", "sell.{0,25}(less|lower|discount|loss)", "market value"] },
      { p: "The FI absorbs all three through delegated monitoring, diversification and issuing its own liquid claims", kw: ["divers", "delegat", "asset transform", "issues? (its|their) own", "deposit"] }
    ],
    model: "Lending directly means bearing monitoring costs, because the saver must investigate the borrower and cannot spread that cost over a large loan; liquidity costs, because a long-term claim cannot be converted to cash on demand; and price risk, because selling early may realise less than was paid. An FI takes all three on: as delegated monitor it has the scale and incentive to investigate, and by diversifying across many borrowers it can issue its own liquid, low-risk claims, such as deposits, against illiquid risky assets.",
    x: "These three costs are the whole reason the chapter says FIs are special. Every later chapter is a variation on how a particular institution absorbs them." },
  { tier: "m", q: "Deposit insurance almost eliminated US bank runs after 1934. Explain the benefit and the cost it introduced, using a US example of the cost.",
    points: [
      { p: "The benefit: depositors no longer need to run, because arriving late costs them nothing", kw: ["run", "panic", "first", "queue", "withdraw"] },
      { p: "The cost is moral hazard: insured depositors stop monitoring, so a weak institution can still raise funds", kw: ["moral hazard", "stop monitor", "no incentive to monitor", "less.{0,15}discipline", "market discipline"] },
      { p: "The Savings and Loan crisis is the example: insolvent thrifts kept taking insured deposits and gambling", kw: ["s&l", "savings and loan", "thrift", "1980s", "continental", "silicon valley|svb"] },
      { p: "Answers include coverage limits, risk-based premiums and prompt corrective action", kw: ["limit", "risk.based", "premium", "prompt corrective", "capital requirement", "250,?000", "1 ?m|฿1"] }
    ],
    model: "Insurance removes the first-mover advantage that makes running rational, so the 1930s pattern of panics stopped almost overnight. The cost is moral hazard: an insured depositor has no reason to check the bank, so market discipline disappears and a weak institution can still fund itself. The Savings and Loan crisis is the clearest example, where thrifts with no equity left kept raising insured deposits and betting them. Regulators answer with coverage limits, risk-based premiums, capital requirements and prompt corrective action.",
    x: "Chapter 1 presents guaranty funds as a safety-and-soundness tool, and this is the trade-off that comes with them. Thailand's DPA caps cover at ฿1m per depositor per bank for the same reason the US caps it at $250,000." },
  { tier: "d", q: "Explain what it means to call a financial institution a <em>delegated monitor</em>, and why that solves the free-rider problem.",
    points: [
      { p: "Thousands of small investors each hold too little to justify the cost of monitoring the borrower", kw: ["small", "each", "too little", "individual", "cost of monitor"] },
      { p: "So each hopes someone else will do it: the free-rider problem, which leaves the borrower unmonitored", kw: ["free.?rid", "someone else", "nobody monitors", "agency cost"] },
      { p: "Savers delegate the job to the FI, which holds one large claim and therefore has the incentive", kw: ["delegat", "one large", "large (loan|claim|stake)", "incentive"] },
      { p: "The FI also has economies of scale in gathering information, and gains inside information from the relationship", kw: ["economies of scale", "scale", "inside information", "relationship", "repeat"] },
      { p: "Short-term renewable loan contracts keep the borrower under continuing control", kw: ["short.term", "renew", "roll", "control", "covenant"] }
    ],
    model: "When a firm's debt is spread across thousands of small investors, no single holder gains enough from monitoring to justify its cost, so each free-rides on the others and nobody monitors at all. Savers instead delegate the task to an FI that holds one large claim and therefore has the full incentive to investigate and supervise. The FI also enjoys economies of scale in gathering information, learns private information through the ongoing relationship, and can use short-term renewable contracts to keep the borrower in line.",
    x: "The word delegated is doing the work: the monitoring still has to happen, and the FI exists because concentrating it in one place is cheaper than everyone doing it badly." }
]);

add("c2", [
  { tier: "m", q: "Two banks report the same ROE. Using the DuPont decomposition, explain how their risk could still be completely different.",
    points: [
      { p: "ROE = ROA × equity multiplier, so the same ROE can come from different combinations", kw: ["roa", "equity multiplier", "\\bem\\b", "return on assets", "leverage"] },
      { p: "One bank earns it from profitability: a higher ROA on the assets themselves", kw: ["roa", "profit", "margin", "asset utilis|asset utiliz", "earn"] },
      { p: "The other earns it from leverage: a thin slice of equity funding the same assets", kw: ["leverag", "\\bthin\\b", "borrow", "less equity", "low.{0,10}equity", "multiplier"] },
      { p: "Leverage magnifies losses as well as gains, so a small asset fall can wipe out the equity", kw: ["magnif", "wipe", "loss", "amplif", "small (fall|decline|drop)"] }
    ],
    model: "ROE is ROA multiplied by the equity multiplier, so an identical ROE can be produced either by earning a high return on the assets or by funding ordinary assets with very little equity. The first bank is profitable; the second is merely leveraged. Because leverage multiplies losses as well as gains, the second bank can be destroyed by an asset fall the first would absorb, which is why the equity multiplier deserves as much attention as the headline return.",
    x: "Run the two side by side in the DuPont Bench lab: an equity multiplier above about 15 means under 6.7% of assets is equity." },
  { tier: "d", q: "Set out the sequence of events that produced the US Savings and Loan crisis, from the interest rate shock to the legislative response.",
    points: [
      { p: "Thrifts held long fixed-rate mortgages funded by short deposits: a maturity mismatch", kw: ["mismatch", "long.{0,20}(mortgage|asset)", "short.{0,20}deposit", "borrow short", "fixed.rate"] },
      { p: "Short rates rose sharply around 1980–81, so the spread turned negative and the industry was economically insolvent", kw: ["rate.{0,20}(rose|rise|spike|increase|up)", "negative spread", "insolven", "1980", "15%", "spread"] },
      { p: "Deregulation then let thrifts into riskier lending they had never underwritten", kw: ["deregulat", "garn", "didmca", "new (lending|business)", "commercial real estate", "riskier"] },
      { p: "Insured deposits plus regulatory forbearance created moral hazard: dead institutions kept gambling", kw: ["moral hazard", "forbear", "insured deposit", "gambl", "kept open", "zombie"] },
      { p: "FIRREA 1989 cleaned up and FDICIA 1991 added prompt corrective action and risk-based premiums", kw: ["firrea", "fdicia", "prompt corrective", "risk.based", "resolution trust", "1989", "1991"] }
    ],
    model: "Thrifts funded thirty-year fixed-rate mortgages with short deposits, so when the Fed pushed short rates above 15% around 1980 the spread went negative and the industry lost its capital before a single borrower defaulted. Deregulation under DIDMCA and Garn-St Germain then allowed thrifts into commercial property and other unfamiliar lending, funded by insured deposits, while regulators forbore rather than closing insolvent institutions. With no equity left the owners were gambling with the insurance fund's money, and roughly 1,043 thrifts eventually failed at a cost near $160bn. FIRREA 1989 abolished the FSLIC and created the RTC, and FDICIA 1991 introduced prompt corrective action and risk-based premiums to stop the forbearance repeating.",
    x: "This is Chapter 7's interdependency argument told across fifteen years: interest rate risk created the hole, credit risk deepened it, and moral hazard kept it open." },
  { tier: "m", q: "Explain what \"too big to fail\" means and why it is a problem, referring to Continental Illinois in 1984.",
    points: [
      { p: "An institution large or interconnected enough that authorities feel forced to rescue it", kw: ["large", "big", "interconnect", "systemic", "forced to rescue", "cannot.{0,15}fail", "collapse.{0,20}(other|system)"] },
      { p: "Continental Illinois in 1984: the FDIC protected all depositors and creditors, not only insured ones", kw: ["continental", "1984", "all depositors", "uninsured", "fdic", "guarantee"] },
      { p: "The implicit guarantee is a subsidy: such a bank borrows more cheaply than its own risk deserves", kw: ["subsid", "cheap", "implicit", "lower.{0,15}(cost|rate)", "funding advantage"] },
      { p: "It removes market discipline, so large creditors stop monitoring and more risk gets taken", kw: ["market discipline", "monitor", "moral hazard", "more risk", "incentive"] },
      { p: "FDICIA 1991 restricted such rescues to a formal systemic risk exception", kw: ["fdicia", "systemic risk exception", "1991", "restrict", "dodd.frank", "resolution"] }
    ],
    model: "A bank is too big to fail when its collapse would damage enough of the system that the authorities feel compelled to rescue it. Continental Illinois in 1984 is the origin: the FDIC guaranteed every depositor and creditor, insured or not, because hundreds of smaller banks held correspondent balances there. The problem is that the implicit guarantee is an unpriced subsidy, letting such a bank raise money more cheaply than its risk warrants and removing the incentive for large creditors to monitor it at all. FDICIA 1991 responded by restricting such support to a formal systemic risk exception, the same exception used for SVB in 2023.",
    x: "The phrase was coined in the 1984 congressional hearings on this rescue. Everything since, from FDICIA to Dodd-Frank's resolution planning, is an attempt to make the promise less automatic." }
]);

add("c3", [
  { tier: "m", q: "Explain why a \"3% flat rate\" hire-purchase loan costs far more than 3% a year.",
    points: [
      { p: "A flat rate charges interest on the original principal for the whole term", kw: ["original", "full (amount|principal)", "whole (term|amount)", "entire", "initial principal"] },
      { p: "But the borrower repays principal every month, so the amount actually owed falls steadily", kw: ["repay", "reduc", "falls", "declin", "outstanding", "balance"] },
      { p: "The average balance outstanding is roughly half the original, so the true rate is close to double", kw: ["half", "double", "twice", "average balance", "roughly 2"] },
      { p: "The effective rate is the monthly rate that discounts the instalments back to the amount financed", kw: ["effective", "irr", "present value", "discount", "annuity"] }
    ],
    model: "A flat rate applies interest to the amount originally borrowed for every year of the term, even though the borrower repays part of that principal every month. Since the balance actually outstanding falls steadily to zero, the average amount owed is roughly half the original, so the true cost is close to twice the quoted rate: 3% flat over four years works out near 5.7% effective. The effective rate is found by solving for the monthly rate that discounts the instalments back to the amount financed.",
    x: "Thailand's OCPB caps hire-purchase in <em>effective</em> terms precisely because a flat quote is not comparable to anything else. Try it in the Flat-Rate X-Ray." },
  { tier: "m", q: "Why do finance companies hold more capital relative to assets than commercial banks do?",
    points: [
      { p: "They take no deposits, so they have no deposit insurance behind their funding", kw: ["no deposit", "not.{0,15}deposit", "without deposit", "no insurance", "uninsured"] },
      { p: "They have no routine access to a central bank as lender of last resort", kw: ["lender of last resort", "central bank", "no safety net", "safety net", "discount window"] },
      { p: "They fund themselves in the market, mainly commercial paper and notes, which must be rolled over", kw: ["commercial paper", "\\bcp\\b", "market fund", "debenture", "bond", "roll"] },
      { p: "So they must signal soundness to those lenders: market discipline does the job regulation does for banks", kw: ["signal", "market discipline", "confidence", "investors demand", "reassure", "14.3"] }
    ],
    model: "Finance companies take no deposits, so they have neither deposit insurance nor routine access to a lender of last resort. Their funding is commercial paper, notes and bonds that have to be rolled over in the market, and those lenders can simply refuse. With no safety net, the firm has to signal soundness itself, and a thicker equity cushion is the signal: about 14.3% of assets against 11.5% for banks in 2012. Market discipline is doing the work that regulation does for a depository.",
    x: "It is the same logic in reverse as the deposit insurance trade-off: less implicit support means more private monitoring, and more private monitoring means more capital." },
  { tier: "d", q: "Thailand's 1997 finance company collapse and the US Savings and Loan crisis both began with a mismatch. Explain what was the same and what was different.",
    points: [
      { p: "Both funded long, illiquid assets with much shorter money: a maturity mismatch", kw: ["maturity mismatch", "mismatch", "short.{0,25}long", "borrow short", "roll"] },
      { p: "In the S&L case the shock was purely domestic interest rates rising against fixed-rate mortgages", kw: ["interest rate", "rates rose", "fixed.rate", "mortgage", "domestic"] },
      { p: "Thailand added a currency mismatch: dollar liabilities against baht assets, unhedged", kw: ["currency mismatch", "dollar", "baht", "foreign", "unhedged", "\\bfx\\b", "exchange rate"] },
      { p: "Thai finance companies had no deposit insurance, so the run came from wholesale and offshore lenders", kw: ["no deposit insurance", "wholesale", "offshore", "promissory", "creditors refused", "roll over"] },
      { p: "Both were prolonged by forbearance and both ended with the public paying: the RTC and the FIDF", kw: ["forbear", "fidf", "rtc", "resolution trust", "taxpayer", "public", "bailout"] }
    ],
    model: "Both industries funded long, illiquid assets with much shorter money, so both were destroyed by a repricing they could not pass on. The difference is what moved. For the thrifts it was domestic interest rates rising against thirty-year fixed mortgages, a pure interest rate risk. Thai finance companies added a currency mismatch on top, holding baht assets against unhedged short-term dollar debt, so the float of the baht doubled their liabilities while their borrowers were already defaulting. The thrifts' funding was insured and therefore slow; Thailand's was wholesale and offshore and left immediately. Both were prolonged by forbearance and both ended with the public paying, through the RTC and through FIDF levies still collected on Thai deposits.",
    x: "Chapter 7's point exactly: the same structural weakness, carried by different risks, arriving at the same place." }
]);

add("c4", [
  { tier: "m", q: "Distinguish firm commitment from best efforts underwriting, and say who carries the risk in each.",
    points: [
      { p: "In a firm commitment the underwriter buys the whole issue from the issuer at a set price", kw: ["buys", "purchase", "takes.{0,15}(whole|entire|all)", "guarantee", "set price", "agreed price"] },
      { p: "The issuer's proceeds are certain, and unsold shares are the underwriter's loss", kw: ["issuer.{0,25}(certain|guaranteed|knows|receives)", "unsold", "underwriter.{0,20}loss", "bears the risk", "own book"] },
      { p: "In best efforts the underwriter acts as agent and sells only what it can", kw: ["best effort", "agent", "as much as", "tries", "no guarantee"] },
      { p: "Unsold shares go back to the issuer, so the issuer bears the price and quantity risk", kw: ["returned", "back to the issuer", "issuer bears", "issuer.{0,25}risk", "raises less"] }
    ],
    model: "Under a firm commitment the underwriter buys the entire issue at an agreed price and resells it, so the issuer knows exactly what it will raise and any shares that do not sell are the underwriter's own loss. Under best efforts the underwriter acts only as the issuer's agent, selling what it can for a fee, and whatever does not sell is returned. The risk therefore sits with the underwriter in a firm commitment and with the issuer under best efforts, which is why firm commitments command a larger spread.",
    x: "The Underwriting Desk lab prices both: drag demand down and watch the loss move from one party to the other." },
  { tier: "d", q: "Why did the 2003 global research settlement happen, and what did it change?",
    points: [
      { p: "Analysts' research was used to win and support the firm's underwriting business", kw: ["underwriting", "investment bank", "win business", "client", "issuer"] },
      { p: "That is a conflict of interest: the analyst is pressured to stay positive about banking clients", kw: ["conflict of interest", "pressure", "positive", "biased", "buy rating", "not objective"] },
      { p: "The dot-com bust exposed it, with recommendations that contradicted analysts' private views", kw: ["dot.?com", "bubble", "2000", "burst", "bust", "internet", "private (view|email)"] },
      { p: "Ten firms settled for about $1.4bn", kw: ["1\\.4", "\\$1.4", "ten firms", "10 firms", "settlement"] },
      { p: "Research was separated from investment banking, and analyst pay may not be tied to banking revenue", kw: ["separat", "wall", "barrier", "independen", "not.{0,20}(paid|tied|linked)", "compensation"] }
    ],
    model: "Equity research had become a tool for winning underwriting mandates, so analysts were under pressure to publish favourable views on companies their firm banked. When the dot-com bubble burst, investigations showed recommendations that contradicted what analysts privately thought, and in 2003 ten firms settled for about $1.4bn. The settlement separated research from investment banking, barred analyst pay from being tied to banking revenue and required disclosure of conflicts, which is why those functions still sit behind information barriers.",
    x: "Chapter 4 lists the state attorneys-general action and the settlement in its regulation section. Stark in 2023 shows what happens when gatekeepers in a different market fail the same way." },
  { tier: "m", q: "Explain why repo funding destroyed Bear Stearns and Lehman Brothers in 2008.",
    points: [
      { p: "Broker-dealers financed large securities inventories with very short-term repo, often overnight", kw: ["repo", "overnight", "short.term", "inventor", "fund.{0,20}position"] },
      { p: "Their capital was thin relative to assets, so leverage was very high", kw: ["\\bthin\\b", "leverag", "little capital", "low capital", "capital.{0,20}small"] },
      { p: "When lenders doubted the mortgage collateral they demanded more margin or refused to roll at all", kw: ["collateral", "haircut", "margin", "refus", "doubt", "would not roll", "stopped lending"] },
      { p: "Funding disappeared in days, forcing asset sales into a falling market", kw: ["days", "quickly", "fire sale", "forced.{0,15}sell", "sell.{0,20}(cheap|low|falling)"] },
      { p: "A liquidity problem became insolvency, and neither could be funded without a buyer or a rescue", kw: ["liquidity", "insolven", "solvency", "bankrupt", "rescue", "jpmorgan", "buyer"] }
    ],
    model: "Investment banks funded their securities inventories in the repo market, often rolling the borrowing overnight, against very thin capital. Once lenders doubted the mortgage collateral they raised haircuts and then refused to roll at all, so funding that had looked permanent disappeared within days. That forced sales into a market with no buyers, which realised the losses and converted a liquidity problem into insolvency. Bear Stearns was sold to JPMorgan with Fed support and Lehman, finding no buyer, filed on 15 September 2008.",
    x: "Chapter 4 notes that securities firms hold far less capital than banks, and Chapter 7 supplies the sequence. The same chain, with deposits instead of repo, is SVB." }
]);

add("c5", [
  { tier: "m", q: "Define NAV, and explain why a closed-end fund can trade at a persistent discount to it while an open-end fund cannot.",
    points: [
      { p: "NAV is (market value of assets − liabilities) ÷ units outstanding, marked to market daily", kw: ["assets?.{0,20}liabilit", "minus liabilit", "divided by", "per (unit|share)", "mark.{0,10}to.{0,10}market"] },
      { p: "An open-end fund issues and redeems units at NAV on demand", kw: ["open.end", "redeem", "issue", "on demand", "at nav"] },
      { p: "That redemption right is an arbitrage anchor: any gap can be closed by buying or redeeming", kw: ["arbitrage", "anchor", "force", "pull.{0,15}back", "cannot deviate", "close the gap"] },
      { p: "A closed-end fund has a fixed number of shares and no redemption right, so its price is set by demand for the shares themselves", kw: ["fixed", "closed.end", "no redemption", "cannot redeem", "supply and demand", "market price", "sentiment"] }
    ],
    model: "NAV is the market value of the fund's assets less its liabilities, divided by the units outstanding, recalculated daily. An open-end fund issues and redeems units at that NAV on demand, and that right is an arbitrage anchor: if the price drifted from NAV anyone could buy or redeem to capture the difference. A closed-end fund has a fixed share count and no redemption right, so nothing forces its price back, and the shares trade on demand for the fund itself, which can leave a discount in place for years.",
    x: "Fees, illiquid holdings, tax overhangs and simple doubt about the valuations all show up in a closed-end discount, because nothing can arbitrage them away." },
  { tier: "d", q: "Explain how the Reserve Primary Fund broke the buck in September 2008, and why it mattered far beyond that one fund.",
    points: [
      { p: "Money market funds maintain a stable $1 share price and are marketed as nearly as safe as deposits, but are uninsured", kw: ["\\$1", "stable", "one dollar", "uninsured", "not insured", "like.{0,15}deposit"] },
      { p: "The fund had reached for yield by holding Lehman commercial paper", kw: ["lehman", "commercial paper", "\\bcp\\b", "reach.{0,10}for yield", "yield"] },
      { p: "Lehman's failure forced that paper to be written down and the NAV fell to $0.97", kw: ["0\\.97", "97", "written down", "wrote.{0,10}(off|down)", "below.{0,10}(\\$1|par|one)", "broke the buck"] },
      { p: "Investors then ran from prime funds generally, because nobody knew which fund held what", kw: ["run", "redeem", "withdraw", "other funds", "contagion", "prime fund", "spread"] },
      { p: "The commercial paper market froze, cutting off finance companies and corporations that funded there", kw: ["froze", "frozen", "commercial paper market", "funding dried", "could not (issue|roll)", "finance compan", "corporat"] }
    ],
    model: "Money market funds hold their share price at $1 and are sold as near-deposit substitutes, but they carry no insurance. The Reserve Primary Fund had reached for yield with Lehman commercial paper, and when Lehman failed that holding had to be written down, pushing NAV to $0.97 and breaking the promise. Investors immediately pulled money from prime funds generally, because the disclosure did not tell them which other fund held similar paper, and the run froze the commercial paper market that finance companies and corporations relied on for daily funding. The Treasury announced a temporary guarantee for money market funds within days.",
    x: "Chapter 5 uses it for MMMF liquidity risk and Chapter 3 for what happens to CP issuers when that market closes. Bangkok's March 2020 daily-fund run is the same mechanism with Thai corporate bonds." },
  { tier: "m", q: "Explain why the average actively managed fund underperforms a low-cost index fund.",
    points: [
      { p: "Active investors in aggregate hold the market, so before costs they earn the market return", kw: ["aggregate", "in total", "collectively", "taken together", "as a group", "all investors", "own the (whole|entire) market", "average.{0,20}market"] },
      { p: "Each active baht's gain is another active baht's loss: it is a zero-sum game before costs", kw: ["zero.?sum", "one.{0,30}(gain|win|outperform).{0,30}(loss|lose|another|other|shortfall)", "cancel", "offset", "someone else.{0,20}(loss|lose)"] },
      { p: "Fees, trading costs and taxes are then subtracted from that same market return", kw: ["fee", "cost", "expense", "trading", "tax", "commission"] },
      { p: "So the average active fund must lag the index by roughly the fee gap, even though some individual funds win", kw: ["lag", "trail", "underperform", "behind", "by.{0,25}(fee|cost)", "(some|individual|certain).{0,25}(win|beat)", "not predict", "in advance"] }
    ],
    model: "Taken together, active investors own the whole market, so as a group they must earn the market return before costs; one manager's outperformance is necessarily another's shortfall. Their fees, trading costs and tax drag are then deducted from that same return, so the average actively managed baht must trail a low-cost index fund by roughly the difference in costs. Individual managers do beat the index, but identifying them in advance is the part that does not work reliably.",
    x: "The Fee Drag lab shows the compounding: a 1.25% annual gap over twenty years is far larger than 25% of the return." }
]);

add("c6", [
  { tier: "m", q: "Distinguish adverse selection from moral hazard in insurance, and give the tool an insurer uses against each.",
    points: [
      { p: "Adverse selection happens before the contract: those most likely to claim are the keenest to buy", kw: ["before", "buy", "purchase", "selection", "sicker|riskier.{0,25}(buy|apply|keen)", "higher risk.{0,25}(buy|insur)"] },
      { p: "It is answered by underwriting and by sorting applicants into priced risk pools", kw: ["risk pool", "underwrit", "sort", "group", "screen", "medical", "waiting period", "price.{0,15}separate"] },
      { p: "Moral hazard happens after the contract: having cover changes the insured's behaviour", kw: ["after", "behaviour|behavior", "less careful", "careless", "change.{0,20}(how|behav)", "reckless"] },
      { p: "It is answered by deductibles, co-payments and experience rating such as a no-claims bonus", kw: ["deductible", "excess", "co.?pay", "no.?claims", "experience rating", "bonus"] }
    ],
    model: "Adverse selection occurs at the point of purchase: the people most likely to claim are the most eager to buy, so pricing from general-population data loses money. Insurers answer it by underwriting and by grouping applicants into risk pools that are priced separately. Moral hazard occurs after cover is in place, when the insured takes less care because the loss is no longer theirs. Insurers answer that by leaving the policyholder with a stake, through deductibles, co-payments and experience rating such as a no-claims bonus.",
    x: "The test is simply when it happens. Before the contract is signed, it is selection; after, it is behaviour." },
  { tier: "m", q: "Explain the difference between the combined ratio and the operating ratio, and why an insurer needs both.",
    points: [
      { p: "The combined ratio is the loss ratio plus the expense ratio, after policyholder dividends", kw: ["loss ratio", "expense ratio", "plus", "add", "sum", "dividend"] },
      { p: "Above 100 it means premiums did not cover claims and costs: an underwriting loss", kw: ["above 100", "over 100", "greater than 100", "underwriting loss", "insufficient", "not cover"] },
      { p: "The operating ratio subtracts the investment yield earned on premiums held before claims are paid", kw: ["investment (yield|income|return)", "subtract", "minus", "less the", "operating ratio"] },
      { p: "So an insurer can lose money underwriting and still have a profitable year, which makes credit and interest rate risk on the portfolio central", kw: ["still.{0,25}profit", "can be profitable", "credit risk", "interest rate risk", "investment.{0,25}(matter|important|central)"] }
    ],
    model: "The combined ratio adds the loss ratio to the expense ratio, plus any policyholder dividends, and measures the underwriting business alone: above 100 the premiums did not cover claims and costs. The operating ratio then subtracts the investment yield earned on the reserves the insurer holds between collecting premiums and paying claims. Because that investment income routinely rescues an underwriting loss, the operating ratio is the number that says whether the year made money, and it is why P&C managers have to manage credit and interest rate risk on the portfolio as carefully as underwriting risk.",
    x: "A 104% combined ratio with a 7% yield is a 97% operating ratio: a profitable year on a loss-making book. Try it in the Underwriting Ledger." },
  { tier: "d", q: "Why do property and casualty insurers hold more liquid assets and more capital than life insurers?",
    points: [
      { p: "Life claims are long-dated and statistically smooth, so long assets can be matched to them", kw: ["long", "predictab", "smooth", "mortality", "match", "stable", "slow"] },
      { p: "P&C writes high-severity, low-frequency lines such as earthquake, hurricane and financial guaranty", kw: ["high.severity", "low.frequency", "catastroph", "earthquake", "hurricane", "flood", "severity"] },
      { p: "In those lines claims are not independent: one event triggers a great many policies at once", kw: ["not independent", "correlat", "same (event|time)", "at once", "simultan", "together"] },
      { p: "So claims arrive suddenly and in bulk, and assets may have to be sold quickly", kw: ["sudden", "lump", "bulk", "quickly", "at once", "immediate", "payable now", "one bill", "all at the same time", "sell.{0,20}(fast|quick)", "timing.{0,25}uncertain"] },
      { p: "That uncertainty requires shorter assets and a larger capital and reserve cushion", kw: ["short.term asset", "liquid", "capital", "reserve", "cushion", "buffer"] }
    ],
    model: "A life insurer's claims are long-dated and statistically smooth, so it can hold long assets matched against them. A P&C insurer writes lines such as earthquake, hurricane and financial guaranty where losses are rare but enormous, and where claims are not independent: a single catastrophe turns thousands of separate policies into one bill payable now. Because the timing and size are both uncertain, the P&C insurer has to keep more of its portfolio short and liquid and carry a larger capital and reserve cushion than a life insurer of the same size.",
    x: "The 2011 Thai floods are the case: seven industrial estates under water within weeks, so pooling gave no protection at all." }
]);

add("c7", [
  { tier: "m", q: "Explain refinancing risk and reinvestment risk, and say which direction rates must move to hurt in each case.",
    points: [
      { p: "Refinancing risk: the liability is shorter than the asset, so funding must be rolled at an unknown rate", kw: ["liabilit.{0,30}short", "fund.{0,20}short", "borrow short", "roll", "refinanc"] },
      { p: "There, rising rates hurt, because the asset yield is locked while the funding cost climbs", kw: ["ris(e|ing)", "increase", "higher rate", "up", "rates go up"] },
      { p: "Reinvestment risk: the asset is shorter than the liability, so proceeds must be reinvested", kw: ["asset.{0,30}short", "reinvest", "matures first", "proceeds"] },
      { p: "There, falling rates hurt, because the funding cost is locked while the new asset yield drops", kw: ["fall", "lower", "decline", "drop", "rates go down"] }
    ],
    model: "Refinancing risk arises when the liability matures before the asset, so the FI must roll its funding at whatever rate then prevails; the asset yield is locked, so rising rates squeeze and eventually invert the spread. Reinvestment risk is the mirror image: the asset matures first and the proceeds must be reinvested while the funding cost stays fixed, so here it is falling rates that destroy the spread. Both come from the same maturity mismatch, and which one you have depends only on which side is shorter.",
    x: "The Mismatch Desk's two presets are deliberately symmetrical: both start at a 4% spread and end at −0.5%, one from funding rising and one from asset yields falling." },
  { tier: "d", q: "Trace the chain of risks that destroyed Silicon Valley Bank in 2023, naming each risk in turn.",
    points: [
      { p: "Interest rate risk: long-dated bonds bought at low yields lost market value when rates rose", kw: ["interest rate risk", "rates rose", "bond", "treasur", "duration", "long.dated", "market value"] },
      { p: "The loss was unrealised, so the bank looked solvent while the economic hole was already there", kw: ["unrealis|unrealiz", "paper loss", "held to maturity", "not.{0,15}recognis|recogniz", "on paper"] },
      { p: "Its deposits were large, uninsured and concentrated in one industry that talked to itself", kw: ["uninsured", "concentrat", "one (industry|sector)", "tech", "venture", "large deposit"] },
      { p: "Liquidity risk: those depositors ran, forcing securities to be sold", kw: ["run", "withdrew", "liquidity", "forced.{0,15}sell", "fire sale", "sold"] },
      { p: "Selling realised the loss, so insolvency risk was the result: the chain, not one risk, killed it", kw: ["realis|realiz", "insolven", "wiped", "capital", "chain", "interdepend", "interact"] }
    ],
    model: "SVB held long-dated Treasuries and mortgage securities bought at low yields, so when rates rose their market value fell sharply: interest rate risk. The loss was unrealised and largely hidden in held-to-maturity accounting, so the bank still looked solvent. Its funding was the weak point: deposits that were overwhelmingly uninsured and concentrated in one tightly networked industry. When those depositors moved, liquidity risk forced the securities to be sold, selling realised the loss that had until then been theoretical, and insolvency followed within days. No single risk explains it; the chain does.",
    x: "This is exactly the interdependency the chapter closes on: one risk on Monday and a different one on the death certificate." },
  { tier: "m", q: "Why can a financial institution not simply remove interest rate risk by matching the maturities of its assets and liabilities?",
    points: [
      { p: "Matching maturities would be a balance sheet hedge and would indeed remove the mismatch", kw: ["hedge", "balance sheet", "remove", "eliminat", "match"] },
      { p: "But it is inconsistent with the asset transformation function the FI exists to perform", kw: ["asset transform", "function", "what.{0,25}(they do|it does)", "purpose", "business model", "inconsistent"] },
      { p: "Savers want short, liquid, low-risk claims while borrowers want long-term funding", kw: ["saver", "depositor", "short.{0,20}liquid", "borrower.{0,25}long", "long.term (loan|fund)"] },
      { p: "Bridging that gap is the service being sold, so matching perfectly means refusing to provide it", kw: ["service", "paid", "bridge", "gap", "earn", "spread", "refus", "give up"] }
    ],
    model: "Matching maturities on both sides would be a balance sheet hedge and would genuinely remove the exposure, but it is inconsistent with the asset transformation function the institution exists to perform. Savers want claims that are short, liquid and low-risk; borrowers want funding that is long and committed. Bridging that gap is the service the FI is paid for, and the spread it earns is the payment. An FI that matched perfectly would have eliminated the risk and the business along with it, which is why the risk is managed rather than removed.",
    x: "Chapter 1 sets up the demand, Chapter 7 names the cost. Duration matching and hedging in Chapters 8 and 9 are the compromise." },
  { tier: "d", q: "Sovereign risk is described as a type of credit risk. Explain what makes it harder to manage than ordinary credit risk.",
    points: [
      { p: "The obstruction is governmental rather than commercial: controls, moratoria or outright prohibition", kw: ["government", "exchange control", "capital control", "moratorium", "prohibit", "restrict", "transfer"] },
      { p: "A perfectly creditworthy borrower can still be blocked, so screening the borrower does not find it", kw: ["creditworth", "solvent", "willing and able", "good borrower", "still.{0,25}(block|cannot|unable)", "screening"] },
      { p: "There is no usual recourse through the courts, because a country cannot be wound up or liquidated", kw: ["court", "recourse", "legal", "wound up", "liquidat", "bankrupt", "enforce", "seiz"] },
      { p: "The lender's remaining leverage is the future supply of loans", kw: ["future", "further lending", "supply of loans", "market access", "bargaining", "leverage", "cut off"] },
      { p: "That leverage is weakest exactly when it is needed, if the currency is collapsing or the government failing", kw: ["weak", "collaps", "failing", "worthless", "little value", "when.{0,25}need", "desperate"] }
    ],
    model: "Sovereign risk produces the same loss as a default, but the cause is a government blocking payment rather than a borrower being unable to pay, so analysing the borrower will never reveal it: a solvent, willing company under exchange controls cannot transfer the money. It is harder to remedy because there is no ordinary recourse through the courts, since a country cannot be liquidated and its assets abroad are largely protected. The lender's only real leverage is the threat to withhold future credit, and that threat is at its weakest precisely when the currency is collapsing or the government is fighting for survival. Argentina is the standing example, where creditors won in the US courts and still could not collect.",
    x: "The holdouts' judgment worked only because it blocked Argentina's market access. Argentina settled in 2016 and defaulted again in 2020." }
]);
})();
