import { useNavigate } from "react-router-dom";
import HolidayHeader from "../components/HolidayHeader";
import DrinksGrid from "../components/DrinksGrid";
import { useOrder } from "../context/OrderContext";

const Frame = () => {
  const navigate = useNavigate();
  const { orderCount, totalDonations } = useOrder();

  return (
    <div className="w-full relative bg-gradient-to-br from-sage-100 via-cream-200 to-pine-100 flex flex-col items-start min-h-[41.688rem] text-left text-[1.25rem] font-inter">
      <HolidayHeader />

      {/* Donation Counter */}
      <div className="self-stretch flex items-center justify-center py-[2rem] px-[1.5rem]">
        <div className="w-full max-w-md shadow-2xl rounded-2xl bg-gradient-to-br from-pine-500 via-pine-600 to-pine-700 border-3 border-pine-800 flex flex-col items-center p-[2.5rem] gap-[1rem]">
          <div className="text-white text-[0.938rem] font-bold tracking-wide uppercase opacity-90">Total Raised for Shelter</div>
          <div className="text-white text-[4rem] font-black drop-shadow-2xl tracking-tight">
            ${totalDonations.toFixed(2)}
          </div>
          <div className="text-cream-100 text-[0.938rem] font-medium text-center leading-relaxed">
            Every donation provides warm meals and shelter
          </div>
        </div>
      </div>

      <div className="self-stretch flex flex-col items-start py-[2rem] px-[1.5rem] gap-[1.5rem] bg-gradient-to-b from-transparent to-white/40">
        <b className="self-stretch relative text-pine-700 text-[1.75rem] tracking-tight drop-shadow-sm">Seasonal Favorites</b>
        <DrinksGrid />
      </div>
      <div className="self-stretch bg-gradient-to-t from-cream-100 to-white/60 flex flex-col items-start pt-[1.5rem] px-[1.5rem] pb-[2.5rem] text-[1rem] text-white">
        <div
          onClick={() => navigate("/frame2")}
          className="self-stretch shadow-xl rounded-2xl bg-gradient-to-r from-pine-500 to-pine-600 flex items-center justify-between py-[1.375rem] px-[2rem] gap-[1.25rem] cursor-pointer hover:from-pine-600 hover:to-pine-700 hover:shadow-2xl hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center gap-2">
            <div className="relative font-bold text-[1.125rem]">View Order</div>
            <div className="text-[1.25rem] opacity-75">→</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame;
