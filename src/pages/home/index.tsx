import { useNavigate } from "react-router-dom";
import ConfirmButton from "@/components/common/ConfirmButton";
import BottomAreaWrapper from "@/components/common/BottomAreaWrapper";
import Image from "@/assets/images/img_process.png";
import ImageX2 from "@/assets/images/img_process_x2.png";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";

export default function Home() {
  const navigate = useNavigate();

  const handleGoToAccounts = () => {
    navigate("/accounts");
  };
  return (
    <>
      <TopAreaWrapper images={[Image, ImageX2]} alt="홈" className="flex-1">
        <p className="text-xl font-semibold text-center">
          송금을 시작하려면
          <br /> 받을 계좌 선택 페이지로 이동하세요.
        </p>
      </TopAreaWrapper>
      <BottomAreaWrapper>
        <ConfirmButton onClick={handleGoToAccounts}>
          받을 계좌 선택하러 가기
        </ConfirmButton>
      </BottomAreaWrapper>
    </>
  );
}
