import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { Member } from '../models/Member'
import { CachedMessage, Message, MessageV2 } from '@xmtp/react-sdk'



export type groupMessageHook = {
    pushMessages: (address: string, messages: MessageV2[]) => void
    getMessages: (address: string) => MessageV2[]
    groupMessages: Record<string, MessageV2[]>
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
    pushMessages: (address, messages) => {
        console.log('pushing', messages);
        const latestMessages: MessageV2[] = [...store().getMessages(address), ...messages];
        console.log('pushing', latestMessages);
        console.log(messages.map(x => x.sent));
        set({ groupMessages: { ...store().groupMessages, [address.toLowerCase()]: uniq(latestMessages).sort((a, b) => new Date(b.sent).getSeconds() - new Date(a.sent).getSeconds()) } })
        console.log(store().groupMessages, "STORE")
    }, getMessages: (address) => {
        return store().groupMessages[address.toLowerCase()] || []
    },
    groupMessages: {}
}))
