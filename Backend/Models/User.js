import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // Keep "accountant" temporarily for backward compatibility with existing users.
    role: { type: String, enum: ["admin", "cashier", "account", "accountant"], default: "cashier" },
  },
  { timestamps: true }
);

// Hash password before saving. In Mongoose 9 async middleware should not call next().
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
