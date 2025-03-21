import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "@/config";
import useAccounts from "@/hooks/useAccounts";
import useBookmarks from "@/hooks/useBookmarks";
import { useMemo } from "react";
import { Account, BookmarkAccount, RecentTransferAccount } from "@/types";
import { useAccountContext } from "@/context/AccountContext";
import LoadingCard from "@/components/common/LoadingCard";
import AccountItem from "@/components/accounts/AccountItem";

export default function Accounts() {
  const navigate = useNavigate();

  const { myAccountsQuery, recentTransferAccountsQuery } = useAccounts();
  const {
    data: myAccounts,
    isLoading: isLoadingForMyAccounts,
    isError: isErrorForMyAccounts,
    error: myAccountsError,
  } = myAccountsQuery();
  const {
    data: recentTransferAccounts,
    isLoading: isLoadingForRecentTransferAccounts,
    isError: isErrorForRecentTransferAccounts,
    error: recentTransferAccountsError,
  } = recentTransferAccountsQuery();

  const { bookmarksQuery, addBookmarkMutation, deleteBookmarkMutation } =
    useBookmarks();
  const {
    data: bookmarks,
    isLoading: isLoadingForBookmark,
    isError: isErrorForBookmark,
    error: bookmarksError,
  } = bookmarksQuery();

  const { setTransferAccountInfo } = useAccountContext();

  /**
   * API 에러 케이스 처리: 하나라도 에러가 발생하면 에러 메시지 렌더링
   */
  if (
    isErrorForMyAccounts ||
    isErrorForRecentTransferAccounts ||
    isErrorForBookmark
  ) {
    return (
      <div>
        {isErrorForMyAccounts && (
          <p>
            내 계좌 데이터를 불러오는데 실패했습니다: {myAccountsError?.message}
          </p>
        )}
        {isErrorForRecentTransferAccounts && (
          <p>
            최근 계좌 데이터를 불러오는데 실패했습니다:{" "}
            {recentTransferAccountsError?.message}
          </p>
        )}
        {isErrorForBookmark && (
          <p>
            북마크 데이터를 불러오는데 실패했습니다: {bookmarksError?.message}
          </p>
        )}
      </div>
    );
  }

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
   * @param id
   */
  const handleSelectMyAccount = (id: number) => {
    setTransferAccountInfo({
      account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      id,
    });
    navigate(PATH.TRANSFER);
  };
  const handleSelectRecentTransferAccount = (id: number) => {
    setTransferAccountInfo({
      account_type: TRANSFER_ACCOUNT_TYPE.RECENT_TRANSFER_ACCOUNT,
      id,
    });
    navigate(PATH.TRANSFER);
  };
  /**
   * 북마크 토글 버튼 이벤트
   */
  const handleAddBookmark = (accountNumber: string) => {
    addBookmarkMutation.mutate(accountNumber, {
      onSuccess: () => {},
      onError: (error) => {},
    });
  };
  const handleDeleteBookmark = (id: number) => {
    deleteBookmarkMutation.mutate(id, {
      onSuccess: () => {},
      onError: (error) => {},
    });
  };

  return (
    <main>
      <section>
        <div className="px-6 py-2">
          <h4 className="text-sm">내 계좌</h4>
        </div>
        {isLoadingForMyAccounts && isLoadingForBookmark ? (
          <LoadingCard />
        ) : (
          <ul>
            {updatedMyAccounts &&
              updatedMyAccounts.map((account) => (
                <li key={account.id}>
                  <AccountItem
                    info={account}
                    onClick={handleSelectMyAccount}
                    onAddBookmark={handleAddBookmark}
                    onDeleteBookmark={handleDeleteBookmark}
                  />
                </li>
              ))}
          </ul>
        )}
      </section>
      <section>
        <div className="px-6 py-2">
          <h4 className="text-sm">최근</h4>
        </div>
        {isLoadingForRecentTransferAccounts && isLoadingForBookmark ? (
          <LoadingCard />
        ) : (
          <ul>
            {updatedRecentTransferAccounts &&
              updatedRecentTransferAccounts.map((account) => (
                <li key={account.id}>
                  <AccountItem
                    info={account}
                    onClick={handleSelectRecentTransferAccount}
                    onAddBookmark={handleAddBookmark}
                    onDeleteBookmark={handleDeleteBookmark}
                  />
                </li>
              ))}
          </ul>
        )}
      </section>
    </main>
  );
}
