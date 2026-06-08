-- Full Supabase schema and seed script for Family Health Command Center
-- Drops everything and inserts demo data with valid PostgreSQL UUIDs.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS expense_records CASCADE;
DROP TABLE IF EXISTS medical_tasks CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS anomalies CASCADE;
DROP TABLE IF EXISTS fda_recalls CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS consent_links CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS hospitals CASCADE;
DROP TABLE IF EXISTS families CASCADE;
DROP TYPE IF EXISTS access_level;

-- Supabase Schema for Family Health Command Center
-- Supabase Schema for Family Health Command Center (detailed, relational)

/*
  Notes:
  - This full script is intended to be run in the Supabase SQL editor.
  - It includes both schema creation and demo seed data.
  - Requires pgcrypto for gen_random_uuid().
*/

-- Families table with counts and metadata
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  primary_contact TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  members_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hospitals: departments_count and patients_count maintained by triggers
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  admin_email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  departments_count INTEGER NOT NULL DEFAULT 0,
  patients_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Members: linked to families and optionally to a primary hospital
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  dob DATE,
  blood_type TEXT,
  relation TEXT,
  status TEXT NOT NULL DEFAULT 'healthy',
  primary_hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admins (application-level admins)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'support_admin',
  tfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consent links define access grants from hospitals to member records
CREATE TYPE access_level AS ENUM ('none','readonly','full','emergency');

CREATE TABLE IF NOT EXISTS consent_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  access_level access_level NOT NULL DEFAULT 'none',
  granted_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, hospital_id)
);

-- Audit logs for actions across the system
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NULL,
  actor_role TEXT,
  actor TEXT,
  action TEXT NOT NULL,
  target TEXT,
  target_type TEXT,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FDA recalls and associations
CREATE TABLE IF NOT EXISTS fda_recalls (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  lots TEXT,
  severity TEXT NOT NULL,
  issue_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anomalies / alerts
CREATE TABLE IF NOT EXISTS anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  entity TEXT,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  ip_address TEXT,
  location TEXT,
  action_context JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Medical records, timeline events, tasks and other domain entities
CREATE TABLE IF NOT EXISTS medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  uploaded_by UUID REFERENCES admins(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  doctor_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  doctor TEXT,
  hospital TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  due_date DATE,
  category TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relation TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FUNCTIONS & TRIGGERS

-- 1) Maintain families.members_count on members insert/delete
CREATE OR REPLACE FUNCTION fn_update_family_member_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE families SET members_count = members_count + 1, updated_at = NOW() WHERE id = NEW.family_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE families SET members_count = GREATEST(members_count - 1, 0), updated_at = NOW() WHERE id = OLD.family_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.family_id <> OLD.family_id THEN
      -- decrement old family, increment new family
      UPDATE families SET members_count = GREATEST(members_count - 1, 0), updated_at = NOW() WHERE id = OLD.family_id;
      UPDATE families SET members_count = members_count + 1, updated_at = NOW() WHERE id = NEW.family_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_members_family_count ON members;
CREATE TRIGGER trg_members_family_count
AFTER INSERT OR DELETE OR UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION fn_update_family_member_count();

-- 2) Maintain hospitals.patients_count when members.primary_hospital_id changes
CREATE OR REPLACE FUNCTION fn_update_hospital_patients_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.primary_hospital_id IS NOT NULL THEN
      UPDATE hospitals SET patients_count = patients_count + 1, updated_at = NOW() WHERE id = NEW.primary_hospital_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.primary_hospital_id IS NOT NULL THEN
      UPDATE hospitals SET patients_count = GREATEST(patients_count - 1, 0), updated_at = NOW() WHERE id = OLD.primary_hospital_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.primary_hospital_id IS DISTINCT FROM OLD.primary_hospital_id THEN
      IF OLD.primary_hospital_id IS NOT NULL THEN
        UPDATE hospitals SET patients_count = GREATEST(patients_count - 1, 0), updated_at = NOW() WHERE id = OLD.primary_hospital_id;
      END IF;
      IF NEW.primary_hospital_id IS NOT NULL THEN
        UPDATE hospitals SET patients_count = patients_count + 1, updated_at = NOW() WHERE id = NEW.primary_hospital_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_members_hospital_count ON members;
CREATE TRIGGER trg_members_hospital_count
AFTER INSERT OR DELETE OR UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION fn_update_hospital_patients_count();

