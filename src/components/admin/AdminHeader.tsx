
import { useAuth } from "@/components/auth/AuthProvider";
import SuperAdminBadge from "./SuperAdminBadge";

const AdminHeader = () => {
  const { user, userRole, isSuperAdmin } = useAuth();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os aspectos do sistema
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isSuperAdmin && <SuperAdminBadge />}
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Logado como:</p>
            <p className="font-medium text-gray-900">{user?.email}</p>
            <p className="text-xs text-purple-600 font-semibold uppercase">
              {isSuperAdmin ? 'Super Administrador' : userRole || 'Usuário'}
            </p>
          </div>
        </div>
      </div>
      
      {isSuperAdmin && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2">
            <SuperAdminBadge />
            <div>
              <p className="text-sm font-medium text-purple-900">
                Modo Super Administrador Ativo
              </p>
              <p className="text-xs text-purple-700">
                Você tem acesso total a todas as funcionalidades do sistema
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
