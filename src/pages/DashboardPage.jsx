import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import CourseCard from "../components/CourseCard";
import { COURSES_DATA } from "../data/courses";

export default function DashboardPage({ enrollmentData }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const enrolledCourses = COURSES_DATA.filter((c) =>
    enrollmentData.isEnrolled(c.id)
  );

  const totalLessons = enrolledCourses.reduce(
    (s, c) => s + c.lessons.length,
    0
  );

  const completedLessons = enrolledCourses.reduce((s, c) => {
    const pct = enrollmentData.getProgressPercent(c.id);
    return s + Math.round((pct / 100) * c.lessons.length);
  }, 0);

  const overallPct =
    totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

  const completedCourses = enrolledCourses.filter(
    (c) => enrollmentData.getProgressPercent(c.id) === 100
  ).length;

  return (
    <div className="page">
      {/* Greeting */}
      <div style={{ marginBottom: 40 }}>
        <div className="fade-up" style={{ fontSize: 13, color: "var(--text3)", marginBottom: 8 }}>
          Welcome back,
        </div>
        <h1
          className="fade-up fade-up-d1"
          style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900 }}
        >
          {user.name} 👋
        </h1>
      </div>

      {/* Stats */}
      <div className="stats-row fade-up fade-up-d2">
        {[
          [enrolledCourses.length, "Enrolled Courses"],
          [completedLessons,       "Lessons Completed"],
          [`${overallPct}%`,       "Overall Progress"],
          [completedCourses,       "Courses Finished"],
        ].map(([num, label]) => (
          <div key={label} className="stat-card">
            <div className="stat-number">{num}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Course list */}
      {enrolledCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <div className="empty-title">No courses yet</div>
          <div className="empty-desc">
            Browse the catalog and enroll in your first course to start learning!
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/catalog")}
          >
            Browse Courses →
          </button>
        </div>
      ) : (
        <>
          <div className="section-header">
            <h2 className="section-title">My Courses</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate("/catalog")}
            >
              + Enroll More
            </button>
          </div>
          <div className="course-grid">
            {enrolledCourses.map((course, i) => (
              <div key={course.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <CourseCard
                  course={course}
                  enrolled
                  progress={enrollmentData.getProgressPercent(course.id)}
                  onClick={() => navigate(`/catalog/${course.id}`)}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
