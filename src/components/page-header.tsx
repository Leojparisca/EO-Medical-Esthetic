'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function PageHeader({ title }: { title: string }) {
    const pathname = usePathname();
    
    // Rutas en las que no queremos mostrar el PageHeader
    const noHeaderPaths = ['/landing', '/'];

    if (noHeaderPaths.includes(pathname)) {
        return null;
    }

    const backHref = pathname.split('/').slice(0, -1).join('/') || '/landing';

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-14 items-center">
                <div className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href={backHref}>
                        <ArrowLeft />
                    </Link>
                </Button>
                <h1 className="text-lg font-bold ml-4">{title}</h1>
                </div>
            </div>
        </header>
    );
}
