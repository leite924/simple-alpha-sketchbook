
import React, { useEffect } from "react";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useAdminTabs } from "./tabs/useAdminTabs";
import { TabTriggers } from "./tabs/TabTriggers";
import TabHeaders from "./tabs/TabHeaders";
import { TabContents } from "./tabs/TabContents";
import ErrorAlert from "./tabs/ErrorAlert";

interface AdminTabsProps {
  userRole?: string;
  showDiagnostics?: boolean;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ userRole = "", showDiagnostics = false }) => {
  // Debug logs para identificação de problemas
  useEffect(() => {
    console.log("AdminTabs montado com props:", { userRole, showDiagnostics });
    
    // Verificar renderização do DOM
    setTimeout(() => {
      const tabElements = document.querySelectorAll('[role="tablist"] [role="tab"]');
      console.log("Elementos de abas encontrados:", tabElements.length);
      
      const tabContentElements = document.querySelectorAll('[data-state="inactive"], [data-state="active"]');
      console.log("Elementos de conteúdo de abas encontrados:", tabContentElements.length);
      
      const financeContent = document.querySelector('[data-value="finance"]');
      console.log("Elemento de conteúdo financeiro presente:", !!financeContent);
      
      // Log da rota atual para verificar se está em hash "#finance"
      console.log("URL hash atual:", window.location.hash);
    }, 300);
  }, [userRole, showDiagnostics]);
  
  const {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  } = useAdminTabs();

  if (!isClient) {
    return <div className="p-4 text-center">Carregando interface de administração...</div>;
  }

  return (
    <>
      {hasError && <ErrorAlert message={errorMessage} />}
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        defaultValue={activeTab}
        className="w-full"
      >
        <TabsList className="mb-4 w-full flex flex-wrap gap-1">
          <TabTriggers userRole={userRole} />
        </TabsList>
        
        <Card>
          <TabHeaders />
          <TabContents userRole={userRole} showDiagnostics={showDiagnostics} />
        </Card>
      </Tabs>
    </>
  );
};

export default AdminTabs;
