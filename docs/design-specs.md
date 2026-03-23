# Design Specifications: Math Buddy (Modern Tech Vibe)

## 🎨 Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary | #06b6d4 | Cyan Neon (Buttons, Active states, Level progress) |
| Primary Dark | #0891b2 | Hover states for primary elements |
| Secondary | #a855f7 | Purple Neon (Secondary buttons, Quests, Accents) |
| Background | #0f172a | Deep Space Navy (Main app background) |
| Surface | rgba(30, 41, 59, 0.7)| Frosted glass for Cards, Modals (Glassmorphism) |
| Success | #10b981 | Correct answers, XP gain notifications |
| Warning/Energy | #f59e0b | Amber for Energy bars, Warnings |
| Text | #f8fafc | Primary text (White-ish) |
| Text Muted | #94a3b8 | Secondary text (Grayish blue) |

## 📝 Typography
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| H1 | Inter | 48px | 800 | 1.2 |
| H2 | Inter | 36px | 700 | 1.3 |
| H3 | Inter | 24px | 600 | 1.4 |
| Body | Inter | 16px | 400 | 1.6 |
| Small | Inter | 14px | 400 | 1.5 |

*Note: As this is a children's app, feel free to switch the main header font to something rounded and playful like `Nunito` or `Quicksand` if added to the project, keeping `Inter` for data/numbers.*

## 📐 Spacing System (Tailwind)
| Name | Value | Usage |
|------|-------|-------|
| xs (1) | 4px | Icon gaps |
| sm (2) | 8px | Tight spacing inside buttons/cards |
| md (4) | 16px | Default padding |
| lg (6) | 24px | Section gaps |
| xl (8) | 32px | Large sections, Modal padding |
| 2xl (12) | 48px | Page sections |

## 🔲 Border Radius
| Name | Value | Usage |
|------|-------|-------|
| sm | 6px | Small inputs, badges |
| md | 12px | Standard Cards, smaller buttons |
| lg | 20px | Main layout cards, Modals (friendly vibe) |
| full | 9999px | Primary Action Buttons, Avatars, Pills |

## 🌫️ Shadows & Glassmorphism
| Name | Value | Usage |
|------|-------|-------|
| glass | backdrop-blur-md bg-opacity-70 | Glassmorphism base for floating cards (`bg-slate-800/60 backdrop-blur-md`) |
| neon-cyan | 0 0 10px rgba(6, 182, 212, 0.5) | Glowing effect for primary buttons |
| neon-purple | 0 0 10px rgba(168, 85, 247, 0.5) | Glowing effect for secondary elements |
| base-shadow | 0 10px 25px rgba(0,0,0,0.5) | Depth for glass panels over background |

## 📱 Breakpoints
| Name | Width | Description |
|------|-------|-------------|
| mobile | 375px | Default view (Cards stacked vertically) |
| tablet | 768px | Grid layout for dashboard |
| desktop | 1280px | Expansive dashboard, large 3D pet view |

## ✨ Animations
| Name | Duration | Easing | Usage |
|------|----------|--------|-------|
| fast | 150ms | ease-out | Button hovers, small interactions |
| bounce | 300ms | cubic-bezier | Playful pop-ins for Modals/Cards (Tailwind: `animate-bounce`) |
| pulse/glow | 2000ms | linear | Energy bars, interactive hints (Tailwind: `animate-pulse`) |

## 🖼️ Component Specs

### 1. Primary Button (e.g. Nạp Năng Lượng)
- **Background:** `bg-cyan-500`
- **Text Color:** `text-white`
- **Border Radius:** `rounded-full`
- **Padding:** `px-8 py-4`
- **Effects:** `hover:bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:shadow-[0_0_20px_rgba(6,182,212,0.8)] transition-all`
- **Typography:** `font-bold text-lg`

### 2. Glass Card (Stats Panel)
- **Background:** `bg-slate-800/60`
- **Backdrop:** `backdrop-blur-xl`
- **Border:** `border border-slate-700/50`
- **Border Radius:** `rounded-2xl`
- **Padding:** `p-6`
- **Shadow:** `shadow-2xl shadow-black/50`

### 3. Progress Bar (Energy/Level)
- **Container:** `bg-slate-700 rounded-full h-4 overflow-hidden relative`
- **Fill (Energy):** `bg-gradient-to-r from-amber-400 to-orange-500`
- **Fill (XP):** `bg-gradient-to-r from-cyan-400 to-blue-500`
- **Effect:** Add a subtle glow behind or use an inner shadow.
