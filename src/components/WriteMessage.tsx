import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { imageOutline, paperPlane, text } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import PfpUploader from "./UploadComponent";
import { getAuth } from "firebase/auth";
import { useWriteMessage } from "../hooks/useWriteMessage";

export const WriteMessage: React.FC<{ placeHolder: string, address: string, sendMessage: (message: { content: string, media?: { src: string, type: string } }) => void, isModal?: boolean }> = ({ address, isModal, placeHolder, sendMessage }) => {
    const [content, setNewNote] = useState<string | undefined>(undefined)
    const [image, setImage] = useState<string | undefined>(undefined)
    const [sent, setSent] = useState<boolean>(false);
    const { isOpen } = useWriteMessage();
    const makeComment = () => {
        const message = typeof image === 'undefined' ? { content: content || "" } : { content: content || "", media: { src: image, type: 'image' } }
        sendMessage(message);
        setNewNote(undefined);
        setSent(true);
        setImage(undefined);
    }
    const uid = getAuth().currentUser?.uid;
    useEffect(() => {
        setTimeout(() => {
            (document.querySelector("#modal-write-message textarea") as any)?.focus();
        }, 0)
        setTimeout(() => {
            (document.querySelector("#modal-write-message textarea") as any)?.focus();
        }, 10)
        setTimeout(() => {
            (document.querySelector("#modal-write-message textarea") as any)?.focus();
        }, 100)
    }, [isOpen])
    const textRef = useRef<HTMLIonTextareaElement>(null);

    return (
        <IonToolbar color='paper' style={{ padding: 10 }}>
          <div className="rounded-div"> {/* This div now uses flexbox layout */}
            <IonButtons slot='start'>
              {uid && <PfpUploader done={sent} userId={uid} onUpload={(path) => {
                setImage(path);
              }} />}
            </IonButtons>
            <IonTextarea
              autoFocus={isModal}
              id={isModal ? 'modal-write-message' : undefined}
              ref={textRef}
              autoGrow
              style={{ '--placeholder-font-family': 'rubik', flex: 1, paddingTop: 5, marginBottom: -14}} /* flex: 1 allows the textarea to grow and fill available space */
              value={content}
              placeholder={placeHolder}
              onKeyUp={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  makeComment();
                }
              }}
              onIonInput={(e) => {
                setNewNote(e.detail.value!)
              }}
            />
            <IonButtons slot='end'>
              <IonButton onClick={async () => {
                makeComment();
              }}>
                <IonIcon color={(typeof content !== 'undefined' && content.length > 0) && image !== null ? 'primary' : 'light'} icon={paperPlane} />
              </IonButton>
            </IonButtons>
          </div>
        </IonToolbar>
      );
}