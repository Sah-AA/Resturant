import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    joinDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
