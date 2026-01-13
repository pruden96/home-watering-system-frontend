import { create } from "zustand";

interface RefreshState {
    refreshTrigger: number;
    notifyRefresh: () => void;
}

export const useRefreshStore = create<RefreshState>((set) => ({
    refreshTrigger: 0,
    // (0 -> 1 -> 2...)
    notifyRefresh: () =>
        set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
