import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Frame2 from "./Frame2";

const DashboardLogin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const DASHBOARD_PASSWORD = "fx72025";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthenticated) return <Frame2 />;

  return (
    <div className="page-container" style={{ alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: 380, padding: "0 20px" }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ textAlign: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>☕</div>
            <span className="eyebrow" style={{ marginBottom: 8 }}>Staff only</span>
            <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.04em", margin: "0 0 6px" }}>Barista dashboard</h1>
            <p style={{ color: "var(--muted)", fontSize: 12 }}>Enter your password to continue</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 6 }}>
              Password
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoFocus />
            </label>
            {error && <p style={{ fontSize: 12, color: "#c85a4a", margin: 0 }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>Access dashboard →</button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="btn-secondary"
            style={{ marginTop: 8 }}
          >← Back to menu</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;
