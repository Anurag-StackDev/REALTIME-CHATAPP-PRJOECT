import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:4555/API" : "/API",
  withCredentials: true,
});

export default axiosInstance