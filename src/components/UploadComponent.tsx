import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

interface PfpUploaderProps {
    userId: string;
}

const PfpUploader: React.FC<PfpUploaderProps> = ({ userId }) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length !== 1) {
            console.error('Only one file should be uploaded at a time.');
            return;
        }

        const file = acceptedFiles[0];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
        if (!allowedExtensions.includes('.' + ext)) {
            console.error('Invalid file extension.');
            return;
        }

        const storage = getStorage();
        const userPfpRef = ref(storage, `users/${userId}/${userId}.${ext}`);
        try {
            await uploadBytes(userPfpRef, file);
            console.log('Uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }, [userId]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'image/jpeg, image/png, image/gif' as any
    });

    return (
        <div {...getRootProps()} style={{ border: '1px dashed black', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Drag & drop your profile picture here, or click to select one</p>
        </div>
    );
}

export default PfpUploader;