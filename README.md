# fn314

**The FI Passbook** is a study guide platform for Financial Institutions Management, Chapters 1–7 (Saunders, Cornett & Erhemjamts, 11th edition), with banking examples set in Thailand.

Each correct answer is a deposit in a bank-style passbook. Each chapter is coloured like a baht banknote: ฿20 up to ฿1000 for Chapters 1–5, and the retired ฿10 and ฿5 notes for Chapters 6 and 7. Score 80% on a chapter quiz and the chapter gets stamped.

## What's inside

| Chapter | Topic | Lab |
|---|---|---|
| 1 | Why financial institutions are special | Deposit Cover Check (DPA ฿1M limit) |
| 2 | Depository institutions | DuPont Bench (ROE = ROA × EM) |
| 3 | Finance companies | Flat-Rate X-Ray (hire-purchase effective rates) |
| 4 | Securities firms and investment banks | Underwriting Desk (firm commitment vs best efforts) |
| 5 | Mutual funds and hedge funds | Fee Drag (loads, expense ratios, NAV) |
| 6 | Insurance: life and property-casualty | Underwriting Ledger (loss, expense, combined and operating ratios) |
| 7 | Risks of financial institutions | Mismatch Desk (refinancing and reinvestment risk, net FX position, capital cushion) |

- **309 questions**, tiered easy / medium / difficult, each labelled with its source (Slides, Textbook, Thailand, Case, General)
- **General** questions cover the background the course assumes but never states: liquidity, real vs nominal rates, why bond prices fall when rates rise, fractional reserve banking, APR, bid-ask spreads, short selling, diversification, the rule of 72, deductibles, actuaries, moral hazard vs adverse selection, hedging, VaR. Each one is tied back to the chapter it supports.
- **16 case files**: Thailand 1997, Lehman, Reserve Primary Fund, Bangkok's 2020 fund run, SVB, Archegos/Credit Suisse, 1MDB, Stark, Jer-Jai-Jop insurers, LTCM, Greensill, Zipmex/FTX, AIG 2008, the 2011 Thai floods, the London Whale, and Argentina
- **7 sorter games** (86 cards), flashcards, a mock exam in a 45/33/22 difficulty mix, and a review pile of missed questions
- **US ↔ Thailand regulator map**: FDIC ↔ DPA, Fed ↔ BOT, TARP ↔ FIDF, OIC ↔ state insurance commissions, and more
- **Claude**, a companion who floats around the page, keeps your ledger and reacts to your answers and lab results. Drag her anywhere; click her to chat.

## Opening it

Download or clone the repo and open `index.html` in a browser. No build step or install is needed.

Opened locally, everything works except two features that need the published Claude artifact:

| Feature | Local file | Published artifact |
|---|---|---|
| Lessons, quizzes, labs, cases, mock exam, Claude's reactions | ✓ | ✓ |
| Chat with Claude, AI marking of open case answers | — | ✓ |
| Progress saved across devices | this browser only | ✓ |

## Files

```
index.html     page shell, styles, design tokens
ch12.js        Chapters 1–2: concepts, flashcards, formulas, first questions
ch3.js         Chapter 3
ch45.js        Chapters 4–5
ch6.js         Chapter 6
ch7.js         Chapter 7
cases.js       case files and the US ↔ Thailand regulator map
q-c1.js … q-c7.js   extra chapter questions, plus tiers and sources for existing ones
q-general.js   common-knowledge questions, one block per chapter
q-cases.js     extra case questions and tiers
sorters.js     sorter games
labs.js        the seven calculators
companion.js   Claude: movement, lines, tool reactions, chat
app.js         navigation, quiz engine, rewards, mock exam, progress sync
```

## Adding questions

Saved progress is keyed by each question's position in its list. **Only append new questions to the end** of a quiz array; never reorder or delete existing ones. To fix a question, edit its wording in place.

## Notes on content

- Course slides follow the textbook's US framework. Thai context is added alongside it, not in place of it.
- Every numeric answer was recomputed with a script before publishing.
- Thai rate caps, deposit protection limits, insurance capital rules and licensing rules change. Check current figures with the Bank of Thailand, DPA, SEC Thailand or OIC before quoting them in an assessment.
- Chapter 6's slides date some catastrophes loosely (Hurricane Andrew was August 1992, and the San Francisco earthquake 1989). The chapter page follows the slides but the questions avoid the disputed years.
- Chapter 7 is the integration chapter: its nine risks are the vocabulary for every case file on the page, so the older cases are tagged to it as well as to their own chapters.
- The course material belongs to its lecturer and publisher. This is a study aid, so check before sharing it publicly.
