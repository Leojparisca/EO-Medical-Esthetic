
'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { TreatmentHistory } from '@/lib/types';
import { useEffect, useState } from 'react';

interface TreatmentHistoryCardProps {
  history: TreatmentHistory[];
}

export function TreatmentHistoryCard({ history }: TreatmentHistoryCardProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    const formatDate = (date: string) => {
        if (!isClient) return 'Cargando...';
        try {
            return format(new Date(date), 'd MMMM yyyy', { locale: es });
        } catch (error) {
            return 'Fecha inválida';
        }
    }

  return (
    <Card className="bg-card shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Clock className="text-primary" />
          Historial de Tratamientos
        </CardTitle>
        <CardDescription>Tu viaje de transformación.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((hist) => (
              <div key={hist.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div>
                  <p className="font-semibold">{hist.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(hist.date)}
                  </p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{hist.provider}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
             <Clock className="mx-auto h-12 w-12 mb-4" />
            <h3 className="font-semibold">Aún no tienes un historial</h3>
            <p className="text-sm">Tus tratamientos pasados aparecerán aquí.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}