---
title: Gunna – AI Running Coach
image: "./10.png"
imageAlt: Screenshot of the Gunna AI running coach dashboard.
description: A personal training log that turns Apple Watch and Garmin exports into real coaching. Uploads are parsed into per-km splits, heart-rate zones and running-form metrics, then an AI coach that sees your goal and full history gives feedback after every run and plans your training.
github: https://github.com/Guchito/running-coach
link: https://running-coach-flame.vercel.app/
order: 0
stack: [Next.js, React, TypeScript, PostgreSQL, Anthropic SDK, Garmin FIT SDK, Tailwind CSS]
---

## Overview

Gunna is a training log with an opinion. It ingests workouts from Apple Watch
and Garmin, computes the metrics that matter for distance running, and puts an
AI coach on top that sees your goal, your full history and your recovery data —
so the feedback after each run is grounded in *your* training, not generic
advice. It covers strength training too: gym sessions are parsed, merged with
watch data and factored into the weekly plan.

## The problem

Running apps show you charts; they don't coach. And the data you'd coach from
is scattered — the run lives in HealthFit or Garmin, the lifting session in
Strong, recovery metrics in Apple Health. I wanted one place where all of it
lands automatically and one coach that reasons over the whole picture.

## Getting the data in

There are six ingest paths, all converging on a single parser core:

- **File upload** — `.fit`, Apple Watch per-second CSV exports, `.tcx`.
- **Google Drive auto-import** — HealthFit writes exports to a shared folder;
  a service account picks up new files while the app is open.
- **Garmin Connect sync** — downloads the original activity archives, unzips
  them in memory, and stores only AES-256-GCM-encrypted session tokens (never
  the password).
- **Garmin bulk CSV** — backfills history from the activity-list export, with
  localized (Danish/English) headers.
- **Strong / Hevy paste** — gym sessions parsed from clipboard text, in two
  languages and both date orders, then merged with the matching watch file.
- **Apple Health metrics** — resting HR, HRV, sleep and weight read from the
  HealthFit metrics spreadsheet via the Sheets API.

Every path lands on the same deduplication rules, enforced by the database
itself — a partial unique index on the source file, start-time matching, and a
"more samples wins" upgrade so a summary-only import is replaced when the full
per-second file arrives.

## What gets computed

The parser turns raw samples into per-km splits (interpolated at exact 1000 m
boundaries), lap and interval breakdowns, elevation with a GPS-jitter deadband,
running-form metrics (cadence, stride length, vertical oscillation, ground
contact time), ACWR training load, personal records and Riegel race
projections.

Two details I'm fond of:

- **Heart-rate zones are re-sliceable.** Zone time is computed from a stored
  per-bpm histogram, not baked in at import — change your zones or log a new
  LTHR test and every old run re-slices instantly, with no reparse.
- **Cadence despiking.** Apple Watch intermittently loses step detection
  mid-run, which poisons averages and stride length. The filter compares each
  sample against the 65th percentile of its neighbourhood — not the median,
  because dropouts cluster and drag a median down until it stops flagging
  them — and only repairs samples where speed says you were clearly still
  running, so deliberate walk breaks survive.

## The AI coach

The coach is rebuilt fresh for every message from parallel queries: goals,
the macro plan, the current week in full detail, adherence, HR zones, recent
runs, gym history, daily health metrics and training load. It doesn't just
talk — it has eleven write tools (set the weekly plan, adjust goals, log an
LTHR test, regenerate zones…), so "let's move the long run to Sunday" actually
edits the plan. Responses stream, and tool executions show up inline as
receipts.

The models are pluggable: Claude with your own API key, or free
OpenAI-compatible open models. That split shaped the architecture — Claude
gets the full context with prompt caching (the static prefix re-reads at ~10%
cost across the agentic loop), while free models get a deliberately leaner
context, shorter history and fewer loop turns so their token quotas last.

The hardest lessons are encoded in the system prompt as guardrails. The
biggest one: a model writing "I've updated your plan" in prose changes
nothing — plans only change through tool calls, so the prompt makes that
explicit and the app never trusts narration over state.

## Technical challenges

- **Free-model tool calling is unreliable — so I benchmark it.** A harness
  runs the production system prompt, tools and agentic loop against candidate
  models across scored scenarios (build a full week, edit one day without
  regressing the other six, know when *not* to call a tool), validating every
  tool call against its JSON schema. Models get promoted or dropped on
  results, not vibes — which matters, because free providers retire models
  without warning.
- **Open models emit numbers as strings.** A schema-aware coercion layer
  walks each declared tool schema and casts `"40"` back to `40` before
  execution.
- **Serverless time limits.** Backfilling hundreds of days of health metrics
  as row-by-row upserts blew past the function limit; the fix was merging in
  memory by date and writing in batches.
- **European data is hostile.** The Apple Watch CSV is semicolon-separated
  with decimal commas — inside timestamps too. Everything is parsed
  positionally, never with a global replace.

## What I learned

Real-world fitness data is adversarial: units change meaning between sources,
watches drop sensors mid-run, and every exporter localizes differently. The
answer that held up was pushing invariants down — dedupe as a database
constraint, zones from histograms instead of precomputed buckets, one parser
core no matter the ingest path — and measuring model behaviour with a harness
instead of trusting it.

## Technology

Next.js (App Router) · React · TypeScript · Tailwind CSS · PostgreSQL (raw
SQL) · Anthropic SDK · Garmin FIT SDK · Google Drive & Sheets APIs · Recharts ·
JWT auth with scrypt hashing and per-user data scoping.
