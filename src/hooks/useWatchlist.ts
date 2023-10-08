import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { Member } from '../models/Member'



export type WatchlistHook = {
    activity: () => Trade[]
    watching: () => Member[]
}

export const useWatchlist = create<WatchlistHook>((set, store) => ({
    activity: () => [
    ], watching: () => {
        return [];
    }
}))
