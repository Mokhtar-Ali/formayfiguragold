# Forma y Figura, sample sites

One codebase, three gym sites (GOLD, BLUE, RED) built by Cleopatra Solutions as a working sample for the Forma y Figura group.
Each sede has its own look, schedule and members. They share one system: class booking with live spots, waitlist, memberships,
contract signature, simulated online payment, member portal, staff panel, events with limited spots, promo banner and a suggestion box.
Everything runs on sample data.

## Run it

```bash
npm install
TENANT=gold npm run dev     # gold, blue or red. Defaults to gold. http://localhost:3000
npm test                    # engine tests; run once per gym with TENANT=gold|blue|red
TENANT=blue npm run build && TENANT=blue npm start
```

Node 20 or newer. No database. See `.env.example`.

## How the three sites work

`TENANT` picks the file in `src/config/tenants/` (`gold.ts`, `blue.ts`, `red.ts`). Each file holds that gym's brand, contact,
hours, colors and fonts, class types, coaches, plans, weekly schedule, promo, featured coach and events. A fourth gym is a fourth file.

Deploy as three Vercel projects from this one repo, with a different `TENANT` in each:

| Vercel project | TENANT |
| --- | --- |
| forma-gold | gold |
| forma-blue | blue |
| forma-red | red |

Then set `NEXT_PUBLIC_URL_GOLD`, `NEXT_PUBLIC_URL_BLUE` and `NEXT_PUBLIC_URL_RED` in all three so `/sedes` links to the real addresses.

## What you can try

Open `/entrar` and pick a profile, or use the "Ver como" switcher in the header.

| Profile | What to try |
| --- | --- |
| Socia (Camila Demo) | Book, cancel, join the waitlist, renew a plan, read notifications |
| Coach | See today's classes and register attendance on their own classes only |
| Recepción | Search members, register a cash payment, adjust credits with a reason, check people in, read the buzón and event signups |
| Administrador | Everything above, plus create or cancel classes, reports and the CSV export |

Also: `/unete` (signup with handwritten signature and simulated Bold payment), `/horarios`, `/eventos` (spots go down live until sold out),
`/buzon`, `/demo` (the Today versus With-your-portal comparison) and `/sedes`.
In every gym the first class type is the busy one: open it from the home page, join its waitlist as Camila, then switch to Recepción,
cancel one booking and watch the first person on the list get promoted.

## Placeholders to confirm with the gym

Anything not in this list came from the gym's public profile. Everything in it is sample text or sample numbers.

**GOLD** (from @formayfiguragold: name, address, WhatsApp, tagline, black and gold, Rumba, Cycling, promo price range, Chiva Rumbera at $30.000)
- Opening hours, weekly schedule, capacities, third class (Funcional guiado), coach names and bios
- Plan names and prices other than the monthly promo range; phone number for calls (WhatsApp number reused)
- Chiva Rumbera date, meeting point and capacity; promo end date
- Logo (a wordmark stands in), hero art and class covers (original line art stands in), real photos

**BLUE and RED** (from the public profiles: name, handle, logo colors only)
- Address, phone, WhatsApp, Facebook, hours, classes, schedule, capacities, coach names, prices, events, promo, tagline
- Logo (a wordmark stands in), photos

**All three**
- Contract text, privacy policy, Bold account, real cancellation rules
- Coach portraits and the "Foto por agregar" spotlight photo

## Rules built in

- Bookings open 14 days ahead, at most 2 per day, cancel until 2 hours before (staff can cancel any time).
- Credits live in an append-only ledger; the balance is the sum of its entries.
- Capacity check and booking happen in one synchronous call, so two people can never take the last spot. Events work the same way.
- The waitlist promotes the first person automatically when a spot opens.
- Early renewals start when the current plan ends.
- Classes are generated from weekly templates 8 weeks ahead, skipping Colombian holidays. Time is fixed to Colombia (UTC-5).
- Reminders and renewal notices run as cron jobs (`vercel.json`) and never repeat a notice.

## Layout

```
src/config/tenants/    one file per gym, plus the shared types
src/config/group.ts    the three sedes, for /sedes
src/lib/               the engine: booking, ledger, memberships, schedule, events, jobs, reports, seed
src/app/api/           route handlers, thin wrappers around src/lib
src/app/               pages: /, /horarios, /unete, /eventos, /buzon, /sedes, /entrar, /portal, /staff
tests/run.ts           engine tests
```

## How it maps to a real build

| Sample | Real build |
| --- | --- |
| `src/lib/store.ts` in-memory data | Postgres (Supabase) with row level security |
| `src/lib/auth.ts` demo cookie | Supabase Auth with roles |
| Simulated payment | Bold checkout and webhook |
| Notifications table | Same, plus email through Resend |

## Sample limits

State lives in memory. It resets when the server restarts, and on Vercel it is per instance, so use `POST /api/demo/reset`
between meetings or run it locally for a live pitch.
