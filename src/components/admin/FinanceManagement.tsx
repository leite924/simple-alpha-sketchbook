
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart2, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  RefreshCcw, 
  Tag, 
  Settings,
  Plus
} from 'lucide-react';
import PaymentGateway from "./PaymentGateway";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReceivableForm from "./finance/ReceivableForm";
import PayableForm from "./finance/PayableForm";
import RefundForm from "./finance/RefundForm";
import TransactionForm from "./finance/TransactionForm";
import { toast } from "sonner";

interface FinanceManagementProps {
  userRole?: string;
  showDiagnostics?: boolean;
}

const FinanceManagement: React.FC<FinanceManagementProps> = ({ userRole = "", showDiagnostics = false }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [openReceivable, setOpenReceivable] = useState(false);
  const [openPayable, setOpenPayable] = useState(false);
  const [openRefund, setOpenRefund] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  
  useEffect(() => {
    console.log("FinanceManagement mounted with props:", { userRole, showDiagnostics });
    
    // Check if component is visible in DOM
    const isVisible = document.querySelector('[data-value="finance"]')?.getAttribute('data-state') === 'active';
    console.log("FinanceManagement tab is visible:", isVisible);
    
    // Check if PaymentGateway component will render
    const paymentTabExists = !!document.querySelector('[value="payment"]');
    console.log("Payment tab element exists:", paymentTabExists);
  }, [userRole, showDiagnostics]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Total de Receitas</h3>
              <p className="text-2xl font-bold">R$ 15.750,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Total de Despesas</h3>
              <p className="text-2xl font-bold">R$ 8.325,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Saldo</h3>
              <p className="text-2xl font-bold">R$ 7.425,00</p>
            </div>
            <BarChart2 className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Dialog open={openReceivable} onOpenChange={setOpenReceivable}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Conta a Receber
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo lançamento - Conta a Receber</DialogTitle>
            </DialogHeader>
            <ReceivableForm onSuccess={() => {
              setOpenReceivable(false);
              toast.success("Conta a receber adicionada com sucesso!");
            }} />
          </DialogContent>
        </Dialog>

        <Dialog open={openPayable} onOpenChange={setOpenPayable}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Conta a Pagar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo lançamento - Conta a Pagar</DialogTitle>
            </DialogHeader>
            <PayableForm onSuccess={() => {
              setOpenPayable(false);
              toast.success("Conta a pagar adicionada com sucesso!");
            }} />
          </DialogContent>
        </Dialog>

        <Dialog open={openRefund} onOpenChange={setOpenRefund}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Estorno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Estorno</DialogTitle>
            </DialogHeader>
            <RefundForm onSuccess={() => {
              setOpenRefund(false);
              toast.success("Estorno registrado com sucesso!");
            }} />
          </DialogContent>
        </Dialog>

        <Dialog open={openTransaction} onOpenChange={setOpenTransaction}>
          <DialogTrigger asChild>
            <Button variant="default" className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Transação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
            </DialogHeader>
            <TransactionForm onSuccess={() => {
              setOpenTransaction(false);
              toast.success("Transação registrada com sucesso!");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="receivables" className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4" /> Contas a Receber
          </TabsTrigger>
          <TabsTrigger value="payables" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Contas a Pagar
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Fluxo de Caixa
          </TabsTrigger>
          <TabsTrigger value="refunds" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" /> Estornos
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> Categorias
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Gateway de Pagamento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dashboard Financeiro</h3>
            <p>Visão geral das finanças da empresa.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="receivables">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Receber</h3>
            <p>Gerencie os pagamentos pendentes e recebidos.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="payables">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contas a Pagar</h3>
            <p>Controle suas despesas e pagamentos pendentes.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="cashflow">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa</h3>
            <p>Acompanhe suas entradas e saídas financeiras.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Estornos</h3>
            <p>Gerencie os estornos de pagamentos.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <p>Organize suas finanças com categorias personalizadas.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gateway de Pagamento</h3>
            <PaymentGateway />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceManagement;
