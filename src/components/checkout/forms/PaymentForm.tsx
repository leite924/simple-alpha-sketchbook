
import React from 'react';
import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckoutFormValues } from '@/types/checkout';
import CreditCardForm from './payment/CreditCardForm';

interface PaymentFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  watch: UseFormWatch<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ register, watch, errors }) => {
  const paymentMethod = watch('paymentMethod');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Método de Pagamento</Label>
          <RadioGroup 
            defaultValue="credit_card" 
            className="grid grid-cols-3 gap-4 mt-2"
            {...register("paymentMethod")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Cartão de Crédito</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix">PIX</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_slip" id="bank_slip" />
              <Label htmlFor="bank_slip">Boleto</Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === 'credit_card' && (
          <CreditCardForm register={register} errors={errors} />
        )}

        <div>
          <Label htmlFor="couponCode">Cupom de Desconto</Label>
          <Input
            id="couponCode"
            placeholder="Se você tem um cupom, digite aqui"
            {...register("couponCode")}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
