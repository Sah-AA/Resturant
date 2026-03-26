import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./app/page.jsx";
import DashboardRedirect from "./app/dashboard/page.jsx";
import UnauthorizedPage from "./app/unauthorized/page.jsx";
import LoginPage from "./app/auth/login/page.jsx";
import RegisterPage from "./app/auth/register/page.jsx";

import AdminLayout from "./app/admin/layout.jsx";
import AdminDashboard from "./app/admin/dashboard/page.jsx";
import AdminMenu from "./app/admin/menu/page.jsx";
import AdminCategories from "./app/admin/categories/page.jsx";
import AdminUnits from "./app/admin/units/page.jsx";
import AdminPrinters from "./app/admin/printers/page.jsx";
import AdminRooms from "./app/admin/rooms/page.jsx";
import AdminDiscounts from "./app/admin/discounts/page.jsx";
import AdminStaff from "./app/admin/staff/page.jsx";
import AdminPayroll from "./app/admin/payroll/page.jsx";
import AdminSettings from "./app/admin/settings/page.jsx";
import AdminSettingsRestaurant from "./app/admin/settings/restaurant/page.jsx";
import AdminSettingsTax from "./app/admin/settings/tax/page.jsx";
import AdminSettingsReceipt from "./app/admin/settings/receipt/page.jsx";
import AdminSettingsCurrency from "./app/admin/settings/currency/page.jsx";
import AdminSettingsFinancial from "./app/admin/settings/financial/page.jsx";

import AccountLayout from "./app/account/layout.jsx";
import AccountDashboard from "./app/account/dashboard/page.jsx";
import AccountPurchases from "./app/account/purchases/page.jsx";
import AccountIngredients from "./app/account/ingredients/page.jsx";
import AccountSuppliers from "./app/account/suppliers/page.jsx";
import AccountLedger from "./app/account/ledger/page.jsx";
import AccountTrialBalance from "./app/account/trial-balance/page.jsx";
import AccountProfitLoss from "./app/account/profit-loss/page.jsx";
import AccountBalanceSheet from "./app/account/balance-sheet/page.jsx";
import AccountFinancialYear from "./app/account/financial-year/page.jsx";
import AccountCredit from "./app/account/credit/page.jsx";
import AccountChartOfAccounts from "./app/account/chart-of-accounts/page.jsx";

import CashierLayout from "./app/cashier/layout.jsx";
import CashierPos from "./app/cashier/pos/page.jsx";
import CashierPosTable from "./app/cashier/pos/table/[tableId]/page.jsx";
import CashierPosClose from "./app/cashier/pos/close/page.jsx";
import CashierCredit from "./app/cashier/credit/page.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      <Route path="/admin" element={<AdminLayout><Navigate to="/admin/dashboard" replace /></AdminLayout>} />
      <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/menu" element={<AdminLayout><AdminMenu /></AdminLayout>} />
      <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
      <Route path="/admin/units" element={<AdminLayout><AdminUnits /></AdminLayout>} />
      <Route path="/admin/printers" element={<AdminLayout><AdminPrinters /></AdminLayout>} />
      <Route path="/admin/rooms" element={<AdminLayout><AdminRooms /></AdminLayout>} />
      <Route path="/admin/discounts" element={<AdminLayout><AdminDiscounts /></AdminLayout>} />
      <Route path="/admin/staff" element={<AdminLayout><AdminStaff /></AdminLayout>} />
      <Route path="/admin/payroll" element={<AdminLayout><AdminPayroll /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
      <Route path="/admin/settings/restaurant" element={<AdminLayout><AdminSettingsRestaurant /></AdminLayout>} />
      <Route path="/admin/settings/tax" element={<AdminLayout><AdminSettingsTax /></AdminLayout>} />
      <Route path="/admin/settings/receipt" element={<AdminLayout><AdminSettingsReceipt /></AdminLayout>} />
      <Route path="/admin/settings/currency" element={<AdminLayout><AdminSettingsCurrency /></AdminLayout>} />
      <Route path="/admin/settings/financial" element={<AdminLayout><AdminSettingsFinancial /></AdminLayout>} />
      <Route path="/account" element={<AccountLayout><Navigate to="/account/dashboard" replace /></AccountLayout>} />
      <Route path="/account/dashboard" element={<AccountLayout><AccountDashboard /></AccountLayout>} />
      <Route path="/account/purchases" element={<AccountLayout><AccountPurchases /></AccountLayout>} />
      <Route path="/account/ingredients" element={<AccountLayout><AccountIngredients /></AccountLayout>} />
      <Route path="/account/suppliers" element={<AccountLayout><AccountSuppliers /></AccountLayout>} />
      <Route path="/account/ledger" element={<AccountLayout><AccountLedger /></AccountLayout>} />
      <Route path="/account/trial-balance" element={<AccountLayout><AccountTrialBalance /></AccountLayout>} />
      <Route path="/account/profit-loss" element={<AccountLayout><AccountProfitLoss /></AccountLayout>} />
      <Route path="/account/balance-sheet" element={<AccountLayout><AccountBalanceSheet /></AccountLayout>} />
      <Route path="/account/financial-year" element={<AccountLayout><AccountFinancialYear /></AccountLayout>} />
      <Route path="/account/credit" element={<AccountLayout><AccountCredit /></AccountLayout>} />
      <Route path="/account/chart-of-accounts" element={<AccountLayout><AccountChartOfAccounts /></AccountLayout>} />

      <Route path="/cashier" element={<CashierLayout><Navigate to="/cashier/pos" replace /></CashierLayout>} />
      <Route path="/cashier/pos" element={<CashierLayout><CashierPos /></CashierLayout>} />
      <Route path="/cashier/pos/table/:tableId" element={<CashierLayout><CashierPosTable /></CashierLayout>} />
      <Route path="/cashier/pos/close" element={<CashierLayout><CashierPosClose /></CashierLayout>} />
      <Route path="/cashier/pos/table/delivery" element={<CashierLayout><CashierPosTable /></CashierLayout>} />
      <Route path="/cashier/pos/table/takeaway" element={<CashierLayout><CashierPosTable /></CashierLayout>} />
      <Route path="/cashier/credit" element={<CashierLayout><CashierCredit /></CashierLayout>} />
    </Routes>
  );
}
