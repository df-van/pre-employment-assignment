import { useNavigate } from "react-router-dom";
import { PATH } from "@/config";
import ImageX2 from "@/assets/images/img_failed_x2.png";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import Image from "@/assets/images/img_failed.png";
import ConfirmButton from "@/components/common/ConfirmButton";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";

export default function NotFound() {
  const navigate = useNavigate();
  const handleConfirm = () => {
    navigate(PATH.HOME);
  };
  return (
    <>
      <TopAreaWrapper
        images={[Image, ImageX2]}
        alt="송금 실패"
        className="flex-1"
      >
        <p className="text-xl font-semibold">페이지를 찾을 수 없습니다</p>
        <p className="text-[#FF3C3C] whitespace-pre-line text-center">
          잘못된 경로로 접근하셨습니다.
        </p>
      </TopAreaWrapper>
      <BottomAreaWrapper>
        <ConfirmButton variant="danger" onClick={handleConfirm}>
          홈으로 돌아가기
        </ConfirmButton>
      </BottomAreaWrapper>
    </>
  );
}
