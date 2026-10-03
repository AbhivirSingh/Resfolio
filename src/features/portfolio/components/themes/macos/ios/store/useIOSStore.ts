import { create } from "zustand";
import { IOSAppId, IOSDynamicIslandNotification } from "../types";

interface IOSStore {
    activeApp: IOSAppId | null;
    appData: unknown;
    dynamicIslandExpanded: boolean;
    notification: IOSDynamicIslandNotification | null;
    controlCenterOpen: boolean;
    lightboxIndex: number | null;
    openApp: (appId: IOSAppId, data?: unknown) => void;
    closeApp: () => void;
    setDynamicIslandExpanded: (expanded: boolean) => void;
    toggleDynamicIsland: () => void;
    notify: (title: string, subtitle?: string, icon?: string, duration?: number) => void;
    clearNotification: () => void;
    setControlCenterOpen: (open: boolean) => void;
    toggleControlCenter: () => void;
    setLightboxIndex: (index: number | null) => void;
}

let notificationTimer: ReturnType<typeof setTimeout> | null = null;

export const useIOSStore = create<IOSStore>((set) => ({
    activeApp: null,
    appData: null,
    dynamicIslandExpanded: false,
    notification: null,
    controlCenterOpen: false,
    lightboxIndex: null,

    openApp: (appId: IOSAppId, data: unknown = null) => {
        set({
            activeApp: appId,
            appData: data,
            dynamicIslandExpanded: false,
            controlCenterOpen: false,
        });
    },

    closeApp: () => {
        set({
            activeApp: null,
            appData: null,
            dynamicIslandExpanded: false,
        });
    },

    setDynamicIslandExpanded: (expanded: boolean) => {
        set({ dynamicIslandExpanded: expanded });
    },

    toggleDynamicIsland: () => {
        set((state) => ({ dynamicIslandExpanded: !state.dynamicIslandExpanded }));
    },

    notify: (title: string, subtitle?: string, icon?: string, duration = 3000) => {
        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }
        set({
            notification: { title, subtitle, icon, duration },
            dynamicIslandExpanded: false,
        });
        notificationTimer = setTimeout(() => {
            set({ notification: null });
            notificationTimer = null;
        }, duration);
    },

    clearNotification: () => {
        if (notificationTimer) {
            clearTimeout(notificationTimer);
            notificationTimer = null;
        }
        set({ notification: null });
    },

    setControlCenterOpen: (open: boolean) => {
        set({ controlCenterOpen: open });
    },

    toggleControlCenter: () => {
        set((state) => ({ controlCenterOpen: !state.controlCenterOpen }));
    },

    setLightboxIndex: (index: number | null) => {
        set({ lightboxIndex: index });
    },
}));

export default useIOSStore;
