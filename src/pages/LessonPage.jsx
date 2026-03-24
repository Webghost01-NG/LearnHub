import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import LessonSidebar from "../components/LessonSidebar";
import ProgressBar from "../components/ProgressBar";
import { COURSES_DATA } from "../data/courses";

export default function LessonPage({ enrollmentData }) {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const toast    = useToast();

  const course = COURSES_DATA.find((c) => c.id === courseId);
  const lessonIdx = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const lesson    = course?.lessons[lessonIdx];

  const [playing,       setPlaying]       = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const intervalRef = useRef(null);

  // Reset player when lesson changes
  useEffect(() => {
    setPlaying(false);
    setVideoProgress(0);
  }, [lessonId]);

  // Simulate playback
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setVideoProgress((p) => {
          if (p >= 100) {
            clearInterval(intervalRef.current);
            setPlaying(false);
            return 100;
          }
          return p + 0.5;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  if (!course || !lesson) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🔭</div>
          <div className="empty-title">Lesson not found</div>
          <button className="btn btn-secondary" onClick={() => navigate(`/catalog/${courseId}`)}>
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  const isComplete  = enrollmentData.isLessonComplete(course.id, lesson.id);
  const progress    = enrollmentData.getProgressPercent(course.id);
  const prevLesson  = course.lessons[lessonIdx - 1];
  const nextLesson  = course.lessons[lessonIdx + 1];

  const handleMarkComplete = () => {
    enrollmentData.markLessonComplete(course.id, lesson.id);
    toast("✅ Lesson marked as complete!");
  };

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      {/* Back */}
      <button
        className="btn btn-ghost btn-sm fade-up"
        onClick={() => navigate(`/catalog/${course.id}`)}
        style={{ marginBottom: 24 }}
      >
        ← Back to {course.title}
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>
        {/* ── Main column ──────────────────────────────────── */}
        <div className="fade-up fade-up-d1">
          {/* Video player */}
          <div className="video-player">
            <div style={{ position: "absolute", inset: 0, background: course.gradient, opacity: 0.6 }} />
            <div className="video-overlay">
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>
                Lesson {lessonIdx + 1} of {course.lessons.length}
              </div>
              <div style={{ fontSize: "clamp(18px,3vw,28px)", fontWeight: 700, textAlign: "center", padding: "0 24px" }}>
                {lesson.title}
              </div>
              <div className="play-btn" onClick={() => setPlaying(!playing)}>
                {playing ? "⏸" : "▶"}
              </div>
              {videoProgress > 0 && (
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-mono)" }}>
                  {Math.round(videoProgress)}%
                </div>
              )}
            </div>
            <div className="video-progress">
              <div className="video-progress-fill" style={{ width: `${videoProgress}%` }} />
            </div>
          </div>

          {/* Lesson header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 6, fontFamily: "var(--font-mono)" }}>
                {course.title} / Lesson {lessonIdx + 1}
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700 }}>
                {lesson.title}
              </h2>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>
                ⏱ {lesson.duration} &nbsp;·&nbsp; by {course.instructor}
              </div>
            </div>

            {!isComplete && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleMarkComplete}
                disabled={videoProgress < 10}
                title={videoProgress < 10 ? "Watch at least 10% first" : ""}
                style={{ flexShrink: 0 }}
              >
                ✓ Mark Complete
              </button>
            )}
          </div>

          {/* Completion banner */}
          {isComplete && (
            <div className="completion-banner">
              <span style={{ fontSize: 28 }}>🏆</span>
              <div>
                <div style={{ fontWeight: 600, color: "var(--green)" }}>Lesson Complete!</div>
                <div style={{ fontSize: 13, color: "var(--text2)" }}>Great work. Keep the momentum going.</div>
              </div>
            </div>
          )}

          {/* About lesson */}
          <div
            style={{
              marginTop: 28,
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
            }}
          >
            <h3 style={{ fontWeight: 600, marginBottom: 16 }}>About This Lesson</h3>
            <p style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8 }}>
              In this lesson, we'll explore{" "}
              <strong style={{ color: "var(--text)" }}>{lesson.title.toLowerCase()}</strong>{" "}
              in depth. Follow along with the code examples and practise the
              concepts covered before moving on to the next lesson.
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge-gray">📹 Video Lesson</span>
              <span className="badge badge-gray">⏱ {lesson.duration}</span>
              {isComplete && <span className="badge badge-green">✅ Completed</span>}
            </div>
          </div>

          {/* Course-level progress strip */}
          <div
            style={{
              marginTop: 24,
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px 20px",
            }}
          >
            <ProgressBar percent={progress} showLabel />
          </div>

          {/* Prev / Next navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 }}>
            <button
              className="btn btn-secondary"
              disabled={!prevLesson}
              onClick={() => navigate(`/catalog/${course.id}/lesson/${prevLesson.id}`)}
            >
              ← Previous
            </button>
            <button
              className="btn btn-primary"
              disabled={!nextLesson}
              onClick={() => navigate(`/catalog/${course.id}/lesson/${nextLesson.id}`)}
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="fade-up fade-up-d2">
          <LessonSidebar
            course={course}
            currentIndex={lessonIdx}
            isLessonComplete={(lid) => enrollmentData.isLessonComplete(course.id, lid)}
            progressPercent={progress}
          />
        </div>
      </div>
    </div>
  );
}
