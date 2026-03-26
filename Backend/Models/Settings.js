import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    restaurantName: { type: String, default: "My Restaurant" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    taxRate: { type: Number, default: 0 },          // percentage e.g. 5
    taxName: { type: String, default: "Tax" },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    receiptFooter: { type: String, default: "Thank you for dining with us!" },
    financialYearStart: { type: String, default: "04" }, // month "04" = April
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
