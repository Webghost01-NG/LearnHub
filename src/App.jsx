import { useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./store/AuthContext";
import { ToastProvider }         from "./store/ToastContext";
import { useEnrollment }         from "./hooks/useEnrollment";
import { COURSES_DATA }          from "./data/courses";

import Nav               from "./components/Nav";
import ProtectedRoute    from "./components/ProtectedRoute";

import HomePage          from "./pages/HomePage";
import LoginPage         from "./pages/LoginPage";
import CatalogPage       from "./pages/CatalogPage";
import DashboardPage     from "./pages/DashboardPage";
import CourseDetailPage  from "./pages/CourseDetailPage";
import LessonPage        from "./pages/LessonPage";

import "./styles/global.css";

// ─── Inner app (needs auth context to be ready) ──────────────
function AppInner() {
  const { user } = useAuth();

  // ── Enrollment ──────────────────────────────────────────────
  const { enrolled, enroll, isEnrolled } = useEnrollment(user?.id || "guest");

  // ── Per-lesson progress (persisted per user + course) ───────
  const progressCache = useRef({});
  // Force re-renders when progress changes
  const [tick, setTick] = useState(0);

  const getCache = (courseId) => {
    if (!user) return {};
    const key = `progress_${user.id}_${courseId}`;
    if (!progressCache.current[key]) {
      try {
        progressCache.current[key] = JSON.parse(
          localStorage.getItem(key) || "{}"
        );
      } catch {
        progressCache.current[key] = {};
      }
    }
    return progressCache.current[key];
  };

  const markLessonComplete = (courseId, lessonId) => {
    if (!user) return;
    const key = `progress_${user.id}_${courseId}`;
    if (!progressCache.current[key]) progressCache.current[key] = {};
    progressCache.current[key][lessonId] = true;
    localStorage.setItem(key, JSON.stringify(progressCache.current[key]));
    setTick((t) => t + 1); // trigger re-render
  };

  const isLessonComplete = (courseId, lessonId) =>
    !!getCache(courseId)[lessonId];

  const getProgressPercent = (courseId) => {
    const course = COURSES_DATA.find((c) => c.id === courseId);
    if (!course) return 0;
    const cache     = getCache(courseId);
    const completed = Object.values(cache).filter(Boolean).length;
    return Math.round((completed / course.lessons.length) * 100);
  };

  // Bundle everything pages need about enrollment + progress
  const enrollmentData = {
    enrolled,
    enroll,
    isEnrolled,
    markLessonComplete,
    isLessonComplete,
    getProgressPercent,
  };

  return (
    <div className="app-shell">
      <Nav />
      <main className="main-content">
        <Routes>
          {/* Public */}
          <Route path="/"       element={<HomePage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/catalog" element={<CatalogPage enrollmentData={enrollmentData} />} />

          {/* Course detail (public) — with nested lesson route */}
          <Route
            path="/catalog/:courseId"
            element={<CourseDetailPage enrollmentData={enrollmentData} />}
          />

          {/* Lesson player — nested, protected */}
          <Route
            path="/catalog/:courseId/lesson/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPage enrollmentData={enrollmentData} />
              </ProtectedRoute>
            }
          />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage enrollmentData={enrollmentData} />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ─── Root: providers wrap everything ─────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppInner />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
