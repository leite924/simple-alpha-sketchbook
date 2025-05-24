
import { useState, useEffect, useCallback } from "react";

export const useAdminTabs = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    try {
      console.log("useAdminTabs hook inicializando");
      setIsClient(true);
      
      // Define as abas permitidas explicitamente incluindo finance
      const allowedTabs = [
        "dashboard", 
        "users", 
        "courses", 
        "classes", 
        "blog", 
        "ai", 
        "finance",
        "payments"
      ];
      
      // Obtem o hash da URL ou usa o padrão
      const hashValue = window.location.hash.substring(1);
      console.log("Valor atual do hash:", hashValue || "(nenhum)");
      
      if (hashValue && allowedTabs.includes(hashValue)) {
        console.log(`Definindo aba ativa para ${hashValue} do hash`);
        setActiveTab(hashValue);
        
        // Força verificação de visibilidade do conteúdo da aba
        setTimeout(() => {
          const activeTabContent = document.querySelector(`[data-value="${hashValue}"]`);
          console.log(`Conteúdo da aba ${hashValue} encontrado:`, !!activeTabContent);
          
          // Adicionar verificação adicional
          const activeTabState = document.querySelector(`[data-state="active"]`);
          console.log("Elemento ativo:", activeTabState?.getAttribute('value'));
          
          if (!activeTabContent) {
            console.log(`Forçando atualização de hash para aba: ${hashValue}`);
            // Forçar redefinição da aba ativa
            setActiveTab(hashValue);
          }
        }, 300);
      } else {
        console.log("Usando dashboard como aba padrão");
        // Se estamos na rota /admin#finance mas o hashValue não está na lista, forçar para finance
        if (window.location.pathname === "/admin" && window.location.hash === "#finance") {
          setActiveTab("finance");
          window.location.hash = "finance";
        } else if (!hashValue) {
          window.location.hash = "dashboard";
        }
      }
      
      // Adiciona listener para mudança de hash
      const handleHashChange = () => {
        const newHash = window.location.hash.substring(1);
        if (newHash && allowedTabs.includes(newHash)) {
          console.log(`Hash mudou para: ${newHash}`);
          setActiveTab(newHash);
          
          // Verificação adicional para ativação da aba
          setTimeout(() => {
            const tabElement = document.querySelector(`[role="tab"][data-state="active"]`);
            console.log(`Aba ativa após mudança de hash:`, tabElement?.textContent);
          }, 100);
        }
      };
      
      window.addEventListener('hashchange', handleHashChange);
      return () => {
        window.removeEventListener('hashchange', handleHashChange);
      };
    } catch (error) {
      console.error("Erro no hook useAdminTabs:", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Erro desconhecido ocorreu");
    }
  }, []);

  // Handle tab change com useCallback
  const handleTabChange = useCallback((value: string) => {
    console.log(`Aba mudou para: ${value}`);
    setActiveTab(value);
    
    // Atualiza o hash da URL
    if (window.location.hash.substring(1) !== value) {
      window.location.hash = value;
    }
  }, []);

  return {
    activeTab,
    hasError,
    errorMessage,
    isClient,
    handleTabChange
  };
};
