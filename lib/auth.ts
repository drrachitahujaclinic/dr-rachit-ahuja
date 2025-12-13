import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "doctor" | "patient";
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  redirectTo: string | null;

  setUser: (user: AuthUser | null) => void;
  setRedirect: (path: string | null) => void;

  fetchUser: () => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      redirectTo: null,

      setUser: (user) => set({ user }),
      setRedirect: (path) => set({ redirectTo: path }),

      /** Load logged-in user via cookie */
      fetchUser: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/auth/me") as any;
          set({ user: res.user, loading: false, error: null });
        } catch (err) {
          set({ user: null, loading: false });
        }
      },

      /** Google login */
      loginWithGoogle: async (accessToken: string) => {
        set({ loading: true });

        try {
          const res = (await api.post("/auth/google", { accessToken })) as any;
          set({ user: res.user, loading: false, error: null });

          // Redirect if user clicked “Book Consultation” before login
          const redirect = get().redirectTo;
          if (redirect) {
            set({ redirectTo: null }); // clear redirect after using it
            window.location.href = redirect;
          }
        } catch (err: any) {
          set({
            error: err?.response?.data?.error || "Login failed",
            loading: false,
          });
        }
      },

      /** Logout */
      logout: async () => {
        set({ loading: true });
        try {
          await api.post("/auth/logout");
          set({ user: null, loading: false, error: null });
        } catch {
          set({ loading: false });
        }
      },
    }),

    {
      name: "auth-store", // localStorage key
      partialize: (state) => ({
        user: state.user,
        redirectTo: state.redirectTo, // <-- persistence of redirect is optional but harmless
      }),
    }
  )
);
