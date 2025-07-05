import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Receipt, Shield } from 'lucide-react';
import { usePaymentProcessing } from '@/hooks/payments/usePaymentProcessing';
import { toast } from 'sonner';

interface PaymentStepProps {
  onComplete: (data: any) => void;
  classData: any;
  orderBump: boolean;
  formData: any;
}

const PaymentStep = ({ onComplete, classData, orderBump, formData }: PaymentStepProps) => {
  const { processCheckout, isProcessing } = usePaymentProcessing();
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'bank_slip'>('credit_card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: '1'
  });

  const paymentMethods = [
    {
      id: 'credit_card' as const,
      name: 'Cartão de Crédito',
      icon: CreditCard,
      badge: 'Aprovação Imediata',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'pix' as const,
      name: 'PIX',
      icon: Smartphone,
      badge: 'Aprovação Imediata',
      badgeColor: 'bg-green-500'
    },
    {
      id: 'bank_slip' as const,
      name: 'Boleto Bancário',
      icon: Receipt,
      badge: 'Aprovação em 3 dias',
      badgeColor: 'bg-orange-500'
    }
  ];

  const baseTotal = classData.price + (orderBump ? 199.90 : 0);
  
  const installmentOptions = [
    { value: '1', label: `1x de R$ ${baseTotal.toFixed(2).replace('.', ',')} sem juros` },
    { value: '2', label: `2x de R$ ${(baseTotal / 2).toFixed(2).replace('.', ',')} sem juros` },
    { value: '3', label: `3x de R$ ${(baseTotal / 3).toFixed(2).replace('.', ',')} sem juros` },
    { value: '6', label: `6x de R$ ${(baseTotal / 6).toFixed(2).replace('.', ',')} sem juros` },
    { value: '12', label: `12x de R$ ${(baseTotal / 12).toFixed(2).replace('.', ',')} sem juros` }
  ];

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{2})(\d{2})/, '$1/$2');
    return formatted;
  };

  const validateForm = () => {
    if (paymentMethod === 'credit_card') {
      if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryDate || !cardData.cvv) {
        toast.error('Por favor, preencha todos os dados do cartão');
        return false;
      }
    }
    return true;
  };

  const handlePaymentMethodChange = (value: string) => {
    if (value === 'credit_card' || value === 'pix' || value === 'bank_slip') {
      setPaymentMethod(value);
    }
  };

  const handleFinishOrder = async () => {
    if (!validateForm()) return;

    try {
      // Preparar dados completos para o processamento
      const checkoutData = {
        // Dados pessoais
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        email: formData.personalInfo.email,
        cpf: formData.personalInfo.cpf,
        phone: formData.personalInfo.phone,
        birthDate: new Date().toISOString().split('T')[0], // Default - pode ser coletado no form se necessário
        
        // Endereço
        address: formData.address.address,
        addressNumber: formData.address.addressNumber,
        addressComplement: formData.address.addressComplement || '',
        neighborhood: formData.address.neighborhood,
        city: formData.address.city,
        state: formData.address.state,
        postalCode: formData.address.postalCode,
        
        // Pagamento
        paymentMethod: paymentMethod,
        cardNumber: cardData.cardNumber,
        cardHolderName: cardData.cardName,
        expiryDate: cardData.expiryDate,
        cvv: cardData.cvv,
        installments: parseInt(cardData.installments),
        
        // Turma e cupom
        classId: classData.id,
        couponCode: '', // Pode ser implementado depois
        agreeTerms: true
      };

      await processCheckout(checkoutData);
    } catch (error) {
      console.error('Erro no checkout:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    }
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
          <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange}>
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
        {paymentMethod === 'credit_card' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={cardData.cardNumber}
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
                  value={cardData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input
                id="cardName"
                placeholder="Nome conforme impresso no cartão"
                value={cardData.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
              />
            </div>

            <div>
              <Label>Parcelamento</Label>
              <Select value={cardData.installments} onValueChange={(value) => handleInputChange('installments', value)}>
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
              A matrícula será confirmada automaticamente após a aprovação do pagamento.
            </p>
          </div>
        )}

        {/* Boleto Instructions */}
        {paymentMethod === 'bank_slip' && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Receipt className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">Pagamento via Boleto</span>
            </div>
            <p className="text-sm text-orange-700">
              O boleto será enviado por e-mail. O prazo para pagamento é de 3 dias úteis.
              Após o pagamento, a matrícula será confirmada em até 2 dias úteis.
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
                {isProcessing ? 'Processando...' : 'Finalizar Matrícula'}
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
