import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon, IonImg, IonAvatar, IonBadge, IonChip, IonText } from "@ionic/react";
import { close, imageOutline, paperPlane, text } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import PfpUploader from "./UploadComponent";
import { getAuth } from "firebase/auth";
import { useWriteMessage } from "../hooks/useWriteMessage";

export const WriteMessage: React.FC<{ placeHolder: string, address: string, sendMessage: (message: { content: string, media?: { src: string, type: string } }) => void, isModal?: boolean }> = ({ address, isModal, placeHolder, sendMessage }) => {
  const [content, setNewNote] = useState<string | undefined>(undefined)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [sent, setSent] = useState<boolean>(false);
  const { isOpen, removeMedia } = useWriteMessage();
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
    <IonToolbar style={{ padding: 5, border: 0 }} >
      <IonButtons slot='start'>
        {uid && <PfpUploader done={sent} userId={uid} onUpload={(path) => {
          setImage(path);
        }} />}

        {image &&
          <IonChip onClick={() => { setImage(undefined); removeMedia() }}>

            <IonAvatar>
              <IonImg src={image} />
            </IonAvatar>
            <IonText color='danger'>
              <IonIcon icon={close} />
            </IonText>
          </IonChip>}
      </IonButtons>
      <IonTextarea
        autoFocus={isModal}
        id={isModal ? 'modal-write-message' : undefined}
        ref={textRef}
        autoGrow
        style={{ '--placeholder-font-family': 'rubik', flex: 1, paddingTop: 0, marginBottom: -18 }} /* flex: 1 allows the textarea to grow and fill available space */
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
          <IonIcon color={(typeof content !== 'undefined' && content.length > 0) && image !== null ? 'primary' : 'light'} style={{ paddingBottom: 1, fontSize: '27px' }} icon={'/icons/sendLarge.svg'} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
}