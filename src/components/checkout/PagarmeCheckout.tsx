
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, CreditCard, QrCode, FileText } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePagarmeIntegration } from '@/components/admin/payment/hooks/usePagarmeIntegration';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  cardholderName: z.string().min(3, { message: 'Nome do titular é obrigatório' }),
  cardNumber: z.string().min(16, { message: 'Número do cartão inválido' }).max(19),
  expirationMonth: z.string().min(1, { message: 'Mês inválido' }).max(2),
  expirationYear: z.string().min(2, { message: 'Ano inválido' }).max(4),
  cvv: z.string().min(3, { message: 'CVV inválido' }).max(4),
  installments: z.string(),
  documentNumber: z.string().min(11, { message: 'CPF/CNPJ inválido' }).optional(),
});

interface PagarmeCheckoutProps {
  amount: number;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  onSuccess: (transactionId: string) => void;
  onError: (error: any) => void;
}

const PagarmeCheckout: React.FC<PagarmeCheckoutProps> = ({ 
  amount, 
  items, 
  onSuccess, 
  onError 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
  const [userId, setUserId] = useState<string | null>(null);
  const { 
    isProcessing, 
    transactionResult, 
    paymentLink, 
    handleCardPayment,
    handleGeneratePaymentLink
  } = usePagarmeIntegration();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      cvv: '',
      installments: '1',
      documentNumber: '',
    },
  });

  // Verificar se o usuário está logado ao carregar o componente
  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    
    checkUser();
  }, []);

  // Processar pagamento com cartão
  const onSubmitCard = async (values: z.infer<typeof formSchema>) => {
    try {
      // Preparar dados para o Pagarme
      const cardData = {
        holderName: values.cardholderName,
        number: values.cardNumber.replace(/\s/g, ''),
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        cvv: values.cvv,
        brand: detectCardBrand(values.cardNumber),
        installments: parseInt(values.installments),
      };
      
      // Dados do cliente
      const customer = {
        name: values.cardholderName,
        email: '',  // Em uma implementação real, viria do perfil do usuário
        document: values.documentNumber,
        userId: userId,
      };
      
      // Processar pagamento
      const transaction = await handleCardPayment(cardData, customer, amount, items);
      onSuccess(transaction.id);
    } catch (error) {
      onError(error);
    }
  };

  // Processar pagamento com Pix ou Boleto
  const handleAlternativePayment = async (method: 'pix' | 'boleto') => {
    try {
      // Dados do cliente
      const customer = {
        name: '', // Em uma implementação real, viria do perfil do usuário
        email: '',
        document: '',
        userId: userId,
      };
      
      // Gerar link de pagamento
      const result = await handleGeneratePaymentLink(customer, amount, method, items);
      onSuccess(result.transactionId);
    } catch (error) {
      onError(error);
    }
  };
  
  // Detecta a bandeira do cartão pelo número
  const detectCardBrand = (cardNumber: string): string => {
    // Implementação simplificada
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'visa';
    if (firstDigit === '5') return 'mastercard';
    if (firstDigit === '3') return 'amex';
    return 'unknown';
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Finalizar Pagamento</CardTitle>
        <CardDescription>
          Escolha a forma de pagamento e preencha os dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={paymentMethod} 
          onValueChange={(v) => setPaymentMethod(v as 'credit_card' | 'pix' | 'boleto')} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="credit_card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Cartão
            </TabsTrigger>
            <TabsTrigger value="pix" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" /> Pix
            </TabsTrigger>
            <TabsTrigger value="boleto" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Boleto
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credit_card">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitCard)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome no Cartão</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Cartão</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0000 0000 0000 0000" 
                          {...field} 
                          onChange={(e) => {
                            // Formatar número do cartão (ex: 4111 1111 1111 1111)
                            const value = e.target.value
                              .replace(/\s/g, '')
                              .replace(/\D/g, '')
                              .replace(/(\d{4})(?=\d)/g, '$1 ')
                              .trim();
                            field.onChange(value);
                          }}
                          maxLength={19}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="expirationMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mês</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="MM" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 2);
                              field.onChange(value);
                            }}
                            maxLength={2}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="expirationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="AA" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                              field.onChange(value);
                            }}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123" 
                            {...field} 
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').substring(0, 4);
                              field.onChange(value);
                            }}
                            maxLength={4}
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="installments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parcelas</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o número de parcelas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1x de R$ {amount.toFixed(2)} (à vista)</SelectItem>
                          <SelectItem value="2">2x de R$ {(amount / 2).toFixed(2)}</SelectItem>
                          <SelectItem value="3">3x de R$ {(amount / 3).toFixed(2)}</SelectItem>
                          <SelectItem value="6">6x de R$ {(amount / 6).toFixed(2)}</SelectItem>
                          <SelectItem value="12">12x de R$ {(amount / 12).toFixed(2)}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="documentNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000.000.000-00" 
                          {...field} 
                          onChange={(e) => {
                            // Formato simplificado (apenas números)
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processando...
                    </>
                  ) : (
                    <>Pagar R$ {amount.toFixed(2)}</>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="pix">
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="mb-2">Pagamento instantâneo via Pix</p>
                {paymentLink ? (
                  <div className="space-y-3">
                    <div className="mx-auto w-48 h-48 bg-gray-200 flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                    <p className="text-sm">Escaneie o código QR com seu aplicativo de banco</p>
                    <p className="text-xs bg-gray-200 p-2 rounded break-all">{paymentLink}</p>
                  </div>
                ) : (
                  <p>Clique no botão abaixo para gerar o QR Code do Pix</p>
                )}
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAlternativePayment('pix')}
                disabled={isProcessing || !!paymentLink}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Gerando Pix...
                  </>
                ) : paymentLink ? (
                  "Código Pix Gerado"
                ) : (
                  <>Gerar código Pix</>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="boleto">
            <div className="text-center space-y-4">
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="mb-2">Boleto Bancário</p>
                <p className="text-sm text-gray-600 mb-4">
                  Após gerar o boleto, você receberá as instruções para pagamento.
                  O pedido será processado após a confirmação do pagamento.
                </p>
                <div className="flex items-center justify-center">
                  <FileText className="h-24 w-24 text-gray-400" />
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleAlternativePayment('boleto')}
                disabled={isProcessing || !!paymentLink}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Gerando Boleto...
                  </>
                ) : paymentLink ? (
                  "Boleto Gerado"
                ) : (
                  <>Gerar Boleto</>
                )}
              </Button>
              
              {paymentLink && (
                <div className="mt-4">
                  <a 
                    href={paymentLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:underline"
                  >
                    Abrir Boleto ↗
                  </a>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <p>Total: R$ {amount.toFixed(2)}</p>
        <p>Pagamento Seguro</p>
      </CardFooter>
    </Card>
  );
};

export default PagarmeCheckout;
