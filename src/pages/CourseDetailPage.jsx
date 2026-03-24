import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import StarRating from "../components/StarRating";
import ProgressBar from "../components/ProgressBar";
import { COURSES_DATA } from "../data/courses";

export default function CourseDetailPage({ enrollmentData }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const course = COURSES_DATA.find((c) => c.id === courseId);
  if (!course) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🔭</div>
          <div className="empty-title">Course not found</div>
          <button className="btn btn-secondary" onClick={() => navigate("/catalog")}>
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const enrolled = enrollmentData.isEnrolled(course.id);
  const progress = enrollmentData.getProgressPercent(course.id);

  const handleEnroll = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    enrollmentData.enroll(course.id);
    toast(`🎉 You're enrolled in "${course.title}"!`);
  };

  const openLesson = (lesson, idx) => {
    if (!enrolled && !lesson.free) {
      toast("Enroll in this course to access all lessons", "error");
      return;
    }
    navigate(`/catalog/${course.id}/lesson/${lesson.id}`);
  };

  // Find the first incomplete lesson for "Continue" CTA
  const continueLesson =
    course.lessons.find((l) => !enrollmentData.isLessonComplete(course.id, l.id)) ||
    course.lessons[0];

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="course-detail-header fade-up">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate("/catalog")}
            style={{ marginBottom: 20 }}
          >
            ← Back to Catalog
          </button>

          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Emoji thumb */}
            <div
              style={{
                width: 100, height: 100, borderRadius: 20,
                background: course.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 44, flexShrink: 0,
                border: "1px solid var(--border)",
              }}
            >
              {course.emoji}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span className="badge badge-accent">{course.category}</span>
                <span className="badge badge-gray">{course.level}</span>
                {enrolled && <span className="badge badge-green">✓ Enrolled</span>}
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(24px,4vw,36px)",
                  fontWeight: 900, marginBottom: 12, lineHeight: 1.2,
                }}
              >
                {course.title}
              </h1>

              <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.7, marginBottom: 16, maxWidth: 680 }}>
                {course.description}
              </p>

              <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
                <StarRating rating={course.rating} />
                <span className="course-stat" style={{ fontSize: 13 }}>👤 {course.students.toLocaleString()} students</span>
                <span className="course-stat" style={{ fontSize: 13 }}>⏱️ {course.duration}</span>
                <span className="course-stat" style={{ fontSize: 13 }}>📚 {course.lessons.length} lessons</span>
              </div>

              <div style={{ marginTop: 10, fontSize: 13, color: "var(--text2)" }}>
                Instructor: <strong>{course.instructor}</strong>
              </div>

              {enrolled && (
                <div style={{ marginTop: 16, maxWidth: 320 }}>
                  <ProgressBar percent={progress} showLabel />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="page">
        <div className="course-detail-grid">
          {/* Left — curriculum */}
          <div className="fade-up fade-up-d1">
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
              Course Curriculum
            </h2>
            <div className="lesson-list">
              {course.lessons.map((lesson, idx) => {
                const isComplete   = enrollmentData.isLessonComplete(course.id, lesson.id);
                const isAccessible = enrolled || lesson.free;

                return (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${isComplete ? "completed" : ""}`}
                    onClick={() => openLesson(lesson, idx)}
                  >
                    <div className="lesson-num">{isComplete ? "✓" : idx + 1}</div>
                    <div className="lesson-info">
                      <div className="lesson-title-text">{lesson.title}</div>
                      <div className="lesson-duration">⏱ {lesson.duration}</div>
                    </div>
                    <div className="lesson-lock">
                      {!isAccessible
                        ? "🔒"
                        : isComplete
                        ? <span style={{ color: "var(--green)" }}>✅</span>
                        : "▶️"}
                    </div>
                    {lesson.free && !enrolled && (
                      <span className="badge badge-gold" style={{ fontSize: 10 }}>FREE</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right — sticky CTA card */}
          <div className="fade-up fade-up-d2">
            <div className="card" style={{ padding: 28, position: "sticky", top: 80 }}>
              <div
                style={{
                  height: 160, borderRadius: 12,
                  background: course.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 64, marginBottom: 20,
                  border: "1px solid var(--border)",
                }}
              >
                {course.emoji}
              </div>

              {enrolled ? (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
                    onClick={() =>
                      navigate(`/catalog/${course.id}/lesson/${continueLesson.id}`)
                    }
                  >
                    {progress === 0
                      ? "▶ Start Course"
                      : progress === 100
                      ? "🔄 Review Course"
                      : "▶ Continue Learning"}
                  </button>

                  <div
                    style={{
                      background: "var(--bg3)", borderRadius: 10,
                      padding: "12px 16px", fontSize: 13, color: "var(--text2)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span>Progress</span>
                      <span style={{ color: "var(--green)", fontWeight: 600 }}>{progress}%</span>
                    </div>
                    <ProgressBar percent={progress} />
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
                    onClick={handleEnroll}
                  >
                    🎓 Enroll Now — Free
                  </button>
                  <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", lineHeight: 1.6 }}>
                    ✓ Lifetime access &nbsp;·&nbsp; ✓ Progress tracking
                    <br />✓ Certificate of completion
                  </div>
                </>
              )}

              {/* Includes list */}
              <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
                  This course includes:
                </div>
                {[
                  ["📹", `${course.lessons.length} video lessons`],
                  ["⏱️", `${course.duration} of content`],
                  ["📱", "Access on all devices"],
                  ["🏆", "Certificate of completion"],
                ].map(([icon, text]) => (
                  <div
                    key={text}
                    style={{ display: "flex", gap: 10, fontSize: 13, marginBottom: 8, color: "var(--text2)" }}
                  >
                    <span>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
