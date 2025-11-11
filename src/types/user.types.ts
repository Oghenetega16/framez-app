export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string | null;
    bio?: string
    createdAt: Date;
    followers: string[]; 
    following: string[]; 
    followersCount: number;
    followingCount: number;
    pushToken?: string | null; 
}

export interface UserProfile extends User {
    postsCount: number;
}

export interface UpdateProfileData {
    name?: string;
    bio?: string;
    avatar?: string;
}