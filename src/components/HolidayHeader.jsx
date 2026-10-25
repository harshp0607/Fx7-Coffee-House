const HolidayHeader = () => {
  return (
    <section className="hero">
      <div className="hero-orbit orbit-one" />
      <div className="hero-orbit orbit-two" />

      {/* Logo as season seal */}
      <div className="season-seal">
        <img src="/fx7Logo.PNG" alt="FX7" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      <h1>FX7 Fall<br /><em>Coffee House</em></h1>
      <p className="hero-sub">Order something cozy.</p>
    </section>
  );
};

export default HolidayHeader;
