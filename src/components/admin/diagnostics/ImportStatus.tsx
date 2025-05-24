
import React from 'react';

interface ImportStatusProps {
  importCheck: {[key: string]: boolean | string};
}

const ImportStatus: React.FC<ImportStatusProps> = ({ importCheck }) => {
  return (
    <div className="mt-4">
      <p className="font-bold">Verificação de importação:</p>
      <pre className="bg-gray-800 text-white p-2 rounded text-xs mt-1 overflow-auto">
        {JSON.stringify(importCheck, null, 2)}
      </pre>
    </div>
  );
};

export default ImportStatus;
