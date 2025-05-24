
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Upload } from "lucide-react";

interface PaymentGatewaySettingsProps {
  onSave: () => void;
}

export const PaymentGatewaySettings = ({ onSave }: PaymentGatewaySettingsProps) => {
  const [invoiceSettings, setInvoiceSettings] = useState({
    autoGenerate: false,
    autoGenerateStatus: "completed",
  });

  const [logoPreview, setLogoPreview] = useState("/lovable-uploads/d580b9f4-ed3f-44c5-baa5-e0a42dfcb768.png");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Em um sistema real, aqui teríamos upload para o servidor
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
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
                checked={invoiceSettings.autoGenerate}
                onCheckedChange={(checked) => setInvoiceSettings({...invoiceSettings, autoGenerate: checked})}
              />
              <Label htmlFor="auto-generate">Gerar notas fiscais automaticamente</Label>
            </div>
            
            {invoiceSettings.autoGenerate && (
              <div>
                <Label htmlFor="invoice-status">Estado para emissão automática</Label>
                <Select 
                  value={invoiceSettings.autoGenerateStatus}
                  onValueChange={(value) => setInvoiceSettings({...invoiceSettings, autoGenerateStatus: value})}
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
              <Input id="cnpj" placeholder="XX.XXX.XXX/0001-XX" />
            </div>
            
            <div>
              <Label htmlFor="razao-social">Razão Social</Label>
              <Input id="razao-social" placeholder="Escola Pernambucana de Fotografia LTDA" />
            </div>
            
            <div>
              <Label htmlFor="codigo-servico">Código de Serviço</Label>
              <Input id="codigo-servico" placeholder="Ex: 8.02" />
            </div>
          </div>
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
        <Button onClick={onSave} className="px-6">
          <CreditCard className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};