-- 3) Audit consent_links changes
CREATE OR REPLACE FUNCTION fn_audit_consent_changes() RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    payload = jsonb_build_object('member_id', NEW.member_id, 'hospital_id', NEW.hospital_id, 'access_level', NEW.access_level);
    INSERT INTO audit_logs(actor_id, actor_role, action, target_type, target_id, details, created_at)
    VALUES (NEW.granted_by, 'admin', 'consent_granted', 'consent_links', NEW.id, payload, NOW());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    payload = jsonb_build_object('old_level', OLD.access_level, 'new_level', NEW.access_level, 'member_id', NEW.member_id, 'hospital_id', NEW.hospital_id);
    INSERT INTO audit_logs(actor_id, actor_role, action, target_type, target_id, details, created_at)
    VALUES (COALESCE(NEW.granted_by, OLD.granted_by), 'admin', 'consent_updated', 'consent_links', NEW.id, payload, NOW());
    UPDATE consent_links SET updated_at = NOW() WHERE id = NEW.id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    payload = jsonb_build_object('member_id', OLD.member_id, 'hospital_id', OLD.hospital_id, 'old_level', OLD.access_level);
    INSERT INTO audit_logs(actor_id, actor_role, action, target_type, target_id, details, created_at)
    VALUES (NULL, 'system', 'consent_revoked', 'consent_links', OLD.id, payload, NOW());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_consent ON consent_links;
CREATE TRIGGER trg_audit_consent
AFTER INSERT OR UPDATE OR DELETE ON consent_links
FOR EACH ROW EXECUTE FUNCTION fn_audit_consent_changes();

-- 4) Audit generic admin actions helper function (can be used by application)
CREATE OR REPLACE FUNCTION fn_log_admin_action(actor UUID, actor_role TEXT, action TEXT, target_type TEXT, target_id TEXT, details JSONB) RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_logs(actor_id, actor_role, action, target_type, target_id, details, created_at)
  VALUES (actor, actor_role, action, target_type, target_id, details, NOW());
END;
$$ LANGUAGE plpgsql;

-- Indexes to speed lookups
CREATE INDEX IF NOT EXISTS idx_members_family_id ON members(family_id);
CREATE INDEX IF NOT EXISTS idx_medical_records_member_id ON medical_records(member_id);
CREATE INDEX IF NOT EXISTS idx_consent_member_hospital ON consent_links(member_id, hospital_id);

-- End of schema

-- Seed data for Family Health Command Center

-- Families
INSERT INTO families (id, name, primary_contact, status, created_at, updated_at) VALUES ('52f2eaff-aad3-4455-8381-e8c8dce4992d', 'Sharma Family', 'contact@sharma.family', 'active', NOW(), NOW());
INSERT INTO families (id, name, primary_contact, status, created_at, updated_at) VALUES ('f2010ffd-d2c1-4bc7-a9ba-56bf6d004f7b', 'Gupta Family', 'contact@gupta.family', 'active', NOW(), NOW());
INSERT INTO families (id, name, primary_contact, status, created_at, updated_at) VALUES ('d7b9d637-0d03-4619-b462-fd570467467b', 'Patel Family', 'contact@patel.family', 'active', NOW(), NOW());

-- Hospitals
INSERT INTO hospitals (id, name, address, admin_email, status, departments_count, patients_count, created_at, updated_at) VALUES ('7233f125-0f5e-46bd-b261-baf0f9afe455', 'Apollo Medical Center', '123 Main St, Mumbai', 'admin@apollo.in', 'active', 12, 0, NOW(), NOW());
INSERT INTO hospitals (id, name, address, admin_email, status, departments_count, patients_count, created_at, updated_at) VALUES ('5335d6f2-573e-455f-86bf-f02c83850265', 'City General Hospital', '45 Park Ave, Delhi', 'admin@citygeneral.in', 'active', 10, 0, NOW(), NOW());
INSERT INTO hospitals (id, name, address, admin_email, status, departments_count, patients_count, created_at, updated_at) VALUES ('26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', 'Metro Health Institute', '88 Oak Street, Bangalore', 'contact@metrohealth.in', 'active', 9, 0, NOW(), NOW());

-- Admins
INSERT INTO admins (id, name, email, role, tfa_enabled, status, last_login, created_at) VALUES ('4350278d-6bcb-4a21-ae69-16804e64da30', 'Administrator', 'admin@fhcc.com', 'super_admin', true, 'active', NOW(), NOW());

