import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useOrder } from "../context/OrderContext";

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5L5.5 10L11 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M3 8.5h11M10 5l4 3.5L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Frame1 = () => {
  const navigate = useNavigate();
  const { currentDrink, addToOrder, outOfStockMilk } = useOrder();
  const [customization, setCustomization] = useState({
    temperature: "Hot",
    milkType: "Oat Milk",
    specialInstructions: "",
  });

  const handleAddToOrder = () => {
    if (currentDrink) {
      addToOrder({ ...currentDrink, ...customization });
      navigate("/checkout");
    }
  };

  const temps = ["Hot", "Iced"];
  const milks = ["Whole Milk", "Oat Milk"];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Go back">
          <ArrowLeft />
        </button>
        <div className="logo-mark">
          <span>FX7</span>
        </div>
        <div className="header-spacer" />
      </header>

      <main className="screen detail-screen">
        {/* Drink photo */}
        <div className="detail-photo">
          <img
            src={currentDrink?.image || "/coffee-latte.png"}
            alt={currentDrink?.drinkName || "Drink"}
          />
          <div className="photo-overlay" />
          <span className="image-badge">Complimentary</span>
        </div>

        {/* Body */}
        <div className="detail-body">
          <span className="eyebrow">{currentDrink?.category === "coffee" ? "Fall Coffee" : "Fall Favorite"}</span>
          <h1>{currentDrink?.drinkName || "Select a drink"}</h1>
          <p className="detail-description">
            {currentDrink?.description}. A thoughtful little ritual for crisp mornings and slow afternoons.
          </p>

          {/* Temperature */}
          <div className="option-block">
            <div className="option-label">
              <span>Temperature</span>
              <span className="option-hint">Choose one</span>
            </div>
            <div className="segmented" style={{ gridTemplateColumns: `repeat(${temps.length}, 1fr)` }}>
              {temps.map(t => (
                <button
                  key={t}
                  className={customization.temperature === t ? "active" : ""}
                  onClick={() => setCustomization({ ...customization, temperature: t })}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Milk */}
          <div className="option-block">
            <div className="option-label">
              <span>Milk</span>
              <span className="option-hint">Choose one</span>
            </div>
            <div className="chip-grid">
              {milks.map(m => {
                const disabled = outOfStockMilk.includes(m);
                return (
                  <button
                    key={m}
                    className={customization.milkType === m ? "active" : ""}
                    onClick={() => !disabled && setCustomization({ ...customization, milkType: m })}
                    style={{ opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                  >
                    {m}
                    {customization.milkType === m && <Check />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <label className="note-label">
            Optional note
            <textarea
              placeholder="Anything we should know?"
              rows={2}
              value={customization.specialInstructions}
              onChange={e => setCustomization({ ...customization, specialInstructions: e.target.value })}
            />
          </label>

          <button className="primary-btn bottom-cta" onClick={handleAddToOrder}>
            Add to order <ArrowRight />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Frame1;
