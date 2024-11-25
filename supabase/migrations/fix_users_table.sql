-- First, ensure the users table has the required columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS completed_tutorials TEXT[] DEFAULT '{}';

-- Create user_activity table for tracking
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    activity_type TEXT NOT NULL,
    activity_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id),
    tutorial_categories JSONB DEFAULT '[]',
    onboarding_requirements JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update existing admin user
UPDATE users 
SET is_admin = true,
    onboarding_complete = true
WHERE email = 'admin@example.com';

-- Add RLS policies
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all activity"
ON user_activity FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

CREATE POLICY "Users can read their own activity"
ON user_activity FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create function to track user activity
CREATE OR REPLACE FUNCTION track_user_activity(
    p_user_id UUID,
    p_activity_type TEXT,
    p_activity_data JSONB
) RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity (user_id, activity_type, activity_data)
    VALUES (p_user_id, p_activity_type, p_activity_data);
    
    UPDATE users
    SET last_activity = CURRENT_TIMESTAMP
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;