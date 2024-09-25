import { axiosInstance } from "./index";

export const loginUser = async (params) => {
  try {
    const res = await axiosInstance.get("/auth/login", { params });
    return Promise.resolve(res.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err.response.data);
  }
};