-- Members
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('a62725f3-b584-4031-892c-409cad222894', '52f2eaff-aad3-4455-8381-e8c8dce4992d', 'Aanya', 'Sharma', '1960-03-11', 'B+', 'Grandparent', 'warning', '5335d6f2-573e-455f-86bf-f02c83850265', NOW(), NOW());
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('af6ac7b0-7f2b-43bb-a647-e9c15d789cb2', '52f2eaff-aad3-4455-8381-e8c8dce4992d', 'Dev', 'Sharma', '1961-04-15', 'O+', 'Parent', 'critical', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', NOW(), NOW());
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('14004fd8-3d7c-4887-b20a-fb5a201eae42', 'f2010ffd-d2c1-4bc7-a9ba-56bf6d004f7b', 'Aanya', 'Gupta', '1960-05-20', 'O+', 'Grandparent', 'critical', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', NOW(), NOW());
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('a6d1564c-f68f-4aed-ab6a-5e5bc2a65c84', 'f2010ffd-d2c1-4bc7-a9ba-56bf6d004f7b', 'Dev', 'Gupta', '1961-06-24', 'AB+', 'Parent', 'healthy', '7233f125-0f5e-46bd-b261-baf0f9afe455', NOW(), NOW());
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('d3a980b1-ceb6-46c2-9187-4c25952b8ff1', 'd7b9d637-0d03-4619-b462-fd570467467b', 'Kavya', 'Patel', '1962-10-07', 'B-', 'Child', 'critical', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', NOW(), NOW());
INSERT INTO members (id, family_id, first_name, last_name, dob, blood_type, relation, status, primary_hospital_id, created_at, updated_at) VALUES ('bb407030-2929-48bb-8bf2-c121ae076662', 'd7b9d637-0d03-4619-b462-fd570467467b', 'Rohan', 'Patel', '1963-11-11', 'O-', 'Sibling', 'healthy', '7233f125-0f5e-46bd-b261-baf0f9afe455', NOW(), NOW());

-- Consent links
INSERT INTO consent_links (member_id, hospital_id, access_level, granted_by, granted_at, updated_at) VALUES ('a62725f3-b584-4031-892c-409cad222894', '5335d6f2-573e-455f-86bf-f02c83850265', 'full', '4350278d-6bcb-4a21-ae69-16804e64da30', NOW(), NOW());
INSERT INTO consent_links (member_id, hospital_id, access_level, granted_by, granted_at, updated_at) VALUES ('af6ac7b0-7f2b-43bb-a647-e9c15d789cb2', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', 'readonly', '4350278d-6bcb-4a21-ae69-16804e64da30', NOW(), NOW());
INSERT INTO consent_links (member_id, hospital_id, access_level, granted_by, granted_at, updated_at) VALUES ('14004fd8-3d7c-4887-b20a-fb5a201eae42', '7233f125-0f5e-46bd-b261-baf0f9afe455', 'full', '4350278d-6bcb-4a21-ae69-16804e64da30', NOW(), NOW());
INSERT INTO consent_links (member_id, hospital_id, access_level, granted_by, granted_at, updated_at) VALUES ('a6d1564c-f68f-4aed-ab6a-5e5bc2a65c84', '5335d6f2-573e-455f-86bf-f02c83850265', 'readonly', '4350278d-6bcb-4a21-ae69-16804e64da30', NOW(), NOW());
INSERT INTO consent_links (member_id, hospital_id, access_level, granted_by, granted_at, updated_at) VALUES ('d3a980b1-ceb6-46c2-9187-4c25952b8ff1', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', 'emergency', '4350278d-6bcb-4a21-ae69-16804e64da30', NOW(), NOW());

-- Medical records
INSERT INTO medical_records (id, member_id, hospital_id, title, category, doctor_name, notes, created_at) VALUES ('6c52e2d8-db0f-45fa-9fa0-41bfdcb59935', 'a62725f3-b584-4031-892c-409cad222894', '5335d6f2-573e-455f-86bf-f02c83850265', 'High blood pressure', 'Hypertension', 'Dr. Reddy', 'Medication and diet plan', NOW());
INSERT INTO medical_records (id, member_id, hospital_id, title, category, doctor_name, notes, created_at) VALUES ('c4f0a9c0-4d96-4082-ad9e-dcdc3796f99a', '14004fd8-3d7c-4887-b20a-fb5a201eae42', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', 'Allergic asthma', 'Asthma', 'Dr. Singh', 'Inhaler prescribed', NOW());
INSERT INTO medical_records (id, member_id, hospital_id, title, category, doctor_name, notes, created_at) VALUES ('acac8ff9-3a3c-4f55-86cc-ba2e806f50db', 'd3a980b1-ceb6-46c2-9187-4c25952b8ff1', '26d10ea1-b042-42f4-97fa-c2c2a3e7c86d', 'Fractured wrist', 'Orthopedic follow-up', 'Dr. Kapoor', 'Cast applied', NOW());

-- Timeline events
INSERT INTO timeline_events (id, member_id, date, category, title, subtitle, doctor, hospital, notes, status, created_at) VALUES ('8cc2246f-c35c-4d38-892e-cfe5340476f4', 'a62725f3-b584-4031-892c-409cad222894', '2026-05-01', 'Appointment', 'Annual checkup', '', 'Dr. Reddy', 'Apollo Medical Center', 'Everything normal', 'completed', NOW());
INSERT INTO timeline_events (id, member_id, date, category, title, subtitle, doctor, hospital, notes, status, created_at) VALUES ('a47996cc-f69e-4692-8b32-e34ac9410a60', '14004fd8-3d7c-4887-b20a-fb5a201eae42', '2026-04-15', 'Emergency', 'Asthma attack', '', 'Dr. Singh', 'City General Hospital', 'Administered nebulizer', 'completed', NOW());
INSERT INTO timeline_events (id, member_id, date, category, title, subtitle, doctor, hospital, notes, status, created_at) VALUES ('8a4d87e0-5c40-42a1-8c46-6a8dc9fa2d9b', 'd3a980b1-ceb6-46c2-9187-4c25952b8ff1', '2026-03-20', 'Follow-up', 'Cast removal', '', 'Dr. Kapoor', 'Metro Health Institute', 'Healing well', 'completed', NOW());

-- Medical tasks
INSERT INTO medical_tasks (id, title, member_id, due_date, category, completed, created_at) VALUES ('0451198e-ef5f-485a-b32c-3fba176cf7fb', 'Blood pressure check', 'a62725f3-b584-4031-892c-409cad222894', '2026-06-01', 'followup', false, NOW());
INSERT INTO medical_tasks (id, title, member_id, due_date, category, completed, created_at) VALUES ('2700313d-a48b-4149-a900-913e031e0055', 'Inhaler refill', '14004fd8-3d7c-4887-b20a-fb5a201eae42', '2026-05-10', 'followup', false, NOW());
INSERT INTO medical_tasks (id, title, member_id, due_date, category, completed, created_at) VALUES ('89cbeeba-5fde-4b38-af88-2964f64d4ca0', 'Physical therapy session', 'd3a980b1-ceb6-46c2-9187-4c25952b8ff1', '2026-04-30', 'followup', false, NOW());

-- Expense records
INSERT INTO expense_records (id, title, member_id, amount, date, category, status, created_at) VALUES ('ce4faf6f-580c-44b5-b6ec-224b049951a1', 'Medication refill', 'a62725f3-b584-4031-892c-409cad222894', 4500.0, '2026-04-01', 'medical', 'completed', NOW());
INSERT INTO expense_records (id, title, member_id, amount, date, category, status, created_at) VALUES ('acce8949-68c1-4b5e-9996-ae79f33a29b5', 'ER treatment', '14004fd8-3d7c-4887-b20a-fb5a201eae42', 12000.0, '2026-04-01', 'medical', 'pending', NOW());
INSERT INTO expense_records (id, title, member_id, amount, date, category, status, created_at) VALUES ('45f67bdc-bc3a-4231-828c-b7c60abb24c4', 'Physiotherapy', 'd3a980b1-ceb6-46c2-9187-4c25952b8ff1', 3800.0, '2026-04-01', 'medical', 'completed', NOW());

-- Emergency contacts
INSERT INTO emergency_contacts (id, member_id, name, relation, phone, email, created_at) VALUES ('ecd38c85-4603-4e27-948b-2bb363143ee4', 'a62725f3-b584-4031-892c-409cad222894', 'Pooja Sharma', 'Daughter', '+911234567890', 'pooja@sharma.family', NOW());
INSERT INTO emergency_contacts (id, member_id, name, relation, phone, email, created_at) VALUES ('784adef6-d297-4507-9544-69fa92b92050', '14004fd8-3d7c-4887-b20a-fb5a201eae42', 'Rakesh Gupta', 'Son', '+919876543210', 'rakesh@gupta.family', NOW());
INSERT INTO emergency_contacts (id, member_id, name, relation, phone, email, created_at) VALUES ('169d44e9-37ba-4612-a4c7-5c3926ceb931', 'd3a980b1-ceb6-46c2-9187-4c25952b8ff1', 'Mira Patel', 'Sister', '+919112233445', 'mira@patel.family', NOW());
