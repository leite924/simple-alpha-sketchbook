
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Receipt, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentStepProps {
  onComplete: (data: any) => void;
  classData: any;
  orderBump: boolean;
}

const PaymentStep = ({ onComplete, classData, orderBump }: PaymentStepProps) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });

  const paymentMethods = [
    {
      id: 'credit-card',
      name: 'Cartão de Crédito',
      icon: CreditCard,
      badge: 'Aprovação Imediata',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'pix',
      name: 'PIX',
      icon: Smartphone,
      badge: 'Aprovação Imediata',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'boleto',
      name: 'Boleto Bancário',
      icon: Receipt,
      badge: 'Aprovação em 3 dias',
      badgeColor: 'bg-orange-500'
    }
  ];

  const total = classData.price + (orderBump ? 199.90 : 0);
  
  const installmentOptions = [
    { value: '1', label: `1x de R$ ${total.toFixed(2).replace('.', ',')} sem juros` },
    { value: '2', label: `2x de R$ ${(total / 2).toFixed(2).replace('.', ',')} sem juros` },
    { value: '3', label: `3x de R$ ${(total / 3).toFixed(2).replace('.', ',')} sem juros` },
    { value: '6', label: `6x de R$ ${(total / 6).toFixed(2).replace('.', ',')} sem juros` },
    { value: '12', label: `12x de R$ ${(total / 12).toFixed(2).replace('.', ',')} sem juros` }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{2})(\d{2})/, '$1/$2');
    return formatted;
  };

  const handleFinishOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Pagamento processado com sucesso!');
    navigate('/checkout/success');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
          <span>Forma de pagamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Methods */}
        <div>
          <Label className="text-base font-medium mb-4 block">Escolha a forma de pagamento</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Icon className="w-6 h-6 text-gray-600" />
                  <div className="flex-1">
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <Badge className={`${method.badgeColor} text-white text-xs`}>
                    {method.badge}
                  </Badge>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'credit-card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Validade</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input
                id="cardName"
                placeholder="Nome conforme impresso no cartão"
                value={formData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
              />
            </div>

            <div>
              <Label>Parcelamento</Label>
              <Select value={formData.installments} onValueChange={(value) => handleInputChange('installments', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {installmentOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* PIX Instructions */}
        {paymentMethod === 'pix' && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Pagamento via PIX</span>
            </div>
            <p className="text-sm text-blue-700">
              Após finalizar o pedido, você receberá o código PIX para pagamento. 
              O curso será liberado automaticamente após a confirmação do pagamento.
            </p>
          </div>
        )}

        {/* Boleto Instructions */}
        {paymentMethod === 'boleto' && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Receipt className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">Pagamento via Boleto</span>
            </div>
            <p className="text-sm text-orange-700">
              O boleto será enviado por e-mail. O prazo para pagamento é de 3 dias úteis.
              Após o pagamento, o curso será liberado em até 2 dias úteis.
            </p>
          </div>
        )}

        {/* Finish Order Button */}
        <div className="space-y-4">
          <Button 
            onClick={handleFinishOrder}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold"
          >
            <div className="flex flex-col items-center space-y-1">
              <span>
                {isProcessing ? 'Processando...' : 'Finalizar Pedido'}
              </span>
              <div className="flex items-center space-x-1 text-sm opacity-90">
                <Shield className="w-4 h-4" />
                <span>Compra 100% Segura</span>
              </div>
            </div>
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>Seus dados estão protegidos com certificado SSL</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStep;
