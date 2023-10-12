import { create } from 'zustand'
import { getFirestore } from '@firebase/firestore';
import { app } from '../App';
import { doc, getDoc } from 'firebase/firestore';
import { getAddress } from 'viem';


interface UserData {
    twitterName: string;
    twitterUsername: string;
    twitterPfp: string;
    address: string;
}
interface FriendStore {
    friendCache: Record<string, UserData | undefined>;
    loading: Record<string, boolean>;
    error: Record<string, string | null>;
    setFriendData: (address: string, data: UserData) => void;
    setFriendsData: (data: UserData[]) => void;
    isLoading: (address: string|undefined) => boolean;
    setError: (address: string, error: string | null) => void;
    fetchFriendData: (address: string) => void;
    getFriend: (address: string|undefined) => UserData | null;
    getError: (address: string) => string | null | undefined;
    loadCache: () => void
}

export const useMember = create<FriendStore>((set, store) => ({
    friendCache: {},
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
    loadCache: () => {
        // fetch("https://bapgekqmbczrdgeafeck.supabase.co/functions/v1/privvyUsers").then((users) => {

        //     users.json().then((res: { data: [{ linked_accounts: [{ type: string, address: string, subject: string, name: string, username: string, connector_type: string }] }] }) => {
        //         const cache = res.data.map(user => {
        //             const wallet = user.linked_accounts.find(x => typeof x.address !== 'undefined' && x.connector_type === 'embedded');
        //             const twitter = user.linked_accounts.find(x => x.type == 'twitter_oauth');
        //             if (!twitter || !wallet) {
        //                 return false
        //             }
        //             return { [wallet.address]: { twitterUsername: twitter.username, twitterName: twitter.name, address: wallet.address } }
        //         })
        //     })
        // })
    },
    setFriendData: (address, data) =>
        set(state => ({
            friendCache: { ...state.friendCache, [address]: data },
            loading: { ...state.loading, [address]: false },
            error: { ...state.error, [address]: null },
        })),
    isLoading: (address) => store().loading[address||''],
    setError: (address, error) =>
        set(state => ({ error: { ...state.error, [address]: error } })),
    getFriend: (address) => {
        if(typeof address==='undefined'||typeof address == 'undefined' || address.length === 0 ){
            return null;
        }
        const addy=getAddress(address) as string;
        
        if(store().loading[addy]){
            return null;
        }
        if (store().error[addy]) {
            console.log("Error",store().error[addy])
            return null;
        }
        if (store().friendCache[addy]) {
            return store().friendCache[addy]!;
        }
        addy&&setTimeout(() => {
            store().fetchFriendData(addy);
        }, 0);
        return null;
    },
    getError: (address) => store().error[address],
    fetchFriendData: async (address) => {
        if (store().isLoading(address)) {
            return;
        }
        try {
            console.log("FETCHING",address);
            set(state => ({ loading: { ...state.loading, [address]: true } }));
            const db = getFirestore(app);
            await getDoc(doc(db, "member", address)).then((friend)=>{

                set({friendCache:{...store().friendCache,[address]:friend.data()} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:null}})
                console.log("GOT DOC");

            }).catch((e)=>{
                console.log("CUGHT");
                set({friendCache:{...store().friendCache,[address]:null} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:e.message}})
            });
        } catch (err: any) {
            console.log("CUGHT");
            set(state => ({ error: { ...state.error, [address]: err.message } }));
        } finally {
            console.log("FINALLY");
            set(state => ({ loading: { ...state.loading, [address]: false } }));
        }
    },
}));

