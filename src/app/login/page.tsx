import { LoginClient } from './login-client';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-muted-foreground">
            Introduce tu correo para iniciar sesión en tu cuenta
          </p>
        </div>
        <LoginClient />
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿Aún no tienes cuenta?{' '}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
