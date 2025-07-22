import { supabase } from './client'
import type { AuthError, User } from '@supabase/supabase-js'

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

export interface SignUpData {
  email: string
  password: string
  fullName: string
}

export interface SignInData {
  email: string
  password: string
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, fullName }: SignUpData): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  return {
    user: data.user,
    error,
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInData): Promise<AuthResponse> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return {
    user: data.user,
    error,
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current session
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}