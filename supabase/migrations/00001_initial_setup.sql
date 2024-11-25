-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Enable insert for registration" ON users;

-- Create new policies for users table
CREATE POLICY "Enable registration"
ON users FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable read access for users"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    admin_id = auth.uid() OR 
    is_admin = true
);

CREATE POLICY "Enable update for users"
ON users FOR UPDATE
TO authenticated
USING (
    id = auth.uid() OR 
    is_admin = true
);

-- Recreate admin user with proper permissions
DELETE FROM users WHERE email = 'admin@example.com';
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
);