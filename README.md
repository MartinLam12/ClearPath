# ClearPath — AI Readiness for Small Business

ClearPath helps small business owners discover where AI can create real value. Complete a guided assessment and receive a tailored AI readiness report with prioritized recommendations, estimated impact, and a practical action plan.

## Features

- **Landing Page** — Polished marketing page with hero, features, how-it-works, testimonials, and CTA
- **Sign Up / Login** — Authentication pages with clean forms
- **Dashboard** — Overview with readiness score, category breakdown, top recommendations, and assessment history
- **Assessment Wizard** — Multi-step guided form covering business info, pain points, operations, tools, goals, and budget
- **AI Readiness Report** — Detailed report with score ring, prioritized recommendations, impact/difficulty ratings, action plan, strengths, and considerations
- **Settings** — Profile, business info, and notification preferences

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom design tokens
- **Icons:** Lucide React
- **Charts:** Recharts
- **Animation:** Framer Motion
- **Utilities:** clsx

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Landing page
│   ├── login/            # Login page
│   ├── signup/           # Sign up page
│   ├── dashboard/        # Dashboard
│   ├── assessment/       # Multi-step assessment wizard
│   ├── reports/          # Reports list & detail view
│   └── settings/         # Settings page
├── components/
│   ├── ui/               # Reusable UI components (Button, Card, Input, Badge, etc.)
│   └── layout/           # Navbar, Footer
└── lib/
    ├── types.ts          # TypeScript type definitions
    ├── utils.ts          # Utility functions
    └── mock-data.ts      # Realistic mock data
```

## Design Direction

- Clean, modern, premium B2B SaaS aesthetic
- Warm neutrals with a strong green accent (`brand-600: #2d6f54`)
- Strong typography, thoughtful spacing, soft shadows
- High-trust, professional feel — no flashy AI clichés
- Responsive on desktop and mobile
