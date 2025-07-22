'use client';

import { Control } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

interface ConsentFieldProps {
  control: Control<any>;
}

export function ConsentField({ control }: ConsentFieldProps) {
  return (
    <FormField
      control={control}
      name="consent"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Certifico que la información proporcionada es verdadera y completa a
              mi leal saber y entender. Consiento recibir tratamiento basado en
              esta información.
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
