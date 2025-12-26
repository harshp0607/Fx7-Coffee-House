import PropTypes from "prop-types";

const TemperatureGroup = ({
  className = "",
  temperatureLabel,
  hotText,
  icedText,
  selectedValue,
  onSelect,
  hotDisabled = false,
  icedDisabled = false,
}) => {
  const isHotSelected = selectedValue === hotText;
  const isIcedSelected = selectedValue === icedText;

  return (
    <div
      className={`self-stretch flex flex-col items-start gap-[1rem] text-left text-[1rem] font-inter ${className}`}
    >
      <div className="self-stretch relative font-semibold text-pine-600">
        {temperatureLabel}
      </div>
      <div className="self-stretch flex items-start gap-[0.75rem] text-center text-[0.938rem]">
        <div
          onClick={() => !hotDisabled && onSelect(hotText)}
          className={`flex-1 rounded-xl border-solid border-[2px] flex items-center justify-center p-[1rem] transition-all ${
            hotDisabled
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
              : isHotSelected
              ? "bg-pine-500 border-pine-500 text-white shadow-md cursor-pointer"
              : "bg-white border-sage-200 text-cocoa-500 hover:border-sage-300 cursor-pointer"
          }`}
        >
          <div className="flex-1 relative font-semibold">
            {hotText}
            {hotDisabled && <div className="text-xs mt-1">Out of Stock</div>}
          </div>
        </div>
        <div
          onClick={() => !icedDisabled && onSelect(icedText)}
          className={`flex-1 rounded-xl border-solid border-[2px] flex items-center justify-center p-[1rem] transition-all ${
            icedDisabled
              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
              : isIcedSelected
              ? "bg-pine-500 border-pine-500 text-white shadow-md cursor-pointer"
              : "bg-white border-sage-200 text-cocoa-500 hover:border-sage-300 cursor-pointer"
          }`}
        >
          <div className="flex-1 relative font-semibold">
            {icedText}
            {icedDisabled && <div className="text-xs mt-1">Out of Stock</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

TemperatureGroup.propTypes = {
  className: PropTypes.string,
  temperatureLabel: PropTypes.string,
  hotText: PropTypes.string,
  icedText: PropTypes.string,
  selectedValue: PropTypes.string,
  onSelect: PropTypes.func,
  hotDisabled: PropTypes.bool,
  icedDisabled: PropTypes.bool,
};

export default TemperatureGroup;
