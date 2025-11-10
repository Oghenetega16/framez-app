import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

class StorageService {
    // Upload image to Firebase Storage
    async uploadImage(uri: string, userId: string): Promise<string> {
        try {
            // Fetch the image as a blob
            const response = await fetch(uri);
            const blob = await response.blob();

            // Create a unique filename
            const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const storageRef = ref(storage, `posts/${userId}/${filename}`);

            // Upload the blob
            await uploadBytes(storageRef, blob);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
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