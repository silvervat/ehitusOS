# RIVEST PLATFORM - PROJECT MEMORY
> **Claude Code**: LOE SEE FAIL ESMALT! Kiire kontekst + viited detailidele.

**Last Updated:** 2024-11-28 17:00
**Session:** 1 (ACTUALLY COMPLETED)
**Status:** Monorepo Setup Complete - Ready for SESSION 2
**Branch:** claude/setup-rivest-platform-01DCqvSnPb6nkYDmYBkruVgi
**Commit:** 9414739

---

## 🎯 QUICK STATUS

```yaml
COMPLETED:
  ✅ SESSION 1: Monorepo (Turborepo + pnpm) - ACTUALLY BUILT!
     - apps/web/ Next.js 14 with dashboard
     - packages/ui/ shadcn/ui components
     - packages/db/ Prisma schema
     - packages/types/ TypeScript types
     - supabase/migrations/ (001_initial, 002_rls)
     - .github/workflows/ci.yml

IN PROGRESS:
  ⏳ SESSION 2: Database Connection
     Phase: Connect to Supabase
     Need: Supabase URL + Keys

NEXT:
  □ SESSION 3: Projects List (TanStack Table)
  □ SESSION 4: CMS + Collaborative Docs
  □ SESSION 5: Dynamic Fields UI
  □ SESSION 6: Workflow Builder
```

---

## 📁 PROJECT STRUCTURE (ACTUAL)

```
ehitusOS/
├── apps/
│   └── web/                           # Next.js 14 App Router
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.tsx           ✅ Landing page
│       │   │   ├── layout.tsx         ✅ Root layout
│       │   │   ├── globals.css        ✅ Tailwind + Rivest theme
│       │   │   └── (dashboard)/
│       │   │       ├── layout.tsx     ✅ Dashboard layout w/ sidebar
│       │   │       ├── dashboard/     ✅ Stats page
│       │   │       └── projects/      ✅ Projects table (mock data)
│       │   └── components/
│       ├── tailwind.config.ts         ✅ Configured
│       └── package.json               ✅ Dependencies set
├── packages/
│   ├── ui/                            ✅ @rivest/ui
│   │   └── src/components/
│   │       ├── button.tsx             ✅
│   │       ├── card.tsx               ✅
│   │       ├── input.tsx              ✅
│   │       ├── label.tsx              ✅
│   │       └── badge.tsx              ✅
│   ├── db/                            ✅ @rivest/db
│   │   ├── prisma/schema.prisma       ✅ Full schema
│   │   └── src/client.ts              ✅ Prisma client
│   └── types/                         ✅ @rivest/types
│       └── src/index.ts               ✅ All type definitions
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql     ✅ All tables
│       └── 002_rls_policies.sql       ✅ RLS policies
├── .github/workflows/ci.yml           ✅ GitHub Actions
├── turbo.json                         ✅ Turborepo config
├── pnpm-workspace.yaml                ✅ Workspace config
├── package.json                       ✅ Root package.json
├── tsconfig.json                      ✅ Root TS config
├── .env.example                       ✅ Env template
├── .gitignore                         ✅ Configured
└── README.md                          ✅ Updated
```

---

## 🗄️ DATABASE SCHEMA (Created in 001_initial_schema.sql)

```sql
-- Core Tables ✅
tenants              -- Multi-tenant core
user_profiles        -- User accounts per tenant
projects             -- Construction projects
companies            -- Clients, suppliers, subcontractors
invoices             -- Sales/purchase invoices
employees            -- Employee records
documents            -- File storage references
audit_log            -- Activity tracking
```

---

## ⚙️ TECH STACK (Implemented)

```yaml
Monorepo:     Turborepo 2 + pnpm 9        ✅
Frontend:     Next.js 14 App Router        ✅
Database:     Supabase (PostgreSQL 15)     ⏳ Need connection
ORM:          Prisma 5                     ✅ Schema ready
UI:           shadcn/ui + Tailwind         ✅
State:        TanStack Query 5 + Zustand   ✅ Added to deps
Tables:       TanStack Table 8             ✅ Added to deps
```

---

## 📝 NEXT STEPS

### **SESSION 2: Database Connection**

**Need from user:**
1. Supabase Project URL
2. Supabase Anon Key
3. Database URL (for Prisma)

**Files to update:**
```bash
# Create .env.local in apps/web/
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
DATABASE_URL="postgresql://..."
```

**Then run:**
```bash
cd packages/db
npx prisma generate
npx prisma db push
```

---

## 🔧 ENVIRONMENT NEEDED

```bash
# .env.local (apps/web/)
DATABASE_URL="postgresql://postgres:pass@host/db"
NEXT_PUBLIC_SUPABASE_URL="https://xyz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

**GitHub Repo:** github.com/silvervat/ehitusOS
**Branch:** claude/setup-rivest-platform-01DCqvSnPb6nkYDmYBkruVgi

---

## 📋 CODING STANDARDS

```typescript
// Max lines
File: 300 lines
Function: 50 lines

// Naming
Components: PascalCase
Files: kebab-case
API: /api/resource/route.ts

// TypeScript
Strict: ON
No 'any'

// Database
- ALWAYS: tenant_id in WHERE
- ALWAYS: deleted_at IS NULL
- Soft delete (never hard DELETE)
```

---

## 🚀 QUICK COMMANDS

```bash
# Dev (after pnpm install)
pnpm dev                    # All apps
pnpm --filter web dev       # Web only

# Database
npx prisma generate         # Generate types
npx prisma db push          # Push to Supabase
npx prisma studio           # DB GUI

# Build
pnpm build                  # Build all
pnpm typecheck              # Type check all
```

---

## 📝 COMMIT HISTORY

```
9414739 - SESSION 1: Complete monorepo setup with Turborepo + pnpm (just now)
ec79ff3 - Update and rename Rivest complete guide (previous)
b36fe01 - Update PROJECT-MEMORY.md (previous)
```

---

## 🎯 WHAT'S WORKING NOW

1. **Landing Page** → `/` shows Rivest Platform intro
2. **Dashboard** → `/dashboard` shows stats cards
3. **Projects** → `/projects` shows table with mock data
4. **UI Components** → Button, Card, Input, Label, Badge
5. **Database Schema** → Ready in Prisma + SQL migrations
6. **GitHub Actions** → CI/CD workflow ready

---

## 📖 FULL DOCUMENTATION

See `RIVEST-COMPLETE-GUIDE.md` for:
- OSAS I: Architecture (chapters 1-5)
- OSAS II: Security (chapters 6-9)
- OSAS IX: CMS System (chapters 48-54)

---

**Last Updated:** 2024-11-28 17:00
**Version:** 6.0 - After SESSION 1 actual implementation
