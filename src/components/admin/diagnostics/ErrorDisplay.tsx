
import React from 'react';

interface ErrorDisplayProps {
  moduleErrors: string[];
  jsErrors: string[];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ moduleErrors, jsErrors }) => {
  return (
    <>
      {moduleErrors.length > 0 && (
        <div className="mt-2">
          <p className="font-bold text-red-600">Erros de carregamento de módulos:</p>
          <ul className="list-disc pl-5 text-xs">
            {moduleErrors.map((error, index) => (
              <li key={`module-${index}`} className="break-all text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {jsErrors.length > 0 && (
        <div className="mt-2">
          <p className="font-bold">Erros JavaScript capturados:</p>
          <ul className="list-disc pl-5 text-xs">
            {jsErrors.map((error, index) => (
              <li key={`js-${index}`} className="break-all">{error}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ErrorDisplay;
