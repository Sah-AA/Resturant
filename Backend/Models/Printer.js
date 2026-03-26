import mongoose from "mongoose";

const printerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ipAddress: { type: String, required: true },
    type: { type: String, enum: ["kitchen", "receipt"], default: "receipt" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Printer", printerSchema);
