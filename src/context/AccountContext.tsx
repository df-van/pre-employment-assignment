import { createContext, ReactNode, useContext, useState } from "react";
import { Account } from "../types";

interface AccountContextType {
  transferAccount: Account | null;
  setTransferAccount: (account: Account | null) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountContextProvider({ children }: { children: ReactNode }) {
  const [transferAccount, setTransferAccount] = useState<Account | null>(null);

  return (
    <AccountContext.Provider value={{ transferAccount, setTransferAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("context 가 없습니다.");
  }
  return context;
}
