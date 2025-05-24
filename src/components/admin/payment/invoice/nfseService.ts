
import { toast } from "sonner";
import { NFSeData, NFSeResponse } from "./types";
import { validateNFSeData, prepareNFSeRequest } from "./invoiceGenerationUtils";
import { generateAbrasfXml } from "./xmlGenerator";

export const mockSendToNFSeService = async (data: Record<string, any>): Promise<NFSeResponse> => {
  // Esta função simula o envio para o microserviço de NFS-e
  // Em produção, você substituiria isso por uma chamada real à API
  
  console.log("Simulando envio para o serviço de NFS-e da prefeitura:", data);
  
  // Simula um delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simula o XML que seria gerado
  const xmlData = generateAbrasfXml(data as NFSeData);
  console.log("XML gerado:", xmlData);
  
  // Simula a assinatura (em produção, usaria o certificado digital)
  console.log("Simulando assinatura digital do XML...");
  
  // Simula o envio SOAP
  console.log("Simulando envio SOAP para a prefeitura...");
  
  // 90% chance de sucesso para simular cenários reais
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    const protocol = Math.floor(1000000 + Math.random() * 9000000).toString();
    return {
      success: true,
      message: `NFS-e processada com sucesso. Protocolo: ${protocol}`,
      status: 'completed',
      protocol
    };
  } else {
    const errorMessages = [
      "Erro de validação no XML",
      "Certificado digital inválido ou expirado",
      "Serviço da prefeitura indisponível",
      "Erro na assinatura digital",
      "CNPJ não autorizado a emitir NFS-e"
    ];
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    return {
      success: false,
      message: `Falha ao processar NFS-e: ${randomError}`,
      status: 'failed'
    };
  }
};

export const generateNFSe = async (data: NFSeData): Promise<NFSeResponse> => {
  if (!validateNFSeData(data)) {
    return { success: false, message: "Validação de dados falhou", status: 'failed' };
  }
  
  try {
    const requestData = prepareNFSeRequest(data);
    
    // Atualiza o status para processando
    toast.loading("Processando NFS-e...", { id: "nfse-processing" });
    
    // Simula o processamento da NFS-e
    const result = await mockSendToNFSeService(requestData);
    
    toast.dismiss("nfse-processing");
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
    
    return result;
  } catch (error) {
    toast.dismiss("nfse-processing");
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    toast.error(`Erro ao gerar NFS-e: ${errorMessage}`);
    return { success: false, message: `Erro ao gerar NFS-e: ${errorMessage}`, status: 'failed' };
  }
};
