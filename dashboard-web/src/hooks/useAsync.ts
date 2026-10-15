import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> {
  data: T | null;
  error: unknown;
  loading: boolean;
}

export function useAsync<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, loading: true });

  const refetch = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, error, loading: false });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => refetch(), [refetch]);

  return { ...state, refetch };
}
