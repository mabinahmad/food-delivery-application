import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

// API endpoint for fetching user orders
//-------------------------------------------------------------
const API_USER_ORDERS = import.meta.env.VITE_API_USER_ORDERS;
//-------------------------------------------------------------

// Create a context for managing orders
export const OrderContext = createContext();

// OrderProvider component to manage and provide order-related data to the application
export const OrderProvider = ({ children }) => {
  const { token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [select, setSelect] = useState(null);
  //States for modal
  const [orderDetails, setOrderDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();
  // Function to fetch orders from the API
  //----------------------------------------
  const fetchOrders = async () => {
    const response = await axios(API_USER_ORDERS, {
      headers: { Authorization: token },
    });

    // Sort the orders by creation date in descending order (newest first)
    const sortedOrders = response?.data?.data?.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setOrders(sortedOrders);
  };
  // Function to close modal
  const closeModal = () => setModalIsOpen(false);

  // Navigate to order history when "Track Order" button is clicked
  const handleTrackOrder = () => {
    closeModal();
    navigate("/order-history");
  };
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        fetchOrders,
        select,
        setSelect,
        orderDetails,
        setOrderDetails,
        handleTrackOrder,
        closeModal,
        modalIsOpen,
        setModalIsOpen,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
