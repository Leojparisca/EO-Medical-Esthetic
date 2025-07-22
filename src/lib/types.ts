import type { Database } from './supabase/types'

// Export Supabase types for use throughout the app
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Treatment = Database['public']['Tables']['treatments']['Row']
export type AppointmentRow = Database['public']['Tables']['appointments']['Row']
export type TreatmentHistoryRow = Database['public']['Tables']['treatment_history']['Row']
export type MedicalHistoryRow = Database['public']['Tables']['medical_history']['Row']

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: {
    name: string;
    slug: string;
  }[];
};

export interface Appointment {
  id: string;
  appointment_date: string;
  time: string;
  treatment: string;
  provider: string;
  treatments?: {
    title: string;
    slug: string;
  };
}

export interface TreatmentHistory {
  id: string;
  date: string;
  title: string;
  provider: string;
  treatments?: {
    title: string;
    slug: string;
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string; // Añadido para simulación
  created_at: string; // Añadido para simulación
  avatar_url: string;
  updated_at?: string;
  loyalty_points?: number;
}

