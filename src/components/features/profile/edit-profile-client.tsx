'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AvatarUpload } from '@/components/features/profile/avatar-upload';
import type { Profile } from '@/lib/types';
import { updateProfile, uploadAvatar } from '@/lib/supabase/queries';
import { useAuth } from '@/components/providers/auth-provider';

const profileSchema = z.object({
  fullName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
});

interface EditProfileClientProps {
  profile: Profile;
  setOpen: (open: boolean) => void;
}

export function EditProfileClient({ profile, setOpen }: EditProfileClientProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.full_name || '',
    },
  });

  async function onSubmit(data: z.infer<typeof profileSchema>) {
    if (!user) return;
    
    setLoading(true);
    
    try {
      let avatarUrl = profile.avatar_url;
      
      // Upload new avatar if selected
      if (newAvatarFile) {
        avatarUrl = await uploadAvatar(user.id, newAvatarFile);
      }
      
      // Update profile
      await updateProfile(user.id, {
        full_name: data.fullName,
        avatar_url: avatarUrl,
      });

      toast({
        title: 'Perfil Actualizado',
        description: 'Tus datos se han guardado correctamente.',
      });
      
      router.refresh(); 
      setOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <AvatarUpload 
                uid={profile.id}
                url={profile.avatar_url || null}
                onFileSelect={(file) => {
                    setNewAvatarFile(file);
                }}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar Cambios
                </Button>
            </div>
          </form>
        </Form>
  );
}
