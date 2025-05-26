
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminErrorDisplay from "@/components/admin/AdminErrorDisplay";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const Admin = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  
  const {
    authenticated,
    userRole,
    isLoading,
    error
  } = useAdminAuth();

  console.log("🔍 Admin page state:", { authenticated, userRole, isLoading, error });

  useEffect(() => {
    console.log("📄 Admin page rendered at", new Date().toISOString());
    console.log("🔐 Authentication state:", { authenticated, userRole, isLoading, error });
    
    // Add key event listener for diagnostics toggle
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
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [authenticated, userRole, isLoading, error]);

  // Safety catch for errors
  if (error || errorInfo) {
    return <AdminErrorDisplay error={error || errorInfo || "Erro desconhecido na página de administração"} />;
  }

  // Show loading state only if still loading
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Carregando painel administrativo...</p>
            <p className="text-sm text-gray-500 mt-2">
              Verificando autenticação e permissões...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div data-admin-rendered="true">
        <AdminAccess authenticated={authenticated} isLoading={false}>
          <div className="container mx-auto px-4 py-8">
            <AdminHeader />
            <AdminContent userRole={userRole} showDiagnostics={showDiagnostics} />
          </div>
        </AdminAccess>
      </div>
    </MainLayout>
  );
};

export default Admin;
