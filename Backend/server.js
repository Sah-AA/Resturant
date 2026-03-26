import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// Routes
import authRoutes from "./Routes/auth.route.js";
import categoryRoutes from "./Routes/category.route.js";
import unitRoutes from "./Routes/unit.route.js";
import menuRoutes from "./Routes/menu.route.js";
import roomRoutes from "./Routes/room.route.js";
import orderRoutes from "./Routes/order.route.js";
import discountRoutes from "./Routes/discount.route.js";
import staffRoutes from "./Routes/staff.route.js";
import payrollRoutes from "./Routes/payroll.route.js";
import supplierRoutes from "./Routes/supplier.route.js";
import ingredientRoutes from "./Routes/ingredient.route.js";
import purchaseRoutes from "./Routes/purchase.route.js";
import creditRoutes from "./Routes/credit.route.js";
import printerRoutes from "./Routes/printer.route.js";
import settingsRoutes from "./Routes/settings.route.js";
import dashboardRoutes from "./Routes/dashboard.route.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = new Set(
  (process.env.CLIENT_URL || "http://localhost:3000,http://localhost:3002")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
);
// Ensure localhost:3002 is always allowed for the Vite frontend
allowedOrigins.add("http://localhost:3002");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin or tools like curl
    if (allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Handle preflight for any route (use RegExp to avoid path-to-regexp wildcard issues on Express 5)
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/categories",  categoryRoutes);
app.use("/api/units",       unitRoutes);
app.use("/api/menu",        menuRoutes);
app.use("/api/rooms",       roomRoutes);
app.use("/api/orders",      orderRoutes);
app.use("/api/discounts",   discountRoutes);
app.use("/api/staff",       staffRoutes);
app.use("/api/payroll",     payrollRoutes);
app.use("/api/suppliers",   supplierRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/purchases",   purchaseRoutes);
app.use("/api/credits",     creditRoutes);
app.use("/api/printers",    printerRoutes);
app.use("/api/settings",    settingsRoutes);
app.use("/api/dashboard",   dashboardRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

// ── Connect DB + Start Server ─────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
