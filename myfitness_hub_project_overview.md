# 🏋️ MyFitness Hub — Complete Project Overview (A to Z)

---

## 📌 Project Identity

| Field | Value |
|-------|-------|
| **Project Name** | `myfitness-hub` |
| **Type** | Single-Page Application (SPA) |
| **Version** | 0.0.0 (private) |
| **Module Type** | ESModule (`"type": "module"`) |
| **Dev Server Port** | `3000` |
| **Deployment Platform** | **Vercel** |
| **Backend / Database** | **Supabase** |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^19.2.1 | UI framework |
| **TypeScript** | ~5.8.2 | Type safety |
| **Vite** | ^6.2.0 | Build tool & dev server |
| **Framer Motion** | ^12.23.25 | Animations & transitions |
| **Lucide React** | ^0.555.0 | Icon library |

### Backend / Services
| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase JS** | 2.x | Database, Auth, Edge Functions |
| **Supabase Edge Functions** | Deno 2 | Serverless AI backend |
| **Google Gemini AI** | `gemini-3-flash-preview` | AI workout generation |

### Testing
| Tool | Version | Purpose |
|------|---------|---------|
| **Playwright** | ^1.62.1 | End-to-end testing |

---

## 📁 Project Structure (Complete)

```
myfitness-hub/
├── 📄 index.html              # Entry HTML, loads index.tsx
├── 📄 index.tsx               # React root mount point
├── 📄 App.tsx                 # Root component + page routing
├── 📄 types.ts                # Shared TypeScript interfaces
├── 📄 package.json            # Dependencies & scripts
├── 📄 vite.config.ts          # Vite + env config
├── 📄 tsconfig.json           # TypeScript config
├── 📄 vercel.json             # Vercel SPA rewrite rules
├── 📄 playwright.config.ts    # E2E test configuration
├── 📄 .env.example            # Environment variable template
├── 📄 .env.local              # Local env (not committed)
├── 📄 export.ps1              # PowerShell export/utility script
│
├── 📁 components/             # All UI components (21 files)
│   ├── Layout.tsx             # Global layout + Navbar + Footer
│   ├── Hero.tsx               # Landing hero section
│   ├── About.tsx              # About the gym section
│   ├── Services.tsx           # Services offered
│   ├── Programs.tsx           # Training programs
│   ├── AICoach.tsx            # AI Workout Generator (main feature)
│   ├── Testimonials.tsx       # Client testimonials
│   ├── Pricing.tsx            # Pricing plans + plan selection
│   ├── Contact.tsx            # Contact form
│   ├── Footer.tsx             # Site footer
│   ├── GymBot.tsx             # Persistent floating chatbot
│   ├── Login.tsx              # User login
│   ├── Signup.tsx             # User registration
│   ├── ForgotPassword.tsx     # Password reset request
│   ├── UpdatePassword.tsx     # Password update flow
│   ├── Dashboard.tsx          # User dashboard
│   ├── WorkoutCalendar.tsx    # Workout calendar widget
│   ├── Checkout.tsx           # Membership checkout + payment
│   ├── AdminLogin.tsx         # Admin authentication
│   ├── AdminDashboard.tsx     # Admin management panel
│   └── Transformation.tsx     # (Stub/placeholder)
│
├── 📁 lib/
│   └── supabaseClient.ts      # Supabase client initialization
│
├── 📁 supabase/
│   ├── config.toml            # Supabase local dev config
│   └── functions/
│       └── gemini/
│           └── index.ts       # Edge Function: Gemini AI proxy
│
├── 📁 tests/                  # Playwright E2E tests
│   ├── e2e.spec.ts
│   ├── full-e2e.spec.ts
│   └── comprehensive.spec.ts
│
├── 📁 .agents/                # Antigravity IDE skills/config
├── 📁 dist/                   # Production build output
└── 📁 node_modules/           # Installed dependencies
```

---

## 🗺️ Pages & Routing

