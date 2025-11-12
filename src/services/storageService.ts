import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

class StorageService {
    // Upload image to Firebase Storage
    async uploadImage(uri: string, userId: string): Promise<string> {
        try {
            console.log('Starting image upload for URI:', uri);
            
            // Fetch the image as a blob
            const response = await fetch(uri);
            
            if (!response.ok) {
                throw new Error('Failed to fetch image from URI');
            }
            
            const blob = await response.blob();
            console.log('Blob created, size:', blob.size);

            // Create a unique filename
            const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
            const storagePath = `posts/${userId}/${filename}`;
            const storageRef = ref(storage, storagePath);

            console.log('Uploading to path:', storagePath);

            // Upload the blob with metadata
            const metadata = {
                contentType: 'image/jpeg',
            };
            
            const snapshot = await uploadBytes(storageRef, blob, metadata);
            console.log('Upload successful, snapshot:', snapshot);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Download URL obtained:', downloadURL);
            
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to upload image: ${error.message}`);
            }
            throw new Error('Failed to upload image');
        }
    }

    // Upload avatar to Firebase Storage
    async uploadAvatar(uri: string, userId: string): Promise<string> {
        try {
            console.log('Starting avatar upload for URI:', uri);
            
            const response = await fetch(uri);
            
            if (!response.ok) {
                throw new Error('Failed to fetch avatar from URI');
            }
            
            const blob = await response.blob();
            console.log('Avatar blob created, size:', blob.size);

            const filename = `avatar_${Date.now()}.jpg`;
            const storagePath = `avatars/${userId}/${filename}`;
            const storageRef = ref(storage, storagePath);

            console.log('Uploading avatar to path:', storagePath);

            const metadata = {
                contentType: 'image/jpeg',
            };
            
            await uploadBytes(storageRef, blob, metadata);

            const downloadURL = await getDownloadURL(storageRef);
            console.log('Avatar download URL obtained:', downloadURL);
            
            return downloadURL;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to upload avatar: ${error.message}`);
            }
            throw new Error('Failed to upload avatar');
        }
    }

    // Delete image from Firebase Storage
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Failed to delete image');
        }
    }
}

export const storageService = new StorageService();