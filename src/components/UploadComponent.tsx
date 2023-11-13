import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';
import { useWriteMessage } from '../hooks/useWriteMessage';

interface PfpUploaderProps {
    userId: string;
    onUpload: (filePath: string) => void
    done: boolean
}
export function imageId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

const PfpUploader: React.FC<PfpUploaderProps> = ({ userId, onUpload, done }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { setMedia } = useWriteMessage();

    const handleUpload = async (file: File) => {
        onDrop([file]);
    };
    const handlePaste = useCallback((event: ClipboardEvent) => {
        const clipboardItems = event.clipboardData?.items;
        if (clipboardItems) {
            const imageItem = Array.from(clipboardItems).find(item => item.type.includes('image'));
            if (imageItem) {
                const file = imageItem.getAsFile();
                if (file) {
                    handleUpload(file);
                }
            }
        }
    }, [handleUpload]);
    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length !== 1) {
            console.error('Only one file should be uploaded at a time.');
            return;
        }

        const file = acceptedFiles[0];
        setPreviewUrl(URL.createObjectURL(file));

        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
        if (!allowedExtensions.includes('.' + ext)) {
            console.error('Invalid file extension.');
            setPreviewUrl(null);
            onUpload(null as any);
            return;
        }
        setIsUploading(true);
        onUpload(null as any);
        const storage = getStorage();
        const userPfpRef = ref(storage, `users/${userId}/${imageId()}.${ext}`);
        try {
            await uploadBytes(userPfpRef, file);
            console.log('Uploaded successfully!');
            const path = await getDownloadURL(userPfpRef);
            setMedia({ src: path, type: 'image' })
            onUpload(path);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setIsUploading(false);
        }
    }, [userId]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });
    useEffect(() => {
        if (done) {
            setPreviewUrl(null);
        }
    }, [done])
    const darkmode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const uploadImage = <IonIcon style={{
        filter: !darkmode ? 'invert(100%)' : undefined
    }} size="small" color='primary' icon={'/icons/uploadd.svg'} />
    return (
        <div>
            <IonButton fill='clear' {...getRootProps()} >
                <input {...getInputProps()} />
                {previewUrl ? isUploading ? <IonSpinner name='crescent' /> : uploadImage :
                    isUploading ? <IonSpinner name='crescent' /> : uploadImage
                }
            </IonButton>
        </div>
    );
}

export default PfpUploader;