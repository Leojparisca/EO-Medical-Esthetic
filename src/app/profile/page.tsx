import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { AppointmentsCard } from '@/components/features/profile/appointments-card';
import { TreatmentHistoryCard } from '@/components/features/profile/treatment-history-card';
import { ProfileCard } from '@/components/features/profile/profile-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect, useState } from 'react';
import { getProfile, getUserAppointments, getUserTreatmentHistory } from '@/lib/supabase/queries';
import type { Profile, Appointment, TreatmentHistory } from '@/lib/types';
import { useRouter } from 'next/navigation';

function ProfilePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <div className="w-full lg:w-2/3 space-y-8">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
        </div>
    </div>
  );
}

function UserData() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadUserData();
  }, [user, router]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [profileData, appointmentsData, historyData] = await Promise.all([
        getProfile(user.id),
        getUserAppointments(user.id),
        getUserTreatmentHistory(user.id)
      ]);

      setProfile(profileData);
      
      // Transform appointments data
      const transformedAppointments = appointmentsData.map(apt => ({
        id: apt.id,
        appointment_date: apt.appointment_date,
        time: apt.time,
        treatment: apt.treatments?.title || 'Tratamiento',
        provider: apt.provider,
        treatments: apt.treatments
      }));
      setAppointments(transformedAppointments);

      // Transform treatment history data
      const transformedHistory = historyData.map(hist => ({
        id: hist.id,
        date: hist.date,
        title: hist.treatments?.title || 'Tratamiento',
        provider: hist.provider,
        treatments: hist.treatments
      }));
      setTreatmentHistory(transformedHistory);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!profile) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <ProfileCard profile={profile} />
        </div>
        <div className="w-full lg:w-2/3 space-y-8">
          <AppointmentsCard appointments={appointments} />
          <TreatmentHistoryCard history={treatmentHistory} />
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Tu Perfil" />
      <Suspense fallback={<ProfilePageSkeleton />}>
        <UserData />
      </Suspense>
    </>
  );
}
