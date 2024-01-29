import { MusicDataRowContentProps } from "types/EditplayList";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsEditMusics } from "@reducer/editMusic/editMusic";
import "@styles/EditList/playList.css";
import Swal from "sweetalert2";
import { deleteMusicList } from "@api/music-controller/musicControl";
import { useEffect, useRef, useState } from "react";

export const MusicDataRowContent: React.FC<MusicDataRowContentProps> = ({
  musicData,
  order,
  playlistId,
  username,
  isEditing,
  token,
}) => {
  const [titleWidth, setTitleWidth] = useState(0);
  const [artistWidth, setArtistWidth] = useState(0);
  const titleRef = useRef<HTMLSpanElement>(null);
  const artistRef = useRef<HTMLSpanElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEditClick = () => {
    if (isEditing) {
      navigate(`/${username}/admin/${playlistId}/edit/${musicData.id}`);
      dispatch(setIsEditMusics(true));
    }
  };
  const handleDeleteClick = () => {
    Swal.fire({
      title: "노래를 삭제하시겠습니까?",
      text: "한번 삭제된 노래는 복구할 수 없습니다!",
      showCancelButton: true,
      confirmButtonColor: "blue",
      cancelButtonColor: "#d33",
      confirmButtonText: "취소",
      cancelButtonText: "삭제",
      width: "250px",
      customClass: {
        title: "text-black text-[15px] font-bold",
        popup:
          "h-[150px] w-[250px] text-center text-[15px] font-bold text-black",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // '취소' 버튼을 눌렀을 때 실행할 코드를 여기에 작성합니다.
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // '삭제' 버튼을 눌렀을 때 실행할 코드를 여기에 작성합니다.
        try {
          await deleteMusicList(musicData.id, token);

          Swal.fire({
            title: "삭제되었습니다!",
            width: "250px",
            customClass: {
              title: "text-black text-[15px] font-bold",
              popup:
                "h-[150px] w-[250px] text-center text-[15px] font-bold text-black",
            },
          });
        } catch (error) {
          console.log(error);
          Swal.fire({
            title: "노래 삭제에 실패했습니다.",
            width: "250px",
            customClass: {
              title: "text-black text-[15px] font-bold",
              popup:
                "h-[150px] w-[250px] text-center text-[15px] font-bold text-black",
            },
          });
        }
      }
    });
  };

  useEffect(() => {
    if (titleRef.current && artistRef.current) {
      const titleElement = titleRef.current;
      const artistElement = artistRef.current;
      const titleWidth = titleElement.scrollWidth;
      const artistWidth = artistElement.scrollWidth;
      setTitleWidth(titleWidth);
      setArtistWidth(artistWidth);
    }
  }, [musicData]);

  const TitleLength = titleWidth >= 205;
  const ArtistLength = artistWidth >= 105;
  return (
    <div className="flex  justify-between h-[50px] mb-2 mx-2">
      <div
        onClick={handleEditClick}
        className={`flex flex-row ${
          isEditing ? "" : "w-full"
        } w-full items-center h-[50px] p-3 px-[7px] rounded-[15px] bg-[#2E2E2E] cursor-pointer`}
      >
        <div className="ml-2 w-1/12">
          <span>{order}</span>
        </div>
        <div className="w-7/12 overflow-hidden">
          <div className="flex items-center">
            <span
              ref={titleRef}
              className={`flex-shrink-0 ${
                TitleLength ? "animate-marquee" : ""
              }`}
            >
              {musicData.title}
            </span>
          </div>
        </div>
        <div className="text-[13px] w-4/12 pl-3 overflow-hidden">
          <div className="flex items-center">
            <span
              ref={artistRef}
              className={`flex-shrink-0 ${
                ArtistLength ? "animate-marquee" : ""
              }`}
            >
              {musicData.artist}
            </span>
          </div>
        </div>
      </div>{" "}
      <div
        onClick={handleDeleteClick}
        className={`flex ml-2 mx-1 items-center ${isEditing ? "" : "hidden"}`}
      >
        <RiDeleteBin6Fill size={20} className="text-[#FF0000] cursor-pointer" />
      </div>
    </div>
  );
};