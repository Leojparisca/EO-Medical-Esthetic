import { supabase } from './client'
import type { Database } from './types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Treatment = Database['public']['Tables']['treatments']['Row']
type Appointment = Database['public']['Tables']['appointments']['Row']
type TreatmentHistory = Database['public']['Tables']['treatment_history']['Row']
type MedicalHistory = Database['public']['Tables']['medical_history']['Row']

// Profile queries
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Treatment queries
export async function getTreatments() {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function getTreatmentBySlug(slug: string) {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

// Appointment queries
export async function getUserAppointments(userId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      treatments (
        title,
        slug
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'scheduled')
    .gte('appointment_date', new Date().toISOString().split('T')[0])
    .order('appointment_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createAppointment(appointment: Database['public']['Tables']['appointments']['Insert']) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointment)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAppointment(id: string, updates: Database['public']['Tables']['appointments']['Update']) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Treatment history queries
export async function getUserTreatmentHistory(userId: string) {
  const { data, error } = await supabase
    .from('treatment_history')
    .select(`
      *,
      treatments (
        title,
        slug
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export async function addTreatmentHistory(history: Database['public']['Tables']['treatment_history']['Insert']) {
  const { data, error } = await supabase
    .from('treatment_history')
    .insert(history)
    .select()
    .single()

  if (error) throw error
  return data
}

// Medical history queries
export async function getUserMedicalHistory(userId: string) {
  const { data, error } = await supabase
    .from('medical_history')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
  return data
}

export async function createMedicalHistory(medicalHistory: Database['public']['Tables']['medical_history']['Insert']) {
  const { data, error } = await supabase
    .from('medical_history')
    .insert(medicalHistory)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMedicalHistory(userId: string, updates: Database['public']['Tables']['medical_history']['Update']) {
  const { data, error } = await supabase
    .from('medical_history')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Storage queries for avatar uploads
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return data.publicUrl
}