# 카카오페이 Frontend 사전과제

### Router 구조
    / : home (에러 발생 : ErrorBoundary)
    ├── /accounts : 계좌 목록
    ├── /transfer : 송금
    ├──    ├──  input-amount : 송금 금액 입력
    ├──    ├──  process : 송금 중
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
    context api로 정보를 관리 송금 금액입력 페이지에서 리프레시 하더라도 정보를 유지하도록 하기 위해 ->
    sessionStorage에 저장해둠 -> 송금 금액 입력 페이지 리프레시 storage 정보 유무 판단하여 정보를 context api에 전달 또는 리다이렉트 처리
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
### 의문점
    내 계좌에서 계좌 별명 연결 데이타에 대한 확신이 없었음 -> banck_nickname 으로 연결하여 처리
### 에러 및 예외 처리
    loading시, error 발생 시, data가 누락될 경우에 대한 페이지 별 예외 처리함. 
    data 가 없을 경우 페이지의 성격에 따라 sessionStorage 를 이용하여 데이타를 불러올 수 있게 처리 또는 리다이렉트 처리
### 트랜지션 및 애니메이션 작업
    ux 경험 만족도를 향상을 위해 framer motion으로 트랜지션 및 애니메이션 추가




   
   
   
