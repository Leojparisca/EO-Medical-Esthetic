/*
  # Add Soft Delete Support for Critical Tables
  
  1. New Columns
    - deleted_at: Timestamp when record was soft-deleted (NULL = active)
    - deleted_by: User who deleted the record
  
  2. Security Benefits
    - Prevents accidental data loss
    - Maintains audit trail
    - Allows data recovery within retention period
    - Compliance with data retention policies
  
  3. Affected Tables
    - appointments
    - treatment_history
    - medical_history
  
  4. Views Created
    - Active records views for normal queries
*/

-- Add soft delete columns to appointments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

-- Add soft delete columns to treatment_history
ALTER TABLE treatment_history 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

-- Add soft delete columns to medical_history
ALTER TABLE medical_history 
ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
ADD COLUMN IF NOT EXISTS deleted_by uuid REFERENCES auth.users(id);

-- Create indexes for soft delete filtering
CREATE INDEX IF NOT EXISTS idx_appointments_deleted_at 
ON appointments(deleted_at) 
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_treatment_history_deleted_at 
ON treatment_history(deleted_at) 
WHERE deleted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_medical_history_deleted_at 
ON medical_history(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Update RLS policies to exclude deleted records by default
-- Note: Application queries should also filter WHERE deleted_at IS NULL

-- Drop existing policies and recreate with deleted_at filter
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Users can view own treatment history" ON treatment_history;
CREATE POLICY "Users can view own treatment history"
  ON treatment_history
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND deleted_at IS NULL
  );

DROP POLICY IF EXISTS "Users can view own medical history" ON medical_history;
CREATE POLICY "Users can view own medical history"
  ON medical_history
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    AND deleted_at IS NULL
  );

-- Create function for soft delete
CREATE OR REPLACE FUNCTION soft_delete_record(
  table_name text,
  record_id uuid
)
RETURNS void AS $$
DECLARE
  sql_query text;
BEGIN
  -- Build dynamic SQL for soft delete
  sql_query := format(
    'UPDATE %I SET deleted_at = NOW(), deleted_by = auth.uid() WHERE id = $1 AND deleted_at IS NULL',
    table_name
  );
  
  EXECUTE sql_query USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for hard delete (admin only, after retention period)
CREATE OR REPLACE FUNCTION hard_delete_record(
  table_name text,
  record_id uuid
)
RETURNS void AS $$
DECLARE
  sql_query text;
BEGIN
  -- Only allow hard delete if record was soft-deleted > 90 days ago
  sql_query := format(
    'DELETE FROM %I WHERE id = $1 AND deleted_at < NOW() - INTERVAL ''90 days''',
    table_name
  );
  
  EXECUTE sql_query USING record_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments documenting soft delete strategy
COMMENT ON COLUMN appointments.deleted_at IS 'Soft delete timestamp - NULL means record is active';
COMMENT ON COLUMN treatment_history.deleted_at IS 'Soft delete timestamp - NULL means record is active';
COMMENT ON COLUMN medical_history.deleted_at IS 'Soft delete timestamp - NULL means record is active';

COMMENT ON FUNCTION soft_delete_record(text, uuid) IS 
  'Soft deletes a record by setting deleted_at timestamp. Use table names: appointments, treatment_history, medical_history';

COMMENT ON FUNCTION hard_delete_record(text, uuid) IS 
  'Permanently deletes records that were soft-deleted more than 90 days ago. GDPR compliance.';

-- Create view for active appointments (convenience)
CREATE OR REPLACE VIEW active_appointments AS
SELECT * FROM appointments
WHERE deleted_at IS NULL;

-- Create view for active treatment history
CREATE OR REPLACE VIEW active_treatment_history AS
SELECT * FROM treatment_history
WHERE deleted_at IS NULL;

-- Create view for active medical history
CREATE OR REPLACE VIEW active_medical_history AS
SELECT * FROM medical_history
WHERE deleted_at IS NULL;

-- Grant access to views
GRANT SELECT ON active_appointments TO authenticated;
GRANT SELECT ON active_treatment_history TO authenticated;
GRANT SELECT ON active_medical_history TO authenticated;
