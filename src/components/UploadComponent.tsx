import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { imageOutline } from 'ionicons/icons';

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
            return;
        }
        console.log(file.name);

        setIsUploading(true);
        const storage = getStorage();
        const userPfpRef = ref(storage, `users/${userId}/${imageId()}.${ext}`);
        try {
            await uploadBytes(userPfpRef, file);
            console.log('Uploaded successfully!');
            const path = await getDownloadURL(userPfpRef);
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
    return (
        <div>
            <IonButton fill='clear' {...getRootProps()} >
                <input {...getInputProps()} />
                {previewUrl ? isUploading ? <IonSpinner name='crescent' /> : <img src={previewUrl} alt="Preview" style={{ width: '30px', height: '30px', borderRadius: 15 }} /> :
                    isUploading ? <IonSpinner name='crescent' /> : <IonIcon size="small" color='medium' icon={imageOutline} />
                }
            </IonButton>
        </div>
    );
}

export default PfpUploader;