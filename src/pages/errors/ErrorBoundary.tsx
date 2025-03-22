import { useNavigate } from "react-router-dom";
import { PATH } from "@/config";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import Image from "@/assets/images/img_failed.png";
import ImageX2 from "@/assets/images/img_failed_x2.png";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import ConfirmButton from "@/components/common/ConfirmButton";

export default function ErrorBoundary() {
  const navigate = useNavigate();
  const handleConfirm = () => {
    navigate(PATH.HOME);
  };
  return (
    <main className="flex flex-col h-screen">
      <TopAreaWrapper
        images={[Image, ImageX2]}
        alt="송금 실패"
        className="flex-1"
      >
        <p className="text-xl font-semibold">예상치 못한 오류 발생</p>
        <p className="text-[#FF3C3C] whitespace-pre-line text-center">
          {`문제가 발생했습니다. 다시 시도해 주세요.`}
        </p>
      </TopAreaWrapper>
      <BottomAreaWrapper>
        <ConfirmButton variant="danger" onClick={handleConfirm}>
          홈으로 돌아가기
        </ConfirmButton>
      </BottomAreaWrapper>
    </main>
  );
}
