import { useEffect, useMemo, useState } from "react";
import { Account, TransferAccountType } from "@/types";
import IconButton from "@/components/common/IconButton";
import LoadingCard from "@/components/common/LoadingCard";
import AccountItem from "@/components/accounts/AccountItem";
import { TRANSFER_ACCOUNT_TYPE } from "@/config";
import IconArrowUp from "@/assets/icons/icon_arrow_up.svg?react";
import ErrorMessage from "@/components/common/ErrorMessage";
import { AnimatePresence, motion } from "framer-motion";

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
  /**
   * 내 계좌 갯수
   */
  const textMyAccounts = useMemo(() => {
    const totalNum = accounts?.length || 0;
    if (!isOpen && totalNum > BASE_SHOW_NUM) {
      return `+${totalNum - BASE_SHOW_NUM}개`;
    }
    return `${totalNum}개`;
  }, [accounts, isOpen]);

  /**
   * 내 계좌 오픈 버튼 이벤트
   */
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center px-6 py-2">
        <h4 className="text-sm">{label}</h4>
        {!isError && hasToggle && (
          <div className="inline-flex items-center">
            <div className=" inline-flex items-center opacity-55 ">
              {textMyAccounts.split("").map((char, index, array) => (
                <motion.span
                  className="text-sm"
                  key={`${char}-${index}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.2, delay: 0.05 * index },
                  }}
                  exit={{
                    opacity: 0,
                    y: -5,
                    transition: {
                      duration: 0.2,
                      delay: 0.05 * (array.length - 1 - index),
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <IconButton onClick={handleToggle}>
              <div
                className={`transition-transform duration-150 ${isOpen ? "rotate-0" : "rotate-180"}`}
              >
                <IconArrowUp />
              </div>
            </IconButton>
          </div>
        )}
      </div>
      {isLoading && <LoadingCard />}
      {isError && <ErrorMessage message={errorMessage} />}
      {!isLoading && !isError && (
        <motion.ul initial={false}>
          <AnimatePresence initial={false}>
            {visibleAccounts &&
              visibleAccounts.map((acc) => (
                <motion.li
                  key={acc.id}
                  layout
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                >
                  <AccountItem
                    type={type}
                    info={acc}
                    onClick={onClick}
                    onAddBookmark={onAddBookmark}
                    onDeleteBookmark={onDeleteBookmark}
                  />
                </motion.li>
              ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </motion.section>
  );
}
