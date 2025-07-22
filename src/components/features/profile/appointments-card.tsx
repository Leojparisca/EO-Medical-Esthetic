
'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Appointment } from '@/lib/types';
import { useEffect, useState } from 'react';

interface AppointmentsCardProps {
  appointments: Appointment[];
}

export function AppointmentsCard({ appointments }: AppointmentsCardProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (date: string) => {
      if (!isClient) return 'Cargando...';
      try {
        return format(new Date(date), "EEEE, d 'de' MMMM", { locale: es });
      } catch (error) {
        return 'Fecha inválida';
      }
  }

  return (
    <Card className="bg-card shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="text-primary" />
          Próximas Citas
        </CardTitle>
        <CardDescription>Tus visitas programadas.</CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div>
                  <p className="font-semibold">{appt.treatment}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(appt.appointment_date)} - {appt.time}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
            <Calendar className="mx-auto h-12 w-12 mb-4" />
            <h3 className="font-semibold">No tienes citas programadas</h3>
            <p className="text-sm mb-4">¡Es hora de agendar tu próxima visita!</p>
            <Button asChild>
              <Link href="/booking">Reservar ahora</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
