
import { NFSeData } from "./types";

// Função para gerar o XML no formato ABRASF 2.0 para Recife
export const generateAbrasfXml = (data: NFSeData): string => {
  // Esta é uma simulação da geração de XML
  // Em um ambiente de produção, isso seria feito por uma biblioteca de geração de XML
  
  // Formata valor para o padrão brasileiro (vírgula como separador decimal)
  const valorFormatado = data.valor.toFixed(2).replace('.', ',');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<EnviarLoteRpsEnvio xmlns="http://www.abrasf.org.br/nfse.xsd">
  <LoteRps>
    <NumeroLote>${data.numeroLote}</NumeroLote>
    <CpfCnpj><Cnpj>${data.cnpj}</Cnpj></CpfCnpj>
    <InscricaoMunicipal>${data.inscricaoMunicipal}</InscricaoMunicipal>
    <QuantidadeRps>1</QuantidadeRps>
    <ListaRps>
      <Rps>
        <InfDeclaracaoPrestacaoServico Id="RPS${data.numeroLote}">
          <Servico>
            <Valores>
              <ValorServicos>${valorFormatado}</ValorServicos>
              <Aliquota>${data.servico.aliquota.toFixed(4).replace('.', ',')}</Aliquota>
            </Valores>
            <ItemListaServico>${data.servico.codigoTributacaoMunicipio}</ItemListaServico>
            <Discriminacao>${data.servico.descricao}</Discriminacao>
          </Servico>
          <Prestador>
            <CpfCnpj><Cnpj>${data.cnpj}</Cnpj></CpfCnpj>
            <InscricaoMunicipal>${data.inscricaoMunicipal}</InscricaoMunicipal>
          </Prestador>
          <Tomador>
            <RazaoSocial>${data.tomador.nome}</RazaoSocial>
            <CpfCnpj>
              ${data.tomador.cpf ? `<Cpf>${data.tomador.cpf}</Cpf>` : ''}
              ${data.tomador.cnpj ? `<Cnpj>${data.tomador.cnpj}</Cnpj>` : ''}
            </CpfCnpj>
            ${data.tomador.endereco ? `
            <Endereco>
              <Logradouro>${data.tomador.endereco.logradouro}</Logradouro>
              <Numero>${data.tomador.endereco.numero}</Numero>
              <Bairro>${data.tomador.endereco.bairro}</Bairro>
              <CodigoMunicipio>2611606</CodigoMunicipio>
              <Uf>${data.tomador.endereco.uf}</Uf>
              <Cep>${data.tomador.endereco.cep}</Cep>
            </Endereco>` : ''}
          </Tomador>
        </InfDeclaracaoPrestacaoServico>
      </Rps>
    </ListaRps>
  </LoteRps>
</EnviarLoteRpsEnvio>`;
};

// Função para criar um componente de visualização do XML
export const createXmlViewer = (xml: string): string => {
  // Format XML for display (adding indentation, etc.)
  let formattedXml = xml
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>")
    .replace(/\s\s/g, "&nbsp;&nbsp;");
  
  return `
    <div style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; max-height: 400px;">
      ${formattedXml}
    </div>
  `;
};
