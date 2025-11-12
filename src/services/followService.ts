import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

class FollowService {
    // Follow a user
    async followUser(currentUserId: string, targetUserId: string): Promise<void> {
        try {
            const currentUserRef = doc(db, 'users', currentUserId);
            const targetUserRef = doc(db, 'users', targetUserId);

            const currentUserSnap = await getDoc(currentUserRef);
            const targetUserSnap = await getDoc(targetUserRef);

            if (!currentUserSnap.exists() || !targetUserSnap.exists()) {
                throw new Error('User not found');
            }

            const currentUserData = currentUserSnap.data();
            const targetUserData = targetUserSnap.data();

            const alreadyFollowing = currentUserData?.following?.includes(targetUserId);

            if (!alreadyFollowing) {
                await updateDoc(currentUserRef, {
                    following: arrayUnion(targetUserId),
                    followingCount: (currentUserData?.following?.length || 0) + 1,
                });

                await updateDoc(targetUserRef, {
                    followers: arrayUnion(currentUserId),
                    followersCount: (targetUserData?.followers?.length || 0) + 1,
                });
            }
        } catch (error) {
            console.error('Error following user:', error);
            throw new Error('Failed to follow user');
        }
    }

    // Unfollow a user
    async unfollowUser(currentUserId: string, targetUserId: string): Promise<void> {
        try {
            const currentUserRef = doc(db, 'users', currentUserId);
            const targetUserRef = doc(db, 'users', targetUserId);

            const currentUserSnap = await getDoc(currentUserRef);
            const targetUserSnap = await getDoc(targetUserRef);

            if (!currentUserSnap.exists() || !targetUserSnap.exists()) {
                throw new Error('User not found');
            }

            const currentUserData = currentUserSnap.data();
            const targetUserData = targetUserSnap.data();

            const isFollowing = currentUserData?.following?.includes(targetUserId);

            if (isFollowing) {
                await updateDoc(currentUserRef, {
                    following: arrayRemove(targetUserId),
                    followingCount: Math.max(
                        (currentUserData?.following?.length || 1) - 1,
                        0
                    ),
                });

                await updateDoc(targetUserRef, {
                    followers: arrayRemove(currentUserId),
                    followersCount: Math.max(
                        (targetUserData?.followers?.length || 1) - 1,
                        0
                    ),
                });
            }
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
