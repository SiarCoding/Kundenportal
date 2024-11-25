-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;

-- Create new RLS policies with proper permissions
CREATE POLICY "Public registration access"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can view own record"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    admin_id = auth.uid() OR 
    is_admin = true
);

CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (
    id = auth.uid() OR 
    (is_admin = true AND EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND is_admin = true
    ))
);

-- Ensure admin user exists with proper permissions
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
    onboarding_complete = true,
    updated_at = CURRENT_TIMESTAMP;