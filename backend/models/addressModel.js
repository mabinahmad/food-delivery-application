import mongoose from "mongoose";

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, required: true },
    buildingNumber: { type: String, required: true },
    street: { type: String },
    streetNumber: { type: String, required: true },
    city: { type: String, required: true },
    zone: { type: String },
    status: { type: String },
  },
  { timestamps: true }
);

const addressModel = mongoose.model("Address", addressSchema);
export default addressModel;
