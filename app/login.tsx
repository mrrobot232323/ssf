import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
const dp = require('../assets/images/dp.png');

const { width } = Dimensions.get('window');

// Dark Theme Palette
const theme = {
    background: '#0B0B15',
    textMain: '#FFFFFF',
    textSecondary: '#9CA3AF',
    accent: '#246BFD',
    surface: '#181822',
    inputBg: '#13131A',
    border: '#2A2A35'
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
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button Header */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar Illustration */}
                    <View style={styles.illustrationWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image source={dp} style={styles.avatar} />
                        </View>

                        <View style={styles.ring1} />
                        <View style={styles.ring2} />

                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>
                            Please log in to continue managing your fleet.
                        </Text>
                    </View>

                    {/* Form Area */}
                    <View style={styles.formSection}>

                        {/* Email */}
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

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>

                            <View style={styles.passwordRow}>
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
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color="#AAA"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotWrapper}>
                                <Text style={styles.forgotText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Remember Me */}
                        <View style={styles.rememberRow}>
                            <Text style={styles.rememberText}>Remember me next time</Text>

                            <TouchableOpacity
                                style={[styles.checkbox, rememberMe && styles.checkboxActive]}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                {rememberMe && (
                                    <Ionicons name="checkmark" size={14} color="#FFF" />
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginText}>Log in</Text>
                        </TouchableOpacity>

                        {/* Footer */}
                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>
                                Don't have an account?
                            </Text>

                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.signupText}> Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// -----------------------------------------------------------------------------
// Styles — Updated with UberMove + UberMoveText
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 35
    },

    headerRow: {
        flexDirection: "row",
        marginTop: 12,
        marginBottom: 10
    },

    backButton: {
        padding: 10,
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border
    },

    // Illustration Section
    illustrationWrapper: {
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30
    },

    avatarContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: theme.surface,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: theme.border,
        zIndex: 10
    },

    avatar: {
        width: "100%",
        height: "100%"
    },

    ring1: {
        position: "absolute",
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 1,
        borderColor: "rgba(36,107,253,0.08)"
    },

    ring2: {
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: "rgba(36,107,253,0.05)"
    },

    title: {
        fontSize: 26,
        fontFamily: "UberMove-Bold",
        color: theme.textMain,
        marginTop: 25
    },

    subtitle: {
        fontSize: 14,
        fontFamily: "UberMoveText-Regular",
        color: theme.textSecondary,
        marginTop: 6,
        textAlign: "center",
        paddingHorizontal: 20
    },

    // Form Section
    formSection: {
        marginTop: 10
    },

    inputGroup: {
        marginBottom: 22
    },

    label: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 8,
        fontFamily: "UberMoveText-Medium"
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.inputBg,
        borderRadius: 12,
        paddingHorizontal: 16,
        color: theme.textMain,
        fontSize: 15,
        fontFamily: "UberMoveText-Regular"
    },

    passwordRow: {
        height: 52,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.inputBg,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center"
    },

    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.textMain,
        fontFamily: "UberMoveText-Regular"
    },

    eyeButton: {
        padding: 10,
        marginRight: 8
    },

    forgotWrapper: {
        alignSelf: "flex-end",
        marginTop: 10
    },

    forgotText: {
        color: theme.accent,
        fontSize: 13,
        fontFamily: "UberMoveText-Medium"
    },

    rememberRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
    },

    rememberText: {
        color: theme.textMain,
        fontSize: 14,
        fontFamily: "UberMoveText-Regular"
    },

    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        borderColor: theme.border,
        backgroundColor: theme.inputBg
    },

    checkboxActive: {
        backgroundColor: theme.accent,
        borderColor: theme.accent
    },

    loginButton: {
        height: 56,
        backgroundColor: theme.accent,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 26
    },

    loginText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "UberMove-Bold",
        letterSpacing: 0.3
    },

    footerRow: {
        flexDirection: "row",
        justifyContent: "center"
    },

    footerText: {
        fontSize: 14,
        color: theme.textSecondary,
        fontFamily: "UberMoveText-Regular"
    },

    signupText: {
        fontSize: 14,
        color: theme.textMain,
        fontFamily: "UberMoveText-Medium",
        textDecorationLine: "underline"
    }
});
