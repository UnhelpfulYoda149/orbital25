import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = process.env.REACT_APP_API_URL || "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // for session cookie auth
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;