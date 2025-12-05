import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const HolidayHeader = ({ className = "" }) => {
  const navigate = useNavigate();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");

  const handleBaristaClick = () => {
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === "barista123") {
      setShowPasswordPrompt(false);
      setPassword("");
      navigate("/frame1");
    } else {
      alert("Incorrect password!");
      setPassword("");
    }
  };

  const handleCancel = () => {
    setShowPasswordPrompt(false);
    setPassword("");
  };

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

        <div className="self-stretch relative z-10">
          <div
            onClick={handleBaristaClick}
            className="absolute right-0 top-0 h-[2.25rem] w-[2.25rem] rounded-full bg-gradient-to-br from-pine-500 to-pine-600 flex items-center justify-center cursor-pointer hover:from-pine-600 hover:to-pine-700 hover:scale-110 transition-all shadow-lg"
            title="Barista Login"
          >
            <div className="text-[1rem] text-white">☕</div>
          </div>
        </div>
      <div className="self-stretch flex items-center justify-center z-10">
        <img
          className="h-[10rem] w-[10rem] relative rounded-full object-cover shadow-lg ring-4 ring-white"
          alt="Fx7 Logo"
          src="/fx7Logo.PNG"
        />
      </div>
      <div className="self-stretch flex items-center justify-center z-10">
        <b className="relative text-[1.875rem] text-pine-700 tracking-tight px-6 py-2 rounded-xl bg-white/90 shadow-lg backdrop-blur-sm">{`✦ Holiday Coffee House ✦`}</b>
      </div>
    </div>

    {/* Password Modal */}
    {showPasswordPrompt && (
      <div className="fixed inset-0 bg-pine-600 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-[2rem] w-[90%] max-w-[22rem] shadow-2xl border border-sage-100">
          <h3 className="text-[1.5rem] font-bold text-pine-600 mb-[1.5rem]">
            Barista Login
          </h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-[1.5rem]">
              <label className="block text-[0.938rem] font-medium text-cocoa-500 mb-[0.625rem]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl bg-cream-100 border-sage-200 border-solid border-[2px] py-[0.875rem] px-[1.25rem] text-[1rem] text-pine-600 outline-none focus:border-pine-400 focus:bg-white transition-all"
                autoFocus
              />
            </div>
            <div className="flex gap-[0.875rem]">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl bg-cream-200 py-[0.875rem] px-[1.25rem] text-[1rem] font-medium text-cocoa-500 cursor-pointer hover:bg-cream-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-pine-500 py-[0.875rem] px-[1.25rem] text-[1rem] font-medium text-white cursor-pointer hover:bg-pine-600 transition-all shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

HolidayHeader.propTypes = {
  className: PropTypes.string,
};

export default HolidayHeader;
