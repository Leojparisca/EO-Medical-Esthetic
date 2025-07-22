// test-supabase.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Cargar las variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Las variables de entorno de Supabase no están definidas.');
  console.error('Asegúrate de que tu archivo .env es correcto y lo has reiniciado.');
  process.exit(1);
}

console.log('Variables de entorno cargadas:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseKey ? 'Encontrada' : 'NO Encontrada');
console.log('\nIntentando conectar a Supabase...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Esta es una llamada simple que no requiere autenticación
    // y solo lee un recurso público. Es perfecta para probar la conexión de red.
    const { data, error } = await supabase.from('treatments').select('id').limit(1);

    if (error) {
      console.error('\n--- FALLÓ LA CONEXIÓN ---');
      console.error('Error al conectar con Supabase:', error.message);
      console.error('\nPosibles causas:');
      console.error('1. Las claves en tu archivo .env son incorrectas.');
      console.error('2. Hay un problema de red (firewall) entre este entorno y Supabase.');
    } else {
      console.log('\n--- ¡CONEXIÓN EXITOSA! ---');
      console.log('Se pudo comunicar con la base de datos de Supabase correctamente.');
      console.log('Respuesta recibida:', data);
    }
  } catch (e) {
    console.error('\n--- FALLÓ LA CONEXIÓN DE RED ---');
    console.error('Hubo un error inesperado. Esto apunta a un problema de red o DNS.', e);
  }
}

testConnection();
