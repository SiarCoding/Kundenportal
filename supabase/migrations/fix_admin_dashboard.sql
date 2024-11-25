-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS admin_id UUID,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key constraint
ALTER TABLE users
ADD CONSTRAINT fk_admin_id
FOREIGN KEY (admin_id)
REFERENCES users(id)
ON DELETE SET NULL;

-- Create user_activity table if not exists
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_admin_id ON user_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_users_admin_id ON users(admin_id);

-- Enable RLS
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
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