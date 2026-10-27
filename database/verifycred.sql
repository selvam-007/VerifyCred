/* ============================================================
   VerifyCred Database Schema – MySQL
   database/verifycred.sql
   ============================================================ */

-- Create database
CREATE DATABASE IF NOT EXISTS verifycred;
USE verifycred;

-- ============================================================
-- 1. Users (base table for all roles)
-- ============================================================
CREATE TABLE users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('student','faculty','company','admin') NOT NULL DEFAULT 'student',
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. Students
-- ============================================================
CREATE TABLE students (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  roll_number     VARCHAR(50) UNIQUE,
  college_id      INT,
  department      VARCHAR(150),
  year            TINYINT,
  photo_url       VARCHAR(500),
  bio             TEXT,
  github_url      VARCHAR(500),
  linkedin_url    VARCHAR(500),
  portfolio_slug  VARCHAR(100) UNIQUE,
  profile_views   INT DEFAULT 0,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. Colleges
-- ============================================================
CREATE TABLE colleges (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  city         VARCHAR(100),
  state        VARCHAR(100),
  type         VARCHAR(100),
  is_approved  BOOLEAN DEFAULT FALSE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. Faculty
-- ============================================================
CREATE TABLE faculty (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  name          VARCHAR(200) NOT NULL,
  employee_id   VARCHAR(50) UNIQUE,
  college_id    INT,
  department    VARCHAR(150),
  designation   VARCHAR(150),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (college_id) REFERENCES colleges(id)
);

-- ============================================================
-- 5. Companies
-- ============================================================
CREATE TABLE companies (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  company_name    VARCHAR(255) NOT NULL,
  recruiter_name  VARCHAR(200),
  city            VARCHAR(100),
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. Certificates
-- ============================================================
CREATE TABLE certificates (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  student_id          INT NOT NULL,
  certificate_name    VARCHAR(300) NOT NULL,
  certificate_uid     VARCHAR(100) UNIQUE,     -- e.g. VC-2024-AWS-00123
  issued_by           VARCHAR(255),
  organization        VARCHAR(255),
  category            VARCHAR(100),
  issue_date          DATE,
  expiry_date         DATE,
  description         TEXT,
  skills              VARCHAR(500),
  file_url            VARCHAR(500),
  thumbnail_url       VARCHAR(500),
  is_public           BOOLEAN DEFAULT TRUE,
  verification_status ENUM('pending','verified','rejected') DEFAULT 'pending',
  verified_by         INT,                     -- faculty id
  verified_at         DATETIME,
  rejected_reason     TEXT,
  qr_code_url         VARCHAR(500),
  digital_signature   TEXT,
  ai_check_result     ENUM('clean','suspicious','fake') DEFAULT 'clean',
  ai_check_score      DECIMAL(5,2),
  blockchain_hash     VARCHAR(500),
  created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES faculty(id)
);

-- ============================================================
-- 7. Projects
-- ============================================================
CREATE TABLE projects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  student_id    INT NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  tech_stack    VARCHAR(500),
  github_url    VARCHAR(500),
  live_url      VARCHAR(500),
  status        ENUM('completed','in_progress') DEFAULT 'completed',
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================================
-- 8. Internships
-- ============================================================
CREATE TABLE internships (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  student_id      INT NOT NULL,
  company_name    VARCHAR(255),
  role_title      VARCHAR(255),
  start_date      DATE,
  end_date        DATE,
  certificate_id  INT,
  is_verified     BOOLEAN DEFAULT FALSE,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (certificate_id) REFERENCES certificates(id)
);

-- ============================================================
-- 9. Skills
-- ============================================================
CREATE TABLE skills (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  level      ENUM('beginner','intermediate','advanced') DEFAULT 'intermediate',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ============================================================
-- 10. QR Codes
-- ============================================================
CREATE TABLE qr_codes (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  certificate_id INT NOT NULL,
  qr_data        TEXT NOT NULL,
  qr_image_url   VARCHAR(500),
  scan_count     INT DEFAULT 0,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (certificate_id) REFERENCES certificates(id) ON DELETE CASCADE
);

-- ============================================================
-- 11. Notifications
-- ============================================================
CREATE TABLE notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  message    TEXT NOT NULL,
  type       ENUM('success','warning','info','danger') DEFAULT 'info',
  is_read    BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 12. Verification Logs
-- ============================================================
CREATE TABLE verification_logs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  certificate_id INT NOT NULL,
  verified_by_ip VARCHAR(50),
  verified_by    VARCHAR(200),
  verified_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (certificate_id) REFERENCES certificates(id)
);

-- ============================================================
-- 13. Admins
-- ============================================================
CREATE TABLE admins (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  name       VARCHAR(200),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Seed Data
-- ============================================================

-- Demo college
INSERT INTO colleges (name, city, state, type, is_approved) VALUES
  ('Anna University', 'Chennai', 'Tamil Nadu', 'State University', TRUE),
  ('VIT Chennai', 'Chennai', 'Tamil Nadu', 'Deemed University', TRUE);

-- Demo admin user
INSERT INTO users (email, password, role) VALUES ('admin@verifycred.com', '$2b$10$hashedpassword', 'admin');
INSERT INTO admins (user_id, name) VALUES (1, 'Super Admin');

-- Demo student user
INSERT INTO users (email, password, role) VALUES ('tharun@student.com', '$2b$10$hashedpassword', 'student');
INSERT INTO students (user_id, first_name, last_name, roll_number, college_id, department, year, portfolio_slug)
  VALUES (2, 'Tharun', 'M', '24AIDS103', 1, 'AI & Data Science', 4, 'tharun');
