import { PATH } from "../../config";
import { useNavigate } from "react-router-dom";

export default function TransferComplete() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(PATH.ACCOUNTS);
  };
  return (
    <>
      <h2>transfer complete</h2>
      <button onClick={onClick}>확인</button>
    </>
  );
}
