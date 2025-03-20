import {useNavigate} from "react-router-dom";
import {PATH} from "../../config";

export default function NotFound(){
  const navigate = useNavigate();
  const onClick = ()=>{
    navigate(PATH.HOME);
  }
  return (
    <div className="not-found">
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>잘못된 경로로 접근하셨습니다.</p>
      <button onClick={onClick}>홈으로</button>
    </div>
  );
}