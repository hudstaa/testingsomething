import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonFab, IonGrid, IonIcon, IonImg, IonItem, IonList, IonModal } from "@ionic/react"
import { WriteMessage } from "./WriteMessage"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { useMember } from "../hooks/useMember";
import { close } from "ionicons/icons";
import { useEffect, useRef } from "react";

export const WriteMessageModalProvider: React.FC = () => {
    const { dismiss, message, setContent, setIsOpen, isOpen, placeholder, setMedia } = useWriteMessage();
    const me = useMember(x => x.getCurrentUser());
    const modalRef = useRef<HTMLIonModalElement>(null);
    useEffect(() => {
        if (isOpen == false) {
            modalRef.current?.dismiss()
        } else {

        }
    }, [isOpen])
    return <>
        <IonModal ref={modalRef} isOpen={isOpen} color='paper' onDidDismiss={() => {
            setIsOpen(false);
        }}>
            <IonGrid fixed style={{ marginLeft: 0, marginRight: 0, padding: 0 }}>

                <IonItem color='light'>
                    <IonButtons slot='end'>
                        <IonButton fill="clear" color='danger' onClick={() => {
                            dismiss(false)
                            setMedia(undefined as any)
                        }}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonItem>
                <WriteMessage isModal placeHolder={placeholder || ""} address={me?.address || ""} sendMessage={(message) => {
                    setContent(message.content)
                    dismiss(true);
                }} />
                {/* {message && message.media !== null && <IonButton onClick={() => {
                    setMedia(undefined as any)
                }} fill='clear'><IonIcon icon={close} /></IonButton>} */}
                {message && message.media?.src && <IonImg style={{ height: '100px', width: '100px' }} src={message?.media?.src} />}
            </IonGrid>
        </IonModal>
    </>
}