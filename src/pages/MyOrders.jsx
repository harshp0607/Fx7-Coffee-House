import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import StarRating from "../components/StarRating";

const MyOrders = () => {
  const navigate = useNavigate();
  const { getOrdersByPhone, submitReview } = useOrder();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "" });

  const inputClass = "w-full rounded-xl bg-gradient-to-r from-cream-100 to-sage-50 border-2 border-sage-300 py-4 px-5 text-lg text-pine-700 font-medium placeholder:text-cocoa-400 outline-none focus:border-pine-500 focus:bg-white focus:shadow-lg transition-all";

  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const userOrders = await getOrdersByPhone(phoneNumber);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = (orderId) => {
    setReviewingOrderId(orderId);
    const order = orders.find((o) => o.id === orderId);
    setReviewData({
      rating: order?.rating || 0,
      comment: order?.reviewComment || "",
    });
  };

  const handleCancelReview = () => {
    setReviewingOrderId(null);
    setReviewData({ rating: 0, comment: "" });
  };

  const handleSubmitReview = async (orderId) => {
    if (reviewData.rating === 0) {
      alert("Please select a star rating");
      return;
    }

    try {
      await submitReview(orderId, reviewData.rating, reviewData.comment);
      alert("Review submitted successfully!");

      // Refresh orders
      const userOrders = await getOrdersByPhone(phoneNumber);
      setOrders(userOrders);

      setReviewingOrderId(null);
      setReviewData({ rating: 0, comment: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="page-container items-center">
      <div className="w-full max-w-[900px] flex flex-col">
        <div className="page-header">
          <h1 className="text-3xl font-black tracking-tight text-pine-800">My Orders</h1>
        </div>

        <div className="content-section">
          {/* Phone Number Input */}
          <div className="card border-sage-200 p-7 gap-6">
            <h2 className="text-2xl text-pine-700 font-bold drop-shadow-sm">Find Your Orders</h2>
            <div className="flex flex-col gap-3">
              <label className="font-bold text-cocoa-600">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                className={inputClass}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary btn-large w-full text-xl shadow-2xl border-2 border-pine-800 gap-3 hover:scale-[1.02]"
            >
              <span className="font-black tracking-wide">
                {loading ? "Searching..." : "Find My Orders"}
              </span>
              <span className="text-2xl">→</span>
            </button>
          </div>

          {/* Orders List */}
          {hasSearched && (
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center justify-between gap-5 px-2">
                <b className="section-title">Your Order History</b>
                <div className="badge badge-count px-4 py-2">
                  <b>{orders.length} Orders</b>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="card border-sage-200 p-10 text-center">
                  <p className="text-lg text-cocoa-500 font-semibold">
                    No orders found for this phone number.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card border-sage-200 p-6 gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg text-pine-700">{order.userInfo.name}</div>
                          <div className="text-sm text-cocoa-400">
                            {order.completedAt?.toLocaleString() || "Unknown time"}
                          </div>
                        </div>
                        {order.archived && (
                          <div className="badge bg-gray-500 text-white px-3 py-1 text-xs">
                            Archived
                          </div>
                        )}
                      </div>

                      {/* Order Items */}
                      <div className="border-t border-sage-100 pt-3 flex flex-col gap-2">
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

                      {/* Review Section */}
                      {reviewingOrderId === order.id ? (
                        <div className="border-t border-sage-200 pt-4 flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="font-bold text-cocoa-600">Your Rating</label>
                            <StarRating
                              rating={reviewData.rating}
                              onRatingChange={(rating) => setReviewData({ ...reviewData, rating })}
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="font-bold text-cocoa-600">Comments (Optional)</label>
                            <textarea
                              value={reviewData.comment}
                              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                              placeholder="Tell us about your experience..."
                              className={`${inputClass} min-h-[100px] resize-none`}
                            />
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleSubmitReview(order.id)}
                              className="btn-primary btn-medium flex-1"
                            >
                              Submit Review
                            </button>
                            <button
                              onClick={handleCancelReview}
                              className="btn-secondary btn-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-t border-sage-200 pt-4 flex items-center justify-between">
                          {order.rating ? (
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-cocoa-600">Your Rating:</span>
                                <StarRating rating={order.rating} readOnly={true} />
                              </div>
                              {order.reviewComment && (
                                <div className="rounded-lg bg-sage-50 border border-sage-200 p-3">
                                  <p className="text-sm text-cocoa-600 italic">{order.reviewComment}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <span className="text-cocoa-500 font-medium">No review yet</span>
                              <button
                                onClick={() => handleStartReview(order.id)}
                                className="btn-primary btn-small"
                              >
                                Leave a Review
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
