import axios from "axios";
import { useState, useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
//=================================================================

// API endpoints for fetching the current user and saved addresses
//-----------------------------------------------------------------
const API_CURRENT_USER = import.meta.env.VITE_API_CURRENT_USER;
const API_SAVED_ADDRESS = import.meta.env.VITE_API_SAVED_ADDRESS;
//-----------------------------------------------------------------

// Creating UserContext to provide user data across the application
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [token, setToken] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const navigate = useNavigate();

  // State to manage the visibility of the login popup
  const [showLogin, setShowLogin] = useState(false);

  // Function to retrieve the stored token from localStorage
  //---------------------------------------------------------
  const getToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  };

  // Function to log the user out
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  // Function to fetch the current user's data from the server
  //-----------------------------------------------------------
  const fetchCurrentUser = async () => {
    if (!token) return; // Don't fetch if there's no token

    try {
      const response = await axios.get(API_CURRENT_USER, {
        headers: {
          Authorization: token,
        },
      });
      setCurrentUser(response.data);
    } catch (error) {}
  };

  // Function to fetch the user's saved addresses
  //----------------------------------------------
  const getSavedAddresses = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_SAVED_ADDRESS, {
        headers: { Authorization: token },
      });
      setSavedAddresses(response.data.addresses);
    } catch (error) {}
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    fetchCurrentUser();
    getSavedAddresses();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        setToken,
        token,
        currentUser,
        setCurrentUser,
        savedAddresses,
        showLogin,
        setShowLogin,
        logout,
        getSavedAddresses,
        setSavedAddresses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
