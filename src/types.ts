import { PATH, TRANSFER_ACCOUNT_TYPE } from "./config";

interface Bank {
  code: string;
  name: string;
  image_url: string;
  aliases: string[];
  bank_nickname: string;
}

interface Account {
  id: number;
  logo: string;
  balance: number;
  account_number: string;
  holder_name: string;
  bank: Bank;
  isBookmarked?: boolean;
}

interface RecentTransferAccount {
  id: number;
  account_number: string;
  holder_name: string;
  bank: {
    code: string;
    image_url: string;
  };
}

interface BookmarkAccount {
  bank_account_number: string;
  id: number;
}

interface Limit {
  limit: number;
  type: string;
  message: string;
}

interface MyInfo {
  account: {
    balance: number;
    account_number: string;
    holder_name: string;
    bank: {
      code: string;
      name: string;
      image_url: string;
    };
  };
  transfer: {
    one_day_amount: number;
  };
}

interface Transfer {
  bank_code: string;
  account_number: string;
  amount: number;
}

type Path = PATH | "";
type TransferAccountType = TRANSFER_ACCOUNT_TYPE;

interface TransferAccountInfo {
  account_type: TransferAccountType;
  id: number;
}

export type {
  Bank,
  Account,
  RecentTransferAccount,
  BookmarkAccount,
  Limit,
  MyInfo,
  Transfer,
  Path,
  TransferAccountType,
  TransferAccountInfo,
};
