
import { z } from "zod";

// Form schema
export const formSchema = z.object({
  courseName: z.string().min(3, "Nome do curso é obrigatório"),
  courseId: z.string().optional(),
  courseSlug: z.string().optional(),
  image: z.string().url("URL de imagem inválida").optional().or(z.literal("")),
  month: z.string().optional(),
  year: z.string().optional(),
  period: z.string().min(1, "Período é obrigatório"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  days: z.string().min(1, "Dias da semana são obrigatórios"),
  time: z.string().optional(),
  location: z.string().optional(),
  spotsAvailable: z.number().min(0, "Vagas disponíveis não podem ser negativas"),
  availableSpots: z.number().min(0, "Vagas disponíveis não podem ser negativas"),
  totalSpots: z.number().min(1, "Total de vagas deve ser pelo menos 1"),
  price: z.string().min(1, "Preço é obrigatório"),
  instructor: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Export type from schema for TypeScript usage
export type ClassFormValues = z.infer<typeof formSchema>;
