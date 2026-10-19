<div align="center">

# OPINA

**Create surveys in minutes, let people vote and watch the results move live.**

Angular 22 · TypeScript · Supabase · SCSS

[Live demo](https://stefanstraeter.github.io/opina/) · [Report a bug](https://github.com/stefanstraeter/opina/issues)

<br />

![Opina preview](docs/screenshots/preview.png)

</div>

---

## About

Opina is a mobile-first survey app. Publish a survey with your own questions, share it and let people vote. Every result bar updates in real time for all visitors, without a reload.

It started as a training project (Poll App) and was redesigned from scratch: new colors, new fonts, a token-based design system. Services, signals and component structure stayed the same, only the look changed.

![Live results](docs/screenshots/live-results.gif)

---

## Highlights

- **Live results** – Bars and percentages update through Supabase Realtime. Your own vote is never counted twice.
- **Instant vote preview** – The bars move as soon as you click an answer, before anything is saved.
- **Race-free counting** – Votes are counted inside the database with one function call, so parallel voters cannot overwrite each other.
- **Flexible surveys** – Several questions with up to 8 answers each, single or multiple choice, optional end date, clear validation with matching error messages.
- **One vote per browser** – A flag in `localStorage` locks the survey after voting. Ended surveys are locked as well.
- **Design system** – Colors, type, spacing and component sizes are SCSS tokens, shared mixins keep every page consistent.
- **Responsive and accessible** – Checked from 360 to 1440 px, with labelled fields, visible focus states, semantic HTML and screen reader roles for confirmations and errors.
- **No secrets in the repository** – Connection values live in a local `.env`, the environment file is generated before every build.

---

## Tech Stack

- **Angular 22** with Standalone Components, Signals, Reactive Forms and Router
- **TypeScript**
- **Supabase** (PostgreSQL, Realtime, `@supabase/supabase-js`)
- **SCSS** with design tokens, mixins and mobile-first breakpoints
- **Zodiak** and **Satoshi** as fonts, self-hosted

---

## Getting Started

```bash
git clone https://github.com/stefanstraeter/opina.git && cd opina
npm install && cp .env.example .env   # add your Supabase values, see below
npm start                             # opens http://localhost:4200
```

For a production build use `npm run build`.

<details>
<summary><strong>Supabase setup</strong></summary>

<br />

The connection values are not stored in the repository. Put them in a local `.env` file (Supabase dashboard, _Project Settings → API_):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
```

`src/environments/environment.ts` is generated from this file automatically before `npm start` and `npm run build`. In a CI deployment the same values come from repository secrets. Details: [docs/environment-setup.md](docs/environment-setup.md).

To run it against your own Supabase project you need:

- Tables `surveys`, `questions` and `answers` (`answers.votes` is `int8`, default `0`)
- Realtime enabled for these tables
- Row Level Security policies that allow reading and writing
- The SQL function `increment_votes`, which counts votes inside the database:

```sql
create or replace function increment_votes(answer_ids bigint[])
returns void
language sql
as $$
  update answers
  set votes = votes + 1
  where id = any(answer_ids);
$$;
```

</details>

<details>
<summary><strong>Project structure</strong></summary>

<br />

```text
src/app/
├── core/services/        # App-wide services (Theme, Supabase, Notifications, HeaderActions)
├── layout/               # App shell (Header)
├── shared/               # Generic building blocks
│   ├── components/       # Button, Checkbox, Dropdown, ProgressBar, Confirmation, ...
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

The design specification and the mockups are in [`opina-design/`](opina-design). All design values live in `src/styles/_variables.scss`.

</details>

---

## Good to know

This is a demo. The tables use open "allow all" policies, and "one vote per browser" is only a convenience through `localStorage`. Do not use it as is for sensitive data.

---

## Author

**Stefan Sträter** · [github.com/stefanstraeter](https://github.com/stefanstraeter/)
