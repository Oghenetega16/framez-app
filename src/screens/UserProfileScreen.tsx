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
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { postService } from '../services/postService';
import { followService } from '../services/followService';
import { User, Post } from '../types';
import PostCard from '../components/PostCard';

type UserProfileRouteProp = RouteProp<{ UserProfile: { userId: string } }, 'UserProfile'>;

const UserProfileScreen: React.FC = () => {
    const route = useRoute<UserProfileRouteProp>();
    const { userId } = route.params;
    const { user: currentUser } = useAuth();
    
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [userId]);

    const loadProfile = async () => {
        try {
        const user = await userService.getUserById(userId);
        setProfileUser(user);
        
        if (user && currentUser) {
            setIsFollowing(followService.isFollowing(currentUser, userId));
        }

        const userPosts = await postService.getUserPosts(userId);
        setPosts(userPosts);
        } catch (error) {
        console.error('Failed to load profile:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleFollowToggle = async () => {
        if (!currentUser || !profileUser) return;

        try {
            if (isFollowing) {
                await followService.unfollowUser(currentUser.id, userId);
            } else {
                await followService.followUser(currentUser.id, userId);
            }
            setIsFollowing(!isFollowing);
            await loadProfile();
        } catch (error) {
            console.error('Failed to toggle follow:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (!profileUser) {
        return (
            <View style={styles.centered}>
                <Text>User not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} onPostUpdate={loadProfile} />}
                ListHeaderComponent={
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        {profileUser.avatar ? (
                            <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarText}>
                                    {profileUser.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.name}>{profileUser.name}</Text>
                    <Text style={styles.email}>{profileUser.email}</Text>
                    
                    {profileUser.bio ? (
                        <Text style={styles.bio}>{profileUser.bio}</Text>
                    ) : null}

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{posts.length}</Text>
                            <Text style={styles.statLabel}>Posts</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileUser.followersCount}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{profileUser.followingCount}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </View>
                    </View>

                    {currentUser && currentUser.id !== userId && (
                        <TouchableOpacity
                            style={[
                            styles.followButton,
                            isFollowing && styles.followingButton,
                            ]}
                            onPress={handleFollowToggle}
                        >
                            <Text style={[
                                styles.followButtonText,
                                isFollowing && styles.followingButtonText,
                                ]}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            ListEmptyComponent={
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No posts yet</Text>
            </View>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    followButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    followingButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    followButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    followingButtonText: {
        color: '#007AFF',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default UserProfileScreen;