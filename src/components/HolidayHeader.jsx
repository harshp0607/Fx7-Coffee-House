import { useOrder } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const HolidayHeader = () => {
  const { totalDonations } = useOrder();
  const navigate = useNavigate();

  return (
    <>
      {/* Hero */}
      <section style={{
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px 32px",
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
          border: "1px solid #dfe7dd", borderRadius: "50%", pointerEvents: "none",
        }} />

        {/* Season seal */}
        <div style={{
          width: 58, height: 58,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 2,
          border: "1px solid #d6b79d", borderRadius: "50%",
          color: "var(--clay)",
          fontSize: 7, lineHeight: 1.25, letterSpacing: "0.1em",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 13 }}>🍂</span>
          <span>FALL<br />2026</span>
        </div>

        <span className="eyebrow" style={{ marginBottom: 6 }}>A little warmth, shared</span>

        <h1 style={{ fontSize: 38, lineHeight: 1.02, letterSpacing: "-0.04em", fontWeight: 500 }}>
          FX7 Fall<br />
          <em style={{ color: "var(--clay)", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
            Coffee House
          </em>
        </h1>

        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 13 }}>
          Order something cozy. Every drink is on us.
        </p>
      </section>

      {/* Donation counter */}
      <div style={{ padding: "0 20px 28px" }}>
        <div style={{
          background: "var(--espresso)",
          color: "#fffaf2",
          borderRadius: 12,
          padding: "15px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            width: 32, height: 32,
            display: "grid", placeItems: "center",
            color: "#d8a37a",
            border: "1px solid #66574b",
            borderRadius: "50%",
            fontSize: 14,
            flexShrink: 0,
          }}>♥</div>
          <div>
            <span style={{ color: "#b8aea3", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, display: "block", marginBottom: 3 }}>
              Raised for Feeding America
            </span>
            <strong style={{ fontSize: 20, fontWeight: 500 }}>${totalDonations.toFixed(2)}</strong>
          </div>
          <span
            onClick={() => navigate("/my-orders")}
            style={{ marginLeft: "auto", color: "#d8a37a", fontSize: 10, lineHeight: 1.4, textAlign: "right", cursor: "pointer" }}
          >
            Track my<br />order →
          </span>
        </div>
      </div>
    </>
  );
};

export default HolidayHeader;
