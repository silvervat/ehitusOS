# RIVEST PLATFORM - COMPLETE PROJECT MEMORY + CMS + COLLABORATIVE DOCS
> **Claude Code**: LOE SEE FAIL ESMALT IGAL SESSIOONI ALGUSES! 🎯

**Last Updated:** 2024-11-27 16:30  
**Current Session:** 4  
**Status:** Projects CRUD + CMS Setup  
**Branch:** main

---

## 📊 QUICK STATUS

```yaml
COMPLETED:
  - ✅ SESSION 1: Monorepo Setup
  - ✅ SESSION 2: Database Schema  
  - ✅ SESSION 3: Projects List View

IN PROGRESS:
  - ⏳ SESSION 4: CMS + Collaborative Docs Setup
  - Phase: Database Schema Extension
  
NEXT UP:
  - [ ] SESSION 5: Dynamic Fields UI
  - [ ] SESSION 6: Workflow Builder  
  - [ ] SESSION 7: Document Editor (Collaborative)
  - [ ] SESSION 8: Real-time Collaboration
```

---

## 🎯 CMS SYSTEM OVERVIEW (OSAS IX)

### **What Admin Can Do Without Code:**

```yaml
DYNAMIC FIELDS:
  - Add custom fields to ANY module (projects, invoices, etc.)
  - 15+ field types (text, number, select, date, file, etc.)
  - Conditional logic (show field if X = Y)
  - Validation rules
  - Field groups & sections
  - Permissions per field

WORKFLOW BUILDER:
  - Visual state machine editor
  - Define states (Draft → Review → Approved)
  - Define transitions & permissions
  - Auto-actions (send email, update field, webhook)
  - Approval chains
  - Rollback support

NOTIFICATION ENGINE:
  - Trigger-based rules (on create, update, status change)
  - Multi-channel (email, SMS, in-app, webhook)
  - Template editor with variables
  - Scheduled notifications
  - Digest emails (daily/weekly summaries)

STATUS MANAGEMENT:
  - Custom statuses per entity
  - Color coding & icons
  - Status badges
  - Transition rules & permissions

COLLABORATIVE DOCUMENTS: ⭐ NEW!
  - Real-time collaborative editing (ClickUp style)
  - Rich text editor (Tiptap/Lexical)
  - Tables, images, embeds
  - Comments & mentions (@user)
  - Version history
  - Public sharing with permissions
  - Export to PDF/Markdown
```

---

## 🗄️ COMPLETE DATABASE SCHEMA (Extended with CMS)

