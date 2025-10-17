-- Insert sample criminal records
INSERT INTO public.criminal_records (first_name, last_name, date_of_birth, national_id, gender, address, status)
VALUES
  ('Kwame', 'Mensah', '1985-03-15', 'GHA-123456789', 'Male', 'Accra, Greater Accra Region', 'active'),
  ('Ama', 'Asante', '1990-07-22', 'GHA-987654321', 'Female', 'Kumasi, Ashanti Region', 'active'),
  ('Kofi', 'Owusu', '1978-11-30', 'GHA-456789123', 'Male', 'Takoradi, Western Region', 'archived'),
  ('Akua', 'Boateng', '1995-05-18', 'GHA-789123456', 'Female', 'Tamale, Northern Region', 'active'),
  ('Yaw', 'Agyeman', '1982-09-08', 'GHA-321654987', 'Male', 'Cape Coast, Central Region', 'active');

-- Insert sample crimes (these will be linked after we have users)
-- Note: We'll need to update reported_by and assigned_officer after authentication is set up
INSERT INTO public.crimes (crime_type, description, location, date_occurred, status, severity, witness_info)
VALUES
  ('Theft', 'Motorcycle stolen from parking lot near Makola Market', 'Accra, Greater Accra Region', '2024-01-15 14:30:00', 'under_investigation', 'Medium', 'Two witnesses saw suspicious individuals'),
  ('Assault', 'Physical altercation at local bar resulting in injuries', 'Kumasi, Ashanti Region', '2024-01-20 22:15:00', 'reported', 'High', 'Bar owner and patrons witnessed the incident'),
  ('Burglary', 'Residential break-in with electronics stolen', 'Takoradi, Western Region', '2024-01-18 03:00:00', 'solved', 'Medium', 'Neighbor reported suspicious vehicle'),
  ('Fraud', 'Mobile money scam targeting elderly citizens', 'Tamale, Northern Region', '2024-01-22 10:00:00', 'under_investigation', 'High', 'Multiple victims came forward'),
  ('Vandalism', 'Public property damage at community center', 'Cape Coast, Central Region', '2024-01-25 19:45:00', 'reported', 'Low', 'Security camera footage available');

-- Note: Investigations will be created through the application after crimes are properly linked to officers
