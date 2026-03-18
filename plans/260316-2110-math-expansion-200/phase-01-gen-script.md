# Phase 01: Setup & AI Generation Script
Status: ⬜ Pending
Dependencies: None

## Objective
Viết script dùng Gemini API để sinh 200 câu hỏi toán lớp 2 theo đúng format yêu cầu.

## Implementation Steps
1. [ ] Tạo file `src/server/gen_math_questions.ts`.
2. [ ] Thiết kế Prompt cho Gemini (bao gồm các chủ đề, định dạng JSON, song ngữ).
3. [ ] Chạy script và lưu kết quả ra file `math_questions_new.json`.

## Files to Create/Modify
- `src/server/gen_math_questions.ts` - Script sinh dữ liệu.

## Test Criteria
- [ ] File JSON sinh ra có đúng 200 questions không.
- [ ] Mọi question có đầy đủ `content.vi`, `content.en`, `choices`, `correct_answer_id`.
