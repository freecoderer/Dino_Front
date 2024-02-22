import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSearchPlaylist } from '@api/search-controller/searchController';
import { PlayList } from '@components/Admin/Button/PlayList';
import { getPlaylistDTO } from 'types/Admin';
import { useInView } from 'react-intersection-observer';
import OptionHeader from '@components/Layout/optionHeader';

const SearchPlaylistDetail: React.FC = () => {
  const location = useLocation();
  const [ref, inView] = useInView();
  const [count, setCount] = useState<number>(0);
  const [isLast, setLast] = useState<boolean>(false);
  const [page, setPage] = useState(0); // 현재 페이지를 저장할 상태

  // URL 파라미터 읽기
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query');

  // 플레이리스트 데이터
  const [playlistData, setPlaylistdata] = useState<getPlaylistDTO[]>([]);

  // API 호출
  const fetchData = async () => {
    try {
      const searchResult = await getSearchPlaylist(query, page);
      setPlaylistdata([...playlistData, ...searchResult.data]); // 기존 데이터에 새로운 데이터를 추가
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
    <div className="w-full h-full min-h-screen relative flex flex-col bg-white scrollbar-hide overflow-scroll font-PretendardMedium">
      <OptionHeader text="검색" />

      <main className='h-full pb-[80px] '>

      <div className='text-[18px] font-PretendardSemiBold text-center'>'{query}' 검색 결과</div>
      <p className='p-4'> 플레이리스트 </p>

        {playlistData &&
          playlistData.map((playlist: getPlaylistDTO, index: number) => (
            <PlayList key={playlist.id} playlist={playlist} fontColor='#000' visible={true} />
          ))}

        <div ref={ref} />
      </main>

    </div>
  )
}

export default SearchPlaylistDetail
