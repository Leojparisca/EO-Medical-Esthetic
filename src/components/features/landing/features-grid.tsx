'use client';

import Link from 'next/link';
import {
  HeartPulse,
  MessageSquareQuote,
  Scan,
  Syringe,
} from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: <Scan className="w-6 h-6" />,
    title: 'Pre-Diagnóstico',
    description: 'Habla con nuestra IA',
    href: '/',
  },
  {
    icon: <HeartPulse className="w-6 h-6" />,
    title: 'Post-Tratamiento',
    description: 'Cuidados con IA',
    href: '/aftercare',
  },
  {
    icon: <Syringe className="w-6 h-6" />,
    title: 'Tratamientos',
    description: 'Explora servicios',
    href: '/transformations',
  },
  {
    icon: <MessageSquareQuote className="w-6 h-6" />,
    title: 'Club EO',
    description: 'Recompensas',
    href: '/loyalty',
  },
];

export function FeaturesGrid() {
  return (
    <section>
      <h2 className="text-xl font-bold mb-4">¿Cómo podemos ayudarte?</h2>
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Link href={feature.href} key={index}>
            <Card className="aspect-square flex flex-col justify-center items-center p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
              <div className="p-3 bg-primary/10 rounded-full mb-3">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="font-semibold text-[0.8rem] leading-tight">
                {feature.title}
              </h3>
              <p className="text-[0.65rem] text-muted-foreground mt-1">
                {feature.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
