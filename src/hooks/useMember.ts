import { create } from 'zustand'
import { getFirestore } from '@firebase/firestore';
import { app } from '../App';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore';
import { getAddress } from 'viem';


export interface Member {
    twitterName: string;
    twitterUsername: string;
    twitterPfp: string;
    twitterBackground: string;
    bio: string;
    address: string;
    privyAddress: string;
    friendTechAddress?: string
}
interface FriendStore {
    friendCache: Record<string, Member | undefined>;
    loading: Record<string, boolean>;
    watching: Record<string, boolean>;
    error: Record<string, string | null>;
    me: Member | null
    setFriendData: (address: string, data: Member) => void;
    setFriendsData: (data: Member[]) => void;
    getCurrentUser: () => Member | null
    isLoading: (address: string | undefined) => boolean;
    isWatching: (address: string | undefined) => boolean;
    setError: (address: string, error: string | null) => void;
    fetchFriendData: (address: string, watch?: boolean) => void;
    getFriend: (address: string | undefined, watch?: boolean) => Member | null;
    getError: (address: string) => string | null | undefined;
    loadCache: () => void
    setCurrentUser: (member: Member) => void
}

export const useMember = create<FriendStore>((set, store) => ({
    friendCache: {},
    loading: {},
    watching: {},
    error: {},
    me: null,
    setCurrentUser: (me) => {
        set({ me, friendCache: { ...store().friendCache, [me.address]: me } })
    },
    getCurrentUser: () => {
        if (store().me != null) {
            return store().me;
        }
        return null;
    },
    setFriendsData: (data) => {
        const cache: Record<string, Member> = {};
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
        const db = getFirestore(app);
        const q = query(collection(db, "member"), limit(10));

        getDocs(q).then((memberDocs) => {
            store().setFriendsData(memberDocs.docs.map(x => x.data()) as any);
        })

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
    isLoading: (address) => store().loading[address || ''],
    isWatching: (address) => store().loading[address || ''],
    setError: (address, error) =>
        set(state => ({ error: { ...state.error, [address]: error } })),
    getFriend: (address, watch = false) => {
        if (typeof address === 'undefined' || typeof address == 'undefined' || address.length === 0) {
            return null;
        }
        const addy = getAddress(address) as string;

        if (store().loading[addy]) {
            return null;
        }
        if (store().error[addy]) {
            return null;
        }
        if (store().friendCache[addy]) {
            return store().friendCache[addy]!;
        }
        if (store().watching[addy] || store().error[addy]) {
            return null;
        }

        setTimeout(() => {
            store().fetchFriendData(addy, watch);
        }, 0)
        return null;
    },
    getError: (address) => store().error[address],
    fetchFriendData: async (address, watch = false) => {
        if (store().isLoading(address) || store().isWatching(address) || store().error[address] || store().friendCache[address]) {
            return;
        }
        try {
            set(state => ({ loading: { ...state.loading, [address]: true } }));
            const db = getFirestore(app);

            const memberQuery = query(collection(db, "member"), where("address", "==", address));

            if (watch) {
                onSnapshot(memberQuery, (snapshot) => {
                    if (!snapshot.empty) {
                        const friend = snapshot.docs[0]; // Assuming only one match, otherwise you'd loop through snapshot.docs
                        set({
                            friendCache: { ...store().friendCache, [address]: friend.data() as Member },
                            loading: { ...store().loading, [address]: false },
                            error: { ...store().error, [address]: null }
                        });
                    } else {
                        set({
                            loading: { ...store().loading, [address]: false },
                            error: { ...store().error, [address]: "doesn't exist" }
                        });
                    }
                }, (e) => {
                    set({
                        loading: { ...store().loading, [address]: false },
                        error: { ...store().error, [address]: e.message }
                    });
                });
            } else {
                await getDocs(memberQuery).then((snapshot) => {
                    if (snapshot.empty) {
                        set({
                            loading: { ...store().loading, [address]: false },
                            error: { ...store().error, [address]: "doesn't exist" }
                        });
                    } else {
                        const friend = snapshot.docs[0]; // Assuming only one match, otherwise you'd loop through snapshot.docs
                        set({
                            friendCache: { ...store().friendCache, [address]: friend.data() as Member },
                            loading: { ...store().loading, [address]: false },
                            error: { ...store().error, [address]: null }
                        });
                    }
                });
            }
            // if(watch){
            //     set({watching:{...store().watching,[address]:true}})
            //     console.log("WATCHINGSDASDASD",address)
            //     onSnapshot(doc(db, "member", address),(friend)=>{
            //         set({friendCache:{...store().friendCache,[address]:friend.data()} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:null}})
            //     },(e)=>{
            //         set({friendCache:{...store().friendCache,[address]:null} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:e.message}})
            //     });
            // }else{
            //     await getDoc(doc(db, "member", address)).then((friend)=>{
            //         console.log("got doc",friend.data());;
            //         if(typeof friend.data()==='undefined'){
            //             set({friendCache:{...store().friendCache,[address]:friend.data()} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:"doesn't exist"}})
            //         }else{
            //             set({friendCache:{...store().friendCache,[address]:friend.data()} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:null}})
            //         }
            //     }).catch((e)=>{
            //         console.log("err")
            //         set({friendCache:{...store().friendCache,[address]:null} as any,loading:{...store().loading,[address]:false},error:{...store().error,[address]:e.message}})
            //     });

            // }
        } catch (err: any) {
            set(state => ({ error: { ...state.error, [address]: err.message } }));
        } finally {
            // !watch &&store().isLoading(address)&& set(state => ({ loading: { ...state.loading, [address]: false } }));
        }
    },
}));