```sql
-- ============================================
-- PREVIOUS TABLES (from SESSION 2)
-- ============================================
-- tenants, user_profiles, projects, companies, 
-- invoices, employees, time_entries, vehicles, 
-- documents, audit_log
-- [See SESSION 2 for full schema]

-- ============================================
-- CMS: DYNAMIC FIELDS ⭐
-- ============================================
CREATE TABLE dynamic_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- Which entity this field belongs to
  entity_type TEXT NOT NULL,             -- 'projects', 'invoices', etc.
  
  -- Field definition
  key TEXT NOT NULL,                     -- 'custom_priority_level'
  label TEXT NOT NULL,                   -- 'Priority Level'
  type TEXT NOT NULL,                    -- 'text', 'number', 'select', etc.
  
  -- Configuration (JSON)
  config JSONB DEFAULT '{}',             -- Field-specific config
  
  -- Validation
  required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '[]',   -- [{type: 'min', value: 3}]
  
  -- Display
  sort_order INT DEFAULT 0,
  field_group TEXT,                      -- 'General', 'Advanced'
  help_text TEXT,
  placeholder TEXT,
  
  -- Conditional logic
  conditional_logic JSONB DEFAULT '[]',  -- Show/hide based on other fields
  
  -- Permissions
  can_view TEXT[] DEFAULT '{}',          -- ['admin', 'manager']
  can_edit TEXT[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id),
  
  UNIQUE(tenant_id, entity_type, key)
);

CREATE INDEX idx_dynamic_fields_entity ON dynamic_fields(tenant_id, entity_type) 
WHERE is_active = true;

-- ============================================
-- CMS: DYNAMIC FIELD VALUES
-- ============================================
CREATE TABLE dynamic_field_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  field_id UUID NOT NULL REFERENCES dynamic_fields(id),
  
  -- Which record this value belongs to
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Value (stored as JSONB for flexibility)
  value JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(field_id, entity_id)
);

CREATE INDEX idx_dynamic_values_entity ON dynamic_field_values(entity_type, entity_id);
CREATE INDEX idx_dynamic_values_field ON dynamic_field_values(field_id);

-- ============================================
-- CMS: WORKFLOWS ⭐
-- ============================================
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  entity_type TEXT NOT NULL,             -- 'projects', 'invoices'
  
  name TEXT NOT NULL,                    -- 'Project Approval Workflow'
  description TEXT,
  
  -- State machine definition (JSON)
  states JSONB NOT NULL,                 -- [{id, name, color, actions}]
  transitions JSONB NOT NULL,            -- [{from, to, conditions, actions}]
  
  initial_state TEXT NOT NULL,           -- 'draft'
  
  -- Settings
  allow_manual_transitions BOOLEAN DEFAULT true,
  require_comment BOOLEAN DEFAULT false,
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, entity_type, name)
);

-- ============================================
-- CMS: WORKFLOW HISTORY
-- ============================================
CREATE TABLE workflow_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Transition details
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  
  -- User & context
  user_id UUID REFERENCES user_profiles(id),
  comment TEXT,
  metadata JSONB,                        -- Additional context
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workflow_history_entity ON workflow_history(entity_type, entity_id);

-- ============================================
-- CMS: NOTIFICATION RULES ⭐
-- ============================================
CREATE TABLE notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  entity_type TEXT NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Trigger
  trigger JSONB NOT NULL,                -- {type: 'status_changed', from: 'draft', to: 'active'}
  
  -- Channels (array of channel configs)
  channels JSONB NOT NULL,               -- [{type: 'email', template: '...'}]
  
  -- Recipients
  recipients JSONB NOT NULL,             -- [{type: 'role', value: 'manager'}]
  
  -- Template
  template JSONB,                        -- {subject, body, variables}
  
  -- Schedule (optional)
  schedule JSONB,                        -- {type: 'daily', time: '09:00'}
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CMS: NOTIFICATION LOG
-- ============================================
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  rule_id UUID REFERENCES notification_rules(id),
  
  -- Recipient
  recipient_type TEXT NOT NULL,          -- 'email', 'sms', 'in_app'
  recipient_id TEXT NOT NULL,            -- email address or user_id
  
  -- Content
  subject TEXT,
  body TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending',         -- pending|sent|failed
  error_message TEXT,
  
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COLLABORATIVE DOCUMENTS ⭐⭐⭐
-- ============================================
CREATE TABLE documents_collaborative (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  
  -- Document info
  title TEXT NOT NULL DEFAULT 'Untitled Document',
  
  -- Relations (optional - can be standalone or attached to project/invoice)
  entity_type TEXT,                      -- 'project', 'invoice', null
  entity_id UUID,                        -- Related entity ID
  
  -- Content (Tiptap/Lexical JSON)
  content JSONB DEFAULT '{}',            -- Editor state as JSON
  content_text TEXT,                     -- Plain text for search (auto-generated)
  
  -- Version control
  version INT DEFAULT 1,
  
  -- Sharing & permissions
  visibility TEXT DEFAULT 'private',     -- private|team|public
  public_share_token UUID UNIQUE,        -- For public sharing
  share_password TEXT,                   -- Optional password for public share
  
  -- Settings
  allow_comments BOOLEAN DEFAULT true,
  allow_edits BOOLEAN DEFAULT true,
  
  -- Meta
  cover_image_url TEXT,
  icon_emoji TEXT,                       -- '📄'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id),
  updated_by UUID REFERENCES user_profiles(id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_docs_tenant ON documents_collaborative(tenant_id) 
WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_entity ON documents_collaborative(entity_type, entity_id);
CREATE INDEX idx_docs_public ON documents_collaborative(public_share_token) 
WHERE visibility = 'public';
CREATE INDEX idx_docs_search ON documents_collaborative 
USING gin(to_tsvector('simple', title || ' ' || coalesce(content_text, '')));

-- ============================================
-- DOCUMENT VERSIONS (Version History)
-- ============================================
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  
  version INT NOT NULL,
  content JSONB NOT NULL,
  content_text TEXT,
  
  -- Who made this version
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Change summary
  change_summary TEXT,                   -- Auto-generated or manual
  
  UNIQUE(document_id, version)
);

CREATE INDEX idx_doc_versions_doc ON document_versions(document_id);

-- ============================================
-- DOCUMENT COMMENTS ⭐
-- ============================================
CREATE TABLE document_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  
  -- Comment location in document
  position JSONB,                        -- {line: 10, offset: 5} or null for general
  selection_text TEXT,                   -- Highlighted text
  
  -- Comment content
  content TEXT NOT NULL,
  
  -- Thread support
  parent_id UUID REFERENCES document_comments(id),
  
  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES user_profiles(id),
  resolved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_doc_comments_doc ON document_comments(document_id) 
WHERE deleted_at IS NULL;
CREATE INDEX idx_doc_comments_parent ON document_comments(parent_id);

-- ============================================
-- DOCUMENT COLLABORATORS
-- ============================================
CREATE TABLE document_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  
  -- Permission level
  permission TEXT DEFAULT 'view',        -- view|comment|edit|admin
  
  -- Activity tracking
  last_viewed_at TIMESTAMPTZ,
  last_edited_at TIMESTAMPTZ,
  
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES user_profiles(id),
  
  UNIQUE(document_id, user_id)
);

CREATE INDEX idx_doc_collab_doc ON document_collaborators(document_id);
CREATE INDEX idx_doc_collab_user ON document_collaborators(user_id);

-- ============================================
-- REAL-TIME PRESENCE (Who's editing now)
-- ============================================
CREATE TABLE document_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  
  -- Cursor position (for real-time collaboration)
  cursor_position JSONB,
  
  -- Online status
  is_active BOOLEAN DEFAULT true,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(document_id, user_id)
);

CREATE INDEX idx_doc_presence_doc ON document_presence(document_id) 
WHERE is_active = true;

-- Auto-cleanup old presence records (cron job)
-- DELETE FROM document_presence WHERE last_seen_at < NOW() - INTERVAL '5 minutes'

-- ============================================
-- DOCUMENT EXPORTS
-- ============================================
CREATE TABLE document_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id),
  
  format TEXT NOT NULL,                  -- 'pdf', 'markdown', 'docx', 'html'
  file_url TEXT,
  file_size INT,
  
  status TEXT DEFAULT 'processing',      -- processing|completed|failed
  error_message TEXT,
  
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- RLS POLICIES FOR CMS TABLES
-- ============================================

ALTER TABLE dynamic_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_collaborative ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_collaborators ENABLE ROW LEVEL SECURITY;

-- Tenant isolation
CREATE POLICY "tenant_isolation_dynamic_fields"
ON dynamic_fields FOR ALL TO authenticated
USING (tenant_id = auth.user_tenant_id());

CREATE POLICY "tenant_isolation_workflows"
ON workflows FOR ALL TO authenticated
USING (tenant_id = auth.user_tenant_id());

-- Documents: can see if collaborator OR public
CREATE POLICY "docs_collaborators_access"
ON documents_collaborative FOR ALL TO authenticated
USING (
  tenant_id = auth.user_tenant_id() AND (
    created_by = auth.uid() OR
    id IN (
      SELECT document_id FROM document_collaborators 
      WHERE user_id = auth.uid()
    )
  )
);

-- Public documents: anyone with link
CREATE POLICY "docs_public_access"
ON documents_collaborative FOR SELECT TO anon, authenticated
USING (visibility = 'public' AND deleted_at IS NULL);

-- Comments: can see if can see document
CREATE POLICY "comments_document_access"
ON document_comments FOR ALL TO authenticated
USING (
  document_id IN (
    SELECT id FROM documents_collaborative
    WHERE tenant_id = auth.user_tenant_id()
  )
);

-- ============================================
-- FUNCTIONS FOR CMS
-- ============================================

-- Get dynamic field values for an entity
CREATE OR REPLACE FUNCTION get_dynamic_fields(
  p_entity_type TEXT,
  p_entity_id UUID
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_object_agg(df.key, dfv.value)
  INTO result
  FROM dynamic_fields df
  LEFT JOIN dynamic_field_values dfv 
    ON dfv.field_id = df.id AND dfv.entity_id = p_entity_id
  WHERE df.entity_type = p_entity_type
    AND df.is_active = true
    AND df.tenant_id = auth.user_tenant_id();
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set dynamic field value
CREATE OR REPLACE FUNCTION set_dynamic_field_value(
  p_field_key TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_value JSONB
)
RETURNS VOID AS $$
DECLARE
  v_field_id UUID;
  v_tenant_id UUID;
BEGIN
  -- Get field ID
  SELECT id, tenant_id INTO v_field_id, v_tenant_id
  FROM dynamic_fields
  WHERE key = p_field_key
    AND entity_type = p_entity_type
    AND tenant_id = auth.user_tenant_id();
  
  IF v_field_id IS NULL THEN
    RAISE EXCEPTION 'Field % not found', p_field_key;
  END IF;
  
  -- Upsert value
  INSERT INTO dynamic_field_values (
    tenant_id,
    field_id,
    entity_type,
    entity_id,
    value
  ) VALUES (
    v_tenant_id,
    v_field_id,
    p_entity_type,
    p_entity_id,
    p_value
  )
  ON CONFLICT (field_id, entity_id)
  DO UPDATE SET value = p_value, updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create document version on update
CREATE OR REPLACE FUNCTION create_document_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content changed
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    INSERT INTO document_versions (
      document_id,
      version,
      content,
      content_text,
      created_by
    ) VALUES (
      NEW.id,
      NEW.version,
      OLD.content,
      OLD.content_text,
      NEW.updated_by
    );
    
    -- Increment version
    NEW.version = NEW.version + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_version_trigger
  BEFORE UPDATE ON documents_collaborative
  FOR EACH ROW
  WHEN (OLD.content IS DISTINCT FROM NEW.content)
  EXECUTE FUNCTION create_document_version();

-- Auto-update content_text for search
CREATE OR REPLACE FUNCTION update_document_search_text()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract plain text from Tiptap/Lexical JSON
  -- Simplified version - in production use proper JSON parsing
  NEW.content_text = NEW.content::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_search_text_trigger
  BEFORE INSERT OR UPDATE ON documents_collaborative
  FOR EACH ROW
  EXECUTE FUNCTION update_document_search_text();
```

