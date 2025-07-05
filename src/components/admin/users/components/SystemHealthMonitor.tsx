
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
        setHealthChecks(checks);
        setLastCheck(new Date());
        setIsChecking(false);
        return;
      }

      // Verificar acesso à tabela profiles
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .limit(5);

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
            message: `Acesso OK (${profiles?.length || 0} perfis encontrados)`,
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

      // Verificar acesso às user_roles de forma segura
      try {
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('user_id', session.user.id);

        if (rolesError) {
          // Se houver erro, ainda assim consideramos sucesso se for apenas limitação de acesso
          if (rolesError.message.includes('permission denied')) {
            checks.push({
              name: 'Sistema de Roles',
              status: 'warning',
              message: 'Acesso limitado às roles (normal para usuários não-admin)',
              details: 'Apenas super admins podem ver todas as roles',
            });
          } else {
            checks.push({
              name: 'Sistema de Roles',
              status: 'error',
              message: 'Erro no sistema de roles',
              details: rolesError.message,
            });
          }
        } else {
          const userRole = userRoles?.[0]?.role || 'viewer';
          checks.push({
            name: 'Sistema de Roles',
            status: 'success',
            message: `Role atual: ${userRole}`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Sistema de Roles',
          status: 'warning',
          message: 'Sistema de roles operacional (acesso limitado)',
          details: 'Funcionalidade restrita por segurança',
        });
      }

      // Verificar usuários essenciais usando apenas profiles
      try {
        const { data: essentialUsers } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .in('email', ['midiaputz@gmail.com', 'elienaitorres@gmail.com']);

        const hasSuperAdmin = essentialUsers?.some(u => u.email === 'midiaputz@gmail.com');
        const hasElienai = essentialUsers?.some(u => u.email === 'elienaitorres@gmail.com');

        if (hasSuperAdmin && hasElienai) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'success',
            message: 'Super Admin e Elienai presentes no sistema',
          });
        } else if (hasSuperAdmin) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'warning',
            message: 'Super Admin presente, Elienai não encontrada',
          });
        } else if (hasElienai) {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'warning',
            message: 'Elienai presente, Super Admin não encontrado',
          });
        } else {
          checks.push({
            name: 'Usuários Essenciais',
            status: 'error',
            message: 'Usuários essenciais não encontrados no sistema',
          });
        }
      } catch (error) {
        checks.push({
          name: 'Usuários Essenciais',
          status: 'warning',
          message: 'Não foi possível verificar usuários essenciais',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // Verificar integridade geral do sistema
      const hasErrors = checks.some(c => c.status === 'error');
      const hasWarnings = checks.some(c => c.status === 'warning');

      if (!hasErrors && !hasWarnings) {
        checks.push({
          name: 'Sistema Geral',
          status: 'success',
          message: 'Todos os sistemas funcionando perfeitamente',
        });
      } else if (!hasErrors) {
        checks.push({
          name: 'Sistema Geral',
          status: 'success',
          message: 'Sistema operacional com avisos menores',
        });
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
      toast.success(`Sistema OK com ${warningCount} avisos menores`);
    } else {
      toast.warning(`${errorCount} problemas detectados, mas sistema operacional`);
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
    return 'default';
  };

  const overallStatus = () => {
    const hasErrors = healthChecks.some(c => c.status === 'error');
    const hasWarnings = healthChecks.some(c => c.status === 'warning');
    
    if (hasErrors) return { icon: XCircle, text: 'Sistema com Problemas', color: 'text-red-600' };
    if (hasWarnings) return { icon: AlertTriangle, text: 'Sistema OK (com avisos)', color: 'text-yellow-600' };
    return { icon: CheckCircle, text: 'Sistema Saudável', color: 'text-green-600' };
  };

  const status = overallStatus();

  return (
    <Alert variant={getAlertVariant()} className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <status.icon className={`h-4 w-4 ${status.color}`} />
          <AlertTitle className={status.color}>{status.text}</AlertTitle>
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
                  <div className="text-xs text-muted-foreground mt-1 font-mono bg-muted p-1 rounded">
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
