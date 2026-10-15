# POLL APP

A mobile-first survey app: create a survey with your own questions, let people vote, and watch the results move live while others are voting.

Browse active and ended surveys, vote once per browser, and switch between light and dark mode.

🔗 **Live Demo:** https://stefanstraeter.github.io/poll-app/

---

## Features

- **Survey Overview** – Home page with a hero section, a highlighted "ending soon" survey and a list that can be filtered by status (active / ended) and category.
- **Create Surveys** – Form with several questions and answers, single or multiple choice, an end date and validation with clear error messages.
- **Vote** – Pick answers per question, "Complete" unlocks once every question has an answer. A thank-you notification follows the vote.
- **One Vote per Browser** – A flag in `localStorage` locks the survey after voting. Ended surveys are locked as well.
- **Live Results** – Bars and percentages update in real time via Supabase Realtime, without reloading the page.
- **Vote Preview** – Bars already move when you click an answer, before anything is saved.
- **Light / Dark Mode** – Theme is switched per page through a central service.
- **Mobile-First** – Layout changes across breakpoints, the results can be toggled on small screens.

---

## Purpose

This project was developed as part of a full-stack training program.

It shows how to build a data-driven Angular app with a real backend: components with signals, reactive forms, routing, a service layer around Supabase and live updates.

Focus areas include:

- Standalone components and Signals (`input()`, `output()`, `signal()`, `computed()`)
- Reactive Forms with dynamic lists (`FormArray`) and custom validators
- Clean separation of UI, services and pure logic (`rules/`)
- Supabase as backend: queries, a database function (`rpc`) and Realtime
- SCSS with its own variable system and mobile-first breakpoints

---

## Tech Stack

- **Angular 22** (Standalone Components, Signals, Reactive Forms, Router)
- **TypeScript**
- **Supabase** (PostgreSQL, Realtime, `@supabase/supabase-js`)
- **SCSS** (own variable system, mobile-first)
- **Vitest** (unit tests)

---

## Project Structure

```text
src/app/
├── core/services/        # App-wide services (Theme, Supabase, Notifications, HeaderActions)
├── layout/               # App shell (Header)
├── shared/               # Generic building blocks
│   ├── components/       # Button, Checkbox, Dropdown, ProgressBar, Overlay, ...
│   ├── forms/            # Reusable form helpers
│   ├── validators/       # Reusable validators
│   └── utils/            # Small helpers without Angular
└── survey/               # Everything about surveys
    ├── components/       # survey-card, survey-form, vote-card, survey-results, ...
    ├── pages/            # home, create-survey, survey-detail (one per route)
    ├── services/         # Surveys (Supabase access, Signals), vote-storage
    ├── model/            # interfaces and constants
    └── rules/            # Pure logic without Angular (filter, ending soon, vote changes)
```

| Route            | Page                                  |
| ---------------- | ------------------------------------- |
| `/`              | Home with the survey overview         |
| `/survey/:id`    | Survey detail with voting and results |
| `/create-survey` | Create a new survey                   |

---

## Getting Started

```bash
git clone https://github.com/stefanstraeter/poll-app.git
cd poll-app
npm install
cp .env.example .env   # then fill in your Supabase values (see Supabase Setup below)
npm start
```

The app opens at `http://localhost:4200/`.

Other scripts:

```bash
npm run build   # production build
npm test        # unit tests with Vitest
```

---

## Supabase Setup

The app reads and writes its data in Supabase. The connection values are not stored in the repository. Put them in a local `.env` file (found in the Supabase dashboard under _Project Settings → API_):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
```

`src/environments/environment.ts` is generated from this file automatically before `npm start` and `npm run build`. In the GitHub Actions deployment the same values come from the repository secrets `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Details: [docs/environment-setup.md](docs/environment-setup.md).

To run it against your own Supabase project you need:

- Tables `surveys`, `questions` and `answers` (`answers.votes` is `int8`, default `0`)
- Realtime enabled for these tables
- Row Level Security policies that allow reading and writing
- The SQL function `increment_votes(answer_ids bigint[])`, which counts votes inside the database so parallel voters cannot overwrite each other. The code is in [docs/tipsandtricks.md](docs/tipsandtricks.md) ("Stimmen zählen").

---

## Author

**Stefan Sträter**

GitHub: https://github.com/stefanstraeter/
