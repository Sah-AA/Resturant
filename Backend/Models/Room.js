import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true },
  status: { type: String, enum: ["open", "occupied"], default: "open" },
});

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    tables: [tableSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
