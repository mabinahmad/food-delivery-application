import { assets } from "../../assets/assets";
import "./PickupFromStore.css";
//=============================================================

// Functional component for the "PickupFromStore" section
//-------------------------------------------------------------
export const PickupFromStore = ({ scrollToFoodDisplay }) => {
  return (
    <div className="pickup-from-store" onClick={scrollToFoodDisplay}>
      <div className="description">
        <h2>PICK-UP FROM STORE</h2>
        <p>Beat the queue & place the order online!</p>
        <button>ORDER NOW</button>
      </div>
      <div className="order-online-route">
        <div className="icon-group">
          <img src={assets.order_online_icon} alt="" />
          <p>Order Online</p>
        </div>
        <div className="icon-group">
          <img src={assets.pickup_store_icon} alt="" />
          <p>Select Pickup</p>
        </div>
        <div className="icon-group">
          <img
            className="icon-get-notified"
            src={assets.food_ready_icon}
            alt=""
          />
          <p>Get Notified When Ready</p>
        </div>
      </div>
    </div>
  );
};
