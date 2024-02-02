import React, { useEffect, useState } from "react";
import AdminEditModal from "@pages/Admin/AdminEditModal";
import { AddPlayList } from "@components/Admin/Button/AddPLayList";
import { EditProfile } from "@components/Admin/Modal/EditProfile";
import UserProfileBackground from "./UserProfileBackgroundImage";
import OpenOption from "./Button/OpenOption";
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

const AdminPage: React.FC = () => {
  // console.log(Cookies.get("accessToken"))
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tokenId = Number(localStorage.getItem("tokenId"));
  const userId = Number(localStorage.getItem("userId"));
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
  localStorage.setItem("username", username ? username : "");

  const [isLoading, setIsLoding] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDataResult = await getMemberUsername(username);
        // Cookies.set('accessToken', 'accessToken');

        setUserdata(userDataResult.data);
        if (userDataResult.data?.id) {
          localStorage.setItem("userId", userDataResult.data.id.toString());
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
  }, [username]);

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

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 옵션 모달 열기 이벤트
  const [optionsModalPosition, setOptionsModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const [isOptionsModalOpen, setOptionsModalOpen] = useState(false);

  const openOptionsModal = () => {
    setOptionsModalOpen(true);
  };

  const closeOptionsModal = () => {
    setOptionsModalOpen(false);
  };

  // 옵션모달 열리는 창 위치
  const calculateOptionsModalPosition = (e: React.MouseEvent<EventTarget>) => {
    const button = e.target as HTMLElement;
    const rect = button.getBoundingClientRect();

    setOptionsModalPosition({
      top: rect.top + rect.height,
      left: rect.left - 160 + rect.width,
    });

    openOptionsModal();
  };

  // 토스트
  const { toast } = useSelector((state: RootState) => state.toast);

  return (
    <div className="relative w-full h-screen scrollbar-hide overflow-scroll flex flex-col bg-white">
      <UserProfileBackground
        userBackgroundImage={userData?.backgroundImageUrl}
      />

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

      {/* 복사 성공 토스트 */}

      {toast === "copy" && (
        <ToastComponent background="white" text="링크가 복사되었습니다." />
      )}

      <div className="h-auto w-full left-0 top-[165px] absolute bg-neutral-900 rounded-tl-[30px] rounded-tr-[30px] ">
        {/* ... 설정창 */}
        {
          <OpenOption
            calculateOptionsModalPosition={calculateOptionsModalPosition}
          />
        }

        {/* ...설정창 펼치기 */}
        {isOptionsModalOpen && (
          <EditProfile
            top={optionsModalPosition.top}
            left={optionsModalPosition.left}
            openEditModal={openEditModal}
            closeOptionsModalOpen={closeOptionsModal}
          />
        )}

        {/* 프로필 수정 모달 펼치기 */}
        {isEditModalOpen && <AdminEditModal onClose={closeEditModal} />}

        {/* 프로필 이미지 */}
        <div className=" flex items-center flex-col z-10">
          <UserProfileImage userProfileImage={userData?.profileImageUrl} />
        </div>

        <UserProfileInfo
          username={userData?.username}
          introText={userData?.introduction}
        />

        {playlistData &&
          playlistData.map((playlist: getPlaylistDTO, index: number) => (
            <PlayList key={playlist.id} playlist={playlist} />
          ))}

        {!isLoading &&
        userId === tokenId &&
        playlistData?.length !== undefined &&
        playlistData.length < 4 ? (
          <AddPlayList />
        ) : (
          <></>
        )}
        <div className="mt-28 relative">
          <Footer bgColor="neutral-900" />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
