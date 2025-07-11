
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  Smartphone,
  Receipt
} from 'lucide-react';
import { usePaymentTransactions } from '@/hooks/payments/usePaymentTransactions';

interface PaymentStatsProps {
  userId?: string;
}

export const PaymentStats: React.FC<PaymentStatsProps> = ({ userId }) => {
  const { transactions, getRevenueStats, getTransactionsByStatus } = usePaymentTransactions(userId);
  
  const stats = getRevenueStats();
  const methodStats = {
    credit_card: getTransactionsByStatus('paid').filter(t => t.method === 'credit_card').length,
    pix: getTransactionsByStatus('paid').filter(t => t.method === 'pix').length,
    boleto: getTransactionsByStatus('paid').filter(t => t.method === 'boleto').length,
  };

  const statusStats = {
    paid: getTransactionsByStatus('paid').length,
    pending: getTransactionsByStatus('pending').length,
    refused: getTransactionsByStatus('refused').length,
    processing: getTransactionsByStatus('processing').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Receita Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalTransactions} transações aprovadas
          </p>
        </CardContent>
      </Card>

      {/* Receita Pendente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Pendente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {stats.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingTransactions} transações pendentes
          </p>
        </CardContent>
      </Card>

      {/* Status das Transações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-sm">Aprovadas</span>
              </div>
              <Badge variant="secondary">{statusStats.paid}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 text-yellow-500" />
                <span className="text-sm">Pendentes</span>
              </div>
              <Badge variant="secondary">{statusStats.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-3 w-3 text-red-500" />
                <span className="text-sm">Recusadas</span>
              </div>
              <Badge variant="secondary">{statusStats.refused}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Métodos</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-3 w-3 text-blue-500" />
                <span className="text-sm">Cartão</span>
              </div>
              <Badge variant="secondary">{methodStats.credit_card}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-3 w-3 text-green-500" />
                <span className="text-sm">PIX</span>
              </div>
              <Badge variant="secondary">{methodStats.pix}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Receipt className="h-3 w-3 text-orange-500" />
                <span className="text-sm">Boleto</span>
              </div>
              <Badge variant="secondary">{methodStats.boleto}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
