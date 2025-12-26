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

        <div className="flex flex-col p-4 gap-3">
          {/* Success Message */}
          <div className="card bg-gradient-to-br from-sage-200 to-pine-200 border-pine-300 p-5 gap-3 text-center">
            <div className="text-4xl">✓</div>
            <h2 className="text-xl font-black text-pine-800 drop-shadow-sm">
              Order Submitted Successfully!
            </h2>
            <p className="text-base text-pine-700 font-bold">
              Thank you, {userInfo.name}!
            </p>
          </div>

          {/* Wait Time Estimate */}
          {waitTime && (
            <div className="card border-sage-200 p-4 gap-2">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⏱️</div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-pine-700 mb-1">
                    Estimated Wait Time
                  </h3>
                  <p className="text-xl font-black text-pine-600">
                    {waitTime.displayText}
                  </p>
                  {waitTime.queueLength > 0 ? (
                    <p className="text-xs text-cocoa-500 font-medium mt-1">
                      Your order is being prepared
                    </p>
                  ) : (
                    <p className="text-xs text-cocoa-500 font-medium mt-1">
                      No queue - we'll start right away!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Review Prompt */}
          <div className="card bg-gradient-to-br from-cream-100 to-sage-50 border-sage-200 p-4 gap-3">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⭐</div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-pine-700 mb-1">
                  Enjoy Your Drink!
                </h3>
                <p className="text-sm text-cocoa-600 font-medium mb-3">
                  After pickup, we'd love to hear about your experience!
                </p>
                <button
                  onClick={() => {
                    // Navigate to My Orders with phone pre-filled
                    navigate("/my-orders", {
                      state: { phoneNumber: userInfo.phone },
                    });
                  }}
                  className="btn-secondary btn-small"
                >
                  Leave a Review Later →
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Info - COMMENTED OUT FOR NOW */}
          {/* <div className="card bg-blue-50 border-blue-300 p-4 gap-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">📱</div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 text-base mb-1">
                  We'll Text You When Ready
                </h3>
                <p className="text-sm text-blue-700 font-medium">
                  You'll receive a notification at{" "}
                  <span className="font-bold">{userInfo.phone}</span> when your
                  order is ready for pickup.
                </p>
              </div>
            </div>
          </div> */}

          {/* Order Summary */}
          <div className="card border-sage-200 p-4 gap-3">
            <h3 className="text-lg text-pine-700 font-bold drop-shadow-sm">
              Your Order
            </h3>
            <div className="flex flex-col gap-2">
              {orderData.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between py-2 border-b border-cream-200 last:border-0"
                >
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="font-bold text-pine-700 text-base">
                      {item.drinkName}
                    </div>
                    <div className="text-sm text-cocoa-500 font-medium">
                      {item.temperature} · {item.milkType}
                    </div>
                    {item.specialInstructions && (
                      <div className="text-xs text-cocoa-400 italic">
                        Note: {item.specialInstructions}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-sage-600 text-sm">Free</div>
                </div>
              ))}
            </div>
            {donation > 0 && (
              <div className="rounded-xl bg-gradient-to-br from-sage-100 to-pine-100 border-2 border-sage-300 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pine-700 text-base">
                    Donation to Feeding America
                  </span>
                  <span className="font-black text-pine-700 text-xl">
                    ${donation.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-pine-600 font-medium mt-1">
                  Thank you for your generosity! 💚
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="btn-primary btn-medium flex-1"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                navigate("/my-orders", {
                  state: { phoneNumber: userInfo.phone },
                });
              }}
              className="btn-secondary btn-medium"
            >
              My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
