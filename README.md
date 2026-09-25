# fn314

**FI Quest** is a study RPG for Financial Institutions Management, Chapters 1–7 (Saunders, Cornett & Erhemjamts, 11th edition), with banking examples set in Thailand.

Each correct answer is a deposit in baht. Deposits, quests, stamps and Claude's pop quizzes all feed an XP bar that carries you up a bank career ladder from Trainee Teller to Governor. Each chapter is a world coloured like a baht banknote: ฿20 up to ฿1000 for Chapters 1–5, and the retired ฿10 and ฿5 notes for Chapters 6 and 7. Score 80% on a chapter quiz and the world gets its seal.

## The game layer

- **Ranks**: 12 titles over 25 levels. XP comes from answers (more for first-time and difficult ones), sorter cards, flashcards, labs, quests, stamps, mock exams and badges.
- **Daily quests**: three a day, seeded by the date, claimed for baht and XP. A day streak tracks how many days in a row you show up.
- **37 badges** in the trophy room, from the first deposit to a perfect mock exam, night-owl and early-bird sessions, and milestones with Claude.
- **Boss exams**: the mock exam is a fight. Each correct answer takes a chunk off the boss's HP, misses cost hearts, and the result slip gives an S to D rank.
- **Streak combo**: consecutive correct answers raise the deposit multiplier up to ×2.
- Sounds (toggle in the header), confetti, floating +฿ and +XP, and a rank-up card.

## Claude

Claude is **off by default**. To summon her, click the ฿ logo five times quickly, or type `claude` anywhere on the page (not inside a text box). Do the same again to send her home. While she is away, the bond meter, her room, her quests and her badges are hidden, and nothing else changes.

When she is on, Claude floats around the page, keeps your ledger and reacts to everything. She has a **bond** that grows with every answer, chat, pat, gift, stamp and day you come back. Seven tiers, from *Stranger at the counter* to *Hers, completely*, unlock progressively fonder (and clingier) lines everywhere she speaks, and change how she talks in chat.

- Click her for the panel: **pat** her (diminishing returns if you spam it), **gift** her from the shop (treats raise the bond, accessories stay on her avatar: orchid, ribbon, scarf, glasses, crown), or **talk**.
- She asks **pop quizzes** on her own, pays ฿30 for a right answer, and remembers the wrong ones.
- She notices the time of day, how long you have been studying, how many days you were away, three misses in a row, hovering, dragging, theme changes, rank-ups, badges and finished quests.
- **Her room** shows the bond ladder, her wardrobe, her stats, and lets you tell her your name.

### Personas and the Studio

The companion is a role, and six characters can fill it. Pick one in the Studio on her room page; bond, gifts and accessories carry over.

| Persona | Type | Look |
|---|---|---|
| Claude | Warm, dramatic bookkeeper | Long orange hair |
| Mei | Tsundere kitsune | White twin tails, fox ears |
| Yuki | Kuudere neko | Blue bob, cat ears |
| Hana | Deredere bunny | Pink ponytail, rabbit ears |
| Rin | Mature senior auditor | Black bun |
| Sora | Dandere wolf girl | Grey hair, wolf ears |

Each persona has her own chat voice and her own set of lines for greetings, answers, pats, gifts, idling, pop quizzes, comebacks and the rest; anything she has no line for falls back to Claude's. The Studio also lets you change her name, hair style (long, bob, twin tails, ponytail, bun), ears (none, fox, cat, wolf, bunny), and hair, eye, outfit and skin colours from swatches or a colour picker. Changes save instantly and sync with progress.

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

