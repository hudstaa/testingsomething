import { create } from 'zustand'
import { Trade } from '../models/Trade'
import { httpsCallable, getFunctions } from 'firebase/functions'
import { app } from '../App'
import { PushNotifications } from '@capacitor/push-notifications'



export type ActivityHook = {
    notifications: []
    setNotifications: ({ }) => void
    subscribe: (topic: string) => void
    token: string | null
    setToken: (token: string) => void
}

export const useNotifications = create<ActivityHook>((set, store) => ({
    setNotifications: (notifications) => {
        set(notifications);
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
