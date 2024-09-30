import { axiosInstance } from "./index";

export const getArtists = async () => {
  try {
    const res = await axiosInstance.get("/artists");
    return Promise.resolve(res.data.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.response.data);
  }
};
