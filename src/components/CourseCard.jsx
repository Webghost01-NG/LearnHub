import StarRating from "./StarRating";

export default function CourseCard({ course, enrolled, progress, onClick }) {
  return (
    <div className="card course-card fade-up" onClick={onClick}>
      {/* Thumbnail */}
      <div
        className="course-thumb"
        style={{ background: course.gradient }}
      >
        <span
          style={{
            fontSize: 56,
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
            position: "relative",
            zIndex: 1,
          }}
        >
          {course.emoji}
        </span>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <span className={`badge ${enrolled ? "badge-green" : "badge-gray"}`}>
            {enrolled ? "✓ Enrolled" : course.level}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="course-body">
        <div style={{ marginBottom: 8 }}>
          <span
            className="badge badge-accent"
            style={{ marginBottom: 10, display: "inline-flex" }}
          >
            {course.category}
          </span>
        </div>
        <h3 className="course-title">{course.title}</h3>
        <p className="course-desc">{course.description}</p>
        <div className="course-meta">
          <StarRating rating={course.rating} />
          <span className="course-stat">👤 {course.students.toLocaleString()}</span>
          <span className="course-stat">⏱️ {course.duration}</span>
          <span className="course-stat">📚 {course.lessons.length} lessons</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "var(--text3)" }}>
          by <span style={{ color: "var(--text2)" }}>{course.instructor}</span>
        </div>
      </div>

      {/* Progress bar when enrolled */}
      {enrolled && (
        <div className="enrolled-bar">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 12,
            }}
          >
            <span style={{ color: "var(--text2)" }}>Progress</span>
            <span style={{ color: "var(--green)", fontWeight: 600 }}>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
