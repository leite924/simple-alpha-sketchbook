
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import StudentHero from "@/components/student/StudentHero";
import LoginForm from "@/components/student/LoginForm";
import StudentDashboard from "@/components/student/StudentDashboard";
import { useAuth } from "@/components/auth/AuthProvider";

const StudentArea = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(loading);
  
  console.log("StudentArea state:", { isAuthenticated, loading, userEmail: user?.email });
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting logout");
      await supabase.auth.signOut();
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
          {!isAuthenticated ? (
            <LoginForm onLoginSuccess={() => {}} />
          ) : (
            <StudentDashboard onLogout={handleLogout} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default StudentArea;
