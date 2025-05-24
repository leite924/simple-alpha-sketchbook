
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CoursesTab = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Meus Cursos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-bold mb-2">Fotografia Básica</h4>
          <p className="text-sm text-gray-600 mb-2">Turma: Agosto 2023 - Noturno</p>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-purple rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <Button variant="outline" className="w-full">Ver detalhes</Button>
        </Card>
        
        <Card className="p-6">
          <h4 className="font-bold mb-2">Fotografia de Retrato</h4>
          <p className="text-sm text-gray-600 mb-2">Turma: Setembro 2023 - Noturno</p>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Progresso</span>
              <span>30%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-full bg-purple rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>
          <Button variant="outline" className="w-full">Ver detalhes</Button>
        </Card>
      </div>
    </>
  );
};

export default CoursesTab;
