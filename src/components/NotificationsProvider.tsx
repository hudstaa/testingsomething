import { getFirestore, query, collection, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useRef, useEffect } from "react";
import { app } from "../App";
import { useMember } from "../hooks/useMember";
import { useNotifications } from "../hooks/useNotifications";
import { nativeAuth } from "../lib/sugar";
import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonRouterLink, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { MemberBadge } from "./MemberBadge";
import { useHistory, useLocation } from "react-router";
import { useWriteMessage } from "../hooks/useWriteMessage";
import { timestampAgo } from "./TradeItem";

export const NotificationsProvider: React.FC = () => {

    const { setNotifications, notifications, localNotif, setLocalNotif, isOpen, hide } = useNotifications();
    const { presentingElement } = useWriteMessage()
    const me = useMember(x => x.getCurrentUser());
    const { push } = useHistory()
    useEffect(() => {
        if (!me) {
            return;
        }
        const db = getFirestore(app);

        const notificationsQuery = query(collection(db, 'notifications'), where('to', '==', me.address));
        onSnapshot(notificationsQuery, (snap) => {
            setNotifications(snap.docs.map(x => ({ ...x.data(), id: x.id } as any)));
        })

    }, [me]);
    return <>
        <IonToast onDidDismiss={() => { setLocalNotif(null) }} position="top" isOpen={localNotif !== null} duration={1000} message={localNotif || ""} />
        <IonModal presentingElement={presentingElement as any} isOpen={isOpen} onDidDismiss={() => {
            hide()
        }}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Notifications
                    </IonTitle>
                    <IonButtons slot='end'>
                        {notifications.length > 0 && <IonButton fill='clear' color='tribe' onClick={() => {
                            notifications.forEach(({ id }) => {
                                deleteDoc(doc(getFirestore(app), 'notifications', id)).then(() => {

                                })
                            })
                            hide();
                        }}>
                            Clear
                        </IonButton>}
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {notifications.map(({ from, ref, timestamp, to, id, message }) => {
                    return <IonItem onMouseDown={() => {
                        push("/" + ref.split('/')[0] + '/' + ref.split('/')[1])
                        deleteDoc(doc(getFirestore(app), 'notifications', id))
                        hide();

                    }} >
                        <MemberBadge address={from} /> {message} {timestampAgo(timestamp)}
                    </IonItem>
                })}
            </IonContent>
        </IonModal>
        {notifications.slice(0, 1).map(({ from, ref, timestamp, to, id, message }: any) =>
            <IonToast
                position='top'
                style={{ cursor: 'pointer' }}
                isOpen={notifications.length > 0}
                message={message}
                onClick={() => {
                    deleteDoc(doc(getFirestore(app), 'notifications', id))
                    push("/" + ref.split('/')[0] + '/' + ref.split('/')[1]);
                }}
                duration={5000}

                onDidDismiss={() => {

                }}>
            </IonToast >
        )}
    </>
}