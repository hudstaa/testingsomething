import { IonItem } from "@ionic/react"
import { getApp } from "firebase/app";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useState, useEffect } from "react";


export const CommentTree: React.FC<{ postId: string, commentPath: string }> = ({ postId, commentPath }) => {
    const [comment, setComment] = useState<any>(null);

    useEffect(() => {
        // Fetch a single comment from Firebase
        const fetchComment = async () => {
            const commentRef = doc(getFirestore(getApp()), 'post', postId, 'comments', commentPath);
            const commentSnap = await getDoc(commentRef);

            if (commentSnap.exists()) {
                setComment({ ...commentSnap.data() });
            } else {
                console.log("No such comment!");
            }
        };

        fetchComment();
    }, [commentPath]);

    return (
        <IonItem>
            {comment ? comment.content : ""} {/* Replace 'text' with the actual field name of your comment */}
        </IonItem>
    );
};