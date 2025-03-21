import { PATH } from "@/config";
import { useLocation, useNavigate } from "react-router-dom";
import Image from "@/assets/images/img_failed.png";
import ImageX2 from "@/assets/images/img_failed_x2.png";
import ConfirmButton from "@/components/common/ConfirmButton";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import { useMemo } from "react";

export default function TransferFailed() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorCode = queryParams.get("errorCode");

  const title = useMemo(() => {
    switch (errorCode) {
      case "ERROR_FAILED_TO_TRANSFER":
        return "송금을 완료하지 못했어요";
      case "ERROR_FAILED_TO_CONFIRM_TRANSFER":
        return "송금 결과를 확인하지 못했어요";
      default:
        return "송금을 완료하지 못했어요";
    }
  }, [errorCode]);
  const description = useMemo(() => {
    switch (errorCode) {
      case "ERROR_FAILED_TO_TRANSFER":
        return (
          "정상적으로 처리되지 않아 송금이 실패했습니다.\n" +
          "잠시 후 다시 시도해 주세요."
        );
      case "ERROR_FAILED_TO_CONFIRM_TRANSFER":
        return (
          "송금 확인이 늦어지고 있어요.\n" +
          "최종 결과는 송금 내역 화면에서 확인해주세요."
        );
      default:
        return (
          "정상적으로 처리되지 않아 송금이 실패했습니다.\n" +
          "잠시 후 다시 시도해 주세요."
        );
    }
  }, [errorCode]);

  const handleConfirm = () => {
    navigate(PATH.TRANSFER);
  };
  return (
    <>
      <TopAreaWrapper
        images={[Image, ImageX2]}
        alt="송금 실패"
        className="flex-1"
      >
        <p className="text-xl font-semibold"> {title}</p>
        <p className="text-[#FF3C3C] whitespace-pre-line text-center">
          {" "}
          {description}
        </p>
      </TopAreaWrapper>
      <BottomAreaWrapper>
        <ConfirmButton variant="danger" onClick={handleConfirm}>
          확인
        </ConfirmButton>
      </BottomAreaWrapper>
    </>
  );
}
