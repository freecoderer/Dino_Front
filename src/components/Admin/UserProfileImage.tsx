import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { UserProfileImageDTO } from "types/Admin";
import defaultImage from "@assets/Admin/defaultImage.svg";
import { Img } from "react-image";

const UserProfileImage = ({ userProfileImage }: UserProfileImageDTO) => {
  const { profileImage, deleteProfileImage } = useSelector(
    (state: RootState) => state.userProfile
  );
  
  const { profileImage : initialProfileImage } = useSelector(
    (state: RootState) => state.setProfile
  );
    return (
    <div className="w-[75px] h-[75px] rounded-full overflow-hidden mx-auto -mt-[30px]">
      {initialProfileImage ? (
        <Img src={initialProfileImage} alt="User Profile" className="w-full object-cover" />
      ) : 
      profileImage ? (
        <Img src={profileImage} alt="User Profile" className="w-full object-cover" />
      ) : deleteProfileImage ? (
        <Img
          src={defaultImage}
          alt="Default User Profile"
          className="w-full object-cover"
        />
      ) : userProfileImage ? (
        <Img
          src={userProfileImage}
          alt="Default User Profile"
          className="w-full object-cover"
        />
      ) : <Img
        src={defaultImage}
        alt="Default User Profile"
        className="w-full object-cover"
      />}
    </div>
  );
};

export default UserProfileImage;