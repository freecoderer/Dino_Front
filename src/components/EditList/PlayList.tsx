import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UsePlayListEditor } from "@hooks/UsePlayListEditor";
import { RootState } from "@store/index";
import { EditPlsyListDTO } from "types/EditplayList";
import { EditPlaylistControls } from "@components/EditList/Button/EditPlaylistControl";
import { MusicDataRow } from "@components/EditList/MusicList/MusicDataRow";
import useImageCompress from "@hooks/useImageCompress";
import { PlusButton } from "@components/EditList/Button/PlusButton";
import ShowImage from "@components/EditList/EditImage/ShowImage";
import { MainEditButton } from "@components/EditList/Button/MainEditButton";
import { MusicTitle } from "@components/EditList/MusicList/MusicTitle";
import { useCookies } from "react-cookie";
import useDecodedJWT from "@hooks/useDecodedJWT";
import { getMember } from "@api/member-controller/memberController";
import { getPlayList } from "@api/playlist-controller/playlistControl";
import { getMusicList } from "@api/music-controller/musicControl";
import { useParams } from "react-router-dom";

const PlayList: React.FC<EditPlsyListDTO> = () => {
  const isEditing = useSelector(
    (state: RootState) => state.editPlaylistToggle.isEditing
  );
  const musicData = useSelector((state: RootState) => state.musicAdd);
  const [uploadImage, setUploadImage] = useState<string | null>(null);

  const { isLoading: isCompressLoading } = useImageCompress();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [musicList, setMusicList] = useState<any>([]);
  const { playlistId } = useParams<{ playlistId: string }>();
  // const [page, setPage] = useState<number>(0);

  const handleUploadImage = (image: string) => setUploadImage(image);

  // 쿠키에서 유저 id 가져오기
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  const decodedToken = useDecodedJWT(token);
  const id = decodedToken.sub;

  const {
    handleEditClick,
    handleSaveClick,
    handleCancelClick,
    handleDeleteClick,
  } = UsePlayListEditor(
    playlists,
    uploadImage,
    token,
    playlistName,
    musicData,
    playlistId,
    username
  );

  useEffect(() => {
    console.log(uploadImage);
    const fetchPlaylist = async (id: number) => {
      const member = await getMember(id);
      const playlist = await getPlayList(member.data.username);

      const musicAPIData = await getMusicList(Number(playlistId), 0);
      setUsername(member.data.username);
      setPlaylists(playlist.data);
      setMusicList(musicAPIData);
    };
    if (id !== undefined) {
      fetchPlaylist(id);
    }
  }, [musicList, id, uploadImage, playlistId]);
  // 일단 의존성때문에 넣을건데 musicList빼고 나중에 다 지워도 될ㄷ스.
  // /[musicList, id, uploadImage, handleCompressImage, playlistId]

  return (
    <div className="h-full w-full scrollbar flex flex-col bg-black text-white font-medium leading-[18px]">
      {!isEditing && (
        <MainEditButton
          playlists={playlists}
          uploadImage={uploadImage}
          token={token}
          playlistName={playlistName}
          musicData={musicData}
          playlistId={playlistId}
          username={username}
        />
      )}

      {isEditing && (
        <EditPlaylistControls
          isEditing={isEditing}
          onSave={() => handleSaveClick(uploadImage)}
          onCancel={handleCancelClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <ShowImage
        aspectRatio={1}
        onCrop={handleUploadImage}
        playlists={playlists}
        isCompressLoading={isCompressLoading}
        isEditing={isEditing}
        playlistId={playlistId}
      />

      <MusicTitle
        playlists={playlists}
        titlechange={(newTitle) => {
          setPlaylistName(newTitle);
        }}
        isEditing={isEditing}
        playlistId={playlistId}
      />

      <MusicDataRow
        isEditing={isEditing}
        musicList={musicList}
        playlistId={playlistId}
        username={username}
        token={token}
      />

      {isEditing && <PlusButton playlists={playlists} username={username} />}
    </div>
  );
};

export default PlayList;