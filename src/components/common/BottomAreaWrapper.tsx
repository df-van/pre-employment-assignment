import { ReactNode } from "react";

export default function BottomAreaWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative w-full pb-8 bg-white">
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}
