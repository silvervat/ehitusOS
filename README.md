# Rivest Platform

Modern Construction Management System - Ehitusjuhtimise platvorm

## Tech Stack

- **Monorepo:** Turborepo 2 + pnpm 9
- **Frontend:** Next.js 14 App Router
- **Database:** Supabase (PostgreSQL)
- **ORM:** Prisma 5
- **UI:** shadcn/ui + Tailwind CSS
- **State:** TanStack Query + Zustand

## Project Structure

```
rivest-platform/
├── apps/
│   └── web/              # Next.js 14 App
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Prisma + Supabase
│   └── types/            # Shared TypeScript types
├── supabase/
│   └── migrations/       # SQL migrations
└── .github/
    └── workflows/        # CI/CD
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in your Supabase credentials.

## Documentation

See `manual/PROJECT-MEMORY.md` for detailed project documentation.

---

Rivest Platform v2.0 - Multi-tenant Construction Management
