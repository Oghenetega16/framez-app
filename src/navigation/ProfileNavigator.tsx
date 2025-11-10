import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen 
                name="ProfileScreen" 
                component={ProfileScreen}
                options={{ 
                    title: 'My Profile',
                }}
            />
            <Stack.Screen 
                name="EditProfile" 
                component={EditProfileScreen}
                options={{ 
                    title: 'Edit Profile',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen 
                name="UserProfile" 
                component={UserProfileScreen}
                options={{ 
                    title: 'Profile',
                }}
            />
            <Stack.Screen 
                name="Comments" 
                component={CommentsScreen}
                options={{ 
                    title: 'Comments',
                    presentation: 'modal',
                }}
            />
        </Stack.Navigator>
    );
};

export default ProfileNavigator;