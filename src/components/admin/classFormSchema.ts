
import { z } from "zod";

// Form schema
export const formSchema = z.object({
  courseName: z.string().min(3, "Nome do curso é obrigatório"),
  courseSlug: z.string().min(3, "Slug é obrigatório"),
  image: z.string().url("URL de imagem inválida"),
  month: z.string().min(1, "Mês é obrigatório"),
  year: z.string().min(4, "Ano é obrigatório"),
  period: z.string().min(1, "Período é obrigatório"),
  startDate: z.date({ required_error: "Data de início é obrigatória" }),
  endDate: z.date({ required_error: "Data de término é obrigatória" }),
  days: z.string().min(1, "Dias da semana são obrigatórios"),
  time: z.string().min(1, "Horário é obrigatório"),
  location: z.string().min(1, "Local é obrigatório"),
  spotsAvailable: z.number().min(0, "Vagas disponíveis não podem ser negativas"),
  totalSpots: z.number().min(1, "Total de vagas deve ser pelo menos 1"),
  price: z.string().min(1, "Preço é obrigatório"),
  instructor: z.string().min(1, "Nome do instrutor é obrigatório"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

// Export type from schema for TypeScript usage
export type ClassFormValues = z.infer<typeof formSchema>;
