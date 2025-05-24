
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, BarChart2, PiggyBank, CreditCard, TrendingUp, RefreshCcw, Tag } from 'lucide-react';

const FinancesTab = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <h3 className="text-xl font-bold mb-6 flex items-center">
        <DollarSign className="mr-2 h-5 w-5" />
        Sistema Financeiro
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="h-6 w-6 mr-3 text-blue-500" />
            <h4 className="font-bold text-lg">Dashboard</h4>
          </div>
          <p className="text-gray-600 mb-4">Visão geral das suas finanças e métricas principais.</p>
          <Button 
            onClick={() => navigate('/financeiro/dashboard')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <PiggyBank className="h-6 w-6 mr-3 text-green-500" />
            <h4 className="font-bold text-lg">Contas a Receber</h4>
          </div>
          <p className="text-gray-600 mb-4">Gerencie os pagamentos pendentes e recebidos.</p>
          <Button 
            onClick={() => navigate('/financeiro/receivables')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="h-6 w-6 mr-3 text-red-500" />
            <h4 className="font-bold text-lg">Contas a Pagar</h4>
          </div>
          <p className="text-gray-600 mb-4">Controle suas despesas e pagamentos pendentes.</p>
          <Button 
            onClick={() => navigate('/financeiro/payables')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 mr-3 text-purple-500" />
            <h4 className="font-bold text-lg">Fluxo de Caixa</h4>
          </div>
          <p className="text-gray-600 mb-4">Acompanhe suas entradas e saídas financeiras.</p>
          <Button 
            onClick={() => navigate('/financeiro/cashflow')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <RefreshCcw className="h-6 w-6 mr-3 text-orange-500" />
            <h4 className="font-bold text-lg">Estornos</h4>
          </div>
          <p className="text-gray-600 mb-4">Visualize e solicite estornos de pagamentos.</p>
          <Button 
            onClick={() => navigate('/financeiro/refunds')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Tag className="h-6 w-6 mr-3 text-teal-500" />
            <h4 className="font-bold text-lg">Categorias</h4>
          </div>
          <p className="text-gray-600 mb-4">Organize suas finanças com categorias personalizadas.</p>
          <Button 
            onClick={() => navigate('/financeiro/categories')} 
            className="w-full"
          >
            Acessar
          </Button>
        </Card>
      </div>
    </>
  );
};

export default FinancesTab;
