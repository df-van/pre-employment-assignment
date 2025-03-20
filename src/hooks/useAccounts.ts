import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../config";
import {Account, RecentTransferAccount} from "../types";

export default function useAccounts() {
  /**
   * 내 계좌 정보 조회
   */
  const myInfoQuery = () => useQuery({queryKey: ['my_info'], queryFn: getMyInfo});
  const getMyInfo = async () => {
    const {data} = await axios.get(`${API_URL}/my_info`);
    return data;
  }
  /**
   * 내 계좌 목록 조회
   */
  const myAccountsQuery = () => useQuery<Account[]>({queryKey: ['my_accounts'], queryFn: getMyAccounts});

  const getMyAccounts = async ():Promise<Account[]> => {
    const {data} = await axios.get<Account[]>(`${API_URL}/my_accounts`);
    return data;
  }
  /**
   * 특정 계좌 조회
   */
  const myAccountByIdQuery = (id: string) => useQuery({
    queryKey: ['my_accounts', id],
    queryFn: () => getMyAccountById(id)
  })

  const getMyAccountById = async (id: string) => {
    const {data} = await axios.get(`${API_URL}/my_accounts/${id}`);
    return data;
  }


  /**
   * 최근 송금 리스트 조회
   */
  const recentTransferAccountsQuery =()=> useQuery<RecentTransferAccount[]>({queryKey:['recent_transfer_accounts'],queryFn:getRecentTransferAccounts})

  const getRecentTransferAccounts = async ():Promise<RecentTransferAccount[]>=>{
    const { data } = await axios.get<RecentTransferAccount[]>(`${API_URL}/recents_transfer_accounts`);
    return data;
  }
  /**
   * 특정 송금 계좌 조회
   */
  const recentTransferAccountByIdQuery =(id:string)=> useQuery({queryKey:['recent_transfer_account',id],queryFn:()=>getRecentTransferAccountById(id)})
  const getRecentTransferAccountById = async (id:string) =>{
    const {data} = await axios.get(`${API_URL}/recents_transfer_accounts/${id}`)
    return data;
  }
  return {
    myInfoQuery, myAccountsQuery, myAccountByIdQuery,recentTransferAccountsQuery,recentTransferAccountByIdQuery
  }
}