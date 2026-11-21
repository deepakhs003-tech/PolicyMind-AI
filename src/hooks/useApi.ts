import { useEffect, useState } from 'react';
import { errorMessage } from '../api/insurance';

type Result<T> = { data: T | undefined; error: string; loading: boolean };

export function useApi<T>(request: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<Result<T>>({ data: undefined, error: '', loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    request(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ data, error: '', loading: false });
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setResult({ data: undefined, error: errorMessage(error), loading: false });
      });
    return () => controller.abort();
  }, [request, attempt]);

  function reload() {
    setResult((previous) => ({ ...previous, error: '', loading: true }));
    setAttempt((value) => value + 1);
  }

  return { ...result, reload };
}
