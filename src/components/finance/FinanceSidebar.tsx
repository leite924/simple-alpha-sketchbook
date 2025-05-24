
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  PiggyBank, 
  CreditCard, 
  Tag, 
  BarChart2,
  RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FinanceSidebarProps = {
  currentTab: string;
};

const FinanceSidebar: React.FC<FinanceSidebarProps> = ({ currentTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 className="mr-2 h-4 w-4" /> },
    { id: 'receivables', label: 'Contas a Receber', icon: <PiggyBank className="mr-2 h-4 w-4" /> },
    { id: 'payables', label: 'Contas a Pagar', icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { id: 'cashflow', label: 'Fluxo de Caixa', icon: <TrendingUp className="mr-2 h-4 w-4" /> },
    { id: 'refunds', label: 'Estornos', icon: <RefreshCcw className="mr-2 h-4 w-4" /> },
    { id: 'categories', label: 'Categorias', icon: <Tag className="mr-2 h-4 w-4" /> },
  ];

  return (
    <div className="pb-12 w-64 border-r min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Sistema Financeiro
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentTab === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  currentTab === item.id ? "bg-slate-100 font-medium" : ""
                )}
                asChild
              >
                <Link to={`/financeiro/${item.id}`}>
                  {item.icon}
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSidebar;
