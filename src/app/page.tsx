import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirige permanentemente de la raíz a /landing
  redirect('/landing');
}
