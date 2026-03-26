import { useEffect, useState } from "react";

export function useQuery(queryFn, args) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    if (!queryFn || args === "skip") {
      setData(null);
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        const result = await queryFn(args ?? {});
        if (mounted) setData(result);
      } catch (err) {
        console.error("Query failed", err);
        if (mounted) setData(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [queryFn, JSON.stringify(args)]);

  return data;
}

export function useMutation(mutationFn) {
  return async (args) => {
    if (!mutationFn) return null;
    return mutationFn(args ?? {});
  };
}

// No-op client for compatibility with old imports
export class ConvexReactClient {
  constructor() {}
}
