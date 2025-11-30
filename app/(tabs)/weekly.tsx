import Colors from '@/constants/Colors';
import { useApp } from '@/context/AppContext';
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WeeklyScreen() {
    const { lots, boats } = useApp();
    const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);

    // Group lots by boat
    const boatStats: Record<string, { revenue: number; commission: number; payable: number; count: number }> = {};

    lots.forEach(lot => {
        if (!boatStats[lot.boatId]) {
            boatStats[lot.boatId] = { revenue: 0, commission: 0, payable: 0, count: 0 };
        }
        boatStats[lot.boatId].revenue += lot.totalAmount;
        boatStats[lot.boatId].commission += lot.commissionAmount;
        boatStats[lot.boatId].payable += lot.payableAmount;
        boatStats[lot.boatId].count += 1;
    });

    const handleShare = async (boatId: string) => {
        const boat = boats.find(b => b.id === boatId);
        const stats = boatStats[boatId];

        const message = `
📅 *Weekly Settlement*
⛵ Boat: ${boat?.name}

💰 Revenue: ₹${stats.revenue.toLocaleString()}
🏷️ Commission: ₹${stats.commission.toLocaleString()}
💵 *Payable: ₹${stats.payable.toLocaleString()}*

Total Lots: ${stats.count}
    `.trim();

        try {
            await Share.share({ message });
        } catch (error) {
            Alert.alert('Error', (error as Error).message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Weekly Settlement</Text>
            </View>

            {Object.entries(boatStats).map(([boatId, stats]) => {
                const boat = boats.find(b => b.id === boatId);
                const isExpanded = selectedBoatId === boatId;

                return (
                    <View key={boatId} style={styles.card}>
                        <TouchableOpacity
                            style={styles.cardHeader}
                            onPress={() => setSelectedBoatId(isExpanded ? null : boatId)}
                        >
                            <View>
                                <Text style={styles.boatName}>{boat?.name}</Text>
                                <Text style={styles.boatOwner}>{boat?.ownerName}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.payableAmount}>₹{stats.payable.toLocaleString()}</Text>
                                <Text style={styles.payableLabel}>Payable</Text>
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={styles.cardDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Revenue</Text>
                                    <Text style={styles.detailValue}>₹{stats.revenue.toLocaleString()}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Commission</Text>
                                    <Text style={styles.detailValue}>₹{stats.commission.toLocaleString()}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Total Lots</Text>
                                    <Text style={styles.detailValue}>{stats.count}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.whatsappButton}
                                    onPress={() => handleShare(boatId)}
                                >
                                    <FontAwesome name="whatsapp" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.whatsappText}>Send Report</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                );
            })}

            {Object.keys(boatStats).length === 0 && (
                <Text style={styles.emptyText}>No data available for settlement</Text>
            )}
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
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    boatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    boatOwner: {
        fontSize: 14,
        color: '#666',
    },
    payableAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.success,
    },
    payableLabel: {
        fontSize: 12,
        color: '#999',
    },
    cardDetails: {
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    whatsappButton: {
        backgroundColor: '#25D366',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    whatsappText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
    },
});
