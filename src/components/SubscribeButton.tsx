import React, { useState, useEffect } from 'react';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { app } from '../App';
import { httpsCallable, getFunctions } from 'firebase/functions';
import { useNotifications } from '../hooks/useNotifications';
import { IonButton } from '@ionic/react';

export const SubscribeButton: React.FC<{ topic: string, uid: string }> = ({ topic, uid }) => {
    // Initial state is undefined
    const { token } = useNotifications();
    const [isSubscribed, setIsSubscribed] = useState<null | undefined | boolean>(undefined);

    useEffect(() => {
        // Fetch the subscription status from Firebase when the component mounts
        async function fetchSubscriptionStatus() {
            try {
                setIsSubscribed(null); // Set to null indicating we're fetching the status

                const docRef = doc(getFirestore(app), 'subscriptions', uid)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setIsSubscribed(docSnap.data()[topic] || false);
                } else {
                    setIsSubscribed(false);
                }
            } catch (error) {
                console.error("Error fetching subscription status:", error);
                setIsSubscribed(false);
            }
        }

        fetchSubscriptionStatus();
    }, [uid, topic]);

    const handleSubscribe = async () => {
        const subscribeToTopic = httpsCallable(getFunctions(app), 'subscribeToTopic');

        try {
            await subscribeToTopic({ token, topic });
            setIsSubscribed(true);
        } catch (error) {
            console.error("Error subscribing:", error);
        }
    };

    const handleUnsubscribe = async () => {
        const unsubscribeFromTopic = httpsCallable(getFunctions(app), 'unSubscribeFromTopic');
        try {
            await unsubscribeFromTopic({ token, topic });
            setIsSubscribed(false);
        } catch (error) {
            console.error("Error unsubscribing:", error);
        }
    };

    if (!token) {
        return <></>
    }
    // Render logic based on the isSubscribed state
    if (isSubscribed === undefined) {
        return <span>Loading...</span>;
    } else if (isSubscribed === null) {
        return <span>Checking subscription status...</span>;
    } else if (isSubscribed === true) {
        return <IonButton onClick={handleUnsubscribe}>Subscribed</IonButton>;
    } else {
        return <IonButton onClick={handleSubscribe}>Subscribe</IonButton>;
    }
}

export default SubscribeButton;