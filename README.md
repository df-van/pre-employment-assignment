# 카카오페이 Frontend 사전과제

카카오페이 frontend 사전과제를 위한 템플릿입니다. 과제를 해결하기 위한 전략 및 아키텍쳐들을 작성해주세요.

### Api를 카테고리로 나누어 react-query를 사용하여 커스텀 훅을 만든다.
#### 설치
    pnpm add --save-dev axios
    pnpm add @tanstack/react-query
    pnpm add --save-dev jest
#### 카테고리
    - useAccounts : 계좌 관련 API
    - useBookmarks : 즐겨찾기 API
    - useTransfer : 송금 API   
#### 설정 관련 글로벌 변수를 config.ts 에서 관리
    API_URL : api 주소
### Router 구조
    / : home (에러 발생 : ErrorBoundary)
    ├── /accounts : 계좌 목록
    ├── /transfer : 송금
    ├──    ├──  input-amount : 송금 금액 입력
    ├──    ├──  process : 송금 중 화면
    ├──    ├──  complete : 송금 완료 화면
    ├──    └──  failed : 송금 실패
    └── /not-found : 알 수 없는 주소
   
   
   
