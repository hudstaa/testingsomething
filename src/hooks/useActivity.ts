import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { RoomInfo } from '../models/RoomInfo'



export type ActivityHook = {
    activity: () => Trade[]
}

export const useActivity = create<ActivityHook>((set, store) => ({
    activity: () => [
    ]
}))
