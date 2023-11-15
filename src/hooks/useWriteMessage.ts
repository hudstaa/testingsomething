import { Ref } from 'react'
import { create } from 'zustand'
import { Message } from '../models/Message'

export type MessageFunction = (message: Message) => void;


export type WriteMessageHook = {
    isOpen: boolean;
    message?: Message;
    placeholder?: string
    send?: MessageFunction
    author: string
    postId?: string
    commentPath?: string
    presentingElement: Ref<HTMLIonContentElement>
    open: (callback: MessageFunction, author: string, placeHolder: string, postId?: string, commentPath?: string) => void
    setMedia: (media: { src: string, type: string }) => void
    removeMedia: () => void
    setContent: (content: string) => void
    setCommentPath: (commentPath: string) => void
    setPresentingElement: (ref: any) => void
    dismiss: (shouldSend: boolean) => void
    setIsOpen: (open: boolean) => void
}

export const useWriteMessage = create<WriteMessageHook>((set, store) => ({
    isOpen: false,
    setCommentPath: (commentPath) => {
        set({ commentPath })
    },
    setPresentingElement: (presentingElement) => {
        set({ presentingElement })
    },
    presentingElement: null,
    author: '',
    setIsOpen: (isOpen) => {
        set({ isOpen })
    },
    dismiss: (shouldSend) => {
        const message = store().message;
        const send = store().send;
        if (shouldSend && message && typeof send !== 'undefined') {
            send(message)
        }
        set({ isOpen: false, message: { author: "", id: "", sent: null } })
    },
    open: (send, author, placeholder, postId, commentPath) => {
        set({ postId, send, author, isOpen: true, placeholder, commentPath })
    },
    setMedia(media) {
        set({ message: { author: store().author, media: media, ...store().message, content: store().message?.content, sent: null, id: '' } });
    },
    removeMedia: () => {
        const message = store().message;
        delete message?.media
        set({ message });
    },
    setContent(content: string) {
        set({ message: { author: store().author, ...store().message, content, sent: null, id: '' } });
    },

}))
