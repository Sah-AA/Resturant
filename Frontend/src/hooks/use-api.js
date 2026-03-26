import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

export function useApiResource(path, { enabled = true, initialData = null, method = "get", body = null } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled && path));
  const [error, setError] = useState(null);

  const memoizedBody = useMemo(() => body, [JSON.stringify(body)]);

  const fetchResource = useCallback(async () => {
    if (!enabled || !path) return;
    setLoading(true);
    try {
      const result =
        method === "post"
          ? await api.post(path, memoizedBody)
          : method === "put"
          ? await api.put(path, memoizedBody)
          : method === "patch"
          ? await api.patch(path, memoizedBody)
          : await api.get(path);
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      setError(err);
      setData(initialData);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enabled, path, method, memoizedBody, initialData]);

  useEffect(() => {
    fetchResource();
  }, [fetchResource]);

  return { data, loading, error, refresh: fetchResource, setData };
}

export function useApiMutation(requestFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      try {
        const result = await requestFn(...args);
        setError(null);
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requestFn]
  );

  return { mutate, loading, error };
}
