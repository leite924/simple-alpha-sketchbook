
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { NFSeForm } from "@/components/admin/payment/invoice/NFSeForm";
import { NFSeViewer } from "@/components/admin/payment/invoice/NFSeViewer";
import { NFSeData } from "@/components/admin/payment/invoice/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { toast } from "sonner";

const NFSeTest = () => {
  const [generatedNFSe, setGeneratedNFSe] = useState<NFSeData | null>(null);
  const [nfseResponse, setNfseResponse] = useState<{
    success: boolean;
    message: string;
    status: string;
    protocol?: string;
  } | null>(null);

  const handleNFSeGenerated = (data: NFSeData, response: any) => {
    setGeneratedNFSe(data);
    setNfseResponse(response);
  };

  // We'll now skip this function since the PDF is generated directly in the NFSeViewer
  const handlePrint = () => {
    window.print();
  };

  // We'll now skip this function since the PDF is generated directly in the NFSeViewer
  const handleDownload = () => {
    // Este método é apenas um fallback e não será usado já que o download de PDF
    // é implementado diretamente no NFSeViewer
    toast.info("Gerando PDF da NFS-e...");
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sistema de Emissão de NFS-e</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Ambiente de Simulação</AlertTitle>
          <AlertDescription>
            Este é um ambiente para testar a emissão de notas fiscais eletrônicas no padrão ABRASF 2.0 para a Prefeitura do Recife.
            Em um ambiente de produção, o sistema se conectaria com um microserviço Node.js para processamento, assinatura digital e comunicação SOAP.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <NFSeForm onNFSeGenerated={handleNFSeGenerated} />
          </div>
          
          <div>
            <Tabs defaultValue="result">
              <TabsList className="mb-4">
                <TabsTrigger value="result">Resultado</TabsTrigger>
                <TabsTrigger value="about">Sobre o Sistema</TabsTrigger>
              </TabsList>
              
              <TabsContent value="result">
                {generatedNFSe ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <h2 className="text-xl font-bold mb-2">NFS-e Gerada</h2>
                        <p className="text-sm text-gray-500">
                          Status: {nfseResponse?.success ? 'Processada com sucesso' : 'Erro no processamento'}
                        </p>
                        {nfseResponse?.message && (
                          <p className="text-sm mt-2">
                            Mensagem: {nfseResponse.message}
                          </p>
                        )}
                      </div>
                      
                      <NFSeViewer 
                        nfseData={generatedNFSe}
                        protocol={nfseResponse?.protocol}
                        onPrint={handlePrint}
                        onDownload={handleDownload}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[300px] text-center">
                      <Info className="h-12 w-12 text-gray-300 mb-4" />
                      <h3 className="text-xl font-medium mb-2">Nenhuma NFS-e gerada</h3>
                      <p className="text-gray-500">
                        Preencha o formulário ao lado para gerar uma NFS-e de teste
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="about">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Sobre o Sistema de NFS-e</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">Padrão ABRASF 2.0</h3>
                        <p className="text-sm text-gray-600">
                          Este sistema simula a geração de Notas Fiscais de Serviço Eletrônicas seguindo o padrão ABRASF 2.0,
                          que é o formato adotado pela Prefeitura do Recife e diversas outras cidades brasileiras.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Processo Completo</h3>
                        <p className="text-sm text-gray-600">
                          Em um ambiente de produção, o processo completo inclui:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                          <li>Geração do XML no formato ABRASF</li>
                          <li>Assinatura digital com certificado A1</li>
                          <li>Envio via protocolo SOAP para o webservice da Prefeitura</li>
                          <li>Recebimento e processamento da resposta</li>
                          <li>Armazenamento do protocolo e dados da NFS-e</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium">Implementação Real</h3>
                        <p className="text-sm text-gray-600">
                          Para uma implementação real, seria necessário desenvolver um microserviço em Node.js
                          com as bibliotecas apropriadas para assinatura digital (xml-crypto, node-forge)
                          e comunicação SOAP (soap, strong-soap), além de gerenciar certificados digitais de forma segura.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NFSeTest;
