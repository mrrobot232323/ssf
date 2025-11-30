import Colors from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DailyScreen() {
    const { lots, boats } = useApp();

    // Filter for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    const todaysLots = lots.filter(lot => lot.timestamp >= startOfDay);

    // Calculate Totals
    const totalRevenue = todaysLots.reduce((sum, lot) => sum + lot.totalAmount, 0);
    const totalCommission = todaysLots.reduce((sum, lot) => sum + lot.commissionAmount, 0);
    const totalPayable = todaysLots.reduce((sum, lot) => sum + lot.payableAmount, 0);

    // Group by Species
    const speciesStats: Record<string, { weight: number; amount: number; count: number }> = {};
    todaysLots.forEach(lot => {
        if (!speciesStats[lot.species]) {
            speciesStats[lot.species] = { weight: 0, amount: 0, count: 0 };
        }
        speciesStats[lot.species].weight += lot.weight;
        speciesStats[lot.species].amount += lot.totalAmount;
        speciesStats[lot.species].count += 1;
    });

    const handleShare = async () => {
        const message = `
📅 *Daily Summary - ${new Date().toDateString()}*

💰 Revenue: ₹${totalRevenue.toLocaleString()}
🏷️ Commission: ₹${totalCommission.toLocaleString()}
💵 Payable: ₹${totalPayable.toLocaleString()}

*Species Breakdown:*
${Object.entries(speciesStats).map(([name, stats]) =>
            `- ${name}: ${stats.weight}kg (₹${stats.amount.toLocaleString()})`
        ).join('\n')}

Total Lots: ${todaysLots.length}
    `.trim();

        try {
            await Share.share({
                message,
            });
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Daily Summary</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <FontAwesome name="whatsapp" size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            {/* Top Cards */}
            <View style={styles.cardsContainer}>
                <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
                    <Text style={styles.cardLabel}>Revenue</Text>
                    <Text style={styles.cardValue}>₹{totalRevenue.toLocaleString()}</Text>
                </View>
                <View style={[styles.card, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={styles.cardLabel}>Payable</Text>
                    <Text style={[styles.cardValue, { color: Colors.light.success }]}>
                        ₹{totalPayable.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Species Breakdown */}
            <Text style={styles.sectionTitle}>Species Breakdown</Text>
            <View style={styles.listContainer}>
                {Object.entries(speciesStats).map(([name, stats]) => (
                    <View key={name} style={styles.listItem}>
                        <View>
                            <Text style={styles.itemTitle}>{name}</Text>
                            <Text style={styles.itemSubtitle}>{stats.count} lots • {stats.weight} kg</Text>
                        </View>
                        <Text style={styles.itemAmount}>₹{stats.amount.toLocaleString()}</Text>
                    </View>
                ))}
                {Object.keys(speciesStats).length === 0 && (
                    <Text style={styles.emptyText}>No data for today</Text>
                )}
            </View>

            {/* Detailed List */}
            <Text style={styles.sectionTitle}>Lot Details</Text>
            <View style={styles.listContainer}>
                {todaysLots.map((lot) => {
                    const boat = boats.find(b => b.id === lot.boatId);
                    return (
                        <View key={lot.id} style={styles.listItem}>
                            <View>
                                <Text style={styles.itemTitle}>{boat?.name}</Text>
                                <Text style={styles.itemSubtitle}>{lot.species} • {lot.weight}kg @ ₹{lot.pricePerUnit}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.itemAmount}>₹{lot.totalAmount.toLocaleString()}</Text>
                                <Text style={styles.itemCommission}>Comm: ₹{lot.commissionAmount.toLocaleString()}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    shareButton: {
        backgroundColor: '#25D366',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    card: {
        width: '48%',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    cardLabel: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    listContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCommission: {
        fontSize: 12,
        color: '#999',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        paddingVertical: 10,
    },
});
