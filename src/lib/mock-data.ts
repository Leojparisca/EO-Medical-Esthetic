import type { Appointment, Treatment, TreatmentHistory, UserProfile } from "./types";

export const mockUserProfile: UserProfile = {
  id: '12345',
  full_name: 'Ana García',
  email: 'ana.garcia@example.com',
  created_at: '2023-05-15T10:00:00.000Z',
  avatar_url: 'https://placehold.co/128x128',
  loyalty_points: 3250,
};

export const mockTreatments: Treatment[] = [
    {
      slug: "rejuvenecimiento-facial-con-laser",
      title: "Rejuvenecimiento Facial con Láser",
      description: "Reduce arrugas, manchas y mejora la textura de la piel utilizando tecnología láser de última generación para una apariencia más joven.",
      image_url: "https://placehold.co/600x400",
      image_hint: "laser treatment",
    },
    {
      slug: "terapia-de-infusion-de-hidratacion",
      title: "Terapia de Infusión de Hidratación",
      description: "Un cóctel de vitaminas y ácido hialurónico infundido directamente en la piel para una hidratación profunda y un brillo instantáneo.",
      image_url: "https://placehold.co/600x400",
      image_hint: "hydration therapy",
    },
    {
      slug: "lifting-facial-sin-cirugia",
      title: "Lifting Facial sin Cirugía",
      description: "Reafirma y eleva la piel del rostro y cuello con ultrasonido focalizado, estimulando la producción natural de colágeno.",
      image_url: "https://placehold.co/600x400",
      image_hint: "facial lifting",
    },
    {
        slug: "rellenos-dermicos",
        title: "Rellenos Dérmicos",
        description: "Restaura el volumen perdido, suaviza las líneas y realza los contornos faciales con rellenos de ácido hialurónico seguros y efectivos.",
        image_url: "https://placehold.co/600x400",
        image_hint: "dermal fillers",
    },
    {
        slug: "microdermoabrasion-con-punta-de-diamante",
        title: "Microdermoabrasión con Punta de Diamante",
        description: "Exfoliación mecánica que elimina las células muertas de la piel, revelando una capa más suave y luminosa debajo.",
        image_url: "https://placehold.co/600x400",
        image_hint: "microdermabrasion",
    },
    {
        slug: "peeling-quimico-personalizado",
        title: "Peeling Químico Personalizado",
        description: "Una solución química aplicada a la piel para tratar el acné, la pigmentación irregular y las arrugas finas, adaptada a tus necesidades.",
        image_url: "https://placehold.co/600x400",
        image_hint: "chemical peel",
    }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    time: '14:30',
    treatment: 'Lifting Facial sin Cirugía',
    provider: 'Clínica EO',
  },
  {
    id: 'appt-2',
    appointment_date: new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
    time: '11:00',
    treatment: 'Terapia de Infusión de Hidratación',
    provider: 'Clínica EO',
  }
];

export const mockTreatmentHistory: TreatmentHistory[] = [
  {
    id: 'hist-1',
    date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    title: 'Rejuvenecimiento Facial con Láser',
    provider: 'Clínica EO',
  },
  {
    id: 'hist-2',
    date: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString(),
    title: 'Rellenos Dérmicos',
    provider: 'Dra. Isabela Reyes',
  },
  {
    id: 'hist-3',
    date: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString(),
    title: 'Microdermoabrasión con Punta de Diamante',
    provider: 'Clínica EO',
  }
];
