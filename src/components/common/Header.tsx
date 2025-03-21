import { useMatches, useNavigate } from "react-router-dom";
import { Path } from "@/types";
import IconLeft from "@/assets/icons/icon_header_left.svg?react";
import IconRight from "@/assets/icons/icon_header_right.svg?react";
import IconButton from "@/components/common/IconButton";
import Loading from "@/components/common/Loading";

interface HeaderInfo {
  backPath: Path;
  isShowMenu: boolean;
}

export default function Header() {
  const navigate = useNavigate();
  const matches = useMatches();

  const currentMatch = matches.find((match) => !!match.handle);
  const isShowMenu = (currentMatch?.handle as HeaderInfo)?.isShowMenu || false;
  const backPah = (currentMatch?.handle as HeaderInfo)?.backPath || "";
  const handleGoToBack = () => {
    if (backPah) navigate(backPah);
  };

  return (
    <header className="sticky w-full mt-[44px] top-[44px] flex items-center px-1 text-lg text-center bg-white">
      {backPah && (
        <IconButton onClick={handleGoToBack}>
          <IconLeft />
        </IconButton>
      )}
      {isShowMenu && (
        <IconButton className="ml-auto">
          <IconRight />
        </IconButton>
      )}
    </header>
  );
}
