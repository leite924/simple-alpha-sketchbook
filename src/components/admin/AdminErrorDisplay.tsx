
import React from "react";
import DiagnosticDisplay from "@/components/admin/diagnostics";
import MainLayout from "@/components/layout/MainLayout";
import { AlertCircle } from "lucide-react";

interface AdminErrorDisplayProps {
  error: string;
}

const AdminErrorDisplay: React.FC<AdminErrorDisplayProps> = ({ error }) => {
  console.error("AdminErrorDisplay renderizando com erro:", error);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Erro no Painel de Administração</h1>
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 mr-2 text-red-500" />
            <span className="font-bold">{error}</span>
          </div>
          <div className="mt-4">
            <p className="font-medium">Informações adicionais:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>URL: {window.location.href}</li>
              <li>Última atualização: {new Date().toLocaleString()}</li>
            </ul>
          </div>
          <button 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium" 
            onClick={() => window.location.reload()}
          >
            Recarregar página
          </button>
        </div>
        <DiagnosticDisplay />
      </div>
    </MainLayout>
  );
};

export default AdminErrorDisplay;
