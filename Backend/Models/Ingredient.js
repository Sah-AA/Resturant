import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    stock: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Ingredient", ingredientSchema);
