import PropTypes from "prop-types";

const TemperatureGroup = ({
  className = "",
  temperatureLabel,
  hotText,
  icedText,
  selectedValue,
  onSelect,
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
          onClick={() => onSelect(hotText)}
          className={`flex-1 rounded-xl border-solid border-[2px] flex items-center justify-center p-[1rem] cursor-pointer transition-all ${
            isHotSelected
              ? "bg-pine-500 border-pine-500 text-white shadow-md"
              : "bg-white border-sage-200 text-cocoa-500 hover:border-sage-300"
          }`}
        >
          <div className="flex-1 relative font-semibold">{hotText}</div>
        </div>
        <div
          onClick={() => onSelect(icedText)}
          className={`flex-1 rounded-xl border-solid border-[2px] flex items-center justify-center p-[1rem] cursor-pointer transition-all ${
            isIcedSelected
              ? "bg-pine-500 border-pine-500 text-white shadow-md"
              : "bg-white border-sage-200 text-cocoa-500 hover:border-sage-300"
          }`}
        >
          <div className="flex-1 relative font-semibold">{icedText}</div>
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
};

export default TemperatureGroup;
