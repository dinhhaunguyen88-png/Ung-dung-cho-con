# Changelog

## [2026-03-15] — Phase 07: Testing & Polish ✅

### Added
- **Unit Testing**: Created `src/services/teacher.test.ts` with 5 advanced auth tests (conflict, unauthorized, etc.).
- **Extended API Testing**: Updated `api.test.ts` with 11 new tests for class management and assignments.
- **Routing Support**: Added logic in `App.tsx` to handle direct URL navigation for `/teacher`, `/teacher/register`, and `/join`.

### Changed
- **Verified Build**: Production build successful with optimized chunking.
- **Linting**: Fixed all TypeScript linting errors across the project.
- **Bug Fix**: Resolved "Saving..." hang issue by implementing robust JSON parsing for pet accessories in `usePet.ts`.
- **UI Verification**: Manually verified Student/Teacher dashboards for responsiveness and localization.

---

## [2026-03-10] — Phase 2 Expansion (Teacher Mode & English) 🚀

### Added
- **Phase 03: Teacher Auth**: implemented teacher register/login APIs and role-based routing.
- **Phase 04: Class Mgmt**: implemented class APIs and UI (TeacherDashboard, ClassManager).
- **English Quest**: Implemented English-themed quests with randomized questions.
- **Assignment System**: Teachers can now assign quests to specific classes.
- **Performance Fix**: Resolved "Saving..." hang issue by implementing robust JSON parsing for pet accessories.
- **Stability**: Fixed navigation bugs in the Teacher Dashboard and improved API resilience.
- **API Docs**: Added `docs/api/endpoints.md` with complete reference.
- **Architecture Docs**: Added `docs/architecture/system_overview.md`.
- **i18n**: Added ~50 new translation keys for teacher features.

### Changed
- **DashboardMain**: Added "Join Class" card for student-side class participation.
- **App.tsx**: Integrated all new teacher features into a unified dashboard.
- **api.ts**: Added 10+ new methods for teacher auth, class management, and progress tracking.

---

## [2026-02-26] — MVP Release 🎉

### Added
- **i18n**: Hỗ trợ Tiếng Việt (mặc định) và English.
- **Text-to-Speech**: Đọc đề bài bằng giọng nói.
- **Pet Customization**: 4 loại pet SVG, customization UI.
- **Backend API**: Express + SQLite.
- **Leaderboard**: Bảng xếp hạng với podium top 3.
