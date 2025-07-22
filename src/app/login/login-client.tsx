'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/supabase/auth';

export function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signIn({ email, password });
      
      if (error) {
        toast({
          title: 'Error de Inicio de Sesión',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      if (user) {
        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente.',
        });
        router.push('/landing');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSignIn}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-gold text-black hover:brightness-110" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </Button>
        </div>
      </form>
    </div>
  );
}
