import PropTypes from "prop-types";

const HolidayHeader = ({ className = "" }) => {
  return (
    <>
      <div
        className={`self-stretch bg-gradient-to-br from-sage-100 via-cream-100 to-pine-50 flex flex-col items-start pt-[2.5rem] px-[1.5rem] pb-[2rem] gap-[1.25rem] text-center text-[1rem] font-inter relative overflow-hidden ${className}`}
        style={{
          backgroundImage: 'url(/holiday-pattern.png)',
          backgroundSize: 'auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundBlendMode: 'normal',
          backgroundColor: '#ddf0e6'
        }}
      >
        {/* Semi-transparent overlay to reduce pattern opacity */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/50 to-white/60 z-0"></div>
      <div className="self-stretch flex items-center justify-center z-10">
        <img
          className="h-[10rem] w-[10rem] relative rounded-full object-cover shadow-lg ring-4 ring-white"
          alt="Fx7 Logo"
          src="/fx7Logo.PNG"
        />
      </div>
      <div className="self-stretch flex items-center justify-center z-10">
        <b className="relative text-[1.375rem] md:text-[1.875rem] text-pine-700 tracking-tight px-4 py-2 rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">{`✦ Holiday Coffee House ✦`}</b>
      </div>
    </div>
    </>
  );
};

HolidayHeader.propTypes = {
  className: PropTypes.string,
};

export default HolidayHeader;
