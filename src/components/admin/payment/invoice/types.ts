
export interface NFSeData {
  numeroLote: string;
  cnpj: string;
  inscricaoMunicipal: string;
  valor: number;
  tomador: {
    nome: string;
    cpf?: string;
    cnpj?: string;
    endereco?: {
      logradouro: string;
      numero: string;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    }
  };
  servico: {
    descricao: string;
    codigoTributacaoMunicipio: string;
    aliquota: number;
  };
  status?: 'pending' | 'completed' | 'failed' | 'processing' | 'canceled';
}

export interface NFSeResponse {
  success: boolean;
  message: string;
  status: string;
  protocol?: string;
}
