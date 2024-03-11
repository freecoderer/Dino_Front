import { playlistNameState } from "@atoms/Playlist/playlistName";
import useCompareToken from "@hooks/useCompareToken/useCompareToken";
import CustomModal from "@utils/Modal/Modal";
import { useCallback, useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import EditMusicIcon from "@assets/Header/EditMusic.svg";
import Home from "@assets/Home.svg";

type MainEditButtonProps = {
  playlists: any[];
  uploadImage: string | null;
  fetchPlaylist: () => void;
  setPlaylistName: (name: string) => void;
  memberId: string | null | undefined;
};

export const MainEditButton = ({
  playlists,
  uploadImage,
  fetchPlaylist,
  setPlaylistName,
  memberId,
}: MainEditButtonProps) => {
  const playlistName = useRecoilValue(playlistNameState);

  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { username: paramUsername } = useParams<{
    username: string | undefined;
  }>();
  const cameFromVisitor = location.state?.fromVisitor;

  const handleBack = () => {
    if (cameFromVisitor) {
      navigate(`/user/${paramUsername}`);
    } else {
      navigate(-1);
    }
  };

  const handleUserHome = () => {
    navigate(`/user/${paramUsername}`);
  };

  const handleModalToggle = useCallback(() => {
    setModalOpen((prev) => !prev);
  }, []);
  const modalProps = {
    isOpen: modalOpen,
    onRequestClose: handleModalToggle,
    compressedImage: null,
    playlists,
    uploadImage,
    fetchPlaylist,
    setPlaylistName,
    playlistName,
  };

  // 권한부여
  const authority = useCompareToken(memberId);

  return (
    <div className="flex min-h-[4%] items-center justify-between m-3 text-[19px]">
      <button type="button" onClick={handleBack} className="text-white">
        <FaAngleLeft size={24} />
      </button>
      <div className="flex justify-center w-full mr-3">
        <div
          onClick={handleUserHome}
          className="flex flex-row cursor-pointer ml-3"
        >
          <img className="mr-1" src={Home} alt="home" />
          <p className="text-center">{paramUsername}</p>
        </div>
      </div>
      {authority && (
        <button
          type="button"
          onClick={handleModalToggle}
          className="text-white"
        >
          <img src={EditMusicIcon} alt="edit" />
        </button>
      )}

      <CustomModal {...modalProps} />
    </div>
  );
};
