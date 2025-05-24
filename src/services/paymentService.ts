
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
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        status: 'completed', // In a real system, this would start as 'pending'
        amount: amount,
        payment_method: paymentMethod,
        installments: installments || 1,
        card_brand: cardDetails?.cardBrand || null,
        last_four: cardDetails?.lastFour || null,
        class_id: classId,
        coupon_id: couponId
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
