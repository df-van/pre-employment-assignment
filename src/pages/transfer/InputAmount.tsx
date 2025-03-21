import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "@/config";
import useAccounts from "@/hooks/useAccounts";
import Loading from "@/components/common/Loading";
import { useAccountContext } from "@/context/AccountContext";
import { useEffect, useMemo, useState } from "react";
import useTransfer from "@/hooks/useTransfer";
import { Account, Transfer } from "@/types";

export default function InputAmount() {
  const navigate = useNavigate();

  const { myInfoQuery, accountByIdQuery } = useAccounts();
  const {
    data: myInfo,
    isLoading: isLoadingForMyInfo,
    isError: isErrorForMyInfo,
    error: myInfoError,
  } = myInfoQuery();

  const { transferAccountInfo, setTransferAccountInfo } = useAccountContext();

  const {
    data: transferAccount,
    isLoading: isLoadingForTransferAccount,
    isError: isErrorForTransferAccount,
    error: transferAccountError,
  } = accountByIdQuery(
    transferAccountInfo?.id!,
    transferAccountInfo?.account_type!,
  );

  const { transferMutation } = useTransfer();

  const [amount] = useState(10);
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

  const onClick = () => {
    setIsTransferProcessing(true);
    navigate(PATH.TRANSFER_PROCESS);
    transferMutation.mutate(transferData, {
      onSuccess: () => {
        setTransferAccountInfo(null); // 송금 계좌 정보 초기화
        navigate(PATH.TRANSFER_COMPLETE);
      },
      onError: (error) => {
        navigate(PATH.TRANSFER_FAILED);
      },
    });
  };
  return (
    <>
      <p>{JSON.stringify(transferAccountInfo)}</p>
      {isTransferProcessing ? (
        <h2>transfer process</h2>
      ) : (
        <>
          <h2>input amount</h2>
          <h4>내 계좌</h4>
          {isErrorForMyInfo ? (
            <div>
              내 계좌 데이터를 불러오는데 실패했습니다:{" "}
              {myInfoError?.message || "알 수 없는 에러"}
            </div>
          ) : isLoadingForMyInfo ? (
            <Loading />
          ) : (
            myInfo && <p>{JSON.stringify(myInfo)}</p>
          )}
          <h5>선택한 계좌</h5>
          {isErrorForTransferAccount ? (
            <div>
              선택한 계좌 데이터를 불러오는데 실패했습니다:{" "}
              {transferAccountError?.message || "알 수 없는 에러"}
            </div>
          ) : isLoadingForTransferAccount ? (
            <Loading />
          ) : (
            account && <p>{JSON.stringify({ account })}</p>
          )}
          <button onClick={onClick} disabled={isTransferProcessing}>
            확인
          </button>
        </>
      )}
    </>
  );
}
