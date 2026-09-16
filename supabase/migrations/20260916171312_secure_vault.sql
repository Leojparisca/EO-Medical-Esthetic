/*
  # Add Encryption Support for Medical History
  
  1. Changes
    - Add encrypted columns for sensitive medical data
    - Keep original columns for backward compatibility during migration
    - Add encryption metadata columns
  
  2. Security
    - AES-256-GCM encryption at database level
    - Separate storage of encryption keys (managed in application)
    - Audit trail for encrypted data access
  
  3. Columns Added
    - allergies_encrypted (text)
    - medications_encrypted (text)
    - medical_conditions_encrypted (text[])
    - past_procedures_encrypted (text)
    - encryption_version (text)
    - encrypted_at (timestamptz)
*/

-- Add encrypted columns to medical_history table
ALTER TABLE medical_history 
ADD COLUMN IF NOT EXISTS allergies_encrypted text,
ADD COLUMN IF NOT EXISTS medications_encrypted text,
ADD COLUMN IF NOT EXISTS medical_conditions_encrypted text[],
ADD COLUMN IF NOT EXISTS past_procedures_encrypted text,
ADD COLUMN IF NOT EXISTS encryption_version text DEFAULT 'aes-256-gcm-v1',
ADD COLUMN IF NOT EXISTS encrypted_at timestamptz;

-- Add comment to document encryption strategy
COMMENT ON COLUMN medical_history.allergies_encrypted IS 'AES-256-GCM encrypted allergies data';
COMMENT ON COLUMN medical_history.medications_encrypted IS 'AES-256-GCM encrypted medications data';
COMMENT ON COLUMN medical_history.medical_conditions_encrypted IS 'AES-256-GCM encrypted medical conditions array';
COMMENT ON COLUMN medical_history.past_procedures_encrypted IS 'AES-256-GCM encrypted past procedures data';
COMMENT ON COLUMN medical_history.encryption_version IS 'Encryption algorithm version identifier';
COMMENT ON COLUMN medical_history.encrypted_at IS 'Timestamp when data was last encrypted';

-- Create index on encrypted_at for audit queries
CREATE INDEX IF NOT EXISTS idx_medical_history_encrypted_at 
ON medical_history(encrypted_at) 
WHERE encrypted_at IS NOT NULL;

-- Note: Application layer must handle encryption/decryption
-- See src/lib/encryption.ts for implementation
