import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export const ProtectedRouteForPlaceOrder = () => {
  const { cartItems } = useContext(StoreContext);
  const token = localStorage.getItem("token");
  return !(Object.keys(cartItems).length === 0) && token ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};