---

## 📦 COLLABORATIVE DOCUMENTS - COMPLETE IMPLEMENTATION

### **Tech Stack for Docs:**

```yaml
Editor:
  Primary: Tiptap (ProseMirror-based, best for collaboration)
  Alternative: Lexical (Meta's new editor)
  
Real-time:
  Backend: Supabase Realtime (WebSocket)
  Alternative: Socket.io + Redis
  
Collaboration:
  Library: Y.js (CRDT for conflict-free merging)
  Provider: y-supabase or y-websocket
  
Features:
  - Rich text formatting
  - Tables (drag to resize)
  - Images (drag & drop, paste)
  - Embeds (YouTube, Figma, etc.)
  - Comments & mentions
  - Version history
  - Export (PDF, Markdown, DOCX)
```

### **File Structure:**

```typescript
// apps/web/src/app/(dashboard)/docs/
// ├── page.tsx                        # Docs list
// ├── [id]/
// │   ├── page.tsx                    # Document viewer
// │   └── edit/
// │       └── page.tsx                # Document editor
// └── new/
//     └── page.tsx                    # Create new doc

// components/docs/
// ├── DocumentEditor.tsx              # Main editor (Tiptap)
// ├── DocumentToolbar.tsx             # Format toolbar
// ├── DocumentComments.tsx            # Comments sidebar
// ├── DocumentVersions.tsx            # Version history
// ├── DocumentShare.tsx               # Share dialog
// ├── CollaboratorCursors.tsx         # Real-time cursors
// └── DocumentExport.tsx              # Export options

// lib/docs/
// ├── editor-config.ts                # Tiptap configuration
// ├── collaboration.ts                # Y.js setup
// ├── export-pdf.ts                   # PDF generation
// └── export-markdown.ts              # Markdown export
```