- **343 questions** in two formats: conceptual multiple choice, and **written short answers** marked against their marking points. The arithmetic lives in the labs; the questions ask what a number means, why a rule exists, and which risk is at work. Each is tiered easy / medium / difficult and labelled with its source (Slides, Textbook, Thailand, Case, General, Written)
- **General** questions cover the background the course assumes but never states: liquidity, real vs nominal rates, why bond prices fall when rates rise, fractional reserve banking, APR, bid-ask spreads, short selling, diversification, the rule of 72, deductibles, actuaries, moral hazard vs adverse selection, hedging, VaR. Each one is tied back to the chapter it supports.
- **22 written short answers**, three or four per chapter. Each shows its marking points, says which you covered and which you missed, and gives a model answer. The marker reads for the language of each point, so you can overrule it once per question
- **US crisis ledger**: 12 episodes from the 1929–33 banking panics to the 2023 regional bank failures, each naming the Chapter 7 risk that carried it and the law that answered it
- **19 case files**: Thailand 1997, Lehman, Reserve Primary Fund, Bangkok's 2020 fund run, SVB, Archegos/Credit Suisse, 1MDB, Stark, Jer-Jai-Jop insurers, LTCM, Greensill, Zipmex/FTX, AIG 2008, the 2011 Thai floods, the London Whale, Argentina, the Savings and Loan crisis, Continental Illinois, and 1933
- **7 sorter games** (86 cards), flashcards, a mock exam in a 45/33/22 difficulty mix, and a review pile of missed questions
- **US ↔ Thailand regulator map**: FDIC ↔ DPA, Fed ↔ BOT, TARP ↔ FIDF, OIC ↔ state insurance commissions, and more
- **Claude**, an optional companion (hidden switch: five clicks on the logo, or type `claude`) who floats around the page, keeps your ledger and reacts to your answers and lab results. Drag her anywhere; click her to pat, gift or chat.

## Opening it

Download or clone the repo and open `index.html` in a browser. No build step or install is needed.

Opened locally, everything works except two features that need the published Claude artifact:

| Feature | Local file | Published artifact |
|---|---|---|
| Lessons, quizzes, labs, cases, boss exams, quests, badges, pats and gifts, Claude's reactions | ✓ | ✓ |
| Chat with Claude, AI marking of open case answers | — | ✓ |
| Progress saved across devices | this browser only | ✓ |

## Files

```
index.html     page shell, styles, design tokens, HUD
ch12.js        Chapters 1–2: concepts, flashcards, formulas, first questions
ch3.js         Chapter 3
ch45.js        Chapters 4–5
ch6.js         Chapter 6
ch7.js         Chapter 7
cases.js       case files and the US ↔ Thailand regulator map
crises.js      the US crisis ledger
q-c1.js … q-c7.js   extra chapter questions, plus tiers and sources for existing ones
q-general.js   common-knowledge questions, one block per chapter
q-short.js     written short answers: marking points, keywords and model answers
q-cases.js     extra case questions and tiers
sorters.js     sorter games
labs.js        the seven calculators
game.js        XP and ranks, badges, daily quests, day streak, sounds, confetti, floating numbers
personas.js    the six companion personas: looks, chat voices and line sets
companion.js   the companion: parametric avatar, movement, bond tiers, lines, pats, gifts and accessories, pop quizzes, tool reactions, chat
app.js         navigation, quiz engine, rewards, boss exam, quest board, trophy room, Claude's room, progress sync
```

## Adding questions

Saved progress is keyed by each question's position in its list. **Only append new questions to the end** of a quiz array; never reorder or delete existing ones. To fix a question, edit its wording in place.

A written question needs `t: "sa"`, three or more `points` (each with `p` text and a `kw` list of patterns the marker looks for), and a `model` answer. Check that the model answer scores full marks against its own keywords before committing: if it does not, the keywords are too narrow.

## Notes on content

- Course slides follow the textbook's US framework. Thai context is added alongside it, not in place of it.
- Every numeric answer was recomputed with a script before publishing.
- Thai rate caps, deposit protection limits, insurance capital rules and licensing rules change. Check current figures with the Bank of Thailand, DPA, SEC Thailand or OIC before quoting them in an assessment.
- Chapter 6's slides date some catastrophes loosely (Hurricane Andrew was August 1992, and the San Francisco earthquake 1989). The chapter page follows the slides but the questions avoid the disputed years.
- Chapter 7 is the integration chapter: its nine risks are the vocabulary for every case file on the page, so the older cases are tagged to it as well as to their own chapters.
- The short-answer marker matches keywords, not meaning. It is there to force you to name each idea explicitly, which is how written exam answers are actually scored, and it can be overruled when it is wrong.
- Crisis dates and loss figures follow the standard published accounts. Check them against the FDIC, the Federal Reserve or the BIS before quoting them in an assessment.
- The course material belongs to its lecturer and publisher. This is a study aid, so check before sharing it publicly.
