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
  return useSupabaseData(async () => {
    console.log('getCourseBySlug not implemented, using placeholder');
    return Promise.resolve({ data: null, error: null });
  }, [slug]);
}

// Turmas
export function useClasses() {
  return useSupabaseData(() => SupabaseService.getClasses());
}

export function useClassesByCourse(courseId: string) {
  return useSupabaseData(async () => {
    console.log('getClassesByCourse not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [courseId]);
}

export function useClassById(id: string) {
  return useSupabaseData(() => SupabaseService.getClass(id), [id]);
}

// Cupons
export function useCoupons() {
  return useSupabaseData(async () => {
    console.log('getCoupons not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function useCouponByCode(code: string) {
  return useSupabaseData(() => SupabaseService.validateCoupon(code), [code]);
}

// Matrículas
export function useEnrollments() {
  return useSupabaseData(() => SupabaseService.getEnrollments());
}

export function useEnrollmentsByStudent(studentId: string) {
  return useSupabaseData(async () => {
    console.log('getEnrollmentsByStudent not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [studentId]);
}

// Categorias financeiras
export function useFinancialCategories() {
  return useSupabaseData(async () => {
    console.log('getFinancialCategories not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function useFinancialCategoriesByType(type: string) {
  return useSupabaseData(async () => {
    console.log('getFinancialCategoriesByType not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [type]);
}

// Contas a pagar
export function usePayables() {
  return useSupabaseData(async () => {
    console.log('getPayables not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function usePayablesByStatus(status: string) {
  return useSupabaseData(async () => {
    console.log('getPayablesByStatus not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [status]);
}

// Contas a receber
export function useReceivables() {
  return useSupabaseData(async () => {
    console.log('getReceivables not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function useReceivablesByStatus(status: string) {
  return useSupabaseData(async () => {
    console.log('getReceivablesByStatus not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [status]);
}

// Transações
export function useTransactions() {
  return useSupabaseData(() => SupabaseService.getTransactions());
}

// Perguntas de fotografia
export function usePhotographyQuestions() {
  return useSupabaseData(async () => {
    console.log('getPhotographyQuestions not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function usePhotographyQuestionsByCategory(category: string) {
  return useSupabaseData(async () => {
    console.log('getPhotographyQuestionsByCategory not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [category]);
}

export function usePhotographyQuestionsByDifficulty(difficulty: string) {
  return useSupabaseData(async () => {
    console.log('getPhotographyQuestionsByDifficulty not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [difficulty]);
}

// Pontuações de quiz
export function useQuizScores() {
  return useSupabaseData(async () => {
    console.log('getQuizScores not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  });
}

export function useQuizScoresByUser(userId: string) {
  return useSupabaseData(async () => {
    console.log('getQuizScoresByUser not implemented, using placeholder');
    return Promise.resolve({ data: [], error: null });
  }, [userId]);
}

// Estatísticas financeiras
export function useFinancialStats() {
  return useSupabaseData(async () => {
    console.log('getFinancialStats not implemented, using placeholder');
    return Promise.resolve({ data: null, error: null });
  });
}

// Configurações de IA
export function useAISettings() {
  return useSupabaseData(() => SupabaseService.getAISettings());
}
