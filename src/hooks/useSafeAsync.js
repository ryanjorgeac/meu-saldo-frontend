import { useRef, useEffect, useCallback } from 'react';

export default function useSafeAsync() {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  const safeAsync = useCallback((asyncFunction) => {
    return async (...args) => {
      if (!isMounted.current) return;
      
      try {
        const result = await asyncFunction(...args);
        if (isMounted.current) {
          return result;
        }
      } catch (error) {
        if (isMounted.current) {
          throw error;
        }
      }
    };
  }, []);
  
  return { isMounted, safeAsync };
}
