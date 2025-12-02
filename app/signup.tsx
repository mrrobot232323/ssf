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
} from 'react-native';
const dp = require('../assets/images/dp.png');

// Dark Theme Palette
const theme = {
    background: '#0B0B15',
    textMain: '#FFFFFF',
    textSecondary: '#9CA3AF',
    accent: '#246BFD',
    surface: '#181822',
    inputBg: '#13131A',
    border: '#2A2A35',
};

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const handleSignUp = () => {
        if (!email || !password || !name) {
            alert('Please fill all fields');
            return;
        }

        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {/* BACK BUTTON */}
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="arrow-back" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* ILLUSTRATION */}
                    <View style={styles.illustrationWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image source={dp} style={styles.avatar} />
                        </View>

                        <View style={styles.ring1} />
                        <View style={styles.ring2} />

                        <Text style={styles.mainTitle}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join us to manage your fleet efficiently.
                        </Text>
                    </View>

                    {/* FORM */}
                    <View style={styles.form}>
                        {/* NAME */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Lucy"
                                placeholderTextColor="#666"
                                autoCapitalize="words"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* EMAIL */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="divyesh.b@gmail.com"
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        {/* PASSWORD */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Choose a Password</Text>

                            <View style={styles.passwordRow}>
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
                                    style={styles.eyeButton}
                                >
                                    <Ionicons
                                        name={
                                            showPassword
                                                ? 'eye-off-outline'
                                                : 'eye-outline'
                                        }
                                        size={20}
                                        color="#AAA"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* TERMS */}
                        <View style={styles.termsRow}>
                            <TouchableOpacity
                                onPress={() => setAgreed(!agreed)}
                                style={[styles.checkbox, agreed && styles.checkboxChecked]}
                            >
                                {agreed && (
                                    <Ionicons name="checkmark" size={14} color="#FFF" />
                                )}
                            </TouchableOpacity>

                            <Text style={styles.termsText}>
                                I agree with{' '}
                                <Text style={styles.link}>Terms of Use</Text> &{' '}
                                <Text style={styles.link}>Privacy Policy</Text>
                            </Text>
                        </View>

                        {/* SIGN UP BUTTON */}
                        <TouchableOpacity
                            style={styles.signUpButton}
                            onPress={handleSignUp}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.signUpText}>Sign up</Text>
                        </TouchableOpacity>

                        {/* DIVIDER */}
                        <View style={styles.dividerRow}>
                            <View style={styles.line} />
                            <Text style={styles.dividerLabel}>OR</Text>
                            <View style={styles.line} />
                        </View>

                        {/* GOOGLE BUTTON */}
                        <TouchableOpacity
                            style={styles.googleButton}
                            activeOpacity={0.85}
                        >
                            <Image
                                source={{
                                    uri:
                                        'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                                }}
                                style={styles.googleIcon}
                            />

                            <Text style={styles.googleText}>Sign up with Google</Text>
                        </TouchableOpacity>

                        {/* FOOTER */}
                        <View style={styles.footerRow}>
                            <Text style={styles.footerText}>
                                Already have an account?
                            </Text>
                            <TouchableOpacity onPress={() => router.push('/login')}>
                                <Text style={styles.loginLink}> Log in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// -----------------------------------------------------------------------------
// FONTS UPDATED: UberMove-Bold + UberMoveText Regular/Medium everywhere
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },

    headerRow: {
        marginTop: 12,
        marginBottom: 12,
    },

    backButton: {
        padding: 10,
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },

    // ILLUSTRATION
    illustrationWrapper: {
        alignItems: 'center',
        marginBottom: 28,
        marginTop: 10,
    },

    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },

    avatar: { width: '100%', height: '100%' },

    ring1: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: 'rgba(36,107,253,0.08)',
    },

    ring2: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: 'rgba(36,107,253,0.05)',
    },

    mainTitle: {
        fontSize: 26,
        color: theme.textMain,
        marginTop: 25,
        fontFamily: 'UberMove-Bold',
    },

    subtitle: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 6,
        textAlign: 'center',
        fontFamily: 'UberMoveText-Regular',
        paddingHorizontal: 12,
    },

    // FORM
    form: {
        flex: 1,
    },

    inputGroup: { marginBottom: 20 },

    label: {
        color: theme.textSecondary,
        marginBottom: 8,
        fontSize: 14,
        fontFamily: 'UberMoveText-Medium',
    },

    input: {
        height: 52,
        backgroundColor: theme.inputBg,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.textMain,
        fontFamily: 'UberMoveText-Regular',
    },

    passwordRow: {
        height: 52,
        backgroundColor: theme.inputBg,
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        fontSize: 15,
        color: theme.textMain,
        fontFamily: 'UberMoveText-Regular',
    },

    eyeButton: { padding: 10, marginRight: 6 },

    // TERMS
    termsRow: {
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
        backgroundColor: theme.inputBg,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    checkboxChecked: {
        backgroundColor: theme.accent,
        borderColor: theme.accent,
    },

    termsText: {
        color: theme.textSecondary,
        fontSize: 13,
        lineHeight: 20,
        fontFamily: 'UberMoveText-Regular',
        flex: 1,
    },

    link: {
        color: theme.accent,
        fontFamily: 'UberMoveText-Medium',
    },

    // BUTTONS
    signUpButton: {
        height: 56,
        backgroundColor: theme.accent,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },

    signUpText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'UberMove-Bold',
    },

    // DIVIDER
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.border,
    },

    dividerLabel: {
        color: theme.textSecondary,
        fontFamily: 'UberMoveText-Medium',
        fontSize: 12,
        marginHorizontal: 12,
    },

    // GOOGLE BUTTON
    googleButton: {
        flexDirection: 'row',
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 24,
    },

    googleIcon: {
        width: 22,
        height: 22,
        marginRight: 10,
    },

    googleText: {
        color: theme.textMain,
        fontSize: 15,
        fontFamily: 'UberMoveText-Medium',
    },

    // FOOTER
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    footerText: {
        color: theme.textSecondary,
        fontSize: 14,
        fontFamily: 'UberMoveText-Regular',
    },

    loginLink: {
        color: theme.textMain,
        fontSize: 14,
        fontFamily: 'UberMoveText-Medium',
        textDecorationLine: 'underline',
    },
});
