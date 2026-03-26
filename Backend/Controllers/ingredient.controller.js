import Ingredient from "../Models/Ingredient.js";

export const getAll = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .populate("unit", "name abbreviation")
      .populate("supplier", "name")
      .sort({ name: 1 });
    res.json(ingredients);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });
    res.json(ingredient);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
