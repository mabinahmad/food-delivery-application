import Modal from "react-modal";
import { OrderContext } from "../../context/OrderContext";
import { IoIosCheckmark } from "react-icons/io";
import { useContext } from "react";

// Sets the root element for accessibility
Modal.setAppElement("#root");

//Modal
export const OrderSuccessModal = () => {
  const { modalIsOpen, closeModal, orderDetails, handleTrackOrder } =
    useContext(OrderContext);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Order Success Modal"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <p className="modal-date">
        {new Date(orderDetails?.updatedAt).toLocaleString()}
      </p>

      <IoIosCheckmark className="order-success-icon" />

      <b className="modal-amount">{orderDetails?.amount} QR</b>
      <p>Order placed successfuly</p>
      <button className="track-order-button" onClick={handleTrackOrder}>
        Track Order
      </button>
    </Modal>
  );
};
