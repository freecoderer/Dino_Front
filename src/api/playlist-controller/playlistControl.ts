import { axiosInstance } from "@api/axiosInstance";

// 유저의 플레이리스트 전체 조회하기
export const getPlayList = async (username: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/playlist/user/${username}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저 플레이리스트 생성하기
export const postPlayList = async (
  playlistName?: string | null,
  titleImage?: string | null,
  cookies?: string
) => {
  try {
    let formData = new FormData();
    if (playlistName) {
      formData.append("playlistName", playlistName);
    }

    if (titleImage) {
      const binaryData = Uint8Array.from(atob(titleImage.split(",")[1]), (c) =>
        c.charCodeAt(0)
      );

      formData.append(
        "titleImage",
        new Blob([binaryData], { type: "image/png" }),
        "image.png"
      );
    }

    const response = await axiosInstance.post(`/api/v1/playlist`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${cookies}`,
      },
    });
    console.log(response);

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저의 플레이리스트  단일 조회하기
export const getSinglePlayList = async (
  playlistId: number,
  cookies?: string
) => {
  try {
    const response = cookies
      ? await axiosInstance.get(`/api/v1/playlist/${playlistId}`, {
          headers: {
            Authorization: `Bearer ${cookies}`,
          },
        })
      : await axiosInstance.get(`/api/v1/playlist/${playlistId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저 플레이리스트 삭제하기
export const deletePlayList = async (playlistId: string, cookies?: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/playlist/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저 플레이리스트 변경하기
export const putPlayList = async (
  playlistId: string,
  playlistName: string | null,
  titleImage?: any,
  cookies?: string
) => {
  try {
    let formData = new FormData();
    if (playlistName) {
      formData.append("playlistName", playlistName);
    }

    if (titleImage) {
      const binaryData = Uint8Array.from(atob(titleImage.split(",")[1]), (c) =>
        c.charCodeAt(0)
      );
      const type = titleImage.split(",")[0].split(":")[1].split(";")[0];
      formData.append(
        "titleImage",
        new Blob([binaryData], { type }),
        "image." + type.split("/")[1]
      );
    }
    const response = await axiosInstance.patch(
      `/api/v1/playlist/${playlistId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 유저 플레이리스트 이미지 삭제하기
export const deletePlayListImage = async (
  playlistId: string,
  cookies?: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/playlist/${playlistId}/image`,
      {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 좋아요 추가하기
export const postLike = async (playlistId: number, cookies?: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/playlist/${playlistId}/like`,
      null,
      {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteLike = async (playlistId: number, cookies?: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/playlist/${playlistId}/like`,
      {
        headers: {
          Authorization: `Bearer ${cookies}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getLikeList = async (playlistId: number) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/playlist/${playlistId}/like`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
