import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { DEMO_USERS } from "../data/courses";

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast("Please fill in all fields", "error");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast("Welcome back! 🎉");
      navigate(from, { replace: true });
    } else {
      toast(result.error, "error");
    }
  };

  const fillDemo = (u) => {
    setEmail(u.email);
    setPassword(u.password);
  };

  return (
    <div className="page-sm" style={{ paddingTop: 60 }}>
      <div className="auth-card fade-up">
        <div className="auth-title">
          {isRegister ? "Create Account" : "Welcome Back"}
        </div>
        <div className="auth-sub">
          {isRegister
            ? "Join thousands of learners today"
            : "Sign in to continue your learning journey"}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your name"
              />
            </div>
          )}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 8, justifyContent: "center" }}
          >
            {loading
              ? "⏳ Signing in..."
              : isRegister
              ? "Create Account →"
              : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or try a demo account</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {DEMO_USERS.map((u) => (
            <div key={u.id} className="demo-account" onClick={() => fillDemo(u)}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--accent-glow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--accent)",
                }}
              >
                {u.avatar}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{u.name}</div>
                <div style={{ color: "var(--text3)", fontSize: 12 }}>
                  {u.email} / {u.password}
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--accent)" }}>
                → Fill
              </span>
            </div>
          ))}
        </div>

        <div
          style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--text2)" }}
        >
          {isRegister ? "Already have an account? " : "New here? "}
          <span
            style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Sign In" : "Create Account"}
          </span>
        </div>
      </div>
    </div>
  );
}
