# RIVEST PLATFORM - PROJECT MEMORY
> **Claude Code**: LOE SEE FAIL ESMALT! Kiire kontekst + viited detailidele.

**Last Updated:** 2024-11-27 17:00  
**Session:** 4  
**Status:** CMS + Collaborative Docs Setup  
**Branch:** main  
**Commit:** xyz789

---

## 🎯 QUICK STATUS

```yaml
COMPLETED:
  ✅ SESSION 1: Monorepo (Turborepo + pnpm)
  ✅ SESSION 2: Database (tenants, projects, RLS)
  ✅ SESSION 3: Projects List (TanStack Table)

IN PROGRESS:
  ⏳ SESSION 4: CMS + Collaborative Docs
     Phase: Database schema extension
     File: supabase/migrations/003_cms_system.sql

NEXT:
  □ SESSION 5: Dynamic Fields UI
  □ SESSION 6: Workflow Builder
  □ SESSION 7: Document Editor
```

---

## 📁 PROJECT STRUCTURE

```
rivest-platform/
├── apps/
│   └── web/                           # Next.js 14 App Router
│       ├── src/
│       │   ├── app/
│       │   │   ├── (dashboard)/
│       │   │   │   ├── projects/      ✅ Done
│       │   │   │   ├── docs/          ⏳ Next
│       │   │   │   └── admin/cms/     ⏳ Next
│       │   │   └── api/
│       │   ├── components/
│       │   │   ├── projects/          ✅ Done
│       │   │   ├── docs/              ⏳ Next
│       │   │   └── admin/cms/         ⏳ Next
│       │   └── hooks/
│       └── package.json
├── packages/
│   ├── db/                            # Prisma + Supabase
│   │   └── prisma/schema.prisma       ✅ Done
│   ├── ui/                            # shadcn/ui
│   └── types/
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql            ✅ Done
│       ├── 002_rls.sql                ✅ Done
│       └── 003_cms_system.sql         ⏳ Creating now
├── PROJECT-MEMORY.md                  # ⭐ This file (quick context)
├── RIVEST-COMPLETE-GUIDE.md           # 📖 Full reference (11,930 lines)
└── README.md
```

---

## 🗄️ DATABASE (Key Tables)

```sql
-- Core (SESSION 2) ✅
tenants, user_profiles, projects, companies, invoices, 
employees, time_entries, vehicles, documents, audit_log

-- CMS (SESSION 4) ⏳
dynamic_fields              -- Custom fields per entity
dynamic_field_values        -- Field values storage
workflows                   -- State machines
workflow_history            -- Transition log
notification_rules          -- Email/SMS/webhook triggers
notification_log            -- Sent notifications

-- Collaborative Docs (SESSION 4) ⏳
documents_collaborative     -- Main docs table
document_versions           -- Version history
document_comments           -- Comments & mentions
document_collaborators      -- Permissions
document_presence           -- Real-time online users
document_exports            -- PDF/Markdown exports
```

**Full schema:** See `RIVEST-COMPLETE-GUIDE.md` → OSAS IX (peatükid 48-54)

---

## ⚙️ TECH STACK

```yaml
Monorepo:     Turborepo 2 + pnpm 9
Frontend:     Next.js 14 App Router
Database:     Supabase (PostgreSQL 15)
ORM:          Prisma 5
UI:           shadcn/ui + Tailwind
State:        TanStack Query 5 + Zustand
Tables:       TanStack Table 8 + Virtual

# CMS & Docs:
Editor:       Tiptap (ProseMirror)
Collaboration: Y.js (CRDT)
Realtime:     Supabase Realtime
```

---

## 📝 CURRENT TASK

### **SESSION 4: CMS + Collaborative Docs**

**Goal:** Setup foundation for admin customization + real-time docs

**Files to Create:**

```typescript
// 1. Database Migration
supabase/migrations/003_cms_system.sql
  - dynamic_fields table
  - workflows table
  - documents_collaborative table
  - RLS policies
  - Functions

// 2. Prisma Schema Update
packages/db/prisma/schema.prisma
  - Add CMS models
  - Add document models

// 3. Basic UI Components
apps/web/src/components/admin/cms/
  - DynamicFieldsManager.tsx
  - DynamicFieldDialog.tsx
  - DynamicFieldsRenderer.tsx

apps/web/src/components/docs/
  - DocumentEditor.tsx (Tiptap)
  - DocumentToolbar.tsx
  - CollaboratorBar.tsx

// 4. Dependencies
pnpm add @tiptap/react @tiptap/starter-kit
pnpm add @tiptap/extension-collaboration
pnpm add @tiptap/extension-table
pnpm add yjs y-supabase
```

**Detailed code:** See `RIVEST-COMPLETE-GUIDE.md` → OSAS IX

---

## 🔧 ENVIRONMENT

```bash
# .env.local (apps/web/)
DATABASE_URL="postgresql://postgres:pass@host/db"
NEXT_PUBLIC_SUPABASE_URL="https://xyz.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
```

**Supabase Project:** rivest-platform  
**GitHub Repo:** github.com/silvervatsel/rivest-platform  
**Branch:** main

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

**Full standards:** See `RIVEST-COMPLETE-GUIDE.md` → OSAS I (peatükk 1-5)

---

## 🚀 QUICK COMMANDS

```bash
# Dev
pnpm dev                    # All apps
pnpm --filter web dev       # Web only

# Database
npx supabase db push        # Push migrations
npx prisma generate         # Generate types
npx prisma studio           # DB GUI

# Git
git add .
git commit -m "SESSION X: Feature Y"
git push origin main

# CMS Routes
/admin/cms/dynamic-fields/projects     # Manage project fields
/admin/cms/workflows/projects          # Setup workflows
/admin/cms/notifications               # Notification rules

# Docs Routes
/docs                       # All documents
/docs/new                   # Create new document
/docs/[id]/edit            # Edit (real-time collaboration)
/share/[token]             # Public shared document
```

