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
      breach_events: {
        Row: {
          at: string
          breach_type: string
          created_at: string
          duration_minutes: number | null
          id: string
          indicator_name: string
          loop_id: string
          resolved_at: string | null
          severity_score: number | null
          threshold_value: number
          user_id: string
          value: number
        }
        Insert: {
          at?: string
          breach_type: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          indicator_name: string
          loop_id: string
          resolved_at?: string | null
          severity_score?: number | null
          threshold_value: number
          user_id: string
          value: number
        }
        Update: {
          at?: string
          breach_type?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          indicator_name?: string
          loop_id?: string
          resolved_at?: string | null
          severity_score?: number | null
          threshold_value?: number
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      claim_checkpoints: {
        Row: {
          attachments: Json | null
          claim_id: string
          created_at: string
          created_by: string
          id: string
          summary: string
          tag: string | null
          tri_values: Json | null
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          claim_id: string
          created_at?: string
          created_by: string
          id?: string
          summary: string
          tag?: string | null
          tri_values?: Json | null
          user_id: string
        }
        Update: {
          attachments?: Json | null
          claim_id?: string
          created_at?: string
          created_by?: string
          id?: string
          summary?: string
          tag?: string | null
          tri_values?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      claim_dependencies: {
        Row: {
          child_substep_id: string
          created_at: string
          id: string
          parent_substep_id: string
        }
        Insert: {
          child_substep_id: string
          created_at?: string
          id?: string
          parent_substep_id: string
        }
        Update: {
          child_substep_id?: string
          created_at?: string
          id?: string
          parent_substep_id?: string
        }
        Relationships: []
      }
      claim_substeps: {
        Row: {
          alert_id: string | null
          attachments: Json | null
          checklist: Json | null
          claim_id: string
          created_at: string
          description: string | null
          finished_at: string | null
          id: string
          ordering: number
          owner: string | null
          planned_duration: unknown | null
          started_at: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_id?: string | null
          attachments?: Json | null
          checklist?: Json | null
          claim_id: string
          created_at?: string
          description?: string | null
          finished_at?: string | null
          id?: string
          ordering?: number
          owner?: string | null
          planned_duration?: unknown | null
          started_at?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_id?: string | null
          attachments?: Json | null
          checklist?: Json | null
          claim_id?: string
          created_at?: string
          description?: string | null
          finished_at?: string | null
          id?: string
          ordering?: number
          owner?: string | null
          planned_duration?: unknown | null
          started_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          assignee: string
          created_at: string
          evidence: Json | null
          finished_at: string | null
          id: string
          last_checkpoint_at: string | null
          leverage: Database["public"]["Enums"]["leverage_type"]
          loop_id: string
          mandate_status: Database["public"]["Enums"]["mandate_status"] | null
          pause_reason: string | null
          paused_at: string | null
          raci: Json | null
          sprint_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["claim_status"] | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assignee: string
          created_at?: string
          evidence?: Json | null
          finished_at?: string | null
          id?: string
          last_checkpoint_at?: string | null
          leverage?: Database["public"]["Enums"]["leverage_type"]
          loop_id: string
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          pause_reason?: string | null
          paused_at?: string | null
          raci?: Json | null
          sprint_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assignee?: string
          created_at?: string
          evidence?: Json | null
          finished_at?: string | null
          id?: string
          last_checkpoint_at?: string | null
          leverage?: Database["public"]["Enums"]["leverage_type"]
          loop_id?: string
          mandate_status?: Database["public"]["Enums"]["mandate_status"] | null
          pause_reason?: string | null
          paused_at?: string | null
          raci?: Json | null
          sprint_id?: string | null
          started_at?: string | null
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
          smoothing_alpha: number | null
          updated_at: string
          updated_by: string | null
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
          smoothing_alpha?: number | null
          updated_at?: string
          updated_by?: string | null
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
          smoothing_alpha?: number | null
          updated_at?: string
          updated_by?: string | null
          upper_bound?: number | null
          user_id?: string
        }
        Relationships: []
      }
      decision_records: {
        Row: {
          attachments: Json | null
          created_at: string
          created_by: string
          id: string
          option_set_id: string | null
          rationale: string
          task_id: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          created_by: string
          id?: string
          option_set_id?: string | null
          rationale: string
          task_id: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          option_set_id?: string | null
          rationale?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_records_option_set_id_fkey"
            columns: ["option_set_id"]
            isOneToOne: false
            referencedRelation: "option_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_links: {
        Row: {
          created_at: string
          id: string
          link_context: Json | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link_context?: Json | null
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link_context?: Json | null
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
          user_id?: string
        }
        Relationships: []
      }
      execution_logs: {
        Row: {
          actor: string
          at: string
          claim_id: string
          id: string
          kind: string
          payload: Json | null
          user_id: string
        }
        Insert: {
          actor: string
          at?: string
          claim_id: string
          id?: string
          kind: string
          payload?: Json | null
          user_id: string
        }
        Update: {
          actor?: string
          at?: string
          claim_id?: string
          id?: string
          kind?: string
          payload?: Json | null
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
      guardrails: {
        Row: {
          created_at: string
          id: string
          loop_id: string
          max_concurrent_substeps: number | null
          max_coverage_pct: number | null
          max_delta_per_day: number | null
          override_active: boolean | null
          override_at: string | null
          override_by: string | null
          override_reason: string | null
          timebox_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          loop_id: string
          max_concurrent_substeps?: number | null
          max_coverage_pct?: number | null
          max_delta_per_day?: number | null
          override_active?: boolean | null
          override_at?: string | null
          override_by?: string | null
          override_reason?: string | null
          timebox_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          loop_id?: string
          max_concurrent_substeps?: number | null
          max_coverage_pct?: number | null
          max_delta_per_day?: number | null
          override_active?: boolean | null
          override_at?: string | null
          override_by?: string | null
          override_reason?: string | null
          timebox_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      harmonization_decisions: {
        Row: {
          actor: string
          conflicting_claims: Json
          created_at: string
          created_by: string
          decision: string
          id: string
          rationale: string
          resolution_actions: Json | null
          user_id: string
        }
        Insert: {
          actor: string
          conflicting_claims: Json
          created_at?: string
          created_by: string
          decision: string
          id?: string
          rationale: string
          resolution_actions?: Json | null
          user_id: string
        }
        Update: {
          actor?: string
          conflicting_claims?: Json
          created_at?: string
          created_by?: string
          decision?: string
          id?: string
          rationale?: string
          resolution_actions?: Json | null
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
          breach_days: number | null
          claim_velocity: number | null
          de_state: string | null
          fatigue: number | null
          heartbeat_at: string | null
          last_tri: Json | null
          loop_id: string
          tri_slope: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          breach_days?: number | null
          claim_velocity?: number | null
          de_state?: string | null
          fatigue?: number | null
          heartbeat_at?: string | null
          last_tri?: Json | null
          loop_id: string
          tri_slope?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          breach_days?: number | null
          claim_velocity?: number | null
          de_state?: string | null
          fatigue?: number | null
          heartbeat_at?: string | null
          last_tri?: Json | null
          loop_id?: string
          tri_slope?: number | null
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
      mode_events: {
        Row: {
          capacity: string | null
          confidence: number | null
          created_at: string
          event_type: string
          id: string
          loop_id: string | null
          metadata: Json | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          capacity?: string | null
          confidence?: number | null
          created_at?: string
          event_type: string
          id?: string
          loop_id?: string | null
          metadata?: Json | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          capacity?: string | null
          confidence?: number | null
          created_at?: string
          event_type?: string
          id?: string
          loop_id?: string | null
          metadata?: Json | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      option_effects: {
        Row: {
          confidence: number | null
          created_at: string
          delta_estimate: number
          edge_refs: string[] | null
          id: string
          indicator: string
          loop_id: string
          option_id: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          delta_estimate: number
          edge_refs?: string[] | null
          id?: string
          indicator: string
          loop_id: string
          option_id: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          delta_estimate?: number
          edge_refs?: string[] | null
          id?: string
          indicator?: string
          loop_id?: string
          option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "option_effects_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      option_sets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          mcda_snapshot: Json | null
          name: string
          option_ids: string[] | null
          rationale: string | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          mcda_snapshot?: Json | null
          name: string
          option_ids?: string[] | null
          rationale?: string | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          mcda_snapshot?: Json | null
          name?: string
          option_ids?: string[] | null
          rationale?: string | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      options: {
        Row: {
          actor: string
          assumptions: Json | null
          cost: number | null
          created_at: string
          dependencies: Json | null
          effect: Json
          effort: number | null
          evidence: Json | null
          id: string
          lever: string
          loop_id: string
          name: string
          risks: Json | null
          status: string | null
          task_id: string
          time_to_impact: unknown | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actor: string
          assumptions?: Json | null
          cost?: number | null
          created_at?: string
          dependencies?: Json | null
          effect?: Json
          effort?: number | null
          evidence?: Json | null
          id?: string
          lever: string
          loop_id: string
          name: string
          risks?: Json | null
          status?: string | null
          task_id: string
          time_to_impact?: unknown | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actor?: string
          assumptions?: Json | null
          cost?: number | null
          created_at?: string
          dependencies?: Json | null
          effect?: Json
          effort?: number | null
          evidence?: Json | null
          id?: string
          lever?: string
          loop_id?: string
          name?: string
          risks?: Json | null
          status?: string | null
          task_id?: string
          time_to_impact?: unknown | null
          updated_at?: string
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
      playbooks: {
        Row: {
          auto_action: boolean | null
          created_at: string
          guards: Json | null
          id: string
          lever_order: string[] | null
          loop_id: string
          steps: Json
          success_criteria: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_action?: boolean | null
          created_at?: string
          guards?: Json | null
          id?: string
          lever_order?: string[] | null
          loop_id: string
          steps?: Json
          success_criteria?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_action?: boolean | null
          created_at?: string
          guards?: Json | null
          id?: string
          lever_order?: string[] | null
          loop_id?: string
          steps?: Json
          success_criteria?: Json | null
          title?: string
          updated_at?: string
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
      reflex_memory: {
        Row: {
          after: Json | null
          before: Json | null
          created_at: string
          id: string
          loop_id: string
          reason: string
          user_id: string
        }
        Insert: {
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          loop_id: string
          reason: string
          user_id: string
        }
        Update: {
          after?: Json | null
          before?: Json | null
          created_at?: string
          id?: string
          loop_id?: string
          reason?: string
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
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
      }
      retune_approvals: {
        Row: {
          approval_reason: string | null
          approval_status: string | null
          approver_id: string | null
          created_at: string
          id: string
          requested_at: string
          requested_by: string
          retune_id: string
          reviewed_at: string | null
        }
        Insert: {
          approval_reason?: string | null
          approval_status?: string | null
          approver_id?: string | null
          created_at?: string
          id?: string
          requested_at?: string
          requested_by: string
          retune_id: string
          reviewed_at?: string | null
        }
        Update: {
          approval_reason?: string | null
          approval_status?: string | null
          approver_id?: string | null
          created_at?: string
          id?: string
          requested_at?: string
          requested_by?: string
          retune_id?: string
          reviewed_at?: string | null
        }
        Relationships: []
      }
      retune_suggestions: {
        Row: {
          applied_at: string | null
          applied_by: string | null
          confidence: number
          created_at: string
          description: string
          expected_improvement: Json | null
          false_positive_risk: number | null
          id: string
          impact_level: string | null
          loop_id: string
          proposed_changes: Json
          rationale: string
          risk_score: number
          status: string | null
          suggestion_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number
          created_at?: string
          description: string
          expected_improvement?: Json | null
          false_positive_risk?: number | null
          id?: string
          impact_level?: string | null
          loop_id: string
          proposed_changes?: Json
          rationale: string
          risk_score?: number
          status?: string | null
          suggestion_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_at?: string | null
          applied_by?: string | null
          confidence?: number
          created_at?: string
          description?: string
          expected_improvement?: Json | null
          false_positive_risk?: number | null
          id?: string
          impact_level?: string | null
          loop_id?: string
          proposed_changes?: Json
          rationale?: string
          risk_score?: number
          status?: string | null
          suggestion_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scenarios: {
        Row: {
          charts: Json | null
          created_at: string
          id: string
          loop_id: string
          name: string
          params: Json
          pinned: boolean | null
          task_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          charts?: Json | null
          created_at?: string
          id?: string
          loop_id: string
          name: string
          params?: Json
          pinned?: boolean | null
          task_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          charts?: Json | null
          created_at?: string
          id?: string
          loop_id?: string
          name?: string
          params?: Json
          pinned?: boolean | null
          task_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      signal_events: {
        Row: {
          auto_action_taken: boolean | null
          created_at: string
          event_type: string
          id: string
          indicator_value: number
          loop_id: string
          playbook_executed: Json | null
          severity: string | null
          threshold_crossed: number | null
          user_id: string
          watchpoint_id: string
        }
        Insert: {
          auto_action_taken?: boolean | null
          created_at?: string
          event_type: string
          id?: string
          indicator_value: number
          loop_id: string
          playbook_executed?: Json | null
          severity?: string | null
          threshold_crossed?: number | null
          user_id: string
          watchpoint_id: string
        }
        Update: {
          auto_action_taken?: boolean | null
          created_at?: string
          event_type?: string
          id?: string
          indicator_value?: number
          loop_id?: string
          playbook_executed?: Json | null
          severity?: string | null
          threshold_crossed?: number | null
          user_id?: string
          watchpoint_id?: string
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
          {
            foreignKeyName: "sprints_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "sprints_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
      }
      srt_windows: {
        Row: {
          cadence: unknown | null
          created_at: string
          id: string
          loop_id: string
          reflex_horizon: unknown | null
          updated_at: string
          updated_by: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          cadence?: unknown | null
          created_at?: string
          id?: string
          loop_id: string
          reflex_horizon?: unknown | null
          updated_at?: string
          updated_by?: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          cadence?: unknown | null
          created_at?: string
          id?: string
          loop_id?: string
          reflex_horizon?: unknown | null
          updated_at?: string
          updated_by?: string | null
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      stress_tests: {
        Row: {
          created_at: string
          expected_impact: Json | null
          id: string
          loop_id: string
          name: string
          result: Json | null
          scenario_id: string | null
          severity: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expected_impact?: Json | null
          id?: string
          loop_id: string
          name: string
          result?: Json | null
          scenario_id?: string | null
          severity?: number | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expected_impact?: Json | null
          id?: string
          loop_id?: string
          name?: string
          result?: Json | null
          scenario_id?: string | null
          severity?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      substep_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          loop_type: string | null
          name: string
          scale: string | null
          tags: string[] | null
          template_steps: Json
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          loop_type?: string | null
          name: string
          scale?: string | null
          tags?: string[] | null
          template_steps: Json
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          loop_type?: string | null
          name?: string
          scale?: string | null
          tags?: string[] | null
          template_steps?: Json
          updated_at?: string
          usage_count?: number | null
          user_id?: string
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
      task_links: {
        Row: {
          context: Json | null
          created_at: string
          from_task_id: string
          id: string
          link_type: string
          to_task_id: string
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          from_task_id: string
          id?: string
          link_type: string
          to_task_id: string
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          from_task_id?: string
          id?: string
          link_type?: string
          to_task_id?: string
          user_id?: string
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
          tag: string | null
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
          tag?: string | null
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
          tag?: string | null
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
      watchpoints: {
        Row: {
          armed: boolean | null
          created_at: string
          direction: string
          id: string
          indicator: string
          last_eval: string | null
          last_result: Json | null
          loop_id: string
          owner: string
          playbook_id: string | null
          threshold_band: Json | null
          threshold_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          armed?: boolean | null
          created_at?: string
          direction: string
          id?: string
          indicator: string
          last_eval?: string | null
          last_result?: Json | null
          loop_id: string
          owner: string
          playbook_id?: string | null
          threshold_band?: Json | null
          threshold_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          armed?: boolean | null
          created_at?: string
          direction?: string
          id?: string
          indicator?: string
          last_eval?: string | null
          last_result?: Json | null
          loop_id?: string
          owner?: string
          playbook_id?: string | null
          threshold_band?: Json | null
          threshold_value?: number | null
          updated_at?: string
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
      mv_loop_metrics: {
        Row: {
          breach_count: number | null
          breach_days: number | null
          claim_velocity: number | null
          de_state: string | null
          fatigue_score: number | null
          heartbeat_at: string | null
          last_breach_at: string | null
          latest_i_value: number | null
          latest_r_value: number | null
          latest_t_value: number | null
          latest_tri_at: string | null
          loop_id: string | null
          loop_name: string | null
          loop_status: string | null
          tri_slope: number | null
        }
        Relationships: []
      }
      safe_loop_metrics: {
        Row: {
          breach_count: number | null
          breach_days: number | null
          claim_velocity: number | null
          de_state: string | null
          fatigue_score: number | null
          heartbeat_at: string | null
          last_breach_at: string | null
          latest_i_value: number | null
          latest_r_value: number | null
          latest_t_value: number | null
          latest_tri_at: string | null
          loop_id: string | null
          loop_name: string | null
          loop_status: string | null
          tri_slope: number | null
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
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "rel_tickets_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
      }
    }
    Functions: {
      add_substep: {
        Args: {
          claim_uuid: string
          planned_duration_text?: string
          step_description?: string
          step_owner?: string
          step_title: string
          template_id?: string
        }
        Returns: Json
      }
      apply_retune: {
        Args: {
          approver_id?: string
          band_changes?: Json
          loop_uuid: string
          rationale_text?: string
          srt_changes?: Json
          task_uuid?: string
        }
        Returns: Json
      }
      attach_playbook: {
        Args: { playbook_uuid: string; watchpoint_uuid: string }
        Returns: Json
      }
      compute_coverage: {
        Args: { loop_uuid: string; option_ids: string[] }
        Returns: Json
      }
      create_qa_fixtures: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      create_redesign_task: {
        Args: { loop_uuid: string; reason_text: string; task_capacity?: string }
        Returns: string
      }
      create_task_with_link: {
        Args: {
          capacity_param: string
          context_param?: Json
          from_task_param: string
          loop_id_param: string
        }
        Returns: Json
      }
      create_watchpoint: {
        Args: { loop_uuid: string; payload: Json }
        Returns: Json
      }
      dry_run_trip: {
        Args: { scenario_snapshot?: Json; watchpoint_uuid: string }
        Returns: Json
      }
      enqueue_stress_test: {
        Args: {
          loop_uuid: string
          scenario_uuid: string
          test_severity?: number
        }
        Returns: Json
      }
      evaluate_anti_windup: {
        Args: { claim_uuid: string }
        Returns: Json
      }
      evaluate_mandate: {
        Args: { actor_name: string; leverage_level: string }
        Returns: string
      }
      evaluate_watchpoints: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      finish_claim: {
        Args: { claim_uuid: string }
        Returns: Json
      }
      get_loop_hydrate: {
        Args: { loop_uuid: string }
        Returns: Json
      }
      get_reflexive_context: {
        Args: { loop_uuid: string }
        Returns: Json
      }
      get_scorecard: {
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
      global_search: {
        Args: { limit_param?: number; query_param: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      link_entities: {
        Args: { source_param: Json; target_param: Json }
        Returns: string
      }
      list_conflicts: {
        Args: { actor_name: string }
        Returns: Json
      }
      mark_checkpoint: {
        Args: {
          attachments_json?: Json
          checkpoint_tag?: string
          claim_uuid: string
          summary_text: string
          tri_values_json?: Json
        }
        Returns: Json
      }
      package_for_execution: {
        Args: { option_set_uuid: string }
        Returns: Json
      }
      pause_claim: {
        Args: { claim_uuid: string; rationale_text: string }
        Returns: Json
      }
      publish_loop: {
        Args: { loop_uuid: string }
        Returns: Json
      }
      refresh_loop_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reorder_substeps: {
        Args: { claim_uuid: string; substep_ids: string[] }
        Returns: Json
      }
      reset_all_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_qa_scenario: {
        Args: { scenario_name: string }
        Returns: Json
      }
      run_mcda: {
        Args: { option_ids: string[]; task_uuid: string; weights?: Json }
        Returns: Json
      }
      run_scenario: {
        Args: { loop_uuid: string; params: Json }
        Returns: Json
      }
      save_decision_record: {
        Args: {
          mcda_snapshot?: Json
          option_set_uuid: string
          rationale_text: string
          task_uuid: string
        }
        Returns: Json
      }
      seed_demo_data_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      start_claim: {
        Args: { claim_uuid: string }
        Returns: Json
      }
      suggest_capacity: {
        Args: { context_param?: Json; loop_id_param: string }
        Returns: Json
      }
      suggest_retunes: {
        Args: { lookback_days?: number; loop_uuid: string }
        Returns: Json
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
