import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

// Venmo integration preserved — not wired to UI
const openVenmo = (donationAmount, userName) => {
  if (donationAmount <= 0) return false;
  const venmoUsername = "harshp0607";
  const note = `Donation to Feeding America from ${userName} - FX7 Fall Coffee House`;
  const venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${donationAmount}&note=${encodeURIComponent(note)}`;
  const venmoWebUrl = `https://venmo.com/${venmoUsername}?txn=pay&amount=${donationAmount}&note=${encodeURIComponent(note)}`;
  window.location.href = venmoUrl;
  setTimeout(() => window.open(venmoWebUrl, "_blank"), 1500);
  return true;
};

const ShoppingBag = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M3 4h11l-1.5 8H4.5L3 4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M6 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const Heart = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="currentColor">
    <path d="M8.5 14S3 10.5 3 6.5A3.5 3.5 0 018.5 5 3.5 3.5 0 0114 6.5C14 10.5 8.5 14 8.5 14Z"/>
  </svg>
);
const User = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const Frame3 = () => {
  const navigate = useNavigate();
  const { orders, submitOrder } = useOrder();
  const [selectedDonation, setSelectedDonation] = useState("$5");
  const [customAmount, setCustomAmount] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });
  const [smsConsent, setSmsConsent] = useState(true);

  const getDonationAmount = () => {
    if (selectedDonation === null) return 0;
    if (selectedDonation === "Custom") return parseFloat(customAmount) || 0;
    return parseFloat(selectedDonation.replace("$", ""));
  };

  const handleSubmitOrder = async () => {
    if (orders.length === 0) { alert("Please add items to your order first!"); return; }
    if (!userInfo.name || !userInfo.phone) { alert("Please fill in your name and phone number!"); return; }

    try {
      const submittedOrder = await submitOrder(userInfo, getDonationAmount());
      navigate("/order-confirmation", { state: { orderData: submittedOrder, userInfo, donation: getDonationAmount() } });
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  const donationOptions = ["$5", "$25", "Custom", "Skip"];

  return (
    <div className="page-container">
      {/* Intro */}
      <div style={{ padding: "24px 20px 20px" }}>
        <span className="eyebrow" style={{ marginBottom: 6 }}>Almost there</span>
        <h1 style={{ fontSize: 34, fontWeight: 500, letterSpacing: "-0.04em", margin: "0 0 10px" }}>Make it yours.</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
          Your drinks are complimentary. A donation is optional and always appreciated.
        </p>
      </div>

      <div style={{ padding: "0 20px 40px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Your Details */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--clay)" }}><User /></span>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>Your details</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 8 }}>
            <label style={{ color: "var(--muted)", fontSize: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              First name
              <input
                placeholder="Alex"
                value={userInfo.name}
                onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </label>
            <label style={{ color: "var(--muted)", fontSize: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              Phone number
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={userInfo.phone}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, "");
                  setUserInfo({ ...userInfo, phone: v });
                }}
                onBlur={e => {
                  let v = e.target.value.replace(/\D/g, "");
                  if (v.length === 10) v = "+1" + v;
                  else if (v.length === 11 && v.startsWith("1")) v = "+" + v;
                  else if (v.length > 0 && !v.startsWith("+")) v = "+1" + v;
                  setUserInfo({ ...userInfo, phone: v });
                }}
              />
            </label>
          </div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--muted)", fontSize: 10, marginTop: 4 }}>
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={e => setSmsConsent(e.target.checked)}
              style={{ width: 14, accentColor: "var(--clay)", flexShrink: 0 }}
            />
            Text me when my order is ready
          </label>
        </div>

        {/* Your Order */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--clay)" }}><ShoppingBag /></span>
            <h2 style={{ fontSize: 14, fontWeight: 700 }}>
              Your order{" "}
              <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 400 }}>{orders.length} items</span>
            </h2>
          </div>
          {orders.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 12, paddingTop: 4 }}>No items yet — go pick a drink!</p>
          ) : (
            orders.map((order, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid var(--line)" }}>
                <div>
                  <strong style={{ display: "block", fontSize: 12 }}>{order.drinkName}</strong>
                  <small style={{ color: "var(--muted)", fontSize: 10 }}>{order.temperature} · {order.milkType}</small>
                </div>
                <span style={{ fontSize: 11, color: "var(--sage)" }}>Free</span>
              </div>
            ))
          )}
          <div className="season-banner" style={{ marginTop: 4 }}>
            🍂 Complimentary season — enjoy!
          </div>
        </div>

        {/* Give a little back */}
        <div className="card" style={{ padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color: "var(--clay)" }}><Heart /></span>
            <h2 style={{ fontSize: 14, fontWeight: 700 }}>Give a little back</h2>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45, margin: "-4px 0 14px" }}>
            Help us support neighbors facing hunger through Feeding America.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
            {donationOptions.map(x => (
              <button
                key={x}
                onClick={() => { setSelectedDonation(x === "Skip" ? null : x); }}
                style={{
                  border: `1px solid ${(selectedDonation === x || (x === "Skip" && selectedDonation === null)) ? "var(--espresso)" : "var(--line)"}`,
                  background: (selectedDonation === x || (x === "Skip" && selectedDonation === null)) ? "var(--espresso)" : "transparent",
                  color: (selectedDonation === x || (x === "Skip" && selectedDonation === null)) ? "white" : "var(--muted)",
                  borderRadius: 6,
                  padding: "9px 3px",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >{x}</button>
            ))}
          </div>
          {selectedDonation === "Custom" && (
            <input
              type="number"
              placeholder="Enter amount"
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}
        </div>

        {/* Total */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 4px 4px" }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Total today</span>
          <strong style={{ fontSize: 20, fontWeight: 500 }}>
            {getDonationAmount() > 0 ? `$${getDonationAmount().toFixed(2)}` : "Free"}
          </strong>
        </div>

        <button className="btn-primary" onClick={handleSubmitOrder}>
          Submit order →
        </button>
      </div>
    </div>
  );
};

export default Frame3;
