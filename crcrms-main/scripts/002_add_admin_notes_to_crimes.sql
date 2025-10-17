-- Add admin_notes column to crimes table
ALTER TABLE public.crimes
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN public.crimes.admin_notes IS 'Instructions or notes from admin to assigned officer';
