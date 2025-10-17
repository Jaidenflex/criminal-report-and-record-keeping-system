-- Alternative: SQL script to create admin account directly in Supabase SQL Editor
-- This creates a profile entry that can be linked to a manually created auth user

-- First, you need to create the auth user in Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click "Add User"
-- 3. Email: admin@crcrms.gov.gh
-- 4. Password: Admin@2025!
-- 5. Copy the User ID that gets generated

-- Then run this SQL with the actual user ID:
-- Replace 'YOUR_USER_ID_HERE' with the actual UUID from the auth user you created

INSERT INTO profiles (id, email, full_name, role, phone, department, created_at, updated_at)
VALUES (
  'YOUR_USER_ID_HERE'::uuid,  -- Replace with actual user ID from auth.users
  'admin@crcrms.gov.gh',
  'System Administrator',
  'admin',
  '+233 20 000 0000',
  'Administration',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'System Administrator',
  department = 'Administration';

-- Verify the admin account
SELECT * FROM profiles WHERE email = 'admin@crcrms.gov.gh';
