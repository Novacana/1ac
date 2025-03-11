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
      addresses: {
        Row: {
          additional_info: string | null
          city: string
          country: string
          id: string
          is_default: boolean | null
          state: string
          street: string
          user_id: string
          zip: string
        }
        Insert: {
          additional_info?: string | null
          city: string
          country: string
          id?: string
          is_default?: boolean | null
          state: string
          street: string
          user_id: string
          zip: string
        }
        Update: {
          additional_info?: string | null
          city?: string
          country?: string
          id?: string
          is_default?: boolean | null
          state?: string
          street?: string
          user_id?: string
          zip?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          name: string
          status: string
          type: string
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          status: string
          type: string
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          type?: string
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string | null
          bank_name: string | null
          card_cvc: string | null
          card_expiry: string | null
          card_holder: string | null
          card_number: string | null
          expiry_date: string | null
          id: string
          is_default: boolean | null
          paypal_email: string | null
          routing_number: string | null
          type: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          bank_name?: string | null
          card_cvc?: string | null
          card_expiry?: string | null
          card_holder?: string | null
          card_number?: string | null
          expiry_date?: string | null
          id?: string
          is_default?: boolean | null
          paypal_email?: string | null
          routing_number?: string | null
          type: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          bank_name?: string | null
          card_cvc?: string | null
          card_expiry?: string | null
          card_holder?: string | null
          card_number?: string | null
          expiry_date?: string | null
          id?: string
          is_default?: boolean | null
          paypal_email?: string | null
          routing_number?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identification_status: string | null
          name: string | null
          pharmacy_license_number: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          identification_status?: string | null
          name?: string | null
          pharmacy_license_number?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identification_status?: string | null
          name?: string | null
          pharmacy_license_number?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          verification_status?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
