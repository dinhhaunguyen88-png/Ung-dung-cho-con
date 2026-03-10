# Phase 01: Project Restructure & i18n Setup

**Status:** ⬜ Pending
**Dependencies:** None

## Objective

Tách file `App.tsx` monolithic (912 dòng) thành components riêng biệt, cài đặt i18n framework, và chuẩn bị cấu trúc folder cho mở rộng.

## Implementation Steps

### 1. Restructure folders
- [ ] Tạo folder structure:
  ```
  src/
  ├── components/
  │   ├── layout/        → Header, NavButton, SidebarNavButton
  │   ├── dashboard/     → DashboardSidebar, DashboardMain, DashboardRight
  │   ├── learning/      → LearningQuest
  │   ├── pet/           → PetRoom, PetControlIcon, InventoryTab
  │   ├── parent/        → ParentReport, ProgressRow, StrengthItem
  │   └── ui/            → StatusProgress, ActivityCard, QuestItem, CelebrationModal
  ├── hooks/             → Custom hooks
  ├── i18n/              → Translation files
  │   ├── vi.json
  │   └── en.json
  ├── types/             → TypeScript types
  └── utils/             → Helper functions
  ```

### 2. Extract components
- [ ] Tách 26 components từ `App.tsx` vào files riêng
- [ ] Giữ nguyên giao diện — chỉ refactor structure

### 3. Setup i18n
- [ ] Install `react-i18next` và `i18next`
- [ ] Tạo i18n config (default: Vietnamese)
- [ ] Tạo file `vi.json` và `en.json` với tất cả text strings

### 4. Setup types
- [ ] Tạo `types/index.ts` với shared types (Screen, etc.)

## Files to Create/Modify
- `src/App.tsx` — Giảm xuống ~50 dòng (chỉ routing)
- `src/components/**/*.tsx` — 15+ component files
- `src/i18n/vi.json` — Vietnamese translations
- `src/i18n/en.json` — English translations
- `src/i18n/index.ts` — i18n configuration
- `src/types/index.ts` — Shared TypeScript types

## Test Criteria
- [ ] App vẫn render đúng sau refactor
- [ ] `npm run dev` chạy không lỗi
- [ ] `npm run lint` pass (TypeScript check)
- [ ] Tất cả 4 screens vẫn hoạt động

---
**Next Phase:** Phase 02 — Vietnamese Language Support
