import Order from "../Models/Order.js";
import MenuItem from "../Models/MenuItem.js";
import Staff from "../Models/Staff.js";
import Purchase from "../Models/Purchase.js";

export const getSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's orders
    const todayOrders = await Order.find({
      status: "completed",
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // This month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = await Order.find({
      status: "completed",
      createdAt: { $gte: monthStart },
    });
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Counts
    const totalOrders = await Order.countDocuments({ status: "completed" });
    const openOrders = await Order.countDocuments({ status: "open" });
    const totalStaff = await Staff.countDocuments({ active: true });
    const totalMenuItems = await MenuItem.countDocuments({ available: true });

    // Monthly revenue chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Order.aggregate([
      { $match: { status: "completed", createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top selling items
    const topItems = await Order.aggregate([
      { $match: { status: "completed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      todayRevenue,
      todayOrders: todayOrders.length,
      monthRevenue,
      monthOrders: monthOrders.length,
      totalOrders,
      openOrders,
      totalStaff,
      totalMenuItems,
      revenueByMonth,
      topItems,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
