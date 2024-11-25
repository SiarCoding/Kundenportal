-- First, ensure the users table has all required columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_id UUID,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key constraint for admin_id
ALTER TABLE users
ADD CONSTRAINT fk_admin_id
FOREIGN KEY (admin_id)
REFERENCES users(id)
ON DELETE SET NULL;

-- Create or update admin user
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

-- Create user_activity table
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON users(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_admin_id ON user_activity(admin_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view own record"
ON users FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR 
    admin_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
);

CREATE POLICY "Admins can update users"
ON users FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (SELECT id FROM users WHERE is_admin = true)
);

CREATE POLICY "Admins can view activities of their users"
ON user_activity FOR SELECT
TO authenticated
USING (
    admin_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = user_activity.user_id
        AND users.admin_id = auth.uid()
    )
);

-- Function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB
) RETURNS VOID AS $$
DECLARE
    v_admin_id UUID;
BEGIN
    -- Get the admin_id for this user
    SELECT admin_id INTO v_admin_id
    FROM users
    WHERE id = p_user_id;

    INSERT INTO user_activity (user_id, admin_id, activity_type, activity_data)
    VALUES (p_user_id, v_admin_id, p_activity_type, p_activity_data);
    
    UPDATE users
    SET last_activity = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;