# Phase 05: Assignment & Progress Tracking
**Status:** ⬜ Pending
**Dependencies:** Phase 04

## Objective
Giáo viên giao bài tập cho lớp, theo dõi tiến độ hoàn thành của từng học sinh.

## Implementation Steps
1. [ ] API: POST `/api/assignments` — Tạo bài tập (subject, topic, question_count, due_date)
2. [ ] API: GET `/api/assignments/:classId` — Danh sách bài tập của lớp
3. [ ] API: GET `/api/teacher/progress/:classId` — Progress tổng hợp của cả lớp
4. [ ] API: GET `/api/teacher/progress/:classId/:userId` — Progress chi tiết 1 học sinh
5. [ ] Frontend: `AssignmentCreator.tsx` — Form tạo bài tập (chọn môn, chủ đề, số câu)
6. [ ] Frontend: `StudentProgress.tsx` — Biểu đồ progress từng học sinh
7. [ ] Frontend: `AssignmentList.tsx` (student side) — Xem bài tập được giao
8. [ ] Update `DashboardRight.tsx` — Hiện bài tập mới được giao

## Student Side Flow
```
Dashboard → Thấy "Bài tập mới!" badge → Nhấn vào → LearningQuest (preset subject/topic)
                                                         ↓
                                                    Hoàn thành → Progress saved → Teacher thấy kết quả
```

## Teacher Progress View
```
┌─────────────────────────────────────────┐
│  📊 Báo cáo lớp 2A                     │
│                                          │
│  Bài tập: Phép cộng có nhớ              │
│  Deadline: 12/03/2026                    │
│                                          │
│  ✅ Hoàn thành: 6/8 học sinh             │
│  📈 Điểm TB: 4.2/5                      │
│                                          │
│  👦 Minh Anh   ✅ 5/5  ⭐               │
│  👧 Hà My      ✅ 4/5                   │
│  👦 Đức        ✅ 3/5                   │
│  👦 Nam        ⏳ Chưa làm              │
│  ...                                     │
└─────────────────────────────────────────┘
```

## Files to Create/Modify
- `src/server/index.ts` — Thêm assignment + teacher progress routes
- `src/components/teacher/AssignmentCreator.tsx` — [NEW]
- `src/components/teacher/StudentProgress.tsx` — [NEW]
- `src/components/teacher/AssignmentList.tsx` — [NEW]
- `src/components/dashboard/DashboardRight.tsx` — Update hiện bài tập
- `src/services/api.ts` — Thêm assignment API calls

## Test Criteria
- [ ] Giáo viên tạo bài tập → hiện trong danh sách
- [ ] Học sinh thấy bài tập mới trên dashboard
- [ ] Sau khi học sinh hoàn thành → giáo viên thấy kết quả
- [ ] Progress view hiện đúng số liệu

---
Next Phase: [Phase 06 - English Question Bank & Quest](./phase-06-english.md)
