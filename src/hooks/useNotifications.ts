import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { app } from '../App'
import { PushNotifications } from '@capacitor/push-notifications'



export type ActivityHook = {
    notifications: any[]
    setNotifications: ({ }) => void
    subscribe: (topic: string) => void
    token: string | null
    localCommentCount: Record<string, number>
    setToken: (token: string) => void
    commentAdded: (id: string) => void
}

export const useNotifications = create<ActivityHook>((set, store) => ({
    localCommentCount: {},
    commentAdded: (id) => {
        set({ localCommentCount: { ...store().localCommentCount, [id]: (store().localCommentCount[id] || 0) + 1 } })
    },
    setNotifications: (notifications) => {
        console.log(notifications)
        set({ notifications: notifications as any });
    },
    notifications: [],
    setToken: () => {

    },
    token: null,
    subscribe: (topic) => {
        const { token } = store();
        const subscibe = httpsCallable(getFunctions(app), 'syncPrivy');
        subscibe({ token, topic })
    }


}))
