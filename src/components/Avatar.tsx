import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User } from '../types';

interface AvatarProps {
    user: User;
    size?: number;
    onPress?: () => void;
    showBadge?: boolean;
    badgeColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
    user, 
    size = 40, 
    onPress,
    showBadge = false,
    badgeColor = '#34C759',
}) => {
    const styles = createStyles(size);
    
    // Get initials from name
    const getInitials = (name: string): string => {
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Generate consistent color from user ID
    const getColorFromId = (id: string): string => {
        const colors = [
            '#007AFF', // Blue
            '#FF3B30', // Red
            '#34C759', // Green
            '#FF9500', // Orange
            '#5856D6', // Purple
            '#FF2D55', // Pink
            '#5AC8FA', // Teal
            '#FFCC00', // Yellow
            '#AF52DE', // Violet
            '#32ADE6', // Sky Blue
        ];
        
        // Simple hash function
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    };

    const backgroundColor = getColorFromId(user.id);

    const content = (
        <View style={styles.container}>
            {user.avatar ? (
                <Image 
                    source={{ uri: user.avatar }} 
                    style={styles.avatar}
                    defaultSource={require('../../assets/default-avatar.jpg') as any}
                />
            ) : (
                <View style={[styles.placeholder, { backgroundColor }]}>
                    <Text style={styles.placeholderText}>
                        {getInitials(user.name)}
                    </Text>
                </View>
            )}
            
            {showBadge && (
                <View style={[styles.badge, { backgroundColor: badgeColor }]} />
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const createStyles = (size: number) =>
    StyleSheet.create({
        container: {
            position: 'relative',
            width: size,
            height: size,
        },
        avatar: {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#f0f0f0',
        },
        placeholder: {
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        placeholderText: {
            color: '#fff',
            fontSize: size / 2.5,
            fontWeight: 'bold',
        },
        badge: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size / 4,
            height: size / 4,
            borderRadius: size / 8,
            borderWidth: 2,
            borderColor: '#fff',
        },
    });

export default Avatar;