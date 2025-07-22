'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/supabase/auth';

export function SignupClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { user, error } = await signUp({ email, password, fullName });
      
      if (error) {
        toast({
          title: 'Error de Registro',
          description: error.message,
          variant: 'destructive'
        });
        return;
      }

      if (user) {
        toast({
          title: '¡Registro Exitoso!',
          description: 'Tu cuenta ha sido creada. Revisa tu email para confirmar tu cuenta.',
        });
        router.push('/login');
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
    <form onSubmit={handleSignUp}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Nombre Completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Tu nombre completo"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
        </div>
        <Button type="submit" className="w-full bg-gradient-gold text-black hover:brightness-110" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </div>
    </form>
  );
}
