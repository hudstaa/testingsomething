import { create } from 'zustand'
import { UserDetails } from '../lib/friendTech'
import { Trade } from '../models/Trade'



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
