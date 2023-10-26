import { create } from 'zustand'



export type TitleHook = {
    setTitle: (title: string) => void
    title: string
}

export const useTitle = create<TitleHook>((set, store) => ({
    setTitle: (title) => {
        set({ title })
    }, title: "Tribe"
}))
