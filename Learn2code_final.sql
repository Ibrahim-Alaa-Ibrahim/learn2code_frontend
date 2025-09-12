-- learn2code_min.sql - Minimal schema for Learn2Code (users, courses, payments, user_courses)
-- Compatible with PostgreSQL 14+; NO COPY blocks

-- Optional reset for a dev DB (uncomment to wipe everything in public schema)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;


-- 1) Each parent can create child/student profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id               BIGSERIAL PRIMARY KEY,
  parent_user_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             TEXT   NOT NULL,
  age              INT,
  avatar_url       TEXT,
  created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_parent ON student_profiles(parent_user_id);

-- 2) Allow an enrolled course to be assigned to a specific student profile
-- (keeps your existing parent->course ownership but *optionally* ties to a child)
ALTER TABLE user_courses
  ADD COLUMN IF NOT EXISTS student_id BIGINT NULL REFERENCES student_profiles(id) ON DELETE SET NULL;

-- One student cannot be assigned the same course twice:
-- (NULLs are distinct, so this still allows parent-level enrollments without student)
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_courses_student_course
  ON user_courses(student_id, course_id)
  WHERE student_id IS NOT NULL;

-- Optional: make it fast to query a parent’s courses for a given student
CREATE INDEX IF NOT EXISTS idx_user_courses_student ON user_courses(student_id);

-- 3) (Optional) If you want to see which student a payment was for, add a nullable student_id to payments too.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS student_id BIGINT NULL REFERENCES student_profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);

-- ===================== USERS =====================
CREATE TABLE IF NOT EXISTS public.users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'PARENT',
  phone         TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_email ON public.users (LOWER(email));

-- ===================== COURSES =====================
CREATE TABLE IF NOT EXISTS public.courses (
  id         BIGSERIAL PRIMARY KEY,
  title      TEXT           NOT NULL,
  description TEXT,
  price      NUMERIC(10,2)  NOT NULL,
  image_url  TEXT,
  is_active  BOOLEAN        NOT NULL DEFAULT TRUE
);

-- Seed sample courses (safe to delete/change)
INSERT INTO public.courses (title, description, price, image_url, is_active) VALUES
('Introduction to Web Development','Learn HTML, CSS, and basics of websites',80.00,NULL,TRUE),
('Introduction to Artificial Intelligence','Simple concepts of AI and Machine Learning',100.00,NULL,TRUE),
('Introduction to Python Programming','Learn Python basics: variables, loops, and functions',70.00,NULL,TRUE),
('Introduction to Databases','Basics of storing data with SQL',90.00,NULL,TRUE)
ON CONFLICT DO NOTHING;

-- ===================== PAYMENTS (digital receipts) =====================
CREATE TABLE IF NOT EXISTS public.payments (
  id               BIGSERIAL PRIMARY KEY,
  user_id          BIGINT        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  amount           NUMERIC(10,2) NOT NULL,     -- subtotal
  currency         CHAR(3)       NOT NULL DEFAULT 'USD',
  tax_amount       NUMERIC(10,2) DEFAULT 0,
  total_amount     NUMERIC(10,2) NOT NULL,     -- final total

  method           TEXT,                       -- 'card','paypal',...
  provider         TEXT,                       -- 'stripe','adyen',...
  provider_txn_id  TEXT,                       -- gateway transaction id
  status           TEXT,                       -- 'pending','captured','failed',...

  receipt_number   TEXT UNIQUE,
  card_brand       TEXT,
  card_last4       TEXT,
  billing_name     TEXT,
  billing_email    TEXT,
  billing_address  JSONB,

  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_txn ON public.payments(provider_txn_id);

-- ===================== USER_COURSES (purchases) =====================
CREATE TABLE IF NOT EXISTS public.user_courses (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id    BIGINT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  payment_id   BIGINT REFERENCES public.payments(id) ON DELETE SET NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_courses_unique UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON public.user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course ON public.user_courses(course_id);
