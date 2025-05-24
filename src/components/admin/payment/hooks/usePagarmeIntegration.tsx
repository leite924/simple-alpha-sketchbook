
import { useState } from 'react';
import { toast } from 'sonner';
import {
  processCardPayment,
  generatePaymentLink,
  checkTransactionStatus,
  saveTransactionToSupabase,
  PagarmeTransaction
} from '@/integrations/pagarme/client';

export const usePagarmeIntegration = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] = useState<PagarmeTransaction | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  // Processar pagamento com cartão
  const handleCardPayment = async (
    cardData: any,
    customer: any,
    amount: number,
    items: any[]
  ) => {
    setIsProcessing(true);
    try {
      const transaction = await processCardPayment(cardData, customer, amount, items);
      setTransactionResult(transaction);
      
      // Salvar no Supabase se tivermos um userId
      if (customer.userId) {
        await saveTransactionToSupabase(customer.userId, transaction);
      }
      
      toast.success('Pagamento processado com sucesso!');
      return transaction;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Gerar link de pagamento (Pix ou boleto)
  const handleGeneratePaymentLink = async (
    customer: any,
    amount: number,
    paymentMethod: 'boleto' | 'pix',
    items: any[]
  ) => {
    setIsProcessing(true);
    try {
      const result = await generatePaymentLink(customer, amount, paymentMethod, items);
      setPaymentLink(result.paymentUrl);
      
      toast.success(`Link de pagamento ${paymentMethod.toUpperCase()} gerado com sucesso!`);
      return result;
    } catch (error) {
      console.error('Erro ao gerar link de pagamento:', error);
      toast.error(`Erro ao gerar link de pagamento ${paymentMethod.toUpperCase()}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Verificar status de transação
  const handleCheckStatus = async (transactionId: string) => {
    setIsProcessing(true);
    try {
      const status = await checkTransactionStatus(transactionId);
      toast.info(`Status da transação: ${status}`);
      return status;
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      toast.error('Erro ao verificar status da transação');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    transactionResult,
    paymentLink,
    handleCardPayment,
    handleGeneratePaymentLink,
    handleCheckStatus
  };
};
