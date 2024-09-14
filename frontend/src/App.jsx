import React, { useRef, useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer/Footer";
import { LoginPopup } from "./components/Login/LoginPopup";
import { Navbar } from "./components/Navbar/Navbar";
import { StoreContext } from "./context/StoreContext";
import { UserContext } from "./context/UserContext";
import {
  ProtectedRoute,
  ProtectedRouteForPlaceOrder,
} from "./hooks/ProtectedRoute";
import { Cart } from "./pages/Cart/Cart";
import { Home } from "./pages/Home/Home";
import { Orders } from "./pages/MyOrders/Orders";
import { PlaceOrder } from "./pages/PlaceOrder/PlaceOrder";
import { Verify } from "./pages/Verify/Verify";

//============================================================================

const App = () => {
  const { searchInputValue } = useContext(StoreContext);
  const { showLogin, setShowLogin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchInputValue) {
      navigate("/");
    }
  }, [navigate, searchInputValue]);

  return (
    <>
      {showLogin && (
        <>
          <div className="gray-overlay"></div>
          <LoginPopup setShowLogin={setShowLogin} />
        </>
      )}
      <div className={`app ${showLogin ? "dark" : ""}`}>
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route element={<ProtectedRouteForPlaceOrder />}>
            <Route path="/order" element={<PlaceOrder />} />
          </Route>

          <Route path="/verify" element={<Verify />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/order-history" element={<Orders />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
