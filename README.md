<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Math Buddy 🐲

Ứng dụng học toán và tiếng Anh cho trẻ em với pet ảo và bảng xếp hạng.

---

## Phase 3: Science Subject 🧪

Dự án đã hoàn thành Phase 3 với:
- **Science Subject**: Thêm môn Tự nhiên & Xã hội với 150+ câu hỏi.
- **Multimedia Support**: Hỗ trợ hiển thị hình ảnh trong câu hỏi.
- **Teacher Mode**: Giao bài tập môn Khoa học.

### Technical Notes
- **Database**: Sử dụng Supabase là primary DB. SQLite chỉ dùng cho local test.
- **Migrations**: Chạy các file SQL trong `migrations/` vào Supabase SQL Editor.
- **Plans**: Chi tiết từng bước tại `plans/260310-2141-phase2-teacher-english/` và Phase 3 task brain.

### Technical Notes
- **Database**: Sử dụng Supabase là primary DB. SQLite chỉ dùng cho local test.
- **Migrations**: Chạy các file SQL trong `migrations/` vào Supabase SQL Editor.
- **Plans**: Chi tiết từng bước tại `plans/260310-2141-phase2-teacher-english/`.

## Setup & Run Locally

**Prerequisites:** Node.js (v20+)

1.  **Cấu hình**: Tạo `.env` từ `.env.example` với Supabase URL & Anon Key.
2.  **Dependencies**: `npm install`
3.  **Run Dev**: `npm run dev` (Frontend - 3000)
4.  **Run Server**: `npm run server` (API - 3001)

---

View your app in AI Studio: https://ai.studio/apps/ca091769-5342-4023-ab9c-110c8c7a4307

## Environment Checklist

- Copy `.env.example` to `.env`
- Required keys:
  `VITE_SUPABASE_URL`
  `VITE_SUPABASE_ANON_KEY`
  `SUPABASE_SERVICE_ROLE_KEY`
  `AUTH_SECRET`
- Validate local config with `npm run env:check`
- Set the same keys in Vercel Environment Variables before deploy

## Deploy To Vercel

- Import the GitHub repository on Vercel
- Use branch `main`
- Set the environment variables from `.env.example`
- Full deployment checklist: [docs/deploy/vercel.md](/d:/ung dung - Copy/ung dung/Dinh-Hau-Nguyen/docs/deploy/vercel.md)
