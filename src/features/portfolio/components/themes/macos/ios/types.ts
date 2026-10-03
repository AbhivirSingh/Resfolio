import { AdaptedMacData } from "../constants/adapter";

export type IOSAppId =
    | "projects"
    | "skills"
    | "safari"
    | "photos"
    | "contact"
    | "resume"
    | "about"
    | "trash";

export interface IOSDynamicIslandNotification {
    title: string;
    subtitle?: string;
    icon?: string;
    duration?: number;
}

export interface IOSState {
    activeApp: IOSAppId | null;
    appData: unknown;
    dynamicIslandExpanded: boolean;
    notification: IOSDynamicIslandNotification | null;
    controlCenterOpen: boolean;
    lightboxIndex: number | null;
    batteryLevel: number;
    isCharging: boolean;
}

export interface IOSThemeProps {
    data: AdaptedMacData;
}
