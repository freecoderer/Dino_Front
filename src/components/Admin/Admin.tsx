import React, { useEffect, useState } from "react";
import { AddPlayList } from "@components/Admin/Button/AddPLayList";
import UserProfileBackground from "./UserProfileBackgroundImage";
import UserProfileImage from "./UserProfileImage";
import UserProfileInfo from "./UserProfileInfo";
import { PlayList } from "@components/Admin/Button/PlayList";
import { getMemberUsername } from "@api/member-controller/memberController";
import { getMemberDTO, getPlaylistDTO } from "types/Admin";
import { getPlayList } from "@api/playlist-controller/playlistControl";
import { useParams } from "react-router-dom";
import ToastComponent from "@components/Toast/Toast";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import Footer from "@components/Layout/footer";
import Header from "@components/Layout/header";
import useCompareToken from "@hooks/useCompareToken/useCompareToken";
import { useDispatch } from "react-redux";
import { setProfileIntroduction } from "@reducer/Admin/userProfileSlice";
import ShareImg from "@assets/Share.svg";
import { Img } from "react-image";

const AdminPage: React.FC = () => {
  const getDefaultMember = (): getMemberDTO => ({
    backgroundImageUrl: null,
    id: undefined,
    introduction: "",
    name: undefined,
    oauth2id: undefined,
    profileImageUrl: null,
    username: "",
  });
  // 유저데이터
  const [userData, setUserdata] = useState<getMemberDTO>(getDefaultMember);

  // 플레이리스트 데이터
  const [playlistData, setPlaylistdata] = useState<
    getPlaylistDTO[] | undefined
  >();

  const { username } = useParams<{ username: string | undefined }>();

  const [isLoading, setIsLoding] = useState<boolean>(true);

  // 쿠키
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResult = await getMemberUsername(username);

        setUserdata(userDataResult.data);
        dispatch(setProfileIntroduction(userDataResult.data.introduction));
        if (userDataResult.data?.id) {
          localStorage.setItem("userId", userDataResult.data.id.toString());
        }
        if (Date.now() / 1000 > Number(localStorage.getItem("exp"))) {
          localStorage.removeItem("accessToken");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const delay = 500;
    const timeoutId = setTimeout(() => {
      setIsLoding(false);
      fetchData();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [username, dispatch]);

  const { deleteProfileImage, deleteBackgroundImage } = useSelector(
    (state: RootState) => state.userProfile
  );

  useEffect(() => {
    if (deleteProfileImage) {
      setUserdata((prevData) => ({
        ...prevData,
        profileImageUrl: null,
      }));
    }
  }, [deleteProfileImage]);

  useEffect(() => {
    if (deleteBackgroundImage) {
      setUserdata((prevData) => ({
        ...prevData,
        backgroundImageUrl: null,
      }));
    }
  }, [deleteBackgroundImage]);
  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        const playlistDataResult = await getPlayList(username);
        setPlaylistdata(playlistDataResult.data);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    fetchPlaylistData();
  }, [username, userData]);

  // 토스트
  const { toast } = useSelector((state: RootState) => state.toast);

  // 권한부여
  const authority = useCompareToken(userData?.id);

  // margin Top

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "MyList",
          text: "Check out MyList!",
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="relative w-full h-full mx-auto scrollbar-hide overflow-scroll flex flex-col justify-between bg-neutral-900">
      <Header id={userData.id} authority={authority} />

      <UserProfileBackground
        userBackgroundImage={userData?.backgroundImageUrl}
      />
      {/* 로그인 여부 */}
      {/* {!induceLogin ? <InduceButton /> : <></>} */}

      {/* 플레이리스트 생성 성공 토스트 */}

      {toast === "add" && (
        <ToastComponent
          background="white"
          text="새로운 플레이리스트 생성이 완료되었습니다 !"
        />
      )}

      {/* 로그인 성공 토스트 */}

      {toast === "login" && (
        <ToastComponent background="white" text="로그인 성공 ! " />
      )}
      {/* 프로필 성공 토스트 */}

      {toast === "profile" && (
        <ToastComponent
          background="white"
          text="프로필이 정상적으로 수정되었습니다 !"
        />
      )}

      {/* 프로필 실패 토스트 */}
      {toast === "not_profile" && (
        <ToastComponent
          background="white"
          text="프로필이 수정을 실패했습니다 !"
        />
      )}
      {/* 복사 성공 토스트 */}

      {toast === "copy" && (
        <ToastComponent background="white" text="링크가 복사되었습니다." />
      )}

      {/* 검은화면 */}
      <div className={`w-full -mt-[40px]`}>
        {/* 프로필 이미지 */}
        <div
          className={`flex relative items-center flex-col z-10 bg-neutral-900 rounded-tl-[30px] rounded-tr-[30px] `}
        >
          <UserProfileImage userProfileImage={userData?.profileImageUrl} />
          {userData.id && !authority && (
            <Img
              onClick={handleShare}
              src={ShareImg}
              alt="share"
              className="w-6 h-6 absolute top-3 right-4 cursor-pointer"
            />
          )}

          <UserProfileInfo
            username={userData?.username}
            // introText={userData?.introduction}
          />
        </div>

        {/* 플레이리스트 */}

        <div
          className={`bg-neutral-900 min-h-[468px] rounded-tl-[30px] rounded-tr-[30px]`}
        >
          {playlistData &&
            playlistData.map((playlist: getPlaylistDTO, index: number) => (
              <PlayList key={playlist.id} playlist={playlist} />
            ))}

          {!isLoading &&
          authority &&
          playlistData?.length !== undefined &&
          playlistData.length < 4 ? (
            <AddPlayList />
          ) : (
            <></>
          )}
        </div>

        {/* 여기까지 플레이리스트 */}
      </div>
      <Footer bgColor="neutral-900" />
    </div>
  );
};

export default AdminPage;
