import { ReactNode } from "react";
import ImgSrcSet from "@/components/common/ImgSrcSet";

export default function TopAreaWrapper({
  images,
  alt,
  children,
  className,
}: {
  images: string[];
  alt: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${className || ""}`}>
      <div className="flex flex-col justify-center items-center mt-10 space-y-5">
        <ImgSrcSet images={images} alt={alt} />
        {children}
      </div>
    </div>
  );
}
