import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => go("/")}>
        LearnHub
      </div>

      <div className="nav-links">
        {user && (
          <>
            <button
              className={`nav-link ${pathname === "/catalog" ? "active" : ""}`}
              onClick={() => go("/catalog")}
            >
              Courses
            </button>
            <button
              className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
              onClick={() => go("/dashboard")}
            >
              My Learning
            </button>
          </>
        )}

        {!user ? (
          <button className="btn btn-primary btn-sm" onClick={() => go("/login")}>
            Get Started
          </button>
        ) : (
          <div style={{ position: "relative" }}>
            <div className="nav-avatar" onClick={() => setMenuOpen(!menuOpen)}>
              {user.avatar}
            </div>

            {menuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 8,
                  minWidth: 180,
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 200,
                }}
              >
                <div
                  style={{
                    padding: "8px 12px 12px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{user.email}</div>
                </div>
                <button
                  className="nav-link"
                  style={{ width: "100%", textAlign: "left" }}
                  onClick={() => go("/dashboard")}
                >
                  📚 My Learning
                </button>
                <button
                  className="nav-link"
                  style={{ width: "100%", textAlign: "left", color: "var(--red)" }}
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                    go("/");
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
