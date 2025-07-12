
import DatabaseHealthCheck from "@/components/admin/DatabaseHealthCheck";

const DatabaseStatus = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Status do Banco de Dados
          </h1>
          <p className="text-gray-600">
            Verificação em tempo real da conectividade e funcionalidade do Supabase
          </p>
        </div>
        
        <DatabaseHealthCheck />
      </div>
    </div>
  );
};

export default DatabaseStatus;
