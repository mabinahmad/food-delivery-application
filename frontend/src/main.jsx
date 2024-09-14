import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { StoreContextProvider } from "./context/StoreContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { OrderProvider } from "./context/OrderContext.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import "./index.css";
//=================================================================

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <UserProvider>
        <OrderProvider>
          <StoreContextProvider>
            <App />
          </StoreContextProvider>
        </OrderProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
