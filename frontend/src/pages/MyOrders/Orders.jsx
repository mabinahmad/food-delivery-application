import React, { useContext, useEffect, useState, useRef } from "react";
import { OrderContext } from "../../context/OrderContext";
import { TiTick } from "react-icons/ti";
import { LuPackageOpen } from "react-icons/lu";
import { FaCarSide } from "react-icons/fa";
import { RiCheckDoubleFill } from "react-icons/ri";
import { IoCopy } from "react-icons/io5";
import { IoCashOutline, IoCardOutline } from "react-icons/io5";
import { AiFillHome } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa6";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
//==========================================================================

export const Orders = () => {
  // Access orders, selected order, and token from context
  const { orders, select, setSelect, fetchOrders } = useContext(OrderContext);
  const { token } = useContext(UserContext);
  const navigate = useNavigate();
  // State to keep track of the currently selected order
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isCopied, setIsCopied] = useState(false);

  // Determine if the view is in mobile mode based on window width
  const isMobileView = window.innerWidth <= 992;

  // Ref to access the details container
  const detailsRef = useRef(null);

  // Function to handle when an order is clicked in the list
  //-------------------------------------------------------------
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setSelect(order);
  };

  // Function to handle clicking the back arrow (for mobile view)
  //--------------------------------------------------------------
  const handleArrowLeftClick = () => {
    setSelect(null);
  };

  // Function to format order date to show "Today", "Yesterday", or a short date format
  //-----------------------------------------------------------------------------------
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() == yesterday.toDateString()) {
      return "Yesterday";
    }

    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Function to copy the order number to the clipboard
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(selectedOrder.orderNumber);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // useEffect to set the first order as the selected order when the component mounts or orders change
  //------------------------------------------------------------------------------------------------
  useEffect(() => {
    if (orders?.length > 0) {
      setSelectedOrder(orders[0]);
    } else {
      setSelectedOrder(null);
    }
  }, [orders]);

  // useEffect to scroll the details container to the top when the selected order changes
  useEffect(() => {
    if (selectedOrder && isMobileView) {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedOrder, isMobileView]);

  return (
    <div className="orders" ref={detailsRef}>
      {token && <h1 className="orders-page-title">Orders</h1>}
      <div className="order-history">
        {orders?.length > 0 ? (
          <>
            {/* Left side: List of orders */}
            <div className={`left ${isMobileView && select ? "hide" : ""}`}>
              {orders.map((order) => (
                <div
                  className={`order-item ${
                    selectedOrder && selectedOrder._id === order._id
                      ? "selected-order"
                      : ""
                  }`}
                  key={order._id}
                  onClick={() => handleOrderClick(order)}
                >
                  <div className="order-first-row-container">
                    <p className="order-date">
                      {formatOrderDate(order.createdAt)}
                    </p>
                    <p className="order-amount">{`${order.amount} QR`}</p>
                  </div>

                  <p className="delivered-time">
                    {order.status !== "Delivered"
                      ? `Ordered at ${new Date(
                          order.createdAt
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`
                      : `Delivered at ${new Date(
                          order.deliveredDate
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}
                  </p>

                  <div className="order-items-container">
                    {order.items.map((item) => (
                      <div key={item._id} className="item-image">
                        <img src={item.image.secureUrl} alt={item.name} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* Right side: Details of the selected order */}
            <div
              className={`right ${isMobileView && select ? "selected" : ""}`}
            >
              <FaArrowLeft
                onClick={handleArrowLeftClick}
                className="arrow-left"
              />

              {selectedOrder && (
                <div className="order-details">
                  <div className="delivery-information">
                    <div className="order-status">
                      <p className="status-text">{selectedOrder.status}</p>

                      {selectedOrder.status === "Delivered" && (
                        <p className="delivered-time">{`Delivered at ${new Date(
                          selectedOrder.deliveredDate
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}`}</p>
                      )}
                    </div>
                    <div className="order-status-icons">
                      <div
                        className={`order-placed status-icon ${
                          [
                            "Food Processing",
                            "Out for delivery",
                            "Delivered",
                          ].includes(selectedOrder.status)
                            ? "active"
                            : ""
                        }`}
                      >
                        <TiTick className="order-status-icon" />
                      </div>
                      <div
                        className={`food-processing status-icon ${
                          [
                            "Food Processing",
                            "Out for delivery",
                            "Delivered",
                          ].includes(selectedOrder.status)
                            ? "active"
                            : ""
                        }`}
                      >
                        <LuPackageOpen className="order-status-icon" />
                      </div>
                      <div
                        className={`out-for-delivery status-icon ${
                          ["Out for delivery", "Delivered"].includes(
                            selectedOrder.status
                          )
                            ? "active"
                            : ""
                        }`}
                      >
                        <FaCarSide className="order-status-icon" />
                      </div>
                      <div
                        className={`delivery status-icon ${
                          selectedOrder.status === "Delivered" ? "active" : ""
                        }`}
                      >
                        <RiCheckDoubleFill className="order-status-icon" />
                      </div>
                    </div>
                  </div>
                  <div className="order-items-container">
                    <div className="your-order-and-order-number">
                      <p className="title-text-your-order">Your Order</p>
                      <p className="order-number" onClick={copyOrderNumber}>
                        <span> {selectedOrder.orderNumber}</span>
                        <span>
                          <IoCopy
                            title={isCopied ? "copied" : "Copy Order Number"}
                            className="copy-icon"
                          />
                        </span>
                        {isCopied && <span className="tooltip">Copied!</span>}
                      </p>
                    </div>
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="order-item-details">
                        <div className="item-name-and-image flex">
                          <img src={item.image.secureUrl} alt={item.name} />
                          <p>{item.name}</p>
                        </div>

                        <p className="price-and-quantity">
                          <span className="item-price">{`${item.price} QR`}</span>
                          <span className="item-quantity">{`x${item.quantity} pcs`}</span>
                        </p>
                      </div>
                    ))}
                    <hr />
                    <div className="total">
                      <div className="items-amount">
                        <span>Items</span>
                        <span>{`${selectedOrder.amount} QR`}</span>
                      </div>
                      <hr />
                      <div className="delivery-charge">
                        <span>Delivery</span>
                        <span>00.00 QR</span>
                      </div>
                      <hr />
                      <div className="paid-amount-container">
                        <p className="paid-amount">{` ${
                          selectedOrder.payment === true ? "Paid" : "Not Paid"
                        }  ${selectedOrder.amount} QR`}</p>
                        <p className="paid-method">
                          {selectedOrder.paymentMethod === "cash" ? (
                            <>
                              <span>
                                <IoCashOutline className="cash-icon" />
                              </span>
                              <span>Cash</span>
                            </>
                          ) : (
                            <>
                              <span>
                                <IoCardOutline className="card-icon" />
                              </span>
                              <span>Card</span>
                            </>
                          )}
                        </p>
                      </div>
                      <hr />
                    </div>
                    <div className="delivered-location">
                      <span>
                        <AiFillHome className="location-icon" />
                      </span>
                      <div className="delivered-address">
                        <p>{selectedOrder.address?.street}</p>
                        <p>{selectedOrder.address?.streetNumber}</p>
                        <p>{selectedOrder.address?.buildingNumber}</p>
                        <p>{selectedOrder.address?.city}</p>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : token ? (
          <p className="no-orders-text">You have no orders.</p>
        ) : (
          <p className="signin-orders-text">Sign in to see your orders</p>
        )}
      </div>
    </div>
  );
};
