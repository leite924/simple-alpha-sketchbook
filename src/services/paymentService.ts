
import { supabase } from '@/integrations/supabase/client';

export async function createTransaction(
  userId: string, 
  amount: number, 
  paymentMethod: string,
  installments: number | null,
  classId: string,
  couponId: string | null,
  cardDetails?: {
    cardBrand?: string;
    lastFour?: string;
  }
) {
  try {
    // Since payment_transactions table doesn't exist in Supabase,
    // we'll create a transaction record in the transactions table instead
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        description: `Payment for class ${classId}`,
        type: 'income',
        amount: amount,
        transaction_date: new Date().toISOString().split('T')[0],
        reference_id: classId,
        reference_type: 'class_enrollment',
        notes: `Payment method: ${paymentMethod}, Installments: ${installments || 1}`
      })
      .select()
      .single();
      
    if (error) throw new Error(`Transaction error: ${error.message}`);
    return data;
  } catch (error) {
    console.error('Error in createTransaction:', error);
    throw error;
  }
}

export async function createEnrollment(
  studentId: string,
  classId: string,
  couponId: string | null,
  paymentAmount: number,
  originalAmount: number,
  discountAmount: number
) {
  try {
    const { error } = await supabase
      .from('manual_enrollments')
      .insert({
        student_id: studentId,
        class_id: classId,
        payment_status: 'paid',
        coupon_id: couponId,
        payment_amount: paymentAmount,
        original_amount: originalAmount,
        discount_amount: discountAmount,
        created_by: studentId // In this case, the student is creating their own enrollment
      });
      
    if (error) throw new Error(`Enrollment error: ${error.message}`);
    return true;
  } catch (error) {
    console.error('Error in createEnrollment:', error);
    throw error;
  }
}
