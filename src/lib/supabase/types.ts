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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          avatar_url: string | null
          loyalty_points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          avatar_url?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          avatar_url?: string | null
          loyalty_points?: number
          created_at?: string
          updated_at?: string
        }
      }
      treatments: {
        Row: {
          id: string
          slug: string
          title: string
          description: string
          image_url: string | null
          image_hint: string | null
          price: number | null
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description: string
          image_url?: string | null
          image_hint?: string | null
          price?: number | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string
          image_url?: string | null
          image_hint?: string | null
          price?: number | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          treatment_id: string
          appointment_date: string
          time: string
          status: 'scheduled' | 'completed' | 'cancelled'
          provider: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          treatment_id: string
          appointment_date: string
          time: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          provider?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          treatment_id?: string
          appointment_date?: string
          time?: string
          status?: 'scheduled' | 'completed' | 'cancelled'
          provider?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      treatment_history: {
        Row: {
          id: string
          user_id: string
          treatment_id: string
          date: string
          provider: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          treatment_id: string
          date: string
          provider: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          treatment_id?: string
          date?: string
          provider?: string
          notes?: string | null
          created_at?: string
        }
      }
      medical_history: {
        Row: {
          id: string
          user_id: string
          full_name: string
          date_of_birth: string
          allergies: string | null
          medications: string | null
          medical_conditions: string[] | null
          past_procedures: string | null
          skin_type: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'
          consent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          date_of_birth: string
          allergies?: string | null
          medications?: string | null
          medical_conditions?: string[] | null
          past_procedures?: string | null
          skin_type: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'
          consent: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          date_of_birth?: string
          allergies?: string | null
          medications?: string | null
          medical_conditions?: string[] | null
          past_procedures?: string | null
          skin_type?: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'
          consent?: boolean
          created_at?: string
          updated_at?: string
        }
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