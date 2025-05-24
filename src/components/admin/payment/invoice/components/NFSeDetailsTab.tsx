import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download, CheckCircle } from "lucide-react";
import { NFSeData } from "../types";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface NFSeDetailsTabProps {
  nfseData: NFSeData;
  onPrint?: () => void;
  onDownload?: () => void;
}

export const NFSeDetailsTab: React.FC<NFSeDetailsTabProps> = ({ 
  nfseData, 
  onPrint,
  onDownload 
}) => {
  const invoiceContentRef = useRef<HTMLDivElement>(null);
  const isGeneratingPDF = useRef<boolean>(false);
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    // If already generating PDF, prevent multiple clicks
    if (isGeneratingPDF.current) {
      toast.info("Aguarde, o PDF está sendo gerado...");
      return;
    }

    if (onDownload) {
      onDownload();
      return;
    }
    
    if (!invoiceContentRef.current) {
      toast.error("Não foi possível gerar o PDF");
      return;
    }

    const toastId = toast.loading("Gerando PDF...");
    isGeneratingPDF.current = true;
    
    try {
      const content = invoiceContentRef.current;
      
      // Optimize canvas generation with better settings
      const canvas = await html2canvas(content, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false, // Disable logging for better performance
      });
      
      // Use more efficient PDF generation approach
      const imgData = canvas.toDataURL('image/jpeg', 0.7); // Lower quality for better performance
      
      // Create PDF with specific version
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable compression
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight);
      
      // Use direct output for better performance
      pdf.save(`NFSe_${nfseData.numeroLote || Date.now()}.pdf`);
      
      toast.dismiss(toastId);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.dismiss(toastId);
      toast.error("Erro ao gerar PDF. Por favor, tente novamente.");
    } finally {
      isGeneratingPDF.current = false;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Informações da NFS-e</CardTitle>
        <CardDescription>Detalhes da nota fiscal eletrônica de serviço</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div ref={invoiceContentRef} className="invoice-content">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-sm">Prestador</h3>
              <p className="text-sm">CNPJ: {nfseData.cnpj}</p>
              <p className="text-sm">Inscrição Municipal: {nfseData.inscricaoMunicipal}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Tomador</h3>
              <p className="text-sm">Nome: {nfseData.tomador.nome}</p>
              {nfseData.tomador.cpf && <p className="text-sm">CPF: {nfseData.tomador.cpf}</p>}
              {nfseData.tomador.cnpj && <p className="text-sm">CNPJ: {nfseData.tomador.cnpj}</p>}
              {nfseData.tomador.endereco && (
                <p className="text-sm">
                  Endereço: {nfseData.tomador.endereco.logradouro}, {nfseData.tomador.endereco.numero} - {nfseData.tomador.endereco.bairro}, {nfseData.tomador.endereco.cidade}/{nfseData.tomador.endereco.uf}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium text-sm">Serviço</h3>
            <p className="text-sm">Descrição: {nfseData.servico.descricao}</p>
            <p className="text-sm">Código: {nfseData.servico.codigoTributacaoMunicipio}</p>
            <p className="text-sm">Alíquota: {(nfseData.servico.aliquota * 100).toFixed(2)}%</p>
            <div className="mt-2">
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Valor do Serviço:</span>
                <span className="font-medium">
                  R$ {nfseData.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">ISS ({(nfseData.servico.aliquota * 100).toFixed(2)}%):</span>
                <span>
                  R$ {(nfseData.valor * nfseData.servico.aliquota).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between border-t border-b py-2 my-2">
                <span className="font-medium">Valor Líquido:</span>
                <span className="font-medium">
                  R$ {(nfseData.valor * (1 - nfseData.servico.aliquota)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-sm text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Documento Fiscal Eletrônico</span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4 mr-1" />
            <span>Imprimir</span>
          </Button>
          <Button 
            size="sm" 
            variant="default"
            className="flex items-center gap-1"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4 mr-1" />
            <span>Baixar PDF</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
