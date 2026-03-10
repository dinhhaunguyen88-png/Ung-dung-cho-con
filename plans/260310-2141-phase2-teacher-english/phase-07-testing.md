# Phase 07: Testing & Polish
**Status:** ⬜ Pending
**Dependencies:** Phase 03, 04, 05, 06

## Objective
Kiểm thử toàn diện, fix bugs, polish UI, và commit final.

## Implementation Steps
1. [ ] TypeScript lint: `npm run lint` — fix tất cả errors
2. [ ] Unit tests: Update `api.test.ts` — thêm tests cho teacher/class/assignment APIs
3. [ ] Unit tests: Tạo `teacher.test.ts` — test teacher auth flow
4. [ ] Build test: `npm run build` — đảm bảo production build OK
5. [ ] E2E manual test: Student flow (đăng nhập → học → xem bảng xếp hạng)
6. [ ] E2E manual test: Teacher flow (đăng ký → tạo lớp → giao bài → xem progress)
7. [ ] E2E manual test: English quest (chọn English → làm bài → hoàn thành)
8. [ ] Polish UI: Responsive check, animation smooth, i18n complete

## Test Matrix

| Flow | Steps | Expected |
|------|-------|----------|
| Student login | Mở app → Nhập tên → Chọn pet | Vào dashboard |
| Student quest | Dashboard → Chọn Math → Làm 5 câu | XP tăng, celebration |
| Student English | Dashboard → Chọn English → Làm 5 câu | Questions hiện đúng |
| Student join class | Nhập join code | Tham gia lớp thành công |
| Student assignments | Xem bài tập → Làm bài | Kết quả gửi cho teacher |
| Teacher register | Nhập email + password | Tạo tài khoản |
| Teacher login | Email + password | Vào teacher dashboard |
| Teacher create class | Nhập tên lớp | Nhận join code |
| Teacher assign | Chọn môn + chủ đề + deadline | Bài tập hiện cho học sinh |
| Teacher progress | Xem báo cáo lớp | Thấy điểm từng em |

## Files to Create/Modify
- `src/services/api.test.ts` — Update tests
- `src/services/teacher.test.ts` — [NEW]
- `CHANGELOG.md` — Thêm Phase 2 entries
- `.brain/brain.json` — Update features, endpoints, schema

## Quality Criteria
- [ ] 0 TypeScript errors
- [ ] All existing tests pass
- [ ] New tests pass
- [ ] Production build thành công
- [ ] UI responsive trên mobile (375px) và desktop (1440px)

---
🎉 Phase 2 Complete!
