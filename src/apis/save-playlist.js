import { axiosInstance } from "./index";

export const savePlaylist = async (payload) => {
  try {
    const res = await axiosInstance.post("/playlist/save", { ...payload });
    return Promise.resolve(res.data.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.response.data);
  }
};
