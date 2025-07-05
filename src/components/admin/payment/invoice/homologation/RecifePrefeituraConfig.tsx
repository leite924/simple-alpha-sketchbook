
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, TestTube, Shield } from 'lucide-react';

interface PrefeituraConfig {
  cnpj: string;
  inscricaoMunicipal: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
  };
  certificado: {
    arquivo: string;
    senha: string;
    validade: string;
  };
  webservice: {
    urlHomologacao: string;
    urlProducao: string;
    timeout: number;
  };
  ambiente: 'homologacao' | 'producao';
}

const RecifePrefeituraConfig = () => {
  const [config, setConfig] = useState<PrefeituraConfig>({
    cnpj: '',
    inscricaoMunicipal: '',
    razaoSocial: '',
    nomeFantasia: '',
    endereco: {
      logradouro: '',
      numero: '',
      bairro: '',
      cep: '',
      cidade: 'Recife',
      uf: 'PE'
    },
    certificado: {
      arquivo: '',
      senha: '',
      validade: ''
    },
    webservice: {
      urlHomologacao: 'https://nfse-hom.recife.pe.gov.br/nfse/services',
      urlProducao: 'https://nfse.recife.pe.gov.br/nfse/services',
      timeout: 30000
    },
    ambiente: 'homologacao'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento das configurações
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simular teste de conectividade
      toast.loading('Testando conectividade com a Prefeitura do Recife...', { id: 'test-connection' });
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Conectividade testada com sucesso!', { id: 'test-connection' });
    } catch (error) {
      toast.error('Erro na conectividade', { id: 'test-connection' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Informações da empresa prestadora de serviços
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={config.cnpj}
                onChange={(e) => setConfig(prev => ({ ...prev, cnpj: e.target.value }))}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div>
              <Label htmlFor="inscricao">Inscrição Municipal</Label>
              <Input
                id="inscricao"
                value={config.inscricaoMunicipal}
                onChange={(e) => setConfig(prev => ({ ...prev, inscricaoMunicipal: e.target.value }))}
                placeholder="123456"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="razao">Razão Social</Label>
            <Input
              id="razao"
              value={config.razaoSocial}
              onChange={(e) => setConfig(prev => ({ ...prev, razaoSocial: e.target.value }))}
              placeholder="Nome da empresa"
            />
          </div>
          
          <div>
            <Label htmlFor="fantasia">Nome Fantasia</Label>
            <Input
              id="fantasia"
              value={config.nomeFantasia}
              onChange={(e) => setConfig(prev => ({ ...prev, nomeFantasia: e.target.value }))}
              placeholder="Nome fantasia (opcional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço da Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                value={config.endereco.logradouro}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  endereco: { ...prev.endereco, logradouro: e.target.value }
                }))}
                placeholder="Rua, Avenida, etc."
              />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={config.endereco.numero}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  endereco: { ...prev.endereco, numero: e.target.value }
                }))}
                placeholder="123"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={config.endereco.bairro}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  endereco: { ...prev.endereco, bairro: e.target.value }
                }))}
                placeholder="Nome do bairro"
              />
            </div>
            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={config.endereco.cep}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  endereco: { ...prev.endereco, cep: e.target.value }
                }))}
                placeholder="00000-000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificado Digital */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Certificado Digital A1
          </CardTitle>
          <CardDescription>
            Certificado para assinatura das NFS-e
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cert-file">Arquivo do Certificado (.p12/.pfx)</Label>
            <Input
              id="cert-file"
              type="file"
              accept=".p12,.pfx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setConfig(prev => ({ 
                    ...prev, 
                    certificado: { ...prev.certificado, arquivo: file.name }
                  }));
                }
              }}
            />
          </div>
          
          <div>
            <Label htmlFor="cert-password">Senha do Certificado</Label>
            <Input
              id="cert-password"
              type="password"
              value={config.certificado.senha}
              onChange={(e) => setConfig(prev => ({ 
                ...prev, 
                certificado: { ...prev.certificado, senha: e.target.value }
              }))}
              placeholder="Digite a senha do certificado"
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Webservice */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Webservice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.ambiente === 'producao'}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, ambiente: checked ? 'producao' : 'homologacao' }))
              }
            />
            <Label>Ambiente de Produção</Label>
          </div>
          
          <div>
            <Label>URL Atual</Label>
            <Input
              value={config.ambiente === 'producao' ? config.webservice.urlProducao : config.webservice.urlHomologacao}
              readOnly
              className="bg-gray-50"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
            
            <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? 'Testando...' : 'Testar Conectividade'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecifePrefeituraConfig;
