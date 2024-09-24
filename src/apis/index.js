import axios from "axios";

function addAuthTokenRequestInterceptor(config) {
  const user = localStorage.getItem("user");
  if (config && user) {
    const accessToken = JSON.parse(user);
    config.headers.set("Authorization", accessToken);
  }
  return config;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(addAuthTokenRequestInterceptor);
