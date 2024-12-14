import { create } from "zustand";

const themeStore = create((set) => ({
  theme: "light",
  setTheme: (theme) => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },

  initializeTheme: () => {
    const storedTheme = localStorage.getItem("chat-theme") || "light";
    const root = window.document.documentElement;
    root.setAttribute("data-theme", storedTheme);

    set({ theme: storedTheme });
  },
}));

export default themeStore;
