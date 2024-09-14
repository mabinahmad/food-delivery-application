import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import "./FoodItem.css";
//========================================================

// Component to display an individual food item
//---------------------------------------------
export const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-image-container">
        <img className="food-item-image" src={image} alt="" />
      </div>
      <div className="food-item-information">
        <div className="food-item-name">
          <b>{name}</b>
        </div>
        <hr />
        <p className="food-item-description">{description}</p>
        <div className="price-and-add-to-cart">
          <p className="food-item-price">${price}</p>
          {!cartItems[id] ? (
            <b className="add-to-cart" onClick={() => addToCart(id)}>
              ADD TO CART
            </b>
          ) : (
            <div className="food-item-counter">
              {cartItems[id] === 1 ? (
                <RiDeleteBinLine
                  className="delete-cart-item"
                  onClick={() => removeFromCart(id)}
                />
              ) : (
                <FiMinus
                  className="minus"
                  onClick={() => removeFromCart(id)}
                  src={assets.remove_icon_red}
                  alt=""
                />
              )}
              <b>{cartItems[id]}</b>
              <IoMdAdd
                className="add"
                onClick={() => addToCart(id)}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
