import Staff from "../Models/Staff.js";
import User from "../Models/User.js";

export const getAll = async (req, res) => {
  try {
    const staff = await Staff.find().populate("user", "name email role").sort({ createdAt: -1 });
    res.json(staff);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    // Create user account + staff record together
    const { name, email, password, role, position, salary, joinDate } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ name, email, password, role: role || "cashier" });
    const staff = await Staff.create({ user: user._id, position, salary, joinDate });

    const populated = await staff.populate("user", "name email role");
    res.status(201).json(populated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("user", "name email role");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
