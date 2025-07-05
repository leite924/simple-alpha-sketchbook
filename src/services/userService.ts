
// Re-export all user-related services for backward compatibility
export * from './profileService';
export * from './roleService';
export * from './newsletterService';

// Export findUserByEmail function that's missing
export const findUserByEmail = async (email: string): Promise<string | null> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();
    
  return profile?.id || null;
};
