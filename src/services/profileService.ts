
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

/**
 * Finds a user by their email address
 */
export async function findUserByEmail(email: string): Promise<string | undefined> {
  try {
    // Use explicit typing for the query response to avoid deep type instantiation
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single() as { data: { id: string } | null, error: any };
    
    if (error) {
      console.error('Error finding user by email:', error);
      return undefined;
    }
    
    return data?.id;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return undefined;
  }
}

/**
 * Creates a new user profile or returns existing user ID if found
 */
export async function createUser(
  email: string,
  firstName: string,
  lastName: string,
  profileData: {
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
): Promise<string | undefined> {
  try {
    // First check if user already exists
    const existingUserId = await findUserByEmail(email);
    if (existingUserId) return existingUserId;
    
    // Generate a UUID for the new profile
    const profileId = crypto.randomUUID();
    
    // Define the profile data with explicit typing
    const profileInsertData: ProfileInsert = {
      id: profileId,
      first_name: firstName,
      last_name: lastName,
      cpf: profileData.cpf,
      birth_date: profileData.birthDate,
      phone: profileData.phone,
      address: profileData.address,
      address_number: profileData.addressNumber,
      address_complement: profileData.addressComplement,
      neighborhood: profileData.neighborhood,
      city: profileData.city,
      state: profileData.state,
      postal_code: profileData.postalCode
    };
    
    const { error } = await supabase
      .from('profiles')
      .insert([profileInsertData]);
    
    if (error) {
      console.error('Error creating user profile:', error);
      return undefined;
    }
    
    return profileId;
  } catch (error) {
    console.error('Error creating user:', error);
    return undefined;
  }
}

/**
 * Retrieves a user profile by ID
 */
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single<Profile>();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Updates a user profile
 */
export async function updateUserProfile(
  userId: string,
  profileData: {
    firstName?: string;
    lastName?: string;
    cpf?: string;
    birthDate?: string;
    phone?: string;
    address?: string;
    addressNumber?: string;
    addressComplement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  }
) {
  try {
    // Define update data with explicit typing to avoid complex type inference
    const updateData: ProfileUpdate = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      cpf: profileData.cpf,
      birth_date: profileData.birthDate,
      phone: profileData.phone,
      address: profileData.address,
      address_number: profileData.addressNumber,
      address_complement: profileData.addressComplement,
      neighborhood: profileData.neighborhood,
      city: profileData.city,
      state: profileData.state,
      postal_code: profileData.postalCode,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}
