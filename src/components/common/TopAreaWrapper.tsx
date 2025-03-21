import { ReactNode } from "react";

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
  const srcSet = images.map((img, index) => `${img} ${index + 1}x`).join(", ");

  return (
    <div className={`${className || ""}`}>
      <div className="flex flex-col justify-center items-center mt-10 space-y-5">
        {images.length > 0 && <img src={images[0]} srcSet={srcSet} alt={alt} />}
        {children}
      </div>
    </div>
  );
}
