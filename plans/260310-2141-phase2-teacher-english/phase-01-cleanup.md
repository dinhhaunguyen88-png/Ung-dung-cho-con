# Phase 01: Git Cleanup & Housekeeping
**Status:** ⬜ Pending
**Dependencies:** None

## Objective
Dọn dẹp code, commit ~65 files đang chờ, update plan status cũ, chuẩn bị nền tảng cho Phase 2.

## Implementation Steps
1. [ ] Commit & push toàn bộ ~65 files MVP chưa commit
2. [ ] Update `plans/260226-2226-math-buddy-expansion/plan.md` — đổi status thành ✅ Complete
3. [ ] Xóa các file tạm không cần (*.py scripts, *_raw.json, test_*.mjs)
4. [ ] Update `.brain/brain.json` với session mới

## Test Criteria
- [ ] `git status` clean
- [ ] App vẫn chạy sau khi cleanup: `npm run dev` + `npm run server`

---
Next Phase: [Phase 02 - Database Schema Extension](./phase-02-database.md)
