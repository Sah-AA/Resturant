import Order from "../Models/Order.js";
import Room from "../Models/Room.js";
import Settings from "../Models/Settings.js";

export const getAll = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.createdAt = { $gte: start, $lt: end };
    }
    const orders = await Order.find(filter)
      .populate("cashier", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("cashier", "name");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const taxRate = settings?.taxRate || 0;

    const { items, discount = 0, orderType, tableId, roomId, note, paymentMethod } = req.body;

    const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
    const tax = parseFloat(((subtotal - discount) * taxRate / 100).toFixed(2));
    const totalAmount = parseFloat((subtotal - discount + tax).toFixed(2));

    const order = await Order.create({
      items,
      subtotal,
      discount,
      tax,
      totalAmount,
      orderType,
      tableId,
      roomId,
      note,
      paymentMethod,
      cashier: req.user.id,
    });

    // Mark table as occupied
    if (roomId && tableId) {
      const room = await Room.findById(roomId);
      if (room) {
        const table = room.tables.id(tableId);
        if (table) { table.status = "occupied"; await room.save(); }
      }
    }

    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const closeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "completed";
    if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;
    await order.save();

    // Free the table
    if (order.roomId && order.tableId) {
      const room = await Room.findById(order.roomId);
      if (room) {
        const table = room.tables.id(order.tableId);
        if (table) { table.status = "open"; await room.save(); }
      }
    }

    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = "cancelled";
    await order.save();

    // Free the table
    if (order.roomId && order.tableId) {
      const room = await Room.findById(order.roomId);
      if (room) {
        const table = room.tables.id(order.tableId);
        if (table) { table.status = "open"; await room.save(); }
      }
    }
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
