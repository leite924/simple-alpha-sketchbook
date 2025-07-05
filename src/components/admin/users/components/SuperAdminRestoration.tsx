
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { useUserRestoration } from '../hooks/useUserRestoration';

const SuperAdminRestoration = () => {
  const [isRestoring, setIsRestoring] = useState(false);
  const { restoreSuperAdmin } = useUserRestoration();

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreSuperAdmin();
      // Recarregar a página após 2 segundos para atualizar o estado
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Card className="mb-6 border-purple-200 bg-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Shield className="h-5 w-5" />
          Restauração de Super Admin
        </CardTitle>
        <CardDescription className="text-purple-700">
          Ferramenta de emergência para restaurar acesso de super administrador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>⚠️ Problema Detectado</AlertTitle>
          <AlertDescription>
            Foram detectados problemas com contas duplicadas que podem ter causado perda de acesso de super admin.
            <br />
            <strong>Esta ferramenta irá:</strong>
            <br />• Remover contas duplicadas
            <br />• Restaurar o role de super_admin correto
            <br />• Limpar dados inconsistentes
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleRestore}
          disabled={isRestoring}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          {isRestoring ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Restaurando Super Admin...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Restaurar Meu Acesso de Super Admin
            </>
          )}
        </Button>

        <div className="text-xs text-purple-600 space-y-1">
          <p><strong>⚡ Ação de Emergência:</strong> Use apenas quando perder acesso de super admin</p>
          <p><strong>🔄 Efeitos:</strong> A página será recarregada automaticamente após a correção</p>
          <p><strong>🛡️ Segurança:</strong> Apenas o email midiaputz@gmail.com pode executar esta ação</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SuperAdminRestoration;
