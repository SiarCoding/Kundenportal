import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
  try {
    // First, check if user exists and get their data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (userError || !user) {
      throw new Error('Ungültige Anmeldedaten.');
    }

    // Update last login timestamp and ensure onboarding_complete is properly set
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        onboarding_complete: user.onboarding_complete ?? false
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user data:', updateError);
    }

    // For admin users, allow immediate access
    if (user.is_admin) {
      return { user: { ...user, onboarding_complete: true }, isAdmin: true };
    }

    // For regular users, check approval status
    if (!user.is_approved) {
      throw new Error('Ihr Account wurde noch nicht freigegeben.');
    }

    // Ensure onboarding_complete is properly set in the returned user object
    return { 
      user: { 
        ...user, 
        onboarding_complete: user.onboarding_complete ?? false 
      }, 
      isAdmin: false 
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Ein Benutzer mit dieser E-Mail existiert bereits.');
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('is_admin', true)
      .single();

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          is_admin: false,
          is_approved: false,
          onboarding_complete: false,
          admin_id: adminUser?.id
        }
      ])
      .select()
      .single();

    if (createError) throw createError;
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getPendingUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, created_at')
      .eq('is_approved', false)
      .eq('is_admin', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw error;
  }
}

export async function approveUser(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        is_approved: true,
        approved_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}

export async function rejectUser(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error rejecting user:', error);
    throw error;
  }
}