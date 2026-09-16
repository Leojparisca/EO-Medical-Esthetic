import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * NOTA DE SEGURIDAD: Este cliente NO debe ser exportado directamente.
 * La Service Role Key tiene privilegios totales y bypass de RLS.
 * Solo usar funciones específicas que necesiten estos privilegios.
 */
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey)

/**
 * Obtiene un cliente con privilegios de administrador para operaciones server-side
 * que requieren bypass de RLS. Usar con precaución.
 * 
 * @deprecated Preferir Server Actions específicas para cada operación
 */
export function getAdminClient() {
  return supabaseAdmin
}