import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="hero">
        <div className="hero-tag fade-up">🎓 Learn Without Limits</div>

        <h1 className="fade-up fade-up-d1">
          Master Skills That
          <br />
          <span>Shape Tomorrow</span>
        </h1>

        <p className="fade-up fade-up-d2">
          Expert-crafted courses in programming, design, and data science.
          Learn at your pace, track your progress, and build real-world skills.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
          className="fade-up fade-up-d3"
        >
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(isAuthenticated ? "/catalog" : "/login")}
          >
            {isAuthenticated ? "Browse Courses →" : "Start Learning Free →"}
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate("/catalog")}
          >
            Explore Catalog
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row fade-up fade-up-d4" style={{ marginTop: 64 }}>
          {[
            ["6+",   "Expert Courses"],
            ["92K",  "Active Students"],
            ["4.8★", "Average Rating"],
            ["∞",    "Lifetime Access"],
          ].map(([num, label]) => (
            <div key={label} className="stat-card">
              <div className="stat-number">{num}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