### **Document Editor Implementation:**

```typescript
// components/docs/DocumentEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as Y from 'yjs'

interface DocumentEditorProps {
  documentId: string
  initialContent?: any
  readOnly?: boolean
}

export function DocumentEditor({ 
  documentId, 
  initialContent,
  readOnly = false 
}: DocumentEditorProps) {
  const supabase = createClient()
  
  // Y.js document for collaboration
  const ydoc = new Y.Doc()
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable default history (Y.js handles it)
      }),
      
      // Collaboration
      Collaboration.configure({
        document: ydoc,
      }),
      
      CollaborationCursor.configure({
        provider: null, // Set after mount
        user: {
          name: 'User Name', // Get from auth
          color: '#279989',  // Random color per user
        },
      }),
      
      // Tables
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      
      // Images
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      
      // Links
      Link.configure({
        openOnClick: false,
      }),
      
      // Placeholder
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    
    content: initialContent,
    editable: !readOnly,
    
    onUpdate: ({ editor }) => {
      // Auto-save to database (debounced)
      saveDocument(documentId, editor.getJSON())
    },
  })
  
  // Setup real-time collaboration
  useEffect(() => {
    if (!editor) return
    
    // Subscribe to Supabase Realtime
    const channel = supabase.channel(`doc:${documentId}`)
      .on('broadcast', { event: 'update' }, ({ payload }) => {
        // Apply remote updates
        Y.applyUpdate(ydoc, payload.update)
      })
      .subscribe()
    
    // Send local updates
    ydoc.on('update', (update: Uint8Array) => {
      channel.send({
        type: 'broadcast',
        event: 'update',
        payload: { update }
      })
    })
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [editor, documentId])
  
  if (!editor) return null
  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <DocumentToolbar editor={editor} />
      
      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-4xl mx-auto p-8"
        />
      </div>
      
      {/* Collaborators (online users) */}
      <CollaboratorBar documentId={documentId} />
    </div>
  )
}

// Toolbar with formatting options
function DocumentToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="border-b p-2 flex gap-1 sticky top-0 bg-background z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-accent' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-accent' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      {/* Heading levels */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>
      
      {/* Table */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().insertTable({ 
          rows: 3, 
          cols: 3 
        }).run()}
      >
        <Table2 className="h-4 w-4" />
      </Button>
      
      {/* Image */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = prompt('Enter image URL:')
          if (url) {
            editor.chain().focus().setImage({ src: url }).run()
          }
        }}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>
      
      {/* Link */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = prompt('Enter link URL:')
          if (url) {
            editor.chain().focus().setLink({ href: url }).run()
          }
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}

// Show online collaborators
function CollaboratorBar({ documentId }: { documentId: string }) {
  const [collaborators, setCollaborators] = useState<User[]>([])
  
  useEffect(() => {
    // Subscribe to presence
    const channel = supabase.channel(`presence:${documentId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setCollaborators(Object.values(state).flat())
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            name: user.name,
            avatar: user.avatar,
            online_at: new Date().toISOString()
          })
        }
      })
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [documentId])
  
  return (
    <div className="border-t p-2 flex items-center gap-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <div className="flex -space-x-2">
        {collaborators.map(collab => (
          <Avatar key={collab.user_id} className="border-2 border-background">
            <AvatarImage src={collab.avatar} />
            <AvatarFallback>{collab.name[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {collaborators.length} online
      </span>
    </div>
  )
}
```

### **Document Sharing:**

```typescript
// components/docs/DocumentShare.tsx
export function DocumentShare({ documentId }: { documentId: string }) {
  const [shareLink, setShareLink] = useState<string>()
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('private')
  
  const generateShareLink = async () => {
    // Generate public share token
    const response = await fetch(`/api/docs/${documentId}/share`, {
      method: 'POST',
      body: JSON.stringify({ visibility: 'public' })
    })
    
    const { shareToken } = await response.json()
    const link = `${window.location.origin}/share/${shareToken}`
    setShareLink(link)
  }
  
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Visibility */}
          <div>
            <Label>Who can access</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Only me</SelectItem>
                <SelectItem value="team">Team members</SelectItem>
                <SelectItem value="public">Anyone with link</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Public link */}
          {visibility === 'public' && (
            <div>
              <Label>Public link</Label>
              {shareLink ? (
                <div className="flex gap-2">
                  <Input value={shareLink} readOnly />
                  <Button onClick={() => navigator.clipboard.writeText(shareLink)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button onClick={generateShareLink}>
                  Generate Link
                </Button>
              )}
            </div>
          )}
          
          {/* Invite collaborators */}
          <div>
            <Label>Invite people</Label>
            <div className="flex gap-2">
              <Input placeholder="Enter email..." />
              <Select defaultValue="edit">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">Can view</SelectItem>
                  <SelectItem value="comment">Can comment</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                </SelectContent>
              </Select>
              <Button>Invite</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### **Comments System:**

```typescript
// components/docs/DocumentComments.tsx
export function DocumentComments({ documentId }: { documentId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  
  const addComment = async () => {
    await fetch(`/api/docs/${documentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content: newComment,
        position: editor.getSelection(), // Current cursor position
      })
    })
    
    setNewComment('')
  }
  
  return (
    <div className="w-80 border-l bg-muted/10 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Comments</h3>
        <Button variant="ghost" size="sm">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Add new comment */}
      <div className="space-y-2">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button onClick={addComment} size="sm">
          <Send className="h-4 w-4 mr-2" />
          Comment
        </Button>
      </div>
      
      {/* Comments list */}
      <div className="space-y-3">
        {comments.map(comment => (
          <Card key={comment.id} className="p-3">
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistance(comment.created_at, new Date())} ago
                  </span>
                </div>
                
                <p className="text-sm mt-1">{comment.content}</p>
                
                {/* Resolve button */}
                {!comment.is_resolved && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => resolveComment(comment.id)}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### **Export Options:**

```typescript
// lib/docs/export-pdf.ts
import { jsPDF } from 'jspdf'

export async function exportToPDF(content: any, title: string) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(20)
  doc.text(title, 20, 20)
  
  // Content (convert Tiptap JSON to PDF)
  // This is simplified - use proper converter in production
  let y = 40
  
  content.content.forEach((node: any) => {
    if (node.type === 'paragraph') {
      doc.setFontSize(12)
      doc.text(node.content[0]?.text || '', 20, y)
      y += 10
    } else if (node.type === 'heading') {
      doc.setFontSize(16)
      doc.text(node.content[0]?.text || '', 20, y)
      y += 15
    }
  })
  
  // Save
  doc.save(`${title}.pdf`)
}

// lib/docs/export-markdown.ts
export function exportToMarkdown(content: any): string {
  let markdown = ''
  
  content.content.forEach((node: any) => {
    if (node.type === 'heading') {
      const level = node.attrs.level
      markdown += '#'.repeat(level) + ' ' + node.content[0]?.text + '\n\n'
    } else if (node.type === 'paragraph') {
      markdown += node.content[0]?.text + '\n\n'
    } else if (node.type === 'table') {
      // Convert table to markdown
      markdown += '| Header 1 | Header 2 |\n'
      markdown += '|----------|----------|\n'
      // ... table rows
    }
  })
  
  return markdown
}
```

---

## 🎯 SESSION 4: EXACT IMPLEMENTATION PLAN

### **Phase 1: Database Setup (30 min)**

```bash
# 1. Create migration file
supabase/migrations/003_cms_system.sql

# Content: All CMS tables above (copy from schema)

# 2. Push to Supabase
npx supabase db push

# 3. Generate Prisma types
cd packages/db
npx prisma db pull
npx prisma generate
```

### **Phase 2: Dynamic Fields UI (1-2 hours)**

```typescript
// Files to create:
apps/web/src/app/(dashboard)/admin/
├── cms/
│   ├── dynamic-fields/
│   │   ├── page.tsx                    # List dynamic fields
│   │   └── [entity]/
│   │       └── page.tsx                # Manage fields for entity
│   └── workflows/
│       └── page.tsx                    # Workflow builder

components/admin/cms/
├── DynamicFieldsManager.tsx            # Main manager
├── DynamicFieldDialog.tsx              # Add/edit field
├── FieldTypeSelector.tsx               # Select field type
└── DynamicFieldsRenderer.tsx           # Render fields in forms
```

### **Phase 3: Collaborative Docs (2-3 hours)**

```typescript
// Files to create:
apps/web/src/app/(dashboard)/docs/
├── page.tsx                            # Docs list
├── [id]/
│   └── page.tsx                        # Document viewer
└── new/
    └── page.tsx                        # Create new doc

components/docs/
├── DocumentEditor.tsx                  # ⭐ Main editor (Tiptap)
├── DocumentToolbar.tsx                 # Format toolbar
├── DocumentComments.tsx                # Comments sidebar
├── DocumentShare.tsx                   # Share dialog
└── CollaboratorBar.tsx                 # Online users

lib/docs/
├── editor-config.ts                    # Tiptap setup
└── export-pdf.ts                       # PDF export

# Dependencies to add:
pnpm add @tiptap/react @tiptap/starter-kit
pnpm add @tiptap/extension-collaboration
pnpm add @tiptap/extension-collaboration-cursor
pnpm add @tiptap/extension-table
pnpm add @tiptap/extension-image
pnpm add @tiptap/extension-link
pnpm add yjs
pnpm add jspdf
```

---

## 🚀 QUICK COMMANDS

```bash
# Development
pnpm dev                                # Start all apps
pnpm --filter web dev                   # Web app only

# Database
npx supabase db push                    # Push migrations
npx prisma generate                     # Generate types
npx prisma studio                       # Database GUI

# CMS
/admin/cms/dynamic-fields/projects      # Manage project fields
/admin/cms/workflows/projects           # Setup workflows
/admin/cms/notifications                # Notification rules

# Collaborative Docs
/docs                                   # All documents
/docs/new                               # Create new document
/docs/[id]                              # View document
/docs/[id]/edit                         # Edit document (real-time)
/share/[token]                          # Public shared document

# Git
git add .
git commit -m "SESSION X: Feature Y"
git push origin main
```

---

## 💡 NEXT STEPS

```yaml
SESSION 4 (Current):
  ✅ Database schema (CMS + Docs)
  ⏳ Dynamic fields UI
  ⏳ Document editor (Tiptap)
  ⏳ Real-time collaboration (Y.js)

SESSION 5:
  - Workflow builder UI (ReactFlow)
  - Visual state machine
  - Transition actions

SESSION 6:
  - Notification engine
  - Email templates
  - SMS integration

SESSION 7:
  - Document comments
  - Version history
  - Export (PDF, Markdown)

SESSION 8:
  - Public sharing
  - Permissions
  - Analytics
```

---

**Ready to start SESSION 4?**

**Say:** "Claude Code - start SESSION 4: CMS + Collaborative Docs"

**I'll create:**
1. ✅ Migration file (003_cms_system.sql)
2. ✅ Dynamic fields manager UI
3. ✅ Document editor with Tiptap
4. ✅ Real-time collaboration
5. ✅ Comments & sharing

🚀 **Let's build!**
