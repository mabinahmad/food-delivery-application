import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { StoreContext } from "../../context/StoreContext";
import { UserContext } from "../../context/UserContext";
import { BsBoxFill } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { OrderContext } from "../../context/OrderContext";
import "./Navbar.css";
export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home"); // Tracks the current menu
  const [isScrolled, setIsScrolled] = useState(false); // Tracks if the user has scrolled
  const { setSelect } = useContext(OrderContext);
  const {
    getTotalCartAmount,
    searchInputValue,
    setSearchInputValue,
    handleChange,
    clearInput,
    menuRef,
  } = useContext(StoreContext);
  const { token, currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the first letter of the user's name
  const firstLetter = currentUser?.data?.name?.charAt(0).toUpperCase();

  // Offset for smooth scrolling when navigating to sections
  const offset = 150;

  const handleMenu = (newMenu) => {
    setMenu(newMenu);
    setShowLogin(false);
    let ref = null;

    if (newMenu === "menu") {
      ref = menuRef;
    }

    // Offset for smooth scrolling when navigating to sections
    if (ref && ref.current) {
      const top =
        ref.current.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to handle clicking the cart icon
  //--------------------------------------------
  const handleCartClick = () => {
    setSearchInputValue("");
    setShowLogin(false);
    navigate("/cart");
  };

  // Function to handle "My Orders" navigation
  //-----------------------------------------------
  const handleMyOrders = () => {
    if (token) {
      setSearchInputValue("");
      setSelect(null);
      navigate("/order-history");
    } else {
      setSearchInputValue("");
      setShowLogin(true);
    }
  };

  const handleHomePage = () => {
    setShowLogin(false);
  };

  return (
    <div className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <Link to="/">
        <h1 onClick={handleHomePage} className="company-name">
          Theen
        </h1>
      </Link>
      <ul className="navbar-menu">
        {location.pathname != "/" && (
          <Link
            to="/"
            onClick={(event) => {
              handleMenu("home");
            }}
            className="nav-home "
          >
            Home
          </Link>
        )}

        {location.pathname !== "/cart" &&
          location.pathname !== "/order-history" &&
          location.pathname !== "/order" && (
            <li
              onClick={() => {
                handleMenu("menu");
              }}
              className={menu === "menu" ? "active" : ""}
            >
              Menu
            </li>
          )}
      </ul>

      <div className="search">
        <div className="search-container">
          <CiSearch className="search-icon" />
          <input
            type="text"
            value={searchInputValue}
            onChange={handleChange}
            placeholder="BBQ, Rolls, Pasta"
          />
          {searchInputValue && (
            <IoCloseOutline onClick={clearInput} className="clear-icon" />
          )}
        </div>
      </div>

      <div className="navbar-right">
        <div onClick={handleMyOrders} className="my-orders-nav">
          <span>
            <BsBoxFill className="box-icon" />
          </span>
          <span className="my-orders-text">My orders</span>
        </div>

        <div
          className={`navbar-cart-icon ${
            getTotalCartAmount() === 0 ? "" : "cart-not-empty"
          } ${!token ? "padding-style" : ""}`}
        >
          <Link
            to="/cart"
            onClick={(e) => {
              e.preventDefault();
              handleCartClick();
            }}
          >
            <div className="cart-icon-and-total">
              <FiShoppingCart
                className={`cart-icon ${
                  getTotalCartAmount() === 0 ? "" : "cart-not-empty"
                }`}
              />
              {getTotalCartAmount() > 0 && (
                <span className="cart-total-nav">
                  {getTotalCartAmount()} QR
                </span>
              )}
            </div>
          </Link>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)} className="sign-in-button">
            sign in
          </button>
        ) : (
          <div className="navbar-profile">
            <span className="user-first-letter">{firstLetter}</span>
            <ul className="navbar-profile-dropdown">
              <li onClick={handleMyOrders}>
                <BsBoxFill className="orders-box-icon" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <IoMdLogOut className="logout-icon" />
                <p className="logout-text">Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
