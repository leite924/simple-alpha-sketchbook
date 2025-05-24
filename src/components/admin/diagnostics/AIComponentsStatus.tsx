
import React from 'react';
import { Button } from "@/components/ui/button";

interface AIComponentsStatusProps {
  hasAIManagement: boolean;
  hasAISettings: boolean;
  hasAIContentGenerator: boolean;
  onForceAITab: () => void;
}

const AIComponentsStatus: React.FC<AIComponentsStatusProps> = ({ 
  hasAIManagement, 
  hasAISettings, 
  hasAIContentGenerator,
  onForceAITab
}) => {
  return (
    <div className="mt-2">
      <p className="font-bold">Status dos componentes de IA:</p>
      <ul className="list-disc pl-5">
        <li>Seção AIManagement: {hasAIManagement ? "✅ Presente" : "❌ NÃO detectada"}</li>
        <li>Componente AISettings: {hasAISettings ? "✅ Presente" : "❌ NÃO detectado"}</li>
        <li>Componente AIContentGenerator: {hasAIContentGenerator ? "✅ Presente" : "❌ NÃO detectado"}</li>
      </ul>
      <Button 
        variant="destructive"
        size="sm"
        className="mt-2"
        onClick={onForceAITab}
      >
        Forçar abertura da aba AI
      </Button>
    </div>
  );
};

export default AIComponentsStatus;
