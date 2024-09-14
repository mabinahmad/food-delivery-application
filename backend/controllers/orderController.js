import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
//========================================================

const frontend_url = process.env.FRONT_END_URL;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to generate a unique order number
//--------------------------------------------
const generateOrderNumber = () => {
  // Create a date part from the current year and month
  const datePart =
    new Date().getFullYear().toString().slice(-2) +
    (new Date().getMonth() + 1).toString().padStart(2, "0");
  // Generate a random 4-digit number
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  // Combine date and random parts to form the order number
  return `${datePart}-${randomPart}`;
};

// Function to place a new order
//---------------------------------------------
const placeOrder = async (req, res) => {
  // URL for redirecting after payment
  const userId = req.userId;
  try {
    // Generate a unique order number
    const orderNumber = generateOrderNumber();
    let status = "Food Processing";
    if (req.body.paymentMethod === "card") {
      status = "Pending";
    }

    // Create order data object
    const orderData = {
      userId: userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      orderNumber: orderNumber,
      paymentMethod: req.body.paymentMethod,
      payment: false,
      status: status,
    };

    // Handle cash payment
    if (req.body.paymentMethod === "cash") {
      const newOrder = new orderModel(orderData);
      await newOrder.save();
      const updatedOrder = await orderModel
        .findOne({
          userId: req.userId,
          status: { $ne: "Pending" },
        })
        .sort({ createdAt: -1 })
        .populate("address");

      return res.json({
        success: true,
        data: { updatedOrder },
        message: "Order placed successfully!",
      });
    } else if (req.body.paymentMethod === "card") {
      const newOrder = new orderModel(orderData);
      await newOrder.save();

      // Create a Stripe checkout session
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: "qar",
          product_data: {
            name: item.name,
          },

          unit_amount: item.price * 100, // Amount in cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      });

      // Respond with the session URL for redirection
      res.json({
        success: true,
        session_url: session.url,
        session_id: session.id,
      });
    }
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Function to verify the order payment
//--------------------------------------------------
const verifyOrder = async (req, res) => {
  const { orderId, success, sessionId } = req.body;

  try {
    if (success == "true") {
      // Retrieve the Stripe session to confirm payment status
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        // Update order status to "paid" if payment is confirmed
        await orderModel.findByIdAndUpdate(orderId, {
          payment: true,
          status: "Food Processing",
        });

        const updatedOrder = await orderModel
          .findById(orderId)
          .populate("address");

        res.json({
          success: true,
          data: { updatedOrder },
          message: "Order Placed Successfuly",
        });
      } else {
        res.json({ success: false, message: "Payment failed" });
      }
    } else {
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//Function to get orders for a specific user
//-------------------------------------------------
const getUserOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        userId: req.userId,
        status: { $ne: "Pending" },
      })
      .populate("address");
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//Function to list all orders
//-------------------------------------------
const listOrders = async (req, res) => {
  try {
    // Find all orders excluding those with status "Pending"
    const orders = await orderModel
      .find({ status: { $ne: "Pending" } })
      .populate("address");
    res.json({ success: true, data: orders });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//Function to update order status
//-------------------------------------------
const updateStatus = async (req, res) => {
  try {
    const updateFields = {
      status: req.body.status,
      deliveredDate: Date.now(),
    };
    if (req.body.status === "Delivered") {
      updateFields.payment = true;
    }
    await orderModel.findByIdAndUpdate(req.body.orderId, updateFields, {
      new: true,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, getUserOrders, listOrders, updateStatus };
