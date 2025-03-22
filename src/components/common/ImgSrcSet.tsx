export default function ImgSrcSet({
  images,
  alt,
  className,
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const srcSet = images.map((img, index) => `${img} ${index + 1}x`).join(", ");

  return images.length > 0 ? (
    <img
      src={images[0]}
      srcSet={srcSet}
      alt={alt}
      className={className || ""}
    />
  ) : (
    <></>
  );
}
