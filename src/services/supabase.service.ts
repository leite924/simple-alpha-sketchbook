
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Simplified service with placeholder functions
export class SupabaseService {
  // Authentication functions work with existing Supabase setup
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

  // User profile functions - work with existing profiles table
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }

  static async updateUserProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);
    
    return { data, error };
  }

  // User roles functions - work with existing user_roles table
  static async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId);
    
    return { data, error };
  }

  static async hasRole(userId: string, role: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', role as any)
      .single();
    
    return { data: !!data, error };
  }

  // Course functions - work with existing courses table
  static async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_active', true);
    
    return { data, error };
  }

  static async getCourse(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // Class functions - work with existing classes table
  static async getClasses() {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('is_active', true);
    
    return { data, error };
  }

  static async getClass(id: string) {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // Coupon functions - work with existing discount_coupons table
  static async validateCoupon(code: string) {
    const { data, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();
    
    return { data, error };
  }

  // Transaction functions - work with existing transactions table
  static async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('transaction_date', { ascending: false });
    
    return { data, error };
  }

  static async createTransaction(transactionData: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData])
      .select()
      .single();
    
    return { data, error };
  }

  // Enrollment functions - work with existing manual_enrollments table
  static async getEnrollments() {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  }

  static async createEnrollment(enrollmentData: any) {
    const { data, error } = await supabase
      .from('manual_enrollments')
      .insert([enrollmentData])
      .select()
      .single();
    
    return { data, error };
  }

  // Blog functions - work with existing blog_posts table
  static async getBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    return { data, error };
  }

  static async getBlogPost(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  // AI Settings functions - work with existing ai_settings table and functions
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

  // NFS-e Settings functions - work with existing nfse_settings table
  static async getNFSeSettings(userId?: string) {
    const { data, error } = await supabase
      .rpc('get_user_nfse_settings', { p_user_id: userId });
    
    return { data, error };
  }

  static async saveNFSeSettings(settingsData: any) {
    const { data, error } = await supabase
      .from('nfse_settings')
      .upsert([settingsData])
      .select()
      .single();
    
    return { data, error };
  }

  static async updateNFSeSettings(id: string, settingsData: any) {
    const { data, error } = await supabase
      .from('nfse_settings')
      .update(settingsData)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  }
}

export default SupabaseService;
