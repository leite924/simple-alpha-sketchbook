
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import StudentHero from "@/components/student/StudentHero";
import LoginForm from "@/components/student/LoginForm";
import StudentDashboard from "@/components/student/StudentDashboard";

const StudentArea = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Student area - checking authentication");
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Authentication check result:", { hasSession: !!session });
        
        if (session?.user) {
          console.log("User is authenticated:", session.user.email);
          setUser(session.user);
          setIsLoggedIn(true);
        } else {
          console.log("No active session found");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Erro ao verificar autenticação");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setIsLoggedIn(!!session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting logout");
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logout realizado com sucesso!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(`Erro ao fazer logout: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p>Carregando área do estudante...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <StudentHero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {!isLoggedIn ? (
            <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
          ) : (
            <StudentDashboard onLogout={handleLogout} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default StudentArea;
