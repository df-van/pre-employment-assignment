import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../config";

export default function useTransfer() {
  const queryClient = useQueryClient();
  /**
   * 최근 송금 리스트 조회
   */
  const recentTransfersQuery =()=> useQuery({queryKey:['recent_transfers'],queryFn:getRecentTransfers})

  const getRecentTransfers = async ()=>{
    const { data } = await axios.get(`${API_URL}/recents_transfer_accounts`);
    return data;
  }
  /**
   * 특정 송금 계좌 조회
   */
  const recentTransferByIdQuery =(id:string)=> useQuery({queryKey:['recent_transfer',id],queryFn:()=>getRecentTransferById(id)})
  const getRecentTransferById = async (id:string) =>{
    const {data} = await axios.get(`${API_URL}/recents_transfer_accounts/${id}`)
    return data;
  }
  /**
   * 송금 요청
   */
  const transferMutation = useMutation({
    mutationFn:({ bank_code, account_number, amount }: { bank_code: string; account_number: string; amount: number })=> transfer(bank_code,account_number,amount),
    onSuccess:()=>{
      console.log('송금 성공!');
      queryClient.invalidateQueries({queryKey:['my_accounts']});
      queryClient.invalidateQueries({queryKey:["recent_transfers"]});
    },
    onError:(error:any)=>{
      console.error('송금 오류',error.response?.data?.error_code)
    }
  })

  const transfer = (bank_code: string, account_number: string, amount: number)=>{
    return axios.post(`${API_URL}/transfer`,{bank_code,account_number,amount});
  }

  return {

  }
}