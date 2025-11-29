-- =============================================
-- RIVEST PLATFORM - INITIAL SCHEMA
-- =============================================
-- Version: 1.0.0
-- Date: 2024-11-28
-- Description: Core tables for multi-tenant construction management
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TENANTS (Multi-tenant core)
-- =============================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#279989',
  secondary_color TEXT DEFAULT '#333F48',
  settings JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  max_users INTEGER DEFAULT 50,
  max_projects INTEGER DEFAULT 100,
  max_storage_gb INTEGER DEFAULT 10,
  status TEXT DEFAULT 'active',
  subscription_tier TEXT DEFAULT 'basic',
  trial_ends_at TIMESTAMPTZ,
  subscription_starts_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  billing_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  CONSTRAINT tenant_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_tenants_slug ON tenants(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenants_domain ON tenants(domain) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenants_status ON tenants(status) WHERE deleted_at IS NULL;

-- =============================================
-- USER PROFILES
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  auth_user_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  permissions JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_user_profiles_tenant ON user_profiles(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_auth ON user_profiles(auth_user_id) WHERE deleted_at IS NULL;

-- =============================================
-- COMPANIES (clients, suppliers, subcontractors)
-- =============================================
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  registry_code TEXT,
  vat_number TEXT,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'client',
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Estonia',
  bank_account TEXT,
  payment_term_days INTEGER DEFAULT 14,
  credit_limit DECIMAL(15,2),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, registry_code)
);

CREATE INDEX idx_companies_tenant ON companies(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_companies_type ON companies(type) WHERE deleted_at IS NULL;

-- =============================================
-- PROJECTS
-- =============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID REFERENCES companies(id),
  status TEXT DEFAULT 'draft',
  budget DECIMAL(15,2),
  currency TEXT DEFAULT 'EUR',
  start_date DATE,
  end_date DATE,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Estonia',
  manager_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, code)
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_status ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_client ON projects(client_id) WHERE deleted_at IS NULL;

-- =============================================
-- INVOICES
-- =============================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  type TEXT DEFAULT 'sales',
  status TEXT DEFAULT 'draft',
  project_id UUID REFERENCES projects(id),
  company_id UUID REFERENCES companies(id),
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal DECIMAL(15,2) NOT NULL,
  vat_amount DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  paid_amount DECIMAL(15,2) DEFAULT 0,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  line_items JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, invoice_number)
);

CREATE INDEX idx_invoices_tenant ON invoices(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_status ON invoices(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_due_date ON invoices(due_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_invoices_project ON invoices(project_id) WHERE deleted_at IS NULL;

-- =============================================
-- EMPLOYEES
-- =============================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  employee_code TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  personal_code TEXT,
  position TEXT,
  department TEXT,
  employment_type TEXT DEFAULT 'full_time',
  start_date DATE,
  end_date DATE,
  hourly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  UNIQUE(tenant_id, employee_code)
);

CREATE INDEX idx_employees_tenant ON employees(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_status ON employees(status) WHERE deleted_at IS NULL;

-- =============================================
-- DOCUMENTS
-- =============================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  version INTEGER DEFAULT 1,
  uploaded_by UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_tenant ON documents(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_project ON documents(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_type ON documents(type) WHERE deleted_at IS NULL;

-- =============================================
-- AUDIT LOG
-- =============================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
