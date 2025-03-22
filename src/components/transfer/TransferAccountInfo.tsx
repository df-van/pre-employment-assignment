import BankLogo from "@/components/common/BankLogo";
import AlertTooltip from "@/components/common/AlertTooltip";
import { formatToWon } from "@/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Account, MyInfo } from "@/types";
import IconSafe from "@/assets/icons/icon_safe_blue.svg?react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";
import { motion } from "framer-motion";

export default function TransferAccountInfo({
  account,
  amount,
  isShortcutUpdate,
  myInfo,
  isLoading,
  isError,
  errorMessage,
  setIsLimitExceededAmount,
}: {
  account: Account;
  amount: number;
  isShortcutUpdate: boolean;
  myInfo: MyInfo;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  setIsLimitExceededAmount: (boo: boolean) => void;
}) {
  const [displayed, setDisplayed] = useState<string[]>([]);
  const prevAmount = useRef(0);
  const [keyVersion, setKeyVersion] = useState(0);

  /**
   * 1일 송금 가능한 한도 금액
   */
  const ONE_DAY_LIMIT = 5000000;
  const remainOneDayLimit = useMemo(() => {
    return myInfo ? ONE_DAY_LIMIT - myInfo.transfer.one_day_amount : 0;
  }, [myInfo]);

  const isOneDayLimitExceeded = remainOneDayLimit < amount;

  /**
   * 1회 송금 가능한 한도 금액
   */
  const ONE_TIME_LIMIT = 2000000;
  const isOneTimeLimitExceeded = ONE_TIME_LIMIT < amount;

  // 송금 금액 초과 유무 상태
  const isLimitExceeded = isOneDayLimitExceeded || isOneTimeLimitExceeded;

  /**
   * 한도 초과 메세지
   */
  const limitMessage = useMemo(() => {
    if (isOneTimeLimitExceeded) {
      return `${formatToWon(ONE_TIME_LIMIT)}원 송금 가능 (1회 한도 초과)`;
    } else if (isOneDayLimitExceeded) {
      return `${formatToWon(remainOneDayLimit)}원 송금 가능 (1일 한도 초과)`;
    }
    return "";
  }, [isOneDayLimitExceeded, isOneTimeLimitExceeded, remainOneDayLimit]);
  /**
   * 초과 금액 설정
   */
  useEffect(() => {
    setIsLimitExceededAmount(isLimitExceeded);
  }, [isLimitExceeded, setIsLimitExceededAmount]);

  /**
   * amount 모션
   */
  useEffect(() => {
    const newVal = String(amount);
    const oldVal = String(prevAmount.current);

    if (amount === 0) {
      setDisplayed([]);
      prevAmount.current = 0;
      return;
    }

    if (prevAmount.current === 0 && amount !== 0) {
      // 첫 입력일 경우 전체 렌더
      setDisplayed(newVal.split(""));
    } else if (isShortcutUpdate) {
      setKeyVersion((prev) => prev + 1);
      setDisplayed(newVal.split(""));
    } else if (newVal.length > oldVal.length) {
      const addedChar = newVal[newVal.length - 1];
      setDisplayed((prev) => [...prev, addedChar]);
    } else if (newVal.length < oldVal.length) {
      setDisplayed((prev) => prev.slice(0, -1));
    }

    prevAmount.current = amount;
  }, [amount, isShortcutUpdate]);

  // 송금 초과시 variants
  const vibrationVariants = {
    initial: { x: 0 },
    vibrate: {
      x: [0, -4, 4, -4, 4, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  if (isLoading) return <LoadingCard />;
  if (isError) return <ErrorMessage message={errorMessage} />;
  return (
    <motion.div
      className="flex-1 flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center space-y-4">
        <div className="flex flex-col items-center space-y-1">
          <BankLogo url={account.bank.image_url} alias={account.bank.aliases} />
          <span className="inline-flex items-center space-x-1">
            <span className="text-sm opacity-55">
              {`${account.bank.name} ${account.account_number}`}
            </span>
            <IconSafe />
          </span>
        </div>
        <div>
          <p className="text-2xl font-semibold">{`${account.holder_name} 님에게`}</p>
          {amount ? (
            <AlertTooltip tooltipText={limitMessage} visible={isLimitExceeded}>
              <motion.p
                className={`text-2xl font-semibold inline-flex ${
                  isLimitExceeded ? "text-alert" : ""
                }`}
                variants={vibrationVariants}
                initial="initial"
                animate={isLimitExceeded ? "vibrate" : "initial"}
              >
                {displayed.map((char, idx) => (
                  <motion.span
                    key={`${char}-${idx}-${keyVersion}`}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: isLimitExceeded ? 0 : 0.15 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  key="unit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  원
                </motion.span>
              </motion.p>
            </AlertTooltip>
          ) : (
            <p className="text-2xl font-semibold opacity-15">
              얼마를 보낼까요?
            </p>
          )}
          <span className="opacity-40 text-sm pt-2">{`출금계좌: ${myInfo?.account.bank.name} ${myInfo?.account.account_number}(${myInfo?.account.balance}원)`}</span>
        </div>
      </div>
    </motion.div>
  );
}
