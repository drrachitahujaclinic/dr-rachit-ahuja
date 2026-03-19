// api.ts
import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/lib/auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// prevent multiple executions
let isHandling401 = false;

api.interceptors.response.use(
  (res) => res.data,
  async (error: AxiosError<any>) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      if (!isHandling401) {
        isHandling401 = true;

        const { logout } = useAuthStore.getState();

        // silently clear frontend auth state
        logout();

        // reset flag shortly after
        setTimeout(() => {
          isHandling401 = false;
        }, 500);
      }
    }

    const message =
      error?.response?.data?.error ||
      error?.response?.statusText ||
      error?.message ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  }
);