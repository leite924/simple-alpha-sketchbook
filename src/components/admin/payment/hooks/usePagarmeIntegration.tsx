
import { useState } from 'react';
import { toast } from 'sonner';
import {
  processCardPayment,
  generatePaymentLink,
  generatePixPayment,
  generateBoletoPayment,
  checkTransactionStatus,
  saveTransactionToSupabase,
  PagarmeTransaction
} from '@/integrations/pagarme/client';

export const usePagarmeIntegration = () => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] = useState<PagarmeTransaction | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{qrCode: string, code: string} | null>(null);

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
      
      toast.success('Pagamento processado com sucesso!');
      return transaction;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error(`Erro ao processar pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Gerar PIX
  const handleGeneratePixPayment = async (
    customer: any,
    amount: number,
    items: any[]
  ) => {
    setIsProcessing(true);
    try {
      const result = await generatePixPayment(customer, amount, items);
      setPaymentLink(result.paymentUrl);
      setPixData({
        qrCode: result.pixQrCode,
        code: result.pixCode
      });
      
      toast.success('Código PIX gerado com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast.error(`Erro ao gerar PIX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Gerar boleto
  const handleGenerateBoletoPayment = async (
    customer: any,
    amount: number,
    items: any[]
  ) => {
    setIsProcessing(true);
    try {
      const result = await generateBoletoPayment(customer, amount, items);
      setPaymentLink(result.paymentUrl);
      
      toast.success('Boleto gerado com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro ao gerar boleto:', error);
      toast.error(`Erro ao gerar boleto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
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
    if (paymentMethod === 'pix') {
      return await handleGeneratePixPayment(customer, amount, items);
    } else {
      return await handleGenerateBoletoPayment(customer, amount, items);
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
    pixData,
    handleCardPayment,
    handleGeneratePaymentLink,
    handleGeneratePixPayment,
    handleGenerateBoletoPayment,
    handleCheckStatus
  };
};
