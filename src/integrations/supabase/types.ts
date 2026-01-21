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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_history: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          profile_id: string
          target_profile_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          profile_id: string
          target_profile_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          profile_id?: string
          target_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_history_target_profile_id_fkey"
            columns: ["target_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notifications: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          message: string
          read_by: string[] | null
          target_all: boolean | null
          target_user_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          message: string
          read_by?: string[] | null
          target_all?: boolean | null
          target_user_id?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          message?: string
          read_by?: string[] | null
          target_all?: boolean | null
          target_user_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notifications_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_users: {
        Row: {
          admin_id: string | null
          blocked_by_admin: boolean | null
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
          reason: string | null
        }
        Insert: {
          admin_id?: string | null
          blocked_by_admin?: boolean | null
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Update: {
          admin_id?: string | null
          blocked_by_admin?: boolean | null
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_users_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocked_users_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          profile_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          profile_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_participants_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      dating_tips: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      icebreakers: {
        Row: {
          category: string
          created_at: string
          id: string
          is_active: boolean
          question: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          is_active?: boolean
          question?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          is_super: boolean | null
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_super?: boolean | null
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_super?: boolean | null
          liked_id?: string
          liker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_liked_id_fkey"
            columns: ["liked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_liker_id_fkey"
            columns: ["liker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          profile1_id: string
          profile2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile1_id: string
          profile2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          profile1_id?: string
          profile2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_profile1_id_fkey"
            columns: ["profile1_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_profile2_id_fkey"
            columns: ["profile2_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean | null
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_views: {
        Row: {
          id: string
          profile_id: string
          view_date: string
          viewed_at: string
          viewer_id: string
        }
        Insert: {
          id?: string
          profile_id: string
          view_date?: string
          viewed_at?: string
          viewer_id: string
        }
        Update: {
          id?: string
          profile_id?: string
          view_date?: string
          viewed_at?: string
          viewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_views_viewer_id_fkey"
            columns: ["viewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number
          avatar_url: string | null
          bio: string | null
          blocked_at: string | null
          blocked_by: string | null
          blocked_reason: string | null
          city: string
          created_at: string
          education: string | null
          gender: string | null
          height: number | null
          id: string
          interests: string[] | null
          is_blocked: boolean | null
          is_demo: boolean | null
          is_online: boolean | null
          is_verified: boolean | null
          is_visible: boolean | null
          last_seen: string | null
          looking_for: string | null
          name: string
          relationship_goal: string | null
          smoking: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age: number
          avatar_url?: string | null
          bio?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          city: string
          created_at?: string
          education?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_blocked?: boolean | null
          is_demo?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          last_seen?: string | null
          looking_for?: string | null
          name: string
          relationship_goal?: string | null
          smoking?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number
          avatar_url?: string | null
          bio?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          city?: string
          created_at?: string
          education?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          interests?: string[] | null
          is_blocked?: boolean | null
          is_demo?: boolean | null
          is_online?: boolean | null
          is_verified?: boolean | null
          is_visible?: boolean | null
          last_seen?: string | null
          looking_for?: string | null
          name?: string
          relationship_goal?: string | null
          smoking?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      reports: {
        Row: {
          admin_note: string | null
          created_at: string
          description: string | null
          id: string
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason: string
          reported_id: string
          reporter_id: string
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reason?: string
          reported_id?: string
          reporter_id?: string
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_id_fkey"
            columns: ["reported_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_statistics: {
        Row: {
          id: string
          stat_key: string
          stat_value: string
          updated_at: string
        }
        Insert: {
          id?: string
          stat_key: string
          stat_value: string
          updated_at?: string
        }
        Update: {
          id?: string
          stat_key?: string
          stat_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_note: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          resolved_at: string | null
          resolved_by: string | null
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      typing_status: {
        Row: {
          conversation_id: string
          id: string
          is_typing: boolean | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          conversation_id: string
          id?: string
          is_typing?: boolean | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          id?: string
          is_typing?: boolean | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          match_notifications: boolean | null
          message_notifications: boolean | null
          profile_visible: boolean | null
          push_notifications: boolean | null
          show_last_seen: boolean | null
          show_online_status: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          match_notifications?: boolean | null
          message_notifications?: boolean | null
          profile_visible?: boolean | null
          push_notifications?: boolean | null
          show_last_seen?: boolean | null
          show_online_status?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          match_notifications?: boolean | null
          message_notifications?: boolean | null
          profile_visible?: boolean | null
          push_notifications?: boolean | null
          show_last_seen?: boolean | null
          show_online_status?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_profile_id: { Args: never; Returns: string }
      get_random_icebreaker: {
        Args: { category_filter?: string }
        Returns: {
          category: string
          id: string
          question: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_conversation_participant: {
        Args: { conv_id: string }
        Returns: boolean
      }
      update_site_statistics: { Args: never; Returns: undefined }
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
