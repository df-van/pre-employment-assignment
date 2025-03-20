import { useNavigate } from "react-router-dom";
import { PATH } from "../../config";
import useAccounts from "../../hooks/useAccounts";
import Loading from "../../components/Loading";
import { useAccountContext } from "../../context/AccountContext";
import { useEffect, useMemo, useState } from "react";
import useTransfer from "../../hooks/useTransfer";
import { Transfer } from "../../types";

export default function InputAmount() {
  const navigate = useNavigate();

  const { myInfoQuery } = useAccounts();
  const { data: myInfo, isLoading } = myInfoQuery();

  const { transferAccount, setTransferAccount } = useAccountContext();

  const { transferMutation } = useTransfer();

  const [amount, setAmount] = useState(10);

  const [isTransferProcessing, setIsTransferProcessing] = useState(false);

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
   * 선택한 계좌 정보가 없을 경우 계좌 목록으로 리다이렉트
   */
  useEffect(() => {
    if (!transferAccount && !isTransferProcessing) {
      navigate(PATH.ACCOUNTS, { replace: true });
    }
  }, [transferAccount, navigate]);

  const onClick = () => {
    setIsTransferProcessing(true);
    transferMutation.mutate(transferData, {
      onSuccess: () => {
        setTransferAccount(null); // 송금 계좌 정보 초기화
        navigate(PATH.TRANSFER_COMPLETE);
      },
      onError: (error) => {
        console.error(`송금 실패 : ${error}`);
        navigate(PATH.TRANSFER_FAILED);
      },
    });
  };
  return (
    <>
      {isTransferProcessing ? (
        <h2>transfer process</h2>
      ) : (
        <>
          <h2>input amount</h2> <h4>내 계좌</h4>
          {isLoading ? <Loading /> : myInfo && <p>{JSON.stringify(myInfo)}</p>}
          <h5>선택한 계좌</h5>
          {transferAccount && <p>{JSON.stringify({ transferAccount })}</p>}
          <button onClick={onClick} disabled={isTransferProcessing}>
            확인
          </button>
        </>
      )}
    </>
  );
}
