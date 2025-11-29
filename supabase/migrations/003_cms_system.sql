-- =============================================
-- RIVEST PLATFORM - CMS SYSTEM
-- =============================================
-- Version: 1.0.0
-- Date: 2024-11-28
-- Description: Dynamic fields, workflows, notifications
-- =============================================

-- =============================================
-- DYNAMIC FIELDS SYSTEM
-- =============================================

-- Dynamic field definitions
CREATE TABLE dynamic_fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,  -- 'projects', 'invoices', etc.

  -- Field definition
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  type TEXT NOT NULL,  -- text, number, select, date, file, etc.

  -- Configuration (JSON)
  config JSONB DEFAULT '{}',
  /*
  {
    "options": [{"label": "High", "value": "high", "color": "#ef4444"}],
    "min": 0,
    "max": 100,
    "placeholder": "Enter value...",
    "helpText": "This field is for...",
    "defaultValue": null
  }
  */

  -- Validation
  required BOOLEAN DEFAULT false,
  validation_rules JSONB DEFAULT '[]',

  -- Display
  sort_order INTEGER DEFAULT 0,
  field_group TEXT DEFAULT 'General',

  -- Conditional logic
  conditional_logic JSONB DEFAULT '[]',

  -- Permissions
  can_view JSONB DEFAULT '["admin", "manager", "user"]',
  can_edit JSONB DEFAULT '["admin", "manager"]',

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, entity_type, key)
);

CREATE INDEX idx_dynamic_fields_tenant ON dynamic_fields(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_dynamic_fields_entity ON dynamic_fields(entity_type) WHERE deleted_at IS NULL;

-- Dynamic field values
CREATE TABLE dynamic_field_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES dynamic_fields(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,

  -- Value storage (supports all types)
  value_text TEXT,
  value_number DECIMAL(20,4),
  value_boolean BOOLEAN,
  value_date DATE,
  value_datetime TIMESTAMPTZ,
  value_json JSONB,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(field_id, entity_id)
);

CREATE INDEX idx_field_values_entity ON dynamic_field_values(entity_type, entity_id);
CREATE INDEX idx_field_values_field ON dynamic_field_values(field_id);

-- =============================================
-- WORKFLOW SYSTEM
-- =============================================

-- Workflow definitions
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,

  name TEXT NOT NULL,
  description TEXT,

  -- State machine configuration
  states JSONB NOT NULL DEFAULT '[]',
  /*
  [
    {
      "id": "draft",
      "name": "draft",
      "label": "Mustand",
      "color": "#94a3b8",
      "icon": "file",
      "onEnter": [],
      "onExit": [],
      "canEdit": ["admin", "manager", "user"],
      "canTransition": ["admin", "manager", "user"]
    }
  ]
  */

  transitions JSONB NOT NULL DEFAULT '[]',
  /*
  [
    {
      "id": "submit_for_review",
      "name": "submit_for_review",
      "label": "Saada ülevaatusele",
      "from": "draft",
      "to": "review",
      "allowedRoles": ["admin", "manager"],
      "conditions": [],
      "actions": [],
      "buttonLabel": "Saada ülevaatusele",
      "buttonVariant": "default",
      "confirmMessage": "Kas oled kindel?",
      "requireComment": false
    }
  ]
  */

  -- Settings
  initial_state TEXT NOT NULL DEFAULT 'draft',
  allow_manual_transitions BOOLEAN DEFAULT true,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, entity_type)
);

CREATE INDEX idx_workflows_tenant ON workflows(tenant_id) WHERE deleted_at IS NULL;

