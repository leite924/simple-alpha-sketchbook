
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, CreditCard, Settings, BarChart3 } from "lucide-react";
import { toast } from "sonner";

// Import refactored components
import { useTransactions } from "./payment/hooks/useTransactions";
import { TransactionsTab } from "./payment/TransactionsTab";
import { PaymentGatewaySettings } from "./payment/PaymentGatewaySettings";
import { PaymentGatewayProps } from "./payment/types";
import { PagarmeSettings } from "./payment/PagarmeSettings";
import { PaymentStats } from "./payment/PaymentStats";
import { PaymentTransactionsList } from "./payment/PaymentTransactionsList";

const PaymentGateway = ({ activeTab: initialTab, onTabChange }: PaymentGatewayProps = {}) => {
  const [activeTab, setActiveTab] = useState<"transactions" | "settings" | "pagarme" | "pagarme-transactions">(initialTab || "transactions");

  const {
    filteredTransactions,
    storedInvoices,
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    storeInvoice,
    updateInvoiceStatus,
    handleExportTransactions
  } = useTransactions();

  const handleTabChange = (value: string) => {
    const tab = value as "transactions" | "settings" | "pagarme" | "pagarme-transactions";
    setActiveTab(tab);
    if (onTabChange && (tab === "transactions" || tab === "settings")) {
      onTabChange(tab as "transactions" | "settings");
    }
  };

  const handleSaveSettings = () => {
    toast.success("Configurações de pagamento salvas com sucesso!");
  };

  const handleSavePagarmeSettings = () => {
    toast.success("Configurações do Pagarme salvas com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Transações
          </TabsTrigger>
          <TabsTrigger value="pagarme-transactions" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Pagarme
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Gateway Padrão
          </TabsTrigger>
          <TabsTrigger value="pagarme" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Configurações Pagarme
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <TransactionsTab
            filteredTransactions={filteredTransactions}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            dateRange={dateRange}
            setDateRange={setDateRange}
            handleExportTransactions={handleExportTransactions}
            storedInvoices={storedInvoices}
            storeInvoice={storeInvoice}
            updateInvoiceStatus={updateInvoiceStatus}
          />
        </TabsContent>

        <TabsContent value="pagarme-transactions" className="space-y-6">
          <PaymentStats />
          <PaymentTransactionsList />
        </TabsContent>
        
        <TabsContent value="settings">
          <PaymentGatewaySettings onSave={handleSaveSettings} />
        </TabsContent>

        <TabsContent value="pagarme">
          <PagarmeSettings onSave={handleSavePagarmeSettings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentGateway;
