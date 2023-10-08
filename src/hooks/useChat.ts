import { create } from 'zustand'
import { Message } from '../models/Message'
import { RoomInfo } from '../models/RoomInfo'



export type ChatHook = {
    messages: (room: string) => Message[]
    rooms: (address: string) => RoomInfo[]
    room: (address: string) => RoomInfo
}

export const useChat = create<ChatHook>((set, store) => ({
    messages: (room) => {
        return [{ address: '0xesper.eth', message: "henlo world" }, { address: 'slingoor.eth', message: "Left" }]
    },
    rooms: (address) => {
        return [{ lastMessage: "NICE", change24hour: -100n, owner: '0xesper.eth', updatedAt: Date.now() - 100000 }]
    },
    room: (address) => {
        return { lastMessage: "NICE", change24hour: -100n, owner: '0xesper.eth', updatedAt: Date.now() - 100000 }
    }
}))
