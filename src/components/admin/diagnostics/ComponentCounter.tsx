
import React from 'react';
import type { ComponentCounts } from './useDiagnostics';

interface ComponentCounterProps {
  componentCounts: ComponentCounts;
}

const ComponentCounter: React.FC<ComponentCounterProps> = ({ componentCounts }) => {
  return (
    <div className="mt-2">
      <p className="font-bold">Componentes detectados:</p>
      <ul className="list-disc pl-5">
        {Object.entries(componentCounts).map(([component, count]) => (
          <li key={component}>{component}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default ComponentCounter;
