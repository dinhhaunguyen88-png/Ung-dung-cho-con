# Math Buddy Expansion — SPECS

## Executive Summary

Mở rộng Math Buddy từ prototype (912-dòng monolithic `App.tsx`) thành app học toán tiếng Việt hoàn chỉnh cho trẻ tiểu học.

**Target:** Con anh + học sinh trường (6-11 tuổi)

---

## User Stories

### Trẻ em (Primary User)
1. **Là một học sinh, tôi muốn** đọc giao diện bằng tiếng Việt **để** dễ hiểu và tự học
2. **Là một học sinh, tôi muốn** nghe đề bài bằng giọng nói **để** tự học khi chưa đọc thạo
3. **Là một học sinh, tôi muốn** tự chọn và trang trí pet **để** cảm thấy pet là "của mình"
4. **Là một học sinh, tôi muốn** xem bảng xếp hạng **để** thi đua học giỏi hơn

### Phụ huynh (Secondary User)
5. **Là phụ huynh, tôi muốn** xem báo cáo tiến trình **để** biết con yếu mạnh phần nào
6. **Là phụ huynh, tôi muốn** chuyển ngôn ngữ về tiếng Anh **để** con luyện thêm tiếng Anh

---

## Screens & Flow

```
[Profile Setup] → [Dashboard] ←→ [Learning Quest]
                      ↕                  ↕
                 [Pet Room]         [Leaderboard]
                      ↕
               [Parent Report]
```

### Screens:
1. **Profile Setup** [NEW] — Nhập tên, chọn avatar
2. **Dashboard** — Tổng quan (đã có, cần dịch VN)
3. **Learning Quest** — Giải bài toán (đã có, thêm TTS + VN)
4. **Pet Room** — Chăm sóc + customize pet (đã có, nâng cấp)
5. **Leaderboard** [NEW] — Bảng xếp hạng XP
6. **Parent Report** — Báo cáo phụ huynh (đã có, cần dịch VN)

---

## Tech Decisions

| Quyết định | Lựa chọn | Lý do |
|-----------|----------|-------|
| i18n | react-i18next | Phổ biến nhất, dễ dùng, JSON-based |
| TTS | Web Speech API | Miễn phí, built-in browser, hỗ trợ tiếng Việt |
| Database | SQLite (better-sqlite3) | Đã có trong package.json, đủ cho MVP |
| Backend | Express.js | Đã có trong package.json, đơn giản |
| Pet Storage | localStorage → SQLite | Bắt đầu đơn giản, migrate lên DB sau |

---

## Rủi ro & Giảm thiểu

| Rủi ro | Giảm thiểu |
|--------|------------|
| Web Speech API giọng Việt chưa tốt | Fallback sang Google TTS API nếu cần |
| Refactor 912 dòng có thể gây bug | Giữ nguyên logic, chỉ tách file |
| Pet customization phức tạp visual | Dùng CSS filters cho màu, SVG cho accessories |
