import { useEffect, useState } from "react";
import plus from "../../../assets/Admin/plus.svg";
import useWindowSizeCustom from "../../../hooks/useWindowSizeCustom";
import { postPlayList } from "@api/playlist-controller/playlistControl";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToast } from "@reducer/Toast/toast";
export const AddPlayList = () => {
  const { windowSize, isMobile } = useWindowSizeCustom();

  const [customMargin, setCustomMargin] = useState<number>(0);

  useEffect(() => {
    if (!isMobile) {
      setCustomMargin((390 / 2 - 151) / 2);
    } else {
      if (windowSize.width > 400 && windowSize.width <= 429) {
        setCustomMargin((windowSize.width / 2 - 151) / 2);
      } else if (windowSize.width >= 430) {
        setCustomMargin((390 / 2 - 151) / 2);
      } else if (windowSize.width >= 390 && windowSize.width <= 400 ) {
        setCustomMargin((390 / 2 - 151) / 2);
      }
      else if (windowSize.width < 390) {
        setCustomMargin((windowSize.width / 2 - 151) / 2);
      }
    }
  }, [windowSize.width, isMobile]);

  const [cookie] = useCookies();
  let token = cookie.accessToken;
  // 더미데이터
  const [title] = useState(null);
  const [titleImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleAddPlaylist = async (title : null, titleImage: null, token : string) => {
    const post = await postPlayList(title, titleImage, token);
    console.log(post);
    if (post && post.status === 200) {
      dispatch(setToast("profile"));
      navigate(`${post.data.id}`)
      
    }
  };

  const handleClick = () => {
    handleAddPlaylist(title, titleImage, token);
  };

  return (
    <div style={{ marginLeft: `${customMargin}px`, marginRight: `${customMargin}px` }} className="inline-block h-[150px] mt-[10px] relative">

      <button onClick={handleClick} style={{ background: '#2E2E2E' }} className="w-[150px] h-[150px] rounded-[13px] font-light text-zinc-300 text-4xl ">

        <img className="mx-auto mt-[0px] w-[33px] h-full" src={plus} alt="Plus Icon" />

        <div className="absolute bottom-1 left-0 right-0 text-center text-zinc-300 text-[12px] font-medium font-['Noto Sans']">
          새로운 플레이리스트
        </div>
      </button>
    </div>
  );
};