import { useNavigate } from "react-router-dom";
import HolidayHeader from "../components/HolidayHeader";
import DrinksGrid from "../components/DrinksGrid";
import { useOrder } from "../context/OrderContext";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M6 4l4 3.5L6 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Frame = () => {
  const navigate = useNavigate();
  const { orderCount } = useOrder();

  return (
    <div className="page-container">
      <HolidayHeader />

      <main className="screen menu-screen">
        {/* Fall Coffees */}
        <section className="menu-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow" style={{ marginBottom: 5 }}>Made for the season</span>
              <h2>Fall Coffees</h2>
            </div>
            <span className="count">2 drinks</span>
          </div>
          <DrinksGrid category="coffee" />
        </section>

        {/* Other Fall Favorites */}
        <section className="menu-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow" style={{ marginBottom: 5 }}>Beyond the espresso</span>
              <h2>Other Fall Favorites</h2>
            </div>
            <span className="count">2 drinks</span>
          </div>
          <DrinksGrid category="other" />
        </section>

        {/* View Order CTA */}
        <button
          onClick={() => navigate("/checkout")}
          className="primary-btn"
          style={{ position: "relative", marginBottom: 16 }}
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

        {/* Staff link */}
        <button className="staff-link" onClick={() => navigate("/dashboard")}>
          Barista view <ChevronRight />
        </button>
      </main>
    </div>
  );
};

export default Frame;
