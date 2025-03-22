import Image from "@/assets/images/img_process.png";
import ImageX2 from "@/assets/images/img_process_x2.png";
import TopAreaWrapper from "@/components/common/TopAreaWrapper";
import { formatToWon } from "@/utils";
import ImgSrcSet from "@/components/common/ImgSrcSet";
import { motion } from "framer-motion";

export default function TransferProcess({
  accountName,
  amount,
}: {
  accountName: string;
  amount: number;
}) {
  return (
    <TopAreaWrapper>
      <motion.div
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "circOut",
        }}
        animate={{ y: -30, scaleX: 1.1, scaleY: 1.1 }}
      >
        <ImgSrcSet
          images={[Image, ImageX2]}
          alt="송금중"
          className="w-[112px] h-[112px]"
        />
      </motion.div>
      <div className="text-xl font-semibold text-center">
        <p>{`${accountName} 계좌로`}</p>
        <p>{`${formatToWon(amount)}원을`}</p>
        <p>{`보내는 중이예요`}</p>
      </div>
    </TopAreaWrapper>
  );
}
