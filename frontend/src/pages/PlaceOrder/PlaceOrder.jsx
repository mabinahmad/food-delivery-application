import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentMethod } from "../../components/PaymentMenthod/PaymentMethod";
import { StoreContext } from "../../context/StoreContext";
import { OrderContext } from "../../context/OrderContext";
import { UserContext } from "../../context/UserContext";
import { AddressForm } from "../../components/AddressForm/AddressForm";
import { FaLocationDot } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./PlaceOrder.css";
//=============================================================================

// API endpoints for adding an address, placing an order, and deleting a cart
//-----------------------------------------------------------------------------
const API_ADDRESS_ADD = import.meta.env.VITE_API_ADDRESS_ADD;
const API_ORDER_PLACE = import.meta.env.VITE_API_ORDER_PLACE;
const API_UPDATE_ADDRESS_STATUS = import.meta.env
  .VITE_API_UPDATE_ADDRESS_STATUS;
//-----------------------------------------------------------------------------

export const PlaceOrder = () => {
  // Destructuring from contexts
  //------------------------------------------------------------------------------
  const { getTotalCartAmount, token, foodList, cartItems, setCartItems } =
    useContext(StoreContext);
  const { fetchOrders, setOrderDetails, setModalIsOpen } =
    useContext(OrderContext);
  const { savedAddresses, setSavedAddresses, getSavedAddresses } =
    useContext(UserContext);

  // State management for selected address, form visibility, payment method, and error message
  //-------------------------------------------------------------------------------------------
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentError, setPaymentError] = useState(false);
  const [validationError, setValidationError] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    streetNumber: "",
    buildingNumber: "",
    zone: "",
    city: "",
  });

  const navigate = useNavigate();

  const checkValidationError = (address, formData) => {
    // Determine if there is a validation error
    if (
      !address &&
      (!formData.firstName ||
        !formData.phone ||
        !formData.streetNumber ||
        !formData.buildingNumber ||
        !formData.city)
    ) {
      return true;
    }
    return false;
  };

  // Handler for input changes in the address form
  //--------------------------------------------------
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => {
      const updatedData = { ...data, [name]: value };
      // Clear or set validation error based on the updated form data
      setValidationError(checkValidationError(selectedAddress, updatedData));
      return updatedData;
    });
  };

  // Handler for changing the selected payment method
  //---------------------------------------------------
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentError(false);
  };

  // Handler to show the delivery form for adding a new address
  //-------------------------------------------------------------
  const handleDeliveryForm = () => {
    setShowAddressForm(true);
    setSelectedAddress(null);
  };

  // Handler for selecting a saved address
  //----------------------------------------------------
  const handleAddressSelect = (addressId) => {
    setSelectedAddress(addressId);
    setData({
      firstName: "",
      lastName: "",
      phone: "",
      street: "",
      streetNumber: "",
      buildingNumber: "",
      zone: "",
      city: "",
    });
    setShowAddressForm(false);
    setValidationError(false);
  };

  // Function to place the order
  //---------------------------------------------------------
  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];

    // Create the orderItems array based on the cart items
    foodList.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    if (
      !selectedAddress &&
      (!data.firstName ||
        !data.phone ||
        !data.streetNumber ||
        !data.buildingNumber ||
        !data.city)
    ) {
      setValidationError(true);
      return;
    }
    if (!selectedPaymentMethod) {
      setPaymentError(true);
      return;
    }

    try {
      let addressId;

      // If an address is selected, use it, otherwise create a new address
      if (selectedAddress) {
        addressId = selectedAddress;
      } else {
        let addressResponse = await axios.post(API_ADDRESS_ADD, data, {
          headers: {
            Authorization: token,
          },
        });
        if (!addressResponse.data.success) {
          return toast.error("Error");
        }
        addressId = addressResponse.data.address._id;
      }

      // Prepare order data
      let orderData = {
        address: addressId,
        items: orderItems,
        amount: getTotalCartAmount(),
        paymentMethod: selectedPaymentMethod,
      };

      // Place order based on the payment method
      if (selectedPaymentMethod === "cash") {
        let response = await axios.post(API_ORDER_PLACE, orderData, {
          headers: { Authorization: token },
        });

        if (response.data.success) {
          setOrderDetails(response.data.data.updatedOrder);
          setModalIsOpen(true);
          // Clear the cart after placing the order
          localStorage.removeItem("cartProducts");
          setCartItems({});
          fetchOrders();
          getSavedAddresses();
          navigate("/");
        } else {
          toast.error("Error");
        }
      } else if (selectedPaymentMethod === "card") {
        let response = await axios.post(API_ORDER_PLACE, orderData, {
          headers: { Authorization: token },
        });
        console.log("place order response", response);
        if (response.data.success && response.data.session_url) {
          // Redirect to Stripe payment page
          window.location.replace(response.data.session_url);

          getSavedAddresses();
        } else {
          toast.error("Error");
        }
      }
    } catch (error) {
      toast.error("Failed to place order ");
    }
  };

  //Function for deleting saved address
  //-------------------------------------------------
  const handleDeleteAddress = async (addressId) => {
    const response = await axios.put(
      API_UPDATE_ADDRESS_STATUS,
      { addressId },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.data.success) {
      setSavedAddresses(response.data.addresses);
      setSelectedAddress(null);
    }
  };

  useEffect(() => {
    if (savedAddresses.length > 0) {
      setSelectedAddress(savedAddresses[0]._id);
    }
  }, [savedAddresses]);

  return (
    <>
      <ToastContainer />

      {/* Place order form */}
      <form onSubmit={placeOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery information</p>
          <>
            {savedAddresses.map((address) => (
              <div
                key={address._id}
                className={`saved-address ${
                  selectedAddress === address._id ? "selected" : ""
                }`}
              >
                <label>
                  <input
                    type="radio"
                    name="address"
                    value={address._id}
                    onChange={() => handleAddressSelect(address._id)}
                    checked={selectedAddress === address._id}
                  />

                  <span>
                    <FaLocationDot className="location-icon" />
                  </span>
                  <div>
                    <div>
                      <span>{address.city}, </span>
                      <span>{address.street},</span>
                    </div>

                    <div>
                      <span>Street: {address.streetNumber}, </span>
                      <span>Building: {address.buildingNumber}</span>
                    </div>
                  </div>
                </label>{" "}
                <MdDelete
                  className="location-delete-icon"
                  onClick={() => handleDeleteAddress(address._id)}
                />
              </div>
            ))}

            {!showAddressForm && (
              <button
                type="button"
                onClick={handleDeliveryForm}
                className="add-new-address-button"
              >
                + Add new address
              </button>
            )}
          </>
          {showAddressForm == true && (
            <AddressForm data={data} onChangeHandler={onChangeHandler} />
          )}
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>{getTotalCartAmount()} QR</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>

                <p>00.00 QR</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount()}</b>
              </div>
              <hr />
              <PaymentMethod
                onPaymentChange={handlePaymentMethodChange}
                selectedPaymentMethod={selectedPaymentMethod}
              />
              {paymentError && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  Please select a payment method.
                </p>
              )}
              {validationError && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  Please complete the address form
                </p>
              )}
            </div>
            <button type="submit" className="place-order-button">
              Place Order
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
