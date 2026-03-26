"use client";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, CreditCard, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth-client";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function CashierLayout({ children }) {
  const { pathname } = useLocation();
  const { data: session } = authClient.useSession();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/auth/login";
  };

  // Get cashier display name
  const displayName = session?.user?.name || session?.user?.email || "Cashier";

  return (
    <AuthGuard allowedRoles={["admin", "cashier"]}>
      <div className="flex flex-col h-screen bg-background">
        <header className="h-14 border-b bg-background flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/cashier/pos" className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">POS Terminal</span>
            </Link>
            <nav className="flex items-center gap-1 ml-6">
              <Link
                to="/cashier/pos"
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  pathname === "/cashier/pos" || pathname.startsWith("/cashier/pos/table")
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                Tables
              </Link>
              <Link
                to="/cashier/credit"
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  pathname === "/cashier/credit"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Credit Payment
                </span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
              <User className="h-4 w-4" />
              <span>{displayName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </AuthGuard>
  );
}
