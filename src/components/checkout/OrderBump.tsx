
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Flame, Star } from 'lucide-react';

interface OrderBumpProps {
  onSelectionChange: (selected: boolean) => void;
  selected: boolean;
}

const OrderBump = ({ onSelectionChange, selected }: OrderBumpProps) => {
  const bumpProduct = {
    name: 'Kit Completo de Iluminação',
    description: 'Aprenda técnicas avançadas de iluminação profissional',
    originalPrice: 399.90,
    discountPrice: 199.90,
    savings: 200.00,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3'
  };

  return (
    <div className="my-8">
      <Card className="border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 relative overflow-hidden">
        {/* Flame badge */}
        <div className="absolute -top-3 left-6 z-10">
          <Badge className="bg-orange-500 text-white px-4 py-1 text-xs font-semibold">
            <Flame className="w-3 h-3 mr-1" />
            OFERTA ESPECIAL
          </Badge>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex items-start space-x-4">
            <Checkbox 
              id="order-bump"
              checked={selected}
              onCheckedChange={onSelectionChange}
              className="mt-2"
            />
            
            <div className="flex-1 cursor-pointer" onClick={() => onSelectionChange(!selected)}>
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <img 
                  src={bumpProduct.image}
                  alt={bumpProduct.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <h4 className="font-bold text-lg text-gray-900">
                      Aproveite esta oferta única!
                    </h4>
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-2">
                    Leve também o <strong>{bumpProduct.name}</strong>
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {bumpProduct.description}
                  </p>
                  
                  <div className="flex items-center space-x-3 flex-wrap">
                    <span className="text-sm text-gray-500 line-through">
                      De R$ {bumpProduct.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      Por apenas R$ {bumpProduct.discountPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <Badge className="bg-red-500 text-white text-xs">
                      Economize R$ {bumpProduct.savings.toFixed(2).replace('.', ',')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      Avaliado por mais de 500 alunos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {selected && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium text-sm flex items-center">
                ✅ Ótima escolha! O Kit de Iluminação foi adicionado ao seu pedido.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderBump;
