export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * route path
 */
export const enum PATH {
  HOME = "/",
  ACCOUNTS = "/accounts",
  TRANSFER = "/transfer",
  TRANSFER_INPUT_AMOUNT = "/transfer/input-amount",
  TRANSFER_COMPLETE = "/transfer/complete",
  TRANSFER_FAILED = "/transfer/failed",
}

/**
 * route query
 */
export const enum TRANSFER_ACCOUNT_TYPE {
  MY_ACCOUNT = "my-account",
  RECENT_TRANSFER_ACCOUNT = "recent-transfer-account",
}

/**
 * 계좌 은행 정보 목록 맵
 */
export const BANK_INFO_MAP: Record<
  string,
  { name: string; aliases: string[]; bank_nickname: string }
> = {
  "004": { name: "국민", aliases: ["국민", "국민은행"], bank_nickname: "" },
  "011": {
    name: "농협",
    aliases: ["농협", "농협은행", "NH", "NH농협"],
    bank_nickname: "",
  },
  "032": { name: "하나", aliases: ["하나", "하나은행"], bank_nickname: "" },
  "088": { name: "신한", aliases: ["신한", "신한은행"], bank_nickname: "" },
  "090": {
    name: "카카오뱅크",
    aliases: ["카뱅", "카카오뱅크"],
    bank_nickname: "",
  },
};
export const DEFAULT_BANK_INFO = {
  name: "알 수 없음",
  aliases: ["알 수 없음"],
  bank_nickname: "",
};
