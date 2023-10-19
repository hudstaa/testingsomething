// tabStore.ts
import { create } from 'zustand';

type TabState = {
    showTabs: boolean;
    setShowTabs: (state: boolean) => void;
};

const useTabvisibility = create<TabState>((set) => ({
    showTabs: true,
    setShowTabs: (state) => set({ showTabs: state }),
}));

export default useTabvisibility;