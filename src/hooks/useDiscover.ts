import { create } from 'zustand'
import { MemberStats } from '../models/Stats'



export type DiscoverHook = {
    stats: () => MemberStats[]
}

export const useDiscover = create<DiscoverHook>((set, store) => ({
    stats: () => [
        { change24hour: 100000000000000n, address: '0xesper.eth', price: 51000000000000000n, updatedAt: Date.now() - 1000000 },
        { change24hour: -11000000000000n, address: 'slingoor.eth', price: 14000000000000000n, updatedAt: Date.now() - 1000000 },
        { change24hour: 90000000000000n, address: 'huddy.eth', price: 110000000000000000n, updatedAt: Date.now() - 1000000 },
    ]
}))
