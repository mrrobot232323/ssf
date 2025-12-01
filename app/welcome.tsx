import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

// Defined theme colors matching the reference image (White/Black aesthetic)
const theme = {
    background: '#FFFFFF',    // Pure White
    textMain: '#1A1A1A',      // Almost Black
    textSecondary: '#666666', // Grey for "Already have an account?"
    accent: '#1C1C1E',        // Dark/Black for the button
    surface: '#F5F5F5',       // Light grey for the circle background
};

export default function Welcome() {
    return (
        <View style={styles.container}>
            {/* Status bar set to dark so icons (time, battery) show on white bg */}
            <StatusBar style="dark" />

            <View style={styles.contentContainer}>
                {/* Character Illustration Section */}
                <View style={styles.characterContainer}>
                    {/* Glow circle removed */}
                    <View style={styles.circleContainer}>
                        <Image
              source={{ uri: 'https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png?resize=800x600&vertical=center' }}                            style={styles.characterImage}
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Text & Action Section */}
                <View>
                    {/* Heading */}
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Catch. Record</Text>
                        <Text style={styles.heading}> Settle..</Text>
                    </View>

                    {/* Get Started Button - Styled as a black pill */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>

                    {/* Footer - Styled with grey text and bold/underlined link */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/')}>
                            <Text style={styles.signInText}>Sign in</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 32,
        // Reduced paddingTop to move everything up
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'flex-start',
    },
    characterContainer: {
        alignItems: 'center',
        position: 'relative',
        height: 280,
        justifyContent: 'center',
        marginBottom: 10,
    },
    circleContainer: {
        width: 220,
        height: 220,
        borderRadius: 110,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        zIndex: 2,
    },
    characterImage: {
        width: '100%',
        height: '100%',
    },
    headingContainer: {
        marginTop: 190,
        // marginBottom removed as requested
        alignItems: 'center',
         marginBottom: 20,
    },
    heading: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.textMain,
        textAlign: 'center',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    button: {
        backgroundColor: theme.accent, // Black background
        paddingVertical: 18,
        borderRadius: 30, // Pill shape
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        color: '#FFFFFF', // White text
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: theme.textSecondary, // Grey
        fontSize: 15,
        fontWeight: '400',
    },
    signInText: {
        color: theme.textMain, // Black
        fontSize: 15,
        fontWeight: '700', // Bold
        textDecorationLine: 'underline', // Underlined
    },
});