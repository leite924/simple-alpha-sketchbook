
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

const Admin = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const { isAuthenticated, userRole, loading } = useAuth();
  
  console.log("🔍 Admin page render:", {
    isAuthenticated,
    userRole,
    loading,
    timestamp: new Date().toISOString(),
    url: window.location.href
  });

  // Log adicional para detectar quando fica travado no loading
  useEffect(() => {
    if (loading) {
      console.log("⏳ Admin page detectou loading=true");
      
      // Timeout para detectar se fica muito tempo carregando
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.error("🚨 Admin page travado no loading por mais de 10 segundos!");
          toast.error("Carregamento demorado detectado. Verifique o console.");
        }
      }, 10000);
      
      return () => clearTimeout(timeoutId);
    } else {
      console.log("✅ Admin page finalizou loading");
    }
  }, [loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'D' && e.ctrlKey) {
        setShowDiagnostics(prev => {
          const newValue = !prev;
          toast.info(newValue ? "Diagnóstico ativado" : "Diagnóstico desativado");
          return newValue;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    console.log("🔄 Admin page renderizando loading state");
    return (
      <MainLayout>
        <div className="container mx-auto flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Carregando painel administrativo...</p>
            <p className="text-sm text-gray-500 mt-2">
              Se demorar muito, verifique o console (F12)
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  console.log("🏁 Admin page renderizando conteúdo final");

  return (
    <MainLayout>
      <AdminAccess authenticated={isAuthenticated} isLoading={loading}>
        <div className="container mx-auto px-4 py-8">
          <AdminHeader />
          <AdminContent userRole={userRole} showDiagnostics={showDiagnostics} />
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
