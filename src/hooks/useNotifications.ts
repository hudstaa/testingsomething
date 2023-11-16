import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { app } from '../App'
import { PushNotifications } from '@capacitor/push-notifications'



export type ActivityHook = {
    notifications: any[]
    show: () => void
    isOpen: boolean
    setNotifications: ({ }) => void
    subscribe: (topic: string) => void
    token: string | null
    localNotif: string | null
    localCommentCount: Record<string, number>
    setToken: (token: string) => void
    commentAdded: (id: string) => void
    hide: () => void
    setLocalNotif: (localNotif: string | null) => void
}

export const useNotifications = create<ActivityHook>((set, store) => ({
    hide: () => {
        set({ isOpen: false })
    },
    localCommentCount: {},
    isOpen: false,
    localNotif: null,
    show: () => { set({ isOpen: true }) },
    setLocalNotif: (localNotif: string | null) => {
        set({ localNotif })
    },

    commentAdded: (id) => {
        set({ localCommentCount: { ...store().localCommentCount, [id]: (store().localCommentCount[id] || 0) + 1 } })
    },
    setNotifications: (notifications) => {
        set({ notifications: notifications as any });
    },
    notifications: [],
    setToken: () => {

    },
    token: null,
    subscribe: (topic) => {
        const { token } = store();
        const subscibe = httpsCallable(getFunctions(app), 'subscribeToTopic');
        subscibe({ token, topic })
    }


}))
