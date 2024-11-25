-- First, ensure the users table has the required columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE;

-- Create admin user if not exists
INSERT INTO users (
    email,
    password,
    first_name,
    last_name,
    is_admin,
    is_approved,
    onboarding_complete
) VALUES (
    'admin@example.com',
    'admin123', -- In production, this should be hashed
    'Admin',
    'User',
    true,
    true,
    true
) ON CONFLICT (email) DO UPDATE 
SET 
    is_admin = true,
    is_approved = true,
    onboarding_complete = true;

-- Create function to ensure users have an admin
CREATE OR REPLACE FUNCTION ensure_user_has_admin()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_admin = false AND NEW.admin_id IS NULL THEN
        -- Assign to a random admin
        NEW.admin_id = (
            SELECT id FROM users 
            WHERE is_admin = true 
            ORDER BY RANDOM() 
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically assign admin
DROP TRIGGER IF EXISTS assign_admin_trigger ON users;
CREATE TRIGGER assign_admin_trigger
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_user_has_admin();

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Admins can view and manage their assigned users
CREATE POLICY "Admins can view their users"
ON users FOR SELECT
TO authenticated
USING (
    is_admin = true OR 
    admin_id = auth.uid() OR 
    id = auth.uid()
);

CREATE POLICY "Admins can update their users"
ON users FOR UPDATE
TO authenticated
USING (
    is_admin = true OR 
    admin_id = auth.uid()
);