
import React, { useEffect } from 'react';
// Importações explícitas com caminhos absolutos para evitar problemas
import AISettings from "@/components/admin/ai/settings/AISettings";
import AIContentGenerator from "@/components/admin/ai/content-generator/AIContentGenerator";

const AIManagement = () => {
  useEffect(() => {
    console.log("AIManagement component montado", new Date().toISOString());
    
    // Verificar se os componentes existem no DOM após a renderização
    setTimeout(() => {
      const settingsElement = document.querySelector('[data-testid="ai-settings"]');
      const generatorElement = document.querySelector('[data-testid="ai-content-generator"]');
      
      console.log("Verificação do DOM para AI components:", {
        "AISettings encontrado": !!settingsElement,
        "AIContentGenerator encontrado": !!generatorElement
      });
    }, 500);
  }, []);

  return (
    <div className="space-y-8" data-testid="ai-management">
      <section>
        <h2 className="text-xl font-semibold mb-4">Configurações de IA</h2>
        <AISettings />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Gerador de Conteúdo</h2>
        <AIContentGenerator />
      </section>
    </div>
  );
};

export default AIManagement;
