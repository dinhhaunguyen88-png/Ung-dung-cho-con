# Plan: Math Buddy Expansion — MVP (Phase 1)

**Created:** 2026-02-26
**Status:** ✅ Complete

---

## Overview

Mở rộng app Math Buddy từ prototype frontend-only (912 dòng monolithic App.tsx) thành một app học toán hoàn chỉnh với hỗ trợ tiếng Việt, giọng nói đọc đề, pet customization, và bảng xếp hạng.

## Tech Stack

- **Frontend:** React 19 + Vite + TailwindCSS v4
- **Animation:** Motion (framer-motion)
- **AI:** Gemini API
- **Database:** better-sqlite3 (đã có trong package.json)
- **Backend:** Express.js (đã có trong package.json)
- **Icons:** Lucide React
- **TTS:** Web Speech API (built-in browser)
- **i18n:** react-i18next

## Phases

| Phase | Name | Status | Tasks | Est. |
|-------|------|--------|-------|------|
| 01 | Project Restructure & i18n Setup | ⬜ Pending | 8 | 1 session |
| 02 | Vietnamese Language Support | ⬜ Pending | 6 | 1 session |
| 03 | Text-to-Speech (Đọc đề bằng giọng nói) | ⬜ Pending | 5 | 1 session |
| 04 | Pet Customization | ⬜ Pending | 7 | 1-2 sessions |
| 05 | Backend & Leaderboard | ⬜ Pending | 10 | 2 sessions |
| 06 | Testing & Polish | ⬜ Pending | 6 | 1 session |

**Tổng:** ~42 tasks | Ước tính: 7-8 sessions

## Quick Commands

- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`
