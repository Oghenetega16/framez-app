import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';

type SignupScreenProps = {
    navigation: NativeStackNavigationProp<AuthStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    
    const { signup, loading } = useAuth();

    // Request permission and pick image
    const pickAvatar = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (permissionResult.granted === false) {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photos to set a profile picture.'
                );
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
                setAvatarUri(pickerResult.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const validateName = (name: string): boolean => {
        if (!name.trim()) {
            setNameError('Name is required');
            return false;
        }
        if (name.trim().length < 2) {
            setNameError('Name must be at least 2 characters');
            return false;
        }
        if (name.trim().length > 50) {
            setNameError('Name must be less than 50 characters');
            return false;
        }
        setNameError('');
        return true;
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
        setEmailError('Email is required');
        return false;
        }
        if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email');
        return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = (confirmPassword: string): boolean => {
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    const handleSignup = async () => {
        // Clear previous errors
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validate all inputs
        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
            return;
        }

        try {
            await signup(email.trim().toLowerCase(), password, name.trim(), avatarUri);
            // Navigation handled automatically by AuthContext
            // Note: Avatar upload will be handled in profile editing after signup
        } catch (error) {
            Alert.alert(
                'Signup Failed',
                error instanceof Error ? error.message : 'An error occurred. Please try again.'
            );
        }
    };

    const handleNameChange = (text: string) => {
        setName(text);
        if (nameError) setNameError('');
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (emailError) setEmailError('');
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (passwordError) setPasswordError('');
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (confirmPasswordError) setConfirmPasswordError('');
    };

    const getPasswordStrength = (password: string): { text: string; color: string; progress: number } => {
        if (!password) return { text: '', color: '', progress: 0 };
        
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/(?=.*[a-z])/.test(password)) strength++;
        if (/(?=.*[A-Z])/.test(password)) strength++;
        if (/(?=.*\d)/.test(password)) strength++;
        if (/(?=.*[@$!%*?&])/.test(password)) strength++;

        if (strength <= 2) return { text: 'Weak', color: '#FF3B30', progress: 0.33 };
        if (strength <= 4) return { text: 'Medium', color: '#FF9500', progress: 0.66 };
        return { text: 'Strong', color: '#34C759', progress: 1 };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join Framez today</Text>
                </View>

                {/* Avatar Picker */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        style={styles.avatarContainer}
                        onPress={pickAvatar}
                        disabled={loading}
                    >
                        {avatarUri ? (
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="camera" size={32} color="#fff" />
                        </View>
                        )}
                        <View style={styles.avatarBadge}>
                            <Ionicons name="add" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarText}>Add Profile Photo</Text>
                    <Text style={styles.avatarSubtext}>(Optional)</Text>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    {/* Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={[styles.inputWrapper, nameError && styles.inputError]}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={handleNameChange}
                                autoCapitalize="words"
                                autoComplete="name"
                                editable={!loading}
                            />
                            {name.length > 0 && !nameError && (
                                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                            )}
                        </View>
                        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={handleEmailChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                autoComplete="email"
                                editable={!loading}
                            />
                            {email.length > 0 && !emailError && (
                                <Ionicons name="checkmark-circle" size={20} color="#34C759" />
                            )}
                        </View>
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
                                value={password}
                                onChangeText={handlePasswordChange}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="password"
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {passwordError ? (
                        <Text style={styles.errorText}>{passwordError}</Text>
                        ) : password.length > 0 ? (
                        <View style={styles.passwordStrengthContainer}>
                            <View style={styles.passwordStrengthBar}>
                                <View
                                    style={[
                                    styles.passwordStrengthFill,
                                    { width: `${passwordStrength.progress * 100}%`, backgroundColor: passwordStrength.color },
                                    ]}
                                />
                            </View>
                            <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                            {passwordStrength.text}
                            </Text>
                        </View>
                        ) : null}
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={[styles.inputWrapper, confirmPasswordError && styles.inputError]}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                                editable={!loading}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                        {confirmPasswordError ? (
                        <Text style={styles.errorText}>{confirmPasswordError}</Text>
                        ) : confirmPassword.length > 0 && password === confirmPassword ? (
                        <View style={styles.matchContainer}>
                            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                            <Text style={styles.matchText}>Passwords match</Text>
                        </View>
                        ) : null}
                    </View>

                    {/* Terms and Conditions */}
                    <View style={styles.termsContainer}>
                        <Text style={styles.termsText}>
                            By signing up, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms of Service</Text>
                            {' '}and{' '}
                            <Text style={styles.termsLink}>Privacy Policy</Text>
                        </Text>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                        <ActivityIndicator color="#fff" />
                        ) : (
                        <>
                            <Text style={styles.buttonText}>Create Account</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Login Link */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.linkContainer}
                        disabled={loading}
                    >
                        <Text style={styles.linkText}>
                            Already have an account?{' '}
                            <Text style={styles.linkTextBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
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
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
    },
    avatarSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 12,
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    eyeIcon: {
        padding: 8,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    passwordStrengthContainer: {
        marginTop: 8,
    },
    passwordStrengthBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 4,
    },
    passwordStrengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    passwordStrengthText: {
        fontSize: 12,
        fontWeight: '600',
    },
    matchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginLeft: 4,
    },
    matchText: {
        fontSize: 12,
        color: '#34C759',
        marginLeft: 4,
        fontWeight: '500',
    },
    termsContainer: {
        marginVertical: 20,
    },
    termsText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#007AFF',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    linkContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    linkText: {
        color: '#666',
        fontSize: 14,
    },
    linkTextBold: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default SignupScreen;