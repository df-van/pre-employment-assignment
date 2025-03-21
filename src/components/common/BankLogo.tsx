import React from "react";

export default function BankLogo({
  url = "",
  alias,
  className = "w-10 h-10",
}: {
  url?: string;
  alias?: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <img className="w-full h-auto" src={url} alt={String(...(alias || ""))} />
    </div>
  );
}
