import { Suspense } from 'react';
import { PageHeader } from '@/components/page-header';
import { MedicalHistoryForm } from '@/components/features/medical-history/medical-history-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function MedicalHistoryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto bg-card shadow-lg rounded-2xl">
        <CardHeader className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function MedicalHistoryPage() {
  return (
    <>
      <PageHeader title="Historial Médico" />
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-card shadow-lg rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Historial Médico</CardTitle>
            <CardDescription className="text-md">
              Completa tu información médica para recibir el mejor cuidado personalizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<MedicalHistoryPageSkeleton />}>
              <MedicalHistoryForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </>
  );
}