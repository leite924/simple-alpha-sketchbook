export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_settings: {
        Row: {
          api_key: string | null
          id: string
          last_updated: string | null
          model: string | null
          provider: string | null
          updated_by: string | null
        }
        Insert: {
          api_key?: string | null
          id?: string
          last_updated?: string | null
          model?: string | null
          provider?: string | null
          updated_by?: string | null
        }
        Update: {
          api_key?: string | null
          id?: string
          last_updated?: string | null
          model?: string | null
          provider?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          author_id: string | null
          categories: string[] | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          read_time: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          author_id?: string | null
          categories?: string[] | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          read_time?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      classes: {
        Row: {
          course_id: string | null
          course_name: string
          created_at: string | null
          days: string
          id: string
          is_active: boolean | null
          period: string
          price: number
          spots_available: number
          total_spots: number
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          course_name: string
          created_at?: string | null
          days: string
          id?: string
          is_active?: boolean | null
          period: string
          price: number
          spots_available?: number
          total_spots?: number
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          course_name?: string
          created_at?: string | null
          days?: string
          id?: string
          is_active?: boolean | null
          period?: string
          price?: number
          spots_available?: number
          total_spots?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discount_coupons: {
        Row: {
          code: string
          course_id: string | null
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          course_id?: string | null
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discount_coupons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      manual_enrollments: {
        Row: {
          class_id: string
          coupon_id: string | null
          created_at: string | null
          created_by: string | null
          discount_amount: number | null
          enrollment_date: string | null
          id: string
          notes: string | null
          original_amount: number
          payment_amount: number
          payment_status: string
          student_id: string
          updated_at: string | null
        }
        Insert: {
          class_id: string
          coupon_id?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          enrollment_date?: string | null
          id?: string
          notes?: string | null
          original_amount: number
          payment_amount: number
          payment_status: string
          student_id: string
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          coupon_id?: string | null
          created_at?: string | null
          created_by?: string | null
          discount_amount?: number | null
          enrollment_date?: string | null
          id?: string
          notes?: string | null
          original_amount?: number
          payment_amount?: number
          payment_status?: string
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manual_enrollments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_enrollments_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      nfse_settings: {
        Row: {
          auto_generate: boolean
          auto_generate_status: string
          certificate_file_name: string | null
          certificate_password_encrypted: string | null
          certificate_validity: string | null
          company_cnpj: string
          company_name: string
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          municipal_inscription: string | null
          service_code: string
          updated_at: string
          updated_by: string | null
          user_id: string
          webservice_environment: string
          webservice_url_homologacao: string | null
          webservice_url_producao: string | null
        }
        Insert: {
          auto_generate?: boolean
          auto_generate_status?: string
          certificate_file_name?: string | null
          certificate_password_encrypted?: string | null
          certificate_validity?: string | null
          company_cnpj: string
          company_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          municipal_inscription?: string | null
          service_code: string
          updated_at?: string
          updated_by?: string | null
          user_id: string
          webservice_environment?: string
          webservice_url_homologacao?: string | null
          webservice_url_producao?: string | null
        }
        Update: {
          auto_generate?: boolean
          auto_generate_status?: string
          certificate_file_name?: string | null
          certificate_password_encrypted?: string | null
          certificate_validity?: string | null
          company_cnpj?: string
          company_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          municipal_inscription?: string | null
          service_code?: string
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          webservice_environment?: string
          webservice_url_homologacao?: string | null
          webservice_url_producao?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          address_complement: string | null
          address_number: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          neighborhood: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          neighborhood?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          neighborhood?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          module: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          module?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      super_admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          permissions: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          permissions?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_date: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string | null
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_create_student_profile: {
        Args:
          | {
              p_admin_user_id: string
              p_id: string
              p_email: string
              p_first_name: string
              p_last_name: string
              p_cpf?: string
              p_birth_date?: string
              p_phone?: string
              p_address?: string
              p_address_number?: string
              p_address_complement?: string
              p_neighborhood?: string
              p_city?: string
              p_state?: string
              p_postal_code?: string
            }
          | {
              p_id: string
              p_email: string
              p_first_name: string
              p_last_name: string
              p_cpf?: string
              p_birth_date?: string
              p_phone?: string
              p_address?: string
              p_address_number?: string
              p_address_complement?: string
              p_neighborhood?: string
              p_city?: string
              p_state?: string
              p_postal_code?: string
            }
        Returns: string
      }
      admin_delete_user_by_email: {
        Args: { user_email: string }
        Returns: boolean
      }
      encrypt_password: {
        Args: { password: string }
        Returns: string
      }
      get_ai_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          provider: string
          model: string
          api_key: string
          last_updated: string
          updated_by: string
        }[]
      }
      get_current_user_email: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_nfse_settings: {
        Args: { p_user_id?: string }
        Returns: {
          id: string
          company_cnpj: string
          company_name: string
          municipal_inscription: string
          service_code: string
          auto_generate: boolean
          auto_generate_status: string
          certificate_file_name: string
          certificate_validity: string
          webservice_environment: string
          webservice_url_homologacao: string
          webservice_url_producao: string
          created_at: string
          updated_at: string
        }[]
      }
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      update_ai_settings: {
        Args: { p_provider: string; p_model: string; p_api_key: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "instructor" | "student" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "instructor", "student", "viewer"],
    },
  },
} as const
