import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const DrinkCard1 = ({ className = "", image, drinkName, description, outOfStock = false }) => {
  const navigate = useNavigate();
  const { selectDrink } = useOrder();

  const handleClick = () => {
    if (outOfStock) {
      alert(`Sorry, ${drinkName} is currently out of stock.`);
      return;
    }
    selectDrink({ image, drinkName, description });
    navigate("/customize");
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        padding: 0,
        overflow: "hidden",
        textAlign: "left",
        border: "1px solid var(--line)",
        background: "var(--card)",
        borderRadius: 10,
        color: "var(--fg)",
        cursor: outOfStock ? "not-allowed" : "pointer",
        opacity: outOfStock ? 0.5 : 1,
        filter: outOfStock ? "grayscale(1)" : "none",
        transition: "border-color 0.15s",
        width: "100%",
      }}
      onMouseEnter={e => { if (!outOfStock) e.currentTarget.style.borderColor = "#d0c4b4"; }}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--line)"}
    >
      {/* Photo */}
      <div style={{ height: 120, position: "relative", overflow: "hidden", background: "var(--cream)" }}>
        <img
          alt={drinkName}
          src={image}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {outOfStock && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.4)",
          }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 11 }}>OUT OF STOCK</span>
          </div>
        )}
      </div>

      {/* Copy */}
      <div style={{ padding: "11px 11px 13px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4, minHeight: 34 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em" }}>{drinkName}</h3>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 10, lineHeight: 1.4, margin: "5px 0 10px", minHeight: 26 }}>
          {description}
        </p>
        <span style={{ color: "var(--clay)", display: "flex", gap: 3, alignItems: "center", fontSize: 10, fontWeight: 700 }}>
          {outOfStock ? "Unavailable" : "Complimentary →"}
        </span>
      </div>
    </button>
  );
};

DrinkCard1.propTypes = {
  className: PropTypes.string,
  image: PropTypes.string,
  drinkName: PropTypes.string,
  description: PropTypes.string,
  outOfStock: PropTypes.bool,
};

export default DrinkCard1;
