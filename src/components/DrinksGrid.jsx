import { useState } from "react";
import DrinkCard1 from "./DrinkCard";
import PropTypes from "prop-types";

const DrinksGrid = ({ className = "" }) => {
  const [drinkCard1Items] = useState([
    {
      image: "/Image1@2x.JPG",
      drinkName: "Peppermint Mocha",
      description: "Dark chocolate with cool peppermint",
    },
    {
      image: "/Image2@2x.JPG",
      drinkName: "Gingerbread Latte",
      description: "Warm spices with sweet molasses",
    },
    {
      image: "/IMG_1145.JPG",
      drinkName: "Eggnog Latte",
      description: "Creamy eggnog with rich espresso",
    },
  ]);
  return (
    <div
      className={`self-stretch flex flex-col items-start gap-[1rem] text-left text-[1rem] text-gray-300 font-inter ${className}`}
    >
      {drinkCard1Items.map((item, index) => (
        <DrinkCard1
          key={index}
          image={item.image}
          drinkName={item.drinkName}
          description={item.description}
        />
      ))}
    </div>
  );
};

DrinksGrid.propTypes = {
  className: PropTypes.string,
};

export default DrinksGrid;
