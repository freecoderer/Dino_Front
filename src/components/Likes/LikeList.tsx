import { getLikeList } from "@api/playlist-controller/playlistControl";
import { useCallback, useEffect, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Noimage from "@assets/noimage.jpg";
import { useRecoilValue } from "recoil";
import { playlistNameState } from "@atoms/Playlist/playlistName";
import { useInView } from "react-intersection-observer";
import InfiniteDiv from "@components/InfiniteDiv/InfiniteDiv";

const UserProfile = ({ user }: any) => {
  const navigate = useNavigate();

  const handleProfileClick = useCallback(() => {
    navigate(`/user/${user.username}`);
  }, [navigate, user.username]);
  return (
    <main className="flex items-center justify-between p-4">
      <div className="flex items-center">
        <img
          src={user.profileImageUrl ? user.profileImageUrl : Noimage}
          alt="프로필 이미지"
          className="w-14 h-14 rounded-full"
        />
        <div className="ml-4">
          <h2 className="text-lg font-bold">{user.username}</h2>
          <p className="text-sm text-gray-500">{user.introduction}</p>
        </div>
      </div>
      <button
        onClick={handleProfileClick} /* 프로필 바로가기 기능 구현 */
        className="px-4 py-2 text-sm bg-black text-white rounded-2xl"
      >
        프로필
      </button>
    </main>
  );
};

const LikeList = () => {
  const navigate = useNavigate();

  const { playlistId } = useParams<{ playlistId: string }>();

  const [users, setUsers] = useState<any[]>([]);
  const [view, inView] = useInView();

  const [isLast, setLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const playlistName = useRecoilValue(playlistNameState);

  const fetchLikeList = async () => {
    try {
      const response = await getLikeList(Number(playlistId), page);
      setUsers((prevUsers) => [...prevUsers, ...response.data]);

      setPage((page) => page + 1);

      if (response.data.length < 15) {
        setLast(true); // 마지막 페이지의 항목 수를 사용하여 isLast를 설정
      } else {
        setLast(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (inView && !isLast) {
      fetchLikeList();
    }
  }, [inView]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  console.log(page);
  return (
    <>
      <div className="h-full w-full scrollbar-hide overflow-scroll flex flex-col bg-white text-black font-medium leading-[18px]">
        <header className="flex h-[5%] smartPhoneXs:h-[3.5%] smartPhone:h-[3.5%] tabletMini:h-[3%] tablet:h-[3%] items-center justify-between m-3 text-[19px] border-b-[1px] border-[#EFEFEF]">
          <button
            type="button"
            onClick={handleBack}
            className="text-white self-start mt-2"
          >
            <FaAngleLeft size={24} color="black" />
          </button>
          <p className="text-center mx-auto">{playlistName}</p>
        </header>
        {/* 이만큼 API가져와서 Mapping */}
        {users.length > 0 ? (
          users.map((user: any) => (
            <>
              <UserProfile key={user.id} user={user} />
            </>
          ))
        ) : (
          <p>좋아요가 없습니다.</p>
        )}
        <div>
          <InfiniteDiv view={view} />
        </div>
      </div>
    </>
  );
};

export default LikeList;
