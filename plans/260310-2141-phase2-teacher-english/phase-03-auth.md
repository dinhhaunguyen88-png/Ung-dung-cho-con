# Phase 03: Teacher Auth & Roles
**Status:** ⬜ Pending
**Dependencies:** Phase 02

## Objective
Thêm authentication cho giáo viên: đăng ký, đăng nhập, role-based routing.

## Implementation Steps
1. [ ] API: POST `/api/auth/teacher/register` — Tạo tài khoản giáo viên (name, email, password)
2. [ ] API: POST `/api/auth/teacher/login` — Đăng nhập giáo viên (email, password)
3. [ ] Backend: Simple password hashing (bcrypt-like via crypto)
4. [ ] Frontend: `TeacherLogin.tsx` — Form đăng nhập cho giáo viên
5. [ ] Frontend: `TeacherRegister.tsx` — Form đăng ký giáo viên đơn giản
6. [ ] Update `useUser` hook — thêm role awareness
7. [ ] Update `App.tsx` — routing dựa trên role (student → dashboard, teacher → teacher-dashboard)

## Files to Create/Modify
- `src/server/index.ts` — Thêm auth routes
- `src/components/auth/TeacherLogin.tsx` — [NEW]
- `src/components/auth/TeacherRegister.tsx` — [NEW]
- `src/hooks/useUser.ts` — Thêm role field
- `src/types/index.ts` — Update Screen type
- `src/App.tsx` — Role-based routing
- `src/services/api.ts` — Thêm auth API calls

## Security Notes
- Password hashing dùng Node.js built-in `crypto.scrypt`
- Không cần JWT cho MVP — session-based via localStorage
- Teacher email phải unique

## Test Criteria
- [ ] Giáo viên có thể đăng ký bằng email + password
- [ ] Giáo viên đăng nhập → vào Teacher Dashboard
- [ ] Học sinh đăng nhập → vào Student Dashboard (như cũ)
- [ ] API tests cho auth endpoints

---
Next Phase: [Phase 04 - Teacher Dashboard & Class Mgmt](./phase-04-teacher-dashboard.md)
