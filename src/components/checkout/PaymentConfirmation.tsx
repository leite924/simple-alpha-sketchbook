import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, Clock, Copy, Download, QrCode, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { PaymentResponse } from '@/types/payment';
import { supabase } from '@/integrations/supabase/client';

interface PaymentConfirmationProps {
  paymentData: PaymentResponse;
  onBack: () => void;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({
  paymentData,
  onBack
}) => {
  const [orderStatus, setOrderStatus] = useState(paymentData.status);
  const [checking, setChecking] = useState(false);

  // Polling para verificar status do pagamento (PIX principalmente)
  useEffect(() => {
    if (paymentData.paymentMethod === 'PIX' && orderStatus === 'pending') {
      const interval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select('status')
            .eq('id', paymentData.orderId)
            .single();

          if (!error && data && data.status !== orderStatus) {
            setOrderStatus(data.status);
            
            if (data.status === 'paid') {
              toast.success('Pagamento confirmado!');
              clearInterval(interval);
            }
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 5000); // Verifica a cada 5 segundos

      return () => clearInterval(interval);
    }
  }, [paymentData.orderId, paymentData.paymentMethod, orderStatus]);

  const handleCopyPix = () => {
    if (paymentData.pixCopyAndPaste) {
      navigator.clipboard.writeText(paymentData.pixCopyAndPaste);
      toast.success('Código PIX copiado!');
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('id', paymentData.orderId)
        .single();

      if (!error && data) {
        setOrderStatus(data.status);
        
        if (data.status === 'paid') {
          toast.success('Pagamento confirmado!');
        } else if (data.status === 'pending') {
          toast.info('Pagamento ainda não foi processado');
        }
      }
    } catch (error) {
      toast.error('Erro ao verificar status');
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'Pagamento Confirmado';
      case 'pending':
        return 'Aguardando Pagamento';
      case 'overdue':
        return 'Vencido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Status Desconhecido';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'overdue':
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'PIX': return <QrCode className="h-5 w-5" />;
      case 'CREDIT_CARD': return <CreditCard className="h-5 w-5" />;
      case 'BOLETO': return <FileText className="h-5 w-5" />;
      default: return null;
    }
  };

  const formatExpirationDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Status do Pagamento */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {getStatusIcon(orderStatus)}
          </div>
          <CardTitle className="text-2xl">
            {getStatusText(orderStatus)}
          </CardTitle>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-muted-foreground">Pedido:</span>
            <Badge variant="outline">{paymentData.orderId}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Detalhes do Pagamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPaymentMethodIcon(paymentData.paymentMethod)}
            Detalhes do Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Método:</span>
            <span className="font-medium">
              {paymentData.paymentMethod === 'PIX' && 'PIX'}
              {paymentData.paymentMethod === 'CREDIT_CARD' && 'Cartão de Crédito'}
              {paymentData.paymentMethod === 'BOLETO' && 'Boleto Bancário'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Valor:</span>
            <span className="font-bold text-lg">R$ {paymentData.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant={getStatusVariant(orderStatus)}>
              {getStatusText(orderStatus)}
            </Badge>
          </div>

          <Separator />

          {/* PIX */}
          {paymentData.paymentMethod === 'PIX' && (
            <div className="space-y-4">
              <h3 className="font-medium">Dados do PIX</h3>
              
              {paymentData.pixQrCode && (
                <div className="text-center">
                  <img 
                    src={`data:image/png;base64,${paymentData.pixQrCode}`} 
                    alt="QR Code PIX" 
                    className="mx-auto border rounded-lg"
                    style={{ maxWidth: '200px' }}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Escaneie o QR Code ou copie o código abaixo
                  </p>
                </div>
              )}

              {paymentData.pixCopyAndPaste && (
                <div className="space-y-2">
                  <Label>Código PIX Copia e Cola:</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={paymentData.pixCopyAndPaste} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button onClick={handleCopyPix} size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {paymentData.expirationDate && (
                <div className="text-sm text-muted-foreground">
                  <strong>Expira em:</strong> {formatExpirationDate(paymentData.expirationDate)}
                </div>
              )}

              {orderStatus === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    Aguardando confirmação do pagamento. O status será atualizado automaticamente após a confirmação.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cartão de Crédito */}
          {paymentData.paymentMethod === 'CREDIT_CARD' && (
            <div className="space-y-2">
              <h3 className="font-medium">Dados do Cartão</h3>
              {paymentData.creditCardBrand && (
                <div className="flex justify-between">
                  <span>Bandeira:</span>
                  <span>{paymentData.creditCardBrand}</span>
                </div>
              )}
              {paymentData.creditCardNumber && (
                <div className="flex justify-between">
                  <span>Final:</span>
                  <span>**** {paymentData.creditCardNumber}</span>
                </div>
              )}
              
              {orderStatus === 'paid' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Pagamento aprovado com sucesso!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Boleto */}
          {paymentData.paymentMethod === 'BOLETO' && (
            <div className="space-y-4">
              <h3 className="font-medium">Dados do Boleto</h3>
              
              {paymentData.boletoUrl && (
                <Button onClick={() => window.open(paymentData.boletoUrl, '_blank')} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Boleto
                </Button>
              )}

              {paymentData.barCode && (
                <div className="space-y-2">
                  <Label>Código de Barras:</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={paymentData.barCode} 
                      readOnly 
                      className="font-mono text-xs"
                    />
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(paymentData.barCode!);
                        toast.success('Código copiado!');
                      }} 
                      size="sm"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {paymentData.dueDate && (
                <div className="text-sm text-muted-foreground">
                  <strong>Vencimento:</strong> {new Date(paymentData.dueDate).toLocaleDateString('pt-BR')}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Após o pagamento, o status será atualizado automaticamente em até 2 dias úteis.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Novo Pedido
        </Button>
        
        {orderStatus === 'pending' && (
          <Button onClick={handleCheckStatus} disabled={checking} className="flex-1">
            {checking ? 'Verificando...' : 'Verificar Status'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;