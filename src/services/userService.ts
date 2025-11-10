import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, UpdateProfileData } from '../types';

class UserService {
    // Get user by ID
    async getUserById(userId: string): Promise<User | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) return null;

            const data = userDoc.data();
            return {
                id: userDoc.id,
                email: data.email,
                name: data.name,
                avatar: data.avatar,
                bio: data.bio,
                createdAt: new Date(data.createdAt),
                followers: data.followers || [],
                following: data.following || [],
                followersCount: data.followersCount || 0,
                followingCount: data.followingCount || 0,
                pushToken: data.pushToken,
            };
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    }

    // Update user profile
    async updateProfile(userId: string, updateData: UpdateProfileData): Promise<void> {
        try {
            const updates: any = {};
            
            if (updateData.name !== undefined) updates.name = updateData.name;
            if (updateData.bio !== undefined) updates.bio = updateData.bio;
            if (updateData.avatar !== undefined) updates.avatar = updateData.avatar;

            await updateDoc(doc(db, 'users', userId), updates);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw new Error('Failed to update profile');
        }
    }

    // Update push token
    async updatePushToken(userId: string, pushToken: string): Promise<void> {
        try {
            await updateDoc(doc(db, 'users', userId), {
                pushToken,
            });
        } catch (error) {
            console.error('Error updating push token:', error);
        }
    }
}

export const userService = new UserService();