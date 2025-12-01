import React, { useState, useMemo } from 'react';
import { 
  Alert, 
  ScrollView, 
  Share, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  StatusBar,
  SafeAreaView,
  Image,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  CheckCircle2, 
  Wallet,
  TrendingUp,
  Anchor
} from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- MOCK CONTEXT (Replace with your actual import) ---
// import { useApp } from '@/context/AppContext';
const useApp = () => {
    // Mock Data
    const boats = [
        { id: '1', name: 'Sea Spirit', ownerName: 'Derek Doyle', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=1000&auto=format&fit=crop' },
        { id: '2', name: 'Ocean King', ownerName: 'Sarah Smith', image: 'https://images.unsplash.com/photo-1544551763-46a42a461d12?q=80&w=1000&auto=format&fit=crop' },
        { id: '3', name: 'Blue Horizon', ownerName: 'Mike Ross', image: 'https://images.unsplash.com/photo-1516410290616-2e452627e774?q=80&w=1000&auto=format&fit=crop' },
    ];

    // Generating some random transactions over different dates
    const lots = [
        { id: '101', boatId: '1', totalAmount: 50000, commissionAmount: 5000, payableAmount: 45000, timestamp: Date.now() }, // Today
        { id: '102', boatId: '1', totalAmount: 20000, commissionAmount: 2000, payableAmount: 18000, timestamp: Date.now() - 86400000 }, // Yesterday
        { id: '103', boatId: '2', totalAmount: 80000, commissionAmount: 8000, payableAmount: 72000, timestamp: Date.now() }, 
        { id: '104', boatId: '3', totalAmount: 15000, commissionAmount: 1500, payableAmount: 13500, timestamp: Date.now() - 172800000 }, // 2 days ago
        { id: '105', boatId: '1', totalAmount: 100000, commissionAmount: 10000, payableAmount: 90000, timestamp: Date.now() - 604800000 }, // Last week
    ];

    return { lots, boats };
};

export default function WeeklyScreen() {
    const router = useRouter();
    const { lots, boats } = useApp();
    
    // State
    const [selectedBoatId, setSelectedBoatId] = useState<string | null>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    // Local state to track "Settled" status for the UI demo
    const [settledBoats, setSettledBoats] = useState<string[]>([]);

    // --- HELPER: GET START & END OF WEEK ---
    const getWeekRange = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay()); // Sunday
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(end.getDate() + 6); // Saturday
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    // --- CALCULATIONS ---
    const weeklyData = useMemo(() => {
        const { start, end } = getWeekRange(currentDate);
        
        // 1. Filter Lots for current week
        const weeksLots = lots.filter(lot => 
            lot.timestamp >= start.getTime() && lot.timestamp <= end.getTime()
        );

        // 2. Group by Boat
        const stats: Record<string, { revenue: number; commission: number; payable: number; count: number }> = {};
        let totalWeeklyPayable = 0;

        weeksLots.forEach(lot => {
            if (!stats[lot.boatId]) {
                stats[lot.boatId] = { revenue: 0, commission: 0, payable: 0, count: 0 };
            }
            stats[lot.boatId].revenue += lot.totalAmount;
            stats[lot.boatId].commission += lot.commissionAmount;
            stats[lot.boatId].payable += lot.payableAmount;
            stats[lot.boatId].count += 1;
            
            totalWeeklyPayable += lot.payableAmount;
        });

        return { stats, totalWeeklyPayable, start, end };
    }, [currentDate, lots]);

    // --- HANDLERS ---
    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedBoatId(selectedBoatId === id ? null : id);
    };

    const changeWeek = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction * 7));
        setCurrentDate(newDate);
        setSelectedBoatId(null); // Collapse all on week change
    };

    const handleShare = async (boatId: string, boatName: string) => {
        const data = weeklyData.stats[boatId];
        const message = `
📅 *Settlement Report* (${weeklyData.start.toLocaleDateString()} - ${weeklyData.end.toLocaleDateString()})
⛵ *Boat:* ${boatName}

💰 *Gross Revenue:* ₹${data.revenue.toLocaleString()}
🏷️ *Commission:* ₹${data.commission.toLocaleString()}
✅ *Net Payable:* ₹${data.payable.toLocaleString()}

Total Lots: ${data.count}
        `.trim();

        try { await Share.share({ message }); } catch (error) {}
    };

    const handleSettle = (boatId: string) => {
        Alert.alert(
            "Confirm Settlement",
            "Mark this boat as fully paid for the week?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Settle", 
                    onPress: () => {
                        setSettledBoats(prev => [...prev, boatId]);
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    } 
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0B0B15" />
            
            <View style={styles.container}>
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Weekly Settlement</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    
                    {/* --- WEEK NAVIGATOR --- */}
                    <View style={styles.dateNavContainer}>
                        <TouchableOpacity onPress={() => changeWeek(-1)} style={styles.navArrow}>
                            <ChevronLeft size={20} color="#666" />
                        </TouchableOpacity>
                        
                        <View style={styles.dateDisplay}>
                            <Calendar size={16} color="#246BFD" style={{ marginRight: 8 }} />
                            <Text style={styles.dateText}>
                                {weeklyData.start.toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {weeklyData.end.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => changeWeek(1)} style={styles.navArrow}>
                            <ChevronRight size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* --- GRAND TOTAL CARD --- */}
                    <View style={styles.grandTotalCard}>
                        <View>
                            <Text style={styles.grandTotalLabel}>Total Payable This Week</Text>
                            <Text style={styles.grandTotalValue}>₹{weeklyData.totalWeeklyPayable.toLocaleString()}</Text>
                        </View>
                        <View style={styles.grandTotalIcon}>
                            <Wallet size={24} color="#0B0B15" />
                        </View>
                    </View>

                    {/* --- BOAT LIST --- */}
                    {Object.entries(weeklyData.stats).map(([boatId, stats]) => {
                        const boat = boats.find(b => b.id === boatId);
                        const isExpanded = selectedBoatId === boatId;
                        const isSettled = settledBoats.includes(boatId);

                        return (
                            <View key={boatId} style={[styles.card, isSettled && styles.cardSettled]}>
                                {/* Header / Summary */}
                                <TouchableOpacity 
                                    style={styles.cardHeader} 
                                    onPress={() => toggleExpand(boatId)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.cardHeaderLeft}>
                                        <Image source={{ uri: boat?.image }} style={styles.boatAvatar} />
                                        <View>
                                            <Text style={styles.boatName}>{boat?.name}</Text>
                                            <Text style={styles.boatOwner}>{boat?.ownerName}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardHeaderRight}>
                                        <Text style={[styles.payableAmount, isSettled && { color: '#AAA' }]}>
                                            ₹{stats.payable.toLocaleString()}
                                        </Text>
                                        <View style={styles.chevronContainer}>
                                            {isSettled && (
                                                <View style={styles.settledBadge}>
                                                    <CheckCircle2 size={12} color="#93D94E" style={{marginRight: 4}} />
                                                    <Text style={styles.settledText}>PAID</Text>
                                                </View>
                                            )}
                                            {isExpanded ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <View style={styles.cardDetails}>
                                        <View style={styles.detailRow}>
                                            <View style={styles.detailItem}>
                                                <Text style={styles.detailLabel}>Revenue</Text>
                                                <Text style={styles.detailValue}>₹{stats.revenue.toLocaleString()}</Text>
                                            </View>
                                            <View style={styles.detailItem}>
                                                <Text style={styles.detailLabel}>Commission</Text>
                                                <Text style={[styles.detailValue, { color: '#FF575F' }]}>₹{stats.commission.toLocaleString()}</Text>
                                            </View>
                                            <View style={styles.detailItem}>
                                                <Text style={styles.detailLabel}>Lots</Text>
                                                <Text style={styles.detailValue}>{stats.count}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.divider} />

                                        {/* Actions */}
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity 
                                                style={[styles.actionBtn, styles.shareBtn]} 
                                                onPress={() => handleShare(boatId, boat?.name || 'Boat')}
                                            >
                                                <Share2 size={18} color="#FFF" />
                                                <Text style={styles.actionBtnText}>Share Report</Text>
                                            </TouchableOpacity>

                                            {!isSettled && (
                                                <TouchableOpacity 
                                                    style={[styles.actionBtn, styles.settleBtn]} 
                                                    onPress={() => handleSettle(boatId)}
                                                >
                                                    <CheckCircle2 size={18} color="#0B0B15" />
                                                    <Text style={[styles.actionBtnText, { color: '#0B0B15' }]}>Settle</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    {Object.keys(weeklyData.stats).length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Anchor size={40} color="#2A2A35" />
                            <Text style={styles.emptyText}>No transactions this week</Text>
                        </View>
                    )}

                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#0B0B15" },
    container: { flex: 1, backgroundColor: "#0B0B15" },
    
    // Header
    header: { 
        paddingHorizontal: 20, 
        paddingBottom: 20, 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginTop: 30 // Matched margin top
    },
    backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#181822', borderWidth: 1, borderColor: '#2A2A35' },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFF' },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

    // Date Navigator
    dateNavContainer: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        backgroundColor: '#181822', borderRadius: 16, padding: 8, marginBottom: 24,
        borderWidth: 1, borderColor: '#2A2A35'
    },
    navArrow: { padding: 10 },
    dateDisplay: { flexDirection: 'row', alignItems: 'center' },
    dateText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

    // Grand Total Card
    grandTotalCard: {
        backgroundColor: '#93D94E', borderRadius: 20, padding: 20,
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#93D94E', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    grandTotalLabel: { color: '#0B0B15', fontSize: 14, fontWeight: '600', marginBottom: 4 },
    grandTotalValue: { color: '#0B0B15', fontSize: 28, fontWeight: '800' },
    grandTotalIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },

    // Boat Card
    card: { backgroundColor: '#181822', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2A2A35', overflow: 'hidden' },
    cardSettled: { borderColor: 'rgba(147, 217, 78, 0.3)', opacity: 0.8 },
    
    cardHeader: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    boatAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#2A2A35' },
    boatName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    boatOwner: { color: '#AAA', fontSize: 12 },
    
    cardHeaderRight: { alignItems: 'flex-end' },
    payableAmount: { color: '#93D94E', fontSize: 16, fontWeight: '700' },
    chevronContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
    
    settledBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(147, 217, 78, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    settledText: { color: '#93D94E', fontSize: 10, fontWeight: '700' },

    // Expanded Details
    cardDetails: { backgroundColor: '#13131A', padding: 16, borderTopWidth: 1, borderTopColor: '#2A2A35' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
    detailItem: { alignItems: 'center', flex: 1 },
    detailLabel: { color: '#666', fontSize: 12, marginBottom: 4 },
    detailValue: { color: '#FFF', fontSize: 14, fontWeight: '600' },
    
    divider: { height: 1, backgroundColor: '#2A2A35', marginVertical: 16 },

    actionRow: { flexDirection: 'row', gap: 12 },
    actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 12, gap: 8 },
    shareBtn: { backgroundColor: '#2A2A35' },
    settleBtn: { backgroundColor: '#93D94E' },
    actionBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 },

    emptyContainer: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
    emptyText: { color: '#666', marginTop: 12 }
});