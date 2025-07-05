
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, Clock } from 'lucide-react';

interface AddressStepProps {
  onComplete: (data: any) => void;
}

const AddressStep = ({ onComplete }: AddressStepProps) => {
  const [formData, setFormData] = useState({
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    shipping: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCep, setLoadingCep] = useState(false);

  const shippingOptions = [
    {
      id: 'pac',
      name: 'Correios PAC',
      time: '5-7 dias úteis',
      price: 15.90
    },
    {
      id: 'sedex',
      name: 'Correios SEDEX',
      time: '2-3 dias úteis', 
      price: 25.90
    },
    {
      id: 'express',
      name: 'Entrega Expressa',
      time: '1-2 dias úteis',
      price: 35.90
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const searchAddress = async (zipCode: string) => {
    if (zipCode.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleZipCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
    handleInputChange('zipCode', formatted);
    
    if (cleaned.length === 8) {
      searchAddress(cleaned);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.zipCode) newErrors.zipCode = 'CEP é obrigatório';
    if (!formData.street) newErrors.street = 'Endereço é obrigatório';
    if (!formData.number) newErrors.number = 'Número é obrigatório';
    if (!formData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório';
    if (!formData.city) newErrors.city = 'Cidade é obrigatória';
    if (!formData.shipping) newErrors.shipping = 'Selecione uma opção de frete';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
          <span>Endereço de entrega</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="zipCode">CEP *</Label>
            <Input
              id="zipCode"
              placeholder="00000-000"
              value={formData.zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              className={errors.zipCode ? 'border-red-500' : ''}
              maxLength={9}
            />
            {loadingCep && <p className="text-blue-600 text-sm mt-1">Buscando endereço...</p>}
            {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
          </div>

          <div>
            <Label htmlFor="street">Endereço *</Label>
            <Input
              id="street"
              placeholder="Rua, Avenida, etc."
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              className={errors.street ? 'border-red-500' : ''}
            />
            {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                placeholder="123"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className={errors.number ? 'border-red-500' : ''}
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
            </div>

            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, Bloco, etc."
                value={formData.complement}
                onChange={(e) => handleInputChange('complement', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                placeholder="Seu bairro"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                className={errors.neighborhood ? 'border-red-500' : ''}
              />
              {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood}</p>}
            </div>

            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Sua cidade"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
          </div>

          <div>
            <Label>Opções de Frete *</Label>
            <RadioGroup 
              value={formData.shipping} 
              onValueChange={(value) => handleInputChange('shipping', value)}
              className="mt-2"
            >
              {shippingOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{option.name}</span>
                      </div>
                      <span className="font-semibold text-green-600">
                        R$ {option.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{option.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {errors.shipping && <p className="text-red-500 text-sm mt-1">{errors.shipping}</p>}
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Continuar para Pagamento
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddressStep;
