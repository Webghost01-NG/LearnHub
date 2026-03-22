# 🎓 LearnHub — E-Learning Platform

> Master skills that shape tomorrow. Browse courses, enroll, watch lessons, and track your progress — all in one place.

---

## 📸 Demo Flow

```
Login → Browse Catalog → Enroll → Watch Lesson → Mark Complete → Track Progress
```

**Demo credentials (pre-filled on the login page):**

| User | Email | Password |
|------|-------|----------|
| Alex Johnson | demo@learnhub.io | demo123 |
| Sam Taylor | test@learnhub.io | test123 |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | Login / logout with protected routes |
| 📚 Course Catalog | Browse & filter 6 courses by category, level, keyword |
| 🎓 Enrollment | One-click enroll — persisted to localStorage |
| ▶️ Lesson Player | Simulated video player with progress tracking |
| ✅ Progress Tracking | Mark lessons complete — % shown on cards, detail page, and player |
| 📊 Dashboard | Personal learning stats and enrolled course overview |

---

## ⚙️ Tech Stack

- **React 18** — Hooks, Context API
- **React Router v6** — Nested routes (`/catalog/:courseId/lesson/:lessonId`)
- **Vite** — Dev server and build tool
- **localStorage** — Persistence for auth, enrollments, and progress

---

## 🗂️ Folder Structure

```
learnhub/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # ReactDOM entry
    ├── App.jsx               # Router + providers + shared state
    ├── data/
    │   └── courses.js        # Course data + demo users + constants
    ├── styles/
    │   └── global.css        # Design tokens + all component styles
    ├── store/
    │   ├── AuthContext.jsx   # Auth state + useAuth hook
    │   └── ToastContext.jsx  # Toast notifications + useToast hook
    ├── hooks/
    │   ├── useAuth.js        # Re-export of useAuth
    │   ├── useToast.js       # Re-export of useToast
    │   ├── useProgress.js    # Custom hook — per-lesson completion
    │   └── useEnrollment.js  # Custom hook — course enrollment
    ├── components/
    │   ├── Nav.jsx           # Sticky top navigation
    │   ├── CourseCard.jsx    # Reusable course card w/ progress
    │   ├── StarRating.jsx    # Star rating display
    │   ├── ProgressBar.jsx   # Reusable progress bar
    │   ├── LessonSidebar.jsx # Lesson list sidebar in player
    │   └── ProtectedRoute.jsx# Auth guard for private routes
    └── pages/
        ├── HomePage.jsx         # Landing page
        ├── LoginPage.jsx        # Login / register + demo accounts
        ├── CatalogPage.jsx      # /catalog — browse + filter
        ├── DashboardPage.jsx    # /dashboard — my learning
        ├── CourseDetailPage.jsx # /catalog/:courseId
        └── LessonPage.jsx       # /catalog/:courseId/lesson/:lessonId
```

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/learnhub.git
cd learnhub

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → Opens at http://localhost:3000

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 🌿 Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, production-ready code |
| `feature/auth` | Login, logout, protected routes, AuthContext |
| `feature/enrollment` | Enrollment hook, course detail CTA, dashboard |
| `feature/lesson-player` | Lesson page, video simulation, progress tracking |

### Suggested commit history (≥ 12 commits)

```
feat: initialise Vite + React project
feat: add global CSS design tokens and base styles
feat: add course data and demo users
feat: implement AuthContext with login/logout
feat: add ProtectedRoute component
feat: build Nav with auth-aware links
feat: create HomePage with hero and stats
feat: implement LoginPage with demo account autofill
feat: add CatalogPage with search and category filters
feat: add CourseDetailPage with curriculum list
feat: implement enrollment with useEnrollment hook
feat: build LessonPage with simulated video player
feat: add progress tracking with useProgress hook
feat: create DashboardPage with learning stats
fix: persist progress across page refreshes
chore: add README and .gitignore
```

---

## 🧠 Engineering Notes

### Custom Hooks

- **`useAuth`** — wraps `AuthContext`; exposes `user`, `login`, `logout`, `isAuthenticated`
- **`useProgress`** — tracks per-lesson completion for a course, persisted in localStorage
- **`useEnrollment`** — tracks which courses a user is enrolled in, persisted in localStorage

### State Management

Context API (`AuthContext`, `ToastContext`) handles global state. Local UI state (`useState`) lives in each component. All persistence is via `localStorage` — swap for an API layer to make it production-ready.

### Routing

```
/                              → HomePage
/login                         → LoginPage
/catalog                       → CatalogPage
/catalog/:courseId             → CourseDetailPage
/catalog/:courseId/lesson/:id  → LessonPage  ← nested route (protected)
/dashboard                     → DashboardPage (protected)
```

---

## 📄 License

MIT
