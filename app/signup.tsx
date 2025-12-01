import { Ionicons, FontAwesome } from '@expo/vector-icons';
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
    SafeAreaView 
} from 'react-native';

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
            <StatusBar style="dark" />
            
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
                            <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                        </TouchableOpacity>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.mainTitle}>Let's Get Started</Text>
                        <Text style={styles.subtitle}>Fill the form to continue</Text>
                    </View>

                    {/* Character Illustration (Preserved) */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.circleContainer}>
                            {/* Using the same image style as Login for consistency */}
                            <Image 
                                source={{ uri: 'https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png?resize=800x600&vertical=center' }}
                                style={styles.illustration}
                                resizeMode="cover"
                            />
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        
                        {/* Name Input (Kept from your code, styled like reference) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Your Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Lucy"
                                placeholderTextColor="#C4C4C4"
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
                                placeholderTextColor="#C4C4C4"
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
                                    placeholderTextColor="#C4C4C4"
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
                                        color="#1A1A1A" 
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Terms of Use Checkbox */}
                        <View style={styles.termsContainer}>
                            <Text style={styles.termsText}>I agree with terms of use</Text>
                            <TouchableOpacity 
                                onPress={() => setAgreed(!agreed)}
                                style={[styles.checkbox, agreed && styles.checkboxChecked]}
                            >
                                {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
                            </TouchableOpacity>
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
                            <Text style={styles.dividerText}>OR</Text>
                        </View>

                        {/* Google Sign Up Button */}
                        <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
                            {/* Using FontAwesome for the G logo, colored manually */}
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
                            <TouchableOpacity onPress={() => router.push('/')}>
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
        backgroundColor: '#FFFFFF',
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
        marginBottom: 20,
        marginTop: 10,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    titleContainer: {
        marginBottom: 20,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#8e8e93',
        fontWeight: '400',
    },
    illustrationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    circleContainer: {
        width: 120, // Smaller than Login to fit content
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5F5F5',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: '100%',
        height: '100%',
    },
    formContainer: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '700', // Bold label as per reference
        color: '#1A1A1A',
        marginBottom: 8,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1A1A1A',
        backgroundColor: '#FFFFFF',
    },
    passwordContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#1A1A1A',
    },
    eyeIcon: {
        padding: 10,
        marginRight: 6,
    },
    termsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 24,
    },
    termsText: {
        fontSize: 14,
        color: '#1A1A1A',
        fontWeight: '700',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#1A1A1A',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1A1A1A',
    },
    signUpButton: {
        backgroundColor: '#1A1A1A', // Black button
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerText: {
        fontSize: 12,
        color: '#666666',
        fontWeight: '600',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        marginBottom: 24,
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    footerText: {
        color: '#8e8e93',
        fontSize: 14,
        fontWeight: '500',
    },
    signInText: {
        color: '#1A1A1A',
        fontSize: 14,
        fontWeight: '700',
    },
});