import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { OrderProvider } from "./context/OrderContext";
import Frame from "./pages/Frame";
import Frame1 from "./pages/Frame1";
import Frame2 from "./pages/Frame2";
import Frame3 from "./pages/Frame3";

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
      <Routes>
        <Route path="/" element={<Frame />} />
        <Route path="/frame" element={<Frame1 />} />
        <Route path="/frame1" element={<Frame2 />} />
        <Route path="/frame2" element={<Frame3 />} />
      </Routes>
    </OrderProvider>
  );
}
export default App;
