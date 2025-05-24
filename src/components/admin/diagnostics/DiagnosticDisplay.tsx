
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDiagnostics } from './useDiagnostics';
import AIComponentsStatus from './AIComponentsStatus';
import ComponentCounter from './ComponentCounter';
import ImportStatus from './ImportStatus';
import ErrorDisplay from './ErrorDisplay';
import MountedComponents from './MountedComponents';

const DiagnosticDisplay = () => {
  const {
    componentCounts,
    hasAIManagement,
    hasAISettings,
    hasAIContentGenerator,
    jsErrors,
    moduleErrors,
    renderedComponents,
    importCheck,
    handleForceAITab
  } = useDiagnostics();
  
  return (
    <Card className="mt-4 mb-4 border-2 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-500">Diagnóstico da Página</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-bold">Este componente de diagnóstico está ativo para ajudar a depurar problemas.</p>
            <p>Você está na rota: {window.location.pathname}</p>
            <p>Hash: {window.location.hash || "(nenhum)"}</p>
            <p>Data/Hora: {new Date().toLocaleString()}</p>
            
            <MountedComponents renderedComponents={renderedComponents} />
            <ComponentCounter componentCounts={componentCounts} />
            <AIComponentsStatus 
              hasAIManagement={hasAIManagement}
              hasAISettings={hasAISettings}
              hasAIContentGenerator={hasAIContentGenerator}
              onForceAITab={handleForceAITab}
            />
            <ImportStatus importCheck={importCheck} />
            <ErrorDisplay moduleErrors={moduleErrors} jsErrors={jsErrors} />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default DiagnosticDisplay;
