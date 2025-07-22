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
}

export interface TreatmentHistory {
  id: string;
  date: string;
  title: string;
  provider: string;
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

export interface Treatment {
  slug: string;
  title: string;
  description: string;
  image_url: string;
  image_hint: string;
}
