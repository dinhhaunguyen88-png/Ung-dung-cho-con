# Phase 04: Teacher Dashboard & Class Management
**Status:** ⬜ Pending
**Dependencies:** Phase 03

## Objective
Xây dựng giao diện quản lý lớp học cho giáo viên: tạo lớp, mời học sinh, xem danh sách.

## Implementation Steps
1. [ ] API: POST `/api/classes` — Tạo lớp mới (auto-generate join_code 6 chữ)
2. [ ] API: GET `/api/classes/:teacherId` — Danh sách lớp của giáo viên
3. [ ] API: POST `/api/classes/:classId/join` — Học sinh tham gia lớp bằng join_code
4. [ ] API: GET `/api/classes/:classId/members` — Danh sách học sinh trong lớp
5. [ ] API: DELETE `/api/classes/:classId/members/:userId` — Xóa học sinh khỏi lớp
6. [ ] Frontend: `TeacherDashboard.tsx` — Layout chính cho giáo viên
7. [ ] Frontend: `ClassManager.tsx` — Tạo lớp, hiện join code, quản lý thành viên
8. [ ] Frontend: `JoinClass.tsx` (student side) — Nhập code để tham gia lớp
9. [ ] i18n: Thêm translation keys cho teacher UI (vi + en)

## UI Mockup

```
┌──────────────────────────────────────────────┐
│  👩‍🏫 Teacher Dashboard                        │
├──────────┬───────────────────────────────────│
│          │                                    │
│  📚 Lớp  │  Lớp 2A — Mã: ABC123             │
│  ┌─────┐ │  ┌─────────────────────────────┐  │
│  │ 2A  │ │  │ 👦 Minh Anh   ⭐ 2450 XP    │  │
│  │ 2B  │ │  │ 👧 Hà My      ⭐ 1800 XP    │  │
│  │ 2C  │ │  │ 👦 Đức        ⭐ 1500 XP    │  │
│  └─────┘ │  └─────────────────────────────┘  │
│          │                                    │
│  + Lớp   │  [📋 Giao bài]  [📊 Xem báo cáo] │
│          │                                    │
└──────────┴───────────────────────────────────┘
```

## Files to Create/Modify
- `src/server/index.ts` — Thêm class routes
- `src/components/teacher/TeacherDashboard.tsx` — [NEW]
- `src/components/teacher/ClassManager.tsx` — [NEW]
- `src/components/auth/JoinClass.tsx` — [NEW]
- `src/services/api.ts` — Thêm class API calls
- `src/i18n/vi.json` — Thêm teacher keys
- `src/i18n/en.json` — Thêm teacher keys

## Test Criteria
- [ ] Giáo viên tạo lớp → nhận join code
- [ ] Học sinh nhập join code → tham gia lớp
- [ ] Giáo viên thấy danh sách học sinh kèm XP
- [ ] Giáo viên có thể xóa học sinh khỏi lớp

---
Next Phase: [Phase 05 - Assignment & Progress Tracking](./phase-05-assignments.md)
