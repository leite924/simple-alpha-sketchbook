import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Tipos para facilitar o uso
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T];

// Classe de serviço para o Supabase
export class SupabaseService {
  // Autenticação
  static async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  static async signUp(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  static async signOut() {
    return await supabase.auth.signOut();
  }

  static async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email);
  }

  static async getCurrentUser() {
    return await supabase.auth.getUser();
  }

  static async getSession() {
    return await supabase.auth.getSession();
  }

  // Perfil de usuário
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .rpc('get_user_profile', { p_user_id: userId });
    
    return { data, error };
  }

  static async updateUserProfile(
    userId: string,
    firstName: string,
    lastName: string,
    cpf: string,
    birthDate: string,
    phone: string,
    address: string,
    addressNumber: string,
    addressComplement: string,
    neighborhood: string,
    city: string,
    state: string,
    postalCode: string
  ) {
    const { data, error } = await supabase
      .rpc('update_user_profile', {
        p_user_id: userId,
        p_first_name: firstName,
        p_last_name: lastName,
        p_cpf: cpf,
        p_birth_date: birthDate,
        p_phone: phone,
        p_address: address,
        p_address_number: addressNumber,
        p_address_complement: addressComplement,
        p_neighborhood: neighborhood,
        p_city: city,
        p_state: state,
        p_postal_code: postalCode
      });
    
    return { data, error };
  }

  // Papéis de usuário
  static async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .rpc('get_user_roles', { p_user_id: userId });
    
    return { data, error };
  }

  static async hasRole(userId: string, role: Enums<'user_role'>) {
    const { data, error } = await supabase
      .rpc('has_role', { user_id: userId, role });
    
    return { data, error };
  }

  // Cursos
  static async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('name');
    
    return { data, error };
  }

  static async getCourseBySlug(slug: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();
    
    return { data, error };
  }

  static async createCourse(course: TablesInsert<'courses'>) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateCourse(id: string, course: TablesUpdate<'courses'>) {
    const { data, error } = await supabase
      .from('courses')
      .update(course)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  static async deleteCourse(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // Classes (Turmas)
  static async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*, courses(*)');
    
    return { data, error };
  }

  static async getClassesByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('course_id', courseId);
    
    return { data, error };
  }

  static async getClassById(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*, courses(*)')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  static async createClass(classData: TablesInsert<'classes'>) {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateClass(id: string, classData: TablesUpdate<'classes'>) {
    const { data, error } = await supabase
      .from('classes')
      .update(classData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  static async deleteClass(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // Cupons de desconto
  static async getCoupons() {
    const { data, error } = await supabase
      .from('discount_coupons')
      .select('*, courses(*)');
    
    return { data, error };
  }

  static async getCouponByCode(code: string) {
    const { data, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', code)
      .single();
    
    return { data, error };
  }

  static async isCouponValid(couponId: string) {
    const { data, error } = await supabase
      .rpc('is_coupon_valid', { coupon_id: couponId });
    
    return { data, error };
  }

  static async createCoupon(coupon: TablesInsert<'discount_coupons'>) {
    const { data, error } = await supabase
      .from('discount_coupons')
      .insert(coupon)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateCoupon(id: string, coupon: TablesUpdate<'discount_coupons'>) {
    const { data, error } = await supabase
      .from('discount_coupons')
      .update(coupon)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  static async deleteCoupon(id: string) {
    const { error } = await supabase
      .from('discount_coupons')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  // Matrículas
  static async getEnrollments() {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .select('*, classes(*), discount_coupons(*)');
    
    return { data, error };
  }

  static async getEnrollmentsByStudent(studentId: string) {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .select('*, classes(*), discount_coupons(*)')
      .eq('student_id', studentId);
    
    return { data, error };
  }

  static async createEnrollment(enrollment: TablesInsert<'manual_enrollments'>) {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .insert(enrollment)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateEnrollment(id: string, enrollment: TablesUpdate<'manual_enrollments'>) {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .update(enrollment)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  // Categorias financeiras
  static async getFinancialCategories() {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .order('name');
    
    return { data, error };
  }

  static async getFinancialCategoriesByType(type: string) {
    const { data, error } = await supabase
      .from('financial_categories')
      .select('*')
      .eq('type', type)
      .order('name');
    
    return { data, error };
  }

  static async createFinancialCategory(category: TablesInsert<'financial_categories'>) {
    const { data, error } = await supabase
      .from('financial_categories')
      .insert(category)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateFinancialCategory(id: string, category: TablesUpdate<'financial_categories'>) {
    const { data, error } = await supabase
      .from('financial_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  // Contas a pagar
  static async getPayables() {
    const { data, error } = await supabase
      .from('payables')
      .select('*, financial_categories(*)');
    
    return { data, error };
  }

  static async getPayablesByStatus(status: string) {
    const { data, error } = await supabase
      .from('payables')
      .select('*, financial_categories(*)')
      .eq('status', status);
    
    return { data, error };
  }

  static async createPayable(payable: TablesInsert<'payables'>) {
    const { data, error } = await supabase
      .from('payables')
      .insert(payable)
      .select()
      .single();
    
    return { data, error };
  }

  static async updatePayable(id: string, payable: TablesUpdate<'payables'>) {
    const { data, error } = await supabase
      .from('payables')
      .update(payable)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  // Contas a receber
  static async getReceivables() {
    const { data, error } = await supabase
      .from('receivables')
      .select('*, financial_categories(*)');
    
    return { data, error };
  }

  static async getReceivablesByStatus(status: string) {
    const { data, error } = await supabase
      .from('receivables')
      .select('*, financial_categories(*)')
      .eq('status', status);
    
    return { data, error };
  }

  static async createReceivable(receivable: TablesInsert<'receivables'>) {
    const { data, error } = await supabase
      .from('receivables')
      .insert(receivable)
      .select()
      .single();
    
    return { data, error };
  }

  static async updateReceivable(id: string, receivable: TablesUpdate<'receivables'>) {
    const { data, error } = await supabase
      .from('receivables')
      .update(receivable)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }

  // Transações
  static async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    
    return { data, error };
  }

  static async createTransaction(transaction: TablesInsert<'transactions'>) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();
    
    return { data, error };
  }

  // Perguntas e respostas de fotografia
  static async getPhotographyQuestions() {
    const { data, error } = await supabase
      .from('photography_questions')
      .select('*, photography_answers(*)');
    
    return { data, error };
  }

  static async getPhotographyQuestionsByCategory(category: string) {
    const { data, error } = await supabase
      .from('photography_questions')
      .select('*, photography_answers(*)')
      .eq('category', category);
    
    return { data, error };
  }

  static async getPhotographyQuestionsByDifficulty(difficulty: string) {
    const { data, error } = await supabase
      .from('photography_questions')
      .select('*, photography_answers(*)')
      .eq('difficulty', difficulty);
    
    return { data, error };
  }

  static async createPhotographyQuestion(question: TablesInsert<'photography_questions'>) {
    const { data, error } = await supabase
      .from('photography_questions')
      .insert(question)
      .select()
      .single();
    
    return { data, error };
  }

  static async createPhotographyAnswer(answer: TablesInsert<'photography_answers'>) {
    const { data, error } = await supabase
      .from('photography_answers')
      .insert(answer)
      .select()
      .single();
    
    return { data, error };
  }

  // Pontuações de quiz
  static async getQuizScores() {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .order('date_played', { ascending: false });
    
    return { data, error };
  }

  static async getQuizScoresByUser(userId: string) {
    const { data, error } = await supabase
      .from('quiz_scores')
      .select('*')
      .eq('user_id', userId)
      .order('date_played', { ascending: false });
    
    return { data, error };
  }

  static async createQuizScore(score: TablesInsert<'quiz_scores'>) {
    const { data, error } = await supabase
      .from('quiz_scores')
      .insert(score)
      .select()
      .single();
    
    return { data, error };
  }

  // Newsletter
  static async subscribeToNewsletter(email: string, source: string = 'site') {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, source })
      .select()
      .single();
    
    return { data, error };
  }

  static async unsubscribeFromNewsletter(email: string) {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update({ 
        active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();
    
    return { data, error };
  }

  // Configurações de IA
  static async getAISettings() {
    const { data, error } = await supabase
      .rpc('get_ai_settings');
    
    return { data, error };
  }

  static async updateAISettings(provider: string, model: string, apiKey: string) {
    const { data, error } = await supabase
      .rpc('update_ai_settings', {
        p_provider: provider,
        p_model: model,
        p_api_key: apiKey
      });
    
    return { data, error };
  }

  // Estatísticas financeiras
  static async getFinancialStats() {
    const { data, error } = await supabase
      .rpc('get_financial_stats');
    
    return { data, error };
  }
}

export default SupabaseService;
