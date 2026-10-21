import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const Check = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M5 14L11 20L23 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getEstimatedWaitTime } = useOrder();
  const [waitTime, setWaitTime] = useState(null);

  const orderData = location.state?.orderData;
  const userInfo = location.state?.userInfo;
  const donation = location.state?.donation;

  useEffect(() => {
    if (!orderData || !userInfo) { navigate("/"); return; }
    const estimatedTime = getEstimatedWaitTime(orderData.submittedAt);
    setWaitTime(estimatedTime);
    if (userInfo.phone) localStorage.setItem("fx7_user_phone", userInfo.phone);
  }, [orderData, userInfo, navigate, getEstimatedWaitTime]);

  if (!orderData || !userInfo) return null;

  const firstName = userInfo.name?.split(" ")[0] || userInfo.name;

  return (
    <div className="page-container" style={{ textAlign: "center", paddingTop: 52 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        {/* Success mark */}
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "var(--sage)",
          display: "grid", placeItems: "center",
          marginBottom: 24,
        }}>
          <Check />
        </div>

        <span className="eyebrow" style={{ marginBottom: 10 }}>You are all set</span>
        <h1 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-0.04em", marginBottom: 12 }}>
          See you soon,<br />
          <em style={{ color: "var(--clay)", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
            {firstName}.
          </em>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, maxWidth: 280, marginBottom: 28 }}>
          Your order is in. We'll text you when it's ready for pickup.
        </p>

        {/* Wait card */}
        <div style={{
          background: "var(--cream)",
          borderRadius: 12,
          padding: "20px 24px",
          width: "100%",
          marginBottom: 12,
          textAlign: "center",
        }}>
          <span style={{ display: "block", color: "var(--muted)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
            Estimated wait
          </span>
          <strong style={{ display: "block", fontSize: 36, fontWeight: 500, letterSpacing: "-0.03em", margin: "4px 0 6px" }}>
            {waitTime ? waitTime.displayText : "~10 min"}
          </strong>
          <span style={{ color: "var(--muted)", fontSize: 10, letterSpacing: "0.05em" }}>
            Order #{orderData.orderNumber || "—"}
          </span>
        </div>

        {/* Order summary */}
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          padding: "14px 0 20px",
          borderBottom: "1px solid var(--line)",
          marginBottom: 20,
          fontSize: 11,
          textAlign: "left",
        }}>
          <span>{orderData.items?.length} drink{orderData.items?.length !== 1 ? "s" : ""}</span>
          <span style={{ color: "var(--muted)", textAlign: "right", maxWidth: 200 }}>
            {orderData.items?.map(i => i.drinkName).join(" · ")}
          </span>
        </div>

        {donation > 0 && (
          <div style={{
            width: "100%",
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            fontSize: 12,
          }}>
            <span style={{ color: "var(--muted)" }}>Donation to Feeding America</span>
            <strong>${donation.toFixed(2)}</strong>
          </div>
        )}

        <button className="btn-primary" style={{ marginBottom: 8 }} onClick={() => navigate("/my-orders", { state: { phoneNumber: userInfo.phone } })}>
          Track my order →
        </button>
        <button className="btn-secondary" onClick={() => navigate("/")}>
          Back to menu
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
