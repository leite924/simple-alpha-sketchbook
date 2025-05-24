
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface FinancialRow {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "canceled";
}

interface FinancialTableProps {
  data: FinancialRow[];
  type: "receivable" | "payable";
}

export const FinancialTable: React.FC<FinancialTableProps> = ({ data, type }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "overdue": return "bg-red-500";
      case "canceled": return "bg-gray-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead>Vencimento</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.description}</TableCell>
              <TableCell>
                R$ {row.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>{new Date(row.dueDate).toLocaleDateString('pt-BR')}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(row.status)}>
                  {row.status === 'paid' && 'Pago'}
                  {row.status === 'pending' && 'Pendente'}
                  {row.status === 'overdue' && 'Atrasado'}
                  {row.status === 'canceled' && 'Cancelado'}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              Nenhum registro encontrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

// Example data
export const receivablesMockData: FinancialRow[] = [
  { 
    id: "001", 
    description: "Pagamento curso de fotografia", 
    amount: 750, 
    dueDate: "2023-11-15", 
    status: "paid" 
  },
  { 
    id: "002", 
    description: "Inscrição workshop", 
    amount: 250, 
    dueDate: "2023-12-01", 
    status: "pending" 
  },
  { 
    id: "003", 
    description: "Curso avançado", 
    amount: 1200, 
    dueDate: "2023-10-10", 
    status: "overdue" 
  }
];

export const payablesMockData: FinancialRow[] = [
  { 
    id: "001", 
    description: "Aluguel estúdio", 
    amount: 2500, 
    dueDate: "2023-12-05", 
    status: "pending" 
  },
  { 
    id: "002", 
    description: "Conta de luz", 
    amount: 350, 
    dueDate: "2023-11-10", 
    status: "paid" 
  },
  { 
    id: "003", 
    description: "Material didático", 
    amount: 1800, 
    dueDate: "2023-11-20", 
    status: "pending" 
  }
];
