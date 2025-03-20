# 카카오페이 Frontend 사전과제

카카오페이 frontend 사전과제를 위한 템플릿입니다. 과제를 해결하기 위한 전략 및 아키텍쳐들을 작성해주세요.
#### 추가 설치 목록
    pnpm add --save-dev --save-exact prettier
    pnpm add react-router-dom  
    pnpm add --save-dev axios
    pnpm add @tanstack/react-query
    pnpm add @tanstack/react-query-devtools@latest
    pnpm add --save-dev jest
### Router 구조
    / : home (에러 발생 : ErrorBoundary)
    ├── /accounts : 계좌 목록
    ├── /transfer : 송금
    ├──    ├──  input-amount : 송금 금액 입력
    ├──    ├──  complete : 송금 완료 화면
    ├──    └──  failed : 송금 실패
    └── /not-found : 알 수 없는 주소
### Api를 카테고리로 나누어 react-query를 사용하여 커스텀 훅을 만든다.

#### 카테고리
    - useAccounts : 계좌 관련 API
    - useBookmarks : 즐겨찾기 API
    - useTransfer : 송금 API   
#### 설정 관련 글로벌 변수를 config.ts 에서 관리
    API_URL : api 주소
    BANK_INFO_MAP : 은행 정보 목록
    DEFAULT_BANK_INFO : 은행 코드가 없을 경우의 기본 은행 정보
### 송금 계좌 id 와 type 은 context api 로 관리
    transferAccountInfo: TransferAccountInfo | null;
    setTransferAccountInfo: (info: TransferAccountInfo | null) => void;





   
   
   
