import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon, IonImg, IonAvatar, IonBadge, IonChip, IonText } from "@ionic/react";
import { close, imageOutline, paperPlane, text } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import PfpUploader from "./UploadComponent";
import { getAuth } from "firebase/auth";
import { useWriteMessage } from "../hooks/useWriteMessage";
export function removeUndefinedProperties(obj: any) {
  Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}
export const WriteMessage: React.FC<{ placeHolder: string, address: string, sendMessage: (message: { content: string, media?: { src: string, type: string } }) => void, isModal?: boolean, focused?: boolean }> = ({ address, isModal, placeHolder, sendMessage, focused }) => {
  const [sent, setSent] = useState<boolean>(false);
  const { isOpen, removeMedia, message, setContent, setMedia, clearMessage} = useWriteMessage();
  const makeComment = useCallback(() => {
    const content = textRef.current?.value!;
    sendMessage(removeUndefinedProperties({ ...message, content }));
    setMedia(undefined as any);
    setContent(undefined as any)
    setSent(true);
    clearMessage();
  }, [message])
  const uid = getAuth().currentUser?.uid;

  useEffect(() => {

    if (focused) {
      textRef.current!.querySelector('textarea')!.focus();
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 300)
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 300)
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 300)

    }
  }, [focused])
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
  useEffect(() => {

  })
  const textRef = useRef<HTMLIonTextareaElement>(null);

  const strippedLength = message?.content ? message.content.replaceAll(' ', '').replaceAll('\n', '').length : 0

  return (
    <IonToolbar style={{ padding: 5, border: 0 }} >
      <IonButtons slot='start'>
        {uid && <PfpUploader done={sent} userId={uid} onUpload={(path) => {
        }} />}

        {message?.media &&
          <IonChip onMouseDown={() => { removeMedia() }}>
            <IonAvatar>

              {message?.media?.type.includes('image') ? <IonImg src={message.media.src} /> :
                <video webkit-playsinline playsInline preload="metadata" controls style={{ borderRadius: 20, margin: 'auto', width: "100%", marginTop: 5, marginLeft: 4 }} src={message.media.src + '#t=0.5'} />}
            </IonAvatar>
            <IonText color='danger'>
              <IonIcon icon={close} />
            </IonText>
          </IonChip>}
      </IonButtons>
      <IonTextarea
        autoFocus={isModal || focused}
        id={isModal ? 'modal-write-message' : undefined}
        ref={textRef}
        autoGrow
        className="regular"
        style={{ flex: 1, paddingTop: 0, minHeight: 50 }} /* flex: 1 allows the textarea to grow and fill available space */
        value={message?.content}
        placeholder={placeHolder}
        onKeyUp={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && strippedLength > 0) {
            makeComment();
          }
        }}
        onIonInput={(e) => {
          setContent(e.detail.value!)
        }}
      />
      <IonButtons slot='end'>
        <IonButton disabled={strippedLength < 1} onClick={async () => {
          makeComment();
        }}>
          <IonIcon color={(typeof message?.content !== 'undefined' && message.content.length > 0) && message !== null ? 'primary' : 'light'} style={{ paddingBottom: 1, fontSize: '27px' }} icon={'/icons/sendLarge.svg'} />
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
}