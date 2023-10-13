import { create } from 'zustand'
import { Message } from '../models/Message'
import { Timestamp } from 'firebase/firestore'

export type groupMessageHook = {
    pushMessages: (address: string, messages: Message[]) => void
    modMessage: (address: string, messages: Message) => void
    getMessages: (address: string) => Message[]
    subscribed:boolean,
    subcribing:()=>void
    groupMessages: Record<string, Message[]>
}

type ItemWithId = {
    id: number;
    [key: string]: any;
}
function uniq(items: any[]): any[] {
    const seenIds: Set<number> = new Set();
    const uniqueItems: ItemWithId[] = [];

    for (const item of items) {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueItems.push(item);
        }
    }

    return uniqueItems;
}
export const useGroupMessages = create<groupMessageHook>((set, store) => ({
    subscribed:false,
    subcribing:()=>{
        set({subscribed:true})
    },
    modMessage: (address, message) => {
       store().getMessages(address).findIndex(x=>x.id===message.id) 
       console.log("MODIFY",message);
    }, 
    pushMessages: (address, messages) => {
        console.log("pushing",address,messages.length)
        const latestMessages: Message[] = [...store().getMessages(address), ...messages.map(x=>({...x,sent:x.sent===null?new Timestamp(Date.now()/1000,0):x.sent}))];
        set({ groupMessages: { ...store().groupMessages, [address]: uniq(latestMessages).sort((a, b) => a.sent.seconds- b.sent.seconds) } })
    }, getMessages: (address) => {
        return store().groupMessages[address] || []
    },
    groupMessages: {}
}))
