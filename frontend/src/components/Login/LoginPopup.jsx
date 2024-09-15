import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { IoClose } from "react-icons/io5";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//==========================================================

// Environment variable constants for API endpoints
//----------------------------------------------------------------
const API_USER_REGISTER = import.meta.env.VITE_API_USER_REGISTER;
const API_USER_LOGIN = import.meta.env.VITE_API_USER_LOGIN;
const API_URL = import.meta.env.VITE_API_URL;
//-----------------------------------------------------------------

export const LoginPopup = ({ setShowLogin }) => {
  // const { fetchCartData } = useContext(StoreContext);
  const { setToken, setCurrentUser } = useContext(UserContext);

  // State to toggle between login and signup forms
  const [currentState, setCurrentState] = useState("Login");

  // State to hold form data
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handler for input field changes
  //-------------------------------------
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  // Function to handle form submission
  //--------------------------------------
  const onLoginSubmit = async (event) => {
    event.preventDefault();

    let newUrl = API_URL;
    // Determine the API URL based on the form state (Login or Signup)
    if (currentState === "Login") {
      newUrl = API_USER_LOGIN;
    } else {
      newUrl = API_USER_REGISTER;
    }

    try {
      // Send the form data to the appropriate API endpoint
      const response = await axios.post(newUrl, data);
      // If the response indicates success, update user information and close the popup
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setCurrentUser(response.data.user);
        // fetchCartData(response.data.token);
        setShowLogin(false);
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request.");
    }
  };

  const handleLoginClose = () => {
    navigate("/");
    setShowLogin(false);
  };

  const handleSignup = () => {
    setCurrentState("Sign Up");
    setData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleLogin = () => {
    setCurrentState("Login");
    setData({
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="login-popup">
      <ToastContainer />
      <form onSubmit={onLoginSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <IoClose
            onClick={handleLoginClose}
            style={{ fontSize: "30px", cursor: "pointer" }}
          />
        </div>

        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          {currentState === "Sign Up" && (
            <p>Password must be atleast 4 characters</p>
          )}
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {currentState === "Login" ? (
          <p>
            Create a new account? <span onClick={handleSignup}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={handleLogin}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};
