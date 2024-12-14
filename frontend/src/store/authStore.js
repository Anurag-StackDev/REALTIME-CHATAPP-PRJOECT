import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axiosInstance from "../lib/axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const authStore = create((set, get) => ({
  socket: null,
  authUser: null,
  isLoading: false,
  onlineUsers: [],
  isCheckingAuth: true,

  getUserStatus: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/status");
      set({ authUser: data });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.error("Error in Authorization Status:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.post("/auth/signup", formData);
      set({ authUser: data });
      toast.success("Account created Successfully");

      get().connectSocket();
    } catch (error) {
      console.error("Error in Signup:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (formData) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      set({ authUser: data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true });
    try {
      const { data } = await axiosInstance.put(
        "/auth/update-profile",
        profileData
      );
      set({ authUser: data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    if (!authUser || socket?.connected) return;

    const newSocket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    newSocket.connect();

    set({ socket: newSocket });

    newSocket.on("onlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },
}));
