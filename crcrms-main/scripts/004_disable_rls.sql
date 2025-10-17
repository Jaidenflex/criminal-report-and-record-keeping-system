-- Disable Row Level Security on all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE criminal_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE crimes DISABLE ROW LEVEL SECURITY;
ALTER TABLE investigations DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Officers can view criminal records" ON criminal_records;
DROP POLICY IF EXISTS "Officers can create criminal records" ON criminal_records;
DROP POLICY IF EXISTS "Officers can update criminal records" ON criminal_records;
DROP POLICY IF EXISTS "Admins can delete criminal records" ON criminal_records;
DROP POLICY IF EXISTS "Public can view crimes" ON crimes;
DROP POLICY IF EXISTS "Public can create crimes" ON crimes;
DROP POLICY IF EXISTS "Officers can view all crimes" ON crimes;
DROP POLICY IF EXISTS "Officers can update crimes" ON crimes;
DROP POLICY IF EXISTS "Officers can view investigations" ON investigations;
DROP POLICY IF EXISTS "Officers can create investigations" ON investigations;
DROP POLICY IF EXISTS "Officers can update investigations" ON investigations;
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
