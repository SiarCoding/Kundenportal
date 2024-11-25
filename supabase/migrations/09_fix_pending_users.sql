-- Drop existing policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "enable_registration" ON users;
    DROP POLICY IF EXISTS "enable_read_access" ON users;
    DROP POLICY IF EXISTS "enable_update_access" ON users;
END $$;

-- Make sure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
CREATE POLICY "enable_insert"
ON users FOR INSERT
TO PUBLIC
WITH CHECK (true);

CREATE POLICY "enable_select"
ON users FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "enable_update"
ON users FOR UPDATE
TO PUBLIC
USING (true);

CREATE POLICY "enable_delete"
ON users FOR DELETE
TO PUBLIC
USING (true);

-- Create function to assign admin
CREATE OR REPLACE FUNCTION assign_admin_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_admin = false THEN
        NEW.admin_id = (
            SELECT id FROM users 
            WHERE is_admin = true 
            ORDER BY created_at ASC 
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin assignment
DROP TRIGGER IF EXISTS assign_admin_trigger ON users;
CREATE TRIGGER assign_admin_trigger
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION assign_admin_on_insert();

-- Ensure admin exists
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
    'admin123',
    'Admin',
    'User',
    true,
    true,
    true
) ON CONFLICT (email) 
DO UPDATE SET 
    is_admin = true,
    is_approved = true,
    onboarding_complete = true;