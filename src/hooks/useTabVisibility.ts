// tabStore.ts
import { create } from 'zustand';

type TribeTab = 'post' | 'channel' | 'account' | 'member';
type TabState = {
    tab: TribeTab;
    setTab: (state: TribeTab) => void;
};

const useTabs = create<TabState>((set) => ({
    tab: 'post',
    setTab: (tab) => {
        set({ tab });
    },
}));

export default useTabs;