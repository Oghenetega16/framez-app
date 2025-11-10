import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, ProfileStackParamList } from './types';
import FeedNavigator from './FeedNavigator';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// Profile Stack Navigator
const ProfileNavigator: React.FC = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen 
                name="ProfileScreen" 
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <ProfileStack.Screen 
                name="EditProfile" 
                component={EditProfileScreen}
                options={{ title: 'Edit Profile' }}
            />
            <ProfileStack.Screen 
                name="UserProfile" 
                component={UserProfileScreen}
                options={{ title: 'Profile' }}
            />
            <ProfileStack.Screen 
                name="Comments" 
                component={CommentsScreen}
                options={{ title: 'Comments' }}
            />
        </ProfileStack.Navigator>
    );
};

const MainNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#8E8E93',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5EA',
                    height: Platform.OS === 'ios' ? 88 : 60,
                    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: '#007AFF',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tab.Screen 
                name="FeedTab" 
                component={FeedNavigator}
                options={{
                    title: 'Feed',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons 
                            name={focused ? 'home' : 'home-outline'} 
                            size={size} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tab.Screen 
                name="CreatePost" 
                component={CreatePostScreen}
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons 
                            name={focused ? 'add-circle' : 'add-circle-outline'} 
                            size={size + 4} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tab.Screen 
                name="ProfileTab" 
                component={ProfileNavigator}
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons 
                        name={focused ? 'person' : 'person-outline'} 
                        size={size} 
                        color={color} 
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;