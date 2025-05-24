
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Star } from "lucide-react";

const CertificatesTab = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Meus Certificados</h3>
      <p className="text-gray-600 mb-6">
        Os certificados ficam disponíveis após a conclusão dos cursos.
      </p>
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Fotografia Básica</h4>
              <p className="text-sm text-gray-600">Concluído em 01/09/2023</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" /> Favoritar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Ver certificado
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Fotografia de Paisagem</h4>
              <p className="text-sm text-gray-600">Concluído em 15/10/2023</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" /> Favoritar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Ver certificado
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default CertificatesTab;
