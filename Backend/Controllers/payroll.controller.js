import Payroll from "../Models/Payroll.js";

export const getAll = async (req, res) => {
  try {
    const { month } = req.query;
    const filter = month ? { month } : {};
    const payrolls = await Payroll.find(filter)
      .populate({ path: "staff", populate: { path: "user", select: "name email" } })
      .sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const { staff, month, basicSalary, deductions = 0, bonus = 0 } = req.body;
    const netPay = basicSalary - deductions + bonus;
    const payroll = await Payroll.create({ staff, month, basicSalary, deductions, bonus, netPay });
    res.status(201).json(payroll);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const markPaid = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      { paid: true, paidAt: new Date() },
      { new: true }
    );
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.json(payroll);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
