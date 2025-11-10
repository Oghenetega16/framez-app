import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { notificationService } from '../services/notificationService';
import { userService } from '../services/userService';
import { Post } from '../types';
import PostCard from '../components/PostCard';

const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserPosts();
        registerPushNotifications();
    }, [user]);

    const loadUserPosts = async () => {
        if (!user) return;

        try {
            const userPosts = await postService.getUserPosts(user.id);
            setPosts(userPosts);
        } catch (error) {
            console.error('Failed to load user posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const registerPushNotifications = async () => {
        if (!user) return;

        const token = await notificationService.registerForPushNotifications();
        if (token) {
            await userService.updatePushToken(user.id, token);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!user) {
        return (
            <View style={styles.centered}>
                <Text>Not logged in</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} onPostUpdate={loadUserPosts} />}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            {user.avatar ? (
                                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        
                        {user.bio ? (
                            <Text style={styles.bio}>{user.bio}</Text>
                        ) : null}

                        <View style={styles.stats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{posts.length}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.followersCount || 0}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.followingCount || 0}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditProfile' as never)}
                            >
                                <Ionicons name="create-outline" size={18} color="#007AFF" />
                                <Text style={styles.editButtonText}>Edit Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={18} color="#fff" />
                                <Text style={styles.logoutText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#007AFF" />
                        </View>
                    ) : (
                        <View style={styles.centered}>
                        <Text style={styles.emptyText}>No posts yet</Text>
                        </View>
                    )
                }
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
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 10,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    bio: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    stats: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
        marginHorizontal: 20,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#ff3b30',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 200,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProfileScreen;