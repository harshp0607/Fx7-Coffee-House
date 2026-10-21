import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DrinkCard1 = ({ className = "", image, drinkName, description, outOfStock = false, tag }) => {
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
      className={`drink-card${className ? ` ${className}` : ""}`}
      style={{
        cursor: outOfStock ? "not-allowed" : "pointer",
        opacity: outOfStock ? 0.5 : 1,
        filter: outOfStock ? "grayscale(1)" : "none",
      }}
    >
      {/* Photo */}
      <div className="drink-photo">
        <img alt={drinkName} src={image} />
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
      <div className="drink-card-copy">
        <div className="drink-title-row">
          <h3>{drinkName}</h3>
          {tag && <span className="mini-tag">{tag}</span>}
        </div>
        <p>{description}</p>
        <span className="complimentary">
          {outOfStock ? "Unavailable" : <>Complimentary <ArrowRight /></>}
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
  tag: PropTypes.string,
};

export default DrinkCard1;
