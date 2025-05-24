
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Upload } from "lucide-react";
import { toast } from "sonner";

interface NFSeXmlTabProps {
  xmlContent: string;
}

export const NFSeXmlTab: React.FC<NFSeXmlTabProps> = ({ xmlContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleXmlFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  const processXmlFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const xmlContent = event.target?.result as string;
          // Here you would typically parse the XML and process it
          // For demo purposes, we'll just show a success message
          toast.success("XML importado com sucesso");
          console.log("XML Content:", xmlContent);
          // Reset the file input
          if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
          toast.error("Erro ao processar o arquivo XML");
          console.error("Error processing XML:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Code className="h-5 w-5" />
          <span>XML ABRASF 2.0</span>
        </CardTitle>
        <CardDescription>
          Formato XML para envio à Prefeitura do Recife (padrão ABRASF 2.0)
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-slate-50 p-4 rounded-md border overflow-auto max-h-[300px]">
          <pre className="text-xs whitespace-pre-wrap font-mono">{xmlContent}</pre>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Você também pode importar seu próprio arquivo XML:</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleXmlFileUpload}>
              <Upload className="h-4 w-4 mr-1" />
              Importar XML
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={processXmlFile}
              accept=".xml"
              className="hidden"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => {
          navigator.clipboard.writeText(xmlContent);
          toast.success("XML copiado para a área de transferência");
        }}>
          Copiar XML
        </Button>
      </CardFooter>
    </Card>
  );
};
