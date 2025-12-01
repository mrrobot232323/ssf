import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router'; // Import Stack
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View, 
    Image,
    SafeAreaView,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

// Dark Theme Palette
const theme = {
    background: '#0B0B15',    // Main Dark Background
    textMain: '#FFFFFF',      // White
    textSecondary: '#9CA3AF', // Cool Grey
    accent: '#246BFD',        // AquaLedger Blue
    surface: '#181822',       // Card/Surface Color
    inputBg: '#13131A',       // Slightly darker for inputs
    border: '#2A2A35'         // Border Color
};

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSignUp = () => {
        if (!email || !password) {
            alert("Please fill in all fields");
            return;
        }
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 1. Hide the Default Header */}
            <Stack.Screen options={{ headerShown: false }} />
            
            <StatusBar style="light" />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header: Back Arrow */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Illustration Area */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.circleContainer}>
                            <Image 
                                source={{ uri: 'https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png?resize=800x600&vertical=center' }}
                                style={styles.illustration}
                                resizeMode="cover"
                            />
                            <View style={styles.ring1} />
                            <View style={styles.ring2} />
                        </View>
                        <Text style={styles.mainTitle}>Create Account</Text>
                        <Text style={styles.subtitle}>Join us to manage your fleet efficiently.</Text>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        
                        {/* Name Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Lucy"
                                placeholderTextColor="#666"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="divyesh.b@gmail.com"
                                placeholderTextColor="#666"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Choose a Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="min. 8 characters"
                                    placeholderTextColor="#666"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                        size={20} 
                                        color="#AAA" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms of Use Checkbox */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity 
                                onPress={() => setAgreed(!agreed)}
                                style={[styles.checkbox, agreed && styles.checkboxChecked]}
                            >
                                {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </TouchableOpacity>
                            <Text style={styles.termsText}>
                                I agree with <Text style={styles.linkText}>Terms of Use</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
                            </Text>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity 
                            style={styles.signUpButton} 
                            onPress={handleSignUp}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signUpButtonText}>Sign up</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Sign Up Button */}
                        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
                            <Image 
                                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png' }}
                                style={styles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.googleButtonText}>Sign up with Google</Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.signInText}>Log in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    keyboardView: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },
    
    // Illustration
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    circleContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.surface,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 20,
        zIndex: 5,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    ring1: {
        position: 'absolute',
        width: '125%',
        height: '125%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(36, 107, 253, 0.1)',
        zIndex: -1,
    },
    ring2: {
        position: 'absolute',
        width: '150%',
        height: '150%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(36, 107, 253, 0.05)',
        zIndex: -2,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.textMain,
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: theme.textSecondary,
        fontWeight: '400',
    },

    // Form
    formContainer: {
        flex: 1,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.textSecondary,
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.textMain,
        backgroundColor: theme.inputBg,
    },
    passwordContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.inputBg,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.textMain,
    },
    eyeIcon: {
        padding: 10,
        marginRight: 6,
    },
    
    // Terms
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: theme.border,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.inputBg,
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: theme.accent,
        borderColor: theme.accent,
    },
    termsText: {
        fontSize: 13,
        color: theme.textSecondary,
        flex: 1,
        lineHeight: 20,
    },
    linkText: {
        color: theme.accent,
        fontWeight: '600',
    },

    // Buttons
    signUpButton: {
        backgroundColor: theme.accent,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    
    // Divider
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border,
    },
    dividerText: {
        fontSize: 12,
        color: theme.textSecondary,
        fontWeight: '600',
        marginHorizontal: 16,
    },

    // Google Button
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 16,
        backgroundColor: theme.surface,
        marginBottom: 24,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: theme.textMain,
        fontSize: 15,
        fontWeight: '600',
    },
    
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    footerText: {
        color: theme.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    signInText: {
        color: theme.textMain, 
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});