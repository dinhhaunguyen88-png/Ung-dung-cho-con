# Phase 02: Vietnamese Language Support

**Status:** ⬜ Pending
**Dependencies:** Phase 01

## Objective

Dịch toàn bộ giao diện sang tiếng Việt, bao gồm menu, labels, đề bài toán, và nội dung hiển thị.

## Implementation Steps

- [ ] Dịch tất cả UI text sang tiếng Việt trong `vi.json`
- [ ] Replace hardcoded text trong components bằng `t()` function
- [ ] Thêm language switcher (VI/EN) vào header
- [ ] Dịch đề bài toán trong LearningQuest
- [ ] Dịch Parent Report sang tiếng Việt
- [ ] Thêm Vietnamese-specific math terms (theo chương trình CTST)

## Files to Modify
- `src/i18n/vi.json` — Full Vietnamese translations
- `src/i18n/en.json` — Full English translations
- `src/components/**/*.tsx` — Replace hardcoded strings
- `src/components/layout/Header.tsx` — Add language switcher

## Test Criteria
- [ ] Tất cả text hiển thị tiếng Việt
- [ ] Chuyển qua tiếng Anh rồi về Việt vẫn đúng
- [ ] Không còn text tiếng Anh bị sót
- [ ] Layout không bị vỡ khi text dài hơn

---
**Next Phase:** Phase 03 — Text-to-Speech
