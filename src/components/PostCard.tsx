import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { likeService } from '../services/likeService';
import Avatar from './Avatar';
import { FeedStackParamList } from '../navigation/types';

interface PostCardProps {
    post: Post;
    onPostUpdate?: () => void;
    onDelete?: () => void;
}

type NavigationProp = NativeStackNavigationProp<FeedStackParamList>;

const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdate, onDelete }) => {
    const { user } = useAuth();
    const navigation = useNavigation<NavigationProp>();
    const [isLiked, setIsLiked] = useState(
        user ? likeService.hasLiked(post, user.id) : false
    );
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if (!user) return;

        if (loading) return;
        setLoading(true);

        try {
            const hasLiked = likeService.hasLiked(post, user.id);

            if (hasLiked) {
                await likeService.unlikePost(user.id, post.id);
                setLikesCount(prev => Math.max(prev - 1, 0)); // never below 0
                setIsLiked(false);
            } else {
                await likeService.likePost(user.id, post.id);
                setLikesCount(prev => prev + 1);
                setIsLiked(true);
            }
            
            onPostUpdate?.();
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserPress = () => {
        if (user && post.userId === user.id) {
            // Navigate to own profile tab
            navigation.navigate('ProfileTab' as any);
        } else {
            // Navigate to other user's profile
            navigation.navigate('UserProfile', { userId: post.userId });
        }
    };

    const handleCommentPress = () => {
        navigation.navigate('Comments', { postId: post.id });
    };

    const formatTimestamp = (date: Date): string => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={handleUserPress}>
                <Avatar user={post.author} size={40} />
                <View style={styles.headerText}>
                    <Text style={styles.authorName}>{post.author.name}</Text>
                    <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
                </View>
            </TouchableOpacity>

            {user && user.id === post.userId && onDelete && (
                <TouchableOpacity 
                    onPress={onDelete}
                    style={styles.moreButton}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
            )}

            {post.content ? (
                <Text style={styles.content}>{post.content}</Text>
            ) : null}

            {post.imageUrl ? (
                <Image source={{ uri: post.imageUrl }} style={styles.image} />
            ) : null}

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Ionicons
                        name={isLiked ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isLiked ? '#FF3B30' : '#333'}
                    />
                    <Text style={styles.actionText}>{likesCount}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={handleCommentPress}>
                    <Ionicons name="chatbubble-outline" size={24} color="#333" />
                    <Text style={styles.actionText}>{post.commentsCount}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        marginLeft: 10,
        flex: 1,
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    moreButton: {
        padding: 8,
    },
    content: {
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginTop: 10,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
});

export default PostCard;