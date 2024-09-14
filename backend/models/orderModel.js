import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderNumber: { type: String },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    status: { type: String },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, default: false },
    deliveredDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
