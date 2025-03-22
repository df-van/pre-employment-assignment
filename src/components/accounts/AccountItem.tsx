import { Account, TransferAccountType } from "@/types";
import IconButton from "@/components/common/IconButton";
import React, { useMemo } from "react";
import BankLogo from "@/components/common/BankLogo";
import { TRANSFER_ACCOUNT_TYPE } from "@/config";
import { motion } from "framer-motion";

export default function AccountItem({
  type,
  info,
  onClick,
  onAddBookmark,
  onDeleteBookmark,
}: {
  type: TransferAccountType;
  info: Account;
  onClick: (id: number) => void;
  onAddBookmark: (accountNumber: string) => void;
  onDeleteBookmark: (id: number) => void;
}) {
  const bookmarkedPath =
    "M14.8463 8.20855C14.9054 8.37187 15.0537 8.4847 15.2262 8.49743L21.2562 8.93822C21.9603 9.04622 22.2478 9.90804 21.7502 10.4195L17.2356 14.2114C17.1109 14.3163 17.054 14.4823 17.089 14.6421L18.4709 20.9786C18.5886 21.7022 17.8233 22.243 17.1839 21.8883L12.2558 18.3207C12.1031 18.2101 11.8969 18.2101 11.7438 18.3207L6.81605 21.8883C6.17673 22.243 5.41138 21.7022 5.52909 20.9786L6.91101 14.6421C6.94602 14.4823 6.88913 14.3163 6.76442 14.2114L2.24977 10.4195C1.75223 9.90804 2.03972 9.04622 2.74381 8.93822L8.77384 8.49743C8.94582 8.4847 9.0946 8.37187 9.15368 8.20855L11.2077 2.5051C11.5228 1.83163 12.4772 1.83163 12.7923 2.5051L14.8463 8.20855Z";

  const unBookmarkedPath =
    "M12.7923 2.5051L14.8463 8.20855C14.9054 8.37187 15.0537 8.4847 15.2262 8.49743L21.2562 8.93822C21.9603 9.04622 22.2478 9.90804 21.7502 10.4195L17.2356 14.2114C17.1109 14.3163 17.054 14.4823 17.089 14.6421L18.4709 20.9786C18.5886 21.7022 17.8233 22.243 17.1839 21.8883L12.2558 18.3207C12.1031 18.2101 11.8969 18.2101 11.7438 18.3207L6.81605 21.8883C6.17673 22.243 5.41138 21.7022 5.52909 20.9786L6.91101 14.6421C6.94602 14.4823 6.88913 14.3163 6.76442 14.2114L2.24977 10.4195C1.75223 9.90804 2.03972 9.04622 2.74381 8.93822L8.77384 8.49743C8.94582 8.4847 9.0946 8.37187 9.15368 8.20855L11.2077 2.5051C11.5228 1.83163 12.4772 1.83163 12.7923 2.5051ZM12 4.733L10.5642 8.71877C10.3216 9.38949 9.73288 9.86932 9.03446 9.97629L8.8832 9.99344L4.46 10.316L7.73011 13.0636C8.23872 13.4915 8.49041 14.1477 8.40499 14.7991L8.37656 14.9617L7.352 19.647L10.8654 17.1048C11.498 16.6479 12.3373 16.6174 12.9969 17.0141L13.1354 17.1057L16.645 19.646L15.6237 14.9631C15.4813 14.3129 15.6829 13.6396 16.1489 13.1746L16.2709 13.0628L19.539 10.316L15.1157 9.99336C14.4035 9.94077 13.7838 9.50203 13.4924 8.85791L13.4351 8.71681L12 4.733Z";

  const isBookmarked = useMemo(() => !!info.bookmark_id, [info]);

  const name = useMemo(() => {
    if (type === TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT) {
      return info.bank.bank_nickname || "별명 미설정";
    }
    return info.holder_name;
  }, [type, info]);

  const handlerClick = () => {
    onClick(info.id);
  };
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!!info.bookmark_id) {
      onDeleteBookmark(info.bookmark_id);
    } else {
      onAddBookmark(info.account_number);
    }
  };

  return (
    <div className="px-3 bg-white">
      <IconButton
        className="inline-flex w-full justify-between items-center p-3 space-x-3 rounded-xl"
        onClick={handlerClick}
      >
        <BankLogo
          className="w-9 h-9"
          url={info.bank.image_url}
          alias={info.bank.aliases}
        />
        <div className="text-left  grow">
          <p>{name}</p>
          <span className="text-xs opacity-55">{`${info.bank.name} ${info.account_number}`}</span>
        </div>
        <div className="cursor-pointer" onClick={handleBookmarkClick}>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              fill: isBookmarked ? "#FFEB00" : "#060B11",
              fillOpacity: isBookmarked ? 1 : 0.28,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.path
              fillRule="evenodd"
              clipRule="evenodd"
              key={isBookmarked ? "bookmarked" : "unBookmarkedPath"}
              d={isBookmarked ? bookmarkedPath : unBookmarkedPath}
              fill={isBookmarked ? "#FFEB00" : "#060B11"}
            />
          </motion.svg>
        </div>
      </IconButton>
    </div>
  );
}
