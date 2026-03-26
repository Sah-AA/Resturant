import React, { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children, allowedRoles, fallbackUrl = "/auth/login" }) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const role = session?.user?.role;
  const effectiveRole = role === "user" ? "cashier" : role === "accountant" ? "account" : role;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      navigate(`${fallbackUrl}?callbackUrl=${window.location.pathname}`);
      return;
    }

    if (effectiveRole && !allowedRoles.includes(effectiveRole)) {
      navigate("/unauthorized");
    }
  }, [session, effectiveRole, isPending, navigate, allowedRoles, fallbackUrl]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  if (effectiveRole && !allowedRoles.includes(effectiveRole)) return null;

  return <>{children}</>;
}

export const RoleGuard = AuthGuard;

export function useCurrentUser() {
  const { data: session } = useSession();
  return session?.user || null;
}

export function useUserRole() {
  const { data: session } = useSession();
  const role = session?.user?.role || "cashier";
  return role === "user" ? "cashier" : role === "accountant" ? "account" : role;
}
