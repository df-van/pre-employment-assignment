import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, TRANSFER_ACCOUNT_TYPE } from "../config";
import {
  Account,
  MyInfo,
  RecentTransferAccount,
  TransferAccountType,
} from "../types";

export default function useAccounts() {
  /**
   * 내 계좌 정보 조회
   */
  const myInfoQuery = () =>
    useQuery<MyInfo>({ queryKey: ["my_info"], queryFn: getMyInfo });
  const getMyInfo = async (): Promise<MyInfo> => {
    const { data } = await axios.get<MyInfo>(`${API_URL}/my_info`);
    return data;
  };
  /**
   * 내 계좌 목록 조회
   */
  const myAccountsQuery = () =>
    useQuery<Account[]>({ queryKey: ["my_accounts"], queryFn: getMyAccounts });

  const getMyAccounts = async (): Promise<Account[]> => {
    const { data } = await axios.get<Account[]>(`${API_URL}/my_accounts`);
    return data;
  };

  /**
   * 최근 송금 리스트 조회
   */
  const recentTransferAccountsQuery = () =>
    useQuery<RecentTransferAccount[]>({
      queryKey: ["recent_transfer_accounts"],
      queryFn: getRecentTransferAccounts,
    });
  const getRecentTransferAccounts = async (): Promise<
    RecentTransferAccount[]
  > => {
    const { data } = await axios.get<RecentTransferAccount[]>(
      `${API_URL}/recents_transfer_accounts`,
    );
    return data;
  };

  /**
   * type에 따라 상세 계좌 변경하여 조회
   */
  const accountByIdQuery = (id: number, type: TransferAccountType) =>
    useQuery<Account | RecentTransferAccount>({
      queryKey: ["account_by_id", id],
      queryFn: () =>
        type === TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT
          ? getMyAccountById(id)
          : getRecentTransferAccountById(id),
      enabled: !!id && !!type,
    });

  const getMyAccountById = async (id: number): Promise<Account> => {
    const { data } = await axios.get<Account>(`${API_URL}/my_accounts/${id}`);
    return data;
  };
  const getRecentTransferAccountById = async (
    id: number,
  ): Promise<RecentTransferAccount> => {
    const { data } = await axios.get<RecentTransferAccount>(
      `${API_URL}/recents_transfer_accounts/${id}`,
    );
    return data;
  };

  return {
    myInfoQuery,
    myAccountsQuery,
    recentTransferAccountsQuery,
    accountByIdQuery,
  };
}
