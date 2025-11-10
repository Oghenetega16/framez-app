import { User } from './user.types';

export interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    timestamp: Date;
    author: User;
    likes: string[]; 
    likesCount: number;
    commentsCount: number;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    timestamp: Date;
    author: User;
}

export interface CreatePostData {
    content: string;
    imageUrl?: string;
}

export interface CreateCommentData {
    postId: string;
    content: string;
}