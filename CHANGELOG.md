# Changelog

## [2026-02-26] — MVP Release 🎉

### Added
- **i18n**: Hỗ trợ Tiếng Việt (mặc định) và English, language switcher
- **Text-to-Speech**: Đọc đề bài bằng giọng nói (Web Speech API, hỗ trợ tiếng Việt)
- **Pet Customization**: 4 loại pet SVG (Rồng, Mèo, Chó, Thỏ), 8 màu, 8 phụ kiện, evolution stages
- **Backend API**: Express + SQLite (users, progress, pets endpoints)
- **Leaderboard**: Bảng xếp hạng với podium top 3, 8 học sinh mẫu
- **Speaker Button**: Component đọc text bằng giọng nói, auto-hide nếu không hỗ trợ

### Changed
- **App.tsx**: Refactor từ 912 dòng → ~120 dòng (slim router pattern)
- **DashboardMain**: SVG PetAvatar thay thế placeholder image
- **PetRoom**: Full rewrite với customization UI (3 tabs: Tùy chỉnh, Phụ kiện, Kho đồ)

### Infrastructure
- Vite proxy `/api` → Express backend (port 3001)
- `npm run server` script cho backend
- SQLite database tại `data/mathbuddy.db`
