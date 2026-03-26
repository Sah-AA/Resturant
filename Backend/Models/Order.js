import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderType: { type: String, enum: ["dine-in", "takeaway", "delivery"], default: "dine-in" },
    tableId: { type: String, default: null },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ["open", "completed", "cancelled"], default: "open" },
    paymentMethod: { type: String, enum: ["cash", "card", "credit", "other"], default: "cash" },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
