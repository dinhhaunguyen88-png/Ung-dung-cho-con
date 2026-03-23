# Math Buddy System Architecture Overview

Math Buddy is a bilingual educational platform for Class 2 students, designed with a "Pet-First" engagement model. Phase 2 introduces "Teacher Mode" for class management and progression tracking.

## 🏗️ Core Architecture

- **Frontend:** Single Page Application (SPA) built with **React 19 + Vite 6**. Implements a state-driven router in `App.tsx` managing 8 distinct user screens.
- **Backend:** **Express 4** proxy server. Handles authentication, business logic for XP/Leveling, and acts as a secure gateway to Supabase.
- **Database:** **Supabase (PostgreSQL)** serves as the primary persistent data store. Schema includes relational tables for users, pets, classes, members, and assignments.
- **Local Fallback:** A **better-sqlite3** instance is maintained for local development and offline mode.

---

## 🔐 Key Systems

### 1. Teacher Management System
Implemented in Phase 2:
- **Authentication:** Custom `scrypt` hashing for teacher accounts.
- **Roster Management:** Automatic 6-character alphanumerical join codes for student enrollment.
- **Progress Tracking:** Aggregate analytics fetching data from the `progress` and `class_members` tables to calculate class-wide accuracy and session volume.

### 2. Pet Progression System
- Virtual pets (SVG-based) evolve through 4 stages based on user XP.
- state managed via `usePet` hook with `localStorage` persistence and periodic Supabase sync.

### 3. Bilingual Question Engine
- 215+ questions (Math G2 expanded) supporting Mathematics, Vietnamese, and English Class 2 curriculum.
- Fully JSON-based schema with AI-driven distractors.
- Dual-language support (VI/EN) handled via `react-i18next`.
- **Robust Text-to-Speech (TTS):** 
    - Implemented a standard-compliant hook with a **Google Translate TTS fallback** to overcome missing system voices.
    - **Math Normalization:** Client-side processing that converts math symbols (+, -, x, =) into natural language words for educational accessibility.
- **High-Fidelity Pet Rendering:**
    - SVG pets are rendered via a dynamic **PetPalette** engine that generates multi-stop gradients and orbital glow effects based on the pet's primary color.
    - Added orbital rings, dashed rotation indicators, and drop-shadow filters for a "premium" sci-fi aesthetic.

---

## 📁 Critical Documentation
- [API Reference](file:///d:/ung%20dung/Dinh-Hau-Nguyen/docs/api/endpoints.md)
- [Database Migration](file:///d:/ung%20dung/Dinh-Hau-Nguyen/migrations/001_phase2_teacher_classes.sql)
- [Project Plan](file:///d:/ung%20dung/Dinh-Hau-Nguyen/plans/260310-2141-phase2-teacher-english/plan.md)
