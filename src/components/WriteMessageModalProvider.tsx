import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonFab, IonGrid, IonIcon, IonImg, IonItem, IonList, IonModal, IonRouterOutlet, IonHeader, IonContent, IonFooter, IonToolbar } from "@ionic/react"
import { WriteMessage } from "./WriteMessage"
import { useWriteMessage } from "../hooks/useWriteMessage"
import { useMember } from "../hooks/useMember";
import { close, text } from "ionicons/icons";
import { useEffect, useRef } from "react";
import { CommentList } from "./CommentList";
import { nativeAuth } from "../lib/sugar";
import { MemberAlias } from "./MemberBadge";
import { WriteMessage2 } from "./WriteMessage2";

export const WriteMessageModalProvider: React.FC = () => {
    const { dismiss, message, setContent, setIsOpen, isOpen, placeholder, setMedia, postId, presentingElement, commentPath } = useWriteMessage();
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
        <IonModal presentingElement={presentingElement as any} style={{ height: '100vh!important' }} ref={modalRef} isOpen={isOpen} onDidDismiss={() => {
            setIsOpen(false);
        }}>
            <IonHeader>
                <IonToolbar color='transparent'>
                    <IonButtons slot='end'>
                        <IonButton style={{position: "absolute", right: 0}}fill="clear" color='dark' onClick={() => {
                            dismiss(false)
                            setMedia(undefined as any)
                        }}>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot={'start'}>
                        <div className="bold" style={{fontSize: '1.15rem'}}>{postId ? 'Comments' : "New Post"}</div>
                    </IonButtons>
                </IonToolbar>

            </IonHeader>
            <IonContent color="transparent">
                {uid && postId && <CommentList postId={postId} uid={uid} amount={undefined} total={0} />}
                {!postId && <WriteMessage2 isModal placeHolder={placeholder || ""} address={me?.address || ""} sendMessage={(message) => {
                    setContent(message.content)
                    dismiss(true);
                }} />}
            </IonContent>
            <IonFooter>
                {commentPath !== null && typeof commentPath !== 'undefined' && <IonItem>
                    {commentPath}
                </IonItem>}

                {message && message.media?.src && message.media.type.includes("image") ? <IonImg style={{ height: '100px', width: '100px' }} src={message?.media?.src} /> : message?.media?.src ? <video webkit-playsinline playsInline preload="none" style={{ height: '100px' }} src={message?.media?.src} /> : <></>}
                {postId && <WriteMessage2 isModal placeHolder={placeholder || ""} address={me?.address || ""} sendMessage={(message) => {
                    setContent(message.content)
                    dismiss(true);
                }} />}
            </IonFooter>
        </IonModal>
    </>
}