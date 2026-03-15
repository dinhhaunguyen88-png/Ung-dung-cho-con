# Math Buddy API Documentation

**Base URL:** `/api`

---

## 🔐 Teacher Authentication

### POST `/api/auth/teacher/register`
Register a new teacher profile.
- **Request:** `{ name, email, password }`
- **Response:** `{ user, session }`

### POST `/api/auth/teacher/login`
Teacher login.
- **Request:** `{ email, password }`
- **Response:** `{ user, session }`

---

## 🏫 Class Management

### POST `/api/classes`
Create a new class.
- **Request:** `{ name, teacherId }`
- **Response:** `ClassData` (includes 6-char `join_code`)

### GET `/api/classes/:teacherId`
List all classes managed by a teacher.
- **Response:** `ClassData[]`

### POST `/api/classes/join`
Student joins a class via code.
- **Request:** `{ userId, joinCode }`
- **Response:** `{ success, className, classId }`

### GET `/api/classes/:classId/members`
List all students in a class.
- **Response:** `UserData[]` (includes XP and Level)

### DELETE `/api/classes/:classId/members/:userId`
Remove a student from a class.
- **Response:** `{ success: true }`

---

## 📊 Assignments & Progress

### POST `/api/assignments`
Create a new assignment for a class.
- **Request:** `{ classId, title, subject, topic, questionCount, dueDate }`
- **Response:** `AssignmentData`

### GET `/api/assignments/:classId`
List all assignments for a class.
- **Response:** `AssignmentData[]`

### GET `/api/teacher/progress/:classId`
Aggregate progress report for all students in a class.
- **Response:** `StudentProgressSummary[]` (includes totalCorrect, totalQuestions, accuracy, sessionsCount)

### GET `/api/teacher/progress/:classId/:userId`
Detailed progress history for a specific student (20 most recent sessions).
- **Response:** `ProgressRecord[]`
