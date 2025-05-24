
import React from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ClassNavigation: React.FC = () => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <Link to="/classes" className="text-purple inline-flex items-center hover:text-purple-dark transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para todas as turmas
        </Link>
      </div>
    </div>
  );
};

export default ClassNavigation;
