import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Comment } from '../types';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

type CommentsScreenRouteProp = RouteProp<{ Comments: { postId: string } }, 'Comments'>;

const CommentsScreen: React.FC = () => {
    const route = useRoute<CommentsScreenRouteProp>();
    const { postId } = route.params;
    const { user } = useAuth();
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = async () => {
        try {
            const fetchedComments = await commentService.getPostComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!commentText.trim() || !user) return;

        try {
            setSubmitting(true);
            await commentService.createComment(user.id, {
                postId,
                content: commentText.trim(),
            });
            setCommentText('');
            await loadComments();
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentItem}>
            <Avatar user={item.author} size={32} />
            <View style={styles.commentContent}>
                <Text style={styles.commentAuthor}>{item.author.name}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <Text style={styles.commentTime}>
                {item.timestamp.toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, submitting && styles.sendButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting || !commentText.trim()}
                >
                    <Text style={styles.sendButtonText}>
                        {submitting ? '...' : 'Post'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    },
    list: {
        padding: 15,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
    },
    commentContent: {
        marginLeft: 10,
        flex: 1,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 18,
    },
    commentTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        maxHeight: 100,
        fontSize: 14,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default CommentsScreen;