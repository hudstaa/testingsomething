import { IonToolbar, IonTextarea, IonButtons, IonButton, IonIcon, IonItem, IonCard } from "@ionic/react";
import { image, imageOutline, paperPlane } from "ionicons/icons";
import { useState } from "react";
import PfpUploader from "./UploadComponent";
import { getAuth } from "firebase/auth";
import { MessageFunction, useWriteMessage } from "../hooks/useWriteMessage";

export const WriteModalMessage: React.FC<{ placeHolder: string, address: string, sendMessage: MessageFunction }> = ({ address, placeHolder, sendMessage }) => {
    const { open, isOpen } = useWriteMessage();
    return <IonCard style={{ height: 50 }} color='paper' onClick={() => {
        open(sendMessage, address, placeHolder);
    }}>
        {!isOpen && <IonItem lines='none' color='paper' onClick={() => {
            open(sendMessage, address, placeHolder);
        }}>

            <IonButtons slot='start'>
            </IonButtons>
            <div className="regular" style={{ padding: 5, marginLeft: 10 }}>{placeHolder}</div>
            <IonButtons slot='end'>
                <IonButton onClick={() => {
                    open(sendMessage, address, placeHolder);
                }}>
                    <IonIcon color={'light'} icon={paperPlane} />
                </IonButton>
            </IonButtons>
        </IonItem>}

    </IonCard>
}