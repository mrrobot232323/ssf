import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const theme = {
    background: '#0B0B15',
    textMain: '#FFFFFF',
    textSecondary: '#9CA3AF',
    accent: '#246BFD',
    surface: '#181822',
    border: '#2A2A35',
};

const highlights = [
    {
        title: 'Smart Tracking',
        subtitle: 'Monitor every boat, lot, and payout in real time.',
    },
    {
        title: 'Actionable Insights',
        subtitle: 'Understand revenue, commission, and goals at a glance.',
    },
    {
        title: 'Crew Collaboration',
        subtitle: 'Keep everyone aligned with updates that matter.',
    },
];

export default function Welcome() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{
                                uri: 'https://cdn.dribbble.com/userupload/41849246/file/original-942c6a9ffac280bfc04190f0a60f3771.png',
                            }}
                            style={styles.heroImage}
                        />
                        <View style={styles.ringPrimary} />
                        <View style={styles.ringSecondary} />
                    </View>
<Text style={styles.kicker}>Welcome to Aqua Ledger</Text>

<Text style={styles.title}>Your auction ledger, fully under control.</Text>

<Text style={styles.subtitle}>
Create lots, track commissions, and manage settlements with a modern,
transparent ledger built for coastal fish auctions.
</Text>

                </View>

                <View style={styles.card}>
                    {highlights.map((item) => (
                        <View key={item.title} style={styles.highlightRow}>
                            <View style={styles.bullet} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.highlightTitle}>{item.title}</Text>
                                <Text style={styles.highlightSubtitle}>{item.subtitle}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.push('/login')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryText}>Get Started</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push('/signup')}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryText}>Create a free account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace('/(tabs)')}
                    style={styles.skipButton}
                    activeOpacity={0.8}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 40,
    },
    hero: {
        alignItems: 'center',
        marginBottom: 32,
    },
    imageWrapper: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 24,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    ringPrimary: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 1,
        borderColor: 'rgba(36,107,253,0.12)',
    },
    ringSecondary: {
        position: 'absolute',
        width: 210,
        height: 210,
        borderRadius: 105,
        borderWidth: 1,
        borderColor: 'rgba(36,107,253,0.06)',
    },
    kicker: {
        fontSize: 13,
        letterSpacing: 1,
        color: theme.textSecondary,
        textTransform: 'uppercase',
        fontFamily: 'UberMoveText-Medium',
    },
    title: {
        fontSize: 30,
        color: theme.textMain,
        textAlign: 'center',
        marginTop: 12,
        fontFamily: 'UberMove-Bold',
    },
    subtitle: {
        fontSize: 15,
        color: theme.textSecondary,
        textAlign: 'center',
        marginTop: 12,
        fontFamily: 'UberMoveText-Regular',
        lineHeight: 22,
    },
    card: {
        backgroundColor: theme.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 28,
    },
    highlightRow: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 18,
        alignItems: 'flex-start',
    },
    bullet: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.accent,
        marginTop: 6,
    },
    highlightTitle: {
        color: theme.textMain,
        fontSize: 16,
        fontFamily: 'UberMoveText-Medium',
    },
    highlightSubtitle: {
        color: theme.textSecondary,
        fontSize: 13,
        fontFamily: 'UberMoveText-Regular',
        marginTop: 4,
        lineHeight: 20,
    },
    primaryButton: {
        height: 56,
        borderRadius: 18,
        backgroundColor: theme.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    primaryText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'UberMove-Bold',
    },
    secondaryButton: {
        height: 54,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#11111A',
        marginBottom: 12,
    },
    secondaryText: {
        color: theme.textMain,
        fontSize: 15,
        fontFamily: 'UberMoveText-Medium',
    },
    skipButton: {
        alignSelf: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    skipText: {
        color: theme.textSecondary,
        fontSize: 13,
        fontFamily: 'UberMoveText-Regular',
        textDecorationLine: 'underline',
    },
});
