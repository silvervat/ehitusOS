-- ============================================
-- RLS Helper Function: get_user_tenant_id()
-- ============================================
-- This function is required for Row Level Security policies.
-- It returns the tenant_id of the currently authenticated user.
--
-- IMPORTANT: Run this SQL in Supabase SQL Editor before using the app!
-- ============================================

-- Create the function
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id
  FROM user_profiles
  WHERE auth_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_tenant_id() TO authenticated;

-- ============================================
-- RLS Policies for Projects
-- ============================================

-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see projects from their tenant
CREATE POLICY "Users can view own tenant projects"
ON projects FOR SELECT
USING (tenant_id = get_user_tenant_id());

-- Policy: Users can insert projects for their tenant
CREATE POLICY "Users can insert own tenant projects"
ON projects FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id());

-- Policy: Users can update projects from their tenant
CREATE POLICY "Users can update own tenant projects"
ON projects FOR UPDATE
USING (tenant_id = get_user_tenant_id());

-- Policy: Users can delete projects from their tenant
CREATE POLICY "Users can delete own tenant projects"
ON projects FOR DELETE
USING (tenant_id = get_user_tenant_id());

-- ============================================
-- RLS Policies for Invoices
-- ============================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant invoices"
ON invoices FOR SELECT
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert own tenant invoices"
ON invoices FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update own tenant invoices"
ON invoices FOR UPDATE
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete own tenant invoices"
ON invoices FOR DELETE
USING (tenant_id = get_user_tenant_id());

-- ============================================
-- RLS Policies for Employees
-- ============================================

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant employees"
ON employees FOR SELECT
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert own tenant employees"
ON employees FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update own tenant employees"
ON employees FOR UPDATE
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete own tenant employees"
ON employees FOR DELETE
USING (tenant_id = get_user_tenant_id());

-- ============================================
-- RLS Policies for User Profiles
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can see profiles from their own tenant
CREATE POLICY "Users can view own tenant profiles"
ON user_profiles FOR SELECT
USING (tenant_id = get_user_tenant_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth_user_id = auth.uid());

-- ============================================
-- RLS Policies for Tenants
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Users can view their own tenant
CREATE POLICY "Users can view own tenant"
ON tenants FOR SELECT
USING (id = get_user_tenant_id());

-- ============================================
-- RLS Policies for Companies
-- ============================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tenant companies"
ON companies FOR SELECT
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can insert own tenant companies"
ON companies FOR INSERT
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can update own tenant companies"
ON companies FOR UPDATE
USING (tenant_id = get_user_tenant_id());

CREATE POLICY "Users can delete own tenant companies"
ON companies FOR DELETE
USING (tenant_id = get_user_tenant_id());

-- ============================================
-- Special Policy for New User Registration
-- ============================================

-- Allow new users to create their own tenant during registration
CREATE POLICY "Anyone can insert tenants during registration"
ON tenants FOR INSERT
WITH CHECK (true);

-- Allow new users to create their own profile during registration
CREATE POLICY "Anyone can insert own profile during registration"
ON user_profiles FOR INSERT
WITH CHECK (auth_user_id = auth.uid());

-- ============================================
-- DONE!
-- ============================================
-- After running this migration, your multi-tenant
-- RLS policies will be active and secure.
-- ============================================
