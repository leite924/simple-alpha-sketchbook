
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import CheckoutForm from '@/components/checkout/CheckoutForm';

const Checkout = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  
  // Redirect if no classId is provided
  useEffect(() => {
    if (!classId) {
      navigate('/classes');
    }
  }, [classId, navigate]);
  
  // Fetch class details
  const { data: classDetails, isLoading, error } = useQuery({
    queryKey: ['class_checkout', classId],
    queryFn: async () => {
      if (!classId) throw new Error("ID da turma não fornecido");
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();
        
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!classId,
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10">
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-red-700 mb-4">Erro ao carregar dados</h2>
            <p>{error instanceof Error ? error.message : 'Ocorreu um erro inesperado'}</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Finalize sua Matrícula</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{classDetails?.course_name}</h2>
          <p className="text-gray-700 mb-4">
            {classDetails?.period} | {classDetails?.days} | {classDetails?.time}
          </p>
          <p className="font-medium text-lg">
            Valor: R$ {parseFloat(classDetails?.price || '0').toFixed(2)}
          </p>
        </div>
        
        {classDetails && (
          <CheckoutForm
            classId={classId!}
            classPrice={parseFloat(classDetails.price)}
            className={classDetails.course_name}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Checkout;
