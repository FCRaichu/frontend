import { useNavigate, useOutletContext } from "react-router-dom";

interface PostContext {
  setTicketImage: React.Dispatch<React.SetStateAction<string>>;
}

export default function TicketVerifyStep() {
  const navigation = useNavigate();
  const { setTicketImage } = useOutletContext<PostContext>();

  // 이미지 업로드 시
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return; // 선택된 값이 없는 경우 Return
    setTicketImage(e.target.files[0].name);
    console.log(e.target.files[0].name);
  };

  // TODO: 이미지 서버로 전송하는 로직 추가
  const handleNextClick = () => {
    navigation("/post/general/new");
  };

  return (
    <div>
      {/* TODO: 이미지 업로드 프리뷰 */}
      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        name="ticket_image"
        onChange={handleChange}
      />
      <button onClick={handleNextClick}>Next</button>
    </div>
  );
}
