
import { User, PaymentTransaction } from "./types";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastLogin: new Date("2024-02-01"),
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    role: "instructor",
    status: "active",
    createdAt: new Date("2024-01-20"),
    lastLogin: new Date("2024-01-30"),
  },
];

export const mockTransactions: PaymentTransaction[] = [
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
];
