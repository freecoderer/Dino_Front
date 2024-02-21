import { getFavoritesPlayList } from "@api/playlist-controller/playlistControl";
import { PlayList } from "@components/Admin/Button/PlayList";
import OptionHeader from "@components/Layout/optionHeader";

import {  useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useInView } from "react-intersection-observer";
import { getPlaylistDTO } from "types/Admin";

const FavoritesPage: React.FC = () => {
  const [ref, inView] = useInView();
  const [count, setCount] = useState<number>(0);
  const [isLast, setLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0); // 현재 페이지를 저장할 상태
  const [cookies] = useCookies();
  const token = cookies.accessToken;

  // 플레이리스트 데이터
  const [playlistData, setPlaylistdata] = useState<getPlaylistDTO[]>([]);

  // API 호출
  const fetchData = async () => {
    try {
      const playlistResult = await getFavoritesPlayList(token,page);
      setPlaylistdata(playlistResult.data); // 기존 데이터에 새로운 데이터를 추가
      setPage((page) => page + 1);
      setCount(playlistData.length);
      
      if (count < 8) {
        setLast(false);
      } else {
        setLast(true);
      }

    } catch (error) {
      console.error(error);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (inView && !isLast) {

      fetchData();
    }
  }, [inView]);

  return (
    <div className="h-full min-h-screen w-full scrollbar-hide overflow-scroll flex  flex-col bg-white text-black text-[15px] font-medium leading-[18px]">
      <OptionHeader text='좋아요한 목록' />

      <div className="inline">
      {playlistData &&
        playlistData.map((playlist: getPlaylistDTO, index: number) => (
          <PlayList key={playlist.id} playlist={playlist} fontColor='#000' visible={true} />
        ))}
        </div>
        <div ref={ref} />

    </div>
  );
};

export default FavoritesPage;
