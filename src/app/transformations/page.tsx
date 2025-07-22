import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { mockTreatments } from '@/lib/mock-data';

export default function TransformationsPage() {
  const transformations = mockTreatments;

  return (
    <>
      <PageHeader title="Tratamientos" />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Catálogo de Transformaciones
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cada tratamiento es un viaje hacia un yo más seguro y radiante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((t) => (
            <Card key={t.slug} className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl bg-card rounded-2xl shadow-lg">
              <div className="relative h-60 w-full">
                <Image
                  src={t.image_url || 'https://placehold.co/600x400'}
                  alt={t.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={t.image_hint || 'treatment'}
                />
              </div>
              <CardHeader>
                <CardTitle className="font-bold text-2xl">{t.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{t.description}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/booking?service=${t.slug}`} className="w-full">
                  <Button className="w-full bg-gradient-gold text-primary-foreground h-12 rounded-full font-semibold">
                    Reservar Ahora
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
