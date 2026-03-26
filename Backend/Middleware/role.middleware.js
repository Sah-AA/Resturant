export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const normalizeRole = (role) => {
      if (role === "user") return "cashier";
      if (role === "accountant") return "account";
      return role;
    };

    const userRole = normalizeRole(req.user.role);
    const allowedRoles = roles.map(normalizeRole);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: `Access denied. Required role: ${roles.join(" or ")}` });
    }
    next();
  };
};
