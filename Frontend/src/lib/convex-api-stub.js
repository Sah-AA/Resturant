// Local stub replacing Convex generated API. Data is kept in-memory to keep
// the UI functional without an external Convex backend.
const uid = (() => {
  let i = 1;
  return () => `id_${i++}`;
})();

const db = {
  accountsTree: [
    {
      _id: "acc-assets",
      code: "1000",
      name: "Assets",
      type: "asset",
      currentBalance: 150000,
      openingBalance: 130000,
      children: [
        { _id: "acc-cash", code: "1010", name: "Cash", type: "asset", openingBalance: 30000, currentBalance: 35000, children: [] },
        { _id: "acc-bank", code: "1020", name: "Bank", type: "asset", openingBalance: 50000, currentBalance: 65000, children: [] },
        { _id: "acc-inventory", code: "1100", name: "Inventory", type: "asset", openingBalance: 40000, currentBalance: 50000, children: [] },
      ],
    },
    {
      _id: "acc-liabilities",
      code: "2000",
      name: "Liabilities",
      type: "liability",
      currentBalance: 70000,
      openingBalance: 65000,
      children: [
        { _id: "acc-ap", code: "2010", name: "Accounts Payable", type: "liability", openingBalance: 30000, currentBalance: 28000, children: [] },
        { _id: "acc-loan", code: "2100", name: "Bank Loan", type: "liability", openingBalance: 35000, currentBalance: 42000, children: [] },
      ],
    },
    {
      _id: "acc-equity",
      code: "3000",
      name: "Equity",
      type: "equity",
      currentBalance: 50000,
      openingBalance: 50000,
      children: [
        { _id: "acc-capital", code: "3100", name: "Owner's Equity", type: "equity", openingBalance: 50000, currentBalance: 50000, children: [] },
      ],
    },
    {
      _id: "acc-income",
      code: "4000",
      name: "Income",
      type: "income",
      currentBalance: 180000,
      openingBalance: 150000,
      children: [
        { _id: "acc-sales", code: "4100", name: "Food Sales", type: "income", openingBalance: 100000, currentBalance: 140000, children: [] },
        { _id: "acc-bev", code: "4200", name: "Beverage Sales", type: "income", openingBalance: 50000, currentBalance: 40000, children: [] },
      ],
    },
    {
      _id: "acc-expense",
      code: "5000",
      name: "Expenses",
      type: "expense",
      currentBalance: 120000,
      openingBalance: 90000,
      children: [
        { _id: "acc-cogs", code: "5100", name: "Cost of Goods Sold", type: "expense", openingBalance: 60000, currentBalance: 70000, children: [] },
        { _id: "acc-payroll", code: "5200", name: "Payroll", type: "expense", openingBalance: 20000, currentBalance: 30000, children: [] },
        { _id: "acc-rent", code: "5300", name: "Rent", type: "expense", openingBalance: 10000, currentBalance: 12000, children: [] },
      ],
    },
  ],
  ledgerEntries: {
    "acc-cash": [
      { _id: uid(), date: "2025-03-01", particulars: "Opening Balance", debit: 30000, credit: 0, balance: 30000 },
      { _id: uid(), date: "2025-03-05", particulars: "Daily Sales", debit: 12000, credit: 0, balance: 42000 },
      { _id: uid(), date: "2025-03-06", particulars: "Supplier Payment", debit: 0, credit: 5000, balance: 37000 },
    ],
    "acc-ap": [
      { _id: uid(), date: "2025-03-02", particulars: "Opening Balance", debit: 0, credit: 30000, balance: -30000 },
      { _id: uid(), date: "2025-03-04", particulars: "Inventory Purchase", debit: 0, credit: 12000, balance: -42000 },
      { _id: uid(), date: "2025-03-06", particulars: "Payment to Supplier", debit: 15000, credit: 0, balance: -27000 },
    ],
  },
  financialYears: [
    { _id: "fy-2023", name: "FY 2023-24", startDate: Date.parse("2023-04-01"), endDate: Date.parse("2024-03-31"), status: "closed", isCurrent: false },
    { _id: "fy-2024", name: "FY 2024-25", startDate: Date.parse("2024-04-01"), endDate: Date.parse("2025-03-31"), status: "active", isCurrent: true },
  ],
  suppliers: [
    { _id: "sup-1", name: "Fresh Farms", contactPerson: "Aditi Sharma", email: "contact@freshfarms.com", phone: "9800000001", address: "Baneshwor, Kathmandu", panNumber: "PAN12345", isActive: true },
    { _id: "sup-2", name: "Spice World", contactPerson: "Rajesh Thapa", email: "hello@spiceworld.com", phone: "9800000002", address: "Kupandole, Lalitpur", panNumber: "PAN56789", isActive: true },
  ],
  units: [
    { _id: "unit-kg", name: "Kilogram", abbreviation: "kg", isActive: true },
    { _id: "unit-ltr", name: "Litre", abbreviation: "L", isActive: true },
    { _id: "unit-pc", name: "Piece", abbreviation: "pc", isActive: true },
  ],
  ingredients: [
    { _id: "ing-1", name: "Basmati Rice", unitId: "unit-kg", unit: "kg", costPrice: 120, stock: 50, isActive: true },
    { _id: "ing-2", name: "Chicken Breast", unitId: "unit-kg", unit: "kg", costPrice: 480, stock: 30, isActive: true },
  ],
  purchases: [
    { _id: "pur-1", supplierId: "sup-1", supplierName: "Fresh Farms", status: "pending", total: 18000, createdAt: Date.now() - 86400000, expectedDate: Date.now(), items: 5 },
  ],
  customers: [
    { _id: "cust-1", name: "Ravi Koirala", phone: "9800001100", creditLimit: 20000, currentCredit: 8500, lastPurchaseDate: Date.now() - 86400000 * 2, lastPaymentDate: Date.now() - 86400000 * 5 },
    { _id: "cust-2", name: "Sita Gurung", phone: "9800002200", creditLimit: 15000, currentCredit: 12000, lastPurchaseDate: Date.now() - 86400000 * 3, lastPaymentDate: Date.now() - 86400000 * 7 },
  ],
  creditTransactions: [
    { _id: uid(), customerName: "Ravi Koirala", amount: 2000, date: Date.now() - 86400000, method: "cash", notes: "Partial payment", status: "completed" },
    { _id: uid(), customerName: "Sita Gurung", amount: 3000, date: Date.now() - 86400000 * 2, method: "card", notes: "POS payment", status: "completed" },
  ],
  menuItems: [
    { _id: "menu-1", name: "Chicken MoMo", price: 240, category: "Snacks" },
    { _id: "menu-2", name: "Veg Thali", price: 420, category: "Meal" },
    { _id: "menu-3", name: "Cold Coffee", price: 180, category: "Drinks" },
  ],
  rooms: [
    {
      _id: "room-1",
      name: "Main Hall",
      tables: [
        { _id: "t1", tableNumber: "1", status: "open" },
        { _id: "t2", tableNumber: "2", status: "occupied" },
      ],
    },
  ],
  orders: [
    {
      _id: "ord-1",
      tableId: "t2",
      orderType: "dine_in",
      cashierId: "cashier-1",
      items: [
        { _id: uid(), menuItemId: "menu-1", menuItemName: "Chicken MoMo", quantity: 2, unitPrice: 240, totalPrice: 480, notes: "" },
      ],
      customerName: "Walk-in",
      status: "open",
    },
  ],
  cashierSession: { _id: "session-1", openingCash: 5000, startedAt: Date.now() - 3600000 },
  sessionSummary: {
    sessionId: "session-1",
    expectedCash: 18500,
    totalSales: 21500,
    cashSales: 15000,
    cardSales: 4000,
    qrSales: 2500,
    creditSales: 1500,
    totalOrders: 24,
    refunds: 0,
  },
};

