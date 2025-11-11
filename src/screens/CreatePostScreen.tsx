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
import { Ionicons } from '@expo/vector-icons';
import { MediaTypeOptions } from 'expo-image-picker';

const CreatePostScreen: React.FC = () => {
    const [content, setContent] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const pickImage = async () => {
        try {
            // Request permission first
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photos to add images.'
                );
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            console.log('Picker result:', pickerResult);

            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                setImageUri(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
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
                console.log('Compressing image...');
                // Compress image before upload
                const compressedUri = await imageService.compressImage(imageUri);
                console.log('Uploading image...');
                uploadedImageUrl = await storageService.uploadImage(compressedUri, user.id);
                console.log('Image uploaded:', uploadedImageUrl);
            }

            console.log('Creating post...');
            await postService.createPost(user.id, {
                content: content.trim(),
                imageUrl: uploadedImageUrl,
            });

            Alert.alert('Success', 'Post created successfully!');
            setContent('');
            setImageUri(null);
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create post');
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
                    editable={!loading}
                />

                <Text style={styles.charCount}>{content.length}/500</Text>

                {imageUri && (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => setImageUri(null)}
                            disabled={loading}
                        >
                            <Ionicons name="close-circle" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.imageButton} 
                    onPress={pickImage}
                    disabled={loading}
                >
                    <Ionicons 
                        name={imageUri ? "images" : "image-outline"} 
                        size={20} 
                        color="#007AFF" 
                    />
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
                        <>
                            <Text style={styles.postButtonText}>Post</Text>
                            <Ionicons name="send" size={18} color="#fff" />
                        </>
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
        marginBottom: 8,
    },
    charCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#666',
        marginBottom: 15,
    },
    imagePreview: {
        marginBottom: 15,
        position: 'relative',
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
    },
    imageButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    postButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
});

export default CreatePostScreen;