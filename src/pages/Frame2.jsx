import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import StarRating from "../components/StarRating";
import { DRINK_NAMES } from "../data/drinks";
import ConfirmDialog from "../components/ConfirmDialog";

const X = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

const Frame2 = () => {
  const navigate = useNavigate();
  const {
    submittedOrders, completedToday, pendingDonations, totalDonations,
    allCompletedOrders, outOfStockDrinks, outOfStockMilk,
    markOrderAsReady, verifyDonation, clearCompletedToday, clearTotalDonations,
    clearAllHistory, getAllReviews, toggleDrinkStock, toggleMilkStock
  } = useOrder();

  const [activeTab, setActiveTab] = useState("active");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [clearedDonationIds, setClearedDonationIds] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  useEffect(() => {
    if (activeTab === "reviews") loadReviews();
  }, [activeTab]);

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const reviews = await getAllReviews();
      setAllReviews(reviews);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const confirm = (title, message, onConfirm) =>
    setConfirmDialog({ isOpen: true, title, message, onConfirm });
  const closeConfirm = () => setConfirmDialog(d => ({ ...d, isOpen: false }));

  const tabs = [
    { key: "active",    label: `Active`,      count: submittedOrders.length },
    { key: "donations", label: `Donations`,   count: pendingDonations.length },
    { key: "history",   label: `History`,     count: allCompletedOrders.length },
    { key: "reviews",   label: `Reviews`,     count: allReviews.length },
    { key: "inventory", label: `Inventory`,   count: null },
  ];

  const emptyMsg = (msg) => (
    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--muted)", fontSize: 13 }}>{msg}</div>
  );

  return (
    <div className="page-container">
      {/* Header */}
      <header className="app-header">
        <div>
          <span className="eyebrow" style={{ marginBottom: 1 }}>Good morning, team</span>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--espresso)", letterSpacing: "-0.02em" }}>Barista dashboard</div>
        </div>
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Close dashboard"><X /></button>
      </header>

      <div className="screen dashboard-screen">
        {/* Stats row */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">In Queue</span>
            <strong className="stat-value">{submittedOrders.length}</strong>
          </div>

          <div className="stat-card">
            <span className="stat-label">Completed today</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
              <strong className="stat-value">{completedToday}</strong>
              {completedToday > 0 && (
                <button
                  onClick={() => confirm("Clear Today's Orders?", "This will archive all completed orders from today.", () => { clearCompletedToday(); closeConfirm(); })}
                  style={{ border: 0, background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 4, padding: "3px 7px", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                >Clear</button>
              )}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Total donations</span>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
              <strong className="stat-value">${totalDonations.toFixed(2)}</strong>
              {totalDonations > 0 && (
                <button
                  onClick={() => confirm("Clear Total Donations?", "This will delete all verified donation records.", () => { clearTotalDonations(); closeConfirm(); })}
                  style={{ border: 0, background: "rgba(255,255,255,0.15)", color: "white", borderRadius: 4, padding: "3px 7px", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                >Clear</button>
              )}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Out of stock</span>
            <strong className="stat-value">{outOfStockDrinks.length + outOfStockMilk.length}</strong>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={activeTab === t.key ? "active" : ""}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}{t.count !== null ? <span>{t.count}</span> : null}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 4 }}>

        {/* ── Active orders ── */}
        {activeTab === "active" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Active orders</span>
              <span className="badge badge-count">{submittedOrders.length}</span>
            </div>
            {submittedOrders.length === 0 ? emptyMsg("No active orders. Waiting for customers…") : (
              <div className="order-grid">
                {submittedOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <div className="order-number">#{order.id.slice(-6)}</div>
                        <div className="order-customer">{order.userInfo.name}</div>
                      </div>
                      <span style={{ background: "var(--cream)", borderRadius: 20, padding: "4px 10px", fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>
                        {order.time}
                      </span>
                    </div>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <div className="order-drink-name">{item.drinkName}</div>
                        <div className="order-details">{item.temperature} · {item.milkType}</div>
                        {item.specialInstructions && (
                          <div style={{ background: "var(--cream)", borderRadius: 6, padding: "6px 10px", marginTop: 4, fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>
                            Note: {item.specialInstructions}
                          </div>
                        )}
                      </div>
                    ))}

                    <div style={{ background: "var(--cream)", borderRadius: 8, padding: "10px 12px", fontSize: 11 }}>
                      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Customer</div>
                      <div style={{ fontWeight: 600, color: "var(--fg)" }}>{order.userInfo.name}</div>
                      <div style={{ color: "var(--muted)" }}>{order.userInfo.phone}</div>
                      {order.donation > 0 && (
                        <div style={{ marginTop: 4, color: "var(--clay)", fontWeight: 700 }}>Donated ${order.donation.toFixed(2)}</div>
                      )}
                    </div>

                    <button className="ready-btn" style={{ width: "100%", justifyContent: "center", padding: "10px" }} onClick={() => markOrderAsReady(order.id)}>
                      Mark ready ✓
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Donations ── */}
        {activeTab === "donations" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Pending donations</span>
              <span className="badge badge-pending">{pendingDonations.filter(o => !clearedDonationIds.includes(o.id)).length} pending</span>
            </div>
            {pendingDonations.filter(o => !clearedDonationIds.includes(o.id)).length === 0
              ? emptyMsg("No pending donations to verify.")
              : pendingDonations.filter(o => !clearedDonationIds.includes(o.id)).map(order => (
                <div key={order.id} className="card" style={{ padding: "14px 16px", flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{order.userInfo.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: 11, marginTop: 2 }}>Pledged ${order.donation.toFixed(2)} · #{order.id.slice(-6)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-success btn-small" onClick={() => confirm(
                      "Verify Donation?",
                      `Verify $${order.donation.toFixed(2)} from ${order.userInfo.name}?`,
                      async () => {
                        try {
                          await verifyDonation(order.id, order.donation, order.userInfo.name);
                          setClearedDonationIds(ids => [...ids, order.id]);
                          closeConfirm();
                          alert("Donation verified!");
                        } catch (e) {
                          console.error(e);
                          closeConfirm();
                          alert("Failed to verify. Check console.");
                        }
                      }
                    )}>✓ Verify</button>
                    <button className="btn-danger btn-small" onClick={() => confirm(
                      "Clear Donation?",
                      `Hide $${order.donation.toFixed(2)} from ${order.userInfo.name} from pending list?`,
                      () => { setClearedDonationIds(ids => [...ids, order.id]); closeConfirm(); }
                    )}>✗ Clear</button>
                  </div>
                </div>
              ))
            }
          </>
        )}

        {/* ── History ── */}
        {activeTab === "history" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Order history</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {allCompletedOrders.length > 0 && (
                  <button className="btn-danger btn-small" onClick={() => confirm(
                    "Clear All History?",
                    "This will permanently delete all completed orders.",
                    () => { clearAllHistory(); closeConfirm(); }
                  )}>Clear all</button>
                )}
                <span className="badge badge-count">{allCompletedOrders.length}</span>
              </div>
            </div>
            {allCompletedOrders.length === 0 ? emptyMsg("No order history yet.") : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allCompletedOrders.map(order => (
                  <div key={order.id} className="card" style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{order.userInfo.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: 10, marginTop: 2 }}>{order.completedAt?.toLocaleString() || "Unknown time"}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {order.donation > 0 && (
                          <span className={`badge ${order.donationVerified ? "badge-verified" : "badge-pending"}`}>
                            ${order.donation.toFixed(2)} {order.donationVerified ? "✓" : "⏳"}
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          style={{ border: 0, background: "none", color: "var(--muted)", fontSize: 11, cursor: "pointer", padding: "2px 6px" }}
                        >
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""} {expandedOrderId === order.id ? "▲" : "▼"}
                        </button>
                      </div>
                    </div>
                    {expandedOrderId === order.id && (
                      <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <div className="order-drink-name">{item.drinkName}</div>
                            <div className="order-details">{item.temperature} · {item.milkType}</div>
                            {item.specialInstructions && <div className="order-note">Note: {item.specialInstructions}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Reviews ── */}
        {activeTab === "reviews" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Customer reviews</span>
              <span className="badge badge-count">{allReviews.length}</span>
            </div>
            {reviewsLoading ? emptyMsg("Loading reviews…") : allReviews.length === 0 ? emptyMsg("No reviews yet.") : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {allReviews.map(review => (
                  <div key={review.id} className="card" style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{review.userInfo.name}</div>
                        <div style={{ color: "var(--muted)", fontSize: 10, marginTop: 2 }}>
                          {review.completedAt?.toLocaleString() || ""}
                          {review.reviewedAt ? ` · Reviewed ${review.reviewedAt.toLocaleString()}` : ""}
                        </div>
                      </div>
                      <StarRating rating={review.rating} readOnly={true} />
                    </div>

                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8, marginTop: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Order</div>
                      {review.items.map((item, idx) => (
                        <div key={idx} style={{ fontSize: 11, color: "var(--muted)" }}>
                          · {item.drinkName} ({item.temperature} · {item.milkType})
                        </div>
                      ))}
                    </div>

                    {review.reviewComment && (
                      <div style={{ background: "var(--cream)", borderRadius: 6, padding: "8px 10px", fontSize: 12, color: "var(--muted)", fontStyle: "italic", marginTop: 4 }}>
                        "{review.reviewComment}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Inventory ── */}
        {activeTab === "inventory" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="section-title">Inventory</span>
              <span style={{ color: "var(--clay)", fontSize: 10, fontWeight: 700 }}>Live</span>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Milk options</div>
              {["Whole Milk", "Oat Milk"].map(milkType => {
                const isOut = outOfStockMilk.includes(milkType);
                return (
                  <div key={milkType} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{milkType}</div>
                      <div style={{ fontSize: 10, color: isOut ? "#c85a4a" : "var(--sage)", marginTop: 2 }}>{isOut ? "Out of stock" : "In stock"}</div>
                    </div>
                    <button
                      className={`toggle ${isOut ? "" : "on"}`}
                      aria-label={`Toggle ${milkType}`}
                      onClick={async () => {
                        try { await toggleMilkStock(milkType, isOut); }
                        catch (e) { console.error(e); alert("Failed to update. Check console."); }
                      }}
                    ><span /></button>
                  </div>
                );
              })}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Drinks</div>
              {DRINK_NAMES.map(drinkName => {
                const isOut = outOfStockDrinks.includes(drinkName);
                return (
                  <div key={drinkName} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--line)" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{drinkName}</div>
                      <div style={{ fontSize: 10, color: isOut ? "#c85a4a" : "var(--sage)", marginTop: 2 }}>{isOut ? "Out of stock" : "In stock"}</div>
                    </div>
                    <button
                      className={`toggle ${isOut ? "" : "on"}`}
                      aria-label={`Toggle ${drinkName}`}
                      onClick={async () => {
                        try { await toggleDrinkStock(drinkName, isOut); }
                        catch (e) { console.error(e); alert("Failed to update. Check console."); }
                      }}
                    ><span /></button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default Frame2;
