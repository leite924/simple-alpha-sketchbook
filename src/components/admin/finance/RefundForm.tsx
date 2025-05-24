import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransactions, useTransactionActions } from "@/hooks/finance";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transaction } from "@/types/finance";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  transactionId: z.string().min(1, "Selecione uma transação para estornar"),
  description: z.string().min(3, "Descrição é obrigatória"),
});

interface RefundFormProps {
  onSuccess?: () => void;
}

const RefundForm: React.FC<RefundFormProps> = ({ onSuccess }) => {
  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactions();
  const { registerRefund } = useTransactionActions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionId: "",
      description: "",
    },
  });

  // Filtrar apenas transações elegíveis para estorno (receitas e despesas confirmadas)
  const refundableTransactions = transactions.filter(t => 
    (t.type === 'income' || t.type === 'expense') && 
    !transactions.some(refund => 
      refund.type === 'refund' && 
      refund.reference_id === t.id
    )
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedTransaction) return;
    
    try {
      await registerRefund.mutateAsync({
        transaction: selectedTransaction,
        description: values.description,
      });
      
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao registrar estorno:", error);
    }
  };

  const handleTransactionChange = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      form.setValue("description", `Estorno: ${transaction.description}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transação a Estornar</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                handleTransactionChange(value);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma transação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isTransactionsLoading ? (
                    <SelectItem value="loading" disabled>Carregando transações...</SelectItem>
                  ) : refundableTransactions.length > 0 ? (
                    refundableTransactions.map((transaction) => (
                      <SelectItem key={transaction.id} value={transaction.id}>
                        {transaction.description} - R$ {parseFloat(String(transaction.amount)).toFixed(2)}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Nenhuma transação disponível para estorno</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedTransaction && (
          <div className="p-4 bg-gray-100 rounded-md">
            <h4 className="font-medium">Detalhes da Transação</h4>
            <p><strong>Tipo:</strong> {selectedTransaction.type === 'income' ? 'Receita' : 'Despesa'}</p>
            <p><strong>Valor:</strong> R$ {parseFloat(String(selectedTransaction.amount)).toFixed(2)}</p>
            <p><strong>Data:</strong> {new Date(selectedTransaction.transaction_date).toLocaleDateString('pt-BR')}</p>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivo do Estorno</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o motivo do estorno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={registerRefund.isPending || !selectedTransaction}>
            {registerRefund.isPending ? "Processando..." : "Registrar Estorno"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RefundForm;
