import TemperatureGroup from "./TemperatureGroup";
import PropTypes from "prop-types";
import { useOrder } from "../context/OrderContext";

const CustomizationOptions = ({ className = "", customization, setCustomization, drinkName = "" }) => {
  const { outOfStockMilk } = useOrder();

  const isHotChocolate = drinkName === "Hot Chocolate";

  const handleTemperatureChange = (value) => {
    setCustomization({ ...customization, temperature: value });
  };

  const handleMilkTypeChange = (value) => {
    setCustomization({ ...customization, milkType: value });
  };

  const handleInstructionsChange = (e) => {
    setCustomization({ ...customization, specialInstructions: e.target.value });
  };

  const isWholeMilkOutOfStock = outOfStockMilk.includes("Whole Milk");
  const isOatMilkOutOfStock = outOfStockMilk.includes("Oat Milk");

  return (
    <div
      className={`self-stretch flex flex-col items-start py-[2rem] px-[1.5rem] gap-[2rem] text-left font-inter ${className}`}
    >
      <TemperatureGroup
        temperatureLabel="Temperature"
        hotText="Hot"
        icedText="Iced"
        selectedValue={customization?.temperature}
        onSelect={handleTemperatureChange}
      />
      <TemperatureGroup
        temperatureLabel="Milk Type"
        hotText="Whole Milk"
        icedText="Oat Milk"
        selectedValue={customization?.milkType}
        onSelect={handleMilkTypeChange}
        hotDisabled={isWholeMilkOutOfStock}
        icedDisabled={isOatMilkOutOfStock}
      />
      <div className="self-stretch flex flex-col items-start gap-[1rem]">
        <div className="self-stretch relative font-semibold text-pine-600 text-[1rem]">
          Special Instructions
        </div>
        {isHotChocolate && (
          <div className="self-stretch rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 border-solid border-[2px] p-[1rem] text-[0.875rem] text-blue-700">
            <div className="font-bold mb-1">💡 Tip:</div>
            <div className="leading-relaxed">
              Any of our seasonal flavorings can be added to your hot chocolate! Just add your request in the special instructions box below (e.g., "Add peppermint flavor" or "Add gingerbread spice").
            </div>
          </div>
        )}
        <input
          type="text"
          value={customization?.specialInstructions || ""}
          onChange={handleInstructionsChange}
          placeholder="Add any special requests here..."
          className="self-stretch rounded-xl bg-white border-sage-200 border-solid border-[2px] flex items-center p-[1rem] text-[0.938rem] text-cocoa-500 placeholder:text-cocoa-300 outline-none focus:border-pine-400 focus:shadow-md transition-all"
        />
      </div>
    </div>
  );
};

CustomizationOptions.propTypes = {
  className: PropTypes.string,
  customization: PropTypes.object,
  setCustomization: PropTypes.func,
  drinkName: PropTypes.string,
};

export default CustomizationOptions;
