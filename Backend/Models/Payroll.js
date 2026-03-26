import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    staff: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
    month: { type: String, required: true }, // e.g. "2026-03"
    basicSalary: { type: Number, required: true },
    deductions: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    netPay: { type: Number, required: true },
    paid: { type: Boolean, default: false },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);
