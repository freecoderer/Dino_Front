import { useDispatch } from "react-redux";
import {
  updateArtist,
  updateTitle,
  updateURL,
  updateImage,
  resetIsSaved,
} from "@reducer/musicadd";
import { setIsEditing } from "@reducer/editPlayList/isEdit";
import {
  deletePlayList,
  putPlayList,
} from "@api/playlist-controller/playlistControl";
import { postMusicList } from "@api/music-controller/musicControl";
import { useNavigate } from "react-router-dom";
import { setToast } from "@reducer/Toast/toast";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import useImageCompress from "./useImageCompress";

interface UsePlayListEditorProps {
  playlists: any[];
  token: string;
  playlistName: string;
  musicData: any;
  playlistId: string | undefined;
  username: string | null;
}

export const UsePlayListEditor = ({
  playlists,
  token,
  playlistName,
  musicData,
  playlistId,
  username,
}: UsePlayListEditorProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFileState = useSelector(
    (state: RootState) => state.selectedFile
  );
  const selectedFile = selectedFileState.selectedFile;
  const { compressImage, isLoading } = useImageCompress();

  const handleEditClick = () => {
    dispatch(setIsEditing(true));
  };

  const handleSaveClick = async (compressedImage: string | null) => {
    const playlist = playlists.find(
      (playlist: any) => playlist?.id === Number(playlistId)
    );

    if (playlist) {
      const id = playlist.id;

      if (selectedFile) {
        const compressedFile = await compressImage(selectedFile);
        if (compressedFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const result = reader.result as string;
            if (!isLoading) {
              await putPlayList(id, null, result, token);
              dispatch(updateImage(result));
              dispatch({ type: "RESET_SELECTED_FILE" });
            }
          };
          reader.readAsDataURL(compressedFile);
        }
      }
      if (playlistName) {
        await putPlayList(id, playlistName, null, token);
      }
      if (musicData && musicData.title && musicData.artist && musicData.url) {
        await postMusicList(
          id,
          musicData.title,
          musicData.artist,
          musicData.url,
          token
        );
        dispatch(updateTitle(""));
        dispatch(updateArtist(""));
        dispatch(updateURL(""));
        dispatch(updateImage(null));
      }
    }
    dispatch(setToast("editPlayList"));
    dispatch(setIsEditing(false));
    dispatch(resetIsSaved());
    if (compressedImage) {
      dispatch(updateImage(compressedImage));
    }
  };

  const handleCancelClick = () => {
    dispatch(updateTitle(""));
    dispatch(updateArtist(""));
    dispatch(updateURL(""));
    dispatch(updateImage(null));
    dispatch(setIsEditing(false));
    dispatch(resetIsSaved());
  };

  //플리삭제
  const handleDeleteClick = async () => {
    await deletePlayList(playlistId ?? "", token);
    navigate(`/${username}`);
  };

  return {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
  };
};
