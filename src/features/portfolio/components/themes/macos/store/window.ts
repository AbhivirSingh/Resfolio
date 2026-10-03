import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG, WindowState } from "../constants";

interface WindowStore {
    windows: Record<string, WindowState>;
    nextZIndex: number;
    openWindow: (windowKey: string, data?: any) => void;
    closeWindow: (windowKey: string) => void;
    focusWindow: (windowKey: string) => void;
    minimizeWindow: (windowKey: string) => void;
    restoreWindow: (windowKey: string) => void;
    finishRestore: (windowKey: string) => void;
    maximizeWindow: (windowKey: string) => void;
}

const useWindowStore = create<WindowStore>()(
    immer((set) => ({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_Z_INDEX + 1,

        openWindow: (windowKey: string, data: any = null) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isOpen = true;
                win.isMinimized = false;
                win.isRestoring = false;
                win.zIndex = state.nextZIndex;
                win.data = data ?? win.data;
                state.nextZIndex++;
            }),

        closeWindow: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isOpen = false;
                win.isMinimized = false;
                win.isMaximized = false;
                win.isRestoring = false;
                win.zIndex = INITIAL_Z_INDEX;
                win.data = null;
            }),

        focusWindow: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.zIndex = state.nextZIndex;
                state.nextZIndex++;
            }),

        minimizeWindow: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMinimized = true;
            }),

        restoreWindow: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMinimized = false;
                win.isRestoring = true;
                win.zIndex = state.nextZIndex;
                state.nextZIndex++;
            }),

        finishRestore: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isRestoring = false;
            }),

        maximizeWindow: (windowKey: string) =>
            set((state) => {
                const win = state.windows[windowKey];
                if (!win) return;
                win.isMaximized = !win.isMaximized;
            }),
    }))
);

export default useWindowStore;
