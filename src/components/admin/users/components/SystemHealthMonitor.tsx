
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const SystemHealthMonitor = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runHealthChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [];

    try {
      // Verificar autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        checks.push({
          name: 'Autenticação',
          status: 'success',
          message: `Usuário logado: ${session.user.email}`,
        });
      } else {
        checks.push({
          name: 'Autenticação',
          status: 'error',
          message: 'Usuário não autenticado',
        });
      }

      // Verificar acesso à tabela profiles
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .limit(1);

        if (profilesError) {
          checks.push({
            name: 'Tabela Profiles',
            status: 'error',
            message: 'Erro ao acessar profiles',
            details: profilesError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Profiles',
            status: 'success',
            message: `Acesso OK (${profiles?.length || 0} registros testados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Profiles',
          status: 'error',
          message: 'Erro crítico ao acessar profiles',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // Verificar acesso à tabela user_roles
      try {
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .limit(1);

        if (rolesError) {
          checks.push({
            name: 'Tabela User Roles',
            status: 'warning',
            message: 'Problema ao acessar user_roles',
            details: rolesError.message,
          });
        } else {
          checks.push({
            name: 'Tabela User Roles',
            status: 'success',
            message: `Acesso OK (${roles?.length || 0} registros testados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela User Roles',
          status: 'error',
          message: 'Erro crítico ao acessar user_roles',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // Verificar usuários especiais
      if (session?.user) {
        const { data: superAdmin } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', 'midiaputz@gmail.com')
          .maybeSingle();

        const { data: elienai } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', 'elienaitorres@gmail.com')
          .maybeSingle();

        if (superAdmin && elienai) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'success',
            message: 'Super Admin e Elienai encontrados',
          });
        } else if (superAdmin) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'warning',
            message: 'Super Admin OK, Elienai não encontrada',
          });
        } else if (elienai) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'warning',
            message: 'Elienai OK, Super Admin não encontrado',
          });
        } else {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'error',
            message: 'Usuários essenciais não encontrados',
          });
        }
      }

    } catch (error) {
      checks.push({
        name: 'Sistema Geral',
        status: 'error',
        message: 'Erro crítico no sistema',
        details: error instanceof Error ? error.message : String(error),
      });
    }

    setHealthChecks(checks);
    setLastCheck(new Date());
    setIsChecking(false);

    // Mostrar resumo
    const errorCount = checks.filter(c => c.status === 'error').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    
    if (errorCount === 0 && warningCount === 0) {
      toast.success('Sistema funcionando perfeitamente!');
    } else if (errorCount === 0) {
      toast.warning(`Sistema OK com ${warningCount} avisos`);
    } else {
      toast.error(`${errorCount} erros críticos detectados`);
    }
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getAlertVariant = () => {
    if (healthChecks.some(c => c.status === 'error')) return 'destructive';
    if (healthChecks.some(c => c.status === 'warning')) return 'default';
    return 'default';
  };

  return (
    <Alert variant={getAlertVariant()} className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Monitor de Saúde do Sistema</AlertTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={runHealthChecks}
          disabled={isChecking}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          Verificar
        </Button>
      </div>
      <AlertDescription className="mt-3">
        <div className="space-y-2">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-start gap-2">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <div className="font-medium">{check.name}</div>
                <div className="text-sm text-muted-foreground">{check.message}</div>
                {check.details && (
                  <div className="text-xs text-muted-foreground mt-1 font-mono">
                    {check.details}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {lastCheck && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              Última verificação: {lastCheck.toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SystemHealthMonitor;
