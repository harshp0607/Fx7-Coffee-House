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
const Star = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
    <path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9 3 11.5l1.5-4L1 5h4.5z"/>
  </svg>
);

const StatusBadge = ({ status }) => {
  const key = status?.toLowerCase().includes("ready") ? "ready-for-pickup"
    : status?.toLowerCase().includes("complet") ? "completed"
    : status?.toLowerCase().includes("archiv") ? "archived"
    : "pending";
  return <span className={`status status-${key}`}>{status}</span>;
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
        <div className="logo-mark"><span>FX7</span></div>
        <div className="header-spacer" />
      </header>

      <main className="screen orders-screen">
        <div className="page-heading">
          <span className="eyebrow">Your coffee trail</span>
          <h1>My orders</h1>
          <p>Look up your order with the phone number you used.</p>
        </div>

        <div className="search-input">
          <Search />
          <input
            placeholder="Phone number"
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? "..." : "Look up"}
          </button>
        </div>

        {/* Active orders */}
        {hasSearched && activeOrders.length > 0 && (
          <div className="orders-list">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--espresso)" }}>In queue</span>
              <span className="status status-pending">{activeOrders.length} active</span>
            </div>
            {activeOrders.map(order => {
              const ts = order.submittedAt?.toDate ? order.submittedAt.toDate() : new Date(order.submittedAt);
              const wait = getEstimatedWaitTime(ts);
              return (
                <article key={order.id} className="order-card">
                  <div className="order-card-top">
                    <div>
                      <span className="order-number">Submitted {order.timestamp?.toLocaleString() || "recently"}</span>
                      <h3>{order.userInfo.name}</h3>
                    </div>
                    <StatusBadge status="Pending" />
                  </div>
                  <div style={{ background: "var(--cream)", borderRadius: 8, padding: "12px 14px", margin: "8px 0" }}>
                    <span style={{ color: "var(--muted)", fontSize: 10, display: "block", marginBottom: 3 }}>Estimated wait</span>
                    <strong style={{ fontSize: 20, fontWeight: 500 }}>{wait.displayText}</strong>
                    <span style={{ color: "var(--muted)", fontSize: 10, display: "block", marginTop: 4 }}>
                      {wait.queueLength > 0 ? `${wait.queueLength} order${wait.queueLength > 1 ? "s" : ""} ahead` : "Being prepared now"}
                    </span>
                  </div>
                  <p>{order.items.map(i => i.drinkName).join(" · ")}</p>
                  <div className="order-card-bottom">
                    <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Completed orders */}
        {hasSearched && (
          <div className="orders-list">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--espresso)" }}>Completed</span>
              <span className="status status-completed">{orders.length}</span>
            </div>

            {orders.length === 0 && activeOrders.length === 0 ? (
              <article className="order-card" style={{ textAlign: "center", padding: "32px 20px" }}>
                <p>No orders found for this number.</p>
              </article>
            ) : orders.length === 0 ? (
              <article className="order-card" style={{ textAlign: "center", padding: "24px 20px" }}>
                <p>No completed orders yet.</p>
              </article>
            ) : orders.map(order => (
              <article key={order.id} className="order-card">
                <div className="order-card-top">
                  <div>
                    <span className="order-number">{order.completedAt?.toLocaleString() || "Unknown time"}</span>
                    <h3>{order.userInfo.name}</h3>
                  </div>
                  <StatusBadge status={order.archived ? "Archived" : "Completed"} />
                </div>

                <p>{order.items.map(i => i.drinkName).join(" · ")}</p>

                {/* Review */}
                <div className="order-card-bottom" style={{ alignItems: "flex-start", flexDirection: "column", gap: 10 }}>
                  {reviewingOrderId === order.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>Your rating</span>
                        <StarRating rating={order.rating} readOnly />
                      </div>
                      {order.reviewComment && (
                        <p style={{ fontSize: 11, fontStyle: "italic", background: "var(--cream)", padding: "8px 10px", borderRadius: 6 }}>
                          {order.reviewComment}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                      <span style={{ fontSize: 11 }}>No review yet</span>
                      <button
                        className="rate-btn"
                        onClick={() => { setReviewingOrderId(order.id); setReviewData({ rating: order.rating || 0, comment: order.reviewComment || "" }); }}
                      >
                        <Star /> Rate order
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
