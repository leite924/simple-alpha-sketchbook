
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a user has a specific role
 */
export async function checkUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role)
      .maybeSingle();
      
    if (error) {
      console.error('Error checking user role:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

/**
 * Assigns a role to a user
 */
export async function assignUserRole(userId: string, role: string): Promise<boolean> {
  try {
    // Check if the user already has this role
    const hasRole = await checkUserRole(userId, role);
    if (hasRole) return true;
    
    const { error } = await supabase
      .from('user_roles')
      .insert([{
        user_id: userId,
        role
      }]);
      
    if (error) {
      console.error('Error assigning role to user:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error assigning role to user:', error);
    return false;
  }
}