-- Workflow history (audit trail)
CREATE TABLE workflow_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  workflow_id UUID NOT NULL REFERENCES workflows(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,

  -- Transition details
  from_state TEXT,
  to_state TEXT NOT NULL,
  transition_name TEXT,

  -- Who and when
  performed_by UUID,
  performed_at TIMESTAMPTZ DEFAULT NOW(),

  -- Additional info
  comment TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_workflow_history_entity ON workflow_history(entity_type, entity_id);
CREATE INDEX idx_workflow_history_tenant ON workflow_history(tenant_id);

-- =============================================
-- NOTIFICATION SYSTEM
-- =============================================

-- Notification rules
CREATE TABLE notification_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,

  name TEXT NOT NULL,
  description TEXT,

  -- Trigger configuration
  trigger_type TEXT NOT NULL,  -- created, updated, deleted, status_changed, field_changed, scheduled
  trigger_conditions JSONB DEFAULT '[]',
  trigger_delay INTEGER DEFAULT 0,  -- minutes

  -- Channels
  channels JSONB NOT NULL DEFAULT '[]',
  /*
  [
    {
      "type": "email",
      "subject": "Project {{project.name}} updated",
      "template": "email_template_id"
    },
    {
      "type": "in_app",
      "title": "Project updated"
    }
  ]
  */

  -- Template
  template_subject TEXT,
  template_body TEXT NOT NULL,

  -- Recipients
  recipients JSONB NOT NULL DEFAULT '[]',
  /*
  [
    {"type": "role", "role": "admin"},
    {"type": "field", "field": "manager_id"},
    {"type": "user", "userId": "xxx"},
    {"type": "email", "email": "test@example.com"}
  ]
  */

  -- Schedule (for digest notifications)
  schedule JSONB,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_notification_rules_tenant ON notification_rules(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_rules_entity ON notification_rules(entity_type) WHERE deleted_at IS NULL;

-- Notification log
CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  rule_id UUID REFERENCES notification_rules(id),

  -- What triggered it
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  trigger_type TEXT NOT NULL,

  -- Delivery info
  channel TEXT NOT NULL,  -- email, sms, in_app, webhook
  recipient TEXT NOT NULL,  -- email, user_id, phone

  -- Content
  subject TEXT,
  body TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, sent, failed, read
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  error TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_log_tenant ON notification_log(tenant_id);
CREATE INDEX idx_notification_log_recipient ON notification_log(recipient);
CREATE INDEX idx_notification_log_status ON notification_log(status);

-- =============================================
-- COLLABORATIVE DOCUMENTS
-- =============================================

-- Documents for real-time collaboration
CREATE TABLE documents_collaborative (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT,

  -- Content (Tiptap/Y.js compatible)
  content JSONB DEFAULT '{}',
  content_text TEXT,  -- Plain text for search

  -- Ownership
  created_by UUID,

  -- Linking
  project_id UUID REFERENCES projects(id),
  parent_id UUID REFERENCES documents_collaborative(id),

  -- Settings
  is_template BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  public_token TEXT UNIQUE,
  password_hash TEXT,

  -- Status
  status TEXT DEFAULT 'draft',  -- draft, published, archived

  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_docs_tenant ON documents_collaborative(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_project ON documents_collaborative(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_docs_search ON documents_collaborative USING gin(to_tsvector('simple', content_text));

-- Document versions
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,

  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,

  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Restore info
  is_restored_from UUID REFERENCES document_versions(id),

  UNIQUE(document_id, version_number)
);

CREATE INDEX idx_doc_versions_doc ON document_versions(document_id);

-- Document comments
CREATE TABLE document_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,

  -- Comment content
  content TEXT NOT NULL,

  -- Position in document (for inline comments)
  position_start INTEGER,
  position_end INTEGER,

  -- Threading
  parent_id UUID REFERENCES document_comments(id),

  -- Author
  created_by UUID NOT NULL,

  -- Status
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMPTZ,

  -- Mentions
  mentions JSONB DEFAULT '[]',  -- User IDs

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_doc_comments_doc ON document_comments(document_id) WHERE deleted_at IS NULL;

-- Document collaborators (permissions)
CREATE TABLE document_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,

  -- Permission level
  permission TEXT NOT NULL DEFAULT 'view',  -- view, comment, edit, admin

  -- Invitation
  invited_by UUID,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT true,

  UNIQUE(document_id, user_id)
);

CREATE INDEX idx_doc_collabs_doc ON document_collaborators(document_id);
CREATE INDEX idx_doc_collabs_user ON document_collaborators(user_id);

-- Document presence (who's online)
CREATE TABLE document_presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents_collaborative(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,

  -- Cursor position
  cursor_position INTEGER,
  selection_start INTEGER,
  selection_end INTEGER,

  -- User info (denormalized for performance)
  user_name TEXT,
  user_color TEXT,

  -- Activity
  last_seen TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(document_id, user_id)
);

CREATE INDEX idx_doc_presence_doc ON document_presence(document_id);

-- =============================================
-- RLS POLICIES FOR CMS
-- =============================================

ALTER TABLE dynamic_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynamic_field_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents_collaborative ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_presence ENABLE ROW LEVEL SECURITY;

-- Dynamic fields policies
CREATE POLICY "tenant_dynamic_fields" ON dynamic_fields
  FOR ALL USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "tenant_field_values" ON dynamic_field_values
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Workflow policies
CREATE POLICY "tenant_workflows" ON workflows
  FOR ALL USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "tenant_workflow_history" ON workflow_history
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Notification policies
CREATE POLICY "tenant_notification_rules" ON notification_rules
  FOR ALL USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "tenant_notification_log" ON notification_log
  FOR ALL USING (tenant_id = get_user_tenant_id());

-- Document policies
CREATE POLICY "tenant_documents" ON documents_collaborative
  FOR ALL USING (
    (tenant_id = get_user_tenant_id() AND deleted_at IS NULL)
    OR (is_public = true AND deleted_at IS NULL)
  );

CREATE POLICY "tenant_doc_versions" ON document_versions
  FOR SELECT USING (
    document_id IN (
      SELECT id FROM documents_collaborative
      WHERE tenant_id = get_user_tenant_id()
    )
  );

CREATE POLICY "tenant_doc_comments" ON document_comments
  FOR ALL USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "doc_collaborators" ON document_collaborators
  FOR ALL USING (
    document_id IN (
      SELECT id FROM documents_collaborative
      WHERE tenant_id = get_user_tenant_id()
    )
  );

CREATE POLICY "doc_presence" ON document_presence
  FOR ALL USING (
    document_id IN (
      SELECT id FROM documents_collaborative
      WHERE tenant_id = get_user_tenant_id()
    )
  );

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_dynamic_fields_updated_at
  BEFORE UPDATE ON dynamic_fields
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
  BEFORE UPDATE ON workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_rules_updated_at
  BEFORE UPDATE ON notification_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_collaborative_updated_at
  BEFORE UPDATE ON documents_collaborative
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_comments_updated_at
  BEFORE UPDATE ON document_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
