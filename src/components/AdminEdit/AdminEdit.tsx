import React, { useCallback, useEffect, useState } from "react";

import useWindowSizeCustom from "@hooks/useWindowSizeCustom";
import "../../styles/Admin/style.css";
import EditButton from "@components/AdminEdit/Button/EditButton";
import SetUserProfileBackground from "@components/AdminEdit/SetUserProfileBackground";
import SetUserProfileImage from "@components/AdminEdit/SetUserProfileImage";
import SetUserProfileInfo from "@components/AdminEdit/SetUserProfileInfo";
import useImageCompress from "@hooks/useImageCompress";
import { dataURItoFile } from "@utils/ImageCrop/common";
import { getMemberDTO } from "types/Admin";
import { useCookies } from "react-cookie";
import {
  getMemberMe,
  updateMember,
} from "@api/member-controller/memberController";
import { UpdateMemberParams } from "types/AdminEdit";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileBackgroundImage, setProfileImage, setProfileIntroduction, setProfileUsername } from "@reducer/Admin/userProfileSlice";
import { RootState } from "@store/index";
import { setToast } from "@reducer/toast/toast";

interface AdminEditModalProps {
  onClose: () => void; // A function to close the modal
}

const AdminEdit: React.FC<AdminEditModalProps> = ({ onClose }) => {
  const [cookies] = useCookies();
  const token = cookies.accessToken;

  const [userData, setUserdata] = useState<getMemberDTO>();

  const dispatch = useDispatch();


  // 정보불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call the asynchronous function and await its result
        const userDataResult = await getMemberMe(cookies.accessToken);
        setUserdata(userDataResult.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle errors appropriately
      }
    };
    fetchData();
  }, [cookies.accessToken]);

  const [input, setInput] = useState({
    username: "",
    introduction: "",
  });

  const onChangeInput = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value,
    });

    setUpdateMemberData({
      ...updateMemberData,
      [name]: value,
    });

    if (name === 'username') {
      dispatch(setProfileUsername(value));
    } else if (name === 'introduction') {
      dispatch(setProfileIntroduction(value));
    }
  };

  // 배경화면
  const [
    uploadUserProfileBackgroundImage,
    setUploadUserProfileBackgroundImage,
  ] = useState<string | null>(null);
  const [
    compressedUserProfileBackgroundImage,
    setCompressedUserProfileBackgroundImage,
  ] = useState<string | undefined | null>(userData?.backgroundImageUrl);
  const {
    isLoading: isCompressUserProfileBackgroundLoading,
    compressImage: compressUserProfileBackgroundImage,
  } = useImageCompress();

  const handleUploadUserProfileBackgroundImage = (image: string) =>
    setUploadUserProfileBackgroundImage(image);

  const handleCompressUserProfileBackgroundImage = useCallback(async () => {
    if (!uploadUserProfileBackgroundImage) return;

    const imageFile = dataURItoFile(uploadUserProfileBackgroundImage);
    const compressedUserProfileBackgroundImage =
      await compressUserProfileBackgroundImage(imageFile);

    if (!compressedUserProfileBackgroundImage) return;
    const imageUrl = URL.createObjectURL(compressedUserProfileBackgroundImage);

    setCompressedUserProfileBackgroundImage(imageUrl);

    setUpdateMemberData((prevData) => ({
      ...prevData,
      backgroundImage: uploadUserProfileBackgroundImage,
    }));

    dispatch(setProfileBackgroundImage(uploadUserProfileBackgroundImage));

  }, [uploadUserProfileBackgroundImage, compressUserProfileBackgroundImage, dispatch]);

  useEffect(() => {
    if (uploadUserProfileBackgroundImage) {
      handleCompressUserProfileBackgroundImage();
    }
  }, [
    uploadUserProfileBackgroundImage,
    handleCompressUserProfileBackgroundImage,
  ]);

  // 프로필사진
  const [uploadUserProfileImage, setUploadUserProfileImage] = useState<
    string | null
  >(null);
  const [compressedUserProfileImage, setCompressedUserProfileImage] = useState<
    string | undefined | null
  >(userData?.profileImageUrl);
  const {
    isLoading: isCompressUserProfileLoading,
    compressImage: compressUserProfileImage,
  } = useImageCompress();

  const handleUploadUserProfileImage = (image: string) =>
    setUploadUserProfileImage(image);

  const handleCompressUserProfileImage = useCallback(async () => {
    if (!uploadUserProfileImage) return;

    const imageFile = dataURItoFile(uploadUserProfileImage);

    const compressedUserProfileImage = await compressUserProfileImage(
      imageFile
    );

    if (!compressedUserProfileImage) return;
    const imageUrl = URL.createObjectURL(compressedUserProfileImage);
    setCompressedUserProfileImage(imageUrl);

    setUpdateMemberData((prevData) => ({
      ...prevData,
      profileImage: uploadUserProfileImage,
    }));

    dispatch(setProfileImage(uploadUserProfileImage));

  }, [uploadUserProfileImage, compressUserProfileImage, dispatch]);

  useEffect(() => {
    if (uploadUserProfileImage) {
      handleCompressUserProfileImage();
    }
  }, [uploadUserProfileImage, handleCompressUserProfileImage, dispatch]);

  // 모달닫기
  const close = () => {
    onClose(); // Close the modal without saving changes
  };

  const { windowSize } = useWindowSizeCustom();
  // 사이즈 390 보다 크면 모달창 크기 고정
  const [size, setSize] = useState<boolean>(false);

  useEffect(() => {
    if (windowSize.width > 390) {
      setSize(true);
    } else {
      setSize(false);
    }
  }, [windowSize.width]);

  // 열고닫기
  const [isOpen, setIsOpen] = useState(true);

  const cancel = () => {
    setIsOpen(!isOpen);
    // 애니메이션 용 타이머
    setTimeout(() => {
      close();
    }, 900);
  };

  const { username, profileImage, profileBackgroundImage, introduction } = useSelector(
    (state: RootState) => state.userProfile
  )
  const [updateMemberData, setUpdateMemberData] = useState<UpdateMemberParams>({
    username: username,
    introduction: introduction,
    profileImage: profileImage,
    backgroundImage: profileBackgroundImage,
    cookies: token,
  });

  const navigate = useNavigate();

  const handleMember = async (data: UpdateMemberParams) => {

    console.log("Saving data:", data);

    await new Promise(resolve => setTimeout(resolve, 300));

    const code = await updateMember(data);
    if (code.status === 200) {
      dispatch(setToast('profile'));

      navigate(`/${code.data.username}/admin`);
    }
    cancel();
  };
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">

      {/* The following div creates a semi-transparent overlay background */}
      <div className="absolute inset-0 bg-gray-800 opacity-75 "></div>

      <div

        className={`relative ${size ? "w-[390px]" : "w-full"
          } h-full mt-5 bg-white rounded-t-3xl shadow-lg
        animate-slide-edit-${isOpen ? "in" : "out"}`}
      >

        {/* 상단 취소/저장 버튼 */}
        <div className="flex justify-between h-[50px]">
          <EditButton
            save={handleMember}
            cancel={cancel}
            updateMemberData={updateMemberData}
          />
        </div>

        {/* 배경화면 */}
        <SetUserProfileBackground
          aspectRatio={1 / 1}
          onCrop={handleUploadUserProfileBackgroundImage}
          compressedImage={compressedUserProfileBackgroundImage}
          isCompressLoading={isCompressUserProfileBackgroundLoading}
          earlyImage={userData?.backgroundImageUrl}
        />

        {/* 프로필 사진 */}
        <SetUserProfileImage
          aspectRatio={1 / 1}
          onCrop={handleUploadUserProfileImage}
          compressedImage={compressedUserProfileImage}
          isCompressLoading={isCompressUserProfileLoading}
          earlyImage={userData?.profileImageUrl}
        />

        {/* 유저 닉네임 */}
        <SetUserProfileInfo
          placeholder="User Name"
          maxlength={999}
          name="username"
          value={userData?.username}
          onChange={onChangeInput}
        />

        {/* 한줄소개 */}
        <SetUserProfileInfo
          placeholder="Introduction"
          maxlength={50}
          name="introduction"
          value={userData?.introduction}
          onChange={onChangeInput}
        />

      </div>
    </div>
  );
};

export default AdminEdit;
