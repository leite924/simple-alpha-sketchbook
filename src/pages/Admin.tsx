import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AdminAccess from "@/components/admin/AdminAccess";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminContent from "@/components/admin/AdminContent";
import AdminErrorDisplay from "@/components/admin/AdminErrorDisplay";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "sonner";

const Admin = () => {
  // Define diagnostics as false to hide diagnostic information
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);
  
  const {
    authenticated,
    userRole,
    isLoading,
    error
  } = useAdminAuth();

  useEffect(() => {
    console.log("Admin page rendered at", new Date().toISOString());
    console.log("Authentication state:", { authenticated, userRole, isLoading, error });
    
    try {
      // Add key event listener for diagnostics toggle (keep for developer use only)
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
      
      // Check successful mounting
      setTimeout(() => {
        const adminElement = document.querySelector("[data-admin-rendered='true']");
        console.log("Admin element found:", !!adminElement);
        
        if (!adminElement) {
          console.error("Admin page failed to render expected elements");
          setErrorInfo("Falha na renderização - elementos não encontrados");
        }
      }, 2000);
      
      setHasRendered(true);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    } catch (err) {
      console.error("Error in Admin useEffect:", err);
      setErrorInfo(`Error in Admin lifecycle: ${err instanceof Error ? err.message : String(err)}`);
      toast.error("Erro crítico na página de administração");
      return () => {};
    }
  }, [authenticated, userRole, isLoading, error]);

  // Safety catch for errors
  if (error || errorInfo) {
    return <AdminErrorDisplay error={error || errorInfo || "Erro desconhecido na página de administração"} />;
  }

  return (
    <MainLayout>
      <div data-admin-rendered="true">
        <AdminAccess authenticated={authenticated} isLoading={isLoading}>
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
