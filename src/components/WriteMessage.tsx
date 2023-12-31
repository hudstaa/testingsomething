import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon, IonImg, IonAvatar, IonBadge, IonChip, IonText } from "@ionic/react";
import { close, imageOutline, paperPlane, text } from "ionicons/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import PfpUploader from "./UploadComponent";
import { getAuth } from "firebase/auth";
import { MemberCardHeader, MemberPfp, TwitterNameLink } from "./MemberBadge"
import { useMember } from "../hooks/useMember"
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
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const me = useMember(x => x.getCurrentUser());
  const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const bgColor = darkmode ? undefined : 'white';
  const [showMediaButton, setShowMediaButton] = useState(false);
  const author = me!.address;

  const handleFocus = () => {
    setIsTextAreaFocused(true);
    setShowMediaButton(true); // Show the media button when textarea is focused
  };
  const handleBlur = () => {
    setIsTextAreaFocused(false);
    // Optionally, add logic to determine when to hide the media button
  };
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
    if (focused) {
      textRef.current!.querySelector('textarea')!.focus();
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 0)
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 100)
      setTimeout(() => {
        textRef.current!.querySelector('textarea')!.focus();
      }, 200)

    }
  }, [focused])

  const textRef = useRef<HTMLIonTextareaElement>(null);

  const strippedLength = message?.content ? message.content.replaceAll(' ', '').replaceAll('\n', '').length : 0

  return (
    <IonToolbar color={bgColor} style={{ padding: 4, paddingBottom: 36, paddingLeft: 8, paddingRight: 8, border: 0 }} >
      <div style={{display: 'flex', width: '100%'}}>
      <div style={{backgroundColor: 'var(--ion-color-light)', marginLeft: 0, marginTop: 4,paddingRight: 0, borderRadius: '32px', maxHeight: 52, width: '100%',display: 'flex'}}> 
      {showMediaButton && (
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
      )}
      <IonTextarea
        autoFocus={isModal || focused}
        id={isModal ? 'modal-write-message' : undefined}
        ref={textRef}
        autoGrow
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="regular"
        style={{ flex: 1, paddingTop: 0, paddingLeft: 20, marginTop: -2, minHeight: 50 }} /* flex: 1 allows the textarea to grow and fill available space */
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
      <IonButtons slot='end'  style={{ maxHeight: 40, marginLeft: 8, marginTop: 6, marginRight: 8, backgroundColor: 'var(--ion-color-tribe)', borderRadius: 24, padding: 8, paddingBottom: 10}}>
        <IonButton 
            disabled={strippedLength < 1} 
            onClick={async () => {
                makeComment();
            }} 
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <IonText color={(typeof message?.content !== 'undefined' && message.content.length > 0) && message !== null ? 'light' : 'white'} className="bold">
                Send
            </IonText>
        </IonButton>
      </IonButtons>
      </div>

      </div>
    </IonToolbar>
  );
}