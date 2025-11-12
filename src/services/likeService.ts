import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post } from '../types';

class LikeService {
    // Like a post (only once)
    async likePost(userId: string, postId: string): Promise<void> {
        try {
            const postRef = doc(db, 'posts', postId);
            const postSnap = await getDoc(postRef);

            if (!postSnap.exists()) throw new Error('Post not found');

            const postData = postSnap.data();
            const alreadyLiked = postData?.likes?.includes(userId);

            if (!alreadyLiked) {
                await updateDoc(postRef, {
                    likes: arrayUnion(userId),
                    likesCount: (postData?.likesCount || 0) + 1,
                });
            }
        } catch (error) {
            console.error('Error liking post:', error);
            throw new Error('Failed to like post');
        }
    }

    // Unlike a post (only once)
    async unlikePost(userId: string, postId: string): Promise<void> {
        try {
            const postRef = doc(db, 'posts', postId);
            const postSnap = await getDoc(postRef);

            if (!postSnap.exists()) throw new Error('Post not found');

            const postData = postSnap.data();
            const hasLiked = postData?.likes?.includes(userId);

            if (hasLiked) {
                await updateDoc(postRef, {
                    likes: arrayRemove(userId),
                    likesCount: Math.max((postData?.likesCount || 1) - 1, 0),
                });
            }
        } catch (error) {
            console.error('Error unliking post:', error);
            throw new Error('Failed to unlike post');
        }
    }

    // Check if a user liked a post
    hasLiked(post: Post, userId: string): boolean {
        return post?.likes?.includes(userId) || false;
    }
}

export const likeService = new LikeService();
