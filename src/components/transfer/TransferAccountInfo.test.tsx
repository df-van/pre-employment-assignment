import React from "react";
import { render, screen } from "@testing-library/react";
import TransferAccountInfo from "./TransferAccountInfo";
import { Account, MyInfo } from "@/types";

describe("TransferAccountInfo 컴포넌트", () => {
  // 테스트에 사용할 모의 계좌 정보
  const mockAccount: Account = {
    id: 1,
    logo: "",
    balance: 3000000,
    account_number: "110-1234-5678",
    holder_name: "김준태",
    bank: {
      code: "088",
      name: "신한",
      image_url: "https://example.com/shinhan.png",
      aliases: ["신한", "신한은행"],
      bank_nickname: "월급통장",
    },
  };
  // 테스트에 사용할 모의 내 계좌 정보
  const mockMyInfo: MyInfo = {
    account: {
      balance: 1000000,
      account_number: "110-9999-8888",
      holder_name: "내 계좌",
      bank: {
        code: "090",
        name: "카카오뱅크",
        image_url: "https://example.com/kakao.png",
      },
    },
    transfer: {
      one_day_amount: 1000000,
    },
  };

  // 기본 Props 설정
  const defaultProps = {
    account: mockAccount,
    amount: 0,
    isShortcutUpdate: false,
    myInfo: mockMyInfo,
    isLoading: false,
    isError: false,
    errorMessage: "",
    setIsLimitExceededAmount: jest.fn(),
  };

  test("1) 로딩 중이면 LoadingCard를 표시한다.", () => {
    // isLoading이 true인 경우, 로딩 상태를 나타내는 요소가 있어야 함
    const { container } = render(
      <TransferAccountInfo {...defaultProps} isLoading={true} />,
    );
    // LoadingCard는 보통 animate-spin 클래스를 가진 요소를 렌더링하므로, 해당 요소가 존재하는지 확인
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  test("2) 에러 상태이면 ErrorMessage를 표시한다.", () => {
    // isError가 true일 때, errorMessage가 화면에 표시되어야 한다.
    render(
      <TransferAccountInfo
        {...defaultProps}
        isError={true}
        errorMessage="Error occurred"
      />,
    );
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });

  test("3) 기본 상태에서는 계좌 정보와 '얼마를 보낼까요?' 문구가 표시된다.", () => {
    // amount가 0인 경우, 기본 안내 문구 '얼마를 보낼까요?'가 표시되어야 한다.
    render(<TransferAccountInfo {...defaultProps} />);
    // 송금 대상 계좌의 정보(예: "김준태 님에게")가 표시됨
    expect(screen.getByText(/김준태 님에게/i)).toBeInTheDocument();
    // 기본 안내 문구가 표시됨
    expect(screen.getByText(/얼마를 보낼까요\?/i)).toBeInTheDocument();
    // 내 계좌(출금계좌) 정보가 표시됨 (예: "카카오뱅크 110-9999-8888")
    expect(screen.getByText(/카카오뱅크 110-9999-8888/i)).toBeInTheDocument();
  });

  test("4) amount > 0이면 '[금액]원'이 표시되고 '얼마를 보낼까요?' 문구가 사라진다.", () => {
    // amount가 10000인 경우, 금액이 "10000원"으로 표시되고 기본 안내 문구는 사라져야 한다.
    render(<TransferAccountInfo {...defaultProps} amount={10000} />);
    // getAllByText를 사용하여, 여러 요소에 걸쳐 분산된 텍스트를 결합한 결과가 "10000원"인 요소가 존재하는지 확인
    const amountElements = screen.getAllByText((content, element) => {
      const text = element?.textContent;
      return text ? text.replace(/\s/g, "") === "10000원" : false;
    });
    expect(amountElements.length).toBeGreaterThan(0);
    // "얼마를 보낼까요?" 문구가 사라져야 함
    expect(screen.queryByText(/얼마를 보낼까요\?/i)).toBeNull();
  });

  test("5) 1회 한도 초과 시 에러 메시지를 표시하고 setIsLimitExceededAmount를 호출한다.", () => {
    // amount가 2100000인 경우, 1회 한도(200만원)를 초과한 상태이므로 에러 메시지가 나타나야 한다.
    const mockSetIsLimitExceededAmount = jest.fn();
    render(
      <TransferAccountInfo
        {...defaultProps}
        amount={2100000}
        setIsLimitExceededAmount={mockSetIsLimitExceededAmount}
      />,
    );
    // 에러 메시지 "2,000,000원 송금 가능 (1회 한도 초과)"가 표시되는지 확인
    expect(
      screen.getByText(/2,000,000원 송금 가능 \(1회 한도 초과\)/),
    ).toBeInTheDocument();
    // 한도 초과 상태임을 알리기 위해 setIsLimitExceededAmount가 true로 호출되어야 함
    expect(mockSetIsLimitExceededAmount).toHaveBeenCalledWith(true);
  });
});
