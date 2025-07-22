'use client';

import { useState, lazy, Suspense } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Edit, LogOut, FileText } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Lazy load the edit form to reduce initial bundle size
const EditProfileClient = lazy(() => import('./edit-profile-client').then(module => ({ default: module.EditProfileClient })));

interface ProfileCardProps {
    profile: UserProfile | null
}

export function ProfileCard({ profile }: ProfileCardProps) {
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    if (!profile) return null;

    const getInitials = (name: string) => {
        return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }

    const handleSignOut = async () => {
        toast({
            title: "Sesión cerrada (Simulación)",
            description: "Has cerrado la sesión correctamente.",
        });
    };
    
    return (
        <Card className="rounded-2xl shadow-lg">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={profile.avatar_url || ''} alt="Avatar de usuario" />
                        <AvatarFallback className="text-3xl">
                            {getInitials(profile.full_name || 'U')}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold">{profile.full_name || 'Usuario'}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Miembro desde {format(new Date(profile.created_at), "MMMM 'de' yyyy", { locale: es })}
                    </p>

                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="mt-6 w-full">
                                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Editar tu Perfil</DialogTitle>
                                <DialogDescription>
                                    Actualiza tu nombre y tu foto de perfil aquí.
                                </DialogDescription>
                            </DialogHeader>
                            <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                                {profile && <EditProfileClient 
                                    profile={profile}
                                    setOpen={setIsEditDialogOpen}
                                />}
                            </Suspense>
                        </DialogContent>
                    </Dialog>
                   
                    <Button variant="ghost" className="mt-2 w-full text-red-500 hover:text-red-600" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </Button>
                     <Button variant="ghost" className="mt-2 w-full" asChild>
                        <Link href="/medical-history">
                            <FileText className="mr-2 h-4 w-4" /> Completar Ficha Médica
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
