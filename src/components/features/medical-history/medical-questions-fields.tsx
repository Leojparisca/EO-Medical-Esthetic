'use client';

import { Control } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MedicalQuestionsFieldsProps {
  control: Control<any>;
}

const conditions = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hipertensión' },
    { id: 'heart-disease', label: 'Enfermedad cardíaca' },
    { id: 'autoimmune-disorder', label: 'Trastorno autoinmune' },
    { id: 'keloid-scarring', label: 'Historial de cicatrices queloides' },
];

export function MedicalQuestionsFields({ control }: MedicalQuestionsFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alergias</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enumera cualquier alergia conocida (medicamentos, alimentos, materiales, etc.)"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medicamentos Actuales</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enumera todos los medicamentos, incluyendo suplementos y fármacos de venta libre."
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="medicalConditions"
        render={() => (
          <FormItem>
            <FormLabel>Condiciones Médicas Pasadas y Presentes</FormLabel>
            <FormDescription>Selecciona todas las que apliquen.</FormDescription>
            {conditions.map((item) => (
              <FormField
                key={item.id}
                control={control}
                name="medicalConditions"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={item.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...(field.value || []), item.id])
                              : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{item.label}</FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="pastProcedures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Procedimientos Estéticos Anteriores</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enumera cualquier tratamiento cosmético o estético previo y sus fechas aproximadas."
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skinType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>¿Cuál es tu tipo de piel?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="normal" />
                  </FormControl>
                  <FormLabel className="font-normal">Normal</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="dry" />
                  </FormControl>
                  <FormLabel className="font-normal">Seca</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oily" />
                  </FormControl>
                  <FormLabel className="font-normal">Grasa</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="combination" />
                  </FormControl>
                  <FormLabel className="font-normal">Mixta</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="sensitive" />
                  </FormControl>
                  <FormLabel className="font-normal">Sensible</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
