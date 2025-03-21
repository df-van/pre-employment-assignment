import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PATH, TRANSFER_ACCOUNT_TYPE } from "../../config";
import InputAmount from "./InputAmount";

// mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

// mock Loading 컴포넌트
jest.mock("../../components/Loading", () => () => <div>Loading...</div>);

// mock useAccounts hook
const myInfoQueryMock = jest.fn();
const accountByIdQueryMock = jest.fn();
jest.mock("../../hooks/useAccounts", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    myInfoQuery: myInfoQueryMock,
    accountByIdQuery: accountByIdQueryMock,
  })),
}));

// mock useAccountContext hook
const setTransferAccountInfoMock = jest.fn();
const useAccountContextMock = jest.fn();
jest.mock("../../context/AccountContext", () => ({
  useAccountContext: () => useAccountContextMock(),
}));

// mock useTransfer hook
const mutateMock = jest.fn();
jest.mock("../../hooks/useTransfer", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    transferMutation: { mutate: mutateMock },
  })),
}));

describe("InputAmount 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("transferAccountInfo가 없으면 계좌 목록 페이지로 리다이렉트", async () => {
    useAccountContextMock.mockReturnValue({
      transferAccountInfo: null,
      setTransferAccountInfo: setTransferAccountInfoMock,
    });

    myInfoQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });
    accountByIdQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith(PATH.ACCOUNTS, {
        replace: true,
      });
    });
  });

  test("API 에러 발생 시 에러 메시지 출력", async () => {
    useAccountContextMock.mockReturnValue({
      transferAccountInfo: {
        id: 1,
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      },
      setTransferAccountInfo: setTransferAccountInfoMock,
    });

    myInfoQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "내 계좌 에러" },
    });
    accountByIdQueryMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "선택한 계좌 에러" },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(
        /내 계좌 데이터를 불러오는데 실패했습니다: 내 계좌 에러/,
      ),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        /선택한 계좌 데이터를 불러오는데 실패했습니다: 선택한 계좌 에러/,
      ),
    ).toBeInTheDocument();
  });

  test("정상 데이터 렌더링 및 송금 버튼 클릭 시 동작", async () => {
    useAccountContextMock.mockReturnValue({
      transferAccountInfo: {
        id: 1,
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      },
      setTransferAccountInfo: setTransferAccountInfoMock,
    });

    myInfoQueryMock.mockReturnValue({
      data: { id: 1, name: "홍길동", balance: 5000 },
      isLoading: false,
      isError: false,
      error: null,
    });
    accountByIdQueryMock.mockReturnValue({
      data: { id: 1, account_number: "12345678", bank: { code: "004" } },
      isLoading: false,
      isError: false,
      error: null,
    });

    mutateMock.mockImplementation((_data, { onSuccess }) => {
      onSuccess();
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/홍길동/)).toBeInTheDocument();
    expect(await screen.findByText(/12345678/)).toBeInTheDocument();

    fireEvent.click(screen.getByText("확인"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
      expect(setTransferAccountInfoMock).toHaveBeenCalledWith(null);
      expect(mockedNavigate).toHaveBeenCalledWith(PATH.TRANSFER_COMPLETE);
    });
  });
});
