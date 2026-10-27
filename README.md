# Bulltrain Entrenamiento, demo

Demo site and back office for Bulltrain Entrenamiento (El Gimnasio de Laureles, Medellín), built by Cleopatra Solutions.
One repo holds the public site, the member portal, the staff panel and the API. Everything runs on sample data.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # engine tests
npm run build && npm start
```

Node 20 or newer. No database and no environment variables are needed. `CRON_SECRET` is optional (see `.env.example`).

## What you can try

Open `/entrar` and pick a profile, or use the "Ver como" switcher in the header.

| Profile | What to try |
| --- | --- |
| Socia (Camila Demo) | Book, cancel, join the waitlist, renew a plan, read notifications |
| Coach (Andrés) | See today's classes and register attendance on his own classes only |
| Recepción | Search members, register a cash payment, adjust credits with a reason, check people in |
| Administrador | Everything above, plus create or cancel classes, reports and the CSV export |

Also: `/unete` (join online with a handwritten signature and a simulated Bold payment), `/horarios` (weekly calendar with live spots). The help center lives inside the product: members find it at `/portal/ayuda`, the team in the "Ayuda" tab of the staff panel.

A good first demo: open the full Hybrid class (today 6:30 PM, 2 people waiting), join the waitlist as Camila, then switch to Recepción, cancel one booking, and watch the first person on the list get promoted and notified.

## Rules built in

- Bookings open 14 days ahead, at most 2 per day, cancel until 2 hours before (staff can cancel any time).
- Credits live in an append-only ledger. The balance is the sum of its entries, so every change has a reason and a date.
- The capacity check and the booking happen in one synchronous call, so two people can never take the last spot.
- The waitlist promotes the first person automatically when a spot opens. If they have no credits, they are told and the next one is tried.
- Early renewals start when the current plan ends, so no days are lost.
- Classes are generated from weekly templates 8 weeks ahead, skipping Colombian holidays (including Easter-based and "moved to Monday" ones).
- Time is fixed to Colombia (UTC-5, no daylight saving).
- Reminders and renewal notices are jobs (`/api/cron/reminders` hourly, `/api/cron/renewals` daily, see `vercel.json`) and never send the same notice twice.

## Layout

```
src/config/tenant.ts   one config for the whole gym: brand, classes, plans, rules
src/lib/               the engine: booking, ledger, memberships, schedule, jobs, reports, seed
src/app/api/           route handlers, thin wrappers around src/lib
src/app/               pages: /, /horarios, /unete, /entrar, /portal (with /portal/ayuda), /staff
tests/run.ts           engine tests (npm test)
```

## How it maps to a real build

This follows the same architecture as the Focus Box Gym portal, in one repo instead of two.

| Demo | Real build |
| --- | --- |
| `src/lib/store.ts` in-memory data | Postgres (Supabase) with row level security; booking becomes one database function |
| `src/lib/auth.ts` demo cookie | Supabase Auth with roles |
| Simulated payment in `/api/register` and `/api/payments` | Bold checkout and webhook |
| Notifications table | Same, plus email through Resend |
| `vercel.json` crons | Same, calling the same job functions |

## Demo limits

- State lives in memory. It resets when the server restarts, and on Vercel it is per instance, so use `POST /api/demo/reset` between meetings or run it locally for a live pitch.
- Plan prices, class times, capacities, coaches and the contract text are placeholders. Real values come from the gym.
- The mascot image on the home page (`public/bull.png`) is Bulltrain's own, taken from their social media, with its black matched to the site background. Swap in their original file when they provide it. The logo (`public/logo.png`, also the favicon) is their round logo from social media with the corners made transparent; swap in the original file when they provide it.
- The address on their public listings differs (#37-55 and #37-53). Confirm which is right.
- Facial access, the online store (Cleopatra Commerce) and InBody are not part of this demo. They appear only in the "Novedades" list as coming soon.
