
import React from 'react';

interface MountedComponentsProps {
  renderedComponents: string[];
}

const MountedComponents: React.FC<MountedComponentsProps> = ({ renderedComponents }) => {
  return (
    <div className="mt-2">
      <p className="font-bold">Componentes montados:</p>
      <ul className="list-disc pl-5">
        {renderedComponents.length > 0 ? 
          renderedComponents.map((comp, idx) => (
            <li key={idx}>{comp}</li>
          )) : 
          <li className="text-orange-500">Nenhum componente reportou montagem</li>
        }
      </ul>
    </div>
  );
};

export default MountedComponents;
