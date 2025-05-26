
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
  
  console.log("🔍 Admin page state:", { isAuthenticated, userRole, loading });

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
    return (
      <MainLayout>
        <div className="container mx-auto flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Carregando painel administrativo...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AdminAccess authenticated={isAuthenticated} isLoading={false}>
        <div className="container mx-auto px-4 py-8">
          <AdminHeader />
          <AdminContent userRole={userRole} showDiagnostics={showDiagnostics} />
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Admin;
