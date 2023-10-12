import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { UserDetails } from '../lib/friendTech'



export type WatchlistHook = {
    activity: () => Trade[]
    watching: () => UserDetails[]
}

export const useWatchlist = create<WatchlistHook>((set, store) => ({
    activity: () => [
    ], watching: () => {
        return [];
    }
}))
