import PropTypes from "prop-types";

const HolidayHeader = ({ className = "" }) => {
  return (
    <>
      <div
        className={`self-stretch flex flex-col items-start pt-[2.5rem] px-[1.5rem] pb-[2rem] gap-[1.25rem] text-center text-[1rem] font-inter relative overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(135deg, #fde5cc 0%, #faefd8 40%, #f4e8d4 70%, #fde5cc 100%)',
        }}
      >
        {/* Decorative leaf accents */}
        <div className="absolute top-3 left-4 text-[2rem] opacity-30 rotate-[-20deg]">🍂</div>
        <div className="absolute top-4 right-6 text-[1.5rem] opacity-25 rotate-[15deg]">🍁</div>
        <div className="absolute bottom-3 left-8 text-[1.25rem] opacity-20 rotate-[10deg]">🍂</div>
        <div className="absolute bottom-4 right-10 text-[1.75rem] opacity-25 rotate-[-10deg]">🍁</div>
      <div className="self-stretch flex items-center justify-center z-10">
        <img
          className="h-[10rem] w-[10rem] relative rounded-full object-cover shadow-lg ring-4 ring-white"
          alt="Fx7 Logo"
          src="/fx7Logo.PNG"
        />
      </div>
      <div className="self-stretch flex items-center justify-center z-10">
        <b className="relative text-[1.375rem] md:text-[1.875rem] text-pine-700 tracking-tight px-4 py-2 rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">{`🍂 Fall Coffee House 🍂`}</b>
      </div>
    </div>
    </>
  );
};

HolidayHeader.propTypes = {
  className: PropTypes.string,
};

export default HolidayHeader;
