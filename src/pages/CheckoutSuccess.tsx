
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-12 pb-10 px-6 md:px-12 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-6">Matrícula Realizada com Sucesso!</h1>
            
            <p className="text-lg mb-8">
              Sua matrícula foi realizada com sucesso. Em breve você receberá um email com todas as informações.
            </p>
            
            <div className="mb-10 max-w-md mx-auto bg-gray-50 p-6 rounded-lg text-left">
              <p className="mb-2">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Acesse sua área do aluno para visualizar seu curso</li>
                <li>Entre em contato com a coordenação para mais informações</li>
                <li>Prepare-se para sua primeira aula!</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/student-area">Acessar Área do Aluno</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/">Voltar para a Página Principal</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CheckoutSuccess;
