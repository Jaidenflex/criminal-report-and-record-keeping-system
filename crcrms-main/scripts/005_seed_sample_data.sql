-- Clear existing data
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE investigations CASCADE;
TRUNCATE TABLE crimes CASCADE;
TRUNCATE TABLE criminal_records CASCADE;

-- Insert sample criminal records with explicit UUIDs
INSERT INTO criminal_records (id, first_name, last_name, date_of_birth, gender, national_id, address, status, fingerprint_data, photo_url, created_at, updated_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Kwame', 'Mensah', '1985-03-15', 'Male', 'GHA-1985-001', 'Accra, Greater Accra Region', 'active', 'FP-001-DATA', '/placeholder.svg?height=100&width=100', NOW(), NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Ama', 'Osei', '1990-07-22', 'Female', 'GHA-1990-002', 'Kumasi, Ashanti Region', 'active', 'FP-002-DATA', '/placeholder.svg?height=100&width=100', NOW(), NOW()),
  -- Changed 'inactive' to 'archived' (valid enum value)
  ('33333333-3333-3333-3333-333333333333', 'Kofi', 'Asante', '1988-11-30', 'Male', 'GHA-1988-003', 'Takoradi, Western Region', 'archived', 'FP-003-DATA', '/placeholder.svg?height=100&width=100', NOW(), NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Abena', 'Boateng', '1992-05-18', 'Female', 'GHA-1992-004', 'Tema, Greater Accra Region', 'active', 'FP-004-DATA', '/placeholder.svg?height=100&width=100', NOW(), NOW()),
  ('55555555-5555-5555-5555-555555555555', 'Yaw', 'Owusu', '1987-09-25', 'Male', 'GHA-1987-005', 'Cape Coast, Central Region', 'active', 'FP-005-DATA', '/placeholder.svg?height=100&width=100', NOW(), NOW());

-- Fixed crime status 'resolved' to 'solved' (valid enum value)
-- Insert sample crimes
INSERT INTO crimes (id, crime_type, description, location, date_occurred, status, severity, witness_info, evidence_urls, created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Theft', 'Motorcycle stolen from parking lot', 'Accra Central', '2024-01-15 14:30:00', 'reported', 'Medium', 'Security guard witnessed the incident', '{}', NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Assault', 'Physical altercation at local market', 'Makola Market, Accra', '2024-01-18 10:15:00', 'under_investigation', 'High', 'Multiple witnesses present', '{}', NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Burglary', 'Break-in at residential property', 'East Legon, Accra', '2024-01-20 03:00:00', 'under_investigation', 'High', 'Neighbor heard breaking glass', '{}', NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Fraud', 'Mobile money fraud case', 'Kumasi', '2024-01-22 16:45:00', 'reported', 'Medium', 'Victim has transaction records', '{}', NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Vandalism', 'Property damage at school', 'Tema Community 1', '2024-01-25 22:00:00', 'solved', 'Low', 'School security footage available', '{}', NOW(), NOW());

-- Fixed investigation status 'closed' to 'completed' (valid enum value)
-- Insert sample investigations
INSERT INTO investigations (id, title, description, status, priority, start_date, findings, created_at, updated_at)
VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Motorcycle Theft Ring Investigation', 'Investigation into organized motorcycle theft in Accra', 'active', 'High', '2024-01-16 09:00:00', 'Multiple suspects identified, surveillance ongoing', NOW(), NOW()),
  ('99999999-9999-9999-9999-999999999999', 'Market Assault Case', 'Investigation of assault incident at Makola Market', 'active', 'High', '2024-01-18 11:00:00', 'Witness statements collected, suspect identified', NOW(), NOW()),
  ('88888888-8888-8888-8888-888888888888', 'East Legon Burglary', 'Residential burglary investigation', 'active', 'Medium', '2024-01-20 08:00:00', 'Forensic evidence collected, analyzing fingerprints', NOW(), NOW()),
  ('77777777-7777-7777-7777-777777777777', 'Mobile Money Fraud Network', 'Investigation into mobile money fraud operations', 'pending', 'Medium', '2024-01-23 10:00:00', 'Initial investigation phase, gathering evidence', NOW(), NOW()),
  ('66666666-6666-6666-6666-666666666666', 'School Vandalism Case', 'Investigation of school property damage', 'completed', 'Low', '2024-01-26 09:00:00', 'Case resolved, perpetrators identified and charged', NOW(), NOW());
