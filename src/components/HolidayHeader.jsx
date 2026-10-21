import { useNavigate } from "react-router-dom";

const HolidayHeader = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      minHeight: 280,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
      padding: "44px 20px 36px",
      background: "var(--bg)",
    }}>
      {/* Decorative orbit rings */}
      <div style={{
        position: "absolute", width: 230, height: 230,
        top: 20, left: -110,
        border: "1px solid #e8d9c8", borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 170, height: 170,
        top: 60, right: -85,
        border: "1px solid #e8d9c8", borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{
        width: 80, height: 80,
        borderRadius: "50%",
        overflow: "hidden",
        border: "1px solid var(--line)",
        marginBottom: 20,
        flexShrink: 0,
        background: "var(--cream)",
      }}>
        <img src="/fx7Logo.PNG" alt="FX7" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <span className="eyebrow" style={{ marginBottom: 10 }}>A little warmth, shared</span>

      <h1 style={{
        fontSize: 38, lineHeight: 1.02,
        letterSpacing: "-0.04em", fontWeight: 500,
        fontFamily: "Inter, sans-serif",
      }}>
        FX7 Fall<br />
        <em style={{ color: "var(--clay)", fontStyle: "italic", fontWeight: 400 }}>
          Coffee House
        </em>
      </h1>

      <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
        Order something cozy. Every drink is on us.
      </p>

      <button
        onClick={() => navigate("/my-orders")}
        style={{
          marginTop: 20, border: 0, background: "none",
          color: "var(--clay)", fontSize: 11, fontWeight: 600,
          cursor: "pointer", letterSpacing: "0.02em",
        }}
      >
        Track my order →
      </button>
    </section>
  );
};

export default HolidayHeader;
