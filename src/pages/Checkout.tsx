
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { Card } from '@/components/ui/card';
import { useClassDetail } from '@/hooks/classes/useClassDetail';
import { Loader2 } from 'lucide-react';

const Checkout = () => {
  const { classId } = useParams();
  const { classData, loading } = useClassDetail(classId || '');

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Carregando dados da turma...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!classData) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Turma não encontrada</h2>
            <p className="text-gray-600">Não foi possível carregar os dados da turma.</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Preparar dados para o checkout
  const checkoutClassData = {
    id: classData.id,
    courseName: classData.courseName,
    period: classData.period,
    price: parseFloat(classData.price.toString().replace('R$ ', '').replace(',', '.')),
    image: 'https://images.unsplash.com/photo-1452378174528-3090a4bba7b2?ixlib=rb-4.0.3'
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg" alt="Logo" className="w-12 h-12" />
              <h1 className="text-2xl font-bold text-gray-900">Checkout - {classData.courseName}</h1>
            </div>
            <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
              <span className="text-green-600">🔒</span>
              <span className="text-green-700 font-medium">Compra 100% Segura</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <CheckoutContainer classData={checkoutClassData} />
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary classData={checkoutClassData} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
