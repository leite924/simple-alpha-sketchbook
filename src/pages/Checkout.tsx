
import React from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import CheckoutSummary from '@/components/checkout/CheckoutSummary';
import { Card } from '@/components/ui/card';
import { useClassDetail } from '@/hooks/classes/useClassDetail';

const Checkout = () => {
  const { classId } = useParams();
  
  // Mock class data for now - in a real app, you'd fetch this based on classId
  const classData = {
    id: classId || '650e8400-e29b-41d4-a716-446655440001',
    courseName: 'Fotografia Básica',
    period: 'Noturno',
    price: 1200.00,
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
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
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
              <CheckoutContainer classData={classData} />
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CheckoutSummary classData={classData} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
