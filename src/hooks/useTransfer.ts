import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {API_URL} from "../config";
import {Transfer} from "../types";

export default function useTransfer() {
  const queryClient = useQueryClient();

  /**
   * 송금 요청
   */
  const transferMutation = useMutation({
    mutationFn:({ bank_code, account_number, amount }: Transfer)=> transfer({ bank_code, account_number, amount }),
    onSuccess:()=>{
      console.log('송금 성공!');
      queryClient.invalidateQueries({queryKey:['my_accounts']});
      queryClient.invalidateQueries({queryKey:["recent_transfer_accounts"]});
    },
    onError:(error:any)=>{
      console.error('송금 오류',error.response?.data?.error_code)
    }
  })

  const transfer = ({ bank_code, account_number, amount }: Transfer)=>{
    return axios.post(`${API_URL}/transfer`,{bank_code,account_number,amount});
  }

  return {
    transferMutation
  }
}