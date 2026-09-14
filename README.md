# fn314

**The FI Passbook** is a study guide platform for Financial Institutions Management, Chapters 1–5 (Saunders, Cornett & Erhemjamts, 11th edition), with banking examples set in Thailand.

Each correct answer is a deposit in a bank-style passbook. Each chapter is coloured like a baht banknote (฿20 to ฿1000). Score 80% on a chapter quiz and the chapter gets stamped.

## What's inside

| Chapter | Topic | Lab |
|---|---|---|
| 1 | Why financial institutions are special | Deposit Cover Check (DPA ฿1M limit) |
| 2 | Depository institutions | DuPont Bench (ROE = ROA × EM) |
| 3 | Finance companies | Flat-Rate X-Ray (hire-purchase effective rates) |
| 4 | Securities firms and investment banks | Underwriting Desk (firm commitment vs best efforts) |
| 5 | Mutual funds and hedge funds | Fee Drag (loads, expense ratios, NAV) |

- **186 questions**, tiered easy / medium / difficult, each labelled with its source (Slides, Textbook, Thailand, Case)
- **12 case files**: Thailand 1997, Lehman, Reserve Primary Fund, Bangkok's 2020 fund run, SVB, Archegos/Credit Suisse, 1MDB, Stark, Jer-Jai-Jop insurers, LTCM, Greensill, Zipmex/FTX
- **5 sorter games** (56 cards), flashcards, a mock exam in a 45/33/22 difficulty mix, and a review pile of missed questions
- **US ↔ Thailand regulator map**: FDIC ↔ DPA, Fed ↔ BOT, TARP ↔ FIDF, and more
- **Satang**, a floating 25-satang coin companion who reacts to your answers and lab results. Drag her anywhere; click her to chat.

## Opening it

Download or clone the repo and open `index.html` in a browser. No build step or install is needed.

Opened locally, everything works except two features that need the published Claude artifact:

| Feature | Local file | Published artifact |
|---|---|---|
| Lessons, quizzes, labs, cases, mock exam, Satang's reactions | ✓ | ✓ |
| Chat with Satang, AI marking of open case answers | — | ✓ |
| Progress saved across devices | this browser only | ✓ |

## Files

```
index.html     page shell, styles, design tokens
ch12.js        Chapters 1–2: concepts, flashcards, formulas, first questions
ch3.js         Chapter 3
ch45.js        Chapters 4–5
cases.js       case files and the US ↔ Thailand regulator map
q-c1.js … q-c5.js   extra chapter questions, plus tiers and sources for existing ones
q-cases.js     extra case questions and tiers
sorters.js     sorter games
labs.js        the five calculators
companion.js   Satang: movement, lines, tool reactions, chat
app.js         navigation, quiz engine, rewards, mock exam, progress sync
```

## Adding questions

Saved progress is keyed by each question's position in its list. **Only append new questions to the end** of a quiz array; never reorder or delete existing ones. To fix a question, edit its wording in place.

## Notes on content

- Course slides follow the textbook's US framework. Thai context is added alongside it, not in place of it.
- Every numeric answer was recomputed with a script before publishing.
- Thai rate caps, deposit protection limits and licensing rules change. Check current figures with the Bank of Thailand, DPA, SEC Thailand or OIC before quoting them in an assessment.
- The course material belongs to its lecturer and publisher. This is a study aid, so check before sharing it publicly.
