import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountToggle from "@/components/accounts/AccountToggle";
import { TRANSFER_ACCOUNT_TYPE } from "@/config";
import { Account } from "@/types";

// 테스트용 샘플 계좌 데이터 (내 계좌 데이터)
// 각 계좌 객체는 Account 타입에 맞게 필요한 속성들을 포함한다.
const sampleAccounts: Account[] = [
  {
    id: 1,
    logo: "",
    balance: 1000,
    account_number: "110-1234-5678",
    holder_name: "김준태",
    bank: {
      code: "088",
      name: "신한",
      image_url: "https://example.com/shinhan.png",
      aliases: ["신한", "신한은행"],
      bank_nickname: "월급통장", // 별명이 설정되어 있음
    },
  },
  {
    id: 2,
    logo: "",
    balance: 2000,
    account_number: "110-2345-6789",
    holder_name: "이준호",
    bank: {
      code: "090",
      name: "카카오뱅크",
      image_url: "https://example.com/kakaobank.png",
      aliases: ["카뱅", "카카오뱅크"],
      bank_nickname: "", // 별명이 없으므로 "별명 미설정"이 표시되어야 함
    },
  },
  {
    id: 3,
    logo: "",
    balance: 3000,
    account_number: "110-3456-7890",
    holder_name: "박지성",
    bank: {
      code: "011",
      name: "농협",
      image_url: "https://example.com/nh.png",
      aliases: ["농협", "농협은행"],
      bank_nickname: "추가계좌", // 별명이 설정되어 있음
    },
  },
];

describe("AccountToggle 컴포넌트", () => {
  // 각 테스트 실행 전에 초기화 작업 수행
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("hasToggle이 true일 때 초기에는 2개 계좌만 렌더링되고, 숨겨진 계좌 개수 텍스트('+1개')가 표시된다.", () => {
    render(
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT}
        hasToggle={true}
        accounts={sampleAccounts}
        isLoading={false}
        isError={false}
        errorMessage=""
        onClick={jest.fn()}
        onAddBookmark={jest.fn()}
        onDeleteBookmark={jest.fn()}
      />,
    );

    // 내 계좌 항목 확인
    // 첫 번째 계좌는 bank_nickname "월급통장"이 표시되어야 한다.
    expect(screen.getByText("월급통장")).toBeInTheDocument();
    // 두 번째 계좌는 bank_nickname가 빈 문자열이므로 "별명 미설정"으로 표시되어야 한다.
    expect(screen.getByText("별명 미설정")).toBeInTheDocument();
    // 세 번째 계좌의 bank_nickname "추가계좌"는 토글이 열리기 전에는 렌더링되지 않아야 한다.
    expect(screen.queryByText("추가계좌")).not.toBeInTheDocument();

    // 숨겨진 계좌 개수 텍스트는 여러 요소로 쪼개져 있을 수 있으므로,
    // 전체 텍스트를 결합한 값이 "+1개"와 일치하는지 확인한다.
    const hiddenCountElement = screen.getByText((content, element) => {
      const combinedText = element?.textContent?.replace(/\s/g, "");
      return combinedText === "+1개";
    });
    expect(hiddenCountElement).toBeInTheDocument();
  });

  test("토글 버튼 클릭 시 모든 계좌가 표시되고, 토글 버튼의 텍스트가 전체 계좌 수('3개')로 변경된다.", () => {
    render(
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT}
        hasToggle={true}
        accounts={sampleAccounts}
        isLoading={false}
        isError={false}
        errorMessage=""
        onClick={jest.fn()}
        onAddBookmark={jest.fn()}
        onDeleteBookmark={jest.fn()}
      />,
    );

    // 초기 상태에서 "추가계좌" (세 번째 계좌의 별칭)는 표시되지 않아야 함
    expect(screen.queryByText("추가계좌")).not.toBeInTheDocument();

    // 토글 버튼 찾기: 헤더에 "내 계좌" 텍스트를 가진 요소의 부모 요소에서 버튼을 선택
    const header = screen.getByText(/내 계좌/i).parentElement;
    const toggleButton = header?.querySelector("button");
    expect(toggleButton).toBeTruthy();

    // 토글 버튼 클릭 시 전체 계좌 목록이 표시되어야 함
    if (toggleButton) {
      fireEvent.click(toggleButton);
    }
    expect(screen.getByText("추가계좌")).toBeInTheDocument();

    // 토글 버튼의 텍스트는 여러 span으로 분할되어 있을 수 있으므로,
    // 전체 결합된 텍스트가 "3개"인지 확인
    const toggleCountElement = screen.getByText((content, element) => {
      const combinedText = element?.textContent?.replace(/\s/g, "");
      return combinedText === "3개";
    });
    expect(toggleCountElement).toBeInTheDocument();
  });

  test("isLoading이 true이면 LoadingCard를 렌더링한다.", () => {
    const { container } = render(
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT}
        hasToggle={true}
        accounts={sampleAccounts}
        isLoading={true}
        isError={false}
        errorMessage=""
        onClick={jest.fn()}
        onAddBookmark={jest.fn()}
        onDeleteBookmark={jest.fn()}
      />,
    );

    // LoadingCard는 보통 로딩 애니메이션을 위해 animate-spin 클래스를 가진 요소를 렌더링하므로,
    // 해당 요소가 존재하는지 확인한다.
    const loadingElement = container.querySelector(".animate-spin");
    expect(loadingElement).toBeInTheDocument();
  });

  test("isError가 true이면 ErrorMessage를 렌더링한다.", () => {
    render(
      <AccountToggle
        type={TRANSFER_ACCOUNT_TYPE.MY_ACCOUNT}
        hasToggle={true}
        accounts={sampleAccounts}
        isLoading={false}
        isError={true}
        errorMessage="Error occurred"
        onClick={jest.fn()}
        onAddBookmark={jest.fn()}
        onDeleteBookmark={jest.fn()}
      />,
    );

    // 에러 메시지가 "Error occurred"로 표시되는지 확인한다.
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
  });
});
