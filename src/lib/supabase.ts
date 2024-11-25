import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  industry?: string;
  is_approved: boolean;
  approved_at?: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
  admin_id: string;
};

export type Admin = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
};

// Initialize tables
export async function initializeTables() {
  // Create admin table
  await supabase.rpc('create_admin_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS admins (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `
  });

  // Create users table
  await supabase.rpc('create_users_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        company_name TEXT,
        industry TEXT,
        is_approved BOOLEAN DEFAULT FALSE,
        approved_at TIMESTAMP WITH TIME ZONE,
        onboarding_complete BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        admin_id UUID REFERENCES admins(id)
      );
    `
  });

  // Insert default admin if not exists
  await supabase.from('admins').upsert({
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User'
  }, {
    onConflict: 'email'
  });
}