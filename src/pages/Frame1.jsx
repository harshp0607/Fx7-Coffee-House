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

  const temps = ["Hot", "Iced", "Blended"];
  const milks = ["Whole Milk", "Oat Milk", "Almond Milk", "Skim Milk", "None"];

  return (
    <div className="page-container">
      {/* Header */}
      <header className="app-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Go back">
          <ArrowLeft />
        </button>
        <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", color: "var(--espresso)" }}>FX7</span>
        <div style={{ width: 34 }} />
      </header>

      {/* Drink photo */}
      <div style={{ height: 260, position: "relative", overflow: "hidden", background: "var(--cream)", margin: "0" }}>
        <img
          src={currentDrink?.image || "/coffee-latte.png"}
          alt={currentDrink?.drinkName || "Drink"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(0deg, rgba(39,27,20,0.45), transparent 45%)",
        }} />
        <span style={{
          position: "absolute", bottom: 16, left: 20,
          color: "white", fontSize: 10,
          border: "1px solid rgba(255,255,255,0.5)",
          padding: "6px 10px", borderRadius: 20,
        }}>Complimentary</span>
      </div>

      {/* Body */}
      <div style={{ padding: "24px 20px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <span className="eyebrow">{currentDrink?.category === "coffee" ? "Fall Coffee" : "Fall Favorite"}</span>
          <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-0.04em", margin: "8px 0 10px" }}>
            {currentDrink?.drinkName || "Select a drink"}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
            {currentDrink?.description}. A thoughtful little ritual for crisp mornings and slow afternoons.
          </p>
        </div>

        {/* Temperature */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
            <span>Temperature</span>
            <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 400 }}>Choose one</span>
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
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
            <span>Milk</span>
            <span style={{ color: "var(--muted)", fontSize: 10, fontWeight: 400 }}>Choose one</span>
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
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
            Optional note
          </label>
          <textarea
            placeholder="Anything we should know?"
            rows={2}
            value={customization.specialInstructions}
            onChange={e => setCustomization({ ...customization, specialInstructions: e.target.value })}
          />
        </div>

        <button className="btn-primary" onClick={handleAddToOrder}>
          Add to order →
        </button>
      </div>
    </div>
  );
};

export default Frame1;
