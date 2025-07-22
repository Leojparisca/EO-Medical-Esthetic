'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { PersonalInfoFields } from '@/components/features/medical-history/personal-info-fields';
import { MedicalQuestionsFields } from '@/components/features/medical-history/medical-questions-fields';
import { ConsentField } from '@/components/features/medical-history/consent-field';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createMedicalHistory, updateMedicalHistory, getUserMedicalHistory } from '@/lib/supabase/queries';
import { useAuth } from '@/components/providers/auth-provider';
import { useEffect } from 'react';

const medicalHistorySchema = z.object({
  fullName: z.string().min(2, { message: 'El nombre completo debe tener al menos 2 caracteres.' }),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Por favor, introduce una fecha válida en formato AAAA-MM-DD.' }),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  medicalConditions: z.array(z.string()).optional(),
  pastProcedures: z.string().optional(),
  skinType: z.enum(['normal', 'dry', 'oily', 'combination', 'sensitive'], { required_error: 'Por favor, selecciona tu tipo de piel.' }),
  consent: z.boolean().default(false).refine((val) => val === true, {
    message: 'Debes consentir el tratamiento.',
  }),
});

export function MedicalHistoryForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingHistory, setExistingHistory] = useState(false);
  const form = useForm<z.infer<typeof medicalHistorySchema>>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      fullName: '',
      dob: '',
      allergies: '',
      medications: '',
      medicalConditions: [],
      pastProcedures: '',
      consent: false,
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadExistingHistory();
  }, [user, router]);

  const loadExistingHistory = async () => {
    if (!user) return;

    try {
      const history = await getUserMedicalHistory(user.id);
      if (history) {
        setExistingHistory(true);
        form.reset({
          fullName: history.full_name,
          dob: history.date_of_birth,
          allergies: history.allergies || '',
          medications: history.medications || '',
          medicalConditions: history.medical_conditions || [],
          pastProcedures: history.past_procedures || '',
          skinType: history.skin_type,
          consent: history.consent,
        });
      }
    } catch (error) {
      console.error('Error loading medical history:', error);
    }
  };

  async function onSubmit(data: z.infer<typeof medicalHistorySchema>) {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const historyData = {
        user_id: user.id,
        full_name: data.fullName,
        date_of_birth: data.dob,
        allergies: data.allergies || null,
        medications: data.medications || null,
        medical_conditions: data.medicalConditions || null,
        past_procedures: data.pastProcedures || null,
        skin_type: data.skinType,
        consent: data.consent,
      };

      if (existingHistory) {
        await updateMedicalHistory(user.id, historyData);
      } else {
        await createMedicalHistory(historyData);
      }

      toast({
        title: 'Historial Médico Guardado (Simulación)',
        description: 'Gracias por completar tu formulario. Tu información está segura.',
      });
      router.push('/profile');
    } catch (error) {
      console.error('Error saving medical history:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el historial médico.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInfoFields control={form.control} />
            <MedicalQuestionsFields control={form.control} />
            <ConsentField control={form.control} />
            <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting} className="bg-gradient-gold text-primary-foreground hover:brightness-110">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Guardando...' : 'Guardar Historial Médico'}
                </Button>
            </div>
        </form>
    </Form>
  );
}
