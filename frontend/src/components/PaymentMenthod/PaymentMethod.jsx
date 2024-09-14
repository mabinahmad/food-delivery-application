import { IoCashOutline, IoCardOutline } from "react-icons/io5";
import "./PaymentMethod.css";
//==============================================================

// Functional component for choosing a payment method
//-----------------------------------------------------------------------------
export const PaymentMethod = ({ onPaymentChange, selectedPaymentMethod }) => {
  return (
    <div className="payment-method">
      <div
        className={`payment-option ${
          selectedPaymentMethod === "cash" ? "selected" : ""
        }`}
        onClick={() => onPaymentChange("cash")}
      >
        <span className="cash icon ">
          <IoCashOutline />
        </span>
        <span className="method-name">Cash</span>
        <input
          type="radio"
          name="paymentMethod"
          value="cash"
          checked={selectedPaymentMethod === "cash"}
          onChange={() => onPaymentChange("cash")}
        />
      </div>
      <div
        className={`payment-option ${
          selectedPaymentMethod === "card" ? "selected" : ""
        }`}
        onClick={() => onPaymentChange("card")}
      >
        <span className="card icon">
          <IoCardOutline />
        </span>
        <span className="method-name">Card</span>
        <input
          type="radio"
          name="paymentMethod"
          value="card"
          checked={selectedPaymentMethod === "card"}
          onChange={() => onPaymentChange("card")} 
        />
      </div>
    </div>
  );
};
