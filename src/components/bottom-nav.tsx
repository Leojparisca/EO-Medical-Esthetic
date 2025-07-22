'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, User, Calendar, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/landing', label: 'Inicio', icon: <Home /> },
  { href: '/transformations', label: 'Servicios', icon: <Sparkles /> },
  { href: '/booking', label: 'Reservar', icon: <Calendar /> },
  { href: '/profile', label: 'Perfil', icon: <User /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-24 bg-transparent z-50">
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-sm h-16 bg-card/95 backdrop-blur-sm rounded-full flex justify-around items-center px-2 shadow-lg border">
        {navItems.map((item) => {
           // La ruta raíz '/' ahora se trata como '/landing' para el estado activo.
           const isActive = pathname === item.href || (item.href === '/landing' && pathname === '/');
           return (
            <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center h-14 w-16 rounded-full transition-colors text-muted-foreground hover:text-primary",
                isActive && "text-primary"
            )}>
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </footer>
  );
}
