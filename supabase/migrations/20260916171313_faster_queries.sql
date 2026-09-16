/*
  # Add Performance Indexes and Constraints for Appointments
  
  1. New Indexes
    - appointment_date: For filtering by date ranges
    - user_id + status: For user dashboard queries
    - treatment_id: For join optimization
  
  2. Database Constraints
    - Check constraint on appointment_date (must be future or today)
    - Check constraint on time format (HH:MM)
    - NOT NULL constraints on critical fields
  
  3. Security
    - Maintain RLS policies
    - Add audit trigger for status changes
*/

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_appointments_date 
ON appointments(appointment_date DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_user_status 
ON appointments(user_id, status) 
WHERE status = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_appointments_treatment 
ON appointments(treatment_id);

CREATE INDEX IF NOT EXISTS idx_appointments_created_at 
ON appointments(created_at DESC);

-- Add check constraint for valid appointment dates (must be today or future)
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS chk_appointment_date_future;

ALTER TABLE appointments 
ADD CONSTRAINT chk_appointment_date_future 
CHECK (appointment_date >= CURRENT_DATE);

-- Add check constraint for valid time format (HH:MM in 24h format)
ALTER TABLE appointments 
DROP CONSTRAINT IF EXISTS chk_time_format;

ALTER TABLE appointments 
ADD CONSTRAINT chk_time_format 
CHECK (time ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

-- Ensure critical fields are NOT NULL
ALTER TABLE appointments 
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN appointment_date SET NOT NULL,
ALTER COLUMN time SET NOT NULL;

-- Add comment documenting the constraints
COMMENT ON CONSTRAINT chk_appointment_date_future ON appointments IS 
  'Prevents booking appointments in the past';
  
COMMENT ON CONSTRAINT chk_time_format ON appointments IS 
  'Ensures time is in HH:MM 24-hour format (e.g., 09:00, 14:30, 23:59)';

-- Create function to log appointment status changes
CREATE OR REPLACE FUNCTION log_appointment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO appointment_status_audit (
      appointment_id,
      old_status,
      new_status,
      changed_at,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NOW(),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit table for appointment status changes
CREATE TABLE IF NOT EXISTS appointment_status_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  old_status appointment_status,
  new_status appointment_status NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id)
);

-- Enable RLS on audit table
ALTER TABLE appointment_status_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs (adjust policy as needed)
CREATE POLICY "Admins can view appointment audit logs"
  ON appointment_status_audit
  FOR SELECT
  TO authenticated
  USING (true); -- TODO: Replace with actual admin check

-- Create trigger to automatically log status changes
DROP TRIGGER IF EXISTS trg_log_appointment_status_change ON appointments;

CREATE TRIGGER trg_log_appointment_status_change
  AFTER UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION log_appointment_status_change();

-- Add index on audit table for efficient querying
CREATE INDEX IF NOT EXISTS idx_audit_appointment_id 
ON appointment_status_audit(appointment_id);

CREATE INDEX IF NOT EXISTS idx_audit_changed_at 
ON appointment_status_audit(changed_at DESC);
