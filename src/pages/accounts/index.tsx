import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "@/config";
import useAccounts from "@/hooks/useAccounts";
import useBookmarks from "@/hooks/useBookmarks";
import { useEffect, useMemo } from "react";
import { Account, BookmarkAccount, RecentTransferAccount } from "@/types";
import { useAccountContext } from "@/context/AccountContext";

import AccountToggle from "@/components/accounts/AccountToggle";

export default function Accounts() {
  const navigate = useNavigate();

  const { myAccountsQuery, recentTransferAccountsQuery } = useAccounts();
  const {
    data: myAccounts,
    isLoading: isLoadingForMyAccounts,
    isError: isErrorForMyAccounts,
    error: errorMyAccounts,
  } = myAccountsQuery();
  const {
    data: recentTransferAccounts,
    isLoading: isLoadingForRecentTransferAccounts,
    isError: isErrorForRecentTransferAccounts,
    error: errorRecentTransferAccounts,
  } = recentTransferAccountsQuery();

  const { bookmarksQuery, addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarks();
  const {
    data: bookmarks,
    isLoading: isLoadingForBookmark,
    isError: isErrorForBookmark,
    error: errorBookmarks,
  } = bookmarksQuery();

  const { setTransferAccountInfo } = useAccountContext();

  /**
   * 마운트시 sessionStorage clear
   */
  useEffect(() => {
    sessionStorage.removeItem("transferAccountInfo");
  }, []);

  /**
   * 내 계좌 목록 정보 - isBookmarked 추가
   */
  const updatedMyAccounts = useMemo(() => {
    if (!myAccounts || !bookmarks) return [];
    return myAccounts.map((account: Account) => ({
      ...account,
      bookmark_id: bookmarks.reduce(
        (acc: number, bookmarks: BookmarkAccount) => {
          if (bookmarks.bank_account_number === account.account_number)
            return bookmarks.id;
          return acc;
        },
        0,
      ),
    }));
  }, [myAccounts, bookmarks]);
  /**
   * 최근 계좌 목록 정보 - isBookmarked 추가 & Account 정보로 mapping
   */
  const updatedRecentTransferAccounts = useMemo(() => {
    if (!recentTransferAccounts || !bookmarks) return [];

    return recentTransferAccounts.map((account: RecentTransferAccount) => {
      const bankInfo = BANK_INFO_MAP[account.bank.code] || DEFAULT_BANK_INFO;

      return {
        ...account,
        logo: (account as Account).logo || "",
        balance: (account as Account).balance || 0,
        bank: {
          ...account.bank,
          name: bankInfo.name,
          aliases: bankInfo.aliases,
          bank_nickname: bankInfo.bank_nickname,
        },
        bookmark_id: bookmarks.reduce(
          (acc: number, bookmarks: BookmarkAccount) => {
            if (bookmarks.bank_account_number === account.account_number)
              return bookmarks.id;
            return acc;
          },
          0,
        ),
      } as Account;
    });
  }, [recentTransferAccounts, bookmarks]);

  /**
   * 송금 계좌 선택 버튼 이벤트
   */
  const handleSelectMyAccount = (id: number) => {
    const info = {
      account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      id,
    };
    setTransferAccountInfo(info);
    sessionStorage.setItem("transferAccountInfo", JSON.stringify(info));
    navigate(PATH.TRANSFER);
  };
  const handleSelectRecentTransferAccount = (id: number) => {
    const info = {
      account_type: TRANSFER_ACCOUNT_TYPE.RECENT_TRANSFER_ACCOUNT,
      id,
    };
    setTransferAccountInfo(info);
    sessionStorage.setItem("transferAccountInfo", JSON.stringify(info));
    navigate(PATH.TRANSFER);
  };
  /**
   * 북마크 토글 버튼 이벤트
   */
  const handleAddBookmark = (accountNumber: string) => {
    addBookmarkMutation.mutate(accountNumber, {
      onSuccess: () => {},
      onError: () => {},
    });
  };
  const handleDeleteBookmark = (id: number) => {
    deleteBookmarkMutation.mutate(id, {
      onSuccess: () => {},
      onError: () => {},
    });
  };

  return (
    <div className="space-y-4">
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT}
        hasToggle={true}
        accounts={updatedMyAccounts}
        isLoading={isLoadingForMyAccounts && isLoadingForBookmark}
        isError={isErrorForMyAccounts || isErrorForBookmark}
        errorMessage={errorMyAccounts?.message || errorBookmarks?.message || ""}
        onClick={handleSelectMyAccount}
        onAddBookmark={handleAddBookmark}
        onDeleteBookmark={handleDeleteBookmark}
      />
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.RECENT_TRANSFER_ACCOUNT}
        hasToggle={false}
        accounts={updatedRecentTransferAccounts}
        isLoading={isLoadingForRecentTransferAccounts && isLoadingForBookmark}
        isError={isErrorForRecentTransferAccounts || isErrorForBookmark}
        errorMessage={
          errorRecentTransferAccounts?.message || errorBookmarks?.message || ""
        }
        onClick={handleSelectRecentTransferAccount}
        onAddBookmark={handleAddBookmark}
        onDeleteBookmark={handleDeleteBookmark}
      />
    </div>
  );
}
