import { createContext, useContext, useState } from "react";

const TransactionsContext = createContext(undefined);

export function TransactionsProvider({ children }) {
  const [transactionsCache, setTransactionsCache] = useState({
    items: [],
    fetchedAt: null,
    rangeStart: null,
    rangeEnd: null,
  });

  return (
    <TransactionsContext.Provider value={{ transactionsCache, setTransactionsCache }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactionsCache() {
  const context = useContext(TransactionsContext);

  if (context === undefined) {
    throw new Error("useTransactionsCache must be used within a TransactionsProvider");
  }

  return context;
}