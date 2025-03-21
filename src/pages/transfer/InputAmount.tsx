import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "@/config";
import useAccounts from "@/hooks/useAccounts";
import { useAccountContext } from "@/context/AccountContext";
import React, { useEffect, useMemo, useState } from "react";
import useTransfer from "@/hooks/useTransfer";
import { Account, Transfer } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import NumberKeypad from "@/components/transfer/NumberKeypad";
import NumberShortcut from "@/components/transfer/NumberShortcut";
import BankLogo from "@/components/common/BankLogo";
import IconSafe from "@/assets/icons/icon_safe_blue.svg?react";
import TransferProcess from "@/pages/transfer/TransferProcess";

export default function InputAmount() {
  const navigate = useNavigate();

  const { myInfoQuery, accountByIdQuery } = useAccounts();
  const {
    data: myInfo,
    /*isLoading: isLoadingForMyInfo,
    isError: isErrorForMyInfo,
    error: myInfoError,*/
  } = myInfoQuery();

  const { transferAccountInfo, setTransferAccountInfo } = useAccountContext();

  const {
    data: transferAccount,
    /*isLoading: isLoadingForTransferAccount,
    isError: isErrorForTransferAccount,
    error: transferAccountError,*/
  } = accountByIdQuery(
    transferAccountInfo?.id!,
    transferAccountInfo?.account_type!,
  );

  const { transferMutation } = useTransfer();

  const [amount, setAmount] = useState(0);
  const [isTransferProcessing, setIsTransferProcessing] = useState(false);

  /**
   * 선택한 계좌 정보가 없을 경우 계좌 목록으로 리다이렉트
   */
  useEffect(() => {
    if (!transferAccountInfo && !isTransferProcessing) {
      navigate(PATH.ACCOUNTS, { replace: true });
    }
  }, [transferAccountInfo, navigate]);

  /**
   * 송금 계좌 정보 Account 정보로 치환
   */
  const account: Account | null = useMemo(() => {
    if (!transferAccount) return null;
    if (transferAccountInfo?.account_type === TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT)
      return transferAccount as Account;

    const bankInfo =
      BANK_INFO_MAP[transferAccount.bank.code] || DEFAULT_BANK_INFO;

    return {
      ...transferAccount,
      logo: (transferAccount as Account).logo || "",
      balance: (transferAccount as Account).balance || 0,
      bank: {
        ...transferAccount.bank,
        name: bankInfo.name,
        aliases: bankInfo.aliases,
        bank_nickname: bankInfo.bank_nickname,
      },
    } as Account;
  }, [transferAccount]);

  /**
   * 송금할 정보
   */
  const transferData: Transfer = useMemo(() => {
    return {
      bank_code: transferAccount?.bank.code || "",
      account_number: transferAccount?.account_number || "",
      amount,
    };
  }, [transferAccount, amount]);

  /**
   * shortcut amount 버튼 이벤트
   */
  const handleAddAmount = (amount: number) => {
    setAmount((prevAmount) => prevAmount + amount);
  };
  /**
   * number keypad 버튼 이벤트
   */
  const handleUpdateAmount = (value: number | "delete") => {
    setAmount((prevAmount) =>
      value === "delete"
        ? prevAmount && Number(String(prevAmount).slice(0, -1))
        : Number(prevAmount + String(value)),
    );
  };
  /**
   * 송금 확인 버튼 이벤트
   */
  const handleConfirm = () => {
    setIsTransferProcessing(true);
    navigate(PATH.TRANSFER_PROCESS);
    const data = {
      transfer: transferData,
      account: account!,
      myInfo: myInfo!,
    };
    transferMutation.mutate(data, {
      onSuccess: () => {
        setTransferAccountInfo(null); // 송금 계좌 정보 초기화
        navigate(PATH.TRANSFER_COMPLETE);
      },
      onError: (error) => {
        const errorCode = error.response?.data?.error_code || "";
        navigate(`${PATH.TRANSFER_FAILED}?errorCode=${errorCode}`);
      },
    });
  };
  return (
    <>
      {isTransferProcessing ? (
        <TransferProcess
          amount={amount}
          accountName={account?.holder_name || ""}
        />
      ) : (
        <>
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center space-y-1">
                <BankLogo
                  url={account?.bank.image_url}
                  alias={account?.bank.aliases}
                />
                <span className="inline-flex items-center space-x-1">
                  <span className="text-sm opacity-55">
                    {`${account?.bank.name} ${account?.account_number}`}
                  </span>
                  <IconSafe />
                </span>
              </div>
              <div>
                <p className="text-2xl font-semibold">{`${account?.holder_name} 님에게`}</p>
                {amount ? (
                  <p>{amount}</p>
                ) : (
                  <p className="text-2xl font-semibold opacity-15">
                    얼마를 보낼까요?
                  </p>
                )}
                <span className="opacity-40 text-sm pt-2">{`출금계좌: ${myInfo?.account.bank.name} ${myInfo?.account.account_number}(${myInfo?.account.balance}원)`}</span>
              </div>
            </div>
          </div>
          <BottomAreaWrapper>
            <NumberShortcut onAddAmount={handleAddAmount} />
            <NumberKeypad onUpdateAmount={handleUpdateAmount} />
            <ConfirmButton onClick={handleConfirm} disabled={!amount}>
              확인
            </ConfirmButton>
          </BottomAreaWrapper>
        </>
      )}
    </>
  );
}
