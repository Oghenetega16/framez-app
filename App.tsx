import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { notificationService } from './src/services/notificationService';

export default function App() {
    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        // Register for push notifications
        notificationService.registerForPushNotifications();

        // Listen for incoming notifications
        notificationListener.current = notificationService.addNotificationListener(
            (notification) => {
                console.log('Notification received:', notification);
            }
        );

        // Listen for notification interactions
        responseListener.current = notificationService.addNotificationResponseListener(
            (response) => {
                console.log('Notification tapped:', response);
                // Handle navigation based on notification data
            }
        );

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    return (
        <SafeAreaProvider>
            <AuthProvider>
                <AppNavigator />
                <StatusBar style="auto" />
            </AuthProvider>
        </SafeAreaProvider>
    );
}