-- First, ensure the admins table exists
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert or update the admin user
INSERT INTO admins (email, password, first_name, last_name)
VALUES (
    'admin@example.com',
    'admin123',
    'Admin',
    'User'
)
ON CONFLICT (email) 
DO UPDATE SET 
    password = 'admin123',
    first_name = 'Admin',
    last_name = 'User',
    updated_at = CURRENT_TIMESTAMP;