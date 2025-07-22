
'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowRight, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Appointment } from '@/lib/types';
import { useEffect, useState } from 'react';

interface AppointmentCardProps {
  appointment?: Appointment | null;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (appointment) {
      setFormattedDate(
        format(new Date(appointment.appointment_date), "EEE, d 'de' MMMM", {
          locale: es,
        })
      );
    }
  }, [appointment]);

  if (!appointment) {
    return null;
  }

  return (
    <Card className="bg-card shadow-lg rounded-2xl border-l-4 border-primary">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-primary" />
          <div>
            <p className="font-semibold">Próxima cita</p>
            <p className="text-sm text-muted-foreground">
              {formattedDate ? `${formattedDate} - ${appointment.time}`: 'Cargando fecha...'}
            </p>
          </div>
        </div>
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowRight className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
