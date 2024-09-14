import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Verify.css";
import { OrderContext } from "../../context/OrderContext";
import { StoreContext } from "../../context/StoreContext";

// API endpoint to verify the order/payment
//--------------------------------------------------------------
const API_ORDER_VERIFY = import.meta.env.VITE_API_ORDER_VERIFY;
//--------------------------------------------------------------

export const Verify = () => {
  const { setOrderDetails, fetchOrders, setModalIsOpen } =
    useContext(OrderContext);
  const { setCartItems } = useContext(StoreContext);
  // Extract search parameters from the URL
  //----------------------------------------------
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  const navigate = useNavigate();

  // Function to verify the payment with the backend
  //------------------------------------------------------
  const verifyPayment = async () => {
    const response = await axios.post(API_ORDER_VERIFY, {
      success,
      orderId,
      sessionId,
    });

    if (response.data.success) {
      // Store the updated order details
      setOrderDetails(response.data?.data.updatedOrder);
      // Clear the cart after placing the order
      localStorage.removeItem("cartProducts");
      setCartItems({});
      fetchOrders();
      setModalIsOpen(true);
      navigate("/");
    } else {
      // navigate("/cart");
    }
  };

  useEffect(() => {
    if ((!success, !orderId, !sessionId)) {
      navigate("/");
    } else {
      verifyPayment();
    }
  }, []);

  return <div className="verify">{/* <div className="spinner"></div> */}</div>;
};
