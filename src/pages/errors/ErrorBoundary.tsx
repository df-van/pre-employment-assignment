import {useRouteError} from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  return (
    <>
      <h1>예상치 못한 오류 발생</h1>
      <p>문제가 발생했습니다. 다시 시도해 주세요.</p>
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      <a href="/">홈으로 돌아가기</a>
    </>
  )
}