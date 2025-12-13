import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,   // cookie auth = YES
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.statusText ||
      err?.message ||
      "Request failed";

    return Promise.reject(new Error(msg));
  }
);
