import { useCallback, useEffect, useState } from "react";
import { api, BASE_URL } from "./api";

/**
 * Auth helpers backed by the Express API.
 * Session is stored in httpOnly cookie; these helpers keep React views in sync.
 */
export async function login(email, password) {
  return api.post("/auth/login", { email, password });
}

export async function registerUser({ name, email, password, role = "cashier" }) {
  return api.post("/auth/register", { name, email, password, role });
}

export async function logout() {
  try {
    await api.post("/auth/logout", {});
  } catch (err) {
    // Ignore logout failures so UI can still proceed
    console.error("Logout failed", err);
  }
}

export function useSession() {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsPending(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/session`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        setData(null);
        setError(null);
        return null;
      }
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Session check failed");
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setData(null);
      setError(err);
    } finally {
      setIsPending(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data: data?.user ? { user: data.user } : null,
    isPending,
    error,
    refresh,
  };
}

// Backwards-compatible shape for existing imports
export const authClient = { useSession };
export const signIn = {
  email: ({ email, password }) => login(email, password),
};
export const signUp = {
  email: ({ name, email, password, role }) =>
    registerUser({ name, email, password, role }),
};
export const signOut = logout;
