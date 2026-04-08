# ClearPath — AI Readiness for Small Business

**ClearPath** helps small business owners discover where AI can create real value. Complete a guided 5-minute assessment and receive a tailored AI readiness report with prioritized recommendations, estimated impact, implementation difficulty, and a practical action plan.

🔗 **Live:** [clearpathai-martinlam12s-projects.vercel.app](https://clearpathai-martinlam12s-projects.vercel.app)

---

## Features

- **Landing Page** — Polished marketing page with hero, features, how-it-works, testimonials, and CTA
- **Authentication** — Real email/password auth powered by Supabase (signup, login, session management)
- **Route Protection** — Middleware-based auth guards redirect unauthenticated users to login
- **Dashboard** — Overview with readiness score, category breakdown, top recommendations, and assessment history
- **Assessment Wizard** — Multi-step guided form covering business info, pain points, operations, tools, goals, and budget
- **Dynamic Report Engine** — Algorithmic report generator that produces tailored recommendations based on assessment responses
- **AI Readiness Report** — Detailed report with score ring, prioritized recommendations, impact/difficulty ratings, action plan, strengths, and considerations
- **Share & Export** — Share reports via Web Share API (with clipboard fallback) and export as PDF
- **Settings** — Profile management, business info, and account deletion
- **Static Pages** — About, Contact, Privacy Policy, and Terms of Service

## Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.2.2 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 with custom design tokens |
| **Authentication** | Supabase Auth (@supabase/supabase-js, @supabase/ssr) |
| **Charts** | Recharts |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |
| **Utilities** | clsx |
| **Deployment** | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### Setup

```bash
# Clone the repository
git clone https://github.com/MartinLam12/ClearPath.git
cd ClearPath

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Then fill in your Supabase credentials (see below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from your Supabase project dashboard under **Project Settings → API**.

### Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication → Providers → Email** and disable "Confirm email" for development
3. Copy your project URL and anon key into `.env.local`

## Project Structure

```
├── middleware.ts              # Auth route protection
├── next.config.ts             # Security headers & Next.js config
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page (Supabase Auth)
│   │   ├── signup/            # Sign up page (Supabase Auth)
│   │   ├── auth/callback/     # OAuth/email confirmation callback
│   │   ├── dashboard/         # Dashboard with score overview
│   │   ├── assessment/        # Multi-step assessment wizard
│   │   ├── reports/           # Reports list & dynamic detail view
│   │   ├── settings/          # Profile & account settings
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   └── terms/             # Terms of service
│   ├── components/
│   │   ├── ui/                # Reusable UI (Button, Card, Input, Badge, ScoreRing, etc.)
│   │   └── layout/            # Navbar, Footer
│   └── lib/
│       ├── supabase/          # Supabase client (browser) & server helpers
│       ├── user-context.tsx   # Auth context provider (Supabase + localStorage fallback)
│       ├── report-generator.ts # Dynamic report generation engine
│       ├── types.ts           # TypeScript type definitions
│       ├── utils.ts           # Utility functions
│       └── mock-data.ts       # Sample data for reports
```

## Security

- **Authentication** — Real email/password auth via Supabase (bcrypt-hashed, not stored client-side)
- **Route Protection** — Server-side middleware redirects unauthenticated users
- **Security Headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Session Management** — Secure HTTP-only cookies via Supabase SSR

## Design

- Clean, modern, premium B2B SaaS aesthetic
- Warm neutrals with a strong green accent (`#3b8a6a` / `#2d6f54`)
- Strong typography, thoughtful spacing, soft shadows
- High-trust, professional feel — no flashy AI clichés
- Fully responsive on desktop and mobile

## Scripts

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

Private project — all rights reserved.
