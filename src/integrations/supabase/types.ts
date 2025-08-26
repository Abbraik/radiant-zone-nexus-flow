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
      activation_events: {
        Row: {
          as_of: string
          created_at: string | null
          created_by: string
          decision: Json
          event_id: string
          fingerprint: string
          loop_id: string
          time_window: string
        }
        Insert: {
          as_of: string
          created_at?: string | null
          created_by: string
          decision: Json
          event_id?: string
          fingerprint: string
          loop_id: string
          time_window: string
        }
        Update: {
          as_of?: string
          created_at?: string | null
          created_by?: string
          decision?: Json
          event_id?: string
          fingerprint?: string
          loop_id?: string
          time_window?: string
        }
        Relationships: []
      }
      activation_overrides: {
        Row: {
          actor: string
          after: Json
          approved_by: string | null
          before: Json
          created_at: string | null
          event_id: string | null
          override_id: string
          reason: string
        }
        Insert: {
          actor: string
          after: Json
          approved_by?: string | null
          before: Json
          created_at?: string | null
          event_id?: string | null
          override_id?: string
          reason: string
        }
        Update: {
          actor?: string
          after?: Json
          approved_by?: string | null
          before?: Json
          created_at?: string | null
          event_id?: string | null
          override_id?: string
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "activation_overrides_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "activation_events"
            referencedColumns: ["event_id"]
          },
        ]
      }
      actuation_attempts: {
        Row: {
          actor: string
          allowed: boolean
          attempt_id: string
          change_kind: string
          coverage_estimate_pct: number | null
          delta_estimate: number | null
          evaluated_by: string
          evaluated_ms: number
          payload: Json
          reason: string
          task_id: string
          ts: string
        }
        Insert: {
          actor: string
          allowed: boolean
          attempt_id?: string
          change_kind: string
          coverage_estimate_pct?: number | null
          delta_estimate?: number | null
          evaluated_by: string
          evaluated_ms?: number
          payload?: Json
          reason: string
          task_id: string
          ts?: string
        }
        Update: {
          actor?: string
          allowed?: boolean
          attempt_id?: string
          change_kind?: string
          coverage_estimate_pct?: number | null
          delta_estimate?: number | null
          evaluated_by?: string
          evaluated_ms?: number
          payload?: Json
          reason?: string
          task_id?: string
          ts?: string
        }
        Relationships: []
      }
      adopting_entities: {
        Row: {
          entity_id: string
          kind: string
          name: string
          parent_id: string | null
        }
        Insert: {
          entity_id?: string
          kind: string
          name: string
          parent_id?: string | null
        }
        Update: {
          entity_id?: string
          kind?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adopting_entities_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "adopting_entities"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      adoption_events: {
        Row: {
          adopt_id: string
          at: string | null
          detail: Json | null
          event_id: string
          type: string
        }
        Insert: {
          adopt_id: string
          at?: string | null
          detail?: Json | null
          event_id?: string
          type: string
        }
        Update: {
          adopt_id?: string
          at?: string | null
          detail?: Json | null
          event_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_events_adopt_id_fkey"
            columns: ["adopt_id"]
            isOneToOne: false
            referencedRelation: "structural_adoptions"
            referencedColumns: ["adopt_id"]
          },
        ]
      }
      antic_activation_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          indicator: string | null
          kind: string
          loop_code: string | null
          org_id: string
          payload: Json | null
          source: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          indicator?: string | null
          kind: string
          loop_code?: string | null
          org_id: string
          payload?: Json | null
          source: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          indicator?: string | null
          kind?: string
          loop_code?: string | null
          org_id?: string
          payload?: Json | null
          source?: string
        }
        Relationships: []
      }
      antic_backtests: {
        Row: {
          created_at: string | null
          created_by: string | null
          horizon: string
          id: string
          metrics: Json
          org_id: string
          points: Json
          rule_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          horizon: string
          id?: string
          metrics: Json
          org_id: string
          points: Json
          rule_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          horizon?: string
          id?: string
          metrics?: Json
          org_id?: string
          points?: Json
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "antic_backtests_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "antic_trigger_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      antic_buffers: {
        Row: {
          created_at: string | null
          current: number
          history: Json | null
          id: string
          label: string
          org_id: string
          target: number
        }
        Insert: {
          created_at?: string | null
          current: number
          history?: Json | null
          id?: string
          label: string
          org_id: string
          target: number
        }
        Update: {
          created_at?: string | null
          current?: number
          history?: Json | null
          id?: string
          label?: string
          org_id?: string
          target?: number
        }
        Relationships: []
      }
      antic_ews_components: {
        Row: {
          created_at: string | null
          id: string
          label: string
          loop_code: string
          org_id: string
          series: Json
          weight: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          loop_code: string
          org_id: string
          series: Json
          weight: number
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          loop_code?: string
          org_id?: string
          series?: Json
          weight?: number
        }
        Relationships: []
      }
      antic_geo_sentinels: {
        Row: {
          cell_id: string
          created_at: string | null
          id: string
          label: string | null
          org_id: string
          value: number
        }
        Insert: {
          cell_id: string
          created_at?: string | null
          id?: string
          label?: string | null
          org_id: string
          value: number
        }
        Update: {
          cell_id?: string
          created_at?: string | null
          id?: string
          label?: string | null
          org_id?: string
          value?: number
        }
        Relationships: []
      }
      antic_pre_position_orders: {
        Row: {
          cost_ceiling: number | null
          created_at: string | null
          created_by: string
          id: string
          items: Json
          kind: string
          org_id: string
          readiness_score: number | null
          shelf_life_days: number | null
          sla: string | null
          status: string
          suppliers: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          cost_ceiling?: number | null
          created_at?: string | null
          created_by: string
          id?: string
          items: Json
          kind: string
          org_id: string
          readiness_score?: number | null
          shelf_life_days?: number | null
          sla?: string | null
          status?: string
          suppliers?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          cost_ceiling?: number | null
          created_at?: string | null
          created_by?: string
          id?: string
          items?: Json
          kind?: string
          org_id?: string
          readiness_score?: number | null
          shelf_life_days?: number | null
          sla?: string | null
          status?: string
          suppliers?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      antic_scenario_results: {
        Row: {
          affected_loops: string[]
          created_at: string | null
          created_by: string | null
          id: string
          mitigation_delta: number
          notes: string | null
          org_id: string
          scenario_id: string
          with_mitigation_breach_prob: number
          without_mitigation_breach_prob: number
        }
        Insert: {
          affected_loops: string[]
          created_at?: string | null
          created_by?: string | null
          id?: string
          mitigation_delta: number
          notes?: string | null
          org_id: string
          scenario_id: string
          with_mitigation_breach_prob: number
          without_mitigation_breach_prob: number
        }
        Update: {
          affected_loops?: string[]
          created_at?: string | null
          created_by?: string | null
          id?: string
          mitigation_delta?: number
          notes?: string | null
          org_id?: string
          scenario_id?: string
          with_mitigation_breach_prob?: number
          without_mitigation_breach_prob?: number
        }
        Relationships: [
          {
            foreignKeyName: "antic_scenario_results_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "antic_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      antic_scenarios: {
        Row: {
          assumptions: Json
          created_at: string | null
          created_by: string
          id: string
          name: string
          org_id: string
          target_loops: string[]
        }
        Insert: {
          assumptions: Json
          created_at?: string | null
          created_by: string
          id: string
          name: string
          org_id: string
          target_loops: string[]
        }
        Update: {
          assumptions?: Json
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          org_id?: string
          target_loops?: string[]
        }
        Relationships: []
      }
      antic_trigger_firings: {
        Row: {
          activation_event_id: string | null
          created_at: string | null
          fired_at: string
          id: string
          matched_payload: Json
          org_id: string
          rule_id: string
        }
        Insert: {
          activation_event_id?: string | null
          created_at?: string | null
          fired_at?: string
          id?: string
          matched_payload: Json
          org_id: string
          rule_id: string
        }
        Update: {
          activation_event_id?: string | null
          created_at?: string | null
          fired_at?: string
          id?: string
          matched_payload?: Json
          org_id?: string
          rule_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "antic_trigger_firings_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "antic_trigger_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      antic_trigger_rules: {
        Row: {
          action_ref: string
          authority: string
          consent_note: string | null
          created_at: string | null
          created_by: string
          expires_at: string
          expr_ast: Json
          expr_raw: string
          id: string
          name: string
          org_id: string
          updated_at: string | null
          valid_from: string
          window_hours: number
        }
        Insert: {
          action_ref: string
          authority: string
          consent_note?: string | null
          created_at?: string | null
          created_by: string
          expires_at: string
          expr_ast: Json
          expr_raw: string
          id?: string
          name: string
          org_id: string
          updated_at?: string | null
          valid_from: string
          window_hours: number
        }
        Update: {
          action_ref?: string
          authority?: string
          consent_note?: string | null
          created_at?: string | null
          created_by?: string
          expires_at?: string
          expr_ast?: Json
          expr_raw?: string
          id?: string
          name?: string
          org_id?: string
          updated_at?: string | null
          valid_from?: string
          window_hours?: number
        }
        Relationships: []
      }
      antic_watchpoints: {
        Row: {
          buffer_adequacy: number | null
          confidence: number | null
          created_at: string
          created_by: string
          ews_prob: number
          id: string
          lead_time_days: number | null
          loop_codes: string[]
          notes: string | null
          org_id: string
          review_at: string
          risk_channel: string
          status: string
          updated_at: string
        }
        Insert: {
          buffer_adequacy?: number | null
          confidence?: number | null
          created_at?: string
          created_by: string
          ews_prob: number
          id?: string
          lead_time_days?: number | null
          loop_codes: string[]
          notes?: string | null
          org_id: string
          review_at: string
          risk_channel: string
          status?: string
          updated_at?: string
        }
        Update: {
          buffer_adequacy?: number | null
          confidence?: number | null
          created_at?: string
          created_by?: string
          ews_prob?: number
          id?: string
          lead_time_days?: number | null
          loop_codes?: string[]
          notes?: string | null
          org_id?: string
          review_at?: string
          risk_channel?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_tasks_queue: {
        Row: {
          capacity: string
          created_at: string | null
          created_by: string | null
          due_at: string | null
          id: string
          org_id: string
          payload: Json
          status: string
          title: string
        }
        Insert: {
          capacity: string
          created_at?: string | null
          created_by?: string | null
          due_at?: string | null
          id?: string
          org_id: string
          payload: Json
          status?: string
          title: string
        }
        Update: {
          capacity?: string
          created_at?: string | null
          created_by?: string | null
          due_at?: string | null
          id?: string
          org_id?: string
          payload?: Json
          status?: string
          title?: string
        }
        Relationships: []
      }
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
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          org_id: string
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          org_id?: string
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          org_id?: string
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
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
      band_crossings_5c: {
        Row: {
          at: string | null
          created_at: string | null
          direction: string
          id: string
          loop_id: string
          user_id: string
          value: number
        }
        Insert: {
          at?: string | null
          created_at?: string | null
          direction: string
          id?: string
          loop_id: string
          user_id: string
          value: number
        }
        Update: {
          at?: string | null
          created_at?: string | null
          direction?: string
          id?: string
          loop_id?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      band_weight_changes: {
        Row: {
          after: Json
          anchor: string
          before: Json
          created_at: string | null
          id: string
          loop_code: string
          rationale: string
          tier: string
          user_id: string
        }
        Insert: {
          after: Json
          anchor: string
          before: Json
          created_at?: string | null
          id?: string
          loop_code: string
          rationale: string
          tier: string
          user_id: string
        }
        Update: {
          after?: Json
          anchor?: string
          before?: Json
          created_at?: string | null
          id?: string
          loop_code?: string
          rationale?: string
          tier?: string
          user_id?: string
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
      cascades: {
        Row: {
          created_at: string | null
          from_loop_id: string
          id: string
          note: string | null
          relation: string
          to_loop_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          from_loop_id: string
          id?: string
          note?: string | null
          relation: string
          to_loop_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          from_loop_id?: string
          id?: string
          note?: string | null
          relation?: string
          to_loop_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cascades_from_loop_id_fkey"
            columns: ["from_loop_id"]
            isOneToOne: false
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "cascades_from_loop_id_fkey"
            columns: ["from_loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cascades_from_loop_id_fkey"
            columns: ["from_loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "cascades_from_loop_id_fkey"
            columns: ["from_loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "cascades_to_loop_id_fkey"
            columns: ["to_loop_id"]
            isOneToOne: false
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "cascades_to_loop_id_fkey"
            columns: ["to_loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cascades_to_loop_id_fkey"
            columns: ["to_loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "cascades_to_loop_id_fkey"
            columns: ["to_loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
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
      claims_5c: {
        Row: {
          assignee: string
          created_at: string | null
          evidence: Json | null
          finished_at: string | null
          id: string
          last_checkpoint_at: string | null
          leverage: Database["public"]["Enums"]["leverage_5c"]
          loop_id: string
          mandate_status:
            | Database["public"]["Enums"]["mandate_status_5c"]
            | null
          pause_reason: string | null
          paused_at: string | null
          raci: Json | null
          sprint_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["claim_status_5c"] | null
          task_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignee: string
          created_at?: string | null
          evidence?: Json | null
          finished_at?: string | null
          id?: string
          last_checkpoint_at?: string | null
          leverage?: Database["public"]["Enums"]["leverage_5c"]
          loop_id: string
          mandate_status?:
            | Database["public"]["Enums"]["mandate_status_5c"]
            | null
          pause_reason?: string | null
          paused_at?: string | null
          raci?: Json | null
          sprint_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["claim_status_5c"] | null
          task_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignee?: string
          created_at?: string | null
          evidence?: Json | null
          finished_at?: string | null
          id?: string
          last_checkpoint_at?: string | null
          leverage?: Database["public"]["Enums"]["leverage_5c"]
          loop_id?: string
          mandate_status?:
            | Database["public"]["Enums"]["mandate_status_5c"]
            | null
          pause_reason?: string | null
          paused_at?: string | null
          raci?: Json | null
          sprint_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["claim_status_5c"] | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_5c_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_5c"
            referencedColumns: ["id"]
          },
        ]
      }
      compass_anchor_map: {
        Row: {
          anchor: string
          created_at: string | null
          id: string
          indicator_key: string
          loop_id: string
          notes: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          anchor: string
          created_at?: string | null
          id?: string
          indicator_key: string
          loop_id: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Update: {
          anchor?: string
          created_at?: string | null
          id?: string
          indicator_key?: string
          loop_id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      compass_snapshots: {
        Row: {
          as_of: string
          ci: number
          consent_avg: number | null
          created_at: string | null
          drift: Json
          loop_id: string
          snap_id: string
          tri: Json
          user_id: string
        }
        Insert: {
          as_of: string
          ci: number
          consent_avg?: number | null
          created_at?: string | null
          drift: Json
          loop_id: string
          snap_id?: string
          tri: Json
          user_id?: string
        }
        Update: {
          as_of?: string
          ci?: number
          consent_avg?: number | null
          created_at?: string | null
          drift?: Json
          loop_id?: string
          snap_id?: string
          tri?: Json
          user_id?: string
        }
        Relationships: []
      }
      compass_weights: {
        Row: {
          created_at: string | null
          id: string
          loop_id: string | null
          updated_at: string | null
          user_id: string
          w_domains: number | null
          w_institutions: number | null
          w_legitimacy: number | null
          w_population: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          loop_id?: string | null
          updated_at?: string | null
          user_id?: string
          w_domains?: number | null
          w_institutions?: number | null
          w_legitimacy?: number | null
          w_population?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          loop_id?: string | null
          updated_at?: string | null
          user_id?: string
          w_domains?: number | null
          w_institutions?: number | null
          w_legitimacy?: number | null
          w_population?: number | null
        }
        Relationships: []
      }
      conformance_findings: {
        Row: {
          detail: Json | null
          finding_id: string
          passed: boolean
          rule_id: string
          run_id: string
        }
        Insert: {
          detail?: Json | null
          finding_id?: string
          passed: boolean
          rule_id: string
          run_id: string
        }
        Update: {
          detail?: Json | null
          finding_id?: string
          passed?: boolean
          rule_id?: string
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conformance_findings_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "conformance_rules"
            referencedColumns: ["rule_id"]
          },
          {
            foreignKeyName: "conformance_findings_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "conformance_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      conformance_rules: {
        Row: {
          created_at: string | null
          dossier_id: string
          rule_expr: Json
          rule_id: string
          rule_title: string
          severity: string
          std_ver_id: string | null
        }
        Insert: {
          created_at?: string | null
          dossier_id: string
          rule_expr: Json
          rule_id?: string
          rule_title: string
          severity: string
          std_ver_id?: string | null
        }
        Update: {
          created_at?: string | null
          dossier_id?: string
          rule_expr?: Json
          rule_id?: string
          rule_title?: string
          severity?: string
          std_ver_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conformance_rules_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "conformance_rules_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "conformance_rules_std_ver_id_fkey"
            columns: ["std_ver_id"]
            isOneToOne: false
            referencedRelation: "standard_versions"
            referencedColumns: ["std_ver_id"]
          },
        ]
      }
      conformance_runs: {
        Row: {
          dossier_id: string
          finished_at: string | null
          run_id: string
          started_at: string | null
          status: string | null
          summary: Json | null
        }
        Insert: {
          dossier_id: string
          finished_at?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
          summary?: Json | null
        }
        Update: {
          dossier_id?: string
          finished_at?: string | null
          run_id?: string
          started_at?: string | null
          status?: string | null
          summary?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conformance_runs_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "conformance_runs_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
        ]
      }
      conformance_targets: {
        Row: {
          endpoint: string | null
          expected: Json | null
          kpi_key: string | null
          std_ver_id: string
          target_id: string
          target_kind: string
        }
        Insert: {
          endpoint?: string | null
          expected?: Json | null
          kpi_key?: string | null
          std_ver_id: string
          target_id?: string
          target_kind: string
        }
        Update: {
          endpoint?: string | null
          expected?: Json | null
          kpi_key?: string | null
          std_ver_id?: string
          target_id?: string
          target_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "conformance_targets_std_ver_id_fkey"
            columns: ["std_ver_id"]
            isOneToOne: false
            referencedRelation: "standard_versions"
            referencedColumns: ["std_ver_id"]
          },
        ]
      }
      consent_cells: {
        Row: {
          as_of: string
          cell_id: string
          consent_score: number
          created_at: string | null
          domain: string
          region: string
          sources: Json | null
          user_id: string
        }
        Insert: {
          as_of: string
          cell_id?: string
          consent_score: number
          created_at?: string | null
          domain: string
          region: string
          sources?: Json | null
          user_id?: string
        }
        Update: {
          as_of?: string
          cell_id?: string
          consent_score?: number
          created_at?: string | null
          domain?: string
          region?: string
          sources?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      controller_tunings: {
        Row: {
          after: Json
          before: Json
          created_at: string | null
          effective_from: string | null
          id: string
          indicator: string
          loop_code: string
          oscillation_delta: number | null
          rationale: string
          rmse_delta: number | null
          user_id: string
        }
        Insert: {
          after: Json
          before: Json
          created_at?: string | null
          effective_from?: string | null
          id?: string
          indicator: string
          loop_code: string
          oscillation_delta?: number | null
          rationale: string
          rmse_delta?: number | null
          user_id: string
        }
        Update: {
          after?: Json
          before?: Json
          created_at?: string | null
          effective_from?: string | null
          id?: string
          indicator?: string
          loop_code?: string
          oscillation_delta?: number | null
          rationale?: string
          rmse_delta?: number | null
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
      de_bands_5c: {
        Row: {
          asymmetry: number | null
          created_at: string | null
          id: string
          indicator: string
          loop_id: string
          lower_bound: number | null
          notes: string | null
          smoothing_alpha: number | null
          updated_at: string | null
          updated_by: string | null
          upper_bound: number | null
          user_id: string
        }
        Insert: {
          asymmetry?: number | null
          created_at?: string | null
          id?: string
          indicator?: string
          loop_id: string
          lower_bound?: number | null
          notes?: string | null
          smoothing_alpha?: number | null
          updated_at?: string | null
          updated_by?: string | null
          upper_bound?: number | null
          user_id: string
        }
        Update: {
          asymmetry?: number | null
          created_at?: string | null
          id?: string
          indicator?: string
          loop_id?: string
          lower_bound?: number | null
          notes?: string | null
          smoothing_alpha?: number | null
          updated_at?: string | null
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
      delib_constraints: {
        Row: {
          active: boolean
          id: string
          label: string
          org_id: string
          session_id: string
        }
        Insert: {
          active?: boolean
          id?: string
          label: string
          org_id: string
          session_id: string
        }
        Update: {
          active?: boolean
          id?: string
          label?: string
          org_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_constraints_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_criteria: {
        Row: {
          created_at: string | null
          description: string | null
          direction: string
          id: string
          label: string
          order_index: number
          org_id: string
          scale_hint: string | null
          session_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          direction: string
          id?: string
          label: string
          order_index?: number
          org_id: string
          scale_hint?: string | null
          session_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          direction?: string
          id?: string
          label?: string
          order_index?: number
          org_id?: string
          scale_hint?: string | null
          session_id?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "delib_criteria_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_dossiers: {
        Row: {
          decision_summary: string
          guardrails: Json | null
          handoffs: string[]
          id: string
          mandate_path: Json | null
          org_id: string
          participation_plan: Json | null
          published_at: string
          published_by: string
          rejected_option_ids: string[]
          robustness_notes: string | null
          selected_option_ids: string[]
          session_id: string
          title: string
          tradeoff_notes: string | null
          version: string
        }
        Insert: {
          decision_summary: string
          guardrails?: Json | null
          handoffs: string[]
          id?: string
          mandate_path?: Json | null
          org_id: string
          participation_plan?: Json | null
          published_at?: string
          published_by: string
          rejected_option_ids: string[]
          robustness_notes?: string | null
          selected_option_ids: string[]
          session_id: string
          title: string
          tradeoff_notes?: string | null
          version: string
        }
        Update: {
          decision_summary?: string
          guardrails?: Json | null
          handoffs?: string[]
          id?: string
          mandate_path?: Json | null
          org_id?: string
          participation_plan?: Json | null
          published_at?: string
          published_by?: string
          rejected_option_ids?: string[]
          robustness_notes?: string | null
          selected_option_ids?: string[]
          session_id?: string
          title?: string
          tradeoff_notes?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_dossiers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          kind: string
          org_id: string
          payload: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          kind: string
          org_id: string
          payload?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          kind?: string
          org_id?: string
          payload?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_frontier: {
        Row: {
          cost: number
          created_at: string | null
          equity: number
          feasible: boolean
          id: string
          label: string | null
          option_ids: string[]
          org_id: string
          regret_worst: number | null
          risk: number
          session_id: string
        }
        Insert: {
          cost: number
          created_at?: string | null
          equity: number
          feasible?: boolean
          id?: string
          label?: string | null
          option_ids: string[]
          org_id: string
          regret_worst?: number | null
          risk: number
          session_id: string
        }
        Update: {
          cost?: number
          created_at?: string | null
          equity?: number
          feasible?: boolean
          id?: string
          label?: string | null
          option_ids?: string[]
          org_id?: string
          regret_worst?: number | null
          risk?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_frontier_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_guardrails: {
        Row: {
          id: string
          kind: string
          label: string
          org_id: string
          required: boolean
          selected: boolean
          session_id: string
          value: string | null
        }
        Insert: {
          id?: string
          kind: string
          label: string
          org_id: string
          required?: boolean
          selected?: boolean
          session_id: string
          value?: string | null
        }
        Update: {
          id?: string
          kind?: string
          label?: string
          org_id?: string
          required?: boolean
          selected?: boolean
          session_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delib_guardrails_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_handoffs: {
        Row: {
          created_at: string | null
          id: string
          org_id: string
          payload: Json | null
          session_id: string
          task_id: string | null
          to_capacity: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          org_id: string
          payload?: Json | null
          session_id: string
          task_id?: string | null
          to_capacity: string
        }
        Update: {
          created_at?: string | null
          id?: string
          org_id?: string
          payload?: Json | null
          session_id?: string
          task_id?: string | null
          to_capacity?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_handoffs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_mandate_checks: {
        Row: {
          id: string
          label: string
          note: string | null
          org_id: string
          session_id: string
          status: string
        }
        Insert: {
          id?: string
          label: string
          note?: string | null
          org_id: string
          session_id: string
          status: string
        }
        Update: {
          id?: string
          label?: string
          note?: string | null
          org_id?: string
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_mandate_checks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_options: {
        Row: {
          authority_flag: string | null
          costs: Json | null
          created_at: string | null
          equity_note: string | null
          id: string
          latency_days: number | null
          name: string
          org_id: string
          session_id: string
          synopsis: string | null
          tags: string[] | null
        }
        Insert: {
          authority_flag?: string | null
          costs?: Json | null
          created_at?: string | null
          equity_note?: string | null
          id?: string
          latency_days?: number | null
          name: string
          org_id: string
          session_id: string
          synopsis?: string | null
          tags?: string[] | null
        }
        Update: {
          authority_flag?: string | null
          costs?: Json | null
          created_at?: string | null
          equity_note?: string | null
          id?: string
          latency_days?: number | null
          name?: string
          org_id?: string
          session_id?: string
          synopsis?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "delib_options_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_participation: {
        Row: {
          audience: string | null
          date: string | null
          id: string
          label: string
          org_id: string
          session_id: string
          status: string
        }
        Insert: {
          audience?: string | null
          date?: string | null
          id?: string
          label: string
          org_id: string
          session_id: string
          status?: string
        }
        Update: {
          audience?: string | null
          date?: string | null
          id?: string
          label?: string
          org_id?: string
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_participation_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_scenario_outcomes: {
        Row: {
          id: string
          option_id: string
          org_id: string
          outcome_score: number
          risk_delta: number | null
          scenario_id: string
          session_id: string
        }
        Insert: {
          id?: string
          option_id: string
          org_id: string
          outcome_score: number
          risk_delta?: number | null
          scenario_id: string
          session_id: string
        }
        Update: {
          id?: string
          option_id?: string
          org_id?: string
          outcome_score?: number
          risk_delta?: number | null
          scenario_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_scenario_outcomes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "delib_mcda_totals"
            referencedColumns: ["option_id"]
          },
          {
            foreignKeyName: "delib_scenario_outcomes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "delib_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delib_scenario_outcomes_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "delib_scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delib_scenario_outcomes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_scenarios: {
        Row: {
          antic_scenario_id: string | null
          created_at: string | null
          id: string
          name: string
          org_id: string
          session_id: string
          summary: string | null
        }
        Insert: {
          antic_scenario_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          org_id: string
          session_id: string
          summary?: string | null
        }
        Update: {
          antic_scenario_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          org_id?: string
          session_id?: string
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delib_scenarios_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_scores: {
        Row: {
          criterion_id: string
          evidence_refs: string[] | null
          id: string
          option_id: string
          org_id: string
          score: number
          session_id: string
        }
        Insert: {
          criterion_id: string
          evidence_refs?: string[] | null
          id?: string
          option_id: string
          org_id: string
          score: number
          session_id: string
        }
        Update: {
          criterion_id?: string
          evidence_refs?: string[] | null
          id?: string
          option_id?: string
          org_id?: string
          score?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delib_scores_criterion_id_fkey"
            columns: ["criterion_id"]
            isOneToOne: false
            referencedRelation: "delib_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delib_scores_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "delib_mcda_totals"
            referencedColumns: ["option_id"]
          },
          {
            foreignKeyName: "delib_scores_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "delib_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delib_scores_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_sessions: {
        Row: {
          activation_vector: Json | null
          created_at: string
          created_by: string
          id: string
          loop_code: string
          mission: string | null
          org_id: string
          status: string
          updated_at: string
        }
        Insert: {
          activation_vector?: Json | null
          created_at?: string
          created_by: string
          id?: string
          loop_code: string
          mission?: string | null
          org_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          activation_vector?: Json | null
          created_at?: string
          created_by?: string
          id?: string
          loop_code?: string
          mission?: string | null
          org_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      dossier_links: {
        Row: {
          dossier_id: string
          id: string
          relation: string
          task_id: string | null
        }
        Insert: {
          dossier_id: string
          id?: string
          relation: string
          task_id?: string | null
        }
        Update: {
          dossier_id?: string
          id?: string
          relation?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dossier_links_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "dossier_links_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
        ]
      }
      dossier_versions: {
        Row: {
          change_log: string | null
          created_at: string | null
          created_by: string | null
          dossier_id: string
          id: string
          snapshot: Json | null
          version: string
        }
        Insert: {
          change_log?: string | null
          created_at?: string | null
          created_by?: string | null
          dossier_id: string
          id?: string
          snapshot?: Json | null
          version: string
        }
        Update: {
          change_log?: string | null
          created_at?: string | null
          created_by?: string | null
          dossier_id?: string
          id?: string
          snapshot?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "dossier_versions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "dossier_versions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
        ]
      }
      dq_events: {
        Row: {
          created_at: string
          detail: Json
          event_id: string
          indicator_key: string | null
          kind: string
          severity: string
          source_id: string
          ts: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detail?: Json
          event_id?: string
          indicator_key?: string | null
          kind: string
          severity: string
          source_id: string
          ts: string
          user_id?: string
        }
        Update: {
          created_at?: string
          detail?: Json
          event_id?: string
          indicator_key?: string | null
          kind?: string
          severity?: string
          source_id?: string
          ts?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dq_events_indicator_key_fkey"
            columns: ["indicator_key"]
            isOneToOne: false
            referencedRelation: "indicator_registry"
            referencedColumns: ["indicator_key"]
          },
          {
            foreignKeyName: "dq_events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source_registry"
            referencedColumns: ["source_id"]
          },
        ]
      }
      dq_status: {
        Row: {
          as_of: string
          created_at: string
          id: string
          indicator_key: string
          missingness: number
          outlier_rate: number
          quality: string
          schema_drift: boolean
          source_id: string
          staleness_seconds: number
          user_id: string
        }
        Insert: {
          as_of: string
          created_at?: string
          id?: string
          indicator_key: string
          missingness?: number
          outlier_rate?: number
          quality: string
          schema_drift?: boolean
          source_id: string
          staleness_seconds?: number
          user_id?: string
        }
        Update: {
          as_of?: string
          created_at?: string
          id?: string
          indicator_key?: string
          missingness?: number
          outlier_rate?: number
          quality?: string
          schema_drift?: boolean
          source_id?: string
          staleness_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dq_status_indicator_key_fkey"
            columns: ["indicator_key"]
            isOneToOne: false
            referencedRelation: "indicator_registry"
            referencedColumns: ["indicator_key"]
          },
          {
            foreignKeyName: "dq_status_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source_registry"
            referencedColumns: ["source_id"]
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
      evaluations: {
        Row: {
          created_at: string | null
          id: string
          indicators: Json
          loop_code: string
          method: string
          notes: string | null
          review_at: string
          start_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          indicators: Json
          loop_code: string
          method: string
          notes?: string | null
          review_at: string
          start_at: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          indicators?: Json
          loop_code?: string
          method?: string
          notes?: string | null
          review_at?: string
          start_at?: string
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
      experiments: {
        Row: {
          arms: Json
          created_at: string | null
          end_at: string | null
          hypothesis: string
          id: string
          loop_code: string
          metrics: Json
          name: string
          start_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          arms: Json
          created_at?: string | null
          end_at?: string | null
          hypothesis: string
          id?: string
          loop_code: string
          metrics: Json
          name: string
          start_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          arms?: Json
          created_at?: string | null
          end_at?: string | null
          hypothesis?: string
          id?: string
          loop_code?: string
          metrics?: Json
          name?: string
          start_at?: string | null
          status?: string
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
      guardrail_enforcements: {
        Row: {
          actor: string
          details: Json
          event_id: string
          result: string
          rule: string
          task_id: string
          ts: string
        }
        Insert: {
          actor: string
          details?: Json
          event_id?: string
          result: string
          rule: string
          task_id: string
          ts?: string
        }
        Update: {
          actor?: string
          details?: Json
          event_id?: string
          result?: string
          rule?: string
          task_id?: string
          ts?: string
        }
        Relationships: []
      }
      guardrail_policies: {
        Row: {
          capacity: string
          concurrent_substeps_limit: number | null
          coverage_limit_pct: number | null
          created_at: string
          daily_delta_limit: number | null
          evaluation_required_after_renewals: number
          loop_id: string | null
          name: string
          policy_id: string
          renewal_limit: number
          template_key: string
          timebox_hours: number
          updated_at: string
        }
        Insert: {
          capacity: string
          concurrent_substeps_limit?: number | null
          coverage_limit_pct?: number | null
          created_at?: string
          daily_delta_limit?: number | null
          evaluation_required_after_renewals?: number
          loop_id?: string | null
          name: string
          policy_id?: string
          renewal_limit?: number
          template_key: string
          timebox_hours?: number
          updated_at?: string
        }
        Update: {
          capacity?: string
          concurrent_substeps_limit?: number | null
          coverage_limit_pct?: number | null
          created_at?: string
          daily_delta_limit?: number | null
          evaluation_required_after_renewals?: number
          loop_id?: string | null
          name?: string
          policy_id?: string
          renewal_limit?: number
          template_key?: string
          timebox_hours?: number
          updated_at?: string
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
      harmonization_conflicts: {
        Row: {
          conflict_id: string
          detected_at: string
          reason: string
          recommendation: string
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          risk_score: number
          snl_id: string
          tasks: string[]
        }
        Insert: {
          conflict_id?: string
          detected_at?: string
          reason: string
          recommendation: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score: number
          snl_id: string
          tasks: string[]
        }
        Update: {
          conflict_id?: string
          detected_at?: string
          reason?: string
          recommendation?: string
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          risk_score?: number
          snl_id?: string
          tasks?: string[]
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
      horizon_goals: {
        Row: {
          created_at: string | null
          description: string
          goal_id: string
          horizon: string
          owner: string
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          goal_id?: string
          horizon: string
          owner: string
          status?: string | null
          title: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          description?: string
          goal_id?: string
          horizon?: string
          owner?: string
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      hub_allocations: {
        Row: {
          alloc_id: string
          alloc_pct: number
          created_at: string
          notes: string | null
          region: string | null
          snl_id: string
          task_id: string
          time_window: unknown
          updated_at: string
        }
        Insert: {
          alloc_id?: string
          alloc_pct: number
          created_at?: string
          notes?: string | null
          region?: string | null
          snl_id: string
          task_id: string
          time_window: unknown
          updated_at?: string
        }
        Update: {
          alloc_id?: string
          alloc_pct?: number
          created_at?: string
          notes?: string | null
          region?: string | null
          snl_id?: string
          task_id?: string
          time_window?: unknown
          updated_at?: string
        }
        Relationships: []
      }
      incident_events: {
        Row: {
          at: string
          created_at: string
          id: string
          incident_id: string | null
          kind: string
          payload: Json
          user_id: string
        }
        Insert: {
          at?: string
          created_at?: string
          id?: string
          incident_id?: string | null
          kind: string
          payload: Json
          user_id: string
        }
        Update: {
          at?: string
          created_at?: string
          id?: string
          incident_id?: string | null
          kind?: string
          payload?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_events_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      incidents: {
        Row: {
          created_at: string
          guardrails: Json | null
          id: string
          indicator: string
          loop_code: string
          severity: number
          srt: Json
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          guardrails?: Json | null
          id?: string
          indicator: string
          loop_code: string
          severity: number
          srt: Json
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          guardrails?: Json | null
          id?: string
          indicator?: string
          loop_code?: string
          severity?: number
          srt?: Json
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      indicator_readings: {
        Row: {
          id: number
          indicator: string
          loop_code: string
          lower: number | null
          org_id: string
          t: string
          upper: number | null
          value: number
        }
        Insert: {
          id?: number
          indicator: string
          loop_code: string
          lower?: number | null
          org_id: string
          t: string
          upper?: number | null
          value: number
        }
        Update: {
          id?: number
          indicator?: string
          loop_code?: string
          lower?: number | null
          org_id?: string
          t?: string
          upper?: number | null
          value?: number
        }
        Relationships: []
      }
      indicator_registry: {
        Row: {
          created_at: string
          indicator_key: string
          loop_id: string | null
          notes: string | null
          snl_key: string | null
          title: string
          transform: string | null
          triad_tag: string | null
          unit: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          indicator_key: string
          loop_id?: string | null
          notes?: string | null
          snl_key?: string | null
          title: string
          transform?: string | null
          triad_tag?: string | null
          unit: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          indicator_key?: string
          loop_id?: string | null
          notes?: string | null
          snl_key?: string | null
          title?: string
          transform?: string | null
          triad_tag?: string | null
          unit?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicator_registry_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "indicator_registry_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "indicator_registry_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "indicator_registry_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
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
      ingestion_runs: {
        Row: {
          created_at: string
          finished_at: string | null
          lag_seconds: number
          message: string | null
          rows_in: number
          rows_kept: number
          run_id: string
          source_id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          finished_at?: string | null
          lag_seconds?: number
          message?: string | null
          rows_in?: number
          rows_kept?: number
          run_id?: string
          source_id: string
          started_at?: string
          status: string
          user_id?: string
        }
        Update: {
          created_at?: string
          finished_at?: string | null
          lag_seconds?: number
          message?: string | null
          rows_in?: number
          rows_kept?: number
          run_id?: string
          source_id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_runs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source_registry"
            referencedColumns: ["source_id"]
          },
        ]
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
      learning_hubs: {
        Row: {
          active: boolean | null
          author: string
          capacity: string
          created_at: string | null
          hub_id: string
          mdx_content: string
          updated_at: string | null
          version: string
        }
        Insert: {
          active?: boolean | null
          author: string
          capacity: string
          created_at?: string | null
          hub_id?: string
          mdx_content: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          active?: boolean | null
          author?: string
          capacity?: string
          created_at?: string | null
          hub_id?: string
          mdx_content?: string
          updated_at?: string | null
          version?: string
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
      loop_horizon_links: {
        Row: {
          created_at: string | null
          goal_id: string
          id: string
          loop_id: string
          user_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          goal_id: string
          id?: string
          loop_id: string
          user_id?: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          goal_id?: string
          id?: string
          loop_id?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "loop_horizon_links_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "horizon_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
      loop_nodes: {
        Row: {
          created_at: string
          id: string
          kind: string
          label: string
          loop_id: string
          meta: Json | null
          pos: Json | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          label: string
          loop_id: string
          meta?: Json | null
          pos?: Json | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          label?: string
          loop_id?: string
          meta?: Json | null
          pos?: Json | null
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
      loop_scorecards_5c: {
        Row: {
          breach_days: number | null
          claim_velocity: number | null
          de_state: string | null
          fatigue: number | null
          heartbeat_at: string | null
          last_tri: Json | null
          loop_id: string
          tri_slope: number | null
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      loop_shared_nodes: {
        Row: {
          created_at: string
          id: string
          loop_id: string
          note: string | null
          role: string | null
          snl_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          loop_id: string
          note?: string | null
          role?: string | null
          snl_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          loop_id?: string
          note?: string | null
          role?: string | null
          snl_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_loop_shared_nodes_snl_id"
            columns: ["snl_id"]
            isOneToOne: false
            referencedRelation: "shared_nodes"
            referencedColumns: ["snl_id"]
          },
        ]
      }
      loop_signal_scores: {
        Row: {
          as_of: string
          created_at: string
          details: Json
          dispersion: number
          hub_load: number
          legitimacy_delta: number
          loop_id: string
          persistence: number
          severity: number
          time_window: string
          user_id: string
        }
        Insert: {
          as_of: string
          created_at?: string
          details?: Json
          dispersion?: number
          hub_load?: number
          legitimacy_delta?: number
          loop_id: string
          persistence?: number
          severity?: number
          time_window: string
          user_id?: string
        }
        Update: {
          as_of?: string
          created_at?: string
          details?: Json
          dispersion?: number
          hub_load?: number
          legitimacy_delta?: number
          loop_id?: string
          persistence?: number
          severity?: number
          time_window?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loop_signal_scores_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "loop_signal_scores_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loop_signal_scores_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "loop_signal_scores_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
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
          domain: string | null
          id: string
          layer: string | null
          leverage_default: Database["public"]["Enums"]["leverage_type"] | null
          loop_code: string | null
          loop_type: Database["public"]["Enums"]["loop_type"] | null
          metadata: Json | null
          motif: string | null
          name: string
          notes: string | null
          scale: Database["public"]["Enums"]["scale_type"] | null
          source_tag: string | null
          status: string | null
          thresholds: Json | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          version: number | null
        }
        Insert: {
          controller?: Json | null
          created_at?: string | null
          description?: string | null
          domain?: string | null
          id?: string
          layer?: string | null
          leverage_default?: Database["public"]["Enums"]["leverage_type"] | null
          loop_code?: string | null
          loop_type?: Database["public"]["Enums"]["loop_type"] | null
          metadata?: Json | null
          motif?: string | null
          name: string
          notes?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          source_tag?: string | null
          status?: string | null
          thresholds?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          version?: number | null
        }
        Update: {
          controller?: Json | null
          created_at?: string | null
          description?: string | null
          domain?: string | null
          id?: string
          layer?: string | null
          leverage_default?: Database["public"]["Enums"]["leverage_type"] | null
          loop_code?: string | null
          loop_type?: Database["public"]["Enums"]["loop_type"] | null
          metadata?: Json | null
          motif?: string | null
          name?: string
          notes?: string | null
          scale?: Database["public"]["Enums"]["scale_type"] | null
          source_tag?: string | null
          status?: string | null
          thresholds?: Json | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
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
      mandate_rules_5c: {
        Row: {
          actor: string
          allowed_levers: string[] | null
          created_at: string | null
          id: string
          notes: string | null
          org_id: string | null
          restrictions: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actor: string
          allowed_levers?: string[] | null
          created_at?: string | null
          id?: string
          notes?: string | null
          org_id?: string | null
          restrictions?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actor?: string
          allowed_levers?: string[] | null
          created_at?: string | null
          id?: string
          notes?: string | null
          org_id?: string | null
          restrictions?: Json | null
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
      normalized_observations: {
        Row: {
          band_pos: number
          created_at: string
          indicator_key: string
          loop_id: string
          norm_id: string
          notes: string | null
          severity: number
          status: string
          ts: string
          user_id: string
          value: number
          value_smoothed: number
        }
        Insert: {
          band_pos: number
          created_at?: string
          indicator_key: string
          loop_id: string
          norm_id?: string
          notes?: string | null
          severity?: number
          status: string
          ts: string
          user_id?: string
          value: number
          value_smoothed: number
        }
        Update: {
          band_pos?: number
          created_at?: string
          indicator_key?: string
          loop_id?: string
          norm_id?: string
          notes?: string | null
          severity?: number
          status?: string
          ts?: string
          user_id?: string
          value?: number
          value_smoothed?: number
        }
        Relationships: [
          {
            foreignKeyName: "normalized_observations_indicator_key_fkey"
            columns: ["indicator_key"]
            isOneToOne: false
            referencedRelation: "indicator_registry"
            referencedColumns: ["indicator_key"]
          },
          {
            foreignKeyName: "normalized_observations_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "normalized_observations_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "loops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "normalized_observations_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "mv_loop_metrics"
            referencedColumns: ["loop_id"]
          },
          {
            foreignKeyName: "normalized_observations_loop_id_fkey"
            columns: ["loop_id"]
            isOneToOne: false
            referencedRelation: "safe_loop_metrics"
            referencedColumns: ["loop_id"]
          },
        ]
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
      override_events: {
        Row: {
          actor: string
          after: Json
          approved_by: string | null
          before: Json
          override_id: string
          rationale: string
          scope: string
          task_id: string
          ts: string
        }
        Insert: {
          actor: string
          after?: Json
          approved_by?: string | null
          before?: Json
          override_id?: string
          rationale: string
          scope: string
          task_id: string
          ts?: string
        }
        Update: {
          actor?: string
          after?: Json
          approved_by?: string | null
          before?: Json
          override_id?: string
          rationale?: string
          scope?: string
          task_id?: string
          ts?: string
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
      pii_policies: {
        Row: {
          column_name: string
          created_at: string | null
          id: string
          pii_class: string
          redaction_strategy: string
          table_name: string
        }
        Insert: {
          column_name: string
          created_at?: string | null
          id?: string
          pii_class: string
          redaction_strategy: string
          table_name: string
        }
        Update: {
          column_name?: string
          created_at?: string | null
          id?: string
          pii_class?: string
          redaction_strategy?: string
          table_name?: string
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
          active: boolean | null
          capacity: string
          content: Json
          created_at: string | null
          playbook_key: string
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          capacity: string
          content?: Json
          created_at?: string | null
          playbook_key: string
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          capacity?: string
          content?: Json
          created_at?: string | null
          playbook_key?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pre_position_orders: {
        Row: {
          cancel_by: string | null
          cost_ceiling: number | null
          created_at: string | null
          id: string
          items: Json
          kind: string
          shelf_life_days: number | null
          sla: string | null
          status: string
          suppliers: string[] | null
          user_id: string
        }
        Insert: {
          cancel_by?: string | null
          cost_ceiling?: number | null
          created_at?: string | null
          id?: string
          items: Json
          kind: string
          shelf_life_days?: number | null
          sla?: string | null
          status?: string
          suppliers?: string[] | null
          user_id: string
        }
        Update: {
          cancel_by?: string | null
          cost_ceiling?: number | null
          created_at?: string | null
          id?: string
          items?: Json
          kind?: string
          shelf_life_days?: number | null
          sla?: string | null
          status?: string
          suppliers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      prepositions: {
        Row: {
          created_at: string | null
          id: string
          owner: string
          playbook_key: string
          scenario_id: string | null
          status: string | null
          trigger_id: string | null
          updated_at: string | null
          window_label: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          owner: string
          playbook_key: string
          scenario_id?: string | null
          status?: string | null
          trigger_id?: string | null
          updated_at?: string | null
          window_label: string
        }
        Update: {
          created_at?: string | null
          id?: string
          owner?: string
          playbook_key?: string
          scenario_id?: string | null
          status?: string | null
          trigger_id?: string | null
          updated_at?: string | null
          window_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "prepositions_playbook_key_fkey"
            columns: ["playbook_key"]
            isOneToOne: false
            referencedRelation: "playbooks"
            referencedColumns: ["playbook_key"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string
          org_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          org_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          org_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      raw_observations: {
        Row: {
          hash: string
          indicator_key: string
          ingested_at: string
          meta: Json
          obs_id: string
          schema_version: number
          source_id: string
          ts: string
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          hash: string
          indicator_key: string
          ingested_at?: string
          meta?: Json
          obs_id?: string
          schema_version?: number
          source_id: string
          ts: string
          unit: string
          user_id?: string
          value: number
        }
        Update: {
          hash?: string
          indicator_key?: string
          ingested_at?: string
          meta?: Json
          obs_id?: string
          schema_version?: number
          source_id?: string
          ts?: string
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "raw_observations_indicator_key_fkey"
            columns: ["indicator_key"]
            isOneToOne: false
            referencedRelation: "indicator_registry"
            referencedColumns: ["indicator_key"]
          },
          {
            foreignKeyName: "raw_observations_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "source_registry"
            referencedColumns: ["source_id"]
          },
        ]
      }
      reciprocity_ledger: {
        Row: {
          audience: string
          created_at: string | null
          entry_id: string
          kind: string
          label: string
          link: string | null
          loop_id: string | null
          user_id: string
        }
        Insert: {
          audience: string
          created_at?: string | null
          entry_id?: string
          kind: string
          label: string
          link?: string | null
          loop_id?: string | null
          user_id?: string
        }
        Update: {
          audience?: string
          created_at?: string | null
          entry_id?: string
          kind?: string
          label?: string
          link?: string | null
          loop_id?: string | null
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
      reflex_memory_5c: {
        Row: {
          actor: string
          after: Json | null
          attachments: Json | null
          before: Json | null
          created_at: string | null
          id: string
          kind: string
          loop_id: string
          rationale: string
          user_id: string
        }
        Insert: {
          actor: string
          after?: Json | null
          attachments?: Json | null
          before?: Json | null
          created_at?: string | null
          id?: string
          kind: string
          loop_id: string
          rationale: string
          user_id: string
        }
        Update: {
          actor?: string
          after?: Json | null
          attachments?: Json | null
          before?: Json | null
          created_at?: string | null
          id?: string
          kind?: string
          loop_id?: string
          rationale?: string
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
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
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
      risk_channels: {
        Row: {
          channel_key: string
          created_at: string | null
          default_window: string | null
          description: string | null
          enabled: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          channel_key: string
          created_at?: string | null
          default_window?: string | null
          description?: string | null
          enabled?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          channel_key?: string
          created_at?: string | null
          default_window?: string | null
          description?: string | null
          enabled?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      scenario_results: {
        Row: {
          affected_loops: string[]
          created_at: string | null
          id: string
          mitigation_delta: number
          notes: string | null
          scenario_id: string
          user_id: string
          with_mitigation_breach_prob: number
          without_mitigation_breach_prob: number
        }
        Insert: {
          affected_loops: string[]
          created_at?: string | null
          id?: string
          mitigation_delta: number
          notes?: string | null
          scenario_id: string
          user_id: string
          with_mitigation_breach_prob: number
          without_mitigation_breach_prob: number
        }
        Update: {
          affected_loops?: string[]
          created_at?: string | null
          id?: string
          mitigation_delta?: number
          notes?: string | null
          scenario_id?: string
          user_id?: string
          with_mitigation_breach_prob?: number
          without_mitigation_breach_prob?: number
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
          id: string
          key: string | null
          label: string
          snl_id: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key?: string | null
          label: string
          snl_id?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string | null
          label?: string
          snl_id?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      shares: {
        Row: {
          created_at: string | null
          created_by: string
          entity_id: string
          expires_at: string | null
          kind: string
          redaction_profile: string | null
          revoked_at: string | null
          share_id: string
          token: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          entity_id: string
          expires_at?: string | null
          kind: string
          redaction_profile?: string | null
          revoked_at?: string | null
          share_id?: string
          token?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          entity_id?: string
          expires_at?: string | null
          kind?: string
          redaction_profile?: string | null
          revoked_at?: string | null
          share_id?: string
          token?: string
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
      source_registry: {
        Row: {
          config: Json
          created_at: string
          enabled: boolean
          name: string
          pii_class: string
          provider: string
          schedule_cron: string | null
          schema_version: number
          source_id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          config?: Json
          created_at?: string
          enabled?: boolean
          name: string
          pii_class?: string
          provider: string
          schedule_cron?: string | null
          schema_version?: number
          source_id?: string
          type: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          config?: Json
          created_at?: string
          enabled?: boolean
          name?: string
          pii_class?: string
          provider?: string
          schedule_cron?: string | null
          schema_version?: number
          source_id?: string
          type?: string
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
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
          },
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
      srt_windows_5c: {
        Row: {
          cadence: unknown | null
          created_at: string | null
          id: string
          loop_id: string
          reflex_horizon: unknown | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Insert: {
          cadence?: unknown | null
          created_at?: string | null
          id?: string
          loop_id: string
          reflex_horizon?: unknown | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
          window_end: string
          window_start: string
        }
        Update: {
          cadence?: unknown | null
          created_at?: string | null
          id?: string
          loop_id?: string
          reflex_horizon?: unknown | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
          window_end?: string
          window_start?: string
        }
        Relationships: []
      }
      standard_versions: {
        Row: {
          created_at: string | null
          spec: Json
          standard_id: string
          std_ver_id: string
          version: string
        }
        Insert: {
          created_at?: string | null
          spec: Json
          standard_id: string
          std_ver_id?: string
          version: string
        }
        Update: {
          created_at?: string | null
          spec?: Json
          standard_id?: string
          std_ver_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "standard_versions_standard_id_fkey"
            columns: ["standard_id"]
            isOneToOne: false
            referencedRelation: "standards"
            referencedColumns: ["standard_id"]
          },
        ]
      }
      standards: {
        Row: {
          active: boolean | null
          created_at: string | null
          domain: string
          name: string
          standard_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          domain: string
          name: string
          standard_id?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          domain?: string
          name?: string
          standard_id?: string
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
      struct_auctions: {
        Row: {
          id: string
          lot_size: string | null
          mechanism: string
          name: string
          org_id: string
          reserve_price: number | null
          session_id: string
        }
        Insert: {
          id?: string
          lot_size?: string | null
          mechanism: string
          name: string
          org_id: string
          reserve_price?: number | null
          session_id: string
        }
        Update: {
          id?: string
          lot_size?: string | null
          mechanism?: string
          name?: string
          org_id?: string
          reserve_price?: number | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_auctions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_authority_sources: {
        Row: {
          id: string
          label: string
          link: string | null
          note: string | null
          org_id: string
          session_id: string
          status: string
          type: string
        }
        Insert: {
          id?: string
          label: string
          link?: string | null
          note?: string | null
          org_id: string
          session_id: string
          status: string
          type: string
        }
        Update: {
          id?: string
          label?: string
          link?: string | null
          note?: string | null
          org_id?: string
          session_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_authority_sources_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_budget_envelopes: {
        Row: {
          amount: number
          currency: string
          id: string
          label: string
          note: string | null
          org_id: string
          session_id: string
          status: string
          window_from: string | null
          window_to: string | null
        }
        Insert: {
          amount: number
          currency?: string
          id?: string
          label: string
          note?: string | null
          org_id: string
          session_id: string
          status: string
          window_from?: string | null
          window_to?: string | null
        }
        Update: {
          amount?: number
          currency?: string
          id?: string
          label?: string
          note?: string | null
          org_id?: string
          session_id?: string
          status?: string
          window_from?: string | null
          window_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "struct_budget_envelopes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_conformance_checks: {
        Row: {
          actor_id: string
          id: string
          last_run: string | null
          note: string | null
          org_id: string
          session_id: string
          standard_id: string
          status: string
        }
        Insert: {
          actor_id: string
          id?: string
          last_run?: string | null
          note?: string | null
          org_id: string
          session_id: string
          standard_id: string
          status: string
        }
        Update: {
          actor_id?: string
          id?: string
          last_run?: string | null
          note?: string | null
          org_id?: string
          session_id?: string
          standard_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_conformance_checks_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_conformance_checks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_conformance_checks_standard_id_fkey"
            columns: ["standard_id"]
            isOneToOne: false
            referencedRelation: "struct_standards"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_conformance_runs: {
        Row: {
          id: string
          org_id: string
          run_at: string
          session_id: string
          stats: Json | null
        }
        Insert: {
          id?: string
          org_id: string
          run_at?: string
          session_id: string
          stats?: Json | null
        }
        Update: {
          id?: string
          org_id?: string
          run_at?: string
          session_id?: string
          stats?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "struct_conformance_runs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_deleg_edges: {
        Row: {
          from_node: string
          id: string
          note: string | null
          org_id: string
          permission: string
          session_id: string
          to_node: string
        }
        Insert: {
          from_node: string
          id?: string
          note?: string | null
          org_id: string
          permission: string
          session_id: string
          to_node: string
        }
        Update: {
          from_node?: string
          id?: string
          note?: string | null
          org_id?: string
          permission?: string
          session_id?: string
          to_node?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_deleg_edges_from_node_fkey"
            columns: ["from_node"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_deleg_edges_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_deleg_edges_to_node_fkey"
            columns: ["to_node"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_deleg_nodes: {
        Row: {
          id: string
          kind: string
          label: string
          org_id: string
          role: string | null
          session_id: string
        }
        Insert: {
          id?: string
          kind: string
          label: string
          org_id: string
          role?: string | null
          session_id: string
        }
        Update: {
          id?: string
          kind?: string
          label?: string
          org_id?: string
          role?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_deleg_nodes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_dossiers: {
        Row: {
          adoption_plan: string
          attachments: Json | null
          id: string
          lever_summary: string
          mandate_path: Json
          market_snapshot: Json
          mesh_summary: string
          org_id: string
          process_summary: string
          published_at: string
          published_by: string
          rationale: string
          session_id: string
          standards_snapshot: Json
          title: string
          version: string
        }
        Insert: {
          adoption_plan: string
          attachments?: Json | null
          id?: string
          lever_summary: string
          mandate_path: Json
          market_snapshot: Json
          mesh_summary: string
          org_id: string
          process_summary: string
          published_at?: string
          published_by: string
          rationale: string
          session_id: string
          standards_snapshot: Json
          title: string
          version: string
        }
        Update: {
          adoption_plan?: string
          attachments?: Json | null
          id?: string
          lever_summary?: string
          mandate_path?: Json
          market_snapshot?: Json
          mesh_summary?: string
          org_id?: string
          process_summary?: string
          published_at?: string
          published_by?: string
          rationale?: string
          session_id?: string
          standards_snapshot?: Json
          title?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_dossiers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_events: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          kind: string
          org_id: string
          payload: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          kind: string
          org_id: string
          payload?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          kind?: string
          org_id?: string
          payload?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_handoffs: {
        Row: {
          created_at: string
          id: string
          org_id: string
          payload: Json | null
          session_id: string
          task_id: string | null
          to_capacity: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          payload?: Json | null
          session_id: string
          task_id?: string | null
          to_capacity: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          payload?: Json | null
          session_id?: string
          task_id?: string | null
          to_capacity?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_handoffs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_mandate_checks: {
        Row: {
          id: string
          label: string
          note: string | null
          org_id: string
          session_id: string
          status: string
        }
        Insert: {
          id?: string
          label: string
          note?: string | null
          org_id: string
          session_id: string
          status: string
        }
        Update: {
          id?: string
          label?: string
          note?: string | null
          org_id?: string
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_mandate_checks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_mesh_issues: {
        Row: {
          id: string
          label: string
          loop_refs: string[] | null
          note: string | null
          org_id: string
          session_id: string
          severity: string
        }
        Insert: {
          id?: string
          label: string
          loop_refs?: string[] | null
          note?: string | null
          org_id: string
          session_id: string
          severity: string
        }
        Update: {
          id?: string
          label?: string
          loop_refs?: string[] | null
          note?: string | null
          org_id?: string
          session_id?: string
          severity?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_mesh_issues_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_mesh_metrics: {
        Row: {
          id: string
          label: string
          org_id: string
          session_id: string
          unit: string | null
          value: number
        }
        Insert: {
          id?: string
          label: string
          org_id: string
          session_id: string
          unit?: string | null
          value: number
        }
        Update: {
          id?: string
          label?: string
          org_id?: string
          session_id?: string
          unit?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "struct_mesh_metrics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_permits: {
        Row: {
          cap_rule: string | null
          id: string
          mrv_standard_id: string | null
          name: string
          org_id: string
          price_rule: string | null
          session_id: string
        }
        Insert: {
          cap_rule?: string | null
          id?: string
          mrv_standard_id?: string | null
          name: string
          org_id: string
          price_rule?: string | null
          session_id: string
        }
        Update: {
          cap_rule?: string | null
          id?: string
          mrv_standard_id?: string | null
          name?: string
          org_id?: string
          price_rule?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_permits_mrv_standard_id_fkey"
            columns: ["mrv_standard_id"]
            isOneToOne: false
            referencedRelation: "struct_standards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_permits_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_pricing_rules: {
        Row: {
          formula: string
          id: string
          label: string
          org_id: string
          session_id: string
        }
        Insert: {
          formula: string
          id?: string
          label: string
          org_id: string
          session_id: string
        }
        Update: {
          formula?: string
          id?: string
          label?: string
          org_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_pricing_rules_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_latency_hist: {
        Row: {
          id: string
          label: string
          org_id: string
          session_id: string
          value: number
        }
        Insert: {
          id?: string
          label: string
          org_id: string
          session_id: string
          value: number
        }
        Update: {
          id?: string
          label?: string
          org_id?: string
          session_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_latency_hist_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_raci: {
        Row: {
          actor_id: string
          id: string
          org_id: string
          role: string
          session_id: string
          step_id: string
        }
        Insert: {
          actor_id: string
          id?: string
          org_id: string
          role: string
          session_id: string
          step_id: string
        }
        Update: {
          actor_id?: string
          id?: string
          org_id?: string
          role?: string
          session_id?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_raci_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_process_raci_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_process_raci_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "struct_process_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_slas: {
        Row: {
          id: string
          kpi: string
          org_id: string
          session_id: string
          step_id: string
          target: string
        }
        Insert: {
          id?: string
          kpi: string
          org_id: string
          session_id: string
          step_id: string
          target: string
        }
        Update: {
          id?: string
          kpi?: string
          org_id?: string
          session_id?: string
          step_id?: string
          target?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_slas_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_process_slas_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "struct_process_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_steps: {
        Row: {
          id: string
          kind: string
          label: string
          latency_days_target: number | null
          org_id: string
          session_id: string
          triage_rule: string | null
          variance_target_pct: number | null
        }
        Insert: {
          id?: string
          kind: string
          label: string
          latency_days_target?: number | null
          org_id: string
          session_id: string
          triage_rule?: string | null
          variance_target_pct?: number | null
        }
        Update: {
          id?: string
          kind?: string
          label?: string
          latency_days_target?: number | null
          org_id?: string
          session_id?: string
          triage_rule?: string | null
          variance_target_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_steps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_variance_series: {
        Row: {
          id: string
          org_id: string
          session_id: string
          t: string
          v: number
        }
        Insert: {
          id?: string
          org_id: string
          session_id: string
          t: string
          v: number
        }
        Update: {
          id?: string
          org_id?: string
          session_id?: string
          t?: string
          v?: number
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_variance_series_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_runtime_artifacts: {
        Row: {
          blob: Json
          created_at: string
          id: string
          kind: string
          org_id: string
          session_id: string
        }
        Insert: {
          blob: Json
          created_at?: string
          id?: string
          kind: string
          org_id: string
          session_id: string
        }
        Update: {
          blob?: Json
          created_at?: string
          id?: string
          kind?: string
          org_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_runtime_artifacts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_sessions: {
        Row: {
          created_at: string
          created_by: string
          id: string
          loop_code: string
          mission: string | null
          org_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          loop_code: string
          mission?: string | null
          org_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          loop_code?: string
          mission?: string | null
          org_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      struct_standards: {
        Row: {
          id: string
          kind: string
          name: string
          org_id: string
          owner_node_id: string | null
          session_id: string
          status: string
          summary: string | null
          version: string
        }
        Insert: {
          id?: string
          kind: string
          name: string
          org_id: string
          owner_node_id?: string | null
          session_id: string
          status: string
          summary?: string | null
          version: string
        }
        Update: {
          id?: string
          kind?: string
          name?: string
          org_id?: string
          owner_node_id?: string | null
          session_id?: string
          status?: string
          summary?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "struct_standards_owner_node_id_fkey"
            columns: ["owner_node_id"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_standards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      structural_adoptions: {
        Row: {
          adopt_id: string
          dossier_id: string
          entity_id: string
          moved_at: string | null
          notes: string | null
          owner: string | null
          started_at: string | null
          state: string
        }
        Insert: {
          adopt_id?: string
          dossier_id: string
          entity_id: string
          moved_at?: string | null
          notes?: string | null
          owner?: string | null
          started_at?: string | null
          state: string
        }
        Update: {
          adopt_id?: string
          dossier_id?: string
          entity_id?: string
          moved_at?: string | null
          notes?: string | null
          owner?: string | null
          started_at?: string | null
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "structural_adoptions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "structural_adoptions_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "structural_adoptions_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "adopting_entities"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      structural_artifacts: {
        Row: {
          artifact_id: string
          component_id: string | null
          created_at: string | null
          dossier_id: string
          hash: string | null
          kind: string
          storage_path: string
        }
        Insert: {
          artifact_id?: string
          component_id?: string | null
          created_at?: string | null
          dossier_id: string
          hash?: string | null
          kind: string
          storage_path: string
        }
        Update: {
          artifact_id?: string
          component_id?: string | null
          created_at?: string | null
          dossier_id?: string
          hash?: string | null
          kind?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "structural_artifacts_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "structural_components"
            referencedColumns: ["component_id"]
          },
          {
            foreignKeyName: "structural_artifacts_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "structural_artifacts_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
        ]
      }
      structural_components: {
        Row: {
          component_id: string
          content: Json
          dossier_id: string
          kind: string
          order_no: number
          title: string
        }
        Insert: {
          component_id?: string
          content?: Json
          dossier_id: string
          kind: string
          order_no?: number
          title: string
        }
        Update: {
          component_id?: string
          content?: Json
          dossier_id?: string
          kind?: string
          order_no?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "structural_components_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "structural_dossiers"
            referencedColumns: ["dossier_id"]
          },
          {
            foreignKeyName: "structural_components_dossier_id_fkey"
            columns: ["dossier_id"]
            isOneToOne: false
            referencedRelation: "v_public_dossier"
            referencedColumns: ["dossier_id"]
          },
        ]
      }
      structural_dossiers: {
        Row: {
          coherence_note: string | null
          consent_note: string | null
          created_at: string | null
          dossier_id: string
          horizon_tag: string | null
          loop_id: string
          override_council: Json | null
          public_slug: string | null
          published_at: string | null
          published_by: string | null
          status: string
          summary: string | null
          title: string
          updated_at: string | null
          version: string
        }
        Insert: {
          coherence_note?: string | null
          consent_note?: string | null
          created_at?: string | null
          dossier_id?: string
          horizon_tag?: string | null
          loop_id: string
          override_council?: Json | null
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          status: string
          summary?: string | null
          title: string
          updated_at?: string | null
          version: string
        }
        Update: {
          coherence_note?: string | null
          consent_note?: string | null
          created_at?: string | null
          dossier_id?: string
          horizon_tag?: string | null
          loop_id?: string
          override_council?: Json | null
          public_slug?: string | null
          published_at?: string | null
          published_by?: string | null
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
          version?: string
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
      task_assignments: {
        Row: {
          added_at: string
          id: string
          role: string
          task_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          role: string
          task_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          role?: string
          task_id?: string
          user_id?: string
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
      task_events_v2: {
        Row: {
          created_at: string
          created_by: string
          detail: Json
          event_id: string
          event_type: string
          task_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          detail?: Json
          event_id?: string
          event_type: string
          task_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          detail?: Json
          event_id?: string
          event_type?: string
          task_id?: string
        }
        Relationships: []
      }
      task_fingerprints: {
        Row: {
          capacity: string
          created_at: string | null
          fp: string
          loop_id: string
          task_id: string
        }
        Insert: {
          capacity: string
          created_at?: string | null
          fp: string
          loop_id: string
          task_id: string
        }
        Update: {
          capacity?: string
          created_at?: string | null
          fp?: string
          loop_id?: string
          task_id?: string
        }
        Relationships: []
      }
      task_guardrails: {
        Row: {
          config: Json
          effective_from: string
          effective_until: string | null
          id: string
          policy_id: string | null
          task_id: string
        }
        Insert: {
          config?: Json
          effective_from?: string
          effective_until?: string | null
          id?: string
          policy_id?: string | null
          task_id: string
        }
        Update: {
          config?: Json
          effective_from?: string
          effective_until?: string | null
          id?: string
          policy_id?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_guardrails_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "guardrail_policies"
            referencedColumns: ["policy_id"]
          },
        ]
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
      task_outputs: {
        Row: {
          content: Json
          id: string
          kind: string
          published_at: string
          published_by: string
          task_id: string
        }
        Insert: {
          content: Json
          id?: string
          kind: string
          published_at?: string
          published_by: string
          task_id: string
        }
        Update: {
          content?: Json
          id?: string
          kind?: string
          published_at?: string
          published_by?: string
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
      task_reminders: {
        Row: {
          id: string
          kind: string
          meta: Json
          scheduled_for: string
          sent_at: string | null
          task_id: string
        }
        Insert: {
          id?: string
          kind: string
          meta?: Json
          scheduled_for: string
          sent_at?: string | null
          task_id: string
        }
        Update: {
          id?: string
          kind?: string
          meta?: Json
          scheduled_for?: string
          sent_at?: string | null
          task_id?: string
        }
        Relationships: []
      }
      task_renewals: {
        Row: {
          id: string
          renewal_no: number
          renewed_at: string
          requires_evaluation: boolean
          task_id: string
        }
        Insert: {
          id?: string
          renewal_no: number
          renewed_at?: string
          requires_evaluation?: boolean
          task_id: string
        }
        Update: {
          id?: string
          renewal_no?: number
          renewed_at?: string
          requires_evaluation?: boolean
          task_id?: string
        }
        Relationships: []
      }
      task_sla_policies: {
        Row: {
          created_at: string
          escalation_after_hours: number | null
          policy_id: string
          reminder_schedule: Json
          target_hours: number
          template_key: string
        }
        Insert: {
          created_at?: string
          escalation_after_hours?: number | null
          policy_id?: string
          reminder_schedule?: Json
          target_hours: number
          template_key: string
        }
        Update: {
          created_at?: string
          escalation_after_hours?: number | null
          policy_id?: string
          reminder_schedule?: Json
          target_hours?: number
          template_key?: string
        }
        Relationships: []
      }
      task_templates: {
        Row: {
          active: boolean
          capacity: string
          created_at: string
          default_checklist: Json
          default_payload: Json
          default_sla_hours: number
          open_route: string
          template_key: string
          title: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          capacity: string
          created_at?: string
          default_checklist?: Json
          default_payload?: Json
          default_sla_hours?: number
          open_route: string
          template_key: string
          title: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          capacity?: string
          created_at?: string
          default_checklist?: Json
          default_payload?: Json
          default_sla_hours?: number
          open_route?: string
          template_key?: string
          title?: string
          updated_at?: string
          version?: number
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
      tasks_5c: {
        Row: {
          assigned_to: string | null
          capacity: Database["public"]["Enums"]["capacity_5c"]
          created_at: string | null
          de_band_id: string | null
          description: string | null
          id: string
          leverage: Database["public"]["Enums"]["leverage_5c"]
          loop_id: string
          payload: Json | null
          scale: Database["public"]["Enums"]["scale_5c"]
          srt_id: string | null
          status: string
          title: string
          tri: Json | null
          type: Database["public"]["Enums"]["loop_type_5c"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          capacity: Database["public"]["Enums"]["capacity_5c"]
          created_at?: string | null
          de_band_id?: string | null
          description?: string | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_5c"]
          loop_id: string
          payload?: Json | null
          scale?: Database["public"]["Enums"]["scale_5c"]
          srt_id?: string | null
          status?: string
          title: string
          tri?: Json | null
          type?: Database["public"]["Enums"]["loop_type_5c"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          capacity?: Database["public"]["Enums"]["capacity_5c"]
          created_at?: string | null
          de_band_id?: string | null
          description?: string | null
          id?: string
          leverage?: Database["public"]["Enums"]["leverage_5c"]
          loop_id?: string
          payload?: Json | null
          scale?: Database["public"]["Enums"]["scale_5c"]
          srt_id?: string | null
          status?: string
          title?: string
          tri?: Json | null
          type?: Database["public"]["Enums"]["loop_type_5c"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks_v2: {
        Row: {
          capacity: string
          closed_at: string | null
          created_at: string
          created_by: string
          due_at: string | null
          loop_id: string
          open_route: string
          payload: Json
          priority: number
          review_at: string | null
          status: string
          task_id: string
          template_key: string | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity: string
          closed_at?: string | null
          created_at?: string
          created_by: string
          due_at?: string | null
          loop_id: string
          open_route: string
          payload?: Json
          priority?: number
          review_at?: string | null
          status?: string
          task_id?: string
          template_key?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: string
          closed_at?: string | null
          created_at?: string
          created_by?: string
          due_at?: string | null
          loop_id?: string
          open_route?: string
          payload?: Json
          priority?: number
          review_at?: string | null
          status?: string
          task_id?: string
          template_key?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_v2_template_key_fkey"
            columns: ["template_key"]
            isOneToOne: false
            referencedRelation: "task_templates"
            referencedColumns: ["template_key"]
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
      tri_events_5c: {
        Row: {
          at: string | null
          created_at: string | null
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
          at?: string | null
          created_at?: string | null
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
          at?: string | null
          created_at?: string | null
          i_value?: number
          id?: string
          loop_id?: string
          r_value?: number
          t_value?: number
          tag?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tri_events_5c_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks_5c"
            referencedColumns: ["id"]
          },
        ]
      }
      tri_snapshots: {
        Row: {
          as_of: string
          created_at: string | null
          integrity: number
          loop_id: string | null
          notes: Json | null
          reciprocity: number
          snap_id: string
          trust: number
          user_id: string
        }
        Insert: {
          as_of: string
          created_at?: string | null
          integrity: number
          loop_id?: string | null
          notes?: Json | null
          reciprocity: number
          snap_id?: string
          trust: number
          user_id?: string
        }
        Update: {
          as_of?: string
          created_at?: string | null
          integrity?: number
          loop_id?: string | null
          notes?: Json | null
          reciprocity?: number
          snap_id?: string
          trust?: number
          user_id?: string
        }
        Relationships: []
      }
      trigger_rules: {
        Row: {
          action_ref: string
          authority: string
          condition: string
          consent_note: string | null
          created_at: string | null
          expires_at: string
          id: string
          name: string
          threshold: number
          user_id: string
          valid_from: string
          window_hours: number
        }
        Insert: {
          action_ref: string
          authority: string
          condition: string
          consent_note?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          name: string
          threshold: number
          user_id: string
          valid_from: string
          window_hours: number
        }
        Update: {
          action_ref?: string
          authority?: string
          condition?: string
          consent_note?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          name?: string
          threshold?: number
          user_id?: string
          valid_from?: string
          window_hours?: number
        }
        Relationships: []
      }
      trigger_templates: {
        Row: {
          channel_key: string
          created_at: string | null
          defaults: Json | null
          dsl: string
          template_key: string
          title: string
          version: number
        }
        Insert: {
          channel_key: string
          created_at?: string | null
          defaults?: Json | null
          dsl: string
          template_key: string
          title: string
          version: number
        }
        Update: {
          channel_key?: string
          created_at?: string | null
          defaults?: Json | null
          dsl?: string
          template_key?: string
          title?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "trigger_templates_channel_key_fkey"
            columns: ["channel_key"]
            isOneToOne: false
            referencedRelation: "risk_channels"
            referencedColumns: ["channel_key"]
          },
        ]
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
      user_settings: {
        Row: {
          created_at: string | null
          lang_mode: string | null
          learning_hub_preferences: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          lang_mode?: string | null
          learning_hub_preferences?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          lang_mode?: string | null
          learning_hub_preferences?: Json | null
          updated_at?: string | null
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
      delib_latest_dossier: {
        Row: {
          dossier_id: string | null
          published_at: string | null
          session_id: string | null
          title: string | null
          version: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delib_dossiers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      delib_mcda_totals: {
        Row: {
          option_id: string | null
          org_id: string | null
          session_id: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "delib_options_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "delib_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      loop_action_readiness: {
        Row: {
          auto_ok: boolean | null
          bad_sources: number | null
          checked_at: string | null
          drift_indicators: number | null
          loop_id: string | null
          loop_name: string | null
          reasons: string[] | null
          stale_indicators: number | null
          user_id: string | null
        }
        Relationships: []
      }
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
      public_shares: {
        Row: {
          created_at: string | null
          entity_id: string | null
          expires_at: string | null
          is_valid: boolean | null
          kind: string | null
          redaction_profile: string | null
          share_id: string | null
          token: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          expires_at?: string | null
          is_valid?: never
          kind?: string | null
          redaction_profile?: string | null
          share_id?: string | null
          token?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          expires_at?: string | null
          is_valid?: never
          kind?: string | null
          redaction_profile?: string | null
          share_id?: string | null
          token?: string | null
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
      struct_conformance_summary: {
        Row: {
          actor_id: string | null
          last_run: string | null
          note: string | null
          org_id: string | null
          session_id: string | null
          standard_id: string | null
          status: string | null
        }
        Insert: {
          actor_id?: string | null
          last_run?: string | null
          note?: string | null
          org_id?: string | null
          session_id?: string | null
          standard_id?: string | null
          status?: string | null
        }
        Update: {
          actor_id?: string | null
          last_run?: string | null
          note?: string | null
          org_id?: string | null
          session_id?: string | null
          standard_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "struct_conformance_checks_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "struct_deleg_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_conformance_checks_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "struct_conformance_checks_standard_id_fkey"
            columns: ["standard_id"]
            isOneToOne: false
            referencedRelation: "struct_standards"
            referencedColumns: ["id"]
          },
        ]
      }
      struct_process_kpis: {
        Row: {
          latency_obs: number | null
          org_id: string | null
          session_id: string | null
          variance_avg: number | null
        }
        Relationships: [
          {
            foreignKeyName: "struct_process_steps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "struct_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      v_hub_load: {
        Row: {
          allocated_tasks: string[] | null
          current_hub_load: number | null
          projected_load: number | null
          region: string | null
          snl_id: string | null
          time_window: unknown | null
          total_allocation_pct: number | null
        }
        Relationships: []
      }
      v_loop_shared_nodes: {
        Row: {
          id: string | null
          loop_id: string | null
          note: string | null
          role: string | null
          snl_id: string | null
          snl_key: string | null
          snl_label: string | null
          snl_type: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_loop_shared_nodes_snl_id"
            columns: ["snl_id"]
            isOneToOne: false
            referencedRelation: "shared_nodes"
            referencedColumns: ["snl_id"]
          },
        ]
      }
      v_me: {
        Row: {
          org_id: string | null
          role: string | null
          user_id: string | null
        }
        Relationships: []
      }
      v_public_dossier: {
        Row: {
          coherence_note: string | null
          components: Json | null
          dossier_id: string | null
          horizon_tag: string | null
          public_artifacts: Json | null
          public_slug: string | null
          published_at: string | null
          summary: string | null
          title: string | null
          version: string | null
        }
        Insert: {
          coherence_note?: string | null
          components?: never
          dossier_id?: string | null
          horizon_tag?: string | null
          public_artifacts?: never
          public_slug?: string | null
          published_at?: string | null
          summary?: string | null
          title?: string | null
          version?: string | null
        }
        Update: {
          coherence_note?: string | null
          components?: never
          dossier_id?: string | null
          horizon_tag?: string | null
          public_artifacts?: never
          public_slug?: string | null
          published_at?: string | null
          summary?: string | null
          title?: string | null
          version?: string | null
        }
        Relationships: []
      }
      v_timebox_breaches: {
        Row: {
          config: Json | null
          current_renewals: number | null
          effective_from: string | null
          evaluation_required_after_renewals: number | null
          expires_at: string | null
          is_expired: boolean | null
          needs_evaluation: boolean | null
          renewal_limit: number | null
          task_id: string | null
          timebox_hours: number | null
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
            referencedRelation: "loop_action_readiness"
            referencedColumns: ["loop_id"]
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
      apply_smoothing: {
        Args: { p_alpha?: number; p_indicator_key: string; p_value: number }
        Returns: number
      }
      assert_controller_or_owner: {
        Args: { p_org: string }
        Returns: undefined
      }
      assert_owner: {
        Args: { p_org: string }
        Returns: undefined
      }
      attach_playbook: {
        Args: { playbook_uuid: string; watchpoint_uuid: string }
        Returns: Json
      }
      compute_band_status: {
        Args: { p_lower_bound: number; p_upper_bound: number; p_value: number }
        Returns: Json
      }
      compute_coverage: {
        Args: { loop_uuid: string; option_ids: string[] }
        Returns: Json
      }
      compute_loop_signal_scores: {
        Args: { p_as_of?: string; p_loop_id: string; p_time_window?: string }
        Returns: Json
      }
      create_loop: {
        Args: {
          layer?: string
          loop_name: string
          loop_synopsis?: string
          loop_type?: string
          motif?: string
        }
        Returns: string
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
      delib_create_session: {
        Args: {
          p_activation_vector: Json
          p_loop: string
          p_mission: string
          p_org: string
        }
        Returns: string
      }
      delib_handoff: {
        Args: {
          p_due: string
          p_org: string
          p_payload: Json
          p_session: string
          p_title: string
          p_to: string
        }
        Returns: string
      }
      delib_publish_dossier: {
        Args: {
          p_handoffs: string[]
          p_org: string
          p_rejected: string[]
          p_robust: string
          p_selected: string[]
          p_session: string
          p_summary: string
          p_title: string
          p_trade: string
          p_version: string
        }
        Returns: string
      }
      delib_save_frontier_point: {
        Args: {
          p_cost: number
          p_equity: number
          p_feasible: boolean
          p_label: string
          p_option_ids: string[]
          p_org: string
          p_regret: number
          p_risk: number
          p_session: string
        }
        Returns: string
      }
      delib_set_guardrail: {
        Args: {
          p_kind: string
          p_label: string
          p_org: string
          p_required: boolean
          p_selected: boolean
          p_session: string
          p_value: string
        }
        Returns: undefined
      }
      delib_set_mandate: {
        Args: {
          p_label: string
          p_note: string
          p_org: string
          p_session: string
          p_status: string
        }
        Returns: undefined
      }
      delib_set_participation: {
        Args: {
          p_audience: string
          p_date: string
          p_label: string
          p_org: string
          p_session: string
          p_status: string
        }
        Returns: undefined
      }
      delib_set_score: {
        Args: {
          p_criterion: string
          p_evidence: string[]
          p_option: string
          p_org: string
          p_score: number
          p_session: string
        }
        Returns: undefined
      }
      delib_toggle_constraint: {
        Args: {
          p_active: boolean
          p_label: string
          p_org: string
          p_session: string
        }
        Returns: undefined
      }
      delib_upsert_criterion: {
        Args: {
          p_desc: string
          p_direction: string
          p_id: string
          p_label: string
          p_order: number
          p_org: string
          p_scale: string
          p_session: string
          p_weight: number
        }
        Returns: string
      }
      delib_upsert_option: {
        Args: {
          p_authority: string
          p_costs: Json
          p_equity_note: string
          p_id: string
          p_latency: number
          p_name: string
          p_org: string
          p_session: string
          p_synopsis: string
          p_tags: string[]
        }
        Returns: string
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
      gen_indicator_series: {
        Args: {
          p_amp: number
          p_base: number
          p_breach_days?: number
          p_breach_delta?: number
          p_breach_start?: number
          p_days: number
          p_ind: string
          p_loop: string
          p_org: string
          p_period: number
        }
        Returns: undefined
      }
      get_current_user_org: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_loop_action_readiness: {
        Args: { p_loop_id: string }
        Returns: Json
      }
      get_loop_hydrate: {
        Args: { p_loop_code: string } | { p_loop_uuid: string }
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
        Args:
          | { _role: Database["public"]["Enums"]["app_role"]; _user_id: string }
          | { _role: string; _user_id: string }
        Returns: boolean
      }
      import_loop: {
        Args: { as_draft?: boolean; payload: Json }
        Returns: string
      }
      ingest_indicator_json: {
        Args: { p_org: string; p_payload: Json }
        Returns: number
      }
      insert_sprint_tasks: {
        Args: { task_data: Json }
        Returns: undefined
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
      process_raw_observation: {
        Args: { p_obs_id: string }
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
      search_loops: {
        Args: { filters?: Json; limit_count?: number; search_query?: string }
        Returns: {
          default_leverage: string
          edge_count: number
          id: string
          layer: string
          loop_type: string
          motif: string
          name: string
          node_count: number
          status: string
          synopsis: string
          tags: string[]
          updated_at: string
        }[]
      }
      seed_anticipatory_minimal: {
        Args: { p_org: string }
        Returns: undefined
      }
      seed_demo_backtests: {
        Args: { p_horizon?: string; p_org: string }
        Returns: undefined
      }
      seed_demo_data_for_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      seed_mock_indicators: {
        Args: { p_org: string }
        Returns: undefined
      }
      seed_playbooks_and_triggers: {
        Args: { p_org: string }
        Returns: undefined
      }
      seed_signals_golden_paths: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      start_claim: {
        Args: { claim_uuid: string }
        Returns: Json
      }
      struct_create_session: {
        Args: { p_loop: string; p_mission: string; p_org: string }
        Returns: string
      }
      struct_handoff_task: {
        Args: {
          p_due: string
          p_org: string
          p_payload: Json
          p_session: string
          p_title: string
          p_to: string
        }
        Returns: string
      }
      struct_publish_dossier: {
        Args: {
          p_adoption_plan: string
          p_handoffs: string[]
          p_lever_summary: string
          p_mesh_summary: string
          p_org: string
          p_process_summary: string
          p_rationale: string
          p_session: string
          p_title: string
          p_version: string
        }
        Returns: string
      }
      struct_save_artifact: {
        Args: { p_blob: Json; p_kind: string; p_org: string; p_session: string }
        Returns: string
      }
      struct_set_conformance: {
        Args: {
          p_check: string
          p_org: string
          p_session: string
          p_status: string
        }
        Returns: undefined
      }
      struct_set_mandate_check: {
        Args: {
          p_label: string
          p_note: string
          p_org: string
          p_session: string
          p_status: string
        }
        Returns: undefined
      }
      struct_upsert_deleg_edge: {
        Args: {
          p_from: string
          p_id: string
          p_note: string
          p_org: string
          p_permission: string
          p_session: string
          p_to: string
        }
        Returns: string
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
      upsert_snl: {
        Args: { descriptor: string; domain: string; label: string; meta?: Json }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      capacity_5c:
        | "responsive"
        | "reflexive"
        | "deliberative"
        | "anticipatory"
        | "structural"
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
      claim_status_5c: "draft" | "active" | "paused" | "done" | "blocked"
      leverage_5c: "N" | "P" | "S"
      leverage_type: "N" | "P" | "S"
      loop_type: "reactive" | "structural" | "perceptual"
      loop_type_5c: "reactive" | "structural" | "perceptual"
      mandate_status: "allowed" | "restricted" | "forbidden"
      mandate_status_5c: "allowed" | "warning_required" | "blocked"
      role_enum: "operator" | "controller" | "owner"
      scale_5c: "micro" | "meso" | "macro"
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
      capacity_5c: [
        "responsive",
        "reflexive",
        "deliberative",
        "anticipatory",
        "structural",
      ],
      capacity_type: [
        "responsive",
        "reflexive",
        "deliberative",
        "anticipatory",
        "structural",
      ],
      claim_status: ["draft", "pending", "approved", "rejected", "implemented"],
      claim_status_5c: ["draft", "active", "paused", "done", "blocked"],
      leverage_5c: ["N", "P", "S"],
      leverage_type: ["N", "P", "S"],
      loop_type: ["reactive", "structural", "perceptual"],
      loop_type_5c: ["reactive", "structural", "perceptual"],
      mandate_status: ["allowed", "restricted", "forbidden"],
      mandate_status_5c: ["allowed", "warning_required", "blocked"],
      role_enum: ["operator", "controller", "owner"],
      scale_5c: ["micro", "meso", "macro"],
      scale_type: ["micro", "meso", "macro"],
      task_status: ["open", "claimed", "active", "done", "blocked"],
    },
  },
} as const
