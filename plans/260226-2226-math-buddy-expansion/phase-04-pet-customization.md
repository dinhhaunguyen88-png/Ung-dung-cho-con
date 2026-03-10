# Phase 04: Pet Customization

**Status:** ⬜ Pending
**Dependencies:** Phase 01

## Objective

Cho trẻ tự chọn và customize pet — chọn loại pet, đổi màu sắc, mặc phụ kiện. Pet thay đổi ngoại hình theo progress học tập.

## Implementation Steps

- [ ] Thiết kế Pet data model (type, color, accessories, level)
- [ ] Tạo Pet Selection screen (chọn pet ban đầu: Dragon, Cat, Dog, Bunny)
- [ ] Tạo Color Picker cho pet (8-10 màu preset)
- [ ] Hệ thống phụ kiện khoá/mở theo XP level
- [ ] Pet evolution — pet thay đổi visual khi đạt milestone
- [ ] Lưu pet config vào localStorage (sau này sẽ lên SQLite)
- [ ] Cập nhật PetRoom để hiển thị pet đã customize

## Files to Create/Modify
- `src/types/pet.ts` — [NEW] Pet types & interfaces
- `src/components/pet/PetSelector.tsx` — [NEW] Initial pet selection
- `src/components/pet/PetColorPicker.tsx` — [NEW] Color customization
- `src/components/pet/PetAccessories.tsx` — [NEW] Accessory system
- `src/components/pet/PetRoom.tsx` — Update to use customized pet
- `src/hooks/usePet.ts` — [NEW] Pet state management
- `src/utils/petAssets.ts` — [NEW] Pet asset configurations

## Test Criteria
- [ ] Chọn được pet từ 4 loại
- [ ] Đổi màu pet hiển thị đúng
- [ ] Phụ kiện locked/unlocked theo XP
- [ ] Refresh page → pet config vẫn giữ nguyên
- [ ] Pet evolution hiển thị đúng tại milestone

---
**Next Phase:** Phase 05 — Backend & Leaderboard
