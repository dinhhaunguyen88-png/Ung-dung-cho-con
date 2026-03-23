# Changelog

## [2026-03-22]
### Added
- **Portable Runtime Integration**: Khởi chạy thành công ứng dụng bằng môi trường Node.js portable (v22.14.0) nằm trong `~/.node_portable`.
- **Environment Auto-Setup**: Tự động cấu hình `$env:PATH` để nhận diện `node` và `npm` trong môi trường Windows.

### Fixed
- Khắc phục lỗi `npm` không nhận diện được lệnh `node` khi chạy script `tsx`.
- Cập nhật cấu hình cổng Vite mặc định sang **3000** để đồng bộ với môi trường hiện tại.

### Documentation
- Cập nhật `.brain/brain.json` và `.brain/session.json` (Infinite Memory Keeper).
- Cập nhật `walkthrough.md` với minh chứng hình ảnh thực tế.


## [2026-03-17]
### Added
- **Vietnamese TTS Fallback**: Tích hợp Google Translate TTS API để đảm bảo giọng nói hoạt động mượt mà trên mọi thiết bị ngay cả khi không có sẵn gói ngôn ngữ hệ thống.
- **Math Symbol Normalization**: Tự động chuyển đổi các ký hiệu toán học (`+`, `-`, `x`, `:`, `=`, `?`) sang từ ngữ tiếng Việt tự nhiên cho trẻ em.
- **Robustness**: Refactor hook `useSpeech.ts` để tối ưu hóa hiệu suất và khả năng phục hồi khi lỗi voice.

### Documentation
- Cập nhật `.brain/brain.json` và `.brain/session.json`.
- Cập nhật `walkthrough.md` cho tính năng TTS mới.


## [2026-03-16]
### Added
- Mở rộng ngân hàng câu hỏi Toán lớp 2 lên **215 câu** (v4).
- Tăng số lượng câu hỏi mỗi Quest từ 5 lên **15 câu**.
- Thêm script `seed_all_v4.ts` để gộp tất cả dữ liệu mẫu.

### Fixed
- Lỗi ProfileSetup bị treo khi Backend server không chạy.
- Thêm giao diện báo lỗi trực quan khi API gặp sự cố.
- Khắc phục lỗi nút "Sẵn sàng học thôi!" bị mờ khi chưa nhập tên (UX guidance).

### Documentation
- Cập nhật `.brain/brain.json` và `.brain/session.json` (Infinite Memory Keeper).
- Tạo `docs/api/endpoints.md` cho bộ phận kỹ thuật.

## [2026-03-15] — Phase 07: Testing & Polish ✅

### Added
- **Science Practice**: Implemented Science Practice module (Luyện Tự nhiên & Xã hội) with 120 seeded questions for 6 core topics.
- **Unit Testing**: Created `src/services/teacher.test.ts` with 5 advanced auth tests (conflict, unauthorized, etc.).
- **Extended API Testing**: Updated `api.test.ts` with 11 new tests for class management and assignments.
- **Routing Support**: Added logic in `App.tsx` to handle direct URL navigation for `/teacher`, `/teacher/register`, and `/join`.

### Changed
- **Verified Build**: Production build successful with optimized chunking.
- **Linting**: Fixed all TypeScript linting errors across the project.
- **Bug Fix**: Resolved port 3001 conflict (EADDRINUSE) that caused "Cannot GET /" errors.
- **Bug Fix**: Resolved "Saving..." hang issue by implementing robust JSON parsing for pet accessories in `usePet.ts`.
- **UI Verification**: Manually verified Science Practice module functionality in browser.


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
