import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const Frame3 = () => {
  const navigate = useNavigate();
  const { orders, submitOrder } = useOrder();
  const [selectedDonation, setSelectedDonation] = useState("$10");
  const [customAmount, setCustomAmount] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
  });
  const [smsConsent, setSmsConsent] = useState(false);

  const handleDonationSelect = (amount) => {
    setSelectedDonation(amount);
    if (amount !== "Custom") {
      setCustomAmount("");
    }
  };

  const getDonationAmount = () => {
    if (selectedDonation === null) return 0;
    if (selectedDonation === "Custom") {
      return parseFloat(customAmount) || 0;
    }
    return parseFloat(selectedDonation.replace("$", ""));
  };

  const openVenmo = () => {
    const donationAmount = getDonationAmount();
    if (donationAmount <= 0) return false;

    const venmoUsername = "harshp0607";
    const note = `Donation from ${userInfo.name} - FX7 Coffee House`;
    const venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${donationAmount}&note=${encodeURIComponent(note)}`;
    const venmoWebUrl = `https://venmo.com/${venmoUsername}?txn=pay&amount=${donationAmount}&note=${encodeURIComponent(note)}`;

    window.location.href = venmoUrl;
    setTimeout(() => {
      window.open(venmoWebUrl, '_blank');
    }, 1500);

    return true;
  };

  const handleSubmitOrder = () => {
    if (orders.length === 0) {
      alert("Please add items to your order first!");
      return;
    }
    if (!userInfo.name || !userInfo.phone) {
      alert("Please fill in your name and phone number!");
      return;
    }
    if (!smsConsent) {
      alert("Please consent to receive SMS notifications about your order!");
      return;
    }

    const donation = getDonationAmount();

    if (donation > 0) {
      openVenmo();
      setTimeout(() => {
        submitOrder(userInfo, donation);
        alert("Order submitted! Please complete your Venmo donation. We'll text you when your order is ready.");
        navigate("/");
      }, 2000);
    } else {
      submitOrder(userInfo, donation);
      alert("Order submitted successfully! Your order has been sent to the barista.");
      navigate("/");
    }
  };

  const inputClass = "w-full rounded-xl bg-gradient-to-r from-cream-100 to-sage-50 border-2 border-sage-300 py-4 px-5 text-lg text-pine-700 font-medium placeholder:text-cocoa-400 outline-none focus:border-pine-500 focus:bg-white focus:shadow-lg transition-all";
  const donationButtonClass = (isSelected) => `flex-1 rounded-xl border-[3px] p-5 cursor-pointer transition-all text-center ${
    isSelected
      ? "bg-gradient-to-br from-pine-500 to-pine-600 border-pine-600 text-white shadow-xl"
      : "bg-white border-sage-300 text-cocoa-600 hover:border-pine-400 hover:shadow-md"
  }`;

  return (
    <div className="page-container items-center">
      <div className="w-full max-w-[900px] flex flex-col">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
      </div>

      <div className="flex flex-col p-6 gap-5 text-sm">
        {/* User Information */}
        <div className="card border-sage-200 p-7 gap-6">
          <h2 className="text-2xl text-pine-700 font-bold drop-shadow-sm">Your Information</h2>
          <div className="flex flex-col gap-3">
            <label className="font-bold text-cocoa-600">Full Name</label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              placeholder="Enter your name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-bold text-cocoa-600">Phone Number</label>
            <input
              type="tel"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
              placeholder="Enter your phone number"
              className={inputClass}
            />
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="smsConsent"
                checked={smsConsent}
                onChange={(e) => setSmsConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-2 border-cocoa-400 text-pine-600 focus:ring-2 focus:ring-pine-500 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="smsConsent" className="text-sm text-cocoa-600 leading-relaxed cursor-pointer">
                By checking this box, you agree to receive order status notifications from FX7 Coffee House at the phone number provided.
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="card border-sage-200 p-7 gap-5 text-base">
          <h2 className="text-2xl text-pine-700 font-bold drop-shadow-sm">Your Order</h2>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <div key={index} className="flex items-start justify-between py-3 border-b border-cream-200 last:border-0">
                <div className="flex-1 flex flex-col gap-2">
                  <div className="font-bold text-pine-700 text-lg">{order.drinkName}</div>
                  <div className="text-base text-cocoa-500 font-medium">{order.temperature} · {order.milkType}</div>
                </div>
                <div className="font-bold text-sage-600">Free</div>
              </div>
            ))
          ) : (
            <div className="flex justify-center py-4 text-cocoa-300">No items in your order yet</div>
          )}
          <div className="flex justify-between pt-3 border-t border-cream-200 text-cocoa-500">
            <span className="font-semibold">Subtotal</span>
            <span className="font-semibold">$0.00</span>
          </div>
          <div className="rounded-full bg-sage-50 border border-sage-200 flex items-center justify-center p-3.5 text-center text-sm text-pine-500">
            <span className="font-semibold">✦ All drinks complimentary this season ✦</span>
          </div>
        </div>

        {/* Donation Section */}
        <div className="card bg-gradient-to-br from-white to-sage-50 border-sage-200 p-8 gap-7 text-lg">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl text-pine-700 font-bold drop-shadow-sm">Support Our Mission</h2>
            <p className="text-lg text-cocoa-600 font-semibold">
              Your drinks are free. Consider giving back to those in need.
            </p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-sage-100 to-pine-100 border-2 border-sage-300 p-6 gap-4 shadow-md">
            <h3 className="font-bold text-pine-700 text-lg">Feeding America</h3>
            <p className="text-base text-cocoa-600 font-medium leading-relaxed">
              Feeding America is the largest hunger-relief organization in the United States. It supports a nationwide network of food banks, food pantries, and meal programs that provide food to millions of children, families, and seniors facing hunger. Through donations, partnerships, and community programs, Feeding America works to reduce food insecurity, rescue surplus food, and create long-term solutions to end hunger in America.
            </p>
          </div>

          <div className="flex flex-col gap-4.5 text-base">
            <label className="font-bold text-pine-700 text-lg">Choose Your Donation</label>
            <div className="flex gap-4 text-center text-lg">
              <div onClick={() => handleDonationSelect("$10")} className={donationButtonClass(selectedDonation === "$10")}>
                <b>$10</b>
              </div>
              <div onClick={() => handleDonationSelect("Custom")} className={donationButtonClass(selectedDonation === "Custom")}>
                <b>Custom</b>
              </div>
            </div>
            {selectedDonation === "Custom" && (
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter custom amount"
                className={inputClass}
              />
            )}
          </div>

          <button
            onClick={() => handleDonationSelect(null)}
            className="w-full rounded-xl bg-gradient-to-br from-cream-200 to-cream-300 border-2 border-cream-400 p-4.5 text-center text-base text-cocoa-600 font-semibold cursor-pointer hover:from-cream-300 hover:to-cream-400 hover:shadow-md transition-all"
          >
            Skip donation for now
          </button>
        </div>

        {/* Total */}
        <div className="card bg-gradient-to-br from-sage-200 to-pine-200 border-pine-300 p-8 gap-4 text-base">
          <div className="flex items-center justify-between">
            <b className="text-2xl text-pine-800 drop-shadow-sm">Total</b>
            <b className="text-4xl text-pine-800 drop-shadow-sm">${getDonationAmount().toFixed(2)}</b>
          </div>
          {getDonationAmount() > 0 && (
            <p className="text-lg text-pine-700 font-bold">
              ✦ Thank you for your ${getDonationAmount().toFixed(2)} donation!
            </p>
          )}
        </div>

        {/* Venmo Info */}
        {getDonationAmount() > 0 && (
          <div className="rounded-xl bg-blue-50 border-2 border-blue-300 flex items-center gap-3 p-5">
            <div className="text-3xl">💳</div>
            <div className="flex-1">
              <div className="font-bold text-blue-900 text-base">Payment via Venmo</div>
              <div className="text-sm text-blue-700 font-medium">
                You'll be redirected to Venmo to complete your ${getDonationAmount().toFixed(2)} donation
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitOrder}
          className="btn-primary btn-large w-full text-xl shadow-2xl border-2 border-pine-800 gap-3 hover:scale-[1.02]"
        >
          <span className="font-black tracking-wide">
            {getDonationAmount() > 0 ? "Donate & Submit Order" : "Submit Order"}
          </span>
          <span className="text-2xl">→</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Frame3;
