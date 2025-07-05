
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import PersonalInfoStep from './steps/PersonalInfoStep';
import AddressStep from './steps/AddressStep';
import PaymentStep from './steps/PaymentStep';
import OrderBump from './OrderBump';
import { CheckCircle, CreditCard, Smartphone, Receipt } from 'lucide-react';

interface CheckoutContainerProps {
  classData: {
    id: string;
    courseName: string;
    period: string;
    price: number;
    image: string;
  };
}

const CheckoutContainer = ({ classData }: CheckoutContainerProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    address: {},
    payment: {},
    orderBump: false
  });

  const steps = [
    { number: 1, title: 'Seus dados', component: PersonalInfoStep },
    { number: 2, title: 'Endereço', component: AddressStep },
    { number: 3, title: 'Pagamento', component: PaymentStep }
  ];

  const handleStepComplete = (stepNumber: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [stepNumber === 1 ? 'personalInfo' : stepNumber === 2 ? 'address' : 'payment']: data
    }));
    
    if (stepNumber < 3) {
      setCurrentStep(stepNumber + 1);
    }
  };

  const handleOrderBumpChange = (selected: boolean) => {
    setFormData(prev => ({ ...prev, orderBump: selected }));
    
    // Dispatch custom event for CheckoutSummary to listen
    window.dispatchEvent(new CustomEvent('orderBumpChange', { 
      detail: { selected } 
    }));
  };

  return (
    <Card className="w-full">
      <CardContent className="p-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
              </div>
              <div className="ml-3">
                <p className={`font-medium ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <PersonalInfoStep onComplete={(data) => handleStepComplete(1, data)} />
        )}
        
        {currentStep === 2 && (
          <>
            <AddressStep onComplete={(data) => handleStepComplete(2, data)} />
            <OrderBump 
              onSelectionChange={handleOrderBumpChange}
              selected={formData.orderBump}
            />
          </>
        )}
        
        {currentStep === 3 && (
          <PaymentStep 
            onComplete={(data) => handleStepComplete(3, data)}
            classData={classData}
            orderBump={formData.orderBump}
            formData={formData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutContainer;
