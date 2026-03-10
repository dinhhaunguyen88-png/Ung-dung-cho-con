<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Math Buddy 🐲

Ứng dụng học toán và tiếng Anh cho trẻ em với pet ảo và bảng xếp hạng.

---

## Phase 2: Teacher Mode & English Subject 🚀

Dự án đang trong Phase 2 với các tính năng mới:
- **Teacher Mode**: Quản lý lớp học, học sinh và bài tập.
- **English Subject**: Thêm môn Tiếng Anh vào ngân hàng câu hỏi.

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
