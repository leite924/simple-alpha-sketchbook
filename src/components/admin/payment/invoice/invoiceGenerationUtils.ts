
import { toast } from "sonner";
import { NFSeData, NFSeResponse } from "./types";

export const generateInvoiceNumber = (): string => {
  const prefix = "NFS-";
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${year}-${randomDigits}`;
};

export const validateNFSeData = (data: Partial<NFSeData>): boolean => {
  // Verificações básicas dos campos obrigatórios
  if (!data.cnpj || !data.inscricaoMunicipal || !data.valor || !data.tomador?.nome) {
    toast.error("Dados insuficientes para geração da NFS-e");
    return false;
  }
  
  // Validação do documento do tomador (CPF ou CNPJ)
  if (!data.tomador.cpf && !data.tomador.cnpj) {
    toast.error("O tomador deve possuir CPF ou CNPJ");
    return false;
  }

  // Validação do serviço
  if (!data.servico?.descricao || !data.servico?.codigoTributacaoMunicipio) {
    toast.error("Informações do serviço incompletas");
    return false;
  }
  
  return true;
};

export const prepareNFSeRequest = (data: NFSeData): Record<string, any> => {
  // Esta função simula a preparação dos dados para envio ao microserviço
  // Em um ambiente real, isso seria enviado para a API do microserviço Node.js
  
  return {
    numeroLote: data.numeroLote || generateInvoiceNumber().replace('NFS-', ''),
    cnpj: data.cnpj,
    im: data.inscricaoMunicipal,
    valor: data.valor,
    tomador: {
      nome: data.tomador.nome,
      cpf: data.tomador.cpf,
      cnpj: data.tomador.cnpj,
      endereco: data.tomador.endereco,
    },
    servico: {
      descricao: data.servico.descricao,
      codigo: data.servico.codigoTributacaoMunicipio,
      aliquota: data.servico.aliquota,
    }
  };
};
