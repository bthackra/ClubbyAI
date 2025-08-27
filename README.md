# ClubMate Starter (Vercel + Supabase + Upstash)

A minimal, deployable starter to prototype an AI‑first club‑management app.

## What’s included
- **Next.js (App Router)** on Vercel
- **Supabase (Postgres)** schema with core tables
- **Upstash Redis** for tee‑time **hold** queue
- **Stripe** webhook to mark invoices paid
- **Ask‑Ops** API route (stub + optional OpenAI call)

## Quick start
1) Create Supabase project. In the SQL editor, run `supabase/schema.sql`. Note the project URL and keys.
2) Create an Upstash Redis database; note the REST URL and token.
3) Create a Stripe account (test mode); add a webhook endpoint `/api/stripe/webhook` listening to `checkout.session.completed`.
4) On Vercel, import this repo and set env vars from `.env.example`.

## Local dev
```bash
pnpm i
pnpm dev
```

## Flows
- **Hold**: POST `/api/reservations/hold` → sets a short TTL hold key; returns a token and expiry.
- **Book**: POST `/api/reservations/book` with the hold token → writes a reservation row (unique index prevents double‑books).
- **Pay invoice**: Create a Stripe Checkout Session from your front‑end (not included); webhook updates `invoices.status` to `PAID`.
- **Ask‑Ops**: POST `/api/ask-ops` with `{ prompt }` → returns canned examples or uses OpenAI if key configured.

## Notes
- This is a starter. Add auth, RBAC, real UI, and validation before going live.
- Unique index `(resource_id, start_ts, end_ts)` enforces no double-book. We also verify an unexpired **hold** token.
