import { create } from 'zustand'
import { getFirestore } from '@firebase/firestore';
import { app } from '../App';
import { Timestamp, collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from 'firebase/firestore';
import { getAddress } from 'viem';


export interface Post {
    content?: string;
    author: string;
    id: string;
    sent: Timestamp | null;
    media: { src: string, type: string };
}
interface PostStore {
    postCache: Record<string, Post | undefined>;
    setPostsData: (data: Post[]) => void;
}

export const usePost = create<PostStore>((set, store) => ({
    postCache: {},
    setPostsData: (data: Post[]) => {
        const cache: Record<string, Post> = {};
        data.forEach(item => {
            cache[item.id] = item;
        });
        set({ postCache: { ...store().postCache, ...cache } })
    }
    ,
}));

