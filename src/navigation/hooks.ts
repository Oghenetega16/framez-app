import { useNavigation as useRNNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { 
    RootStackParamList, 
    AuthStackParamList, 
    MainTabParamList,
    FeedStackParamList,
    ProfileStackParamList 
} from './types';

// Type-safe navigation hooks
export const useRootNavigation = () => {
    return useRNNavigation<NativeStackNavigationProp<RootStackParamList>>();
};

export const useAuthNavigation = () => {
    return useRNNavigation<NativeStackNavigationProp<AuthStackParamList>>();
};

export const useFeedNavigation = () => {
    return useRNNavigation<NativeStackNavigationProp<FeedStackParamList>>();
};

export const useProfileNavigation = () => {
    return useRNNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
};