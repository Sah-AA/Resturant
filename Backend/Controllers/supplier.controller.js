import Supplier from "../Models/Supplier.js";

export const getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.find({ active: true }).sort({ name: 1 });
    res.json(suppliers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!supplier) return res.status(404).json({ message: "Supplier not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
