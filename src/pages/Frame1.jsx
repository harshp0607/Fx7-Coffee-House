import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomizationOptions from "../components/CustomizationOptions";
import { useOrder } from "../context/OrderContext";

const Frame1 = () => {
  const navigate = useNavigate();
  const { currentDrink, addToOrder } = useOrder();
  const [customization, setCustomization] = useState({
    temperature: "Hot",
    milkType: "Whole Milk",
    specialInstructions: "",
  });

  const handleAddToOrder = () => {
    if (currentDrink) {
      addToOrder({
        ...currentDrink,
        ...customization,
      });
      navigate("/frame2");
    }
  };

  return (
    <div className="page-container items-center text-center">
      <div className="w-full max-w-[900px] flex flex-col">
      <div className="page-header flex-row justify-start items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="btn-secondary btn-medium h-11 gap-2 border-2 border-sage-300"
        >
          <span className="text-xl">←</span>
          <span>Back</span>
        </button>
        <h1 className="page-title">Customize Drink</h1>
      </div>

      <div className="self-stretch bg-gradient-to-b from-white/60 to-cream-100/80 flex flex-col items-center py-10 px-6 gap-6 text-2xl">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sage-300 to-pine-400 rounded-2xl blur-2xl opacity-25"></div>
          <img
            className="w-52 h-52 relative rounded-2xl object-cover shadow-2xl ring-4 ring-white"
            alt=""
            src={currentDrink?.image || "/Image5@2x.png"}
          />
        </div>
        <b className="relative max-w-sm text-pine-800 text-3xl tracking-tight drop-shadow-sm">
          {currentDrink?.drinkName || "Peppermint Mocha"}
        </b>
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-sage-200 to-pine-200 text-lg font-bold text-pine-700 shadow-md">
          Complimentary ✦
        </div>
      </div>

      <CustomizationOptions
        customization={customization}
        setCustomization={setCustomization}
      />

      <div className="self-stretch bg-gradient-to-t from-cream-100 to-white/60 flex flex-col items-start pt-6 px-6 pb-10 gap-5 text-sm text-cocoa-600">
        <div className="self-stretch font-semibold text-center text-base">
          ✦ Your drink is complimentary. Consider donating at checkout.
        </div>
        <button
          onClick={handleAddToOrder}
          className="btn-primary btn-large w-full text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02]"
        >
          Add to Order →
        </button>
      </div>
      </div>
    </div>
  );
};

export default Frame1;
  