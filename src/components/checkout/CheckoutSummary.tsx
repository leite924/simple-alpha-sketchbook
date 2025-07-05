
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Truck, Clock, Star, Flame } from 'lucide-react';

interface CheckoutSummaryProps {
  classData: {
    id: string;
    courseName: string;
    period: string;
    price: number;
    image: string;
  };
}

const CheckoutSummary = ({ classData }: CheckoutSummaryProps) => {
  const [orderBump, setOrderBump] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });

  // Listen for order bump changes from other components
  useEffect(() => {
    const handleOrderBumpChange = (e: CustomEvent) => {
      setOrderBump(e.detail.selected);
    };

    window.addEventListener('orderBumpChange', handleOrderBumpChange as EventListener);
    return () => window.removeEventListener('orderBumpChange', handleOrderBumpChange as EventListener);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            return { minutes: 0, seconds: 0 };
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const bumpProduct = {
    name: 'Kit Completo de Iluminação',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3'
  };

  const subtotal = classData.price + (orderBump ? bumpProduct.price : 0);
  const shipping = 0; // Free shipping for courses
  const total = subtotal + shipping;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="sticky top-6">
        <CardHeader>
          <CardTitle>Resumo do pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Product */}
          <div className="flex items-center space-x-3">
            <img 
              src={classData.image}
              alt={classData.courseName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-sm">{classData.courseName}</h4>
              <p className="text-xs text-gray-600">{classData.period}</p>
              <p className="font-semibold text-green-600">
                R$ {classData.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          {/* Order Bump Product */}
          {orderBump && (
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
              <img 
                src={bumpProduct.image}
                alt={bumpProduct.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{bumpProduct.name}</h4>
                <p className="font-semibold text-green-600">
                  R$ {bumpProduct.price.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
          )}

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Frete:</span>
              <span className="text-green-600 font-medium">Grátis</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
            <p className="text-center text-sm text-gray-600">
              em até 12x no cartão
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Guarantees */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Garantia de 30 dias</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="w-4 h-4 text-blue-500" />
              <span>Material enviado por e-mail</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>Acesso vitalício ao conteúdo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgency Timer */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Oferta expira em:</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <p className="text-xs text-red-600 mt-1">Garante já sua vaga!</p>
        </CardContent>
      </Card>

      {/* Social Proof */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-sm italic text-gray-700 mb-2">
              "Curso incrível! Aprendi muito sobre fotografia. Recomendo!"
            </p>
            <p className="text-xs text-gray-600">- Ana Silva, formada em 2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSummary;
