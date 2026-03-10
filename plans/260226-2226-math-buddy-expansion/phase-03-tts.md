# Phase 03: Text-to-Speech (Đọc đề bằng giọng nói)

**Status:** ⬜ Pending
**Dependencies:** Phase 02

## Objective

Thêm chức năng đọc đề bài bằng giọng nói tiếng Việt, giúp trẻ chưa đọc thạo vẫn tự học được.

## Implementation Steps

- [ ] Tạo custom hook `useSpeech` sử dụng Web Speech API
- [ ] Thêm nút Speaker 🔊 bên cạnh mỗi đề bài trong LearningQuest
- [ ] Auto-read đề bài khi câu hỏi mới xuất hiện (optional toggle)
- [ ] Đọc feedback khi trả lời đúng/sai
- [ ] Thêm Settings để bật/tắt TTS và chọn tốc độ đọc

## Files to Create/Modify
- `src/hooks/useSpeech.ts` — [NEW] Custom hook for Web Speech API
- `src/components/learning/LearningQuest.tsx` — Add speaker buttons
- `src/components/ui/SpeakerButton.tsx` — [NEW] Reusable speaker button
- `src/components/layout/Header.tsx` — Settings for TTS

## Test Criteria
- [ ] Nhấn 🔊 → nghe được đề bài tiếng Việt
- [ ] Tốc độ đọc thay đổi được
- [ ] Bật/tắt auto-read hoạt động
- [ ] Không bị đọc chồng khi nhấn nhanh liên tục

---
**Next Phase:** Phase 04 — Pet Customization
