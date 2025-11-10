import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack (Auth vs Main)
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
};

// Auth Stack (Login/Signup)
export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

// Main Tab Navigator (Bottom tabs)
export type MainTabParamList = {
    FeedTab: undefined;
    CreatePost: undefined;
    ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Feed Stack (includes Comments screen accessible from Feed)
export type FeedStackParamList = {
    FeedScreen: undefined;
    Comments: { postId: string };
    UserProfile: { userId: string };
};

// Profile Stack (Profile screens)
export type ProfileStackParamList = {
    ProfileScreen: undefined;
    EditProfile: undefined;
    UserProfile: { userId: string };
    Comments: { postId: string };
};

// Type helper for navigation props
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}