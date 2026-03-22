import { createContext, useContext, useState, useCallback } from "react";
import { DEMO_USERS } from "../data/courses";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("current_user") || "null");
    } catch {
      return null;
    }
  });

  const login = useCallback((email, password) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      localStorage.setItem("current_user", JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("current_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
