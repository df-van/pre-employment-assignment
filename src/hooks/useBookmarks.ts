import {API_URL} from "../config";
import {InvalidateQueryFilters, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import axios from "axios";

export default function useBookmarks() {
  const queryClient = useQueryClient();

  /**
   * 즐겨찾기 목록 조회
   */
  const bookmarksQuery = () => useQuery({queryKey: ['bookmarks'], queryFn: getBookmarks})

  const getBookmarks = async () => {
    const {data} = await axios.get(`${API_URL}/bookmark_accounts`);
    return data;
  }

  /**
   * 즐겨찾기 추가
   */
  const addBookmarkMutation = useMutation({
    mutationFn: (bank_account_number: string) => addBookmark(bank_account_number),
    onSuccess: () => onSuccess(['bookmarks'])
  });

  const addBookmark = (bank_account_number: string) => {
    return axios.post(`${API_URL}/bookmark_accounts`, {bank_account_number});
  }
  /**
   * 즐겨찾기 삭제
   */
  const deleteBookmarkMutation = useMutation({
    mutationFn: (id: string) => deleteBookmark(id), onSuccess: () => onSuccess(['bookmarks'])
  })

  const deleteBookmark = (id: string) => {
    return axios.delete(`${API_URL}/bookmark_accounts/${id}`);
  }

  const onSuccess =(queryKey:readonly unknown[]) => {
    queryClient.invalidateQueries({queryKey:queryKey});
  };

  return {
    bookmarksQuery, addBookmarkMutation,deleteBookmarkMutation
  }
}