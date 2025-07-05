
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';

const studentRegistrationSchema = z.object({
  fullName: z.string().min(5, "Nome completo deve ter pelo menos 5 caracteres"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos").max(14, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  postalCode: z.string().min(8, "CEP deve ter 8 dígitos").max(9, "CEP inválido"),
  address: z.string().min(5, "Endereço é obrigatório"),
  addressNumber: z.string().min(1, "Número é obrigatório"),
  addressComplement: z.string().optional(),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  countryCode: z.string().min(1, "Código do país é obrigatório"),
  areaCode: z.string().min(2, "DDD é obrigatório"),
  phoneNumber: z.string().min(9, "Número deve ter 9 dígitos").max(9, "Número deve ter 9 dígitos")
});

type StudentRegistrationFormData = z.infer<typeof studentRegistrationSchema>;

interface StudentRegistrationFormProps {
  onSubmit: (data: StudentRegistrationFormData) => Promise<void>;
  isLoading?: boolean;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onSubmit, 
  isLoading = false 
}) => {
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<StudentRegistrationFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      countryCode: '+55'
    }
  });

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

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleFormSubmit = async (data: StudentRegistrationFormData) => {
    console.log('📝 Dados do formulário:', data);
    
    try {
      await onSubmit(data);
      // Reset form after successful submission
      reset();
      toast.success('Formulário resetado após sucesso');
    } catch (error) {
      console.error('❌ Erro no handleFormSubmit:', error);
      toast.error('Erro ao processar formulário');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Aluno</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
            
            <div>
              <Label htmlFor="fullName">Nome Completo *</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Digite seu nome completo"
                className={errors.fullName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register("cpf")}
                placeholder="000.000.000-00"
                maxLength={14}
                onChange={(e) => {
                  const formatted = formatCpf(e.target.value);
                  setValue('cpf', formatted);
                }}
                className={errors.cpf ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="seu@email.com"
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Endereço */}
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

          {/* WhatsApp */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">WhatsApp</h3>
            
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="countryCode">País *</Label>
                <Select onValueChange={(value) => setValue('countryCode', value)} defaultValue="+55" disabled={isLoading}>
                  <SelectTrigger className={errors.countryCode ? "border-red-500" : ""}>
                    <SelectValue placeholder="DDI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+55">🇧🇷 +55</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+54">🇦🇷 +54</SelectItem>
                    <SelectItem value="+56">🇨🇱 +56</SelectItem>
                    <SelectItem value="+57">🇨🇴 +57</SelectItem>
                  </SelectContent>
                </Select>
                {errors.countryCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.countryCode.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="areaCode">DDD *</Label>
                <Input
                  id="areaCode"
                  {...register("areaCode")}
                  placeholder="11"
                  maxLength={2}
                  className={errors.areaCode ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.areaCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.areaCode.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Número *</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="999999999"
                  maxLength={9}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              WhatsApp completo: {watch('countryCode')} ({watch('areaCode')}) {watch('phoneNumber')}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              'Cadastrar Aluno'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentRegistrationForm;
