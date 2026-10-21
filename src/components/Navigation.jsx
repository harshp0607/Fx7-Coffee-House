import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const House = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 8L9 2L16 8V16H11V12H7V16H2V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const ShoppingBag = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 5h12L13 16H5L3 5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M7 5V4a2 2 0 014 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const Receipt = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const Coffee = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 7h10v6a4 4 0 01-4 4H7a4 4 0 01-4-4V7Z" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M13 8h1a2 2 0 010 4h-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6 5V3M9 5V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const Menu = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const X = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M6 4l4 3.5L6 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const Leaf = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 13C3 10 5 6 13 2C9 2 4 5 2 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    <path d="M2 13L8 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const UserRound = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const navItems = [
  { label: "Home",              path: "/",          icon: House,       hint: "Browse the fall menu" },
  { label: "Checkout",          path: "/checkout",  icon: ShoppingBag, hint: "Review your order" },
  { label: "Order status",      path: "/my-orders", icon: Receipt,     hint: "Track recent orders" },
  { label: "Barista dashboard", path: "/dashboard", icon: Coffee,      hint: "Manage the queue" },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Sticky top header */}
      <header className="app-header">
        <button className="icon-btn" onClick={() => setIsOpen(true)} aria-label="Open navigation">
          <Menu />
        </button>
        <div className="logo-mark" style={{ cursor: "pointer" }} onClick={() => handleNavigate("/")}>
          <img src="/fx7Logo.PNG" alt="FX7" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
          <span>FX7</span>
        </div>
        <button className="icon-btn" onClick={() => handleNavigate("/my-orders")} aria-label="My orders">
          <UserRound />
        </button>
      </header>

      {/* Scrim */}
      <button
        className={`drawer-scrim ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen(false)}
        aria-label="Close navigation"
      />

      {/* Side drawer */}
      <aside className={`side-drawer ${isOpen ? "is-open" : ""}`} aria-label="Main navigation" aria-hidden={!isOpen}>
        <div className="drawer-top">
          <div className="logo-mark">
            <img src="/fx7Logo.PNG" alt="FX7" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
            <span>FX7</span>
          </div>
          <button className="icon-btn" onClick={() => setIsOpen(false)} aria-label="Close navigation">
            <X />
          </button>
        </div>

        <div className="drawer-intro">
          <span className="eyebrow">Your coffee house</span>
          <h2>Where should we<br /><em>go next?</em></h2>
        </div>

        <nav className="drawer-nav">
          {navItems.map(({ label, path, icon: Icon, hint }) => (
            <button
              key={label}
              className={`drawer-link ${isActive(path) ? "active" : ""}`}
              onClick={() => handleNavigate(path)}
            >
              <span className="drawer-icon"><Icon /></span>
              <span>
                <strong>{label}</strong>
                <small>{hint}</small>
              </span>
              <span className="drawer-chevron"><ChevronRight /></span>
            </button>
          ))}
        </nav>

        <div className="drawer-footer">
          <Leaf />
          <span>Grab a cup, enjoy the season.</span>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
