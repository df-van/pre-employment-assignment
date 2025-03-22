import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "@/config";
import useAccounts from "@/hooks/useAccounts";
import { useAccountContext } from "@/context/AccountContext";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useTransfer from "@/hooks/useTransfer";
import { Account, Transfer } from "@/types";
import ConfirmButton from "@/components/common/ConfirmButton";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import NumberKeypad from "@/components/transfer/NumberKeypad";
import NumberShortcut from "@/components/transfer/NumberShortcut";

import TransferProcess from "@/pages/transfer/TransferProcess";
import TransferAccountInfo from "@/components/transfer/TransferAccountInfo";

export default function InputAmount() {
  const navigate = useNavigate();

  const { myInfoQuery, accountByIdQuery } = useAccounts();
  const { transferAccountInfo, setTransferAccountInfo } = useAccountContext();
  const { transferMutation } = useTransfer();

  const [amount, setAmount] = useState(0);
  const [isLimitExceededAmount, setIsLimitExceededAmount] = useState(false);
  const [isTransferProcessing, setIsTransferProcessing] = useState(false);
  const isShortcutUpdate = useRef(false);

  /**
   * 계좌 정보 불러오기
   */
  const {
    data: myInfo,
    isLoading: isLoadingForMyInfo,
    isError: isErrorForMyInfo,
    error: errorMyInfo,
  } = myInfoQuery();

  const {
    data: transferAccount,
    isLoading: isLoadingForTransferAccount,
    isError: isErrorForTransferAccount,
    error: errorTransferAccount,
  } = accountByIdQuery(
    transferAccountInfo?.id ?? 0,
    transferAccountInfo?.account_type ??
      TRANSFER_ACCOUNT_TYPE.RECENT_TRANSFER_ACCOUNT,
  );

  /**
   * 컴포넌트 마운트 시 sessionStorage 에서 transferAccountInfo 를 불러옴
   */
  useEffect(() => {
    if (!transferAccountInfo && !isTransferProcessing) {
      const info = sessionStorage.getItem("transferAccountInfo");
      if (info) {
        setTransferAccountInfo(JSON.parse(info));
      } else {
        navigate(PATH.ACCOUNTS, { replace: true });
      }
    }
  }, [
    transferAccountInfo,
    isTransferProcessing,
    navigate,
    setTransferAccountInfo,
  ]);

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
  }, [transferAccount, transferAccountInfo]);

  /**
   * 송금 프로세스 중 표기될 이름
   */
  const transferProcessNickName = useMemo(() => {
    if (
      transferAccountInfo?.account_type === TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT
    ) {
      return account?.bank.bank_nickname || "내 계좌";
    }
    return account?.holder_name || "";
  }, [transferAccountInfo, account]);

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
    isShortcutUpdate.current = true;
    setAmount((prevAmount) => prevAmount + amount);
  };

  /**
   * number keypad 버튼 이벤트
   */
  const handleUpdateAmount = (value: number | "delete") => {
    isShortcutUpdate.current = false;
    setAmount((prevAmount) => {
      const currentStr = prevAmount.toString();
      if (value === "delete") {
        // 자릿수가 1 이하이면 0으로 초기화
        return currentStr.length > 1 ? Number(currentStr.slice(0, -1)) : 0;
      } else {
        // 초기값이 0인 경우 새로운 값으로 교체
        const newStr =
          currentStr === "0" ? String(value) : currentStr + String(value);
        return Number(newStr);
      }
    });
  };

  /**
   * 송금 확인 버튼 이벤트
   */
  const handleConfirm = () => {
    if (!account || !myInfo) return;

    setIsTransferProcessing(true);
    navigate(PATH.TRANSFER_PROCESS);

    const data = {
      transfer: transferData,
      account: account,
      myInfo: myInfo,
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

  if (isTransferProcessing) {
    return (
      <TransferProcess amount={amount} accountName={transferProcessNickName} />
    );
  }

  if (!transferAccountInfo || !account || !myInfo) {
    return null;
  }
  return (
    <>
      <TransferAccountInfo
        account={account}
        amount={amount}
        isShortcutUpdate={isShortcutUpdate.current}
        myInfo={myInfo}
        isLoading={isLoadingForTransferAccount && isLoadingForMyInfo}
        isError={isErrorForTransferAccount || isErrorForMyInfo}
        errorMessage={
          errorTransferAccount?.message || errorMyInfo?.message || ""
        }
        setIsLimitExceededAmount={setIsLimitExceededAmount}
      />
      <BottomAreaWrapper>
        <NumberShortcut
          disabled={isLimitExceededAmount}
          onAddAmount={handleAddAmount}
        />
        <NumberKeypad
          disabled={isLimitExceededAmount}
          onUpdateAmount={handleUpdateAmount}
        />
        <ConfirmButton
          onClick={handleConfirm}
          disabled={!amount || isLimitExceededAmount}
        >
          확인
        </ConfirmButton>
      </BottomAreaWrapper>
    </>
  );
}
