import { useMemo, useState } from "react";
import { Account, TransferAccountType } from "@/types";
import IconButton from "@/components/common/IconButton";
import LoadingCard from "@/components/common/LoadingCard";
import AccountItem from "@/components/accounts/AccountItem";
import { TRANSFER_ACCOUNT_TYPE } from "@/config";
import IconArrowUp from "@/assets/icons/icon_arrow_up.svg?react";

export default function AccountToggle({
  type,
  hasToggle,
  accounts,
  isLoading,
  isError,
  errorMessage,
  onClick,
  onAddBookmark,
  onDeleteBookmark,
}: {
  type: TransferAccountType;
  hasToggle: boolean;
  accounts: Account[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onClick: (id: number) => void;
  onAddBookmark: (accountNumber: string) => void;
  onDeleteBookmark: (id: number) => void;
}) {
  const BASE_SHOW_NUM = 2;
  const label = type === TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT ? "내 계좌" : "최근";
  const [isOpen, setIsOpen] = useState(false);
  const visibleAccounts = useMemo(() => {
    if (!hasToggle || isOpen) {
      return accounts;
    }
    return accounts.slice(0, 2);
  }, [isOpen, accounts, hasToggle]);

  // 내 계좌 갯수
  const textMyAccounts = useMemo(() => {
    const totalNum = accounts?.length || 0;
    if (!isOpen) {
      if (totalNum - BASE_SHOW_NUM > 0) {
        return `+${totalNum - BASE_SHOW_NUM}개`;
      }
    }
    return totalNum + "개";
  }, [accounts, isOpen]);

  // 내 계좌 오픈 버튼 이벤트
  const onToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };
  const handleClick = (id: number) => {
    onClick(id);
  };
  const handleAddBookmark = (accountNumber: string) => {
    onAddBookmark(accountNumber);
  };
  const handleDeleteBookmark = (id: number) => {
    onDeleteBookmark(id);
  };
  return (
    <section>
      <div className="flex justify-between items-center px-6 py-2">
        <h4 className="text-sm">{label}</h4>
        {hasToggle && (
          <div className="inline-flex items-center">
            <span className="opacity-55 text-sm">{textMyAccounts}</span>
            <IconButton onClick={onToggleOpen}>
              <div
                className={`transition-transform duration-150 ${isOpen ? "rotate-0" : "rotate-180"}`}
              >
                <IconArrowUp />
              </div>
            </IconButton>
          </div>
        )}
      </div>
      {isLoading ? (
        <LoadingCard />
      ) : (
        <ul>
          {visibleAccounts &&
            visibleAccounts.map((acc) => (
              <li key={acc.id}>
                <AccountItem
                  type={type}
                  info={acc}
                  onClick={handleClick}
                  onAddBookmark={handleAddBookmark}
                  onDeleteBookmark={handleDeleteBookmark}
                />
              </li>
            ))}
        </ul>
      )}
    </section>
  );
}
