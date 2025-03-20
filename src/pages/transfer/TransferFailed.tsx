import {PATH} from "../../config";
import {useNavigate} from "react-router-dom";

export default function TransferFailed() {
  const navigate = useNavigate();
  const onClick = () => {
    navigate(PATH.TRANSFER);
  }
  return (
    <>
      <h2>transfer failed</h2>
      <button onClick={onClick}>확인</button>
    </>
  )
}