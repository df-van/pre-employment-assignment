import { createContext, ReactNode, useContext, useState } from "react";
import { TransferAccountInfo } from "../types";

interface AccountContextType {
  transferAccountInfo: TransferAccountInfo | null;
  setTransferAccountInfo: (info: TransferAccountInfo | null) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountContextProvider({ children }: { children: ReactNode }) {
  const [transferAccountInfo, setTransferAccountInfo] =
    useState<TransferAccountInfo | null>(null);

  return (
    <AccountContext.Provider
      value={{ transferAccountInfo, setTransferAccountInfo }}
    >
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
