import { Capacitor } from "@capacitor/core"
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth"
import { formatEther } from "viem"
import { app } from "../App"

export const formatEth = (info: bigint | undefined) => {
    if (typeof info == 'undefined') {
        return ""
    }
    return parseFloat(formatEther(info)).toFixed(4) + "Ξ"
}

export const uniq = (array: Record<string, any>[]) => {

    return array.filter((person, index, self) =>
        !self.some((otherPerson, otherIndex) =>
            otherIndex < index &&
            person.address.toLowerCase() === otherPerson.address.toLowerCase()
        )
    );
}
export const uniqId = (array: Record<string, any>[]) => {

    return array.filter((person, index, self) =>
        !self.some((otherPerson, otherIndex) =>
            otherIndex < index &&
            person.id.toLowerCase() === otherPerson.id.toLowerCase()
        )
    );
}
export function nativeAuth() {
    let auth
    if (Capacitor.isNativePlatform()) {
        auth = initializeAuth(app, {
            persistence: indexedDBLocalPersistence
        })
    } else {
        auth = getAuth()
    }
    return auth
}
