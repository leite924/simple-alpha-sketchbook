
import { PaymentTransaction } from "../../types";

interface PrintInvoiceProps {
  transaction: PaymentTransaction;
  invoiceNumber: string;
}

export const printInvoice = ({ transaction, invoiceNumber }: PrintInvoiceProps) => {
  // Abrindo uma nova janela para impressão
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error("Não foi possível abrir a janela de impressão");
  }
  
  // Formata a data atual no formato DD/MM/YYYY
  const formattedDate = new Date().toLocaleDateString('pt-BR');
  
  // Conteúdo HTML da nota fiscal
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Nota Fiscal de Serviço - ${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .invoice-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .logo { max-height: 80px; margin-bottom: 10px; }
          .title { font-size: 18px; font-weight: bold; margin: 10px 0; }
          .invoice-number { font-size: 16px; margin-bottom: 20px; }
          .info-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          table, th, td { border: 1px solid #ddd; }
          th, td { padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { font-size: 12px; text-align: center; margin-top: 30px; }
          .controls { margin-bottom: 20px; }
          @media print {
            .controls { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Fechar</button>
        </div>
        
        <div class="invoice-container">
          <div class="header">
            <img src="/lovable-uploads/d580b9f4-ed3f-44c5-baa5-e0a42dfcb768.png" alt="Logo da Escola Pernambucana de Fotografia" class="logo">
            <div class="title">NOTA FISCAL DE SERVIÇO ELETRÔNICA</div>
            <div class="invoice-number">${invoiceNumber}</div>
          </div>
          
          <div class="info-box">
            <div><strong>Data de Emissão:</strong> ${formattedDate}</div>
            <div><strong>Data de Vencimento:</strong> ${formattedDate}</div>
            <div><strong>Status:</strong> Emitida</div>
          </div>
          
          <div>
            <div class="title">PRESTADOR DE SERVIÇOS</div>
            <div><strong>Razão Social:</strong> Escola Pernambucana de Fotografia LTDA</div>
            <div><strong>CNPJ:</strong> XX.XXX.XXX/0001-XX</div>
            <div><strong>Endereço:</strong> Rua da Fotografia, 123 - Recife/PE</div>
          </div>
          
          <div style="margin-top: 20px;">
            <div class="title">TOMADOR DE SERVIÇOS</div>
            <div><strong>Nome/Razão Social:</strong> ${transaction.userName}</div>
            <div><strong>ID do Cliente:</strong> ${transaction.userId}</div>
          </div>
          
          <div style="margin-top: 20px;" class="title">DESCRIÇÃO DOS SERVIÇOS</div>
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Valor Unitário</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${transaction.description}</td>
                <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
                <td>1</td>
                <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-left: auto; width: 300px;">
            <table>
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</td>
              </tr>
              <tr>
                <td><strong>ISS (5%):</strong></td>
                <td>R$ ${(transaction.amount * 0.05).toFixed(2).replace('.', ',')}</td>
              </tr>
              <tr>
                <td><strong>Valor Total:</strong></td>
                <td><strong>R$ ${transaction.amount.toFixed(2).replace('.', ',')}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p>Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.</p>
            <p>Documento gerado eletronicamente. Emitido em ${formattedDate}.</p>
          </div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const generateInvoiceText = (transaction: PaymentTransaction, invoiceNumber: string): string => {
  const formattedDate = new Date().toLocaleDateString('pt-BR');
  return `
NOTA FISCAL DE SERVIÇO ELETRÔNICA
${invoiceNumber}

Data de Emissão: ${formattedDate}
Data de Vencimento: ${formattedDate}
Status: Emitida

PRESTADOR DE SERVIÇOS:
Razão Social: Escola Pernambucana de Fotografia LTDA
CNPJ: XX.XXX.XXX/0001-XX
Endereço: Rua da Fotografia, 123 - Recife/PE

TOMADOR DE SERVIÇOS:
Nome/Razão Social: ${transaction.userName}
ID do Cliente: ${transaction.userId}

DESCRIÇÃO DOS SERVIÇOS:
${transaction.description}
Valor: R$ ${transaction.amount.toFixed(2).replace('.', ',')}
Quantidade: 1
Valor Total: R$ ${transaction.amount.toFixed(2).replace('.', ',')}

Subtotal: R$ ${transaction.amount.toFixed(2).replace('.', ',')}
ISS (5%): R$ ${(transaction.amount * 0.05).toFixed(2).replace('.', ',')}
Valor Total: R$ ${transaction.amount.toFixed(2).replace('.', ',')}

Esta é uma Nota Fiscal de Serviço Eletrônica emitida de acordo com a Lei Complementar nº 116/2003.
Documento gerado eletronicamente. Emitido em ${formattedDate}.
`;
};
