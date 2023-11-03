import { Timestamp } from "firebase/firestore"

export interface Message {
    content?: string
    author: string
    media?: { src: string, type: string }
    sent: Timestamp | null
    reply?: string
    score?: number
    id: string
}
