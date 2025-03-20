import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../config";

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
  const myAccountsQuery = () => useQuery({queryKey: ['my_accounts'], queryFn: getMyAccounts});

  const getMyAccounts = async () => {
    const {data} = await axios.get(`${API_URL}/my_accounts`);
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


  return {
    myInfoQuery, myAccountsQuery, myAccountByIdQuery
  }
}