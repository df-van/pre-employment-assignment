import Image from "@/assets/images/img_failed.png";
import ImageX2 from "@/assets/images/img_failed_x2.png";
import ImgSrcSet from "@/components/common/ImgSrcSet";

export default function ErrorMessage({
  title = "에러가 발생했습니다.",
  message = "다시 시도해주세요.",
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <ImgSrcSet
        className="w-10 h-auto"
        images={[Image, ImageX2]}
        alt="에러 발생"
      />

      <p className="font-semibold">{title}</p>
      <p className="text-alert whitespace-pre-line text-center text-sm">
        {message}
      </p>
    </div>
  );
}
