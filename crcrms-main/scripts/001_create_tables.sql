-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'officer', 'public');
CREATE TYPE crime_status AS ENUM ('reported', 'under_investigation', 'solved', 'closed');
CREATE TYPE investigation_status AS ENUM ('pending', 'active', 'completed', 'suspended');
CREATE TYPE record_status AS ENUM ('active', 'archived', 'sealed');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'public',
  badge_number TEXT,
  department TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Criminal records table
CREATE TABLE IF NOT EXISTS public.criminal_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  national_id TEXT,
  gender TEXT,
  address TEXT,
  photo_url TEXT,
  fingerprint_data TEXT,
  status record_status NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crimes table
CREATE TABLE IF NOT EXISTS public.crimes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crime_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_occurred TIMESTAMPTZ NOT NULL,
  status crime_status NOT NULL DEFAULT 'reported',
  severity TEXT NOT NULL,
  reported_by UUID REFERENCES auth.users(id),
  assigned_officer UUID REFERENCES auth.users(id),
  criminal_id UUID REFERENCES public.criminal_records(id),
  evidence_urls TEXT[],
  witness_info TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Investigations table
CREATE TABLE IF NOT EXISTS public.investigations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crime_id UUID REFERENCES public.crimes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lead_officer UUID REFERENCES auth.users(id),
  status investigation_status NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL,
  findings TEXT,
  start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criminal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins and officers can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Criminal records policies
CREATE POLICY "Officers and admins can view criminal records"
  ON public.criminal_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

CREATE POLICY "Officers and admins can insert criminal records"
  ON public.criminal_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

CREATE POLICY "Officers and admins can update criminal records"
  ON public.criminal_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Crimes policies
CREATE POLICY "Users can view their own reported crimes"
  ON public.crimes FOR SELECT
  USING (auth.uid() = reported_by);

CREATE POLICY "Officers and admins can view all crimes"
  ON public.crimes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

CREATE POLICY "Authenticated users can report crimes"
  ON public.crimes FOR INSERT
  WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Officers and admins can update crimes"
  ON public.crimes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Investigations policies
CREATE POLICY "Officers and admins can view investigations"
  ON public.investigations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

CREATE POLICY "Officers and admins can create investigations"
  ON public.investigations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

CREATE POLICY "Officers and admins can update investigations"
  ON public.investigations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'officer')
    )
  );

-- Audit logs policies
CREATE POLICY "Admins can view all audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_crimes_status ON public.crimes(status);
CREATE INDEX idx_crimes_reported_by ON public.crimes(reported_by);
CREATE INDEX idx_crimes_assigned_officer ON public.crimes(assigned_officer);
CREATE INDEX idx_investigations_status ON public.investigations(status);
CREATE INDEX idx_investigations_crime_id ON public.investigations(crime_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_criminal_records_updated_at BEFORE UPDATE ON public.criminal_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crimes_updated_at BEFORE UPDATE ON public.crimes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investigations_updated_at BEFORE UPDATE ON public.investigations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'public')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
