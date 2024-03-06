export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          device: Json | null
          id: string
          image: string | null
          marked: boolean | null
          updated_at: string | null
          user: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          device?: Json | null
          id?: string
          image?: string | null
          marked?: boolean | null
          updated_at?: string | null
          user?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          device?: Json | null
          id?: string
          image?: string | null
          marked?: boolean | null
          updated_at?: string | null
          user?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_fkey"
            columns: ["user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          candidateList: Json
          created_at: string
          criteriaList: Json
          description: string
          id: string
          location: string
          marked: boolean
          name: string
          owner: string
          updated_at: string
        }
        Insert: {
          candidateList: Json
          created_at?: string
          criteriaList: Json
          description: string
          id?: string
          location: string
          marked?: boolean
          name: string
          owner: string
          updated_at?: string
        }
        Update: {
          candidateList?: Json
          created_at?: string
          criteriaList?: Json
          description?: string
          id?: string
          location?: string
          marked?: boolean
          name?: string
          owner?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scores: {
        Row: {
          candidates: Json | null
          created_at: string
          event: string
          id: number
          marked: boolean | null
          owner: string
          updated_at: string | null
        }
        Insert: {
          candidates?: Json | null
          created_at?: string
          event: string
          id?: number
          marked?: boolean | null
          owner: string
          updated_at?: string | null
        }
        Update: {
          candidates?: Json | null
          created_at?: string
          event?: string
          id?: number
          marked?: boolean | null
          owner?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

