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
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Comment, CreateCommentData } from '../types';

class CommentService {
  private commentsCollection = collection(db, 'comments');

  // Create a comment
  async createComment(userId: string, commentData: CreateCommentData): Promise<Comment> {
    try {
      console.log('Creating comment...', { userId, commentData });
      
      const commentDoc = {
        postId: commentData.postId,
        userId,
        content: commentData.content,
        timestamp: Timestamp.now(),
      };

      const docRef = await addDoc(this.commentsCollection, commentDoc);
      console.log('Comment created with ID:', docRef.id);

      // Increment post's comment count
      try {
        await updateDoc(doc(db, 'posts', commentData.postId), {
          commentsCount: increment(1),
        });
        console.log('Post comment count updated');
      } catch (updateError) {
        console.error('Failed to update comment count:', updateError);
        // Don't throw - comment was created successfully
      }

      // Fetch complete comment with author data
      const comment = await this.getCommentById(docRef.id);
      if (!comment) {
        throw new Error('Failed to fetch created comment');
      }

      return comment;
    } catch (error: any) {
      console.error('Error creating comment:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Check Firestore rules.');
      }
      
      throw new Error(error.message || 'Failed to create comment');
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
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      throw new Error(error.message || 'Failed to fetch comments');
    }
  }

  // Get a single comment by ID
  private async getCommentById(commentId: string): Promise<Comment | null> {
    try {
      const commentDoc = await getDoc(doc(db, 'comments', commentId));

      if (!commentDoc.exists()) return null;

      return await this.mapDocumentToComment(commentDoc.id, commentDoc.data());
    } catch (error) {
      console.error('Error fetching comment:', error);
      return null;
    }
  }

  // Map Firestore document to Comment type
  private async mapDocumentToComment(id: string, data: any): Promise<Comment | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', data.userId));

      if (!userDoc.exists()) return null;

      const userData = userDoc.data();

      return {
        id,
        postId: data.postId,
        userId: data.userId,
        content: data.content,
        timestamp: data.timestamp.toDate(),
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
      console.error('Error mapping comment:', error);
      return null;
    }
  }
}

export const commentService = new CommentService();