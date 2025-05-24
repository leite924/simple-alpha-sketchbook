
import { useState } from "react";
import { PaymentTransaction } from "@/components/admin/types";
import { mockTransactions } from "@/components/admin/mockData";

export const useTransactions = () => {
  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: 1,
      userName: "João Silva",
      description: "Matrícula - Curso de Fotografia Básica",
      amount: 299.90,
      date: new Date("2024-02-01"),
      status: "completed",
      paymentMethod: "Cartão de Crédito",
    },
    {
      id: 2,
      userName: "Maria Santos",
      description: "Matrícula - Workshop de Edição",
      amount: 150.00,
      date: new Date("2024-01-28"),
      status: "completed",
      paymentMethod: "PIX",
    },
    {
      id: 3,
      userName: "Carlos Oliveira",
      description: "Matrícula - Curso Avançado",
      amount: 599.00,
      date: new Date("2024-01-25"),
      status: "pending",
      paymentMethod: "Boleto",
    },
    {
      id: 4,
      userName: "Ana Costa",
      description: "Workshop de Iluminação",
      amount: 199.90,
      date: new Date("2024-01-20"),
      status: "failed",
      paymentMethod: "Cartão de Crédito",
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(transaction =>
    transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    transactions: filteredTransactions,
    searchTerm,
    setSearchTerm,
    totalTransactions: transactions.length
  };
};
