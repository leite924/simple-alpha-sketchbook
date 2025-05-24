
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBlogAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      setIsAuthenticated(!!session?.user);
      setUserId(currentUserId || null);
      
      if (currentUserId) {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUserId)
          .single();
          
        if (!profileError && profileData) {
          setUserProfile(profileData);
        } else {
          console.log("Perfil não encontrado ou erro:", profileError);
        }
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUserId = session?.user?.id;
      setIsAuthenticated(!!session?.user);
      setUserId(currentUserId || null);
      
      if (currentUserId) {
        // Fetch user profile data on auth state change
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUserId)
          .single();
          
        if (!profileError && profileData) {
          setUserProfile(profileData);
        }
      } else {
        setUserProfile(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isAuthenticated,
    userProfile,
    userId
  };
};
