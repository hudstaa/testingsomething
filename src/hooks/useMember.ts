import { create } from 'zustand'
import { Trade } from '../models/Trade'


interface UserData {
    twitterName: string;
    twitterUsername: string;
    twitterPfpUrl: string;
    address: string;
}
interface FriendStore {
    friendCache: Record<string, UserData | undefined>;
    loading: Record<string, boolean>;
    error: Record<string, string | null>;
    setFriendData: (address: string, data: UserData) => void;
    setFriendsData: (data: UserData[]) => void;
    isLoading: (address: string) => boolean;
    setError: (address: string, error: string | null) => void;
    fetchFriendData: (address: string) => void;
    getFriend: (address: string) => UserData | undefined;
    getError: (address: string) => string | null | undefined;
}

export const useMember = create<FriendStore>((set, store) => ({
    friendCache: { ["0x41f39db558bbae155a9139a2cceb365c42cc36a7".toLowerCase()]: { twitterName: "Fleury", twitterPfpUrl: "https://pbs.twimg.com/profile_images/1695088911373025280/XrO9yp69_400x400.jpg", twitterUsername: "FleuryNFT", address: "0x41f39db558bbae155a9139a2cceb365c42cc36a7", }, ["0x0B6C251A0afC9cb77724e16D27d2CD5fbaC9315b".toLowerCase()]: { address: "0x0B6C251A0afC9cb77724e16D27d2CD5fbaC9315b", twitterName: "Huddy", twitterUsername: "Huddy0x", twitterPfpUrl: "https://pbs.twimg.com/profile_images/1699576774844104704/5E5szFu3_400x400.jpg" }, ["0xDF37c6F10c94Ca4AA64c1FbFddf5F4aC796407fb".toLowerCase()]: { address: "0xDF37c6F10c94Ca4AA64c1FbFddf5F4aC796407fb", twitterName: "lil esper", twitterPfpUrl: "https://pbs.twimg.com/profile_images/1664795408650862592/-PdiNtfE_400x400.jpg", twitterUsername: "lil_esper" } },
    loading: {},
    error: {},
    setFriendsData: (data) => {
        const cache: Record<string, UserData> = {};
        const errorCache: Record<string, string | null> = {};
        const loadingCache: Record<string, boolean> = {};
        data.forEach(item => {
            cache[item.address] = item;
            errorCache[item.address] = null;
            loadingCache[item.address] = false;
        });
        set({ friendCache: { ...store().friendCache, ...cache }, loading: { ...store().loading, ...loadingCache }, error: { ...store().error, ...errorCache } })
    },

    setFriendData: (address, data) =>
        set(state => ({
            friendCache: { ...state.friendCache, [address]: data },
            loading: { ...state.loading, [address]: false },
            error: { ...state.error, [address]: null },
        })),
    isLoading: (address) => store().loading[address],
    setError: (address, error) =>
        set(state => ({ error: { ...state.error, [address]: error } })),
    getFriend: (address) => {
        address = address.toLowerCase();
        if (typeof address == 'undefined' || address.length === 0) {
            return { address, twitterName: "", twitterPfpUrl: "", twitterUsername: "" }
        }
        if (store().friendCache[address]) {
            return store().friendCache[address];
        }
        if (store().loading[address] || store().error[address]) {
            return;
        }
        setTimeout(() => {
            store().fetchFriendData(address);
        }, 0);
    },
    getError: (address) => store().error[address],
    fetchFriendData: async (address) => {
        // if (store().isLoading(address)) {
        //     return;
        // }
        // try {
        //     set(state => ({ loading: { ...state.loading, [address]: true } }));
        //     const response: any = await getUserDetails(address);
        //     if (response.message) {
        //         set(state => ({ error: { ...state.error, [address]: response.message } }));
        //     } else {
        //         set(state => ({
        //             friendCache: { ...state.friendCache, [address]: response },
        //             error: { ...state.error, [address]: null },
        //         }));
        //         // const db = getFirestore(app)
        //         // setDoc(doc(db, 'friends', address.toLowerCase()), response)
        //         // setDoc(doc(db, 'twitter', response.twitterUsername.toLowerCase()), response)
        //     }
        // } catch (err: any) {
        //     set(state => ({ error: { ...state.error, [address]: err.message } }));
        // } finally {
        //     set(state => ({ loading: { ...state.loading, [address]: false } }));
        // }
    },
}));

