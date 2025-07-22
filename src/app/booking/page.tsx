'use client';

import * as React from 'react';
import { add, format, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { mockTreatments } from '@/lib/mock-data';

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [service, setService] = React.useState<string | undefined>(searchParams.get('service') || undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isBooked, setIsBooked] = React.useState(false);
  const { toast } = useToast();

  const treatments = mockTreatments;

  const timeSlots = React.useMemo(() => {
    if (!date) return [];
    const slots = [];
    let startTime = setMinutes(setHours(date, 9), 0); // 9:00 AM
    const endTime = setMinutes(setHours(date, 17), 0); // 5:00 PM

    while (startTime <= endTime) {
      slots.push(format(startTime, 'HH:mm'));
      startTime = add(startTime, { minutes: 30 });
    }
    return slots;
  }, [date]);
  
  const handleBooking = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!date || !service || !selectedTime) {
      toast({
        title: 'Información Incompleta',
        description: 'Por favor, selecciona un servicio, fecha y hora para reservar.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    // Simular una llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsBooked(true);

    toast({
        title: '¡Reserva Confirmada!',
        description: `Tu cita para ${treatments.find(t => t.slug === service)?.title} está programada para el ${format(date, 'PPP', { locale: es })} a las ${selectedTime}. (Esto es una simulación)`,
    });
  };

  return (
    <>
    <PageHeader title="Reservar Cita" />
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto bg-card shadow-lg rounded-2xl">
        <form>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Agenda Tu Transformación</CardTitle>
            <CardDescription className="text-md">
              Da el siguiente paso hacia la luminosidad.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-4 items-center">
               <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-xl border bg-background"
                  disabled={(day) => day < new Date(new Date().setHours(0,0,0,0))}
                  locale={es}
               />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">1. Selecciona un Servicio</label>
                <Select onValueChange={setService} value={service}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Elige un servicio..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treatments.map((treatment) => (
                      <SelectItem key={treatment.slug} value={treatment.slug}>
                        {treatment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {date && (
                  <div>
                      <label className="text-sm font-medium mb-2 block">2. Selecciona una Hora para el {format(date, 'PPP', { locale: es })}</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map(time => (
                              <Button 
                                  key={time} 
                                  type="button"
                                  variant={selectedTime === time ? 'default' : 'outline'}
                                  onClick={() => setSelectedTime(time)}
                                  className={cn(selectedTime === time && 'bg-primary text-primary-foreground')}
                              >
                                  {time}
                              </Button>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center p-6">
              <Button size="lg" onClick={handleBooking} disabled={!date || !service || !selectedTime || isSubmitting || isBooked} className="w-full max-w-sm bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Confirmando...' : (isBooked ? 'Cita Confirmada' : 'Confirmar Reserva')}
              </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
    </>
  );
}
