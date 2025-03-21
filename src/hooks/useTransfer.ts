import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/config";
import { Account, MyInfo, Transfer } from "@/types";

export default function useTransfer() {
  const queryClient = useQueryClient();

  /**
   * 송금 요청
   */
  const transferMutation = useMutation({
    mutationFn: ({
      transfer: data,
      account,
      myInfo,
    }: {
      transfer: Transfer;
      account: Account;
      myInfo: MyInfo;
    }) => transfer(data),
    onSuccess: (_, variables) => {
      console.log("송금 성공!");
      queryClient.setQueryData(["success_transfer"], variables);
      queryClient.invalidateQueries({ queryKey: ["my_accounts"] });
      queryClient.invalidateQueries({ queryKey: ["recent_transfer_accounts"] });
    },
    onError: (error: any) => {
      console.error("송금 오류", error.response?.data?.error_code);
    },
  });
  /**
   * 최근 송금 성공 데이터를 가져오는 커스텀 훅
   */
  const useSuccessTransfer = () => {
    return useQuery({
      queryKey: ["success_transfer"],
      queryFn: () =>
        queryClient.getQueryData(["success_transfer"]) as
          | {
              transfer: Transfer;
              account: Account;
              myInfo: MyInfo;
            }
          | undefined,
      enabled: false, // 자동 fetching 방지 (캐시 데이터만 사용)
    });
  };

  const transfer = ({ bank_code, account_number, amount }: Transfer) => {
    return axios.post(`${API_URL}/transfer`, {
      bank_code,
      account_number,
      amount,
    });
  };

  return {
    transferMutation,
    useSuccessTransfer,
  };
}
