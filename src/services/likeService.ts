import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

class LikeService {
    // Like a post
    async likePost(userId: string, postId: string): Promise<void> {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                likes: arrayUnion(userId),
                likesCount: increment(1),
            });
        } catch (error) {
            console.error('Error liking post:', error);
            throw new Error('Failed to like post');
        }
    }

    // Unlike a post
    async unlikePost(userId: string, postId: string): Promise<void> {
        try {
            await updateDoc(doc(db, 'posts', postId), {
                likes: arrayRemove(userId),
                likesCount: increment(-1),
            });
        } catch (error) {
            console.error('Error unliking post:', error);
            throw new Error('Failed to unlike post');
        }
    }

    // Check if user liked a post
    hasLiked(post: any, userId: string): boolean {
        return post?.likes?.includes(userId) || false;
    }
}

export const likeService = new LikeService();