import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/accounts");
  };
  return (
    <>
      <h1>Home</h1>
      <p>송금을 시작하려면 계좌 선택 페이지로 이동하세요.</p>
      <button onClick={onClick}>계좌 선택하기</button>
    </>
  );
}
