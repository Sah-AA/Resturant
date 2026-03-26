import mongoose from "mongoose";

const creditSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paid: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    note: { type: String, default: "" },
    settled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Credit", creditSchema);
