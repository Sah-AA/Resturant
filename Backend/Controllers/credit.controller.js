import Credit from "../Models/Credit.js";

export const getAll = async (req, res) => {
  try {
    const credits = await Credit.find()
      .populate("order", "totalAmount createdAt")
      .sort({ createdAt: -1 });
    res.json(credits);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const { customerName, amount, order, note } = req.body;
    const credit = await Credit.create({ customerName, amount, remaining: amount, order, note });
    res.status(201).json(credit);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const settle = async (req, res) => {
  try {
    const { amount } = req.body;
    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ message: "Credit not found" });

    credit.paid += amount;
    credit.remaining = credit.amount - credit.paid;
    if (credit.remaining <= 0) { credit.remaining = 0; credit.settled = true; }
    await credit.save();
    res.json(credit);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const credit = await Credit.findByIdAndDelete(req.params.id);
    if (!credit) return res.status(404).json({ message: "Credit not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
