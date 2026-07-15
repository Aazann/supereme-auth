# Supreme Auth Studio

> The modern visual dashboard for Better Auth.

Supreme Auth Studio is a premium, handcrafted console built for developers who require deep analytics, user moderation, multi-tenant auditing, and credential management for their Better Auth instances. Built in the visual image of Linear, Stripe, and Vercel, it features a glassmorphic design language, responsive controls, and high-performance server-rendered grids.

---

## Key Features

*   **Real-time Analytics Dashboard:** Glowing Area charts mapping daily signups and peak concurrent sessions.
*   **User Moderation Desk:** Administrative actions to search, filter, ban, suspend (with selective durations), reset roles, or delete users.
*   **Session Audit Explorer:** Details geolocated IP origins, browser user-agents, OS configurations, and permits remote token revocation.
*   **Organizations Manager:** Audiences list, organization slug configuration, team members rosters, and invitation tracking.
*   **API Credentials & Rate Limits:** Generate scoped API tokens, block malicious traffic via IP limit configurations, and inspect rate limiter pools.
*   **Security Policies Auditor:** Audits WebAuthn Passkeys (backed up/local platform status, counter numbers) and multi-factor authentication (TOTP/2FA) setups.
*   **System Health Monitor:** Real-time DB latency query diagnostics and process memory consumption indicators.
*   **Interactive Rest API docs:** Customized interactive testing console (Try it out Swagger replacement) hitting the endpoints directly.

---

## Visual Design

The UI is built using React 19, Next.js 16 (Turbopack), Tailwind CSS v4, and framer-motion:
*   **Liquid Glass Backgrounds:** Radiant neon border backdrops.
*   **Custom SVG Vector Assets:** Custom icons preventing bloated external runtime package dependencies.
*   **Keyboard Commands Palette:** Triggers global routing via `Cmd+K` / `Ctrl+K`.

---

## Getting Started

### 1. Prerequisites
Verify that Node.js (v18+) is installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Database Sync & Seeding
BetterAuth Studio uses dynamic provider configurations. Start by building your local SQLite database and seeding mock metrics:
```bash
# Push schema tables to local SQLite dev.db
npx prisma db push

# Populate mock users, sessions, passkeys, orgs, and audit logs
npm run db:seed
```

### 4. Running the App
Start the local development server:
```bash
npm run dev
```
Open `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied). You can sign in using the seed developer account:
*   **Email:** `admin@better-auth.com`
*   **Password:** `admin` (or click **Login with Passkey** to test dynamic WebAuthn interfaces)

### 5. Running Production Builds
Supreme Auth Studio compiles cleanly to Postgres for production deployments:
```bash
# Automatically switches schema compiler to PostgreSQL and compiles static pages
npm run build

# Start production server
npm run start
```

### 6. Running Tests
Run the Vitest test suites:
```bash
# Watch mode
npm run test

# Single run
npm run test:run
```

---

## Architecture & Commands

*   `npm run dev` - Runs `use-sqlite.js` script to configure schema.prisma to SQLite, runs Prisma Client generation locally, and starts Next.js dev server.
*   `npm run build` - Runs `use-postgres.js` script to configure schema.prisma to PostgreSQL, generates PostgreSQL clients, and compiles Next.js optimized bundles.
*   `src/actions/` - Core Server Actions executing moderator database updates.
*   `src/generated/prisma` - Isolated database compiler path preventing workspace home-directory module clashes.
*   `src/lib/db.ts` - Database wrapper with connection-swapping capabilities.
