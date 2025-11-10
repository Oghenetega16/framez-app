import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { storageService } from '../services/storageService';
import { imageService } from '../services/imageService';

const CreatePostScreen: React.FC = () => {
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!content.trim() && !imageUri) {
            Alert.alert('Error', 'Please add some content or an image');
            return;
        }

        if (!user) {
            Alert.alert('Error', 'You must be logged in to post');
            return;
        }

        try {
            setLoading(true);
            let uploadedImageUrl: string | undefined;

            if (imageUri) {
                // Compress image before upload
                const compressedUri = await imageService.compressImage(imageUri);
                uploadedImageUrl = await storageService.uploadImage(compressedUri, user.id);
            }

            await postService.createPost(user.id, {
                content: content.trim(),
                imageUrl: uploadedImageUrl,
            });

            Alert.alert('Success', 'Post created successfully!');
            setContent('');
            setImageUri(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to create post');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Create a Post</Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="What's on your mind?"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    maxLength={500}
                />

                {imageUri && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setImageUri(null)}
                        >
                            <Text style={styles.removeImageText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Text style={styles.imageButtonText}>
                        {imageUri ? 'Change Image' : 'Add Image'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.postButton, loading && styles.buttonDisabled]}
                    onPress={handlePost}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.postButtonText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 15,
    },
    imagePreview: {
        marginBottom: 15,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 5,
    },
    removeImageText: {
        color: '#fff',
        fontSize: 12,
    },
    imageButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    imageButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    postButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CreatePostScreen;