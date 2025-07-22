import { Logo } from '@/components/logo';
import Link from 'next/link';
import { SignupClient } from './signup-client';

export default function SignupPage() {
  return (
    <>
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
            <div className="flex justify-center">
                <Logo />
            </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Crea una cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            Introduce tu correo y contraseña para registrarte
          </p>
        </div>
        <SignupClient />
        <p className="px-8 text-center text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
