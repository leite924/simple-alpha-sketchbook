
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import FinanceSidebar from '@/components/finance/FinanceSidebar';
import Dashboard from '@/components/finance/Dashboard';
import AdminAccess from '@/components/admin/AdminAccess';
import { useAdminAuth } from '@/hooks/useAdminAuth';

// This component will be the container for the financial system accessible only to admins
const Finance: React.FC = () => {
  const { tab = 'dashboard' } = useParams<{ tab?: string }>();
  const validTabs = ['dashboard', 'receivables', 'payables', 'cashflow', 'refunds', 'categories'];
  
  const {
    authenticated,
    userRole,
    isLoading,
    error
  } = useAdminAuth();

  // Verify if the tab is valid
  if (!validTabs.includes(tab)) {
    return <Navigate to="/financeiro/dashboard" replace />;
  }
  
  return (
    <MainLayout>
      <AdminAccess authenticated={authenticated} isLoading={isLoading}>
        <div className="flex h-full">
          <FinanceSidebar currentTab={tab} />
          <div className="flex-1 p-8 overflow-auto">
            {tab === 'dashboard' && <Dashboard />}
            {tab === 'receivables' && <div>Contas a Receber (Em desenvolvimento)</div>}
            {tab === 'payables' && <div>Contas a Pagar (Em desenvolvimento)</div>}
            {tab === 'cashflow' && <div>Fluxo de Caixa (Em desenvolvimento)</div>}
            {tab === 'refunds' && <div>Estornos (Em desenvolvimento)</div>}
            {tab === 'categories' && <div>Categorias (Em desenvolvimento)</div>}
          </div>
        </div>
      </AdminAccess>
    </MainLayout>
  );
};

export default Finance;
