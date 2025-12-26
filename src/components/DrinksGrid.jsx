import DrinkCard1 from "./DrinkCard";
import PropTypes from "prop-types";
import { useOrder } from "../context/OrderContext";
import { DRINKS } from "../data/drinks";

const DrinksGrid = ({ className = "", category = null }) => {
  const { outOfStockDrinks } = useOrder();

  // Filter drinks by category if specified
  const filteredDrinks = category
    ? DRINKS.filter(drink => drink.category === category)
    : DRINKS;

  return (
    <div
      className={`self-stretch flex flex-col items-start gap-[1rem] text-left text-[1rem] text-gray-300 font-inter ${className}`}
    >
      {filteredDrinks.map((item) => (
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
  category: PropTypes.string,
};

export default DrinksGrid;
