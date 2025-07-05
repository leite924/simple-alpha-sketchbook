
import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { StudentRegistrationFormData } from './types';
import { formatCep } from './utils';

interface AddressSectionProps {
  register: UseFormRegister<StudentRegistrationFormData>;
  errors: FieldErrors<StudentRegistrationFormData>;
  setValue: UseFormSetValue<StudentRegistrationFormData>;
  watch: UseFormWatch<StudentRegistrationFormData>;
  isLoading: boolean;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  register,
  errors,
  setValue,
  watch,
  isLoading
}) => {
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const postalCode = watch('postalCode');

  const searchCep = async (cep: string) => {
    if (cep.length < 8) return;
    
    setIsSearchingCep(true);
    try {
      const cleanCep = cep.replace(/\D/g, '');
      if (cleanCep.length !== 8) {
        toast.error('CEP deve ter 8 dígitos');
        return;
      }
      
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      setValue('address', data.logradouro || '');
      setValue('neighborhood', data.bairro || '');
      setValue('city', data.localidade || '');
      setValue('state', data.uf || '');
      
      toast.success('Endereço encontrado!');
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast.error('Erro ao buscar CEP');
    } finally {
      setIsSearchingCep(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Endereço Completo</h3>
      
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="postalCode">CEP *</Label>
          <Input
            id="postalCode"
            {...register("postalCode")}
            placeholder="00000-000"
            maxLength={9}
            onChange={(e) => {
              const formatted = formatCep(e.target.value);
              setValue('postalCode', formatted);
              if (formatted.length === 9) {
                searchCep(formatted);
              }
            }}
            className={errors.postalCode ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.postalCode && (
            <p className="text-sm text-red-500 mt-1">{errors.postalCode.message}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => searchCep(postalCode)}
          disabled={isSearchingCep || postalCode?.length < 8 || isLoading}
          className="mt-6"
        >
          {isSearchingCep ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="address">Endereço *</Label>
          <Input
            id="address"
            {...register("address")}
            placeholder="Rua, Avenida, etc."
            className={errors.address ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.address && (
            <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="addressNumber">Número *</Label>
          <Input
            id="addressNumber"
            {...register("addressNumber")}
            placeholder="123"
            className={errors.addressNumber ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.addressNumber && (
            <p className="text-sm text-red-500 mt-1">{errors.addressNumber.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="addressComplement">Complemento</Label>
        <Input
          id="addressComplement"
          {...register("addressComplement")}
          placeholder="Apto, Bloco, etc. (opcional)"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            {...register("neighborhood")}
            placeholder="Bairro"
            className={errors.neighborhood ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.neighborhood && (
            <p className="text-sm text-red-500 mt-1">{errors.neighborhood.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Cidade"
            className={errors.city ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="state">Estado *</Label>
          <Input
            id="state"
            {...register("state")}
            placeholder="UF"
            maxLength={2}
            className={errors.state ? "border-red-500" : ""}
            disabled={isLoading}
          />
          {errors.state && (
            <p className="text-sm text-red-500 mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
