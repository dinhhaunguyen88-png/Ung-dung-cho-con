# API Documentation - Math Buddy

**Updated:** 2026-03-17
**Base URL:** `http://localhost:3001`

---

## Users

### POST `/api/users`
Create a student profile and starter pet.
- **Body:** `{ "name": string, "avatar": string, "avatarColor": string }`
- **Response:** `User`

### GET `/api/users/:id`
Fetch one user profile.
- **Response:** `User`

### PUT `/api/users/:id`
Update one user profile.
- **Body:** `{ "name": string }`
- **Response:** `User`

---

## Learning

### GET `/api/system/status`
Fetch backend configuration status without exposing secrets.
- **Response:** `{ "summary": { "ready": boolean, "hasWarnings": boolean }, "supabase": { "configured": boolean, "accessMode": "service_role" | "anon" | "missing", "error": string | null, "warning": string | null, "missingVars": string[] }, "auth": { "secure": boolean, "mode": "env" | "fallback", "warning": string | null, "missingVars": string[] } }`

### GET `/api/questions`
Fetch question sets for a subject.
- **Query params:** `subject`, `limit`, `topic`
- **Response:** `Question[]`

### GET `/api/questions/counts`
Fetch question-bank counts per subject.
- **Response:** `{ "total": number, "bySubject": { "math": number, "vietnamese": number, "science": number, "english": number } }`

### POST `/api/progress`
Save one learning session and award XP/stars.
- **Body:** `{ "userId": string, "subject": string, "topic": string, "correct": number, "total": number }`
- **Response:** `{ "xpGain": number, "user": User | null }`

### GET `/api/progress/:userId`
Fetch up to 20 recent learning sessions.
- **Response item:** `{ "id": string | number, "user_id": string, "subject": string, "topic": string, "correct": number, "total": number, "completed_at": string | null }`

### GET `/api/leaderboard`
Fetch the global leaderboard.
- **Query params:** `metric=xp|correct`
- **Default metric:** `xp`
- **Response:** `User[] & { totalCorrect, totalQuestions, sessionsCount, accuracy, rankMetric }`

---

## Teacher Auth

### POST `/api/auth/teacher/register`
Register a teacher account.
- **Body:** `{ "name": string, "email": string, "password": string }`
- **Response:** `{ "user": TeacherUser, "token": string }`

### POST `/api/auth/teacher/login`
Login as a teacher.
- **Body:** `{ "email": string, "password": string }`
- **Response:** `{ "user": TeacherUser, "token": string }`

Teacher-protected routes require:
- `Authorization: Bearer <token>`

---

## Classes

### POST `/api/classes`
Create a class for the authenticated teacher.
- **Body:** `{ "name": string }`

### GET `/api/classes/:teacherId`
Fetch classes owned by the authenticated teacher.

### POST `/api/classes/join`
Join a class with a join code.
- **Body:** `{ "joinCode": string, "userId": string }`

### GET `/api/classes/:classId/members`
Fetch class members for a teacher-owned class.

### DELETE `/api/classes/:classId/members/:userId`
Remove one student from a teacher-owned class.

---

## Assignments

### POST `/api/assignments`
Create an assignment for a teacher-owned class.
- **Body:** `{ "classId": string, "title": string, "subject"?: string, "topic"?: string, "questionCount"?: number, "dueDate"?: string }`

### GET `/api/assignments/:classId`
Fetch assignments for a teacher-owned class.

### GET `/api/student/assignments/:userId`
Fetch assignments for all classes a student has joined.
- **Response item:** `AssignmentData & { class_name: string }`

---

## Teacher Progress

### GET `/api/teacher/progress/:classId`
Fetch per-student progress summaries for one class.
- **Response item:** `{ "id": string, "name": string, "avatar": string, "avatar_color": string, "xp": number, "level": number, "totalCorrect": number, "totalQuestions": number, "accuracy": number, "sessionsCount": number }`

### GET `/api/teacher/progress/:classId/:userId`
Fetch up to 20 normalized progress records for one student.
- **Response item:** `{ "id": string | number, "user_id": string, "subject": string, "topic": string, "correct": number, "total": number, "completed_at": string | null }`

---

## Shop

### GET `/api/shop/items`
Fetch available shop items.

### POST `/api/shop/buy`
Buy one item with stars.
- **Body:** `{ "userId": string, "itemId": string }`
