
import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckoutFormValues } from '@/types/checkout';

interface AddressFormProps {
  register: UseFormRegister<CheckoutFormValues>;
  errors: FieldErrors<CheckoutFormValues>;
}

const AddressForm: React.FC<AddressFormProps> = ({ register, errors }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Endereço</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            {...register("address")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="addressNumber">Número</Label>
            <Input
              id="addressNumber"
              {...register("addressNumber")}
              className={errors.addressNumber ? "border-red-500" : ""}
            />
            {errors.addressNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.addressNumber.message}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="addressComplement">Complemento</Label>
            <Input
              id="addressComplement"
              {...register("addressComplement")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              {...register("neighborhood")}
              className={errors.neighborhood ? "border-red-500" : ""}
            />
            {errors.neighborhood && (
              <p className="text-sm text-red-500 mt-1">{errors.neighborhood.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="postalCode">CEP</Label>
            <Input
              id="postalCode"
              {...register("postalCode")}
              className={errors.postalCode ? "border-red-500" : ""}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              {...register("city")}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              {...register("state")}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressForm;
