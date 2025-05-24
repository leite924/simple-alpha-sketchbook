
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentTransaction } from "../types";

interface TransactionStatsProps {
  transactions: PaymentTransaction[];
}

export const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const completedTransactions = transactions.filter(t => t.status === "completed");
  const totalAmount = completedTransactions.reduce((total, tx) => total + tx.amount, 0);
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {transactions.length}
          </div>
          <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Transações Bem-sucedidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {completedTransactions.length}
          </div>
          <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
        </CardContent>
      </Card>
    </div>
  );
};