const dbHelpers = {
  accountsFlat: [],
  accountBalances: [],
  trialBalance: {},
  balanceSheet: {},
  profitLoss: {},
  recentTransactions: [],
};

function buildDerivedAccounting() {
  const flat = [];
  function flatten(node) {
    flat.push({
      _id: node._id,
      code: node.code,
      name: node.name,
      type: node.type,
      currentBalance: node.currentBalance,
      openingBalance: node.openingBalance,
    });
    (node.children || []).forEach(flatten);
  }
  db.accountsTree.forEach(flatten);
  dbHelpers.accountsFlat = flat;

  dbHelpers.accountBalances = flat
    .filter((a) => ["asset", "liability", "income", "expense", "equity"].includes(a.type))
    .map((a) => ({
      id: a._id,
      code: a.code,
      name: a.name,
      type: a.type,
      balance: a.currentBalance,
    }));

  dbHelpers.trialBalance = {
    assets: flat.filter((a) => a.type === "asset").map((a) => ({ id: a._id, code: a.code, name: a.name, debit: a.currentBalance, credit: 0 })),
    liabilities: flat.filter((a) => a.type === "liability").map((a) => ({ id: a._id, code: a.code, name: a.name, debit: 0, credit: a.currentBalance })),
    equity: flat.filter((a) => a.type === "equity").map((a) => ({ id: a._id, code: a.code, name: a.name, debit: 0, credit: a.currentBalance })),
    income: flat.filter((a) => a.type === "income").map((a) => ({ id: a._id, code: a.code, name: a.name, debit: 0, credit: a.currentBalance })),
    expenses: flat.filter((a) => a.type === "expense").map((a) => ({ id: a._id, code: a.code, name: a.name, debit: a.currentBalance, credit: 0 })),
  };
  const totals = {
    totalDebits:
      dbHelpers.trialBalance.assets.reduce((s, a) => s + a.debit, 0) +
      dbHelpers.trialBalance.expenses.reduce((s, a) => s + a.debit, 0),
    totalCredits:
      dbHelpers.trialBalance.liabilities.reduce((s, a) => s + a.credit, 0) +
      dbHelpers.trialBalance.equity.reduce((s, a) => s + a.credit, 0) +
      dbHelpers.trialBalance.income.reduce((s, a) => s + a.credit, 0),
  };
  dbHelpers.trialBalance.totalDebits = totals.totalDebits;
  dbHelpers.trialBalance.totalCredits = totals.totalCredits;
  dbHelpers.trialBalance.isBalanced = Math.abs(totals.totalDebits - totals.totalCredits) < 0.1;

  dbHelpers.balanceSheet = {
    assets: {
      current: [
        { name: "Cash & Bank", amount: 100000 },
        { name: "Accounts Receivable", amount: 40000 },
        { name: "Inventory", amount: 35000 },
      ],
      fixed: [{ name: "Kitchen Equipment", amount: 50000 }],
      other: [],
      totalCurrent: 175000,
      totalFixed: 50000,
      total: 225000,
    },
    liabilities: {
      current: [
        { name: "Accounts Payable", amount: 28000 },
        { name: "Sales Tax Payable", amount: 8000 },
      ],
      longTerm: [{ name: "Bank Loan", amount: 42000 }],
      totalCurrent: 36000,
      totalLongTerm: 42000,
      total: 78000,
    },
    equity: [
      { name: "Owner's Equity", amount: 50000 },
      { name: "Retained Earnings", amount: 97000 },
    ],
    totalEquity: 147000,
  };

  dbHelpers.profitLoss = {
    revenue: { items: [{ name: "Food Sales", amount: 140000 }, { name: "Beverage Sales", amount: 40000 }], total: 180000 },
    costOfGoodsSold: { items: [{ name: "Ingredients", amount: 70000 }], total: 70000 },
    operatingExpenses: { items: [{ name: "Payroll", amount: 30000 }, { name: "Rent", amount: 12000 }, { name: "Utilities", amount: 8000 }], total: 50000 },
    depreciation: { items: [{ name: "Kitchen Equipment", amount: 5000 }], total: 5000 },
    otherExpenses: { items: [{ name: "Miscellaneous", amount: 3000 }], total: 3000 },
  };

  dbHelpers.recentTransactions = [
    {
      _id: uid(),
      transactionDate: new Date().toISOString(),
      description: "Dinner Service Sales",
      voucherNo: "INV-101",
      entries: [
        { accountName: "Cash", debit: 25000, credit: 0 },
        { accountName: "Sales", debit: 0, credit: 25000 },
      ],
    },
    {
      _id: uid(),
      transactionDate: new Date(Date.now() - 86400000).toISOString(),
      description: "Supplier Payment",
      voucherNo: "PAY-22",
      entries: [
        { accountName: "Accounts Payable", debit: 15000, credit: 0 },
        { accountName: "Cash", debit: 0, credit: 15000 },
      ],
    },
  ];
}

