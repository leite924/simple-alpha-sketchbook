
import React, { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NFSeData } from "./types";
import { generateAbrasfXml } from "./xmlGenerator";
import { NFSeDialogHeader } from "./components/NFSeDialogHeader";
import { toast } from "sonner";

// Lazy load tabs for better performance
const NFSeDetailsTab = lazy(() => import("./components/NFSeDetailsTab").then(module => ({ default: module.NFSeDetailsTab })));
const NFSeXmlTab = lazy(() => import("./components/NFSeXmlTab").then(module => ({ default: module.NFSeXmlTab })));

const TabLoadingFallback = () => (
  <div className="p-4 space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

interface NFSeViewerProps {
  nfseData: NFSeData;
  protocol?: string;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const NFSeViewer: React.FC<NFSeViewerProps> = ({ 
  nfseData, 
  protocol,
  onPrint,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [xmlContent, setXmlContent] = useState<string>("");
  
  // Generate XML only when needed and tab is active to save resources
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "xml" && !xmlContent) {
      setXmlContent(generateAbrasfXml(nfseData));
    }
  };
  
  const handlePrintFallback = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };
  
  const handleDownloadFallback = () => {
    if (onDownload) {
      onDownload();
    } else {
      toast.info("Gerando PDF da NFS-e...");
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Visualizar NFS-e</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogDescription>
          Visualize e baixe a Nota Fiscal de Serviços Eletrônica
        </DialogDescription>
        <NFSeDialogHeader nfseData={nfseData} protocol={protocol} />
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="xml">XML (ABRASF 2.0)</TabsTrigger>
          </TabsList>
          
          <Suspense fallback={<TabLoadingFallback />}>
            <TabsContent value="details" className="mt-4">
              <NFSeDetailsTab 
                nfseData={nfseData} 
                onPrint={handlePrintFallback} 
                onDownload={handleDownloadFallback} 
              />
            </TabsContent>
            
            <TabsContent value="xml" className="mt-4">
              {activeTab === "xml" && <NFSeXmlTab xmlContent={xmlContent || generateAbrasfXml(nfseData)} />}
            </TabsContent>
          </Suspense>
        </Tabs>
        
        <DialogFooter>
          <p className="text-xs text-muted-foreground">
            Esta simulação demonstra a geração de XML no padrão ABRASF 2.0 para a Prefeitura do Recife.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
