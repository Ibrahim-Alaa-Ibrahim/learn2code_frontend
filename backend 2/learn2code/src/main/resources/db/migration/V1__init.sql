-- V1 init
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PARENT',
  phone TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS uk_users_email ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS courses (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO courses (title, description, price, image_url, is_active) VALUES
('Introduction to Web Development','Learn HTML, CSS, and basics of websites',80.00,NULL,TRUE),
('Introduction to Artificial Intelligence','Simple concepts of AI and Machine Learning',100.00,NULL,TRUE),
('Introduction to Python Programming','Learn Python basics: variables, loops, and functions',70.00,NULL,TRUE),
('Introduction to Databases','Basics of storing data with SQL',90.00,NULL,TRUE)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  method TEXT,
  provider TEXT,
  provider_txn_id TEXT,
  status TEXT,
  receipt_number TEXT UNIQUE,
  card_brand TEXT,
  card_last4 TEXT,
  billing_name TEXT,
  billing_email TEXT,
  billing_address JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_txn ON payments(provider_txn_id);

CREATE TABLE IF NOT EXISTS user_courses (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_courses_unique UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_course ON user_courses(course_id);

