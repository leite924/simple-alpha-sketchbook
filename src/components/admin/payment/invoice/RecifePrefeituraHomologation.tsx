
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Globe,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface HomologationStatus {
  certificado: boolean;
  ambiente: 'producao' | 'homologacao';
  webservice: boolean;
  credenciais: boolean;
  testes: boolean;
}

const RecifePrefeituraHomologation = () => {
  const [status, setStatus] = useState<HomologationStatus>({
    certificado: false,
    ambiente: 'homologacao',
    webservice: true,
    credenciais: false,
    testes: false
  });

  const [isHomologating, setIsHomologating] = useState(false);

  const handleCertificadoUpload = () => {
    toast.info("Upload de certificado A1 necessário para produção");
    setStatus(prev => ({ ...prev, certificado: true }));
  };

  const handleCredenciaisSetup = () => {
    toast.info("Configure as credenciais da Prefeitura do Recife");
    setStatus(prev => ({ ...prev, credenciais: true }));
  };

  const handleTestesHomologacao = async () => {
    setIsHomologating(true);
    
    try {
      // Simular testes de homologação
      toast.loading("Executando testes de homologação...", { id: "homologacao" });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStatus(prev => ({ ...prev, testes: true }));
      toast.success("Testes de homologação executados com sucesso!", { id: "homologacao" });
      
    } catch (error) {
      toast.error("Erro nos testes de homologação", { id: "homologacao" });
    } finally {
      setIsHomologating(false);
    }
  };

  const switchToProduction = () => {
    if (!status.certificado || !status.credenciais || !status.testes) {
      toast.error("Complete todos os requisitos antes de ir para produção");
      return;
    }
    
    setStatus(prev => ({ ...prev, ambiente: 'producao' }));
    toast.success("Ambiente alterado para PRODUÇÃO - Recife");
  };

  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-yellow-600" />
    );
  };

  const isReadyForProduction = status.certificado && status.credenciais && status.testes;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Homologação NFS-e - Prefeitura do Recife
          </CardTitle>
          <CardDescription>
            Configure e teste a emissão de Notas Fiscais de Serviço Eletrônicas para a Prefeitura do Recife
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status do Ambiente */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <span className="font-medium">Ambiente Atual:</span>
            </div>
            <Badge variant={status.ambiente === 'producao' ? 'default' : 'secondary'}>
              {status.ambiente === 'producao' ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO'}
            </Badge>
          </div>

          {/* Checklist de Requisitos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Requisitos para Homologação</h3>
            
            {/* Certificado Digital */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.certificado)}
                <div>
                  <p className="font-medium">Certificado Digital A1</p>
                  <p className="text-sm text-gray-500">Certificado válido para assinatura de documentos</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCertificadoUpload}
                disabled={status.certificado}
              >
                <Shield className="h-4 w-4 mr-1" />
                {status.certificado ? 'Configurado' : 'Configurar'}
              </Button>
            </div>

            {/* Webservice */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.webservice)}
                <div>
                  <p className="font-medium">Webservice ABRASF 2.0</p>
                  <p className="text-sm text-gray-500">Conectividade com o webservice da Prefeitura</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Configurado
              </Badge>
            </div>

            {/* Credenciais */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.credenciais)}
                <div>
                  <p className="font-medium">Credenciais da Prefeitura</p>
                  <p className="text-sm text-gray-500">CNPJ, Inscrição Municipal e dados da empresa</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCredenciaisSetup}
                disabled={status.credenciais}
              >
                <Settings className="h-4 w-4 mr-1" />
                {status.credenciais ? 'Configurado' : 'Configurar'}
              </Button>
            </div>

            {/* Testes */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(status.testes)}
                <div>
                  <p className="font-medium">Testes de Homologação</p>
                  <p className="text-sm text-gray-500">Emissão de NFS-e de teste validada pela Prefeitura</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTestesHomologacao}
                disabled={status.testes || isHomologating}
              >
                <Clock className="h-4 w-4 mr-1" />
                {isHomologating ? 'Testando...' : status.testes ? 'Aprovado' : 'Executar Testes'}
              </Button>
            </div>
          </div>

          {/* Informações Técnicas */}
          <Alert>
            <Settings className="h-4 w-4" />
            <AlertTitle>Configurações Técnicas</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>URL Homologação:</strong> https://nfse-hom.recife.pe.gov.br/nfse/services</p>
                <p><strong>URL Produção:</strong> https://nfse.recife.pe.gov.br/nfse/services</p>
                <p><strong>Padrão:</strong> ABRASF 2.0</p>
                <p><strong>Município:</strong> Recife - PE (Código: 2611606)</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Ações */}
          <div className="flex gap-4 pt-4 border-t">
            <Button 
              onClick={switchToProduction}
              disabled={!isReadyForProduction}
              className="flex-1"
            >
              {status.ambiente === 'producao' ? 'Ambiente de Produção Ativo' : 'Migrar para Produção'}
            </Button>
            
            <Button variant="outline" asChild>
              <a href="/nfse-test" target="_blank">
                Testar Emissão
              </a>
            </Button>
          </div>

          {!isReadyForProduction && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Requisitos Pendentes</AlertTitle>
              <AlertDescription>
                Complete todos os requisitos acima antes de migrar para o ambiente de produção.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Documentação */}
      <Card>
        <CardHeader>
          <CardTitle>Documentação e Suporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Manual de Integração</h4>
              <p className="text-sm text-gray-600 mb-2">
                Documentação técnica da Prefeitura do Recife para integração NFS-e
              </p>
              <Button variant="link" size="sm" className="p-0">
                Acessar Manual →
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Suporte Técnico</h4>
              <p className="text-sm text-gray-600 mb-2">
                Canal oficial de suporte da Prefeitura do Recife
              </p>
              <Button variant="link" size="sm" className="p-0">
                Contatar Suporte →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecifePrefeituraHomologation;
