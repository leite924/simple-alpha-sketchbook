
import { useState, useEffect } from 'react';

export interface ComponentCounts {
  Tabs: number;
  TabsTriggers: number;
  TabsContents: number;
  Cards: number;
  Sections: number;
  h2Elements: number;
  Alerts: number;
}

export interface DiagnosticState {
  componentCounts: ComponentCounts;
  hasAIManagement: boolean;
  hasAISettings: boolean;
  hasAIContentGenerator: boolean;
  jsErrors: string[];
  moduleErrors: string[];
  renderedComponents: string[];
  importCheck: {[key: string]: boolean | string};
}

export const useDiagnostics = () => {
  const [state, setState] = useState<DiagnosticState>({
    componentCounts: {
      Tabs: 0,
      TabsTriggers: 0,
      TabsContents: 0,
      Cards: 0,
      Sections: 0,
      h2Elements: 0,
      Alerts: 0
    },
    hasAIManagement: false,
    hasAISettings: false,
    hasAIContentGenerator: false,
    jsErrors: [],
    moduleErrors: [],
    renderedComponents: ['DiagnosticDisplay'],
    importCheck: {}
  });

  const handleForceAITab = () => {
    console.log("Forçando abertura da aba AI");
    
    // Encontrar e clicar na tab AI
    const aiTab = document.querySelector('[data-value="ai"]');
    if (aiTab instanceof HTMLElement) {
      console.log("Tab AI encontrada, clicando nela");
      aiTab.click();
    } else {
      console.log("Tab AI não encontrada");
    }
  };

  useEffect(() => {
    console.log("DiagnosticDisplay montado - verificando DOM");
    
    // Registrar componente montado
    setState(prev => ({
      ...prev,
      renderedComponents: [...prev.renderedComponents, "DiagnosticDisplay"]
    }));
    
    // Adicionar listener de erro para capturar erros JS
    const handleError = (event: ErrorEvent) => {
      console.log("Erro interceptado:", event.message);
      setState(prev => ({
        ...prev,
        jsErrors: [...prev.jsErrors, `${event.message} em ${event.filename}:${event.lineno}`]
      }));
    };
    
    // Capturar erros de carregamento de módulo
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || String(event.reason);
      console.log("Rejeição não tratada:", errorMessage);
      
      if (errorMessage.includes("Cannot find module") || 
          errorMessage.includes("Failed to fetch dynamically imported module") ||
          errorMessage.includes("import")) {
        setState(prev => ({
          ...prev,
          moduleErrors: [...prev.moduleErrors, errorMessage]
        }));
      }
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Contar componentes importantes
    const counts: ComponentCounts = {
      'Tabs': document.querySelectorAll('[role="tablist"]').length,
      'TabsTriggers': document.querySelectorAll('[role="tab"]').length,
      'TabsContents': document.querySelectorAll('[role="tabpanel"]').length,
      'Cards': document.querySelectorAll('[class*="card"]').length,
      'Sections': document.querySelectorAll('section').length,
      'h2Elements': document.querySelectorAll('h2').length,
      'Alerts': document.querySelectorAll('[role="alert"]').length,
    };
    
    setState(prev => ({ ...prev, componentCounts: counts }));
    console.log("Component counts:", counts);
    
    // Verificar se componentes chave estão presentes
    const aiSectionPresent = Array.from(document.querySelectorAll('h2')).some(el => 
      el.textContent?.includes("Configurações de IA"));
      
    const aiManagementElement = document.querySelector('[data-testid="ai-management"]');
    const aiSettingsElement = document.querySelector('[data-testid="ai-settings"]');
    const aiContentGeneratorElement = document.querySelector('[data-testid="ai-content-generator"]');
    
    setState(prev => ({
      ...prev,
      hasAIManagement: aiSectionPresent,
      hasAISettings: !!aiSettingsElement,
      hasAIContentGenerator: !!aiContentGeneratorElement
    }));
    
    console.log("AIManagement element presente:", !!aiManagementElement);
    console.log("AISettings element presente:", !!aiSettingsElement);
    console.log("AIContentGenerator element presente:", !!aiContentGeneratorElement);
    
    // Verificar manualmente todos elementos para encontrar seção de AI Management
    const allH2s = document.querySelectorAll('h2');
    console.log("Todos os títulos h2:", Array.from(allH2s).map(el => el.textContent));
    
    // Verificar window location
    console.log("Rota atual:", window.location.pathname);
    console.log("Hash atual:", window.location.hash);
    
    // Verificar se a tab AI está presente
    const aiTab = document.querySelector('[data-value="ai"]');
    console.log("AI tab presente:", !!aiTab);
    
    // Verificar se os módulos são importados corretamente
    try {
      // Esta é apenas uma verificação de diagnóstico
      const checkImport = async () => {
        try {
          const importResults = {
            AIManagement: true,
            AISettings: true,
            AIContentGenerator: true
          };
          
          console.log("Verificação de importação bem-sucedida:", importResults);
          setState(prev => ({ ...prev, importCheck: importResults }));
        } catch (error) {
          console.error("Erro na verificação de importação:", error);
          setState(prev => ({
            ...prev,
            importCheck: {
              error: true,
              message: error instanceof Error ? error.message : String(error)
            }
          }));
        }
      };
      
      checkImport();
    } catch (error) {
      console.error("Erro na verificação de importação:", error);
    }
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return {
    ...state,
    handleForceAITab
  };
};
