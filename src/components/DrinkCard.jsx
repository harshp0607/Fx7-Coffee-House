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
    <div
      onClick={handleClick}
      className={`self-stretch shadow-lg rounded-2xl bg-white/95 backdrop-blur-sm border-solid border-[2px] flex items-start p-[1.375rem] gap-[1.25rem] transition-all text-left text-[1rem] font-inter ${className} ${
        outOfStock
          ? "opacity-50 grayscale cursor-not-allowed border-gray-300"
          : "cursor-pointer hover:shadow-2xl hover:border-pine-300 hover:-translate-y-1 hover:bg-white border-sage-200"
      }`}
    >
      <div className="relative w-[6rem] h-[6rem] flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-200 to-pine-200 rounded-xl blur-md opacity-20"></div>
        <img
          className="h-full w-full relative rounded-xl object-cover shadow-md ring-2 ring-white"
          alt=""
          src={image}
        />
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
            <span className="text-white font-bold text-sm text-center">OUT OF STOCK</span>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-start justify-center gap-[0.625rem]">
        <b className="self-stretch relative text-pine-700 text-[1.125rem]">{drinkName}</b>
        <div className="self-stretch relative text-[0.938rem] text-cocoa-500 leading-snug">
          {description}
        </div>
        {outOfStock ? (
          <div className="mt-1 px-3 py-1 rounded-full bg-red-100 text-[0.813rem] font-bold text-red-600 shadow-sm">
            ✗ Unavailable
          </div>
        ) : (
          <div className="mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-sage-100 to-pine-100 text-[0.813rem] font-bold text-pine-600 shadow-sm">
            ✦ Complimentary ✦
          </div>
        )}
      </div>
    </div>
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
