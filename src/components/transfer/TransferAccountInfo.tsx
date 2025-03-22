import BankLogo from "@/components/common/BankLogo";
import AlertTooltip from "@/components/common/AlertTooltip";
import { formatToWon } from "@/utils";
import React, { useEffect, useMemo } from "react";
import { Account, MyInfo } from "@/types";
import IconSafe from "@/assets/icons/icon_safe_blue.svg?react";
import LoadingCard from "@/components/common/LoadingCard";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function TransferAccountInfo({
  account,
  amount,
  myInfo,
  isLoading,
  isError,
  errorMessage,
  setIsLimitExceededAmount,
}: {
  account: Account;
  amount: number;
  myInfo: MyInfo;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  setIsLimitExceededAmount: (boo: boolean) => void;
}) {
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

  useEffect(() => {
    setIsLimitExceededAmount(isLimitExceeded);
  }, [isLimitExceeded, setIsLimitExceededAmount]);

  if (isLoading) return <LoadingCard />;
  if (isError) return <ErrorMessage message={errorMessage} />;
  return (
    <div className="flex-1 flex justify-center items-center">
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
              <p className="text-2xl font-semibold">{`${formatToWon(amount)}원`}</p>
            </AlertTooltip>
          ) : (
            <p className="text-2xl font-semibold opacity-15">
              얼마를 보낼까요?
            </p>
          )}
          <span className="opacity-40 text-sm pt-2">{`출금계좌: ${myInfo?.account.bank.name} ${myInfo?.account.account_number}(${myInfo?.account.balance}원)`}</span>
        </div>
      </div>
    </div>
  );
}
