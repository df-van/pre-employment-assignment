# 카카오페이 Frontend 사전과제

카카오페이 frontend 사전과제를 위한 템플릿입니다. 과제를 해결하기 위한 전략 및 아키텍쳐들을 작성해주세요.
#### 추가 설치 목록
    prettier
    react-router-dom  
    axios
    @tanstack/react-query
    @tanstack/react-query-devtools@latest
    jest
    ts-jest
    ts-jest-mock-import-meta
    ts-node
    jest-environment-jsdom
    @babel/preset-typescript
    @testing-library/dom
    @testing-library/jest-dom
    @testing-library/react
    @types/jest
    @types/node
    @types/react
    @types/react-dom
    vite-plugin-svgr : vite 환경에서 svg 파일을 react 컴포넌트로 변환해주는 플러그인
    tailwindcss
    postcss
    autoprefixer

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
    계좌 id 정보와 내 계좌, 최근 사용 계좌 인지에 대한 정보
    localStorage 방식과 url query 방식 중 context api로 일단 진행 -> localStorage 방식으로 변경 예정
### 공용 헤더 정보 route 메타 정보로 관리
    뒤로 가기 버튼 path 값과 타이틀 정보
### Jest 와 Testing Library 를 이용하여 주요 컴포넌트 테스트
    Jest : 테스트 파일 실행 및 예상 결과 검증 수행, 모킹 기능 
    Testing Library : DOM 랜더링, 이벤트 시뮬레이션
### tailwindcss 로 스타일링 
    기본 텍스트 색상 설정 : #060B11
    최소 너비 지정 : 375px
### 송금 과정 데이터 관리
    myInfo, transferAccount, transfer 정보는 리액트 쿼리 캐시에 저장





   
   
   
