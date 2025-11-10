import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

class AuthService {
    // Listen to auth state changes
    onAuthStateChange(callback: (user: User | null) => void) {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const user = await this.getUserData(firebaseUser.uid);
                callback(user);
            } else {
                callback(null);
            }
        });
    }

    // Sign up new user
    async signup(email: string, password: string, name: string): Promise<User> {
        try {
            // Create authentication account
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: name,
            });

            // Create user document in Firestore
            const userData: User = {
                id: userCredential.user.uid,
                email: userCredential.user.email!,
                name: name,
                avatar: undefined,
                createdAt: new Date(),
                followers: [],
                following: [],
                followersCount: 0,
                followingCount: 0,
                pushToken: undefined,
            };

            await setDoc(doc(db, 'users', userCredential.user.uid), {
                ...userData,
                createdAt: userData.createdAt.toISOString(),
            });

            return userData;
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Login existing user
    async login(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = await this.getUserData(userCredential.user.uid);
            if (!user) {
                throw new Error('User data not found');
            }

            return user;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Logout user
    async logout(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            throw new Error('Failed to logout');
        }
    }

    // Get current user
    async getCurrentUser(): Promise<User | null> {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return null;

        return await this.getUserData(firebaseUser.uid);
    }

    // Get user data from Firestore
    private async getUserData(userId: string): Promise<User | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (!userDoc.exists()) return null;

            const data = userDoc.data();
            return {
                id: userDoc.id,
                email: data.email,
                name: data.name,
                avatar: data.avatar,
                createdAt: new Date(data.createdAt),
                followers: data.followers || [],
                following: data.following || [],
                followersCount: data.followersCount || 0,
                followingCount: data.followingCount || 0,
                pushToken: data.pushToken || undefined,
            };
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    }

    // Convert Firebase error codes to user-friendly messages
    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already registered';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/operation-not-allowed':
                return 'Operation not allowed';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters';
            case 'auth/user-disabled':
                return 'This account has been disabled';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/invalid-credential':
                return 'Invalid email or password';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return 'An error occurred. Please try again';
        }
    }
}

export const authService = new AuthService();