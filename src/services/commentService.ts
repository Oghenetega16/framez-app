import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    Timestamp,
    doc,
    updateDoc,
    increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Comment, CreateCommentData } from '../types';

class CommentService {
    private commentsCollection = collection(db, 'comments');

    // Create a comment
    async createComment(userId: string, commentData: CreateCommentData): Promise<Comment> {
        try {
            const commentDoc = {
                postId: commentData.postId,
                userId,
                content: commentData.content,
                timestamp: Timestamp.now(),
            };

            const docRef = await addDoc(this.commentsCollection, commentDoc);

            // Increment post's comment count
            await updateDoc(doc(db, 'posts', commentData.postId), {
                commentsCount: increment(1),
            });

            // Fetch complete comment with author data
            const comment = await this.getCommentById(docRef.id);
            if (!comment) {
                throw new Error('Failed to fetch created comment');
            }

            return comment;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw new Error('Failed to create comment');
        }
    }

    // Get comments for a post
    async getPostComments(postId: string): Promise<Comment[]> {
        try {
            const q = query(
                this.commentsCollection,
                where('postId', '==', postId),
                orderBy('timestamp', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const comments: Comment[] = [];

            for (const docSnapshot of querySnapshot.docs) {
                const comment = await this.mapDocumentToComment(docSnapshot.id, docSnapshot.data());
                if (comment) comments.push(comment);
            }

            return comments;
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw new Error('Failed to fetch comments');
        }
    }

    // Get a single comment by ID
    private async getCommentById(commentId: string): Promise<Comment | null> {
        try {
            const commentDoc = await getDocs(
                query(this.commentsCollection, where('__name__', '==', commentId))
            );

            if (commentDoc.empty) return null;

            const doc = commentDoc.docs[0];
            return await this.mapDocumentToComment(doc.id, doc.data());
        } catch (error) {
            console.error('Error fetching comment:', error);
            return null;
        }
    }

    // Map Firestore document to Comment type
    private async mapDocumentToComment(id: string, data: any): Promise<Comment | null> {
        try {
            const userDoc = await getDocs(
                query(collection(db, 'users'), where('__name__', '==', data.userId))
            );

            if (userDoc.empty) return null;

            const userData = userDoc.docs[0].data();

            return {
                id,
                postId: data.postId,
                userId: data.userId,
                content: data.content,
                timestamp: data.timestamp.toDate(),
                author: {
                id: userDoc.docs[0].id,
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
            console.error('Error mapping comment:', error);
            return null;
        }
    }
}

export const commentService = new CommentService();