import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { AppointmentsCard } from '@/components/features/profile/appointments-card';
import { TreatmentHistoryCard } from '@/components/features/profile/treatment-history-card';
import { ProfileCard } from '@/components/features/profile/profile-card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockAppointments, mockTreatmentHistory, mockUserProfile } from '@/lib/mock-data';

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
  const profile = mockUserProfile;
  const upcomingAppointments = mockAppointments;
  const treatmentHistory = mockTreatmentHistory;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <ProfileCard profile={profile} />
        </div>
        <div className="w-full lg:w-2/3 space-y-8">
          <AppointmentsCard appointments={upcomingAppointments} />
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
