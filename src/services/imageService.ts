import * as ImageManipulator from 'expo-image-manipulator';

class ImageService {
    // Compress image before upload
    async compressImage(uri: string): Promise<string> {
        try {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [
                { resize: { width: 1080 } }, // Resize to max width 1080px
                ],
                {
                compress: 0.7, // 70% quality
                format: ImageManipulator.SaveFormat.JPEG,
                }
            );
            
            return manipulatedImage.uri;
        } catch (error) {
            console.error('Error compressing image:', error);
            throw new Error('Failed to compress image');
        }
    }

    // Compress avatar image (smaller size)
    async compressAvatar(uri: string): Promise<string> {
        try {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [
                { resize: { width: 400 } }, // Smaller for avatars
                ],
                {
                compress: 0.8,
                format: ImageManipulator.SaveFormat.JPEG,
                }
            );
            
            return manipulatedImage.uri;
        } catch (error) {
            console.error('Error compressing avatar:', error);
            throw new Error('Failed to compress avatar');
        }
    }
}

export const imageService = new ImageService();