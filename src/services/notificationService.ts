import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification behavior with UPDATED properties
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,      // Shows alert on iOS
        shouldPlaySound: true,      // Plays sound
        shouldSetBadge: true,       // Sets badge count
        shouldShowBanner: true,     // Shows banner notification
        shouldShowList: true,       // Shows in notification list/center
    }),
});

class NotificationService {
    // Register for push notifications
    async registerForPushNotifications(): Promise<string | null> {
        if (!Device.isDevice) {
            console.log('Must use physical device for push notifications');
            return null;
        }

        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('Failed to get push token for push notification!');
                return null;
            }

            // Get project ID from app config
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;

            if (!projectId) {
                console.log('Project ID not found. Push notifications may not work properly.');
                // Still try to get token without project ID for development
            }

            const token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId: projectId,
                })
            ).data;

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            return token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    }

    // Send local notification (for testing)
    async sendLocalNotification(title: string, body: string): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: { data: 'goes here' },
                },
                trigger: {
                    seconds: 1,
                    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // ✅ Explicit type
                    repeats: false, // optional
                },
            });
        } catch (error) {
            console.error('Error sending local notification:', error);
        }
    }

    // Send notification immediately
    async sendImmediateNotification(title: string, body: string): Promise<void> {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: { timestamp: Date.now() },
                },
                trigger: null, // null means send immediately
            });
        } catch (error) {
            console.error('Error sending immediate notification:', error);
        }
    }

    // Listen for notifications
    addNotificationListener(
        callback: (notification: Notifications.Notification) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationReceivedListener(callback);
    }

    // Listen for notification responses (when user taps notification)
    addNotificationResponseListener(
        callback: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    // Remove notification listeners (wrapper method)
    removeNotificationSubscription(subscription: Notifications.Subscription): void {
        subscription.remove();
    }

    // Cancel all scheduled notifications
    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // Get notification permissions status
    async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
        return await Notifications.getPermissionsAsync();
    }

    // Request permissions explicitly
    async requestPermissions(): Promise<boolean> {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            return status === 'granted';
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
            return false;
        }
    }
}

export const notificationService = new NotificationService();