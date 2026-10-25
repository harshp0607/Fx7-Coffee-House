import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

// Venmo integration preserved, not wired to UI
const openVenmo = (amount, userName) => {
  if (amount <= 0) return false;
  const venmoUsername = "harshp0607";
  const note = `FX7 Fall Coffee House - ${userName}`;
  const venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(note)}`;
  const venmoWebUrl = `https://venmo.com/${venmoUsername}?txn=pay&amount=${amount}&note=${encodeURIComponent(note)}`;
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
const User = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const ArrowRight = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M3 8.5h11M10 5l4 3.5L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Frame3 = () => {
  const navigate = useNavigate();
  const { orders, submitOrder } = useOrder();
  const [userInfo, setUserInfo] = useState({ name: "", phone: "" });

  const handleSubmitOrder = async () => {
    if (orders.length === 0) { alert("Please add items to your order first!"); return; }
    if (!userInfo.name || !userInfo.phone) { alert("Please fill in your name and phone number!"); return; }

    try {
      const submittedOrder = await submitOrder(userInfo, 0);
      navigate("/order-confirmation", { state: { orderData: submittedOrder, userInfo } });
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <main className="screen checkout-screen">
        <div className="checkout-intro">
          <span className="eyebrow">Almost there</span>
          <h1>Make it yours.</h1>
          <p>Tell us your name and we'll call you when it's ready.</p>
        </div>

        {/* Your Details */}
        <section className="form-card">
          <div className="card-title">
            <User />
            <h2>Your details</h2>
          </div>
          <div className="input-row">
            <label>
              First name
              <input
                placeholder="Alex"
                value={userInfo.name}
                onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            </label>
            <label>
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
        </section>

        {/* Your Order */}
        <section className="form-card">
          <div className="card-title">
            <ShoppingBag />
            <h2>Your order <span>{orders.length} items</span></h2>
          </div>
          {orders.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: 12 }}>No items yet. Go pick a drink!</p>
          ) : (
            orders.map((order, i) => (
              <div key={i} className="order-line">
                <div>
                  <strong>{order.drinkName}</strong>
                  <small>{order.temperature} · {order.milkType}</small>
                </div>
                <span>Free</span>
              </div>
            ))
          )}
        </section>

        {/* Total */}
        <div className="total-row">
          <span>Total today</span>
          <strong>Free</strong>
        </div>

        <button className="primary-btn bottom-cta" onClick={handleSubmitOrder}>
          Submit order <ArrowRight />
        </button>
      </main>
    </div>
  );
};

export default Frame3;
