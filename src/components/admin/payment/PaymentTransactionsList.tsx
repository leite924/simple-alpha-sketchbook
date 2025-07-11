
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  CreditCard, 
  Smartphone, 
  Receipt, 
  RefreshCw,
  ExternalLink,
  Copy,
  QrCode
} from 'lucide-react';
import { usePaymentTransactions, PaymentTransaction } from '@/hooks/payments/usePaymentTransactions';
import { toast } from 'sonner';

interface PaymentTransactionsListProps {
  userId?: string;
}

export const PaymentTransactionsList: React.FC<PaymentTransactionsListProps> = ({ userId }) => {
  const { 
    transactions, 
    isLoading, 
    manualCheckStatus, 
    isCheckingStatus 
  } = usePaymentTransactions(userId);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      paid: { variant: 'default' as const, color: 'bg-green-500', text: 'Pago' },
      pending: { variant: 'secondary' as const, color: 'bg-yellow-500', text: 'Pendente' },
      refused: { variant: 'destructive' as const, color: 'bg-red-500', text: 'Recusado' },
      processing: { variant: 'outline' as const, color: 'bg-blue-500', text: 'Processando' },
      canceled: { variant: 'outline' as const, color: 'bg-gray-500', text: 'Cancelado' },
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    );
  };

  const getMethodIcon = (method: string) => {
    const icons = {
      credit_card: <CreditCard className="h-4 w-4" />,
      pix: <Smartphone className="h-4 w-4" />,
      boleto: <Receipt className="h-4 w-4" />,
    };
    return icons[method as keyof typeof icons] || <CreditCard className="h-4 w-4" />;
  };

  const getMethodText = (method: string) => {
    const methods = {
      credit_card: 'Cartão de Crédito',
      pix: 'PIX',
      boleto: 'Boleto Bancário',
    };
    return methods[method as keyof typeof methods] || method;
  };

  const copyPixCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código PIX copiado!');
  };

  const openBoleto = (url: string) => {
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction: PaymentTransaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">
                    {transaction.pagarme_transaction_id.substring(0, 8)}...
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.customer_email}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">
                      R$ {Number(transaction.amount).toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2 
                      })}
                    </div>
                    {transaction.installments && transaction.installments > 1 && (
                      <div className="text-sm text-muted-foreground">
                        {transaction.installments}x
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getMethodIcon(transaction.method)}
                      <span>{getMethodText(transaction.method)}</span>
                    </div>
                    {transaction.card_brand && (
                      <div className="text-sm text-muted-foreground capitalize">
                        {transaction.card_brand}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => manualCheckStatus(transaction.pagarme_transaction_id)}
                        disabled={isCheckingStatus}
                      >
                        <RefreshCw className={`h-3 w-3 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                      </Button>
                      
                      {transaction.method === 'pix' && transaction.pix_code && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPixCode(transaction.pix_code!)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* Implementar QR Code modal */}}
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      
                      {transaction.method === 'boleto' && transaction.boleto_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openBoleto(transaction.boleto_url!)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
