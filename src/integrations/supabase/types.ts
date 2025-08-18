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
      band_crossings: {
        Row: {
          at: string
          created_at: string
          direction: string
          id: string
          loop_id: string
          user_id: string
          value: number
        }
        Insert: {
          at?: string
          created_at?: string
          direction: string
          id?: string
          loop_id: string
          user_id: string
          value: number
        }
        Update: {
          at?: string
          created_at?: string
          direction?: string
          id?: string
          loop_id?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      claims: {
        Row: {
          assignee: string
          created_at: string
          evidence: Json | null
          id: string
          leverage: Database["public"]["Enums"]["leverage_type"]
          loop_id: string
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          raci: Json | null
          sprint_id: string | null
          status: Database["public"]["Enums"]["claim_status"] | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee: string
          created_at?: string
          evidence?: Json | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_type"]
          loop_id: string
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          raci?: Json | null
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee?: string
          created_at?: string
          evidence?: Json | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_type"]
          loop_id?: string
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          raci?: Json | null
          sprint_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      de_bands: {
        Row: {
          asymmetry: number | null
          created_at: string
          id: string
          indicator: string
          loop_id: string
          lower_bound: number | null
          notes: string | null
          updated_at: string
          upper_bound: number | null
          user_id: string
        }
        Insert: {
          asymmetry?: number | null
          created_at?: string
          id?: string
          indicator: string
          loop_id: string
          lower_bound?: number | null
          notes?: string | null
          updated_at?: string
          upper_bound?: number | null
          user_id: string
        }
        Update: {
          asymmetry?: number | null
          created_at?: string
          id?: string
          indicator?: string
          loop_id?: string
          lower_bound?: number | null
          notes?: string | null
          updated_at?: string
          upper_bound?: number | null
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
      interventions: {
        Row: {
          claim_id: string
          created_at: string
          description: string | null
          effort: number | null
          id: string
          impact: number | null
          label: string
          ordering: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string
          description?: string | null
          effort?: number | null
          id?: string
          impact?: number | null
          label: string
          ordering?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string
          description?: string | null
          effort?: number | null
          id?: string
          impact?: number | null
          label?: string
          ordering?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loop_edges: {
        Row: {
          created_at: string
          delay_ms: number | null
          from_node: string
          id: string
          loop_id: string
          note: string | null
          polarity: number
          to_node: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          delay_ms?: number | null
          from_node: string
          id?: string
          loop_id: string
          note?: string | null
          polarity: number
          to_node: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          delay_ms?: number | null
          from_node?: string
          id?: string
          loop_id?: string
          note?: string | null
          polarity?: number
          to_node?: string
          weight?: number | null
        }
        Relationships: []
      }
      loop_scorecards: {
        Row: {
          claim_velocity: number | null
          de_state: string | null
          fatigue: number | null
          last_tri: Json | null
          loop_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          claim_velocity?: number | null
          de_state?: string | null
          fatigue?: number | null
          last_tri?: Json | null
          loop_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          claim_velocity?: number | null
          de_state?: string | null
          fatigue?: number | null
          last_tri?: Json | null
          loop_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loop_shared_nodes: {
        Row: {
          created_at: string
          id: string
          loop_id: string
          node_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          loop_id: string
          node_id: string
        }
        Update: {
          created_at?: string
          id?: string
          loop_id?: string
          node_id?: string
        }
        Relationships: []
      }
      loop_tags: {
        Row: {
          created_at: string
          loop_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          loop_id: string
          tag: string
        }
        Update: {
          created_at?: string
          loop_id?: string
          tag?: string
        }
        Relationships: []
      }
      loop_versions: {
        Row: {
          created_at: string
          id: string
          loop_id: string
          payload: Json
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          loop_id: string
          payload?: Json
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          loop_id?: string
          payload?: Json
          version?: number
        }
        Relationships: []
      }
      loops: {
        Row: {
          controller: Json | null
          created_at: string | null
          description: string | null
          id: string
          leverage_default: Database["public"]["Enums"]["leverage_type"] | null
          loop_type: Database["public"]["Enums"]["loop_type"] | null
          metadata: Json | null
          name: string
          notes: string | null
          scale: Database["public"]["Enums"]["scale_type"] | null
          status: string | null
          thresholds: Json | null
          type: string | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          controller?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          leverage_default?: Database["public"]["Enums"]["leverage_type"] | null
          loop_type?: Database["public"]["Enums"]["loop_type"] | null
          metadata?: Json | null
          name: string
          notes?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          status?: string | null
          thresholds?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          controller?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          leverage_default?: Database["public"]["Enums"]["leverage_type"] | null
          loop_type?: Database["public"]["Enums"]["loop_type"] | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          status?: string | null
          thresholds?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: []
      }
      mandate_rules: {
        Row: {
          actor: string
          allowed_levers: string[] | null
          created_at: string
          id: string
          restrictions: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actor: string
          allowed_levers?: string[] | null
          created_at?: string
          id?: string
          restrictions?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actor?: string
          allowed_levers?: string[] | null
          created_at?: string
          id?: string
          restrictions?: Json | null
          updated_at?: string
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
      shared_nodes: {
        Row: {
          created_at: string
          description: string | null
          descriptor: string | null
          domain: string | null
          id: string
          label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          descriptor?: string | null
          domain?: string | null
          id?: string
          label: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          descriptor?: string | null
          domain?: string | null
          id?: string
          label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      srt_windows: {
        Row: {
          created_at: string
          id: string
          loop_id: string
          reflex_horizon: unknown | null
          updated_at: string
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          created_at?: string
          id?: string
          loop_id: string
          reflex_horizon?: unknown | null
          updated_at?: string
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          created_at?: string
          id?: string
          loop_id?: string
          reflex_horizon?: unknown | null
          updated_at?: string
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      task_artifacts: {
        Row: {
          created_at: string
          id: string
          kind: string
          meta: Json | null
          ref_id: string | null
          task_id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          meta?: Json | null
          ref_id?: string | null
          task_id: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          meta?: Json | null
          ref_id?: string | null
          task_id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      task_checklist_items: {
        Row: {
          created_at: string
          done: boolean
          id: string
          label: string
          order_index: number
          required: boolean
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          done?: boolean
          id?: string
          label: string
          order_index?: number
          required?: boolean
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          done?: boolean
          id?: string
          label?: string
          order_index?: number
          required?: boolean
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_events: {
        Row: {
          actor: string
          at: string
          details: Json | null
          event_type: string
          id: string
          task_id: string
        }
        Insert: {
          actor: string
          at?: string
          details?: Json | null
          event_type: string
          id?: string
          task_id: string
        }
        Update: {
          actor?: string
          at?: string
          details?: Json | null
          event_type?: string
          id?: string
          task_id?: string
        }
        Relationships: []
      }
      task_locks: {
        Row: {
          expires_at: string
          id: string
          locked_at: string
          locked_by: string
          task_id: string
        }
        Insert: {
          expires_at?: string
          id?: string
          locked_at?: string
          locked_by: string
          task_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          locked_at?: string
          locked_by?: string
          task_id?: string
        }
        Relationships: []
      }
      task_payloads: {
        Row: {
          created_at: string
          id: string
          payload: Json
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          payload?: Json
          task_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          payload?: Json
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          capacity: Database["public"]["Enums"]["capacity_type"] | null
          created_at: string | null
          de_band_id: string | null
          description: string | null
          due_date: string | null
          id: string
          leverage: Database["public"]["Enums"]["leverage_type"] | null
          locked_at: string | null
          locked_by: string | null
          loop_id: string | null
          payload: Json | null
          priority: string | null
          scale: Database["public"]["Enums"]["scale_type"] | null
          sprint_id: string | null
          srt_id: string | null
          status: string | null
          task_type: string | null
          title: string
          tri: Json | null
          type: Database["public"]["Enums"]["loop_type"] | null
          updated_at: string | null
          user_id: string
          zone: string | null
        }
        Insert: {
          assigned_to?: string | null
          capacity?: Database["public"]["Enums"]["capacity_type"] | null
          created_at?: string | null
          de_band_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_type"] | null
          locked_at?: string | null
          locked_by?: string | null
          loop_id?: string | null
          payload?: Json | null
          priority?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          sprint_id?: string | null
          srt_id?: string | null
          status?: string | null
          task_type?: string | null
          title: string
          tri?: Json | null
          type?: Database["public"]["Enums"]["loop_type"] | null
          updated_at?: string | null
          user_id: string
          zone?: string | null
        }
        Update: {
          assigned_to?: string | null
          capacity?: Database["public"]["Enums"]["capacity_type"] | null
          created_at?: string | null
          de_band_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_type"] | null
          locked_at?: string | null
          locked_by?: string | null
          loop_id?: string | null
          payload?: Json | null
          priority?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          sprint_id?: string | null
          srt_id?: string | null
          status?: string | null
          task_type?: string | null
          title?: string
          tri?: Json | null
          type?: Database["public"]["Enums"]["loop_type"] | null
          updated_at?: string | null
          user_id?: string
          zone?: string | null
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
      tri_events: {
        Row: {
          at: string
          created_at: string
          i_value: number
          id: string
          loop_id: string
          r_value: number
          t_value: number
          task_id: string | null
          user_id: string
        }
        Insert: {
          at?: string
          created_at?: string
          i_value?: number
          id?: string
          loop_id: string
          r_value?: number
          t_value?: number
          task_id?: string | null
          user_id: string
        }
        Update: {
          at?: string
          created_at?: string
          i_value?: number
          id?: string
          loop_id?: string
          r_value?: number
          t_value?: number
          task_id?: string | null
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
      evaluate_mandate: {
        Args: { actor_name: string; leverage_level: string }
        Returns: string
      }
      get_loop_hydrate: {
        Args: { loop_uuid: string }
        Returns: Json
      }
      get_task_by_id: {
        Args: { task_uuid: string }
        Returns: {
          assigned_to: string | null
          capacity: Database["public"]["Enums"]["capacity_type"] | null
          created_at: string | null
          de_band_id: string | null
          description: string | null
          due_date: string | null
          id: string
          leverage: Database["public"]["Enums"]["leverage_type"] | null
          locked_at: string | null
          locked_by: string | null
          loop_id: string | null
          payload: Json | null
          priority: string | null
          scale: Database["public"]["Enums"]["scale_type"] | null
          sprint_id: string | null
          srt_id: string | null
          status: string | null
          task_type: string | null
          title: string
          tri: Json | null
          type: Database["public"]["Enums"]["loop_type"] | null
          updated_at: string | null
          user_id: string
          zone: string | null
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      publish_loop: {
        Args: { loop_uuid: string }
        Returns: Json
      }
      reset_all_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      seed_demo_data_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      upsert_loop_scorecard: {
        Args: { loop_uuid: string; payload: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      capacity_type:
        | "responsive"
        | "reflexive"
        | "deliberative"
        | "anticipatory"
        | "structural"
      claim_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "implemented"
      leverage_type: "N" | "P" | "S"
      loop_type: "reactive" | "structural" | "perceptual"
      mandate_status: "allowed" | "restricted" | "forbidden"
      scale_type: "micro" | "meso" | "macro"
      task_status: "open" | "claimed" | "active" | "done" | "blocked"
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
      capacity_type: [
        "responsive",
        "reflexive",
        "deliberative",
        "anticipatory",
        "structural",
      ],
      claim_status: ["draft", "pending", "approved", "rejected", "implemented"],
      leverage_type: ["N", "P", "S"],
      loop_type: ["reactive", "structural", "perceptual"],
      mandate_status: ["allowed", "restricted", "forbidden"],
      scale_type: ["micro", "meso", "macro"],
      task_status: ["open", "claimed", "active", "done", "blocked"],
    },
  },
} as const
