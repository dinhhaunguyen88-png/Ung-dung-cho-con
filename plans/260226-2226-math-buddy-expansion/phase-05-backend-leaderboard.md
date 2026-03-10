# Phase 05: Backend & Leaderboard

**Status:** ⬜ Pending
**Dependencies:** Phase 01, Phase 04

## Objective

Tạo backend Express + SQLite để lưu trữ user data, XP, progress. Xây dựng bảng xếp hạng (leaderboard) giữa các bạn.

## Implementation Steps

- [ ] Thiết kế Database Schema (users, progress, pets, leaderboard)
- [ ] Tạo Express server với API endpoints
- [ ] API: POST /api/users — Tạo profile (tên + avatar)
- [ ] API: GET/POST /api/progress — Lưu/lấy progress học tập
- [ ] API: GET /api/leaderboard — Top XP ranking
- [ ] API: GET/POST /api/pets — Lưu/lấy pet config
- [ ] Tạo Leaderboard UI component
- [ ] Tạo Profile Setup screen (nhập tên, chọn avatar)
- [ ] Connect frontend với backend APIs
- [ ] Seed data — tạo 5-10 mock students cho leaderboard

## Database Schema (SQLite)

```sql
-- Users
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Progress
CREATE TABLE progress (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  subject TEXT DEFAULT 'math',
  topic TEXT,
  correct INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Pet Config
CREATE TABLE pets (
  id INTEGER PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  type TEXT DEFAULT 'dragon',
  color TEXT DEFAULT '#ff7e47',
  accessories TEXT DEFAULT '[]',
  level INTEGER DEFAULT 1
);
```

## Files to Create/Modify
- `src/server/index.ts` — [NEW] Express server
- `src/server/db.ts` — [NEW] SQLite database setup
- `src/server/routes/users.ts` — [NEW] User API
- `src/server/routes/progress.ts` — [NEW] Progress API
- `src/server/routes/leaderboard.ts` — [NEW] Leaderboard API
- `src/components/leaderboard/Leaderboard.tsx` — [NEW] Leaderboard UI
- `src/components/profile/ProfileSetup.tsx` — [NEW] Profile creation
- `vite.config.ts` — Add proxy to Express server

## Test Criteria
- [ ] Tạo profile thành công
- [ ] XP tăng khi giải bài đúng
- [ ] Leaderboard hiển thị đúng thứ tự XP
- [ ] Pet config lưu và load từ DB
- [ ] Refresh page → data vẫn giữ nguyên

---
**Next Phase:** Phase 06 — Testing & Polish
