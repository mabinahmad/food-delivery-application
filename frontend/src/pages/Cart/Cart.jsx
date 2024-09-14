import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { RiDeleteBinLine } from "react-icons/ri";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./Cart.css";
import { UserContext } from "../../context/UserContext";

export const Cart = () => {
  // Access cart-related data and functions from the StoreContext
  const { cartItems, foodList, removeFromCart, getTotalCartAmount } =
    useContext(StoreContext);

  const { token, setShowLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (token) {
      navigate("/order");
    } else {
      setShowLogin(true);
    }
  };

  // Check if the cart is empty by verifying if there are no items or if no food items in the list have a quantity greater than 0
  const isCartEmpty =
    Object.keys(cartItems).length === 0 ||
    !foodList.some((item) => cartItems[item._id] > 0);

  return (
    <div className="cart">
      {isCartEmpty ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />

            {foodList.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div
                    key={item._id}
                    className="cart-items-title cart-items-item"
                  >
                    <img src={item.image.secureUrl} alt="" />
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>${item.price * cartItems[item._id]}</p>
                    <p
                      onClick={() => removeFromCart(item._id)}
                      className="remove-button"
                    >
                      <RiDeleteBinLine className="cart-remove-icon" />
                    </p>
                  </div>
                );
              }
            })}
          </div>
          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>00.00 QR</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>
                    ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}
                  </b>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="proceed-to-checkout-button"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>

            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, Enter it here</p>
                <div className="cart-promocode-input">
                  <input type="text" placeholder="promo code" />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
};
