import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../config/firebase';

class FollowService {
    // Follow a user
    async followUser(currentUserId: string, targetUserId: string): Promise<void> {
        try {
            // Add to current user's following
            await updateDoc(doc(db, 'users', currentUserId), {
                following: arrayUnion(targetUserId),
                followingCount: increment(1),
            });

            // Add to target user's followers
            await updateDoc(doc(db, 'users', targetUserId), {
                followers: arrayUnion(currentUserId),
                followersCount: increment(1),
            });
        } catch (error) {
            console.error('Error following user:', error);
            throw new Error('Failed to follow user');
        }
    }

    // Unfollow a user
    async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
        try {
            // Remove from current user's following
            await updateDoc(doc(db, 'users', currentUserId), {
                following: arrayRemove(targetUserId),
                followingCount: increment(-1),
            });

            // Remove from target user's followers
            await updateDoc(doc(db, 'users', targetUserId), {
                followers: arrayRemove(currentUserId),
                followersCount: increment(-1),
            });
        } catch (error) {
            console.error('Error unfollowing user:', error);
            throw new Error('Failed to unfollow user');
        }
    }

    // Check if current user follows target user
    isFollowing(currentUser: any, targetUserId: string): boolean {
        return currentUser?.following?.includes(targetUserId) || false;
    }
}

export const followService = new FollowService();