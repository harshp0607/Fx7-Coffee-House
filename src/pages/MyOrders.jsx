import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import StarRating from "../components/StarRating";

const Search = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="7.5" cy="7.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const StatusBadge = ({ status }) => {
  const styles = {
    "ready": { background: "#e6eee5", color: "#5d745f" },
    "pending": { background: "#f5e9dd", color: "#a45f3d" },
    "completed": { background: "#ece9e4", color: "#827b72" },
  };
  const key = status?.toLowerCase().includes("ready") ? "ready"
    : status?.toLowerCase().includes("complet") ? "completed"
    : "pending";
  return (
    <span className="badge" style={styles[key]}>{status}</span>
  );
};

const MyOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getOrdersByPhone, getActiveOrdersByPhone, submitReview, getEstimatedWaitTime } = useOrder();

  const initialPhone = location.state?.phoneNumber || localStorage.getItem("fx7_user_phone") || "";
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [orders, setOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });

  useEffect(() => {
    if (initialPhone && !hasSearched) handleSearch();
  }, [initialPhone]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = async () => {
    if (!phoneNumber.trim()) { alert("Please enter your phone number"); return; }
    setLoading(true);
    setHasSearched(true);
    try {
      const userOrders = await getOrdersByPhone(phoneNumber);
      const userActiveOrders = getActiveOrdersByPhone(phoneNumber);
      setOrders(userOrders);
      setActiveOrders(userActiveOrders);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (orderId) => {
    if (reviewData.rating === 0) { alert("Please select a star rating"); return; }
    try {
      await submitReview(orderId, reviewData.rating, reviewData.comment);
      const userOrders = await getOrdersByPhone(phoneNumber);
      setOrders(userOrders);
      setReviewingOrderId(null);
      setReviewData({ rating: 0, comment: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", color: "var(--espresso)" }}>FX7</span>
        <div style={{ width: 34 }} />
      </header>

      <div style={{ padding: "24px 20px 48px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Page heading */}
        <div>
          <span className="eyebrow" style={{ marginBottom: 6 }}>Your coffee trail</span>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.04em", margin: "0 0 8px" }}>My orders</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Look up your order with the phone number you used.</p>
        </div>

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "var(--card)", border: "1px solid var(--line)",
          borderRadius: 8, padding: "5px 5px 5px 12px",
        }}>
          <span style={{ color: "var(--muted)" }}><Search /></span>
          <input
            style={{ border: 0, background: "transparent", padding: "8px 0", fontSize: 13, flex: 1, outline: "none" }}
            placeholder="Phone number"
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              border: 0, background: "var(--cream)", color: "var(--espresso)",
              borderRadius: 5, padding: "9px 12px", fontSize: 11, fontWeight: 700,
            }}
          >{loading ? "..." : "Look up"}</button>
        </div>

        {/* Active orders */}
        {hasSearched && activeOrders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">In queue</span>
              <span className="badge badge-pending">{activeOrders.length} active</span>
            </div>
            {activeOrders.map(order => {
              const ts = order.submittedAt?.toDate ? order.submittedAt.toDate() : new Date(order.submittedAt);
              const wait = getEstimatedWaitTime(ts);
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <div className="order-customer">{order.userInfo.name}</div>
                      <div className="order-number">Submitted {order.timestamp?.toLocaleString() || "recently"}</div>
                    </div>
                    <StatusBadge status="Pending" />
                  </div>
                  <div style={{ background: "var(--cream)", borderRadius: 8, padding: "12px 14px" }}>
                    <span style={{ color: "var(--muted)", fontSize: 10, display: "block", marginBottom: 3 }}>Estimated wait</span>
                    <strong style={{ fontSize: 20, fontWeight: 500 }}>{wait.displayText}</strong>
                    <span style={{ color: "var(--muted)", fontSize: 10, display: "block", marginTop: 4 }}>
                      {wait.queueLength > 0 ? `${wait.queueLength} order${wait.queueLength > 1 ? "s" : ""} ahead` : "Being prepared now"}
                    </span>
                  </div>
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item">
                      <div className="order-drink-name">{item.drinkName}</div>
                      <div className="order-details">{item.temperature} · {item.milkType}</div>
                      {item.specialInstructions && <div className="order-note">Note: {item.specialInstructions}</div>}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Completed orders */}
        {hasSearched && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Completed</span>
              <span className="badge badge-count">{orders.length}</span>
            </div>

            {orders.length === 0 && activeOrders.length === 0 ? (
              <div className="order-card" style={{ textAlign: "center", padding: "32px 20px" }}>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No orders found for this number.</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="order-card" style={{ textAlign: "center", padding: "24px 20px" }}>
                <p style={{ color: "var(--muted)", fontSize: 13 }}>No completed orders yet.</p>
              </div>
            ) : orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div>
                    <div className="order-customer">{order.userInfo.name}</div>
                    <div className="order-number">{order.completedAt?.toLocaleString() || "Unknown time"}</div>
                  </div>
                  <StatusBadge status={order.archived ? "Archived" : "Completed"} />
                </div>

                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <div className="order-drink-name">{item.drinkName}</div>
                    <div className="order-details">{item.temperature} · {item.milkType}</div>
                    {item.specialInstructions && <div className="order-note">Note: {item.specialInstructions}</div>}
                  </div>
                ))}

                {/* Review */}
                <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                  {reviewingOrderId === order.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <label style={{ fontSize: 11, fontWeight: 700 }}>Your rating</label>
                      <StarRating rating={reviewData.rating} onRatingChange={r => setReviewData({ ...reviewData, rating: r })} />
                      <textarea
                        placeholder="Tell us about your experience..."
                        rows={2}
                        value={reviewData.comment}
                        onChange={e => setReviewData({ ...reviewData, comment: e.target.value })}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn-success btn-small" style={{ flex: 1 }} onClick={() => handleSubmitReview(order.id)}>Submit</button>
                        <button className="btn-secondary btn-small" onClick={() => setReviewingOrderId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : order.rating ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>Your rating</span>
                        <StarRating rating={order.rating} readOnly />
                      </div>
                      {order.reviewComment && (
                        <p style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic", background: "var(--cream)", padding: "8px 10px", borderRadius: 6 }}>
                          {order.reviewComment}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "var(--muted)" }}>No review yet</span>
                      <button
                        className="btn-small"
                        style={{ border: 0, background: "var(--cream)", color: "var(--espresso)", borderRadius: 5, padding: "7px 10px", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}
                        onClick={() => { setReviewingOrderId(order.id); setReviewData({ rating: order.rating || 0, comment: order.reviewComment || "" }); }}
                      >
                        ★ Rate order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
