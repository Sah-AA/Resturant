"use client";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, UtensilsCrossed, Tags, Scale, Printer, DoorOpen,
  Percent, Users, Wallet, ChevronLeft, ChevronRight, LogOut,
  Building, Receipt, DollarSign, Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { signOut } from "@/lib/auth-client";
import { AuthGuard } from "@/components/auth/auth-guard";

const sidebarItems = [
  { title: "Dashboard",      href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Menu Items",     href: "/admin/menu",       icon: UtensilsCrossed },
  { title: "Categories",     href: "/admin/categories", icon: Tags },
  { title: "Units",          href: "/admin/units",      icon: Scale },
  { title: "Printers",       href: "/admin/printers",   icon: Printer },
  { title: "Rooms & Tables", href: "/admin/rooms",      icon: DoorOpen },
  { title: "Discounts",      href: "/admin/discounts",  icon: Percent },
  { title: "Staff",          href: "/admin/staff",      icon: Users },
  { title: "Payroll",        href: "/admin/payroll",    icon: Wallet },
];

const settingsItems = [
  { title: "Restaurant",     href: "/admin/settings/restaurant", icon: Building },
  { title: "Tax",            href: "/admin/settings/tax",        icon: Percent },
  { title: "Receipt",        href: "/admin/settings/receipt",    icon: Receipt },
  { title: "Currency",       href: "/admin/settings/currency",   icon: DollarSign },
  { title: "Financial Year", href: "/admin/settings/financial",  icon: Calendar },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  const NavLink = ({ item }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>
            <Link
              to={item.href}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg mx-auto",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{item.title}</TooltipContent>
        </Tooltip>
      );
    }
    return (
      <Link
        key={item.href}
        to={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        {item.title}
      </Link>
    );
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <TooltipProvider delayDuration={0}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className={cn("flex flex-col border-r bg-background transition-all duration-300", collapsed ? "w-16" : "w-64")}>
            <div className="flex h-16 items-center justify-between border-b px-4">
              {!collapsed && (
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Restaurant ERP</span>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCollapsed(!collapsed)}
                className={cn(collapsed && "mx-auto")}
              >
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>

            <ScrollArea className="flex-1 py-4">
              <nav className="flex flex-col gap-1 px-2">
                {sidebarItems.map((item) => <NavLink key={item.href} item={item} />)}
                {!collapsed && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</p>
                    {settingsItems.map((item) => <NavLink key={item.href} item={item} />)}
                  </div>
                )}
                {collapsed && (
                  <>
                    <div className="mt-4 pt-4 border-t border-border" />
                    {settingsItems.map((item) => <NavLink key={item.href} item={item} />)}
                  </>
                )}
              </nav>
            </ScrollArea>

            <Separator />
            <div className="p-2">
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="w-10 h-10 mx-auto" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              ) : (
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" /> Logout
                </Button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </TooltipProvider>
    </AuthGuard>
  );
}
