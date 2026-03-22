import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { COURSES_DATA, CATEGORIES, LEVELS } from "../data/courses";

export default function CatalogPage({ enrollmentData }) {
  const navigate = useNavigate();
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [level,    setLevel]    = useState("All Levels");

  const filtered = COURSES_DATA.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.instructor.toLowerCase().includes(q);
    const matchCat   = category === "All" || c.category === category;
    const matchLevel = level    === "All Levels" || c.level === level;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 900, marginBottom: 8 }}>
          Course Catalog
        </h1>
        <p className="fade-up fade-up-d1" style={{ color: "var(--text2)" }}>
          {COURSES_DATA.length} expert-crafted courses to accelerate your career
        </p>
      </div>

      {/* Search */}
      <div className="search-bar fade-up fade-up-d1">
        <span style={{ color: "var(--text3)", fontSize: 18 }}>🔍</span>
        <input
          placeholder="Search courses, instructors, topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <span style={{ cursor: "pointer", color: "var(--text3)" }} onClick={() => setSearch("")}>
            ✕
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="tag-filter fade-up fade-up-d2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`tag-btn ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
        <div style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`tag-btn ${level === l ? "active" : ""}`}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔭</div>
          <div className="empty-title">No courses found</div>
          <div className="empty-desc">Try adjusting your search or filters</div>
          <button
            className="btn btn-secondary"
            onClick={() => { setSearch(""); setCategory("All"); setLevel("All Levels"); }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="course-grid">
          {filtered.map((course, i) => (
            <div key={course.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <CourseCard
                course={course}
                enrolled={enrollmentData.isEnrolled(course.id)}
                progress={enrollmentData.getProgressPercent(course.id)}
                onClick={() => navigate(`/catalog/${course.id}`)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
