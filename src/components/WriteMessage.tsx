import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon } from "@ionic/react";
import { paperPlane } from "ionicons/icons";
import { useState } from "react";

export const WriteMessage: React.FC<{ placeHolder: string, address: string, sendMessage: (content: string) => void }> = ({ address, placeHolder, sendMessage }) => {
    const [newNote, setNewNote] = useState<string | undefined>(undefined)
    const makeComment = () => {
        newNote && sendMessage(newNote);
        setNewNote(undefined);
    }

    return <IonToolbar>
        <IonTextarea autoGrow style={{ padding: 5, marginLeft: 10 }} value={newNote} placeholder={placeHolder} onKeyUp={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                makeComment();
            }
        }} onIonInput={(e) => {
            setNewNote(e.detail.value!)
        }} />
        <IonButtons slot='end'>
            <IonButton onClick={async () => {
                makeComment();
            }}>
                <IonIcon color={typeof newNote !== 'undefined' && newNote.length > 0 ? 'primary' : 'light'} icon={paperPlane} />
            </IonButton>
        </IonButtons>
    </IonToolbar>
}