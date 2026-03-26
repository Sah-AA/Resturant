import Printer from "../Models/Printer.js";

export const getAll = async (req, res) => {
  try {
    const printers = await Printer.find().sort({ name: 1 });
    res.json(printers);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const printer = await Printer.create(req.body);
    res.status(201).json(printer);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const printer = await Printer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!printer) return res.status(404).json({ message: "Printer not found" });
    res.json(printer);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const printer = await Printer.findByIdAndDelete(req.params.id);
    if (!printer) return res.status(404).json({ message: "Printer not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
