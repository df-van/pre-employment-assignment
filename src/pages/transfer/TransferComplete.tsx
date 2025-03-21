import { BANK_INFO_MAP, DEFAULT_BANK_INFO, PATH } from "@/config";
import { useNavigate } from "react-router-dom";
import useTransfer from "@/hooks/useTransfer";
import Image from "@/assets/images/img_success.png";
import ImageX2 from "@/assets/images/img_success_x2.png";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import { useMemo } from "react";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import ConfirmButton from "@/components/common/ConfirmButton";

export default function TransferComplete() {
  const navigate = useNavigate();

  const { useSuccessTransfer } = useTransfer();
  const { data } = useSuccessTransfer();

  const myBankName = useMemo(() => {
    const bankInfo =
      BANK_INFO_MAP[data?.myInfo.account.bank.code || ""] || DEFAULT_BANK_INFO;

    return bankInfo.name;
  }, [data]);

  const handleConfirm = () => {
    navigate(PATH.ACCOUNTS);
  };
  return (
    <>
      <TopAreaWrapper
        images={[Image, ImageX2]}
        alt="송금 완료"
        className="flex-1"
      >
        <div className="text-center space-y-1.5">
          <p className="text-xl font-semibold">송금을 완료했어요</p>
          <div className="flex flex-col items-center">
            <span className="opacity-55">{`${data?.account.bank.name} ${data?.account.account_number}`}</span>
            <span className="opacity-55">{`${data?.account.holder_name} 님에게 ${data?.transfer.amount}원을 보냈어요.`}</span>
          </div>
        </div>
      </TopAreaWrapper>
      <BottomAreaWrapper>
        <div className="mb-9">
          <div className="flex justify-between">
            <span className="text-sm opacity-55">출금계좌</span>
            <span className="text-sm font-semibold">{`${myBankName} ${data?.myInfo.account.account_number}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm opacity-55">수수료</span>
            <span className="text-sm font-semibold">무료</span>
          </div>
        </div>
        <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      </BottomAreaWrapper>
    </>
  );
}
