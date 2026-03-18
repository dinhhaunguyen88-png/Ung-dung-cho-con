# Phase 02: Seeding & Integration
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Nạp 200 câu hỏi mới vào database thông qua master seed script.

## Implementation Steps
1. [ ] Đọc dữ liệu từ `math_questions_new.json`.
2. [ ] Cập nhật `src/server/seed_all_v4.ts` để import và merge toán mới.
3. [ ] Chạy `npm run seed:v4` để cập nhật database.

## Files to Create/Modify
- `src/server/seed_all_v4.ts` - Master seed script.

## Test Criteria
- [ ] Console log xác nhận đã insert ~510 câu hỏi (310 cũ + 200 mới).
