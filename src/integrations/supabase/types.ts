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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      applied_arcs: {
        Row: {
          applied_at: string | null
          arc_type: string
          id: string
          item_id: string
          level: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          arc_type: string
          id?: string
          item_id: string
          level: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          arc_type?: string
          id?: string
          item_id?: string
          level?: string
          user_id?: string
        }
        Relationships: []
      }
      gate_stacks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          steps: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          steps?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          steps?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      indicator_values: {
        Row: {
          created_at: string | null
          id: string
          indicator_id: string
          timestamp: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          indicator_id: string
          timestamp?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          indicator_id?: string
          timestamp?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "indicator_values_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
        ]
      }
      indicators: {
        Row: {
          created_at: string | null
          id: string
          lower_bound: number | null
          name: string
          target_value: number | null
          type: string
          unit: string | null
          updated_at: string | null
          upper_bound: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lower_bound?: number | null
          name: string
          target_value?: number | null
          type?: string
          unit?: string | null
          updated_at?: string | null
          upper_bound?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lower_bound?: number | null
          name?: string
          target_value?: number | null
          type?: string
          unit?: string | null
          updated_at?: string | null
          upper_bound?: number | null
          user_id?: string
        }
        Relationships: []
      }
      loops: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meta_rels: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          precedence_state: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          precedence_state?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          precedence_state?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      metrics_summary: {
        Row: {
          id: string
          in_band_count: number | null
          out_of_band_count: number | null
          overall_health: number | null
          total_indicators: number | null
          trend_direction: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          in_band_count?: number | null
          out_of_band_count?: number | null
          overall_health?: number | null
          total_indicators?: number | null
          trend_direction?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          in_band_count?: number | null
          out_of_band_count?: number | null
          overall_health?: number | null
          total_indicators?: number | null
          trend_direction?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      participation_packs: {
        Row: {
          created_at: string | null
          description: string | null
          hash: string | null
          id: string
          name: string
          participants: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hash?: string | null
          id?: string
          name: string
          participants?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hash?: string | null
          id?: string
          name?: string
          participants?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      pilots: {
        Row: {
          created_at: string | null
          data_series: Json | null
          description: string | null
          id: string
          name: string
          status: string | null
          summary: Json | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data_series?: Json | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          summary?: Json | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data_series?: Json | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          summary?: Json | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rel_tickets: {
        Row: {
          cohort: string | null
          created_at: string | null
          description: string | null
          geo: string | null
          id: string
          indicator_id: string
          loop_id: string | null
          magnitude: number | null
          persistence: number | null
          severity_score: number | null
          stage: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cohort?: string | null
          created_at?: string | null
          description?: string | null
          geo?: string | null
          id?: string
          indicator_id: string
          loop_id?: string | null
          magnitude?: number | null
          persistence?: number | null
          severity_score?: number | null
          stage?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cohort?: string | null
          created_at?: string | null
          description?: string | null
          geo?: string | null
          id?: string
          indicator_id?: string
          loop_id?: string | null
          magnitude?: number | null
          persistence?: number | null
          severity_score?: number | null
          stage?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rel_tickets_indicator_id_fkey"
            columns: ["indicator_id"]
            isOneToOne: false
            referencedRelation: "indicators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
        ]
      }
      sprints: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          id: string
          loop_id: string | null
          name: string
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          loop_id?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          loop_id?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sprints_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          sprint_id: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          sprint_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          sprint_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_sprint_id_fkey"
            columns: ["sprint_id"]
            isOneToOne: false
            referencedRelation: "sprints"
            referencedColumns: ["id"]
          },
        ]
      }
      transparency_packs: {
        Row: {
          content: Json | null
          description: string | null
          hash: string
          id: string
          name: string
          published_at: string | null
          user_id: string
        }
        Insert: {
          content?: Json | null
          description?: string | null
          hash: string
          id?: string
          name: string
          published_at?: string | null
          user_id: string
        }
        Update: {
          content?: Json | null
          description?: string | null
          hash?: string
          id?: string
          name?: string
          published_at?: string | null
          user_id?: string
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
      meta_alignment_vw: {
        Row: {
          domains_balance_score: number | null
          institutions_adaptivity_score: number | null
          overall_alignment: number | null
          population_score: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      vw_breach_current: {
        Row: {
          cohort: string | null
          geo: string | null
          id: string | null
          loop_id: string | null
          loop_name: string | null
          magnitude: number | null
          magnitude_change: string | null
          persistence: number | null
          severity_score: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      seed_demo_data_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
