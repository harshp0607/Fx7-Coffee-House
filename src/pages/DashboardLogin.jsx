import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Frame2 from "./Frame2";

const DashboardLogin = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // You can change this password to whatever you want
  const DASHBOARD_PASSWORD = "barista2024";

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

  if (isAuthenticated) {
    return <Frame2 />;
  }

  return (
    <div className="page-container items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <div className="card border-pine-300 p-8 gap-6 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl">👨‍🍳</div>
            <h1 className="text-3xl font-black text-pine-800 tracking-tight">Barista Dashboard</h1>
            <p className="text-cocoa-600 font-medium text-center">Enter password to access</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <label className="font-bold text-cocoa-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl bg-gradient-to-r from-cream-100 to-sage-50 border-2 border-sage-300 py-4 px-5 text-lg text-pine-700 font-medium placeholder:text-cocoa-400 outline-none focus:border-pine-500 focus:bg-white focus:shadow-lg transition-all"
                autoFocus
              />
              {error && (
                <p className="text-sm text-red-600 font-semibold">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary btn-large w-full text-xl shadow-2xl border-2 border-pine-800 gap-3 hover:scale-[1.02]"
            >
              <span className="font-black tracking-wide">Access Dashboard</span>
              <span className="text-2xl">→</span>
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="btn-secondary btn-medium w-full"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogin;
