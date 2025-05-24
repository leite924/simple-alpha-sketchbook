
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export interface RenderState {
  mainLayoutLoaded: boolean;
  adminAccessLoaded: boolean;
  adminTabsStarted: boolean;
  adminTabsLoaded: boolean;
}

interface RenderStateTrackerProps {
  renderState: RenderState;
}

const RenderStateTracker: React.FC<RenderStateTrackerProps> = ({ renderState }) => {
  return (
    <Card className="mb-4 border border-amber-500">
      <CardContent className="pt-4">
        <p className="text-sm text-amber-800">Estado atual do carregamento:</p>
        <ul className="text-xs space-y-1 mt-2">
          <li>MainLayout: {renderState.mainLayoutLoaded ? "✅" : "❌"}</li>
          <li>AdminAccess: {renderState.adminAccessLoaded ? "✅" : "❌"}</li>
          <li>AdminTabs iniciado: {renderState.adminTabsStarted ? "✅" : "❌"}</li>
          <li>AdminTabs carregado: {renderState.adminTabsLoaded ? "✅" : "❌"}</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default RenderStateTracker;
