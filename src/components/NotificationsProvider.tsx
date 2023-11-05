import { getFirestore, query, collection, where, onSnapshot } from "firebase/firestore";
import { useRef, useEffect } from "react";
import { app } from "../App";
import { useMember } from "../hooks/useMember";
import { useNotifications } from "../hooks/useNotifications";
import { nativeAuth } from "../lib/sugar";
import { IonToast } from "@ionic/react";

export const NotificationsProvider: React.FC = () => {

    const { setNotifications, notifications } = useNotifications();
    const auth = nativeAuth();
    const me = useMember(x => x.getCurrentUser());

    useEffect(() => {
        if (!me) {
            return;
        }
        const db = getFirestore(app);

        console.log("GET NOTIS!!")
        const notificationsQuery = query(collection(db, 'notifications'), where('to', '==', me.address));
        onSnapshot(notificationsQuery, (snap) => {
            console.log("GOT NOTIS", snap.docs.map(x => x.data()));
            setNotifications(snap.docs.map(x => ({ ...x.data(), id: x.id } as any)));
        })

    }, [me]);


    return <>
        {notifications.map((notif) => {
            <IonToast>
                {notif}
            </IonToast>
        })}

    </>
}