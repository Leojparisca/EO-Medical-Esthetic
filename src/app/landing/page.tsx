'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { AppointmentCard } from '@/components/features/landing/appointment-card';
import { FeaturesGrid } from '@/components/features/landing/features-grid';
import { LoyaltyCard } from '@/components/features/landing/loyalty-card';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState } from 'react';
import { getProfile, getUserAppointments } from '@/lib/supabase/queries';
import type { Appointment, Profile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, authLoading, router]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [profileData, appointmentsData] = await Promise.all([
        getProfile(user.id),
        getUserAppointments(user.id)
      ]);

      setProfile(profileData);
      
      // Transform appointments data to match the expected format
      const transformedAppointments = appointmentsData.map(apt => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        time: apt.time,
        treatment: apt.treatments?.title || 'Tratamiento',
        provider: apt.provider,
        treatments: apt.treatments
      }));
      
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow p-6 pb-24">
          <section className="mb-8 flex justify-between items-center">
            <div>
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <ThemeToggle />
          </section>
          <div className="space-y-6">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const upcomingAppointment: Appointment | null = appointments.length > 0 ? appointments[0] : null;
  const greetingName = profile.full_name?.split(' ')[0] || 'Usuario';
  const loyaltyPoints = profile.loyalty_points || 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-6 pb-24">
        <section className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Hola, {greetingName}
            </h1>
            <p className="text-muted-foreground">Revisemos tu día</p>
          </div>
          <ThemeToggle />
        </section>

        <div className="space-y-6">
          <AppointmentCard appointment={upcomingAppointment} />
          <LoyaltyCard points={loyaltyPoints} />
          <FeaturesGrid />
        </div>
      </main>
    </div>
  );
}
