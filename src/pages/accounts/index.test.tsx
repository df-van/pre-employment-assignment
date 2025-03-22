import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Accounts from "@/pages/accounts/index";
import { MemoryRouter } from "react-router-dom";
import { PATH, TRANSFER_ACCOUNT_TYPE } from "@/config";

// 모의 데이터 생성
const myAccountsData = [
  {
    id: 1,
    account_number: "110-1234-5678",
    bank: {
      bank_nickname: "월급통장", // 계좌별명이 존재하면 해당 값 사용
      image_url: "https://example.com/shinhan.png",
      name: "신한",
      aliases: ["신한", "신한은행"],
    },
  },
  {
    id: 2,
    account_number: "110-2345-6789",
    bank: {
      bank_nickname: "", // 계좌별명이 없으므로 "별명 미설정"으로 표시되어야 함
      image_url: "https://example.com/kakaobank.png",
      name: "카카오뱅크",
      aliases: ["카뱅", "카카오뱅크"],
    },
  },
];

const recentTransferAccountsData = [
  {
    id: 1,
    account_number: "143-5678-9012",
    holder_name: "김하진",
    bank: { code: "004", image_url: "https://example.com/kb.png" },
  },
];

const bookmarksData = [
  {
    bank_account_number: "110-2345-6789",
    id: 10,
  },
];

// useAccounts 훅 모의 구현
jest.mock("@/hooks/useAccounts", () => () => ({
  myAccountsQuery: () => ({
    data: myAccountsData,
    isLoading: false,
    isError: false,
    error: null,
  }),
  recentTransferAccountsQuery: () => ({
    data: recentTransferAccountsData,
    isLoading: false,
    isError: false,
    error: null,
  }),
  accountByIdQuery: jest.fn(),
}));

// useBookmarks 훅 모의 구현
const mockAddBookmarkMutation = { mutate: jest.fn() };
const mockDeleteBookmarkMutation = { mutate: jest.fn() };
jest.mock("@/hooks/useBookmarks", () => () => ({
  bookmarksQuery: () => ({
    data: bookmarksData,
    isLoading: false,
    isError: false,
    error: null,
  }),
  addBookmarkMutation: mockAddBookmarkMutation,
  deleteBookmarkMutation: mockDeleteBookmarkMutation,
}));

// AccountContext 모의 구현
const mockSetTransferAccountInfo = jest.fn();
jest.mock("@/context/AccountContext", () => ({
  useAccountContext: () => ({
    setTransferAccountInfo: mockSetTransferAccountInfo,
  }),
}));

// react-router-dom의 useNavigate 훅 모의 구현
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Accounts 페이지에 대한 테스트
describe("Accounts 페이지", () => {
  // 각 테스트 실행 전에 sessionStorage 초기화 및 모의 함수 리셋
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test("내 계좌와 최근 송금 계좌가 올바르게 렌더링된다.", () => {
    render(
      <MemoryRouter>
        <Accounts />
      </MemoryRouter>,
    );

    // 내 계좌 항목: 첫 번째 계좌의 경우, 계좌별명이 "월급통장"으로 표시되어야 한다.
    expect(screen.getByText("월급통장")).toBeInTheDocument();
    // 두 번째 계좌의 경우, 계좌별명이 없으므로 "별명 미설정"이 표시되어야 한다.
    expect(screen.getByText("별명 미설정")).toBeInTheDocument();

    // 최근 송금 계좌 항목: 수취인 이름 "김하진"이 표시되어야 한다.
    expect(screen.getByText("김하진")).toBeInTheDocument();
  });

  test("내 계좌 항목 클릭 시 setTransferAccountInfo가 호출되고, sessionStorage에 저장되며, 페이지가 송금 페이지로 이동한다.", () => {
    render(
      <MemoryRouter>
        <Accounts />
      </MemoryRouter>,
    );

    // "월급통장" 텍스트를 가진 내 계좌 항목 클릭
    const accountItem = screen.getByText("월급통장");
    fireEvent.click(accountItem);

    // setTransferAccountInfo가 TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT와 id 1의 인자로 호출되어야 함
    expect(mockSetTransferAccountInfo).toHaveBeenCalledWith({
      account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      id: 1,
    });

    // sessionStorage에 transferAccountInfo 정보가 저장되었는지 확인 (문자열로 저장됨)
    const stored = sessionStorage.getItem("transferAccountInfo");
    expect(stored).toBe(
      JSON.stringify({ account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT, id: 1 }),
    );

    // 페이지 이동이 PATH.TRANSFER 경로로 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledWith(PATH.TRANSFER);
  });
});