buildDerivedAccounting();

function findTableById(id) {
  for (const room of db.rooms) {
    const table = room.tables.find((t) => t._id === id || t.tableNumber === id);
    if (table) return { ...table, roomId: room._id, roomName: room.name };
  }
  return null;
}

export const api = {
  auth: {
    getUserRoleById: async () => "cashier",
  },
  accounting: {
    getDashboardStats: async () => ({
      totalRevenue: 250000,
      revenueGrowth: 8.4,
      totalExpenses: 180000,
      expenseGrowth: 5.1,
      grossProfit: 70000,
      netProfit: 52000,
      outstandingCredit: 12000,
      pendingPayables: 18000,
    }),
    getRecentTransactions: async ({ limit = 10 } = {}) => dbHelpers.recentTransactions.slice(0, limit),
    getAccountBalances: async () => dbHelpers.accountBalances,
    getTrialBalance: async () => dbHelpers.trialBalance,
    getBalanceSheet: async () => dbHelpers.balanceSheet,
    getProfitLoss: async () => dbHelpers.profitLoss,
    getLedgerEntries: async ({ accountId }) => db.ledgerEntries[accountId] || [],
  },
  chartOfAccounts: {
    list: async () => dbHelpers.accountsFlat,
    getTree: async () => db.accountsTree,
    create: async ({ name, code, type, parentId }) => {
      const newAcc = { _id: uid(), name, code, type, openingBalance: 0, currentBalance: 0, children: [] };
      if (parentId) {
        const parent = db.accountsTree.find((a) => a._id === parentId) || db.accountsTree.flatMap((a) => a.children || []).find((c) => c._id === parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(newAcc);
        } else {
          db.accountsTree.push(newAcc);
        }
      } else {
        db.accountsTree.push(newAcc);
      }
      buildDerivedAccounting();
      return newAcc;
    },
    update: async ({ id, ...updates }) => {
      const all = db.accountsTree.flatMap((a) => [a, ...(a.children || [])]);
      const target = all.find((a) => a._id === id);
      if (target) Object.assign(target, updates);
      buildDerivedAccounting();
      return target;
    },
    remove: async ({ id }) => {
      db.accountsTree.forEach((acc) => {
        acc.children = (acc.children || []).filter((c) => c._id !== id);
      });
      buildDerivedAccounting();
      return { success: true };
    },
  },
  financialYears: {
    list: async () => db.financialYears,
    getCurrent: async () => db.financialYears.find((fy) => fy.isCurrent) || null,
    create: async ({ name, startDate, endDate, setAsCurrent }) => {
      if (setAsCurrent) db.financialYears.forEach((fy) => (fy.isCurrent = false));
      const year = { _id: uid(), name, startDate, endDate, status: "active", isCurrent: Boolean(setAsCurrent) };
      db.financialYears.push(year);
      return year;
    },
    close: async ({ id }) => {
      const fy = db.financialYears.find((f) => f._id === id);
      if (fy) fy.status = "closed";
      return fy;
    },
    setAsCurrent: async ({ id }) => {
      db.financialYears.forEach((fy) => (fy.isCurrent = fy._id === id));
      return db.financialYears.find((fy) => fy._id === id);
    },
  },
  suppliers: {
    getAll: async () => db.suppliers,
    getActive: async () => db.suppliers.filter((s) => s.isActive),
    create: async (payload) => {
      const supplier = { _id: uid(), isActive: true, ...payload };
      db.suppliers.push(supplier);
      return supplier;
    },
    update: async ({ id, ...updates }) => {
      const supplier = db.suppliers.find((s) => s._id === id);
      if (supplier) Object.assign(supplier, updates);
      return supplier;
    },
    remove: async ({ id }) => {
      db.suppliers = db.suppliers.filter((s) => s._id !== id);
      return { success: true };
    },
  },
  units: {
    getActive: async () => db.units.filter((u) => u.isActive !== false),
  },
  ingredients: {
    getAll: async () => db.ingredients,
    getActive: async () => db.ingredients.filter((i) => i.isActive !== false),
    create: async (payload) => {
      const ingredient = { _id: uid(), ...payload, stock: payload.stock || 0, isActive: true };
      db.ingredients.push(ingredient);
      return ingredient;
    },
    update: async ({ id, ...updates }) => {
      const ingredient = db.ingredients.find((i) => i._id === id);
      if (ingredient) Object.assign(ingredient, updates);
      return ingredient;
    },
    remove: async ({ id }) => {
      db.ingredients = db.ingredients.filter((i) => i._id !== id);
      return { success: true };
    },
  },
  purchases: {
    list: async () => db.purchases,
    create: async (payload) => {
      const purchase = { _id: uid(), status: "pending", createdAt: Date.now(), items: payload.items?.length || 0, total: payload.total || 0, ...payload };
      db.purchases.push(purchase);
      return purchase;
    },
    receive: async ({ id }) => {
      const purchase = db.purchases.find((p) => p._id === id);
      if (purchase) purchase.status = "received";
      return purchase;
    },
    cancel: async ({ id }) => {
      const purchase = db.purchases.find((p) => p._id === id);
      if (purchase) purchase.status = "cancelled";
      return purchase;
    },
  },
  customers: {
    getWithCredit: async () => db.customers,
    getCreditTransactions: async () => db.creditTransactions,
    recordCreditPayment: async ({ customerId, amount }) => {
      const customer = db.customers.find((c) => c._id === customerId);
      if (customer) {
        customer.currentCredit = Math.max(0, customer.currentCredit - amount);
        customer.lastPaymentDate = Date.now();
      }
      db.creditTransactions.unshift({
        _id: uid(),
        customerName: customer?.name || "Unknown",
        amount,
        date: Date.now(),
        method: "cash",
        status: "completed",
        notes: "Manual adjustment",
      });
      return customer;
    },
  },
  menu: {
    getForPOS: async () => {
      // Group menu items by category to match expected shape: [{ category, items }]
      const grouped = {};
      db.menuItems.forEach((item) => {
        const key = item.category || "General";
        if (!grouped[key]) {
          grouped[key] = {
            category: { _id: `cat-${key.toLowerCase().replace(/\s+/g, "-")}`, name: key },
            items: [],
          };
        }
        grouped[key].items.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          category: item.category,
        });
      });
      return Object.values(grouped);
    },
  },
  tables: {
    getById: async ({ id }) => findTableById(id),
  },
  orders: {
    getActiveOrderWithItems: async ({ tableId }) => db.orders.find((o) => o.tableId === tableId && o.status === "open") || null,
    create: async (payload) => {
      const order = { _id: uid(), status: "open", items: [], ...payload };
      db.orders.push(order);
      const table = findTableById(payload.tableId);
      if (table) table.status = "occupied";
      return order._id;
    },
    addItem: async ({ orderId, menuItemId, quantity, notes }) => {
      const order = db.orders.find((o) => o._id === orderId);
      const menuItem = db.menuItems.find((m) => m._id === menuItemId);
      if (!order || !menuItem) return null;
      order.items.push({
        _id: uid(),
        menuItemId,
        menuItemName: menuItem.name,
        quantity,
        unitPrice: menuItem.price,
        totalPrice: menuItem.price * quantity,
        notes: notes || "",
      });
      return order;
    },
    completePayment: async ({ orderId, paymentMethod }) => {
      const order = db.orders.find((o) => o._id === orderId);
      if (order) {
        order.status = "completed";
        order.paymentMethod = paymentMethod;
      }
      return order;
    },
  },
  cashierSessions: {
    getActive: async () => db.cashierSession,
    close: async ({ sessionId, closingCash }) => {
      if (db.cashierSession && db.cashierSession._id === sessionId) {
        db.cashierSession.closedAt = Date.now();
        db.cashierSession.closingCash = closingCash;
      }
      return db.cashierSession;
    },
  },
  dashboard: {
    getSessionSummary: async () => db.sessionSummary,
  },
};
