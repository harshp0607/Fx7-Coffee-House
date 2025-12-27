import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/checkout", label: "Checkout", icon: "🛒" },
    { path: "/my-orders", label: "Order Status & Reviews", icon: "📋" },
    { path: "/dashboard", label: "Barista Dashboard", icon: "👨‍🍳" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    // Exact match for all other paths to avoid conflicts
    if (path !== "/" && location.pathname === path) return true;
    return false;
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pine-600 to-pine-700 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-pine-500 rounded-lg p-2 transition-all"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-white transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all ${isOpen ? "opacity-0" : ""}`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
              </div>
            </button>

            {/* Logo/Title - Clickable to navigate home */}
            <div
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                className="h-10 w-10 rounded-full object-cover shadow-lg ring-2 ring-white"
                alt="FX7 Logo"
                src="/fx7Logo.PNG"
              />
              <h1 className="text-white text-xl font-black tracking-tight">FX7 Coffee House</h1>
            </div>
          </div>

          {/* Current Page Indicator (hidden on mobile) */}
          <div className="hidden md:block text-cream-100 text-sm font-medium">
            {menuItems.find(item => isActive(item.path))?.label || "Home"}
          </div>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-pine-700 to-pine-800 shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-20 pb-6">
          {/* Menu Items */}
          <nav className="flex-1 px-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all ${
                    isActive(item.path)
                      ? "bg-cream-100 text-pine-800 shadow-md font-bold"
                      : "text-white hover:bg-pine-600 font-medium"
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lg">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-6 text-cream-200 text-xs text-center">
            <p className="font-medium">Supporting Feeding America</p>
            <p className="opacity-75 mt-1">One cup at a time</p>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div className="h-16"></div>
    </>
  );
};

export default Navigation;
