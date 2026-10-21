import { useNavigate } from "react-router-dom";
import HolidayHeader from "../components/HolidayHeader";
import DrinksGrid from "../components/DrinksGrid";
import { useOrder } from "../context/OrderContext";

const SectionHeading = ({ eyebrow, title, count }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 13 }}>
    <div>
      <span className="eyebrow" style={{ marginBottom: 5 }}>{eyebrow}</span>
      <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.04em" }}>{title}</h2>
    </div>
    <span style={{ color: "var(--muted)", fontSize: 10 }}>{count} drinks</span>
  </div>
);

const Frame = () => {
  const navigate = useNavigate();
  const { orderCount } = useOrder();

  return (
    <div className="page-container">
      <HolidayHeader />

      {/* Fall Coffees */}
      <section style={{ padding: "0 20px 32px" }}>
        <SectionHeading eyebrow="Made for the season" title="Fall Coffees" count={4} />
        <DrinksGrid category="coffee" />
      </section>

      {/* Other Fall Favorites */}
      <section style={{ padding: "0 20px 32px" }}>
        <SectionHeading eyebrow="Beyond the espresso" title="Other Fall Favorites" count={2} />
        <DrinksGrid category="other" />
      </section>

      {/* View Order CTA */}
      <div style={{ padding: "0 20px 40px" }}>
        <button
          onClick={() => navigate("/checkout")}
          className="btn-primary"
          style={{ position: "relative" }}
        >
          View Order
          {orderCount > 0 && (
            <span style={{
              position: "absolute", right: 16,
              background: "var(--clay)", color: "white",
              borderRadius: "50%", width: 20, height: 20,
              fontSize: 10, fontWeight: 800,
              display: "grid", placeItems: "center",
            }}>{orderCount}</span>
          )}
        </button>
      </div>

      {/* Staff link */}
      <div style={{ textAlign: "center", paddingBottom: 32 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ border: 0, background: "none", color: "var(--muted)", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          Barista view →
        </button>
      </div>
    </div>
  );
};

export default Frame;
