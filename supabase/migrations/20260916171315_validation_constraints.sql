/*
  # Add Validation Constraints for Medical History
  
  1. Database-Level Validations
    - Age validation (must be 18+ or have guardian consent)
    - Date of birth validation (reasonable range)
    - Skin type validation (enum enforcement)
    - Consent requirement enforcement
  
  2. Data Quality
    - Prevent invalid data entry at database level
    - Reduce application-layer validation burden
    - Ensure data integrity across all access points
  
  3. Compliance
    - GDPR age requirements
    - Medical consent documentation
    - Audit trail for consent changes
*/

-- Add check constraint for reasonable date of birth (between 1900 and current year)
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_date_of_birth_range;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_date_of_birth_range 
CHECK (
  date_of_birth >= DATE '1900-01-01' 
  AND date_of_birth <= CURRENT_DATE
);

-- Add check constraint for age (must be 18+ for self-consent)
-- Note: For minors, implement guardian consent flow in application
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_minimum_age;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_minimum_age 
CHECK (
  EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) >= 18
  OR consent = true -- Allow if explicit consent is given (guardian consent case)
);

-- Ensure skin_type is one of the valid enum values (already enforced by enum, but explicit check)
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_skin_type_valid;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_skin_type_valid 
CHECK (skin_type IN ('normal', 'dry', 'oily', 'combination', 'sensitive'));

-- Ensure consent is required for valid records
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_consent_required;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_consent_required 
CHECK (
  consent = true
);

-- Add check for maximum length of text fields (prevent DoS by huge inputs)
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_allergies_length;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_allergies_length 
CHECK (
  allergies IS NULL 
  OR char_length(allergies) <= 5000
);

ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_medications_length;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_medications_length 
CHECK (
  medications IS NULL 
  OR char_length(medications) <= 5000
);

ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_past_procedures_length;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_past_procedures_length 
CHECK (
  past_procedures IS NULL 
  OR char_length(past_procedures) <= 10000
);

-- Add check for medical_conditions array size (reasonable limit)
ALTER TABLE medical_history 
DROP CONSTRAINT IF EXISTS chk_medical_conditions_array_size;

ALTER TABLE medical_history 
ADD CONSTRAINT chk_medical_conditions_array_size 
CHECK (
  medical_conditions IS NULL 
  OR array_length(medical_conditions, 1) <= 50
);

-- Create audit table for consent changes
CREATE TABLE IF NOT EXISTS medical_history_consent_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medical_history_id uuid REFERENCES medical_history(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  old_consent boolean,
  new_consent boolean NOT NULL,
  changed_at timestamptz DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id),
  ip_address inet,
  user_agent text
);

-- Enable RLS on consent audit table
ALTER TABLE medical_history_consent_audit ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own consent audit trail
CREATE POLICY "Users can view own consent audit"
  ON medical_history_consent_audit
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to log consent changes
CREATE OR REPLACE FUNCTION log_medical_consent_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.consent IS DISTINCT FROM NEW.consent THEN
    INSERT INTO medical_history_consent_audit (
      medical_history_id,
      user_id,
      old_consent,
      new_consent,
      changed_at,
      changed_by
    ) VALUES (
      NEW.id,
      NEW.user_id,
      OLD.consent,
      NEW.consent,
      NOW(),
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically log consent changes
DROP TRIGGER IF EXISTS trg_log_medical_consent_change ON medical_history;

CREATE TRIGGER trg_log_medical_consent_change
  AFTER UPDATE ON medical_history
  FOR EACH ROW
  EXECUTE FUNCTION log_medical_consent_change();

-- Index for efficient audit queries
CREATE INDEX IF NOT EXISTS idx_consent_audit_user_id 
ON medical_history_consent_audit(user_id);

CREATE INDEX IF NOT EXISTS idx_consent_audit_changed_at 
ON medical_history_consent_audit(changed_at DESC);

-- Add comments documenting constraints
COMMENT ON CONSTRAINT chk_date_of_birth_range ON medical_history IS 
  'Date of birth must be between 1900 and today';
  
COMMENT ON CONSTRAINT chk_minimum_age ON medical_history IS 
  'Patient must be 18+ or have explicit consent (for guardian cases)';
  
COMMENT ON CONSTRAINT chk_consent_required ON medical_history IS 
  'Medical treatment requires explicit patient consent (GDPR/HIPAA compliance)';
  
COMMENT ON CONSTRAINT chk_allergies_length ON medical_history IS 
  'Maximum 5000 characters for allergies field (DoS prevention)';
  
COMMENT ON CONSTRAINT chk_medications_length ON medical_history IS 
  'Maximum 5000 characters for medications field (DoS prevention)';
  
COMMENT ON CONSTRAINT chk_past_procedures_length ON medical_history IS 
  'Maximum 10000 characters for past procedures field (DoS prevention)';
  
COMMENT ON CONSTRAINT chk_medical_conditions_array_size ON medical_history IS 
  'Maximum 50 medical conditions (reasonable limit)';
  
COMMENT ON TABLE medical_history_consent_audit IS 
  'Audit trail for consent changes - Required for GDPR/HIPAA compliance';
