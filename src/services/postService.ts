import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    where,
    deleteDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post, CreatePostData } from '../types';

class PostService {
    private postsCollection = collection(db, 'posts');

    async createPost(userId: string, postData: CreatePostData): Promise<Post> {
        try {
            const postDoc = {
                userId,
                content: postData.content,
                imageUrl: postData.imageUrl || null,
                timestamp: Timestamp.now(),
                likes: [],
                likesCount: 0,
                commentsCount: 0,
            };

            const docRef = await addDoc(this.postsCollection, postDoc);
            const createdPost = await this.getPostById(docRef.id);
            
            if (!createdPost) {
                throw new Error('Failed to fetch created post');
            }

            return createdPost;
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Failed to create post');
        }
    }

    async getAllPosts(): Promise<Post[]> {
        try {
            const q = query(this.postsCollection, orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);

            const posts: Post[] = [];
            for (const docSnapshot of querySnapshot.docs) {
                const post = await this.mapDocumentToPost(docSnapshot.id, docSnapshot.data());
                if (post) posts.push(post);
            }

            return posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw new Error('Failed to fetch posts');
        }
    }

    async getUserPosts(userId: string): Promise<Post[]> {
        try {
            const q = query(
                this.postsCollection,
                where('userId', '==', userId),
                // orderBy('timestamp', 'desc')
            );
            const querySnapshot = await getDocs(q);

            const posts: Post[]= [];
            for (const docSnapshot of querySnapshot.docs) {
                const post = await this.mapDocumentToPost(docSnapshot.id, docSnapshot.data());
                if (post) posts.push(post);
            }

            return posts;
        } catch (error) {
            console.error('Error fetching user posts:', error);
            throw new Error('Failed to fetch user posts');
        }
    }

    async getPostById(postId: string): Promise<Post | null> {
        try {
            const postDoc = await getDoc(doc(db, 'posts', postId));
            if (!postDoc.exists()) return null;

            return await this.mapDocumentToPost(postDoc.id, postDoc.data());
        } catch (error) {
            console.error('Error fetching post:', error);
            return null;
        }
    }

    async deletePost(postId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'posts', postId));
        } catch (error) {
            console.error('Error deleting post:', error);
            throw new Error('Failed to delete post');
        }
    }

    private async mapDocumentToPost(id: string, data: any): Promise<Post | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', data.userId));
            if (!userDoc.exists()) return null;

            const userData = userDoc.data();

            return {
                id,
                userId: data.userId,
                content: data.content,
                imageUrl: data.imageUrl || undefined,
                timestamp: data.timestamp.toDate(),
                likes: data.likes || [],
                likesCount: data.likesCount || 0,
                commentsCount: data.commentsCount || 0,
                author: {
                id: userDoc.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                createdAt: new Date(userData.createdAt),
                followers: userData.followers || [],
                following: userData.following || [],
                followersCount: userData.followersCount || 0,
                followingCount: userData.followingCount || 0,
                },
            };
        } catch (error) {
            console.error('Error mapping post:', error);
            return null;
        }
    }
}

export const postService = new PostService();