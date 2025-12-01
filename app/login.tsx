import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
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

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);

    const handleLogin = () => {
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header: Back Arrow Only */}
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
                            {/* Decorative Rings */}
                            <View style={styles.ring1} />
                            <View style={styles.ring2} />
                        </View>
                        <Text style={styles.titleText}>Welcome Back!</Text>
                        <Text style={styles.subtitleText}>Please log in to continue managing your fleet.</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        
                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
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
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="● ● ● ● ● ● ● ●"
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
                            
                            {/* Forgot Password */}
                            <TouchableOpacity style={styles.forgotPasswordContainer}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Remember Me Row */}
                        <View style={styles.rememberMeContainer}>
                            <Text style={styles.rememberMeText}>Remember me next time</Text>
                            <TouchableOpacity 
                                onPress={() => setRememberMe(!rememberMe)}
                                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                            >
                                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity 
                            style={styles.loginButton} 
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>Log in</Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.signUpText}>Sign up</Text>
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
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: theme.surface,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.border,
        zIndex: 5,
        elevation: 10,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        marginBottom: 20,
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    ring1: {
        position: 'absolute',
        width: '120%',
        height: '120%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(36, 107, 253, 0.1)',
        zIndex: -1,
    },
    ring2: {
        position: 'absolute',
        width: '145%',
        height: '145%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: 'rgba(36, 107, 253, 0.05)',
        zIndex: -2,
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.textMain,
        marginBottom: 6,
    },
    subtitleText: {
        fontSize: 14,
        color: theme.textSecondary,
        textAlign: 'center',
    },

    // Form
    formContainer: {
        flex: 1,
        marginTop: 10,
    },
    inputGroup: {
        marginBottom: 20,
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
    
    // Forgot Password
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 12,
    },
    forgotPasswordText: {
        fontSize: 13,
        color: theme.accent,
        fontWeight: '600',
    },
    
    // Remember Me
    rememberMeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    rememberMeText: {
        fontSize: 14,
        color: theme.textMain,
        fontWeight: '500',
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
    },
    checkboxChecked: {
        backgroundColor: theme.accent,
        borderColor: theme.accent,
    },
    
    // Buttons
    loginButton: {
        backgroundColor: theme.accent,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: theme.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    signUpText: {
        color: theme.textMain, 
        fontSize: 14,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});