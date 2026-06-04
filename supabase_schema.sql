-- Supabase Schema for Family Health Command Center

-- 1. Families
CREATE TABLE families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  primary_contact TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Members
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  dob DATE,
  blood_type TEXT
);

-- 3. Hospitals
CREATE TABLE hospitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  admin_email TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  departments_count INTEGER DEFAULT 0,
  patients_count INTEGER DEFAULT 0
);

-- 4. Admins
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Support Admin',
  tfa_enabled BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'Active',
  last_login TIMESTAMP WITH TIME ZONE
);

-- 5. Consent Links
CREATE TABLE consent_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  access_level TEXT NOT NULL DEFAULT 'none',
  UNIQUE(member_id, hospital_id)
);

-- 6. Audit Logs
CREATE TABLE audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. FDA Recalls
CREATE TABLE fda_recalls (
  id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  lots TEXT,
  severity TEXT NOT NULL,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fam_count INTEGER DEFAULT 0,
  hosp_count INTEGER DEFAULT 0
);

-- 8. Anomalies
CREATE TABLE anomalies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity TEXT NOT NULL,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  ip_address TEXT,
  location TEXT,
  action_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Mock Data Seed
INSERT INTO families (id, name, primary_contact, status, created_at) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'Sharma Family', 'ravi@example.com', 'Active', '2024-01-15T00:00:00Z'),
  ('f2222222-2222-2222-2222-222222222222', 'Gupta Family', 'amit@example.com', 'Active', '2024-02-22T00:00:00Z');

INSERT INTO members (id, family_id, first_name, dob, blood_type) VALUES
  ('m1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', 'Gayatri', '1952-04-12', 'O+'),
  ('m2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', 'Ravi', '1976-08-23', 'A+');

INSERT INTO hospitals (id, name, address, admin_email, status, departments_count, patients_count) VALUES
  ('h1111111-1111-1111-1111-111111111111', 'Apollo Medical Center', '123 Main St, Mumbai', 'admin@apollo.in', 'Active', 12, 1245),
  ('h2222222-2222-2222-2222-222222222222', 'City General Hospital', '45 Park Ave, Delhi', 'it@citygeneral.in', 'Active', 8, 890);

INSERT INTO admins (id, name, email, role, tfa_enabled, status) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'Dr. Suresh Agarwal', 'suresh.a@fhcc.com', 'Super Admin', true, 'Active');

INSERT INTO fda_recalls (id, product, manufacturer, lots, severity, fam_count, hosp_count) VALUES
  ('REC-2024-0891', 'OrthoTech Hip Implant ZX-500', 'OrthoTech Biomed', 'L-902, L-903', 'critical', 23, 4),
  ('REC-2024-0902', 'MedCorp Insulin Pump V3', 'MedCorp Intl.', 'All Lots < 2023', 'high', 156, 12);

INSERT INTO consent_links (member_id, hospital_id, access_level) VALUES
  ('m1111111-1111-1111-1111-111111111111', 'h1111111-1111-1111-1111-111111111111', 'full'),
  ('m2222222-2222-2222-2222-222222222222', 'h1111111-1111-1111-1111-111111111111', 'readonly');
