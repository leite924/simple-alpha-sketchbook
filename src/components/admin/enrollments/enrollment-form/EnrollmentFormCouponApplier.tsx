
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ManualEnrollmentFormValues } from '@/types/enrollment';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  course_id: string | null;
}

interface Class {
  id: string;
  course_id: string;
  course_name: string;
}

const EnrollmentFormCouponApplier = () => {
  const [couponCode, setCouponCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const { watch, setValue, getValues } = useFormContext<ManualEnrollmentFormValues>();
  
  const classId = watch('class_id');
  const originalAmount = watch('original_amount');
  
  const verifyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Insira um cupom para verificar');
      return;
    }
    
    if (!classId) {
      toast.error('Selecione uma turma primeiro');
      return;
    }
    
    setVerifying(true);
    
    try {
      // Primeiro, buscar o cupom
      const { data: couponData, error: couponError } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('is_active', true)
        .single();
      
      if (couponError || !couponData) {
        toast.error('Cupom não encontrado ou inválido');
        return;
      }
      
      // Tipagem segura para o cupom
      const coupon = couponData as unknown as Coupon;
      
      // Verificar validade do cupom
      const now = new Date();
      const validFrom = new Date(couponData.valid_from);
      const validUntil = couponData.valid_until ? new Date(couponData.valid_until) : null;
      
      if (now < validFrom || (validUntil && now > validUntil)) {
        toast.error('Cupom fora do período de validade');
        return;
      }
      
      // Se o cupom for específico para um curso, verificar se é aplicável
      if (coupon.course_id) {
        // Buscar a turma para verificar o curso
        const { data: classData, error: classError } = await supabase
          .from('classes')
          .select('course_id, course_name')
          .eq('id', classId)
          .single();
        
        if (classError || !classData) {
          toast.error('Erro ao verificar a turma');
          return;
        }
        
        // Tipagem segura para a classe
        const classInfo = classData as unknown as Class;
        
        if (classInfo.course_id !== coupon.course_id) {
          toast.error(`Este cupom é válido apenas para o curso: ${classData.course_name}`);
          return;
        }
      }
      
      // Calcular o valor do desconto
      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (parseFloat(String(originalAmount)) * parseFloat(String(coupon.discount_value))) / 100;
      } else {
        discountAmount = parseFloat(String(coupon.discount_value));
      }
      
      // Atualizar o formulário
      setValue('coupon_id', coupon.id);
      setValue('discount_amount', discountAmount);
      setValue('payment_amount', parseFloat(String(originalAmount)) - discountAmount);
      
      toast.success('Cupom aplicado com sucesso!');
    } catch (error) {
      console.error('Erro ao verificar cupom:', error);
      toast.error('Erro ao verificar o cupom');
    } finally {
      setVerifying(false);
    }
  };

  const removeCoupon = () => {
    setValue('coupon_id', undefined);
    setValue('discount_amount', 0);
    setValue('payment_amount', parseFloat(String(originalAmount)));
    setCouponCode('');
    toast.success('Cupom removido');
  };

  const appliedCouponId = watch('coupon_id');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="coupon">Cupom de Desconto</Label>
          <Input
            id="coupon"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Insira o código do cupom"
            disabled={!!appliedCouponId || verifying}
            className="uppercase"
          />
        </div>
        <div>
          {!appliedCouponId ? (
            <Button 
              type="button" 
              onClick={verifyCoupon}
              disabled={verifying || !couponCode.trim() || !classId} 
              className="w-full"
            >
              {verifying ? 'Verificando...' : 'Verificar Cupom'}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              onClick={removeCoupon}
              className="w-full"
            >
              Remover Cupom
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentFormCouponApplier;
