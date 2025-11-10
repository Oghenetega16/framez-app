import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
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
                name="Login" 
                component={LoginScreen}
                options={{ 
                title: 'Welcome to Framez',
                headerShown: false,
                }}
            />
            <Stack.Screen 
                name="Signup" 
                component={SignupScreen}
                options={{ 
                title: 'Create Account',
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;