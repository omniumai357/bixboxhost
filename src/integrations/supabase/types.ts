export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_templates: {
        Row: {
          asset_urls: string[] | null
          category: string
          created_at: string
          id: number
          is_active: boolean | null
          name: string
          template_data: Json
          updated_at: string
        }
        Insert: {
          asset_urls?: string[] | null
          category: string
          created_at?: string
          id?: never
          is_active?: boolean | null
          name: string
          template_data: Json
          updated_at?: string
        }
        Update: {
          asset_urls?: string[] | null
          category?: string
          created_at?: string
          id?: never
          is_active?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
      downloads: {
        Row: {
          ad_template_id: number | null
          created_at: string
          download_count: number | null
          download_url: string
          downloaded_at: string | null
          expires_at: string | null
          id: string
          order_id: string | null
          user_id: string
        }
        Insert: {
          ad_template_id?: number | null
          created_at?: string
          download_count?: number | null
          download_url: string
          downloaded_at?: string | null
          expires_at?: string | null
          id?: string
          order_id?: string | null
          user_id: string
        }
        Update: {
          ad_template_id?: number | null
          created_at?: string
          download_count?: number | null
          download_url?: string
          downloaded_at?: string | null
          expires_at?: string | null
          id?: string
          order_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_ad_template_id_fkey"
            columns: ["ad_template_id"]
            isOneToOne: false
            referencedRelation: "ad_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ad_id: number | null
          business_type: string | null
          created_at: string | null
          email: string
          id: string
          status: string | null
        }
        Insert: {
          ad_id?: number | null
          business_type?: string | null
          created_at?: string | null
          email: string
          id?: string
          status?: string | null
        }
        Update: {
          ad_id?: number | null
          business_type?: string | null
          created_at?: string | null
          email?: string
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          business_data: Json | null
          created_at: string
          currency: string | null
          id: string
          package_type: string
          status: string | null
          stripe_customer_id: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          business_data?: Json | null
          created_at?: string
          currency?: string | null
          id?: string
          package_type: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          business_data?: Json | null
          created_at?: string
          currency?: string | null
          id?: string
          package_type?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      previews: {
        Row: {
          ad_id: number | null
          converted: boolean | null
          email: string
          id: string
          viewed_at: string | null
        }
        Insert: {
          ad_id?: number | null
          converted?: boolean | null
          email: string
          id?: string
          viewed_at?: string | null
        }
        Update: {
          ad_id?: number | null
          converted?: boolean | null
          email?: string
          id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          business_name: string | null
          business_type: string | null
          city: string | null
          created_at: string
          email: string
          id: string
          marketing_budget: string | null
          phone: string | null
          role: string | null
          state: string | null
          target_audience: string | null
          updated_at: string
          website: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email: string
          id: string
          marketing_budget?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          target_audience?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          business_type?: string | null
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          marketing_budget?: string | null
          phone?: string | null
          role?: string | null
          state?: string | null
          target_audience?: string | null
          updated_at?: string
          website?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          ad_id: number | null
          created_at: string | null
          id: string
          price: number | null
          user_id: string | null
        }
        Insert: {
          ad_id?: number | null
          created_at?: string | null
          id?: string
          price?: number | null
          user_id?: string | null
        }
        Update: {
          ad_id?: number | null
          created_at?: string | null
          id?: string
          price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_premium: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_premium?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_premium?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
