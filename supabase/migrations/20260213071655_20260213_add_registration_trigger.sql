/*
  # Add trigger for automatic registration ID assignment

  1. Function
    - Create function to auto-assign registration_id on insert
  2. Trigger
    - Apply to users table
*/

CREATE OR REPLACE FUNCTION assign_registration_id_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.registration_id IS NULL THEN
    NEW.registration_id := nextval('registration_id_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assign_registration_id ON users;

CREATE TRIGGER assign_registration_id
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION assign_registration_id_trigger();
