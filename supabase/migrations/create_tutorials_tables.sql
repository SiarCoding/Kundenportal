-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tutorials table
CREATE TABLE tutorials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT CHECK (category IN ('Onboarding', 'Advanced', 'Expert')),
    content JSONB NOT NULL,
    "order" INTEGER NOT NULL,
    status TEXT CHECK (status IN ('draft', 'published')),
    required_for_onboarding BOOLEAN DEFAULT false,
    completion_required BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tutorial_progress table
CREATE TABLE tutorial_progress (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tutorial_id UUID REFERENCES tutorials(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    last_viewed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, tutorial_id)
);

-- Add indexes
CREATE INDEX idx_tutorials_category ON tutorials(category);
CREATE INDEX idx_tutorials_status ON tutorials(status);
CREATE INDEX idx_tutorials_order ON tutorials("order");
CREATE INDEX idx_tutorial_progress_user ON tutorial_progress(user_id);

-- Add RLS policies
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_progress ENABLE ROW LEVEL SECURITY;

-- Tutorials policies
CREATE POLICY "Tutorials are viewable by authenticated users"
ON tutorials FOR SELECT
TO authenticated
USING (status = 'published');

CREATE POLICY "Tutorials are editable by admins"
ON tutorials FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.is_admin = true
    )
);

-- Tutorial progress policies
CREATE POLICY "Users can view their own progress"
ON tutorial_progress FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
ON tutorial_progress FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress"
ON tutorial_progress FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for tutorial_progress
CREATE TRIGGER update_tutorial_progress_updated_at
    BEFORE UPDATE ON tutorial_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();