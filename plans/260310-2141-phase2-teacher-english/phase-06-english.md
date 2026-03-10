# Phase 06: English Question Bank & Quest
**Status:** ⬜ Pending
**Dependencies:** Phase 01 (có thể làm song song với Phase 03-05)

## Objective
Thêm môn Tiếng Anh với ngân hàng câu hỏi vocabulary + grammar cơ bản cho lớp 2.

## Content Plan

### Vocabulary (50 câu)
- Animals (10 câu): dog, cat, bird, fish...
- Colors (10 câu): red, blue, yellow...
- Numbers (10 câu): one → twenty
- Family (10 câu): mother, father, sister...
- School (10 câu): book, pen, teacher...

### Grammar (50 câu)
- This/That (10 câu): "This is a ___"
- Verb to be (10 câu): "I am / He is / She is"
- Simple present (10 câu): "I ___ (like/likes) apples"
- Prepositions (10 câu): "The cat is ___ the table"
- Questions (10 câu): "What is ___?"

## Implementation Steps
1. [ ] Tạo file `seed_english_questions.ts` — 100 câu hỏi Tiếng Anh
2. [ ] Seed câu hỏi lên Supabase (subject = 'english')
3. [ ] Update `DashboardMain.tsx` — Thêm nút "English" bên cạnh "Math"
4. [ ] Update `DashboardRight.tsx` — Thêm English quest cards
5. [ ] Update `LearningQuest.tsx` — Hỗ trợ hiển thị câu hỏi dạng text dài
6. [ ] Update i18n keys cho English subject labels
7. [ ] Update `ParentReport.tsx` — Thêm phần báo cáo Tiếng Anh

## Question Format (giống math, reuse schema)
```json
{
    "subject": "english",
    "topic": "vocabulary-animals",
    "difficulty": "easy",
    "content": {
        "vi": {
            "questionText": "Con chó tiếng Anh là gì?",
            "questionReadText": "Con chó tiếng Anh là gì?"
        },
        "en": {
            "questionText": "What is this animal? 🐕",
            "questionReadText": "What is this animal?"
        }
    },
    "choices": [
        { "id": 1, "value": "Dog", "label": "A" },
        { "id": 2, "value": "Cat", "label": "B" },
        { "id": 3, "value": "Bird", "label": "C" },
        { "id": 4, "value": "Fish", "label": "D" }
    ],
    "correct_answer_id": 1
}
```

## Files to Create/Modify
- `seed_english_questions.ts` — [NEW] Script seed Tiếng Anh
- `src/components/dashboard/DashboardMain.tsx` — Thêm subject selector
- `src/components/dashboard/DashboardRight.tsx` — Thêm English quest cards
- `src/components/learning/LearningQuest.tsx` — Improve text display
- `src/components/parent/ParentReport.tsx` — Thêm English section
- `src/i18n/vi.json` — Thêm English subject labels
- `src/i18n/en.json` — Thêm English subject labels

## Test Criteria
- [ ] 100 câu hỏi Tiếng Anh seed thành công trên Supabase
- [ ] Chọn "English" trên dashboard → vào LearningQuest với câu hỏi English
- [ ] TTS đọc đúng ngôn ngữ (tiếng Việt cho UI, tiếng Anh cho nội dung câu hỏi)
- [ ] Kết quả hiện trong Parent Report

---
Next Phase: [Phase 07 - Testing & Polish](./phase-07-testing.md)
