# FHCC — Family Health Command Center

A multi-role health data platform that connects families, hospitals, and administrators through a unified, consent-driven interface. Built with Next.js 16, React 19, and Tailwind CSS v4.

---

## Overview

FHCC is a living health record system designed around three pillars:

- **Families** — A health command center to track medical history across every family member.
- **Hospitals** — Surgical intelligence dashboard with patient history and advisory tools.
- **Admins** — Governance layer for consent management, anomaly detection, and data integrity.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Components | Radix UI + shadcn/ui |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Package Manager | pnpm |

---

## Project Structure

```
├── app/
│   ├── page.tsx                        # Landing page
│   ├── login/page.tsx                  # Multi-role login
│   ├── admin/
│   │   ├── dashboard/page.tsx          # Admin overview
│   │   ├── anomalies/page.tsx          # Anomaly detection
│   │   ├── consent/page.tsx            # Consent management
│   │   ├── emergency/page.tsx          # Emergency access
│   │   └── entities/page.tsx           # Entity management
│   ├── hospital/
│   │   ├── dashboard/page.tsx          # Hospital overview
│   │   └── patient/sharma-gayatri/     # Patient detail view
│   └── family/
│       └── dashboard/page.tsx          # Family health hub
├── components/
│   ├── hero-section.tsx
│   ├── pillars-section.tsx
│   ├── trust-footer.tsx
│   ├── geometric-nodes.tsx
│   └── ui/                             # shadcn/ui component library
├── hooks/
├── lib/
└── public/
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **pnpm** — install via `npm install -g pnpm`

### Installation

```bash
# 1. Clone or extract the project
unzip login-page-build.zip -d login-page-build
cd login-page-build

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase setup

1. Create a Supabase project at https://app.supabase.com and note the project ref (the subdomain such as `your-project-ref`).
2. Copy `.env.example` to `.env.local` and set the values:

```bash
cp .env.example .env.local
# edit .env.local and set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

3. Open the Supabase SQL editor and run the contents of `supabase_schema.sql` to create the schema and triggers.

4. Run `supabase_seed.sql` in the SQL editor to populate demo families, hospitals, members, consent links, recalls, medical records, tasks, expenses, emergency contacts, and audit logs.

5. Start the dev server:

```bash
pnpm dev
```

Notes:
- Do NOT commit `.env.local` or any service role key to source control.
- The browser client uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- For server-side admin operations you can set `SUPABASE_SERVICE_ROLE_KEY` and use it only in server-safe code.

---

## Available Scripts

```bash
pnpm dev      # Start development server with hot reload
pnpm build    # Build for production
pnpm start    # Start production server (run after build)
pnpm lint     # Run ESLint
```

---

## Seed Credentials

The login page includes built-in demo credentials for each role:

| Role | Email | Password |
|---|---|---|
| Family | sharma@family.com | password |
| Hospital | apollo@hospital.com | password |
| Admin | admin@fhcc.com | password |

---

## Routes

| Path | Description |
|---|---|
| `/` | Landing page |
| `/login` | Role-based login (Family / Hospital / Admin) |
| `/family/dashboard` | Family health command center |
| `/hospital/dashboard` | Hospital surgical intelligence dashboard |
| `/hospital/patient/sharma-gayatri` | Patient detail view |
| `/admin/dashboard` | Admin overview with consent requests & recalls |
| `/admin/anomalies` | Anomaly detection and access monitoring |
| `/admin/consent` | Consent governance |
| `/admin/emergency` | Emergency access management |
| `/admin/entities` | Entity (family & hospital) management |

---

## Notes

- TypeScript build errors are suppressed (`ignoreBuildErrors: true`) — the project will build even with type warnings.
- Image optimization is disabled (`unoptimized: true`) for static/export compatibility.
- No environment variables are required to run the UI — all data is currently mocked.
- If you wire up a backend, add your variables to a `.env.local` file in the project root.
