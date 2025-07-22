import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // El plugin de Google AI busca automáticamente la GEMINI_API_KEY
      // en tus variables de entorno, por lo que no es necesario pasarla explícitamente aquí.
    }),
  ],
  // Usa un modelo optimizado para chat.
  model: 'googleai/gemini-1.5-flash-latest',
});
