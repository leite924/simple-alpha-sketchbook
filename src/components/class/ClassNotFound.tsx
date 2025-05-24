
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const ClassNotFound: React.FC = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="heading-lg mb-4">Turma não encontrada</h1>
        <p className="text-gray-600 mb-6">A turma que você está procurando não existe ou foi removida.</p>
        <Button asChild>
          <Link to="/classes">Ver todas as turmas</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default ClassNotFound;
