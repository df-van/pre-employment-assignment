import { useNavigate } from "react-router-dom";
import {
  BANK_INFO_MAP,
  DEFAULT_BANK_INFO,
  PATH,
  TRANSFER_ACCOUNT_TYPE,
} from "../../config";
import useAccounts from "../../hooks/useAccounts";
import Loading from "../../components/Loading";
import useBookmarks from "../../hooks/useBookmarks";
import { useMemo } from "react";
import { Account, BookmarkAccount, RecentTransferAccount } from "../../types";
import { useAccountContext } from "../../context/AccountContext";

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

  const { bookmarksQuery } = useBookmarks();
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
      isBookmarked: bookmarks.some(
        (bookmarks: BookmarkAccount) =>
          bookmarks.bank_account_number === account.account_number,
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
        isBookmarked: bookmarks.some(
          (bookmark: BookmarkAccount) =>
            bookmark.bank_account_number === account.account_number,
        ),
      };
    });
  }, [recentTransferAccounts, bookmarks]);

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
  const onClick = () => {
    navigate(PATH.TRANSFER);
  };
  return (
    <>
      <h1>accounts</h1>
      <h4>내 계좌</h4>
      {isLoadingForMyAccounts && isLoadingForBookmark ? (
        <Loading />
      ) : (
        <ul>
          {updatedMyAccounts &&
            updatedMyAccounts.map((account) => (
              <li key={account.id}>
                {JSON.stringify(account)}
                <button onClick={() => handleSelectMyAccount(account.id)}>
                  click
                </button>
              </li>
            ))}
        </ul>
      )}

      <h4>최근</h4>
      {isLoadingForRecentTransferAccounts && isLoadingForBookmark ? (
        <Loading />
      ) : (
        <ul>
          {updatedRecentTransferAccounts &&
            updatedRecentTransferAccounts.map((account) => (
              <li key={account.id}>
                {JSON.stringify(account)}
                <button
                  onClick={() => handleSelectRecentTransferAccount(account.id)}
                >
                  click
                </button>
              </li>
            ))}
        </ul>
      )}
      <h5>---bookmark---</h5>
      {isLoadingForBookmark ? (
        <Loading />
      ) : (
        <ul>
          {bookmarks &&
            bookmarks.map((bookmark) => (
              <li key={bookmark.id}>{JSON.stringify(bookmark)}</li>
            ))}
        </ul>
      )}
      <button onClick={onClick}>확인</button>
    </>
  );
}
