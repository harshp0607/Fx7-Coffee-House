import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getEstimatedWaitTime } = useOrder();
  const [waitTime, setWaitTime] = useState(null);

  // Get order data from navigation state
  const orderData = location.state?.orderData;
  const userInfo = location.state?.userInfo;
  const donation = location.state?.donation;

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData || !userInfo) {
      navigate("/");
      return;
    }

    // Calculate wait time
    const estimatedTime = getEstimatedWaitTime();
    setWaitTime(estimatedTime);

    // Store phone number in localStorage for easy review access
    if (userInfo.phone) {
      localStorage.setItem("fx7_user_phone", userInfo.phone);
    }
  }, [orderData, userInfo, navigate, getEstimatedWaitTime]);

  if (!orderData || !userInfo) {
    return null;
  }

  return (
    <div className="page-container items-center">
      <div className="w-full max-w-[900px] flex flex-col">
        <div className="page-header">
          <h1 className="page-title">Order Confirmed!</h1>
        </div>

        <div className="flex flex-col p-6 gap-5">
          {/* Success Message */}
          <div className="card bg-gradient-to-br from-sage-200 to-pine-200 border-pine-300 p-8 gap-5 text-center">
            <div className="text-6xl">✓</div>
            <h2 className="text-3xl font-black text-pine-800 drop-shadow-sm">
              Order Submitted Successfully!
            </h2>
            <p className="text-lg text-pine-700 font-bold">
              Thank you, {userInfo.name}!
            </p>
          </div>

          {/* Wait Time Estimate */}
          {waitTime && (
            <div className="card border-sage-200 p-7 gap-5">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⏱️</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-pine-700 mb-2">
                    Estimated Wait Time
                  </h3>
                  <p className="text-2xl font-black text-pine-600">
                    {waitTime.displayText}
                  </p>
                  {waitTime.queueLength > 0 ? (
                    <p className="text-sm text-cocoa-500 font-medium mt-2">
                      Your order is being prepared
                    </p>
                  ) : (
                    <p className="text-sm text-cocoa-500 font-medium mt-2">
                      No queue - we'll start right away!
                    </p>
                  )}
                  {waitTime.calculatedFromData && (
                    <p className="text-xs text-sage-600 font-medium mt-1">
                      📊 Based on last 5 orders (avg: {waitTime.avgPrepTime} min each)
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="card border-sage-200 p-7 gap-5">
            <h3 className="text-2xl text-pine-700 font-bold drop-shadow-sm">
              Your Order
            </h3>
            <div className="flex flex-col gap-3">
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-3 border-b border-cream-200 last:border-0"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="font-bold text-pine-700 text-lg">
                      {item.drinkName}
                    </div>
                    <div className="text-base text-cocoa-500 font-medium">
                      {item.temperature} · {item.milkType}
                    </div>
                    {item.specialInstructions && (
                      <div className="text-sm text-cocoa-400 italic">
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sage-600">Free</div>
                </div>
              ))}
            </div>
            {donation > 0 && (
              <div className="rounded-xl bg-gradient-to-br from-sage-100 to-pine-100 border-2 border-sage-300 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pine-700 text-lg">
                    Donation to Feeding America
                  </span>
                  <span className="font-black text-pine-700 text-2xl">
                    ${donation.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-pine-600 font-medium mt-2">
                  Thank you for your generosity! 💚
                </p>
              </div>
            )}
          </div>

          {/* Notifications Info */}
          <div className="card bg-blue-50 border-blue-300 p-6 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📱</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 text-lg mb-2">
                  We'll Text You When Ready
                </h3>
                <p className="text-base text-blue-700 font-medium">
                  You'll receive a notification at{" "}
                  <span className="font-bold">{userInfo.phone}</span> when your
                  order is ready for pickup.
                </p>
              </div>
            </div>
          </div>

          {/* Review Prompt */}
          <div className="card bg-gradient-to-br from-cream-100 to-sage-50 border-sage-200 p-7 gap-5">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⭐</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-pine-700 mb-2">
                  Enjoy Your Drink!
                </h3>
                <p className="text-base text-cocoa-600 font-medium mb-4">
                  After you pick up your order, we'd love to hear about your
                  experience. Your feedback helps us serve you better!
                </p>
                <button
                  onClick={() => {
                    // Navigate to My Orders with phone pre-filled
                    navigate("/my-orders", {
                      state: { phoneNumber: userInfo.phone },
                    });
                  }}
                  className="btn-secondary btn-medium"
                >
                  Leave a Review Later →
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="btn-primary btn-large flex-1 text-xl shadow-2xl border-2 border-pine-800"
            >
              <span className="font-black tracking-wide">Back to Home</span>
            </button>
            <button
              onClick={() => {
                navigate("/my-orders", {
                  state: { phoneNumber: userInfo.phone },
                });
              }}
              className="btn-secondary btn-large text-xl"
            >
              <span className="font-bold">View My Orders</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
