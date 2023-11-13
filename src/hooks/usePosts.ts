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
    highlight: null | string,
    postCache: Record<string, Post | undefined>;
    setPostsData: (data: Post[]) => void;
    updatePost: (data: Post) => void
    highlightPost: (data: string) => void
}

export const usePost = create<PostStore>((set, store) => ({
    postCache: {},
    updatePost: (post) => {
        set({ postCache: { ...store().postCache, [post.id]: post } })
    },
    highlight: null,
    highlightPost: (highlight) => {
        set({ highlight })
    },
    setPostsData: (data: Post[]) => {
        const cache: Record<string, Post> = {};
        data.forEach(item => {
            cache[item.id] = item;
        });
        set({ postCache: { ...store().postCache, ...cache } })
    }
    ,
}));

