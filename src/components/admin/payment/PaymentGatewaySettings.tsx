import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Upload, Shield, FileText, Database, TestTube } from "lucide-react";
import { useNFSeSettings } from "@/hooks/useNFSeSettings";
import { useCertificateValidation } from "@/hooks/useCertificateValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CertificateStatusDisplay } from "./certificate/CertificateStatusDisplay";

interface PaymentGatewaySettingsProps {
  onSave: () => void;
}

export const PaymentGatewaySettings = ({ onSave }: PaymentGatewaySettingsProps) => {
  const { settings, isLoading, isInitialized, saveSettings, updateSetting, updateCertificadoSetting } = useNFSeSettings();
  const { validationResult, isValidating, validateCertificate, clearValidation } = useCertificateValidation();
  const [logoPreview, setLogoPreview] = useState("/lovable-uploads/d580b9f4-ed3f-44c5-baa5-e0a42dfcb768.png");
  const [selectedCertificateFile, setSelectedCertificateFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificadoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Certificado selecionado:', file.name);
      setSelectedCertificateFile(file);
      updateCertificadoSetting('arquivo', file.name);
      clearValidation(); // Limpar validação anterior
    }
  };

  const handleCertificatePasswordChange = (password: string) => {
    updateCertificadoSetting('senha', password);
    clearValidation(); // Limpar validação quando senha muda
  };

  const handleValidateCertificate = async () => {
    if (!selectedCertificateFile) {
      return;
    }

    if (!settings.certificado.senha) {
      return;
    }

    await validateCertificate(selectedCertificateFile, settings.certificado.senha, true);
  };

  const handleSave = async () => {
    console.log('Salvando configurações no banco de dados...');
    const success = await saveSettings();
    if (success) {
      onSave();
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Database className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alerta sobre armazenamento no banco */}
      <Alert>
        <Database className="h-4 w-4" />
        <AlertDescription>
          As configurações de NFS-e agora são salvas com segurança no banco de dados e sincronizadas entre dispositivos.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integração de Pagamento */}
        <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-medium">Integração de Pagamento</h3>
          <Separator />
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="gateway">Gateway</Label>
              <Select defaultValue="mercado_pago">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mercado_pago">Mercado Pago</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="pagseguro">PagSeguro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="api_key">Chave API</Label>
              <Input id="api_key" placeholder="Insira sua chave API" type="password" />
            </div>
            
            <div>
              <Label htmlFor="secret_key">Chave Secreta</Label>
              <Input id="secret_key" placeholder="Insira sua chave secreta" type="password" />
            </div>
            
            <div>
              <Label>Ambiente</Label>
              <Tabs defaultValue="testing">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="testing">Testes</TabsTrigger>
                  <TabsTrigger value="production">Produção</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Notas Fiscais */}
        <div className="bg-white rounded-lg border p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-medium">Notas Fiscais de Serviço</h3>
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-generate" 
                checked={settings.autoGenerate}
                onCheckedChange={(checked) => {
                  console.log('Toggle alterado para:', checked);
                  updateSetting('autoGenerate', checked);
                }}
              />
              <Label htmlFor="auto-generate">Gerar notas fiscais automaticamente</Label>
            </div>
            
            {settings.autoGenerate && (
              <div>
                <Label htmlFor="invoice-status">Estado para emissão automática</Label>
                <Select 
                  value={settings.autoGenerateStatus}
                  onValueChange={(value: 'completed' | 'all') => {
                    console.log('Status alterado para:', value);
                    updateSetting('autoGenerateStatus', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Quando transação for completada</SelectItem>
                    <SelectItem value="all">Para todas as transações</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input 
                id="cnpj" 
                placeholder="XX.XXX.XXX/0001-XX" 
                value={settings.cnpj}
                onChange={(e) => {
                  console.log('CNPJ alterado para:', e.target.value);
                  updateSetting('cnpj', e.target.value);
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="razao-social">Razão Social</Label>
              <Input 
                id="razao-social" 
                placeholder="Escola Pernambucana de Fotografia LTDA" 
                value={settings.razaoSocial}
                onChange={(e) => {
                  console.log('Razão Social alterada para:', e.target.value);
                  updateSetting('razaoSocial', e.target.value);
                }}
              />
            </div>

            <div>
              <Label htmlFor="inscricao-municipal">Inscrição Municipal</Label>
              <Input 
                id="inscricao-municipal" 
                placeholder="123456" 
                value={settings.inscricaoMunicipal}
                onChange={(e) => {
                  console.log('Inscrição Municipal alterada para:', e.target.value);
                  updateSetting('inscricaoMunicipal', e.target.value);
                }}
              />
            </div>
            
            <div>
              <Label htmlFor="codigo-servico">Código de Serviço</Label>
              <Input 
                id="codigo-servico" 
                placeholder="Ex: 8.02" 
                value={settings.codigoServico}
                onChange={(e) => {
                  console.log('Código de Serviço alterado para:', e.target.value);
                  updateSetting('codigoServico', e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificado Digital */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Certificado Digital A1
        </h3>
        <Separator className="mb-4" />
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cert-file">Arquivo do Certificado (.p12/.pfx)</Label>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <Input
                  value={settings.certificado.arquivo}
                  placeholder="Nenhum arquivo selecionado"
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <Label 
                htmlFor="cert-upload" 
                className="cursor-pointer flex gap-2 items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                <FileText className="h-4 w-4" />
                Selecionar
              </Label>
              <Input 
                id="cert-upload" 
                type="file" 
                accept=".p12,.pfx"
                className="hidden" 
                onChange={handleCertificadoUpload}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="cert-password">Senha do Certificado</Label>
            <Input
              id="cert-password"
              type="password"
              value={settings.certificado.senha}
              onChange={(e) => {
                console.log('Senha do certificado alterada');
                handleCertificatePasswordChange(e.target.value);
              }}
              placeholder="Digite a senha do certificado"
            />
          </div>
          
          <div>
            <Label htmlFor="cert-validity">Validade do Certificado</Label>
            <Input
              id="cert-validity"
              type="date"
              value={settings.certificado.validade}
              onChange={(e) => {
                console.log('Validade do certificado alterada para:', e.target.value);
                updateCertificadoSetting('validade', e.target.value);
              }}
            />
          </div>

          {/* Botão de Validação */}
          {selectedCertificateFile && settings.certificado.senha && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleValidateCertificate}
                disabled={isValidating}
                className="w-full"
                variant="outline"
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isValidating ? 'Validando...' : 'Validar Certificado Automaticamente'}
              </Button>
            </div>
          )}

          {/* Display do Status do Certificado */}
          <CertificateStatusDisplay 
            validationResult={validationResult}
            isValidating={isValidating}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-medium mb-4">Logo da Empresa</h3>
        <Separator className="mb-4" />
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="bg-gray-50 p-4 border rounded-lg flex items-center justify-center w-full md:w-64 h-40">
            <img 
              src={logoPreview} 
              alt="Logo da empresa" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          <div className="space-y-4 flex-1">
            <Label htmlFor="logo" className="block mb-2">Alterar logo</Label>
            <div className="flex gap-2">
              <Label 
                htmlFor="logo-upload" 
                className="cursor-pointer flex gap-2 items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Carregar logo</span>
              </Label>
              <Input 
                id="logo-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleLogoUpload}
              />
            </div>
            <p className="text-sm text-gray-500">
              Formatos aceitos: JPG, PNG ou SVG. Tamanho máximo: 1MB.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-6" disabled={isLoading}>
          <CreditCard className="mr-2 h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>
    </div>
  );
};
