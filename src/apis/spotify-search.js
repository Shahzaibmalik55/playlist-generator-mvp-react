import { axiosInstance } from "./index";

export const spotifySearch = async (params) => {
  try {
    const res = await axiosInstance.get("/spotify-search", { params });
    return Promise.resolve(res.data.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.response.data);
  }
};
