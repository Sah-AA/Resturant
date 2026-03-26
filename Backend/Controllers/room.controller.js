import Room from "../Models/Room.js";

export const getAll = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ name: 1 });
    res.json(rooms);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

export const create = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const update = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

export const remove = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/rooms/:roomId/tables/:tableId/status
export const updateTableStatus = async (req, res) => {
  try {
    const { roomId, tableId } = req.params;
    const { status } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    const table = room.tables.id(tableId);
    if (!table) return res.status(404).json({ message: "Table not found" });
    table.status = status;
    await room.save();
    res.json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
