import { useState, useEffect, useCallback } from 'react';
import SupabaseService from '@/services/supabase.service';

// Hook genérico para buscar dados do Supabase
export function useSupabaseData<T>(
  fetchFunction: () => Promise<{ data: T | null; error: any }>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchFunction();
      if (error) {
        setError(error);
        setData(null);
      } else {
        setData(data);
        setError(null);
      }
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData };
}

// Hooks específicos para entidades comuns

// Cursos
export function useCourses() {
  return useSupabaseData(() => SupabaseService.getCourses());
}

export function useCourseBySlug(slug: string) {
  return useSupabaseData(() => SupabaseService.getCourseBySlug(slug), [slug]);
}

// Turmas
export function useClasses() {
  return useSupabaseData(() => SupabaseService.getClasses());
}

export function useClassesByCourse(courseId: string) {
  return useSupabaseData(() => SupabaseService.getClassesByCourse(courseId), [courseId]);
}

export function useClassById(id: string) {
  return useSupabaseData(() => SupabaseService.getClassById(id), [id]);
}

// Cupons
export function useCoupons() {
  return useSupabaseData(() => SupabaseService.getCoupons());
}

export function useCouponByCode(code: string) {
  return useSupabaseData(() => SupabaseService.getCouponByCode(code), [code]);
}

// Matrículas
export function useEnrollments() {
  return useSupabaseData(() => SupabaseService.getEnrollments());
}

export function useEnrollmentsByStudent(studentId: string) {
  return useSupabaseData(() => SupabaseService.getEnrollmentsByStudent(studentId), [studentId]);
}

// Categorias financeiras
export function useFinancialCategories() {
  return useSupabaseData(() => SupabaseService.getFinancialCategories());
}

export function useFinancialCategoriesByType(type: string) {
  return useSupabaseData(() => SupabaseService.getFinancialCategoriesByType(type), [type]);
}

// Contas a pagar
export function usePayables() {
  return useSupabaseData(() => SupabaseService.getPayables());
}

export function usePayablesByStatus(status: string) {
  return useSupabaseData(() => SupabaseService.getPayablesByStatus(status), [status]);
}

// Contas a receber
export function useReceivables() {
  return useSupabaseData(() => SupabaseService.getReceivables());
}

export function useReceivablesByStatus(status: string) {
  return useSupabaseData(() => SupabaseService.getReceivablesByStatus(status), [status]);
}

// Transações
export function useTransactions() {
  return useSupabaseData(() => SupabaseService.getTransactions());
}

// Perguntas de fotografia
export function usePhotographyQuestions() {
  return useSupabaseData(() => SupabaseService.getPhotographyQuestions());
}

export function usePhotographyQuestionsByCategory(category: string) {
  return useSupabaseData(() => SupabaseService.getPhotographyQuestionsByCategory(category), [category]);
}

export function usePhotographyQuestionsByDifficulty(difficulty: string) {
  return useSupabaseData(() => SupabaseService.getPhotographyQuestionsByDifficulty(difficulty), [difficulty]);
}

// Pontuações de quiz
export function useQuizScores() {
  return useSupabaseData(() => SupabaseService.getQuizScores());
}

export function useQuizScoresByUser(userId: string) {
  return useSupabaseData(() => SupabaseService.getQuizScoresByUser(userId), [userId]);
}

// Estatísticas financeiras
export function useFinancialStats() {
  return useSupabaseData(() => SupabaseService.getFinancialStats());
}

// Configurações de IA
export function useAISettings() {
  return useSupabaseData(() => SupabaseService.getAISettings());
}
