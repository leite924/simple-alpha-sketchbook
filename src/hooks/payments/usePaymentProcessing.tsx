
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { findUserByEmail, createUser } from '@/services/userService';
import { validateCoupon } from '@/services/couponService';
import { getClassDetails } from '@/services/classService';
import { createTransaction, createEnrollment } from '@/services/paymentService';
import type { CheckoutFormValues } from '@/types/checkout';

export const usePaymentProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const processCheckout = async (values: CheckoutFormValues) => {
    setIsProcessing(true);
    
    try {
      console.log('Processing checkout with values:', values);
      
      // 1. Verify if the user exists or register a new one
      let userId = await findUserByEmail(values.email);
      
      if (!userId) {
        // Create new user if not found
        userId = await createUser(
          values.email,
          values.firstName,
          values.lastName,
          {
            cpf: values.cpf,
            birthDate: values.birthDate,
            phone: values.phone,
            address: values.address,
            addressNumber: values.addressNumber,
            addressComplement: values.addressComplement,
            neighborhood: values.neighborhood,
            city: values.city,
            state: values.state,
            postalCode: values.postalCode
          }
        );
      }
      
      if (!userId) {
        throw new Error('Failed to find or create user');
      }
      
      // 2. Process payment
      // Check if a coupon was provided
      const couponResult = await validateCoupon(values.couponCode || '');
      if (!couponResult) {
        throw new Error('Error validating coupon');
      }
      
      const { couponId, discountAmount } = couponResult;
      
      // Get class information
      const classData = await getClassDetails(values.classId);
      if (!classData) {
        throw new Error('Failed to fetch class details');
      }
      
      const amount = parseFloat(classData.price);
      const finalAmount = amount - discountAmount;
      
      // Create transaction record
      const transaction = await createTransaction(
        userId,
        finalAmount,
        values.paymentMethod,
        values.installments || null,
        values.classId,
        couponId,
        values.paymentMethod === 'credit_card' ? {
          cardBrand: 'mastercard', // Simulated
          lastFour: values.cardNumber?.slice(-4)
        } : undefined
      );
      
      console.log('Transaction created:', transaction);
      
      // Create enrollment record after successful payment
      await createEnrollment(
        userId,
        values.classId,
        couponId,
        finalAmount,
        amount,
        discountAmount
      );
      
      toast.success('Matrícula realizada com sucesso!');
      
      // Redirect to success page
      navigate('/checkout/success');
      
    } catch (error: unknown) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error(`Erro no processo de pagamento: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    processCheckout,
    isProcessing
  };
};
