-- =============================================
-- RIVEST PLATFORM - ROW LEVEL SECURITY
-- =============================================
-- Version: 1.0.0
-- Date: 2024-11-28
-- Description: RLS policies for multi-tenant isolation
-- =============================================

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Get current user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT tenant_id
    FROM user_profiles
    WHERE auth_user_id = auth.uid()
    AND deleted_at IS NULL
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has role
CREATE OR REPLACE FUNCTION user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE auth_user_id = auth.uid()
    AND role = required_role
    AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TENANTS POLICIES
-- =============================================
CREATE POLICY "Users can view their own tenant"
  ON tenants FOR SELECT
  USING (id = get_user_tenant_id());

-- =============================================
-- USER PROFILES POLICIES
-- =============================================
CREATE POLICY "Users can view profiles in their tenant"
  ON user_profiles FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth_user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Admins can manage users in their tenant"
  ON user_profiles FOR ALL
  USING (
    tenant_id = get_user_tenant_id()
    AND user_has_role('admin')
    AND deleted_at IS NULL
  );

-- =============================================
-- COMPANIES POLICIES
-- =============================================
CREATE POLICY "Users can view companies in their tenant"
  ON companies FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Users can create companies in their tenant"
  ON companies FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update companies in their tenant"
  ON companies FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Admins can delete companies"
  ON companies FOR DELETE
  USING (
    tenant_id = get_user_tenant_id()
    AND user_has_role('admin')
  );

-- =============================================
-- PROJECTS POLICIES
-- =============================================
CREATE POLICY "Users can view projects in their tenant"
  ON projects FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Users can create projects in their tenant"
  ON projects FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update projects in their tenant"
  ON projects FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Managers can delete projects"
  ON projects FOR DELETE
  USING (
    tenant_id = get_user_tenant_id()
    AND (user_has_role('admin') OR user_has_role('manager'))
  );

-- =============================================
-- INVOICES POLICIES
-- =============================================
CREATE POLICY "Users can view invoices in their tenant"
  ON invoices FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Users can create invoices in their tenant"
  ON invoices FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update draft invoices"
  ON invoices FOR UPDATE
  USING (
    tenant_id = get_user_tenant_id()
    AND deleted_at IS NULL
    AND (status = 'draft' OR user_has_role('admin'))
  );

CREATE POLICY "Admins can delete invoices"
  ON invoices FOR DELETE
  USING (
    tenant_id = get_user_tenant_id()
    AND user_has_role('admin')
  );

-- =============================================
-- EMPLOYEES POLICIES
-- =============================================
CREATE POLICY "Users can view employees in their tenant"
  ON employees FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Managers can create employees"
  ON employees FOR INSERT
  WITH CHECK (
    tenant_id = get_user_tenant_id()
    AND (user_has_role('admin') OR user_has_role('manager'))
  );

CREATE POLICY "Managers can update employees"
  ON employees FOR UPDATE
  USING (
    tenant_id = get_user_tenant_id()
    AND deleted_at IS NULL
    AND (user_has_role('admin') OR user_has_role('manager'))
  );

CREATE POLICY "Admins can delete employees"
  ON employees FOR DELETE
  USING (
    tenant_id = get_user_tenant_id()
    AND user_has_role('admin')
  );

-- =============================================
-- DOCUMENTS POLICIES
-- =============================================
CREATE POLICY "Users can view documents in their tenant"
  ON documents FOR SELECT
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Users can create documents in their tenant"
  ON documents FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update documents in their tenant"
  ON documents FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND deleted_at IS NULL);

CREATE POLICY "Admins can delete documents"
  ON documents FOR DELETE
  USING (
    tenant_id = get_user_tenant_id()
    AND user_has_role('admin')
  );

-- =============================================
-- AUDIT LOG POLICIES
-- =============================================
CREATE POLICY "Users can view audit log in their tenant"
  ON audit_log FOR SELECT
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY "System can insert audit log"
  ON audit_log FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
