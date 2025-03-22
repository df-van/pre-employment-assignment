import Image from "@/assets/images/img_process.png";
import ImageX2 from "@/assets/images/img_process_x2.png";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import { formatToWon } from "@/utils";

export default function TransferProcess({
  accountName,
  amount,
}: {
  accountName: string;
  amount: number;
}) {
  return (
    <TopAreaWrapper images={[Image, ImageX2]} alt="송금중">
      <div className="text-xl font-semibold text-center">
        <p>{`${accountName} 계좌로`}</p>
        <p>{`${formatToWon(amount)}원을`}</p>
        <p>{`보내는 중이예요`}</p>
      </div>
    </TopAreaWrapper>
  );
}
