import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonFab, IonGrid, IonIcon, IonImg, IonItem, IonList, IonModal, IonRouterOutlet, IonHeader, IonContent, IonFooter } from "@ionic/react"
import { WriteMessage } from "./WriteMessage"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { useMember } from "../hooks/useMember";
import { close } from "ionicons/icons";
import { useEffect, useRef } from "react";
import { CommentList } from "./CommentList";
import { nativeAuth } from "../lib/sugar";

export const WriteMessageModalProvider: React.FC = () => {
    const { dismiss, message, setContent, setIsOpen, isOpen, placeholder, setMedia, postId } = useWriteMessage();
    const me = useMember(x => x.getCurrentUser());
    const uid = nativeAuth().currentUser?.uid
    const modalRef = useRef<HTMLIonModalElement>(null);
    useEffect(() => {
        if (isOpen == false) {
            modalRef.current?.dismiss()
        } else {

        }
    }, [isOpen])
    return <>
        <IonModal ref={modalRef} isOpen={isOpen} onDidDismiss={() => {
            setIsOpen(false);
        }}>
            <IonHeader>
                <IonItem lines="none" color='tribe'>
                    <IonButtons slot='end'>
                        <IonButton fill="clear" color='dark' onClick={() => {
                            dismiss(false)
                            setMedia(undefined as any)
                        }}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot={'start'}>
                        {postId ? 'Comments' : "New Post"}
                    </IonButtons>
                </IonItem>

            </IonHeader>
            <IonContent>
                {uid && postId && <CommentList postId={postId} uid={uid} amount={undefined} total={0} />}

                {/* {message && message.media !== null && <IonButton onClick={() => {
                    setMedia(undefined as any)
                }} fill='clear'><IonIcon icon={close} /></IonButton>} */}
            </IonContent>
            <IonFooter>
                {message && message.media?.src && <IonImg style={{ height: '100px', width: '100px' }} src={message?.media?.src} />}
                <WriteMessage isModal placeHolder={placeholder || ""} address={me?.address || ""} sendMessage={(message) => {
                    setContent(message.content)
                    dismiss(true);
                }} />

            </IonFooter>
        </IonModal>
    </>
}