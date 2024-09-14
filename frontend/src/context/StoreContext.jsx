import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
//========================================================================

// API endpoints for food list, search, and food category list
//-------------------------------------------------------------------------------------
const API_FOOD_LIST = import.meta.env.VITE_API_FOOD_LIST;
const API_FOOD_SEARCH = import.meta.env.VITE_API_FOOD_SEARCH;
const API_FOOD_CATEGORY_LIST = import.meta.env.VITE_API_FOOD_CATEGORY_LIST;
//--------------------------------------------------------------------------------------

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(
    () => JSON.parse(localStorage.getItem("cartProducts")) || {}
  );

  const [foodList, setFoodList] = useState([]);
  const [foodCategoryList, setFoodCategoryList] = useState([]);
  const { token } = useContext(UserContext);

  // States to manage the search input value and store the resulting movie list
  //----------------------------------------------------------------------------
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchedFoodList, setSearchedFoodList] = useState([]);

  const foodDisplayRef = useRef(null);
  const menuRef = useRef(null);

  // Function to update search input value
  //-----------------------------------------------------
  const handleChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  // Fetch the complete list of food items from the API
  //-----------------------------------------------------
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(API_FOOD_LIST);

      if (response.data && response.data.data) {
        setFoodList(response.data.data);
        if (!searchInputValue) {
          setSearchedFoodList(response.data.data);
        }
      } else {
      }
    } catch (error) {}
  };

  // Fetch the list of food items that match the search query from the API
  //-----------------------------------------------------------------------
  const fetchSearchedFoods = async () => {
    try {
      const response = await axios.get(API_FOOD_SEARCH, {
        params: {
          query: searchInputValue,
        },
      });
      setSearchedFoodList(response.data.foods);
    } catch (error) {}
  };

  // Fetch the complete list of food categories from the API
  //-----------------------------------------------------
  const fetchFoodCategories = async () => {
    try {
      const response = await axios(API_FOOD_CATEGORY_LIST);
      setFoodCategoryList(response.data);
    } catch (error) {}
  };

  // Add an item to the cart and update the cart
  //-------------------------------------------------
  const addToCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    if (!updatedCart[itemId]) {
      updatedCart[itemId] = 1;
    } else {
      updatedCart[itemId] += 1;
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

    // Update the local state
    setCartItems(updatedCart);
  };

  // Remove an item from the cart and update the cart
  //------------------------------------------------------------------------------------------
  const removeFromCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] > 1) {
      updatedCart[itemId] -= 1;
    } else {
      delete updatedCart[itemId];
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));

    // Update the local state
    setCartItems(updatedCart);
  };

  // Calculate the total amount of the items in the cart
  //------------------------------------------------------
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInformation = foodList.find((product) => product._id === item);
        if (itemInformation) {
          totalAmount += itemInformation.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    fetchFoodList();
    fetchFoodCategories();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInputValue) {
        fetchSearchedFoods();
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchInputValue]);

  // Clear the search input and reset the searched food list
  //----------------------------------------------------------
  const clearInput = () => {
    setSearchInputValue("");
    setSearchedFoodList([]);
  };

  // Object containing all the state and functions to be shared across the app
  const contextValue = {
    foodList,
    cartItems,
    foodCategoryList,
    setFoodCategoryList,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    searchInputValue,
    setSearchInputValue,
    searchedFoodList,
    handleChange,
    clearInput,
    foodDisplayRef,
    menuRef,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
