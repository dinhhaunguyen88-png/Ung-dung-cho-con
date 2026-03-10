-- =====================================================
-- Math Buddy Phase 2: Migration SQL
-- Run this in Supabase SQL Editor
-- Date: 2026-03-10
-- =====================================================

-- 1. Add role, email, password_hash columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create unique index on email (only for non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

-- 2. Create classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    teacher_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup by teacher
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(teacher_id);
-- Index for quick lookup by join code
CREATE INDEX IF NOT EXISTS idx_classes_joincode ON classes(join_code);

-- 3. Create class_members table
CREATE TABLE IF NOT EXISTS class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, user_id)
);

-- Index for listing members of a class
CREATE INDEX IF NOT EXISTS idx_class_members_class ON class_members(class_id);
-- Index for finding what classes a user belongs to
CREATE INDEX IF NOT EXISTS idx_class_members_user ON class_members(user_id);

-- 4. Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'math',
    topic TEXT,
    question_count INTEGER DEFAULT 5,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for listing assignments of a class
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);

-- 5. Enable Row Level Security (RLS) on new tables
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Allow anon access for now (same as existing tables)
-- In production, these should be locked down to authenticated users
CREATE POLICY "Allow all access to classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to class_members" ON class_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to assignments" ON assignments FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- VERIFICATION: Check schema
-- =====================================================
-- After running, verify with:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
-- SELECT * FROM classes LIMIT 1;
-- SELECT * FROM class_members LIMIT 1;
-- SELECT * FROM assignments LIMIT 1;
