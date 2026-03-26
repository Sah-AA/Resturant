import Purchase from "../Models/Purchase.js";
import Ingredient from "../Models/Ingredient.js";

export const getAll = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("ingredient", "name")
      .populate("supplier", "name")
      .sort({ purchaseDate: -1 });
    res.json(purchases);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const { ingredient, quantity, unitCost, supplier, purchaseDate, note } = req.body;
    const totalCost = quantity * unitCost;
    const purchase = await Purchase.create({ ingredient, supplier, quantity, unitCost, totalCost, purchaseDate, note });

    // Update ingredient stock
    await Ingredient.findByIdAndUpdate(ingredient, { $inc: { stock: quantity } });

    res.status(201).json(purchase);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });
    // Deduct stock back
    await Ingredient.findByIdAndUpdate(purchase.ingredient, { $inc: { stock: -purchase.quantity } });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
