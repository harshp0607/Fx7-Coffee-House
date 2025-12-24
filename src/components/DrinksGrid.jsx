import DrinkCard1 from "./DrinkCard";
import PropTypes from "prop-types";
import { useOrder } from "../context/OrderContext";
import { DRINKS } from "../data/drinks";

const DrinksGrid = ({ className = "" }) => {
  const { outOfStockDrinks } = useOrder();
  return (
    <div
      className={`self-stretch flex flex-col items-start gap-[1rem] text-left text-[1rem] text-gray-300 font-inter ${className}`}
    >
      {DRINKS.map((item) => (
        <DrinkCard1
          key={item.id}
          image={item.image}
          drinkName={item.drinkName}
          description={item.description}
          outOfStock={outOfStockDrinks.includes(item.drinkName)}
        />
      ))}
    </div>
  );
};

DrinksGrid.propTypes = {
  className: PropTypes.string,
};

export default DrinksGrid;
