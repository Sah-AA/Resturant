"use client";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const navigate = useNavigate();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const role = session?.user?.role;
  const isPending = sessionPending;

  useEffect(() => {
    if (isPending) return; // still loading, wait

    if (!session) {
      // Not logged in → go to login
      navigate("/auth/login");
      return;
    }

    // Logged in → redirect based on role (treat undefined/null/"user" as cashier)
    const userRole = role === "accountant" ? "account" : role ?? "cashier";
    switch (userRole) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "account":
        navigate("/account/dashboard");
        break;
      case "cashier":
      case "user":
      default:
        navigate("/cashier/pos");
        break;
    }
  }, [session, role, isPending, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
