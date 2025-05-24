
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckoutFormValues } from '@/types/checkout';

interface CreditCardFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ register, errors }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <Input
          id="cardNumber"
          placeholder="0000 0000 0000 0000"
          {...register("cardNumber")}
        />
      </div>
      <div>
        <Label htmlFor="cardHolderName">Nome no Cartão</Label>
        <Input
          id="cardHolderName"
          placeholder="Nome como está no cartão"
          {...register("cardHolderName")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiryDate">Data de Validade</Label>
          <Input
            id="expiryDate"
            placeholder="MM/AA"
            {...register("expiryDate")}
          />
        </div>
        <div>
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder="123"
            {...register("cvv")}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="installments">Parcelas</Label>
        <select
          id="installments"
          className="w-full p-2 border rounded"
          {...register("installments", { valueAsNumber: true })}
        >
          <option value={1}>1x sem juros</option>
          <option value={2}>2x sem juros</option>
          <option value={3}>3x sem juros</option>
          <option value={4}>4x sem juros</option>
          <option value={5}>5x sem juros</option>
          <option value={6}>6x sem juros</option>
        </select>
      </div>
    </div>
  );
};

export default CreditCardForm;
