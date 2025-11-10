import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    RefreshControl,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Post } from '../types';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

const FeedScreen: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load posts when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadPosts();
        }, [])
    );

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setError(null);
            const fetchedPosts = await postService.getAllPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Failed to load posts:', error);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPosts();
        setRefreshing(false);
    };

    const handleDeletePost = async (postId: string) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await postService.deletePost(postId);
                            setPosts(posts.filter(post => post.id !== postId));
                            Alert.alert('Success', 'Post deleted successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to delete post');
                        }
                    },
                },
            ]
        );
    };

    const renderPost = ({ item }: { item: Post }) => (
        <PostCard 
            post={item} 
            onPostUpdate={loadPosts}
            onDelete={user?.id === item.userId ? () => handleDeletePost(item.id) : undefined}
        />
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Framez</Text>
            <Text style={styles.headerSubtitle}>Share your moments</Text>
        </View>
    );

    const renderEmpty = () => {
        if (loading) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading posts...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
        <View style={styles.centered}>
            <Ionicons name="images-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share something!</Text>
        </View>
        );
    };

    const renderFooter = () => {
        if (loading && posts.length > 0) {
        return (
            <View style={styles.footer}>
            <ActivityIndicator size="small" color="#007AFF" />
            </View>
        );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh}
                        tintColor="#007AFF"
                        colors={['#007AFF']}
                    />
                }
                ListHeaderComponent={posts.length > 0 ? renderHeader : null}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}
                contentContainerStyle={posts.length === 0 ? styles.emptyContainer : null}
                showsVerticalScrollIndicator={false}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF3B30',
        marginTop: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default FeedScreen;