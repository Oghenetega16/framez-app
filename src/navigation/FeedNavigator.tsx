import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedStackParamList } from './types';
import FeedScreen from '../screens/FeedScreen';
import CommentsScreen from '../screens/CommentsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

const Stack = createNativeStackNavigator<FeedStackParamList>();

const FeedNavigator: React.FC = () => {
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
                name="FeedScreen" 
                component={FeedScreen}
                options={{ 
                    title: 'Framez',
                    headerLargeTitle: true,
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
            <Stack.Screen 
                name="UserProfile" 
                component={UserProfileScreen}
                options={{ 
                    title: 'Profile',
                }}
            />
        </Stack.Navigator>
    );
};

export default FeedNavigator;