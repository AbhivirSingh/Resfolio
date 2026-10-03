import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { LocationItem, locations } from "../constants";

interface LocationStore {
    activeLocation: LocationItem;
    setActiveLocation: (location: LocationItem) => void;
    resetLocation: (defaultLoc?: LocationItem) => void;
}

const DEFAULT_LOCATION = locations.work;

const useLocationStore = create<LocationStore>()(
    immer((set) => ({
        activeLocation: DEFAULT_LOCATION,

        setActiveLocation: (location: LocationItem) =>
            set((state) => {
                if (location === undefined) return;
                state.activeLocation = location;
            }),

        resetLocation: (defaultLoc?: LocationItem) =>
            set((state) => {
                state.activeLocation = defaultLoc || DEFAULT_LOCATION;
            }),
    }))
);

export default useLocationStore;