The app uses **custom client-side routing** via `useState` (no React Router). The `currentPage` string in [`App.tsx`](file:///c:/Users/JAYASIMBU/Downloads/myfitness-hub/App.tsx) controls which component renders.

| Page Key | Component | Description |
|----------|-----------|-------------|
| `home` | Multiple sections | Full landing page (Hero → About → Services → Programs → AICoach → Testimonials → Pricing → Contact) |
| `login` | `Login.tsx` | Email/password sign-in via Supabase Auth |
| `signup` | `Signup.tsx` | New user registration |
| `forgot-password` | `ForgotPassword.tsx` | Sends password reset email |
| `update-password` | `UpdatePassword.tsx` | Set new password (triggered by `PASSWORD_RECOVERY` auth event) |
| `dashboard` | `Dashboard.tsx` | Authenticated user hub |
| `checkout` | `Checkout.tsx` | Membership purchase with selected plan |
| `admin-login` | `AdminLogin.tsx` | Secure admin sign-in |
| `admin-dashboard` | `AdminDashboard.tsx` | Admin management panel |

---

## 🎨 Design System

- **Theme**: Dark mode — `bg-black` / `bg-zinc-950` / `bg-zinc-900`
- **Accent Color**: Lime green (`lime-400`, `lime-500`) — primary actions, highlights
- **Secondary Accent**: Cyan (`cyan-400`) — AI Coach related elements
- **Typography**: Custom `font-heading` (bold, tracking-tighter), `font-mono` for code/metadata
- **Animations**: Framer Motion (`motion.div`) for enter/exit animations, spring transitions
- **Icons**: Lucide React throughout

---

## ✨ Core Features (A to Z)

### 1. 🏠 Landing Page (Home)
- **Hero** — Bold headline, CTA buttons (Join Now / Get Started)
- **About** — Gym introduction
- **Services** — Service cards with icons
- **Programs** — Training program listing with benefits
- **Testimonials** — Client review carousel

### 2. 🤖 AI Coach (`AICoach.tsx`)
> The **flagship feature** of the app.

- User selects a **fitness goal** (text input) and **level** (Beginner / Intermediate / Advanced)
- Calls the **Supabase Edge Function** (`/functions/v1/gemini`)
- Edge Function proxies to **Google Gemini AI** (`gemini-3-flash-preview`)
- Returns a structured workout plan with phases: Warmup → Main Session → Cool Down
- Logged-in users can **save the workout** to Supabase (`user_workouts` table)
- History of past workouts is shown with a "View History" section

### 3. 💬 GymBot (`GymBot.tsx`)
- Persistent **floating chatbot** visible on all pages
- Always accessible via a FAB (Floating Action Button)
- Provides instant answers to gym-related questions

### 4. 💳 Pricing & Checkout (`Pricing.tsx` + `Checkout.tsx`)
- 3 membership plans (Free, Pro, Elite — or similar tiers)
- Clicking "Select Plan" stores the plan and navigates to Checkout
- Checkout collects: First/Last name, Email, Password, Phone, Address, City, ZIP
- If user is already logged in → pre-fills email/name from session
- Submits to `gym_subscriptions` Supabase table
- Includes password strength indicator, field validation

### 5. 👤 User Dashboard (`Dashboard.tsx`)
- Requires authentication → redirects to login if not signed in
- **Profile Card**: Name, email, phone, address from `gym_subscriptions`
- **Deployment Status Card**: Subscription status (active/inactive), enlistment date
- **Routine Library**: Grid of all saved workouts from `user_workouts` table
- **Workout Detail Drawer**: Slide-in panel with full formatted workout content
- **Workout Calendar**: Visual calendar showing workout dates (`WorkoutCalendar.tsx`)
- Delete workout functionality

### 6. 🛡️ Admin Dashboard (`AdminDashboard.tsx`)
- Protected with admin-role check via Supabase
- **3 Tabs**: Members | Users | Messages
- **Stats**: Total revenue, member count, user count, lead count
- **Members Tab**: List of all gym subscribers with search
- **Users Tab**: All registered Supabase Auth users
- **Messages Tab**: Contact form submissions
- **Detail Drawer**: Click any record for full details (slide-in panel)
- Authorization error state if non-admin tries to access

### 7. 🔐 Authentication System
- **Login** — email + password via `supabase.auth.signInWithPassword()`
- **Signup** — email + password + metadata via `supabase.auth.signUp()`
- **Forgot Password** — sends reset email via `supabase.auth.resetPasswordForEmail()`
- **Update Password** — triggered by `PASSWORD_RECOVERY` auth event, uses `supabase.auth.updateUser()`
- **Session Management** — `onAuthStateChange` listener in both `App.tsx` and `Layout.tsx`
- **Logout** — `supabase.auth.signOut()`, redirects to home

### 8. 📞 Contact Form (`Contact.tsx`)
- Collects: Name, Email, Phone, Message
- Saves to Supabase `contact_messages` table (queried in AdminDashboard)

---

## 🗄️ Database Tables (Supabase)

| Table | Used In | Key Columns |
|-------|---------|-------------|
| `gym_subscriptions` | Checkout, Dashboard, AdminDashboard | `first_name`, `last_name`, `email`, `phone_number`, `street_address`, `city`, `zip_code`, `membership_plan`, `subscription_status`, `total_paid`, `created_at` |
| `user_workouts` | AICoach, Dashboard | `id`, `user_id`, `goal`, `level`, `workout_content`, `created_at` |
| `contact_messages` | Contact, AdminDashboard | `id`, `name`, `email`, `phone`, `message`, `created_at` |

---

## ⚡ Supabase Edge Function: `gemini`

**File**: [`supabase/functions/gemini/index.ts`](file:///c:/Users/JAYASIMBU/Downloads/myfitness-hub/supabase/functions/gemini/index.ts)

```
Request  → POST { prompt: string }
↓
Edge Function reads GEMINI_API_KEY from Deno env
↓
Calls GoogleGenAI: model = 'gemini-3-flash-preview'
↓
Response → { text: string }
```

- CORS enabled for all origins (`Access-Control-Allow-Origin: *`)
- Handles preflight `OPTIONS` requests
- Deno runtime v2, deployed on Supabase Edge

---

## 🔧 Environment Variables

| Variable | Value / Source | Usage |
|----------|----------------|-------|
| `SUPABASE_URL` | `https://czkuopgkgiluysfefwuz.supabase.co` | Supabase client init |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Supabase client auth |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` | **Backend only** (never exposed to frontend) |
| `GEMINI_API_KEY` | Set in Supabase Edge Secrets | Used inside edge function |

> [!CAUTION]
> `SUPABASE_SECRET_KEY` and `GEMINI_API_KEY` must **never** be committed to Git or exposed in the frontend bundle.

---

## 📜 NPM Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server at `localhost:3000` |
| `build` | `vite build` | Production bundle → `/dist` |
| `preview` | `vite preview` | Preview production build locally |
| `test:e2e` | `playwright test` | Run all E2E tests headlessly |
| `test:e2e:ui` | `playwright test --ui` | Run E2E tests with Playwright UI |

---

## 🧪 Testing

**Test Files** in `/tests/`:
| File | Description |
|------|-------------|
| `e2e.spec.ts` | Basic end-to-end flow |
| `full-e2e.spec.ts` | Full user journey (signup → checkout → dashboard) |
| `comprehensive.spec.ts` | Comprehensive edge case tests |

**Config**: [`playwright.config.ts`](file:///c:/Users/JAYASIMBU/Downloads/myfitness-hub/playwright.config.ts) — runs against the local dev server

---

## 🚀 Deployment (Vercel)

**`vercel.json`** rewrites all routes to `index.html` for SPA support:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

This ensures direct URL access to any page (e.g., `/dashboard`) doesn't return a 404.

---

## 🔑 TypeScript Interfaces (`types.ts`)

| Interface | Fields |
|-----------|--------|
| `Service` | `id`, `title`, `description`, `icon: LucideIcon` |
| `Program` | `id`, `title`, `duration`, `price`, `image`, `benefits[]` |
| `Testimonial` | `id`, `name`, `role`, `quote`, `avatar` |
| `PricingPlan` | `id`, `name`, `price`, `period`, `features[]`, `isPopular` |

---

## 🔄 Data Flow Summary

```
User Action
    │
    ▼
React Component (useState / useEffect)
    │
    ├──► Supabase Auth       → Login / Signup / Session
    ├──► Supabase Database   → gym_subscriptions / user_workouts / contact_messages
    └──► Supabase Edge Fn    → gemini function → Google Gemini AI
                                                      │
                                                      ▼
                                              Workout Plan (text)
                                                      │
                                                      ▼
                                         React state → rendered UI
```

---

## 🏁 Quick Start

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev
# → Opens at http://localhost:3000

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

---

## 📋 Summary

> **MyFitness Hub** is a full-stack fitness web application with:
> - A rich, dark-themed landing page showcasing gym services and pricing
> - **AI-powered workout generation** using Google Gemini via Supabase Edge Functions
> - Full **auth system** (login, signup, forgot/update password)
> - A **user dashboard** with saved workouts and workout calendar
> - A **checkout flow** for gym memberships
> - A **persistent chatbot** (GymBot) on all pages
> - An **admin panel** to manage members, users, and contact messages
> - Deployed on **Vercel** with Supabase as the backend

