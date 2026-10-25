import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Check = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M5 14L11 20L23 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M3 8.5h11M10 5l4 3.5L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const orderData = location.state?.orderData;
  const userInfo = location.state?.userInfo;

  useEffect(() => {
    if (!orderData || !userInfo) { navigate("/"); return; }
    if (userInfo.phone) localStorage.setItem("fx7_user_phone", userInfo.phone);
  }, [orderData, userInfo, navigate]);

  if (!orderData || !userInfo) return null;

  const firstName = userInfo.name?.split(" ")[0] || userInfo.name;

  return (
    <div className="page-container">
      <main className="screen confirmation-screen">
        <div className="success-mark"><Check /></div>

        <span className="eyebrow">You are all set</span>
        <h1>See you soon,<br /><em>{firstName}.</em></h1>
        <p className="confirmation-copy">
          We'll call your name when it's ready. No rush.
        </p>

        <div className="wait-card">
          <span>While you wait</span>
          <strong style={{ fontSize: 18, lineHeight: 1.35 }}>We're in no rush.</strong>
          <span style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.5, display: "block", marginTop: 4 }}>
            Your drink may take a while. But that's the whole point, isn't it? To slow life down together.
          </span>
        </div>

        <div className="summary-mini">
          <span>{orderData.items?.length} drink{orderData.items?.length !== 1 ? "s" : ""}</span>
          <span>{orderData.items?.map(i => i.drinkName).join(" · ")}</span>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/my-orders", { state: { phoneNumber: userInfo.phone } })}
        >
          Track my order <ArrowRight />
        </button>
        <button className="secondary-btn" onClick={() => navigate("/")}>
          Back to menu
        </button>
      </main>
    </div>
  );
};

export default OrderConfirmation;
