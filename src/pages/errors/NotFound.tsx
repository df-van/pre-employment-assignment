import {useNavigate} from "react-router-dom";

export default function NotFound(){
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>잘못된 경로로 접근하셨습니다.</p>
      <button onClick={() => navigate('/')}>홈으로</button>
    </div>
  );
}