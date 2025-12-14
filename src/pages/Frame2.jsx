import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import StarRating from "../components/StarRating";

const Frame2 = () => {
  const navigate = useNavigate();
  const { submittedOrders, completedToday, pendingDonations, totalDonations, allCompletedOrders, markOrderAsReady, verifyDonation, clearCompletedToday, clearTotalDonations, clearAllHistory, getAllReviews } = useOrder();
  const [activeTab, setActiveTab] = useState("active");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "reviews") {
      loadReviews();
    }
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

  return (
    <div className="page-container items-center">
      <div className="w-full max-w-[1600px] flex flex-col">
      <div className="page-header">
        <h1 className="text-3xl font-black tracking-tight text-pine-800">Barista Dashboard</h1>

        {/* Stats Cards */}
        <div className="flex items-start gap-4 text-3xl">
          <div className="stat-card bg-sage-100 border-sage-300">
            <b className="text-pine-800">{submittedOrders.length}</b>
            <div className="text-sm font-bold text-pine-600">In Queue</div>
          </div>

          <div className="stat-card bg-pine-100 border-pine-300">
            <div className="flex items-center justify-between w-full">
              <b className="text-pine-800">{completedToday}</b>
              {completedToday > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Clear today's completed orders count? This will delete all completed orders from today.")) {
                      clearCompletedToday();
                    }
                  }}
                  className="btn-primary btn-small"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-sm font-bold text-pine-600">Completed Today</div>
          </div>

          <div className="stat-card bg-green-100 border-green-300">
            <div className="flex items-center justify-between w-full">
              <b className="text-green-800">${totalDonations.toFixed(2)}</b>
              {totalDonations > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm("Clear total donations? This will delete all verified donation records.")) {
                      clearTotalDonations();
                    }
                  }}
                  className="btn-success btn-small"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="text-sm font-bold text-green-700">Total Donations</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-container">
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 ${activeTab === "active" ? "tab-active" : "tab-inactive"} tab`}
          >
            Active ({submittedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`flex-1 tab ${activeTab === "donations" ? "bg-green-600 text-white shadow-md" : "bg-white/50 text-green-600 hover:bg-white/80"}`}
          >
            Donations ({pendingDonations.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 tab ${activeTab === "history" ? "bg-blue-600 text-white shadow-md" : "bg-white/50 text-blue-600 hover:bg-white/80"}`}
          >
            History ({allCompletedOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 tab ${activeTab === "reviews" ? "bg-purple-600 text-white shadow-md" : "bg-white/50 text-purple-600 hover:bg-white/80"}`}
          >
            Reviews ({allReviews.length})
          </button>
        </div>
      </div>

      <div className="content-section text-lg text-pine-800">
        {/* Active Orders Tab */}
        {activeTab === "active" && (
          <>
            <div className="flex items-center justify-between gap-5 px-2 w-full">
              <b className="section-title">Active Orders</b>
              <div className="badge badge-count px-4 py-2">
                <b>{submittedOrders.length} Orders</b>
              </div>
            </div>

            <div className="order-grid w-full text-base">
              {submittedOrders.length === 0 ? (
                <div className="col-span-full flex items-center justify-center py-16 text-lg text-cocoa-500 font-semibold">
                  No active orders. Orders will appear here when customers submit them.
                </div>
              ) : (
                submittedOrders.map((order) => (
                  <div key={order.id} className="order-card border-sage-200 hover:shadow-2xl hover:border-pine-300">
                    <div className="order-header">
                      <b className="order-customer truncate">Order #{order.id.slice(-6)}</b>
                      <div className="rounded-full bg-gradient-to-br from-cream-200 to-sage-100 border-2 border-sage-200 flex items-center py-1.5 px-3 text-xs text-cocoa-600 shadow-sm">
                        <span className="font-bold">{order.time}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-base">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <b className="order-drink-name text-base">{item.drinkName}</b>
                          <div className="order-details">{item.temperature} · {item.milkType}</div>
                          {item.specialInstructions && (
                            <div className="rounded-lg bg-gradient-to-br from-sage-100 to-pine-100 border-2 border-sage-300 flex flex-col p-3 gap-1.5 text-xs text-pine-700 mt-1 shadow-sm">
                              <b className="text-sm">Special Instructions</b>
                              <div className="text-sm text-cocoa-600 font-medium">{item.specialInstructions}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-cream-100 to-sage-50 border-2 border-sage-200 flex flex-col p-3.5 gap-1.5 text-xs shadow-md">
                      <b className="text-sm text-pine-700">Customer Info</b>
                      <div className="text-base text-cocoa-600 font-bold">{order.userInfo.name}</div>
                      <div className="text-sm text-cocoa-500 font-semibold">{order.userInfo.phone}</div>
                      {order.donation > 0 && (
                        <div className="text-base text-sage-700 font-black mt-1">
                          ✦ Donated: ${order.donation.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => markOrderAsReady(order.id)}
                      className="btn-primary btn-medium w-full gap-2 hover:scale-[1.02]"
                    >
                      <span className="flex-1">Mark Ready</span>
                      <span className="text-base">✓</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Pending Donations Tab */}
        {activeTab === "donations" && (
          <>
            <div className="flex items-center justify-between gap-5 px-2 w-full">
              <b className="section-title">Pending Donations</b>
              <div className="badge bg-green-600 text-white px-4 py-2">
                <b>{pendingDonations.length} Pending</b>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full text-base">
              {pendingDonations.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-lg text-cocoa-500 font-semibold">
                  No pending donations to verify.
                </div>
              ) : (
                pendingDonations.map((order) => (
                  <div key={order.id} className="card border-green-200 flex items-center justify-between p-5 gap-4 hover:shadow-2xl">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-pine-700">{order.userInfo.name}</div>
                      <div className="text-sm text-cocoa-500 font-medium mt-1">
                        Pledged: ${order.donation.toFixed(2)}
                      </div>
                      <div className="text-xs text-cocoa-400 mt-1">Order #{order.id.slice(-6)}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Verify $${order.donation.toFixed(2)} donation from ${order.userInfo.name}?`)) {
                          verifyDonation(order.id, order.donation, order.userInfo.name);
                        }
                      }}
                      className="btn-success btn-medium hover:shadow-lg"
                    >
                      ✓ Verify
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Order History Tab */}
        {activeTab === "history" && (
          <>
            <div className="flex items-center justify-between gap-5 px-2 w-full">
              <b className="section-title">Order History</b>
              <div className="flex items-center gap-3">
                {allCompletedOrders.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm("Clear all order history? This will delete all completed orders permanently.")) {
                        clearAllHistory();
                      }
                    }}
                    className="btn-danger btn-small"
                  >
                    Clear All
                  </button>
                )}
                <div className="badge bg-blue-600 text-white px-4 py-2">
                  <b>{allCompletedOrders.length} Total</b>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full text-sm">
              {allCompletedOrders.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-lg text-cocoa-500 font-semibold">
                  No order history yet.
                </div>
              ) : (
                allCompletedOrders.map((order) => (
                  <div key={order.id} className="card border-blue-200 flex flex-col p-4 gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-bold text-base text-pine-700">{order.userInfo.name}</div>
                        <div className="text-xs text-cocoa-400 mt-0.5">
                          {order.completedAt?.toLocaleString() || "Unknown time"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-all"
                        >
                          {order.items.length} item{order.items.length !== 1 ? "s" : ""} {expandedOrderId === order.id ? "▲" : "▼"}
                        </button>
                        {order.donation > 0 && (
                          <div className={`badge ${order.donationVerified ? "badge-verified" : "badge-pending"}`}>
                            ${order.donation.toFixed(2)} {order.donationVerified ? "✓" : "⏳"}
                          </div>
                        )}
                      </div>
                    </div>

                    {expandedOrderId === order.id && (
                      <div className="border-t border-blue-100 pt-3 flex flex-col gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="order-item">
                            <div className="order-drink-name">{item.drinkName}</div>
                            <div className="order-details">{item.temperature} · {item.milkType}</div>
                            {item.specialInstructions && (
                              <div className="order-note mt-0.5">Note: {item.specialInstructions}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <>
            <div className="flex items-center justify-between gap-5 px-2 w-full">
              <b className="section-title">Customer Reviews</b>
              <div className="badge bg-purple-600 text-white px-4 py-2">
                <b>{allReviews.length} Reviews</b>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="flex items-center justify-center py-16 text-lg text-cocoa-500 font-semibold">
                Loading reviews...
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full text-sm">
                {allReviews.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-lg text-cocoa-500 font-semibold">
                    No reviews yet.
                  </div>
                ) : (
                  allReviews.map((review) => (
                    <div key={review.id} className="card border-purple-200 flex flex-col p-5 gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-bold text-base text-pine-700">{review.userInfo.name}</div>
                          <div className="text-xs text-cocoa-400 mt-0.5">
                            Order: {review.completedAt?.toLocaleString() || "Unknown time"}
                          </div>
                          {review.reviewedAt && (
                            <div className="text-xs text-cocoa-400">
                              Reviewed: {review.reviewedAt?.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StarRating rating={review.rating} readOnly={true} />
                          {review.archived && (
                            <div className="badge bg-gray-500 text-white px-2 py-1 text-xs">
                              Archived
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-purple-100 pt-2 flex flex-col gap-1.5">
                        <div className="font-semibold text-xs text-cocoa-600">Order Items:</div>
                        {review.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-cocoa-500">
                            • {item.drinkName} ({item.temperature} · {item.milkType})
                          </div>
                        ))}
                      </div>

                      {/* Review Comment */}
                      {review.reviewComment && (
                        <div className="rounded-lg bg-purple-50 border border-purple-200 p-3">
                          <div className="font-semibold text-xs text-purple-700 mb-1">Comment:</div>
                          <p className="text-sm text-cocoa-600 italic">{review.reviewComment}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default Frame2;
