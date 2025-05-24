
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Star } from "lucide-react";

const MaterialsTab = () => {
  return (
    <>
      <h3 className="text-xl font-bold mb-4">Materiais de Estudo</h3>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Apostila - Fundamentos da Fotografia</h4>
              <p className="text-sm text-gray-600">PDF - 15MB</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" /> Favoritar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Slides - Composição Fotográfica</h4>
              <p className="text-sm text-gray-600">PDF - 8MB</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" /> Favoritar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">E-book - Guia de Iluminação</h4>
              <p className="text-sm text-gray-600">PDF - 12MB</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" /> Favoritar
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-1" /> Download
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default MaterialsTab;
