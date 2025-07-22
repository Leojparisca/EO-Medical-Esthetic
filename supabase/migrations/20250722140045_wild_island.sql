/*
  # Initial Schema for EO Clinic App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text, unique)
      - `avatar_url` (text)
      - `loyalty_points` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `treatments`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `image_hint` (text)
      - `price` (decimal)
      - `duration_minutes` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `treatment_id` (uuid, references treatments)
      - `appointment_date` (date)
      - `time` (text)
      - `status` (enum: scheduled, completed, cancelled)
      - `provider` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `treatment_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `treatment_id` (uuid, references treatments)
      - `date` (date)
      - `provider` (text)
      - `notes` (text)
      - `created_at` (timestamp)
    
    - `medical_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `full_name` (text)
      - `date_of_birth` (date)
      - `allergies` (text)
      - `medications` (text)
      - `medical_conditions` (text array)
      - `past_procedures` (text)
      - `skin_type` (enum)
      - `consent` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create custom types
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE skin_type AS ENUM ('normal', 'dry', 'oily', 'combination', 'sensitive');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  email text UNIQUE NOT NULL,
  avatar_url text,
  loyalty_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  image_hint text,
  price decimal(10,2),
  duration_minutes integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  treatment_id uuid REFERENCES treatments(id) ON DELETE CASCADE NOT NULL,
  appointment_date date NOT NULL,
  time text NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  provider text DEFAULT 'Clínica EO',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create treatment_history table
CREATE TABLE IF NOT EXISTS treatment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  treatment_id uuid REFERENCES treatments(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  provider text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create medical_history table
CREATE TABLE IF NOT EXISTS medical_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  allergies text,
  medications text,
  medical_conditions text[],
  past_procedures text,
  skin_type skin_type NOT NULL,
  consent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_history ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create policies for treatments (public read)
CREATE POLICY "Anyone can view treatments"
  ON treatments
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create policies for appointments
CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for treatment_history
CREATE POLICY "Users can view own treatment history"
  ON treatment_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own treatment history"
  ON treatment_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for medical_history
CREATE POLICY "Users can view own medical history"
  ON medical_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own medical history"
  ON medical_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medical history"
  ON medical_history
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample treatments
INSERT INTO treatments (slug, title, description, image_url, image_hint, price, duration_minutes) VALUES
('rejuvenecimiento-facial-con-laser', 'Rejuvenecimiento Facial con Láser', 'Reduce arrugas, manchas y mejora la textura de la piel utilizando tecnología láser de última generación para una apariencia más joven.', 'https://placehold.co/600x400', 'laser treatment', 299.00, 60),
('terapia-de-infusion-de-hidratacion', 'Terapia de Infusión de Hidratación', 'Un cóctel de vitaminas y ácido hialurónico infundido directamente en la piel para una hidratación profunda y un brillo instantáneo.', 'https://placehold.co/600x400', 'hydration therapy', 199.00, 45),
('lifting-facial-sin-cirugia', 'Lifting Facial sin Cirugía', 'Reafirma y eleva la piel del rostro y cuello con ultrasonido focalizado, estimulando la producción natural de colágeno.', 'https://placehold.co/600x400', 'facial lifting', 399.00, 90),
('rellenos-dermicos', 'Rellenos Dérmicos', 'Restaura el volumen perdido, suaviza las líneas y realza los contornos faciales con rellenos de ácido hialurónico seguros y efectivos.', 'https://placehold.co/600x400', 'dermal fillers', 349.00, 30),
('microdermoabrasion-con-punta-de-diamante', 'Microdermoabrasión con Punta de Diamante', 'Exfoliación mecánica que elimina las células muertas de la piel, revelando una capa más suave y luminosa debajo.', 'https://placehold.co/600x400', 'microdermabrasion', 149.00, 45),
('peeling-quimico-personalizado', 'Peeling Químico Personalizado', 'Una solución química aplicada a la piel para tratar el acné, la pigmentación irregular y las arrugas finas, adaptada a tus necesidades.', 'https://placehold.co/600x400', 'chemical peel', 179.00, 60);