---

## 📖 FULL DOCUMENTATION

### **RIVEST-COMPLETE-GUIDE.md** (324 KB, 11,930 lines)

```yaml
Structure:
  OSAS I:     Põhimõtted ja Arhitektuur (1-5)
  OSAS II:    Turvalisus (6-9)
  OSAS III:   Jõudlus (10-14)
  OSAS IV:    Arhiveerimine (15-19)
  OSAS V:     Import/Export (20-26)
  OSAS VI:    Template Editor (27-33)
  OSAS VII:   Form Builder (34-41)
  OSAS VIII:  Table Designer (42-47)
  OSAS IX:    CMS Sisuhaldus (48-54)     ⭐ READ FOR SESSION 4
  OSAS X:     Dialog Designer (55-59)
  OSAS XI-XV: Automation, Frontend, Backend, Testing, Ops

Current Focus:
  OSAS IX contains:
  - Complete database schema (SQL code ready to copy)
  - Dynamic fields system (full TypeScript implementation)
  - Workflow builder (ReactFlow + state machine)
  - Notification engine (multi-channel)
  - Collaborative documents (Tiptap + Y.js)
  - Real-time presence (Supabase Realtime)
```

**Usage:** When need specific implementation details, open guide and search for chapter

---

## 🐛 KNOWN ISSUES

None currently.

---

## 💡 SESSION NOTES

### **CMS Features (OSAS IX):**
- **Dynamic fields:** Admin can add custom fields to ANY module without code
- **Workflow builder:** Visual state machine (Draft → Review → Approved)
- **Notifications:** Multi-channel triggers (email, SMS, in-app, webhook)
- **15+ field types:** text, number, select, date, file, checkbox, etc.

### **Collaborative Docs (like ClickUp/Notion):**
- **Real-time editing:** Multiple users editing simultaneously
- **Rich text:** Tiptap editor (bold, italic, headings, lists)
- **Tables:** Draggable, resizable tables
- **Images:** Drag & drop, paste from clipboard
- **Comments:** Thread comments with @mentions
- **Version history:** Rollback to any previous version
- **Public sharing:** Share with password protection
- **Export:** PDF, Markdown, DOCX

**Implementation details:** All code in `RIVEST-COMPLETE-GUIDE.md` OSAS IX

---

## 📝 LAST 5 COMMITS

```
xyz789 - SESSION 3: Projects list complete (2 hours ago)
abc456 - SESSION 2: Database schema + RLS (1 day ago)
def123 - SESSION 1: Monorepo setup (1 day ago)
ghi789 - Add PROJECT-MEMORY + GUIDE (2 days ago)
jkl012 - Initial commit (2 days ago)
```

---

## 🎯 HOW CLAUDE CODE USES THIS

**Session Start:**

```bash
# 1. Claude reads this file (5 seconds)
cat PROJECT-MEMORY.md

# 2. Understands current state
echo "Current: SESSION 4 - CMS setup"
echo "Task: Create 003_cms_system.sql"

# 3. If needs implementation details
# Opens RIVEST-COMPLETE-GUIDE.md → OSAS IX
grep -A 200 "## 48. CONTENT MANAGEMENT SYSTEM" RIVEST-COMPLETE-GUIDE.md

# 4. Starts working
cd ~/projects/rivest-platform
# Create migration file...
# Copy schema from guide...
```

**You Just Say:**

```
"Claude Code - jätka"
```

---

## ✅ PRE-COMMIT CHECKLIST

```yaml
Code Quality:
  - [ ] Max 300 lines per file
  - [ ] Max 50 lines per function
  - [ ] TypeScript strict mode
  - [ ] No 'any' types
  - [ ] ESLint errors = 0
  - [ ] No console.log statements

Functionality:
  - [ ] Feature works as expected
  - [ ] No console errors
  - [ ] Mobile responsive
  - [ ] RLS policies tested

Database:
  - [ ] tenant_id in all queries
  - [ ] Soft delete implemented
  - [ ] RLS policies active
  - [ ] Indexes added for performance

Git:
  - [ ] Descriptive commit message
  - [ ] No .env files committed
  - [ ] No node_modules
  - [ ] Clean git diff
```

---

## 🔗 QUICK REFERENCE

- **Full Documentation:** `RIVEST-COMPLETE-GUIDE.md` (11,930 lines)
- **Current Focus:** OSAS IX - CMS Sisuhaldus (peatükid 48-54)
- **Database Schema:** OSAS IX → Complete SQL code
- **Tiptap Setup:** OSAS IX → DocumentEditor.tsx code
- **Y.js Collaboration:** OSAS IX → Real-time setup

---

**Last Updated:** 2024-11-27 17:00  
**Auto-Update:** Every session end  
**Version:** 5.0 - Optimized for Claude Code  
**File Size:** ~5 KB (vs 324 KB guide)

---

## 🚀 READY TO START?

**Push to GitHub:**
```bash
git add PROJECT-MEMORY.md RIVEST-COMPLETE-GUIDE.md
git commit -m "Add project memory + complete guide"
git push origin main
```

**Then tell Claude Code:**
```
"Claude Code - jätka PROJECT-MEMORY.md järgi"
```

**Claude will:**
1. ✅ Read PROJECT-MEMORY.md (quick context)
2. ✅ See SESSION 4 task
3. ✅ Open RIVEST-COMPLETE-GUIDE.md OSAS IX if needed
4. ✅ Create migration files
5. ✅ Setup CMS + Collaborative Docs
6. ✅ Commit & push

🎯 **Perfect workflow!**
