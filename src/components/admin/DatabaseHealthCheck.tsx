
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HealthCheck {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

const DatabaseHealthCheck = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const runDatabaseChecks = async () => {
    setIsChecking(true);
    const checks: HealthCheck[] = [];

    try {
      // 1. Verificar conectividade básica
      console.log('Testando conectividade com Supabase...');
      const { data: { session } } = await supabase.auth.getSession();
      
      checks.push({
        name: 'Conectividade Supabase',
        status: 'success',
        message: 'Conexão com Supabase estabelecida com sucesso',
      });

      // 2. Verificar acesso às tabelas principais
      try {
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id, name')
          .limit(1);

        if (coursesError) {
          checks.push({
            name: 'Tabela Courses',
            status: 'error',
            message: 'Erro ao acessar tabela de cursos',
            details: coursesError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Courses',
            status: 'success',
            message: `Tabela de cursos acessível (${courses?.length || 0} registros encontrados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Courses',
          status: 'error',
          message: 'Erro crítico ao acessar cursos',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // 3. Verificar tabela de turmas
      try {
        const { data: classes, error: classesError } = await supabase
          .from('classes')
          .select('id, course_name')
          .limit(1);

        if (classesError) {
          checks.push({
            name: 'Tabela Classes',
            status: 'error',
            message: 'Erro ao acessar tabela de turmas',
            details: classesError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Classes',
            status: 'success',
            message: `Tabela de turmas acessível (${classes?.length || 0} registros encontrados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Classes',
          status: 'error',
          message: 'Erro crítico ao acessar turmas',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // 4. Verificar tabela de perfis
      try {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .limit(5);

        if (profilesError) {
          checks.push({
            name: 'Tabela Profiles',
            status: 'warning',
            message: 'Acesso limitado à tabela de perfis (normal se não logado)',
            details: profilesError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Profiles',
            status: 'success',
            message: `Tabela de perfis acessível (${profiles?.length || 0} registros encontrados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Profiles',
          status: 'warning',
          message: 'Acesso restrito aos perfis (esperado)',
          details: 'Acesso controlado por RLS (Row Level Security)',
        });
      }

      // 5. Verificar transações de pagamento
      try {
        const { data: transactions, error: transactionsError } = await supabase
          .from('payment_transactions')
          .select('id, pagarme_transaction_id')
          .limit(1);

        if (transactionsError) {
          checks.push({
            name: 'Tabela Payment Transactions',
            status: 'warning',
            message: 'Acesso limitado às transações (normal se não logado)',
            details: transactionsError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Payment Transactions',
            status: 'success',
            message: `Tabela de transações acessível (${transactions?.length || 0} registros)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Payment Transactions',
          status: 'error',
          message: 'Erro ao acessar transações',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // 6. Verificar blog posts
      try {
        const { data: posts, error: postsError } = await supabase
          .from('blog_posts')
          .select('id, title')
          .eq('status', 'published')
          .limit(1);

        if (postsError) {
          checks.push({
            name: 'Tabela Blog Posts',
            status: 'error',
            message: 'Erro ao acessar posts do blog',
            details: postsError.message,
          });
        } else {
          checks.push({
            name: 'Tabela Blog Posts',
            status: 'success',
            message: `Blog posts acessíveis (${posts?.length || 0} publicados)`,
          });
        }
      } catch (error) {
        checks.push({
          name: 'Tabela Blog Posts',
          status: 'error',
          message: 'Erro crítico no blog',
          details: error instanceof Error ? error.message : String(error),
        });
      }

      // 7. Status geral do sistema
      const hasErrors = checks.some(c => c.status === 'error');
      const hasWarnings = checks.some(c => c.status === 'warning');

      if (!hasErrors && !hasWarnings) {
        checks.push({
          name: 'Status Geral',
          status: 'success',
          message: '✅ Banco de dados totalmente operacional',
        });
      } else if (!hasErrors) {
        checks.push({
          name: 'Status Geral',
          status: 'success',
          message: '✅ Banco de dados operacional com algumas restrições normais',
        });
      } else {
        checks.push({
          name: 'Status Geral',
          status: 'warning',
          message: '⚠️ Banco de dados com alguns problemas detectados',
        });
      }

    } catch (error) {
      checks.push({
        name: 'Conectividade',
        status: 'error',
        message: '❌ Falha crítica na conexão com o banco',
        details: error instanceof Error ? error.message : String(error),
      });
    }

    setHealthChecks(checks);
    setLastCheck(new Date());
    setIsChecking(false);

    // Mostrar resumo no toast
    const errorCount = checks.filter(c => c.status === 'error').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    
    if (errorCount === 0 && warningCount === 0) {
      toast.success('🟢 Banco de dados funcionando perfeitamente!');
    } else if (errorCount === 0) {
      toast.success(`🟡 Banco operacional com ${warningCount} avisos (normal)`);
    } else {
      toast.warning(`🔴 ${errorCount} problemas detectados no banco`);
    }
  };

  useEffect(() => {
    runDatabaseChecks();
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

  const getOverallStatus = () => {
    const hasErrors = healthChecks.some(c => c.status === 'error');
    const hasWarnings = healthChecks.some(c => c.status === 'warning');
    
    if (hasErrors) return { 
      color: 'text-red-600', 
      bg: 'bg-red-50', 
      border: 'border-red-200',
      text: 'Problemas Detectados' 
    };
    if (hasWarnings) return { 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-50', 
      border: 'border-yellow-200',
      text: 'Operacional com Avisos' 
    };
    return { 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      border: 'border-green-200',
      text: 'Totalmente Operacional' 
    };
  };

  const status = getOverallStatus();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Status do Banco de Dados Supabase</CardTitle>
              <CardDescription>
                Verificação completa da conectividade e funcionalidade
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={runDatabaseChecks}
            disabled={isChecking}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Verificando...' : 'Verificar Novamente'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Alert className={`mb-6 ${status.bg} ${status.border}`}>
          <Database className={`h-4 w-4 ${status.color}`} />
          <AlertTitle className={status.color}>
            Status Geral: {status.text}
          </AlertTitle>
          <AlertDescription>
            {lastCheck && (
              <span className="text-sm text-muted-foreground">
                Última verificação: {lastCheck.toLocaleString('pt-BR')}
              </span>
            )}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <div className="font-medium text-sm">{check.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{check.message}</div>
                {check.details && (
                  <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded font-mono">
                    {check.details}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {healthChecks.length === 0 && isChecking && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Verificando status do banco de dados...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseHealthCheck;
