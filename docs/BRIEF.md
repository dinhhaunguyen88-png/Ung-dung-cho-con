# 💡 BRIEF: Math Buddy — Mở Rộng

**Ngày tạo:** 2026-02-26
**Loại sản phẩm:** Web App (React + Vite)
**Repo:** `Dinh-Hau-Nguyen`

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT

Thị trường apps học toán cho trẻ em tại Việt Nam gần như trống — các app lớn (Prodigy, SplashLearn, DragonBox) đều chỉ hỗ trợ tiếng Anh và theo chương trình nước ngoài. Phụ huynh và giáo viên Việt Nam cần một app:
- **Tiếng Việt**, phù hợp chương trình giáo dục VN
- **Hấp dẫn** để trẻ tự nguyện học, không bị ép
- **Theo dõi được** để phụ huynh/giáo viên biết con học đến đâu

## 2. GIẢI PHÁP ĐỀ XUẤT

Mở rộng **Math Buddy** — app đã có sẵn nền tảng gamification (Virtual Pet + Quests + XP) — thêm hỗ trợ tiếng Việt, nhiều môn học, và tính năng lớp học.

## 3. ĐỐI TƯỢNG SỬ DỤNG

- **Primary:** Trẻ em tiểu học (6-11 tuổi) — con của anh và học sinh trường
- **Secondary:** Phụ huynh (theo dõi progress), Giáo viên (assign bài, quản lý lớp)

## 4. NGHIÊN CỨU THỊ TRƯỜNG

### Đối thủ:

| App | Điểm mạnh | Điểm yếu |
|-----|-----------|----------|
| Prodigy | RPG hấp dẫn, 1500+ skill, adaptive | Ép mua premium, game chiếm nhiều hơn học |
| SplashLearn | 5000+ game, chuẩn giáo trình | Phí cao, ít pet/nhân vật |
| DragonBox | Dạy toán qua gameplay trực quan | Ít social, giá đắt |
| Khan Academy Kids | MIỄN PHÍ, không quảng cáo | UI đơn giản, ít gamification |
| DoodleMaths | Cá nhân hóa giỏi | Không có pet, nhàm |

### Điểm khác biệt của Math Buddy:

- 🇻🇳 **Hỗ trợ tiếng Việt** — gần như không có đối thủ VN
- 🐾 **Pet system sâu** — Pet lớn lên + customize, không chỉ là gimmick
- 🤖 **AI-powered** — Gemini AI tạo bài tập cá nhân hóa
- 🏫 **Classroom mode** — Giáo viên quản lý cả lớp
- 🔊 **Giọng nói tiếng Việt** — Trẻ chưa đọc tốt vẫn tự học được

## 5. TÍNH NĂNG

### 🚀 MVP (Phase 1 — Làm trước):

- [ ] **Hỗ trợ tiếng Việt** — Dịch toàn bộ giao diện + đề bài sang tiếng Việt
- [ ] **Đọc đề bài bằng giọng nói** — Web Speech API, hỗ trợ tiếng Việt
- [ ] **Customize pet** — Chọn loại pet, màu sắc, phụ kiện, trang phục
- [ ] **Bảng xếp hạng** — Leaderboard XP giữa các bạn trong lớp

### 🎁 Phase 2 (Sau khi MVP ổn):

- [ ] **Chế độ giáo viên** — Dashboard riêng, assign bài, xem progress lớp
- [ ] **Thêm môn Tiếng Anh** — Vocabulary, grammar cơ bản dạng quest

### 💭 Phase 3 (Dài hạn):

- [ ] **Thêm môn Khoa học** — Quiz khoa học tự nhiên theo chương trình VN

## 6. ƯỚC TÍNH SƠ BỘ

| Tính năng | Mức độ | Thời gian ước tính |
|-----------|--------|-------------------|
| Tiếng Việt | 🟢 Dễ | 1-2 ngày |
| Giọng nói | 🟢 Dễ | 1 ngày |
| Customize pet | 🟡 TB | 2-3 ngày |
| Bảng xếp hạng | 🟡 TB | 2-3 ngày |
| Chế độ giáo viên | 🔴 Khó | 1-2 tuần |
| Tiếng Anh | 🟡 TB | 1 tuần |
| Khoa học | 🔴 Khó | 2+ tuần |

### Rủi ro:

- Nội dung toán cần đúng chương trình giáo dục VN
- Cân bằng giữa chơi game và học thật
- Web Speech API chất lượng giọng Việt có thể chưa hoàn hảo

## 7. TECH STACK HIỆN TẠI

- **Frontend:** React 19 + Vite + TailwindCSS v4
- **Animation:** Motion (framer-motion)
- **AI:** Gemini API (`@google/genai`)
- **Database:** better-sqlite3
- **Backend:** Express.js
- **Icons:** Lucide React

## 8. BƯỚC TIẾP THEO

→ Chạy `/plan` để lên thiết kế chi tiết cho MVP (Phase 1)
