
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, CheckCircle, Key, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PagarmeSettingsProps {
  onSave: () => void;
}

export const PagarmeSettings: React.FC<PagarmeSettingsProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [encryptionKey, setEncryptionKey] = useState<string>('');
  const [isSandbox, setIsSandbox] = useState<boolean>(true);
  const [isWebhookEnabled, setIsWebhookEnabled] = useState<boolean>(true);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  
  // Em uma aplicação real, buscaríamos as configurações do Supabase
  // e inicializaríamos os estados com os valores existentes

  const handleSaveSettings = () => {
    // Aqui salvaríamos as configurações no Supabase
    console.log('Salvando configurações do Pagarme:', {
      apiKey,
      encryptionKey,
      isSandbox,
      isWebhookEnabled,
      webhookUrl
    });
    
    // Simulação de salvamento bem-sucedido
    toast.success('Configurações do Pagarme salvas com sucesso!');
    onSave();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" /> 
            Credenciais da API Pagarme
          </CardTitle>
          <CardDescription>
            Configure suas credenciais para integração com a API do Pagarme.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key" 
                type="password"
                placeholder="Insira sua API Key do Pagarme"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button variant="outline" type="button" onClick={() => setApiKey('')}>
                Limpar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encryption-key">Chave de Criptografia</Label>
            <div className="flex gap-2">
              <Input
                id="encryption-key" 
                type="password"
                placeholder="Insira sua Chave de Criptografia do Pagarme"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
              />
              <Button variant="outline" type="button" onClick={() => setEncryptionKey('')}>
                Limpar
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch 
              id="sandbox-mode"
              checked={isSandbox}
              onCheckedChange={setIsSandbox}
            />
            <Label htmlFor="sandbox-mode">
              Modo Sandbox (Testes)
            </Label>
            {isSandbox && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                <AlertTriangle className="mr-1 h-3 w-3" /> Ambiente de testes
              </span>
            )}
            {!isSandbox && (
              <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                <CheckCircle className="mr-1 h-3 w-3" /> Produção
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" /> 
            Configurações de Webhook
          </CardTitle>
          <CardDescription>
            Configure o webhook para receber notificações de pagamentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="webhook-enabled"
              checked={isWebhookEnabled}
              onCheckedChange={setIsWebhookEnabled}
            />
            <Label htmlFor="webhook-enabled">
              Habilitar Webhook
            </Label>
          </div>

          {isWebhookEnabled && (
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url" 
                type="text"
                placeholder="https://seu-site.com/api/webhooks/pagarme"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                disabled={!isWebhookEnabled}
              />
              <p className="text-sm text-muted-foreground">
                Esta é a URL que o Pagarme usará para notificar seu sistema sobre alterações no status das transações.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
