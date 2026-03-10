# Plan: Math Buddy Phase 2 — Giáo Viên + Tiếng Anh

**Created:** 2026-03-10
**Status:** 🟡 Planning

---

## Overview

Mở rộng Math Buddy thêm 2 tính năng lớn:
1. **Chế độ Giáo viên** — Dashboard riêng, quản lý lớp, assign bài, xem progress học sinh
2. **Thêm môn Tiếng Anh** — Vocabulary & grammar quests cho lớp 2

## Kiến trúc hiện tại

- **Frontend:** React 19 + Vite 6 + TailwindCSS v4 + motion
- **Backend:** Express 4 + Supabase (primary data store)
- **DB Tables:** users, progress, pets, questions (trên Supabase)
- **API:** 8 endpoints qua Express proxy
- **i18n:** react-i18next (vi/en)

## Thay đổi kiến trúc cho Phase 2

### Database (Supabase - thêm mới):
- `classes` — Lớp học (name, teacher_id, join_code)
- `class_members` — Học sinh trong lớp (class_id, user_id)
- `assignments` — Bài tập giao (class_id, subject, topic, due_date)
- `users.role` — Thêm cột role ('student' | 'teacher')

### API (Express - thêm mới):
- Teacher auth: POST /api/auth/teacher-login
- Classes: CRUD /api/classes
- Assignments: CRUD /api/assignments
- Teacher progress: GET /api/teacher/progress/:classId

### Frontend (thêm mới):
- TeacherDashboard, ClassManager, AssignmentCreator, StudentProgress
- EnglishQuest reuse LearningQuest component
- Subject selector trên Dashboard

---

## Phases

| Phase | Name | Status | Tasks | Est. |
|-------|------|--------|-------|------|
| 01 | Git Cleanup & Housekeeping | ✅ Complete | 4 | 30 min |
| 02 | Database Schema Extension | ✅ Complete | 6 | 1 session |
| 03 | Teacher Auth & Roles | ⬜ Pending | 7 | 1 session |
| 04 | Teacher Dashboard & Class Mgmt | ⬜ Pending | 9 | 2 sessions |
| 05 | Assignment & Progress Tracking | ⬜ Pending | 8 | 1-2 sessions |
| 06 | English Question Bank & Quest | ⬜ Pending | 7 | 1 session |
| 07 | Testing & Polish | ⬜ Pending | 8 | 1 session |

**Tổng:** ~49 tasks | Ước tính: 7-9 sessions

## Quick Commands

- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
