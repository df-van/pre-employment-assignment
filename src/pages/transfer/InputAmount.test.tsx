import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputAmount from "./InputAmount";
import { MemoryRouter } from "react-router-dom";
import { PATH, TRANSFER_ACCOUNT_TYPE } from "@/config";
import { useAccountContext } from "@/context/AccountContext";
import useAccounts from "@/hooks/useAccounts";
import useTransfer from "@/hooks/useTransfer";

// react-router-dom의 useNavigate 모의 구현
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// AccountContext 모의 구현 (transferAccountInfo, setTransferAccountInfo)
const mockSetTransferAccountInfo = jest.fn();
jest.mock("@/context/AccountContext", () => ({
  useAccountContext: jest.fn(),
}));

// useAccounts 훅 모의 구현
jest.mock("@/hooks/useAccounts", () => jest.fn());
// useTransfer 훅 모의 구현
jest.mock("@/hooks/useTransfer", () => jest.fn());

// sessionStorage에 값을 설정하는 헬퍼 함수
function mockSessionStorage(key: string, value: any) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

describe("InputAmount 페이지", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  test("1) transferAccountInfo가 없고 sessionStorage에도 없으면 /accounts로 리다이렉트된다.", () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: null,
      setTransferAccountInfo: mockSetTransferAccountInfo,
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({ data: null, isLoading: false, isError: false }),
      accountByIdQuery: () => ({
        data: null,
        isLoading: false,
        isError: false,
      }),
    });
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: jest.fn() },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    // transferAccountInfo와 sessionStorage에 값이 없으므로 /accounts로 리다이렉트되어야 함
    expect(mockNavigate).toHaveBeenCalledWith(PATH.ACCOUNTS, { replace: true });
  });

  test("2) transferAccountInfo가 없지만 sessionStorage에 있으면, sessionStorage의 값으로 세팅된다.", () => {
    const storedInfo = {
      account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
      id: 1,
    };
    mockSessionStorage("transferAccountInfo", storedInfo);

    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: null,
      setTransferAccountInfo: mockSetTransferAccountInfo,
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({
        data: {
          account: {
            bank: {
              code: "088",
              name: "신한",
              account_number: "110-1234-5678",
            },
            balance: 500000,
          },
          transfer: { one_day_amount: 100000 },
        },
        isLoading: false,
        isError: false,
      }),
      accountByIdQuery: () => ({
        data: {
          id: 1,
          bank: {
            code: "088",
            name: "신한",
            account_number: "110-1234-5678",
            image_url: "test.png",
          },
          account_number: "110-1234-5678",
          holder_name: "김준태",
        },
        isLoading: false,
        isError: false,
      }),
    });
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: jest.fn() },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    // sessionStorage의 storedInfo 값으로 setTransferAccountInfo가 호출되어야 함
    expect(mockSetTransferAccountInfo).toHaveBeenCalledWith(storedInfo);
  });

  test("3) 로딩 상태일 경우, 데이터가 없으므로 컴포넌트가 null을 반환한다.", () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: {
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
        id: 1,
      },
      setTransferAccountInfo: mockSetTransferAccountInfo,
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({ data: null, isLoading: true, isError: false }),
      accountByIdQuery: () => ({ data: null, isLoading: true, isError: false }),
    });
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: jest.fn() },
    });

    const { container } = render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    // 데이터가 없으므로 container.firstChild가 null이어야 한다.
    expect(container.firstChild).toBeNull();
  });

  test("4) 이체 계좌 정보와 myInfo가 정상적으로 불러와지면 UI가 표시된다.", () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: {
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
        id: 1,
      },
      setTransferAccountInfo: mockSetTransferAccountInfo,
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({
        data: {
          account: {
            bank: {
              code: "088",
              name: "신한",
              account_number: "110-1234-5678",
            },
            balance: 500000,
          },
          transfer: { one_day_amount: 100000 },
        },
        isLoading: false,
        isError: false,
      }),
      accountByIdQuery: () => ({
        data: {
          id: 1,
          bank: {
            code: "088",
            name: "신한",
            image_url: "test.png",
            account_number: "110-1234-5678",
          },
          account_number: "110-1234-5678",
          holder_name: "김준태",
        },
        isLoading: false,
        isError: false,
      }),
    });
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: jest.fn() },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    // "김준태 님에게"와 "얼마를 보낼까요?" 문구가 화면에 표시되어야 한다.
    expect(screen.getByText(/김준태 님에게/i)).toBeInTheDocument();
    expect(screen.getByText(/얼마를 보낼까요\?/i)).toBeInTheDocument();
  });

  test("5) 키패드 입력 시 금액이 변경되어 '1원'이 표시되고, 확인 버튼이 활성화된다.", async () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: {
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
        id: 1,
      },
      setTransferAccountInfo: jest.fn(),
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({
        data: {
          account: {
            bank: {
              code: "088",
              name: "신한",
              account_number: "110-1234-5678",
            },
            balance: 500000,
          },
          transfer: { one_day_amount: 100000 },
        },
        isLoading: false,
        isError: false,
      }),
      accountByIdQuery: () => ({
        data: {
          id: 1,
          bank: { code: "088", name: "신한", account_number: "110-1234-5678" },
          account_number: "110-1234-5678",
          holder_name: "김준태",
        },
        isLoading: false,
        isError: false,
      }),
    });
    const mockMutate = jest.fn();
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: mockMutate },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    const confirmButton = screen.getByRole("button", { name: /확인/i });
    expect(confirmButton).toBeDisabled();

    // 키패드의 숫자 "1" 버튼 클릭
    fireEvent.click(screen.getByText("1"));

    // "1원"이라는 텍스트가 여러 요소에 걸쳐 표시될 수 있으므로, getAllByText를 사용하여 반환된 배열의 길이를 확인
    const amountElements = await screen.findAllByText((content, element) => {
      const text = element?.textContent;
      return text ? text.replace(/\s/g, "") === "1원" : false;
    });
    expect(amountElements.length).toBeGreaterThan(0);

    // 확인 버튼이 활성화되어야 한다.
    expect(confirmButton).not.toBeDisabled();
  });

  test("6) 1회 한도(200만원) 초과 시 에러 메시지가 표시되고, 확인 버튼은 비활성화된다.", async () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: {
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
        id: 1,
      },
      setTransferAccountInfo: mockSetTransferAccountInfo,
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({
        data: {
          account: { bank: {}, balance: 5000000 },
          transfer: { one_day_amount: 0 },
        },
        isLoading: false,
        isError: false,
      }),
      accountByIdQuery: () => ({
        data: {
          id: 1,
          bank: { code: "088", name: "신한", account_number: "110-1234-5678" },
          account_number: "110-1234-5678",
          holder_name: "김준태",
        },
        isLoading: false,
        isError: false,
      }),
    });
    const mockMutate = jest.fn();
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: mockMutate },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    const confirmButton = screen.getByRole("button", { name: /확인/i });
    expect(confirmButton).toBeDisabled();

    // Shortcut 버튼 "+200만" 클릭
    const plusTwoMillion = screen.getByText("+200만");
    fireEvent.click(plusTwoMillion);
    // 이후 "+1만" 버튼 클릭 -> 총 2,010,000원이 되어 한도 초과 상태가 되어야 함
    const plusOneButton = screen.getByText("+1만");
    fireEvent.click(plusOneButton);

    // "2,000,000원 송금 가능 (1회 한도 초과)" 메시지가 화면에 표시되어야 한다.
    const errorMsg = await screen.findByText(
      /2,000,000원 송금 가능 \(1회 한도 초과\)/,
    );
    expect(errorMsg).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  test("7) 확인 버튼 클릭 시 transferMutation.mutate가 호출되고, 성공 시 TRANSFER_COMPLETE로 이동한다.", async () => {
    (useAccountContext as jest.Mock).mockReturnValue({
      transferAccountInfo: {
        account_type: TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT,
        id: 1,
      },
      setTransferAccountInfo: jest.fn(),
    });
    (useAccounts as jest.Mock).mockReturnValue({
      myInfoQuery: () => ({
        data: {
          account: {
            bank: {
              code: "088",
              name: "신한",
              account_number: "110-1234-5678",
            },
            balance: 500000,
          },
          transfer: { one_day_amount: 100000 },
        },
        isLoading: false,
        isError: false,
      }),
      accountByIdQuery: () => ({
        data: {
          id: 1,
          bank: { code: "088", name: "신한", account_number: "110-1234-5678" },
          account_number: "110-1234-5678",
          holder_name: "김준태",
        },
        isLoading: false,
        isError: false,
      }),
    });
    const mockMutate = jest.fn((data, { onSuccess }) => onSuccess());
    (useTransfer as jest.Mock).mockReturnValue({
      transferMutation: { mutate: mockMutate },
    });

    render(
      <MemoryRouter>
        <InputAmount />
      </MemoryRouter>,
    );

    // 금액 1000원 입력: "1" 버튼 클릭 후, "0" 버튼을 getAllByText로 선택해 첫 번째 버튼 클릭
    fireEvent.click(screen.getByText("1"));
    const zeroButtons = screen.getAllByText("0");
    fireEvent.click(zeroButtons[0]);
    fireEvent.click(zeroButtons[0]);
    fireEvent.click(zeroButtons[0]);

    const confirmButton = screen.getByRole("button", { name: /확인/i });
    expect(confirmButton).not.toBeDisabled();

    // 확인 버튼 클릭 시 transferMutation.mutate 호출 확인
    fireEvent.click(confirmButton);
    expect(mockMutate).toHaveBeenCalled();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(PATH.TRANSFER_COMPLETE);
    });
  });
});
