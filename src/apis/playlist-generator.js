import { axiosInstance } from "./index";

export const generatePlaylist = async (mood) => {
  try {
    const res = await axiosInstance.post("/playlist/generate", { mood });
    return Promise.resolve(res.data.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.response.data);
  }
};
