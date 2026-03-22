import { useNavigate } from "react-router-dom";

export default function LessonSidebar({ course, currentIndex, isLessonComplete, progressPercent }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>Course Content</span>
        <span style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>
          {progressPercent}%
        </span>
      </div>

      {/* Lesson list */}
      <div style={{ maxHeight: 480, overflowY: "auto" }}>
        {course.lessons.map((lesson, i) => {
          const done      = isLessonComplete(lesson.id);
          const isCurrent = i === currentIndex;

          return (
            <div
              key={lesson.id}
              className={`lesson-item ${isCurrent ? "active" : ""} ${done ? "completed" : ""}`}
              style={{
                borderRadius: 0,
                borderBottom: "1px solid var(--border)",
                margin: 0,
              }}
              onClick={() =>
                navigate(`/catalog/${course.id}/lesson/${lesson.id}`)
              }
            >
              <div className="lesson-num">{done ? "✓" : i + 1}</div>
              <div className="lesson-info">
                <div className="lesson-title-text" style={{ fontSize: 13 }}>
                  {lesson.title}
                </div>
                <div className="lesson-duration">{lesson.duration}</div>
              </div>
              {done && (
                <span style={{ color: "var(--green)", fontSize: 14 }}>✅</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
