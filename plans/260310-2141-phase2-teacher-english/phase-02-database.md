# Phase 02: Database Schema Extension
**Status:** ⬜ Pending
**Dependencies:** Phase 01

## Objective
Mở rộng Supabase schema để hỗ trợ roles (teacher/student), lớp học, và bài tập giao.

## Schema Changes (Supabase)

### Modify: `users` table
- Thêm cột `role` TEXT DEFAULT 'student' — ('student' | 'teacher')
- Thêm cột `email` TEXT (nullable, cho giáo viên đăng nhập)
- Thêm cột `password_hash` TEXT (nullable, cho giáo viên)

### New: `classes` table
```sql
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    teacher_id INTEGER REFERENCES users(id),
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### New: `class_members` table
```sql
CREATE TABLE class_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, user_id)
);
```

### New: `assignments` table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject TEXT NOT NULL DEFAULT 'math',
    topic TEXT,
    question_count INTEGER DEFAULT 5,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Implementation Steps
1. [ ] Tạo migration SQL cho Supabase (chạy trong SQL Editor)
2. [ ] Thêm cột role/email/password_hash vào users table
3. [ ] Tạo classes table với join_code generation
4. [ ] Tạo class_members table
5. [ ] Tạo assignments table
6. [ ] Update TypeScript types trong `src/types/index.ts`

## Files to Create/Modify
- `src/types/index.ts` — Thêm Teacher, Class, Assignment types
- `src/types/teacher.ts` — [NEW] Teacher-specific types

## Test Criteria
- [ ] Có thể insert/query từ Supabase dashboard
- [ ] TypeScript types match schema
- [ ] Existing app vẫn hoạt động bình thường

---
Next Phase: [Phase 03 - Teacher Auth & Roles](./phase-03-auth.md)
