import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";
import Navigation from "./components/Navigation";
import Frame from "./pages/Frame";
import Frame1 from "./pages/Frame1";
import DashboardLogin from "./pages/DashboardLogin";
import Frame3 from "./pages/Frame3";
import MyOrders from "./pages/MyOrders";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
      case "/frame":
        title = "";
        metaDescription = "";
        break;
      case "/frame1":
        title = "";
        metaDescription = "";
        break;
      case "/frame2":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]',
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <OrderProvider>
      <Navigation />
      <Routes>
        <Route path="/" element={<Frame />} />
        <Route path="/customize" element={<Frame1 />} />
        <Route path="/dashboard" element={<DashboardLogin />} />
        <Route path="/checkout" element={<Frame3 />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </OrderProvider>
  );
}
export default App;
