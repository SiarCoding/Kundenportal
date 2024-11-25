-- Reset policies
DROP POLICY IF EXISTS "Allow public registration" ON users;
DROP POLICY IF EXISTS "Allow email existence check" ON users;
DROP POLICY IF EXISTS "Allow authenticated read" ON users;
DROP POLICY IF EXISTS "Allow self update" ON users;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable registration"
ON users FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable read access"
ON users FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable update for users and admins"
ON users FOR UPDATE
TO public
USING (true);

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
) ON CONFLICT (email) DO UPDATE 
SET 
    is_admin = true,
    is_approved = true,
    onboarding_complete = true;