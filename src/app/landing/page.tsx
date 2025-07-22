'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { AppointmentCard } from '@/components/features/landing/appointment-card';
import { FeaturesGrid } from '@/components/features/landing/features-grid';
import { LoyaltyCard } from '@/components/features/landing/loyalty-card';
import { mockAppointments, mockUserProfile } from '@/lib/mock-data';
import type { Appointment, UserProfile } from '@/lib/types';

export default function LandingPage() {
  const profile: UserProfile = mockUserProfile;
  const upcomingAppointment: Appointment | null = mockAppointments.length > 0 ? mockAppointments[0] : null;
  const greetingName = profile.full_name.split(' ')[0] || 'Hola';
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
