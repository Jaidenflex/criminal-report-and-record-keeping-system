-- Add admin_notes column to crimes table for admin instructions to officers
ALTER TABLE crimes ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN crimes.admin_notes IS 'Instructions or notes from admin to assigned officer';
