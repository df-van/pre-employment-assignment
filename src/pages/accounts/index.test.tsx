// Accounts.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PATH, TRANSFER_ACCOUNT_TYPE } from "../../config";
import Accounts from "./index";

// mock react-router-dom's useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// mock Loading 컴포넌트
jest.mock("../../components/common/Loading", () => () => <div>Loading...</div>);

// mock useAccounts hook
jest.mock("../../hooks/useAccounts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// mock useBookmarks hook
jest.mock("../../hooks/useBookmarks", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// mock useAccountContext hook
const setTransferAccountInfoMock = jest.fn();
jest.mock("../../context/AccountContext", () => ({
  useAccountContext: jest.fn(() => ({
    setTransferAccountInfo: setTransferAccountInfoMock,
  })),
}));

import useAccounts from "../../hooks/useAccounts";
import useBookmarks from "../../hooks/useBookmarks";

describe("Accounts 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("API 로딩중일 때 Loading 컴포넌트가 렌더링된다", () => {
    // 각 hook에서 로딩 상태로 데이터를 null로 반환
    (useAccounts as jest.Mock).mockReturnValue({
      myAccountsQuery: () => ({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      }),
      recentTransferAccountsQuery: () => ({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      }),
    });
    (useBookmarks as jest.Mock).mockReturnValue({
      bookmarksQuery: () => ({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      }),
    });

    render(
      <MemoryRouter>
        <Accounts />
      </MemoryRouter>,
    );

    // 하나라도 로딩이면 Loading 컴포넌트가 보임.
    expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
  });

  test("API 에러가 발생하면 에러 메시지가 렌더링된다", () => {
    const errorMessage = "Error occurred";

    (useAccounts as jest.Mock).mockReturnValue({
      myAccountsQuery: () => ({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
      }),
      recentTransferAccountsQuery: () => ({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      }),
    });
    (useBookmarks as jest.Mock).mockReturnValue({
      bookmarksQuery: () => ({
        data: null,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
      }),
    });

    render(
      <MemoryRouter>
        <Accounts />
      </MemoryRouter>,
    );

    // 내 계좌와 북마크 에러 메시지 확인
    expect(
      screen.getByText(
        new RegExp(`내 계좌 데이터를 불러오는데 실패했습니다: ${errorMessage}`),
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        new RegExp(`북마크 데이터를 불러오는데 실패했습니다: ${errorMessage}`),
      ),
    ).toBeInTheDocument();
  });

  test("정상 데이터 렌더링 및 버튼 클릭 동작", () => {
    // 더미 데이터 생성
    const myAccountsData = [
      { id: 1, account_number: "111", bank: { code: "001" } },
    ];
    const recentAccountsData = [
      { id: 2, account_number: "222", bank: { code: "002" } },
    ];
    // 북마크는 내 계좌의 account_number와 일치하도록 설정하여 isBookmarked가 true가 되도록 함
    const bookmarksData = [{ id: 3, bank_account_number: "111" }];

    (useAccounts as jest.Mock).mockReturnValue({
      myAccountsQuery: () => ({
        data: myAccountsData,
        isLoading: false,
        isError: false,
        error: null,
      }),
      recentTransferAccountsQuery: () => ({
        data: recentAccountsData,
        isLoading: false,
        isError: false,
        error: null,
      }),
    });
    (useBookmarks as jest.Mock).mockReturnValue({
      bookmarksQuery: () => ({
        data: bookmarksData,
        isLoading: false,
        isError: false,
        error: null,
      }),
    });

    render(
      <MemoryRouter>
        <Accounts />
      </MemoryRouter>,
    );

    // 내 계좌와 최근 계좌 데이터가 정상적으로 렌더링되는지 확인
    expect(screen.getByText(/"account_number":"111"/)).toBeInTheDocument();
    expect(screen.getByText(/"account_number":"222"/)).toBeInTheDocument();

    // 내 계좌의 버튼 클릭 시 동작 검증
    const [myAccountButton, recentAccountButton] = screen.getAllByText("click");
    fireEvent.click(myAccountButton);
    expect(setTransferAccountInfoMock).toHaveBeenCalledWith({
      account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      id: 1,
    });
    expect(mockedNavigate).toHaveBeenCalledWith(PATH.TRANSFER);

    // 최근 계좌의 버튼 클릭 시 동작 검증
    fireEvent.click(recentAccountButton);
    expect(setTransferAccountInfoMock).toHaveBeenCalledWith({
      account_type: TRANSFER_ACCOUNT_TYPE.RECENT_TRANSFER_ACCOUNT,
      id: 2,
    });
    expect(mockedNavigate).toHaveBeenCalledWith(PATH.TRANSFER);

    // "확인" 버튼 클릭 시에도 PATH.TRANSFER로 이동함을 검증
    const confirmButton = screen.getByText("확인");
    fireEvent.click(confirmButton);
    expect(mockedNavigate).toHaveBeenCalledWith(PATH.TRANSFER);
  });
});
